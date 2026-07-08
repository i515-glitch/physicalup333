import os
import sys
import json
import uvicorn
from datetime import datetime

# Add parent directory to sys.path to allow running as script directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load env variables manually from .env if it exists
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip()

import webbrowser
from threading import Timer
from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
from typing import List, Optional

from app.engine import calculate_biocode
from app.chart import generate_five_elements_chart, generate_target_comparison_chart, generate_growth_history_chart
from app.ocr import parse_inbody_image

# Environment settings for Server Migration
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))
SERVER_MODE = os.environ.get("SERVER_MODE", "false").lower() in ("true", "1", "t", "y", "yes")
PLAYWRIGHT_SERVER_URL = os.environ.get("PLAYWRIGHT_SERVER_URL", f"http://127.0.0.1:{PORT}")

app = FastAPI(title="Physical Up 333 Analysis System")

# Define request schemas
class AnalysisRequest(BaseModel):
    name: str
    gender: str
    birth_date: str
    birth_time: Optional[str] = ""
    grade: str
    sports: str
    position: Optional[str] = ""
    phone: Optional[str] = ""
    father_height: Optional[float] = 173.0
    mother_height: Optional[float] = 160.0
    current_height: float
    current_weight: float
    body_fat: Optional[float] = None
    skeletal_muscle: Optional[float] = None
    wingspan: Optional[float] = None
    inbody_file: Optional[str] = ""
    survey_responses: List[int]
    is_free: Optional[bool] = False
    reservation_date: Optional[str] = None

# Static files mapping
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

# Endpoints
@app.post("/api/analyze")
def analyze_specs(request: AnalysisRequest):
    try:
        # 1. Perform BioCode and gap calculation
        result = calculate_biocode(request.dict())
        
        # 2. Generate charts
        # Five elements chart
        five_elem_dict = result["five_elements"]
        five_elem_chart = generate_five_elements_chart(five_elem_dict)
        
        # Target comparison chart
        # Determine target specs based on sports and gender
        # (Using KBO pitcher target: 184cm / 85kg / SMM 42.5kg as default for baseball)
        sports = request.sports
        gender = request.gender
        
        if sports == "야구" and gender == "남":
            target_specs = {"신장": 184.0, "체중": 85.0, "골격근량": 42.5}
        elif sports == "축구" and gender == "남":
            target_specs = {"신장": 178.0, "체중": 72.0, "골격근량": 36.0}
        elif gender == "남":
            target_specs = {"신장": 180.0, "체중": 75.0, "골격근량": 37.5}
        else: # 여아 기본
            target_specs = {"신장": 168.0, "체중": 58.0, "골격근량": 26.0}
            
        curr_muscle = request.skeletal_muscle
        if curr_muscle is None:
            curr_muscle = 0.0
            
        current_specs = {
            "신장": request.current_height,
            "체중": request.current_weight,
            "골격근량": curr_muscle
        }
        
        comparison_chart = generate_target_comparison_chart(current_specs, target_specs)
        
        # Add charts to the result
        result["chart_five_elements"] = five_elem_chart
        result["chart_comparison"] = comparison_chart
        result["target_specs"] = target_specs
        
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ocr")
async def ocr_inbody(file: UploadFile = File(...)):
    try:
        import uuid
        uploads_dir = os.path.join(STATIC_DIR, "uploads")
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
            
        ext = os.path.splitext(file.filename)[1]
        if not ext:
            ext = ".png"
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(uploads_dir, filename)
        
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)
            
        file_url = f"/static/uploads/{filename}"
        
        ocr_result = parse_inbody_image(content)
        ocr_result["file_url"] = file_url
        return ocr_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ================= ONLINE AUTOMATION PIPELINE ENDPOINTS =================

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
REQUESTS_DIR = os.path.join(DATA_DIR, "requests")
REPORTS_DIR = os.path.join(DATA_DIR, "reports")

for directory in [DATA_DIR, REQUESTS_DIR, REPORTS_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

from app.ai_writer import generate_ai_comment, ai_double_check_comment
from app.pdf_generator import generate_pdf
from app.mailer import send_report_email
import uuid
import time
import threading

class ApprovalRequest(BaseModel):
    id: str
    email: str
    comment: str
    scheduled_at: Optional[float] = None
    inspected_by: Optional[str] = "representative"

class CancelScheduleRequest(BaseModel):
    id: str

def start_scheduler():
    def scheduler_loop():
        print("[Scheduler] Background scheduler thread started.")
        while True:
            try:
                time.sleep(10)  # 10 seconds check interval
                if not os.path.exists(REQUESTS_DIR):
                    continue
                
                current_time_ms = time.time() * 1000
                for filename in os.listdir(REQUESTS_DIR):
                    if filename.endswith(".json"):
                        file_path = os.path.join(REQUESTS_DIR, filename)
                        try:
                            with open(file_path, "r", encoding="utf-8") as f:
                                req_data = json.load(f)
                            
                            if req_data.get("status") == "Scheduled":
                                is_completed = req_data.get("is_completed", False)
                                scheduled_at = req_data.get("scheduled_at", 0)
                                if scheduled_at > 0 and current_time_ms >= scheduled_at:
                                    req_id = req_data.get("id")
                                    if is_completed:
                                        # Load approval mode from config
                                        approval_mode = "ai"
                                        if os.path.exists(CONFIG_FILE):
                                            try:
                                                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                                                    config_data = json.load(f)
                                                    approval_mode = config_data.get("approval_mode", "ai")
                                            except:
                                                pass
                                                
                                        if approval_mode == "ai":
                                            email = req_data.get("phone")  # override recipient email
                                            comment = req_data.get("ai_comment", "")
                                            print(f"[Scheduler] Processing scheduled send (AI mode) for {req_data.get('name')} ({req_id})")
                                            
                                            process_approval_and_send(req_id, email, comment)
                                            print(f"[Scheduler] Successfully sent scheduled report for {req_data.get('name')}")
                                        else:
                                            # 대표 검수: 자동 발송을 차단하고 대표 검수 대기(ReviewNeeded)로 상태 전환
                                            req_data["status"] = "ReviewNeeded"
                                            with open(file_path, "w", encoding="utf-8") as f:
                                                json.dump(req_data, f, indent=4, ensure_ascii=False)
                                            print(f"[Scheduler] Reservation {req_data.get('name')} ({req_id}) transitioned to 'ReviewNeeded' for Representative review.")
                                    else:
                                        # 예약일이 되었으나 상세 정보 미입력으로 발송 누락 처리 -> Incomplete로 상태 전환
                                        req_data["status"] = "Incomplete"
                                        with open(file_path, "w", encoding="utf-8") as f:
                                            json.dump(req_data, f, indent=4, ensure_ascii=False)
                                        print(f"[Scheduler] Reservation {req_data.get('name')} ({req_id}) is incomplete on send date. Changed status to 'Incomplete'.")
                        except Exception as ex:
                            # Ignore errors in single file read/process so loop continues
                            pass
            except Exception as e:
                print(f"[Scheduler] Loop error: {e}")
                
    t = threading.Thread(target=scheduler_loop, daemon=True)
    t.start()

# Start scheduler thread immediately
start_scheduler()

CONFIG_FILE = os.path.join(DATA_DIR, "reservation_config.json")

def check_duplicate_application(name: str, birth_date: str, phone: str):
    """
    Check if the same student has submitted more than 10 requests.
    """
    if not os.path.exists(REQUESTS_DIR):
        return False
        
    match_count = 0
    for filename in os.listdir(REQUESTS_DIR):
        if filename.endswith(".json"):
            file_path = os.path.join(REQUESTS_DIR, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                # Match student unique identity
                if (data.get("name") == name and 
                    data.get("birth_date") == birth_date and 
                    data.get("phone") == phone):
                    match_count += 1
                    
                if match_count >= 10:
                    return True
            except:
                pass
    return False

class ReservationConfig(BaseModel):
    daily_limit: int
    send_time_type: str  # "next_day_10", "custom_time", "instant"
    custom_send_time: str  # "10:00", "14:30" 등
    approval_mode: str  # "ai" vs "representative"

@app.get("/api/admin/config")
def get_reservation_config():
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            return {
                "daily_limit": data.get("daily_limit", 50),
                "send_time_type": data.get("send_time_type", "next_day_10"),
                "custom_send_time": data.get("custom_send_time", "10:00"),
                "approval_mode": data.get("approval_mode", "ai")
            }
        else:
            return {
                "daily_limit": 50,
                "send_time_type": "next_day_10",
                "custom_send_time": "10:00",
                "approval_mode": "ai"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/config")
def update_reservation_config(config: ReservationConfig):
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        time_parts = config.custom_send_time.split(":")
        if len(time_parts) != 2 or not all(p.isdigit() for p in time_parts):
            raise HTTPException(status_code=400, detail="시간 형식이 올바르지 않습니다. (예: 10:00)")
            
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(config.dict(), f, indent=4, ensure_ascii=False)
        return {"message": "설정이 성공적으로 저장되었습니다."}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/online/available-dates")
def get_available_dates():
    from datetime import datetime, timedelta
    try:
        daily_limit = 50
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                config_data = json.load(f)
                daily_limit = config_data.get("daily_limit", 50)
        
        # Scan data/requests for scheduled counts
        scheduled_counts = {}
        if os.path.exists(REQUESTS_DIR):
            for filename in os.listdir(REQUESTS_DIR):
                if filename.endswith(".json"):
                    file_path = os.path.join(REQUESTS_DIR, filename)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            data = json.load(f)
                        if data.get("status") in ["Scheduled", "Approved"]:
                            sched_at = data.get("scheduled_at", 0)
                            if sched_at > 0:
                                sched_dt = datetime.fromtimestamp(sched_at / 1000)
                                date_str = sched_dt.strftime("%Y-%m-%d")
                                scheduled_counts[date_str] = scheduled_counts.get(date_str, 0) + 1
                    except:
                        pass
        
        # Generate next 14 days
        result = []
        start_date = datetime.now()
        for _ in range(14):
            date_str = start_date.strftime("%Y-%m-%d")
            booked = scheduled_counts.get(date_str, 0)
            remaining = max(0, daily_limit - booked)
            result.append({
                "date": date_str,
                "booked": booked,
                "remaining": remaining,
                "is_available": remaining > 0
            })
            start_date += timedelta(days=1)
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/online/apply")
def online_apply(request: AnalysisRequest):
    """
    Endpoint for online survey & InBody applications.
    Computes standard BioCode, triggers AI draft comments, and saves as pending or scheduled.
    """
    from datetime import datetime, timedelta
    try:
        status = "Pending"
        is_completed = False
        
        # Determine if data is fully completed (for scheduling / reports)
        if (request.current_height > 0 and 
            request.current_weight > 0 and 
            len(request.survey_responses) == 24):
            is_completed = True
            
        # 1. Load Global Config for limit and send time settings
        daily_limit = 50
        send_time_type = "next_day_10"
        custom_send_time = "10:00"
        
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    config_data = json.load(f)
                    daily_limit = config_data.get("daily_limit", 50)
                    send_time_type = config_data.get("send_time_type", "next_day_10")
                    custom_send_time = config_data.get("custom_send_time", "10:00")
            except:
                pass

        # 2. 예약 카운팅을 위한 사전 스캔
        scheduled_counts = {}
        if os.path.exists(REQUESTS_DIR):
            for filename in os.listdir(REQUESTS_DIR):
                if filename.endswith(".json"):
                    file_path = os.path.join(REQUESTS_DIR, filename)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            d = json.load(f)
                        if d.get("status") in ["Scheduled", "Approved"]:
                            sched_at = d.get("scheduled_at", 0)
                            if sched_at > 0:
                                sched_dt = datetime.fromtimestamp(sched_at / 1000)
                                date_str = sched_dt.strftime("%Y-%m-%d")
                                scheduled_counts[date_str] = scheduled_counts.get(date_str, 0) + 1
                    except:
                        pass

        # 3. 오늘부터 시작해서 하루 발송 정원이 남은 첫 번째 날짜 탐색 (자동 선착순 예약 배정)
        search_date = datetime.now()
        found_date = None
        
        for _ in range(90):  # 최대 90일 뒤까지 탐색
            date_str = search_date.strftime("%Y-%m-%d")
            if scheduled_counts.get(date_str, 0) < daily_limit:
                found_date = date_str
                break
            search_date += timedelta(days=1)
            
        if not found_date:
            raise HTTPException(status_code=400, detail="현재 모든 예약 정원이 마감되었습니다. 관리자에게 문의해 주세요.")
            
        assigned_date = found_date

        if request.is_free:
            status = "Free"
            scheduled_at = 0
            assigned_date = datetime.now().strftime("%Y-%m-%d")
        else:
            # 4. 중복 신청 제한 검증 (이름 + 생년월일 + 연락처 기준 최대 10회 제한)
            if check_duplicate_application(request.name, request.birth_date, request.phone):
                raise HTTPException(
                    status_code=400, 
                    detail="해당 학생(또는 연락처)으로 신청할 수 있는 최대 횟수(10회)를 초과하였습니다."
                )
                
            status = "Scheduled"
            
            # 5. 발송 예정 타임스탬프 (scheduled_at) 연산
            if send_time_type == "next_day_10":
                # 배정일 다음 날 오전 10:00
                assigned_dt = datetime.strptime(assigned_date, "%Y-%m-%d")
                next_day_dt = assigned_dt + timedelta(days=1)
                dt = datetime.strptime(f"{next_day_dt.strftime('%Y-%m-%d')} 10:00:00", "%Y-%m-%d %H:%M:%S")
                scheduled_at = dt.timestamp() * 1000
            elif send_time_type == "custom_time":
                # 배정일 지정 시간
                dt = datetime.strptime(f"{assigned_date} {custom_send_time}:00", "%Y-%m-%d %H:%M:%S")
                scheduled_at = dt.timestamp() * 1000
            else: # "instant"
                # 즉시 발송 대기열 전송 (1분 후 발송 처리)
                scheduled_at = (time.time() * 1000) + 60 * 1000

        # Calculate BioCode only if completed, otherwise skip AI comment draft
        ai_comment = ""
        biocode = ""
        constitution = ""
        if is_completed:
            try:
                result = calculate_biocode(request.dict())
                biocode = result.get("biocode", "")
                constitution = result.get("constitution", "")
                if not request.is_free:
                    ai_comment = generate_ai_comment(
                        student_name=request.name,
                        biocode=biocode,
                        constitution=constitution,
                        height_gap=result["height_gap"],
                        lag_cause=result["lag_cause"],
                        sports=request.sports
                    )
            except:
                pass

        req_id = str(uuid.uuid4())
        req_data = {
            "id": req_id,
            "status": status,
            "is_completed": is_completed,
            "timestamp": time.time() * 1000,
            "ai_comment": ai_comment,
            "biocode": biocode,
            "constitution": constitution,
            **request.dict()
        }
        req_data["scheduled_at"] = scheduled_at
        # Store original assigned date inside data
        req_data["reservation_date"] = assigned_date
            
        file_path = os.path.join(REQUESTS_DIR, f"{req_id}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(req_data, f, indent=4, ensure_ascii=False)
            
        return {
            "success": True, 
            "id": req_id, 
            "status": status,
            "is_completed": is_completed,
            "assigned_date": assigned_date,
            "scheduled_at": scheduled_at,
            "message": "신청이 완료되었습니다." if request.is_free else "예약이 가장 빠른 날짜로 자동으로 완료되었습니다."
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/online/webhook")
def online_webhook(request: AnalysisRequest, x_api_key: Optional[str] = Header(None)):
    """
    홈페이지 및 카카오톡 챗봇 연동 등을 위한 통합 접수 웹훅 API.
    X-API-Key 헤더 인증(기본값: 'physicalup333secret')을 포함합니다.
    """
    expected_key = "physicalup333secret"
    if x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="유효하지 않은 X-API-Key 헤더입니다. 외부 연동 권한이 없습니다.")
    return online_apply(request)

@app.get("/api/admin/requests")
def get_admin_requests():
    """
    Lists all pending/approved requests sorted by timestamp descending.
    """
    requests_list = []
    if os.path.exists(REQUESTS_DIR):
        for filename in os.listdir(REQUESTS_DIR):
            if filename.endswith(".json"):
                file_path = os.path.join(REQUESTS_DIR, filename)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        req_data = json.load(f)
                        requests_list.append(req_data)
                except:
                    pass
    # Sort descending by timestamp
    requests_list.sort(key=lambda x: x.get("timestamp", 0), reverse=True)
    return requests_list

def process_approval_and_send(req_id: str, email: str, comment: str, inspected_by: str = "representative"):
    """
    Core function to process approval: updates request state, generates PDF,
    and sends report via email. Can be called immediately or via scheduler.
    """
    req_file = os.path.join(REQUESTS_DIR, f"{req_id}.json")
    if not os.path.exists(req_file):
        raise FileNotFoundError(f"Request {req_id} not found.")

    # 1. Load original request
    with open(req_file, "r", encoding="utf-8") as f:
        req_data = json.load(f)

    # 3. Calculate final BioCode and data
    result = calculate_biocode(req_data)

    # [최종 발송 전 AI 2차 검수 강제화] 대표자 수정본/AI초안 불론 최종 오탈자 교열 실행
    final_comment = ai_double_check_comment(
        student_name=req_data.get("name"),
        biocode=result["biocode"],
        constitution=result["constitution"],
        height=req_data.get("current_height"),
        weight=req_data.get("current_weight"),
        muscle=req_data.get("skeletal_muscle"),
        fat=req_data.get("body_fat"),
        original_comment=comment
    )

    # 2. Update with manager comments, email, status and inspected_by
    req_data["status"] = "Approved"
    req_data["ai_comment"] = final_comment
    req_data["inspected_by"] = inspected_by
    req_data["phone"] = email  # override recipient email

    # Determine target specs
    sports = req_data.get("sports", "야구")
    gender = req_data.get("gender", "남")
    if sports == "야구" and gender == "남":
        target_specs = {"신장": 184.0, "체중": 85.0, "골격근량": 42.5}
    elif sports == "축구" and gender == "남":
        target_specs = {"신장": 178.0, "체중": 72.0, "골격근량": 36.0}
    elif gender == "남":
        target_specs = {"신장": 180.0, "체중": 75.0, "골격근량": 37.5}
    else:
        target_specs = {"신장": 168.0, "체중": 58.0, "골격근량": 26.0}

    curr_muscle = req_data.get("skeletal_muscle")
    if curr_muscle is None:
        curr_muscle = 0.0
        
    current_specs = {
        "신장": req_data.get("current_height"),
        "체중": req_data.get("current_weight"),
        "골격근량": curr_muscle
    }

    # Generate chart images via matplotlib
    five_elem_chart = generate_five_elements_chart(result["five_elements"])
    comparison_chart = generate_target_comparison_chart(current_specs, target_specs)
    
    # 3.1. Gather past Approved history for Growth Curve
    history_list = []
    name = req_data.get("name")
    birth_date = req_data.get("birth_date")
    phone = req_data.get("phone")
    
    if os.path.exists(REQUESTS_DIR):
        for filename in os.listdir(REQUESTS_DIR):
            if filename.endswith(".json") and filename != f"{req_id}.json":
                file_path = os.path.join(REQUESTS_DIR, filename)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        past_data = json.load(f)
                    
                    if (past_data.get("status") == "Approved" and 
                        past_data.get("name") == name and 
                        past_data.get("birth_date") == birth_date and 
                        past_data.get("phone") == phone):
                        
                        past_time_ms = past_data.get("timestamp", 0)
                        if past_data.get("scheduled_at"):
                            past_time_ms = past_data.get("scheduled_at")
                        
                        past_dt = datetime.fromtimestamp(past_time_ms / 1000)
                        h = past_data.get("current_height", 0)
                        w = past_data.get("current_weight", 0)
                        if h > 0 and w > 0:
                            history_list.append({
                                "date": past_dt.strftime("%Y-%m-%d"),
                                "height": h,
                                "weight": w
                            })
                except:
                    pass
                    
    # Add current specs to history
    curr_time_ms = req_data.get("scheduled_at") or req_data.get("timestamp") or (time.time() * 1000)
    curr_dt = datetime.fromtimestamp(curr_time_ms / 1000)
    history_list.append({
        "date": curr_dt.strftime("%Y-%m-%d"),
        "height": req_data.get("current_height"),
        "weight": req_data.get("current_weight")
    })
    
    # Generate growth history chart
    growth_history_chart = generate_growth_history_chart(history_list)

    # Assemble complete analysis packet to be injected into report.html
    result["chart_five_elements"] = five_elem_chart
    result["chart_comparison"] = comparison_chart
    result["chart_growth_history"] = growth_history_chart
    result["history_count"] = len(history_list)
    result["target_specs"] = target_specs
    result["ai_comment"] = comment
    result["inputs"] = req_data

    # Save updated request file
    with open(req_file, "w", encoding="utf-8") as f:
        json.dump(req_data, f, indent=4, ensure_ascii=False)

    # 4. Generate A4 PDF using Playwright
    pdf_filename = f"PU333_Report_{req_data['name']}_{int(time.time())}.pdf"
    output_pdf_path = os.path.join(REPORTS_DIR, pdf_filename)

    generate_pdf(result, output_pdf_path, server_url=PLAYWRIGHT_SERVER_URL)

    # 5. Email PDF to customer
    email_success = send_report_email(email, req_data['name'], output_pdf_path)

    # 6. Kakao Alimtalk sending to customer
    phone_number = req_data.get("phone", "")
    alimtalk_success = False
    if phone_number:
        base_url = os.environ.get("BASE_PUBLIC_URL", f"http://127.0.0.1:{PORT}")
        report_url = f"{base_url}/static/report.html?id={req_id}"
        from app.notifier import send_kakao_alimtalk
        try:
            alimtalk_success = send_kakao_alimtalk(
                to_phone=phone_number,
                student_name=req_data['name'],
                biocode=result["biocode"],
                report_url=report_url
            )
        except Exception as e:
            print(f"[Notifier] Error sending Kakao Alimtalk on approval: {e}")

    return {
        "success": True,
        "email_sent": email_success,
        "alimtalk_sent": alimtalk_success,
        "pdf_path": output_pdf_path
    }

@app.post("/api/admin/approve")
def approve_request(approval: ApprovalRequest):
    """
    Approves or schedules a request.
    If approval.scheduled_at is provided and in the future, it schedules it.
    Otherwise, it runs immediate approval processing.
    """
    req_file = os.path.join(REQUESTS_DIR, f"{approval.id}.json")
    if not os.path.exists(req_file):
        raise HTTPException(status_code=404, detail="Request not found.")

    try:
        current_time_ms = time.time() * 1000
        
        # Check if it is a scheduled request
        if approval.scheduled_at and approval.scheduled_at > current_time_ms:
            with open(req_file, "r", encoding="utf-8") as f:
                req_data = json.load(f)
                
            req_data["status"] = "Scheduled"
            req_data["scheduled_at"] = approval.scheduled_at
            req_data["ai_comment"] = approval.comment
            req_data["inspected_by"] = approval.inspected_by or "representative"
            req_data["phone"] = approval.email  # store scheduled email address
            
            with open(req_file, "w", encoding="utf-8") as f:
                json.dump(req_data, f, indent=4, ensure_ascii=False)
                
            return {
                "success": True,
                "message": "보고서 발송 예약이 성공적으로 완료되었습니다.",
                "scheduled": True,
                "scheduled_at": approval.scheduled_at
            }
        
        # Immediate processing
        res = process_approval_and_send(
            approval.id, 
            approval.email, 
            approval.comment, 
            inspected_by=approval.inspected_by or "representative"
        )
        return {
            "success": True,
            "message": "Report approved, PDF generated, and dispatch completed.",
            "email_sent": res["email_sent"],
            "alimtalk_sent": res["alimtalk_sent"],
            "pdf_path": res["pdf_path"]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/cancel-schedule")
def cancel_scheduled_request(cancel_req: CancelScheduleRequest):
    req_file = os.path.join(REQUESTS_DIR, f"{cancel_req.id}.json")
    if not os.path.exists(req_file):
        raise HTTPException(status_code=404, detail="Request not found.")
    try:
        with open(req_file, "r", encoding="utf-8") as f:
            req_data = json.load(f)
        
        if req_data.get("status") != "Scheduled":
            raise HTTPException(status_code=400, detail="예약 대기 상태가 아닙니다.")
            
        req_data["status"] = "Pending"
        if "scheduled_at" in req_data:
            del req_data["scheduled_at"]
            
        with open(req_file, "w", encoding="utf-8") as f:
            json.dump(req_data, f, indent=4, ensure_ascii=False)
            
        return {"success": True, "message": "예약이 취소되고 대기 상태로 변경되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class UpdateReservationRequest(BaseModel):
    id: str
    phone: str
    current_height: float
    current_weight: float
    body_fat: Optional[float] = None
    skeletal_muscle: Optional[float] = None
    survey_responses: List[int]

@app.post("/api/online/update-data")
def update_reservation_data(update_req: UpdateReservationRequest):
    """
    사후에 신청자가 예약 ID를 전달하여 상세 성장 정보 및 설문 답변을 입력/업데이트하는 API.
    부정확한 데이터 입력을 방지하기 위해 body_fat, skeletal_muscle은 필수값입니다.
    """
    req_file = os.path.join(REQUESTS_DIR, f"{update_req.id}.json")
    if not os.path.exists(req_file):
        raise HTTPException(status_code=404, detail="예약 내역을 찾을 수 없습니다. 예약 ID를 다시 확인해 주세요.")
        
    try:
        with open(req_file, "r", encoding="utf-8") as f:
            req_data = json.load(f)
            
        # 보안 인증: 휴대폰 번호 매칭 체크 (공백/하이픈 제거 후 비교)
        db_phone = "".join(filter(str.isdigit, req_data.get("phone", "")))
        req_phone = "".join(filter(str.isdigit, update_req.phone))
        
        if db_phone != req_phone:
            raise HTTPException(status_code=401, detail="입력하신 휴대폰 번호가 예약 당시의 연락처와 일치하지 않습니다.")
            
        if len(update_req.survey_responses) != 24:
            raise HTTPException(status_code=400, detail="설문조사 문항(24문항)의 답변이 누락되었습니다.")
            
        # 데이터 업데이트
        req_data["current_height"] = update_req.current_height
        req_data["current_weight"] = update_req.current_weight
        req_data["body_fat"] = update_req.body_fat
        req_data["skeletal_muscle"] = update_req.skeletal_muscle
        req_data["survey_responses"] = update_req.survey_responses
        req_data["is_completed"] = True
        
        # BioCode 재계산 및 AI 코멘트 초안 작성
        result = calculate_biocode(req_data)
        ai_comment = generate_ai_comment(
            student_name=req_data.get("name"),
            biocode=result["biocode"],
            constitution=result["constitution"],
            height_gap=result["height_gap"],
            lag_cause=result["lag_cause"],
            sports=req_data.get("sports", "야구")
        )
        
        # [AI 2차 검수] 생성 직후 의무적 2차 최종 교열 기동 및 inspected_by 초기화
        final_comment = ai_double_check_comment(
            student_name=req_data.get("name"),
            biocode=result["biocode"],
            constitution=result["constitution"],
            height=req_data.get("current_height"),
            weight=req_data.get("current_weight"),
            muscle=req_data.get("skeletal_muscle"),
            fat=req_data.get("body_fat"),
            original_comment=ai_comment
        )
        req_data["ai_comment"] = final_comment
        req_data["inspected_by"] = "ai"
        
        with open(req_file, "w", encoding="utf-8") as f:
            json.dump(req_data, f, indent=4, ensure_ascii=False)
            
        return {
            "success": True,
            "message": "상세 건강 정보 입력이 완료되었습니다. 예약일에 맞추어 보고서가 발송될 예정입니다."
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/online/reservation/search")
def search_reservation_by_name_phone(name: str, phone: str):
    """
    신청자가 사후에 이름과 연락처를 입력하여 본인의 예약 정보(예약 ID, 상태, 데이터 완료 여부 등)를 조회할 수 있는 API.
    복잡한 예약 ID 입력을 제거하고 이름 + 연락처 매칭으로 예약을 찾습니다.
    """
    from datetime import datetime
    if not os.path.exists(REQUESTS_DIR):
        raise HTTPException(status_code=404, detail="등록된 신청 내역이 전혀 존재하지 않습니다.")
        
    cleaned_req_phone = "".join(filter(str.isdigit, phone))
    cleaned_req_name = name.strip()
    
    if not cleaned_req_name or not cleaned_req_phone:
        raise HTTPException(status_code=400, detail="이름과 연락처를 올바르게 입력해 주세요.")
        
    found_reservations = []
    for filename in os.listdir(REQUESTS_DIR):
        if filename.endswith(".json"):
            file_path = os.path.join(REQUESTS_DIR, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                db_phone = "".join(filter(str.isdigit, data.get("phone", "")))
                db_name = data.get("name", "").strip()
                
                if db_name == cleaned_req_name and db_phone == cleaned_req_phone:
                    sched_at_ms = data.get("scheduled_at", 0)
                    reservation_date_str = ""
                    if sched_at_ms > 0:
                        sched_dt = datetime.fromtimestamp(sched_at_ms / 1000)
                        reservation_date_str = sched_dt.strftime("%Y-%m-%d")
                    
                    found_reservations.append({
                        "id": data.get("id"),
                        "name": data.get("name"),
                        "status": data.get("status"),
                        "is_completed": data.get("is_completed", False),
                        "reservation_date": reservation_date_str,
                        "sports": data.get("sports"),
                        "timestamp": data.get("timestamp", 0)
                    })
            except:
                pass
                
    if not found_reservations:
        raise HTTPException(status_code=404, detail="입력하신 이름과 연락처에 매칭되는 예약 내역을 찾을 수 없습니다. 정보를 다시 확인해 주세요.")
        
    # 최신 신청 내역 순으로 정렬
    found_reservations.sort(key=lambda x: x["timestamp"], reverse=True)
    return found_reservations[0]


@app.get("/api/online/reservation/{req_id}")
def get_reservation_status(req_id: str, phone: str):
    """
    신청자가 사후에 본인의 예약 정보(이름, 예약일, 데이터 완료 여부 등)를 조회할 수 있는 API.
    휴대폰 번호 매칭을 통해 최소한의 인증을 수행합니다.
    """
    from datetime import datetime
    req_file = os.path.join(REQUESTS_DIR, f"{req_id}.json")
    if not os.path.exists(req_file):
        raise HTTPException(status_code=404, detail="예약 내역을 찾을 수 없습니다. 예약 ID를 다시 확인해 주세요.")
        
    try:
        with open(req_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        # 연락처 비교 (보안 인증)
        db_phone = "".join(filter(str.isdigit, data.get("phone", "")))
        req_phone = "".join(filter(str.isdigit, phone))
        
        if db_phone != req_phone:
            raise HTTPException(status_code=401, detail="입력하신 휴대폰 번호가 예약 당시의 연락처와 일치하지 않습니다.")
            
        # 예약일 타임스탬프를 문자열로 변환
        sched_at_ms = data.get("scheduled_at", 0)
        reservation_date_str = ""
        if sched_at_ms > 0:
            sched_dt = datetime.fromtimestamp(sched_at_ms / 1000)
            reservation_date_str = sched_dt.strftime("%Y-%m-%d")
            
        return {
            "id": data.get("id"),
            "name": data.get("name"),
            "status": data.get("status"),
            "is_completed": data.get("is_completed", False),
            "reservation_date": reservation_date_str,
            "sports": data.get("sports")
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/report/{req_id}")
def get_report_data(req_id: str):
    """
    보호자가 발송받은 고유 링크(req_id)를 통해 분석 결과를 실시간으로 가져오는 API.
    """
    req_file = os.path.join(REQUESTS_DIR, f"{req_id}.json")
    if not os.path.exists(req_file):
        raise HTTPException(status_code=404, detail="요청하신 리포트 데이터를 찾을 수 없습니다.")
    try:
        with open(req_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Toss Payments Integration ──────────────────────────────────────────────────
class TossPrepareRequest(BaseModel):
    orderId: str
    request: AnalysisRequest

PENDING_TOSS_DIR = os.path.join(DATA_DIR, "pending_toss")
os.makedirs(PENDING_TOSS_DIR, exist_ok=True)

@app.post("/api/payment/toss/prepare")
def toss_prepare(req: TossPrepareRequest):
    """
    Saves a pending analysis request linked to a Toss orderId before redirection.
    """
    try:
        file_path = os.path.join(PENDING_TOSS_DIR, f"{req.orderId}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(req.request.dict(), f, ensure_ascii=False, indent=2)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/payment/toss/success")
def toss_success(paymentKey: str, orderId: str, amount: int):
    """
    Verifies payment with Toss API and promotes the pending request to Scheduled.
    """
    import urllib.request
    import base64
    from datetime import datetime, timedelta
    
    # 1. Confirm payment with Toss Payments API
    secret_key = os.environ.get("TOSS_SECRET_KEY", "test_sk_Z1aOwX7K8m0y1v6zY7J8y0n4")
    auth_str = f"{secret_key}:"
    auth_b64 = base64.b64encode(auth_str.encode("utf-8")).decode("utf-8")
    
    url = "https://api.tosspayments.com/v1/payments/confirm"
    headers = {
        "Authorization": f"Basic {auth_b64}",
        "Content-Type": "application/json"
    }
    post_data = {
        "paymentKey": paymentKey,
        "orderId": orderId,
        "amount": amount
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(post_data).encode("utf-8"), 
        headers=headers, 
        method="POST"
    )
    
    confirm_data = None
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            confirm_data = json.loads(res_body)
    except Exception as e:
        err_msg = str(e)
        if hasattr(e, "read"):
            try:
                err_msg = e.read().decode("utf-8")
            except:
                pass
        return HTMLResponse(content=f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>결제 승인 실패 · PHYSICAL UP</title>
            <style>
                body {{ background: #040711; color: #f1f5f9; font-family: sans-serif; text-align: center; padding: 80px 20px; }}
                .box {{ max-width: 450px; margin: 0 auto; background: #0d1b3e; border: 1px solid #f76f8e; padding: 30px; border-radius: 16px; }}
                h2 {{ color: #f76f8e; }}
                p {{ color: #94a3b8; font-size: 14px; line-height: 1.6; }}
                .btn {{ display: inline-block; margin-top: 20px; padding: 12px 28px; background: #c9a84c; color: #040711; text-decoration: none; font-weight: bold; border-radius: 8px; }}
            </style>
        </head>
        <body>
            <div class="box">
                <h2>결제 승인 실패</h2>
                <p>토스페이먼츠 승인 요청 중 오류가 발생했습니다.<br/>상세 오류: {err_msg}</p>
                <a href="/app" class="btn">처음으로 돌아가기</a>
            </div>
        </body>
        </html>
        """, status_code=400)

    # 2. Promote pending request to Scheduled
    pending_file = os.path.join(PENDING_TOSS_DIR, f"{orderId}.json")
    if not os.path.exists(pending_file):
        return HTMLResponse(content=f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>신청 정보 누락 · PHYSICAL UP</title>
            <style>
                body {{ background: #040711; color: #f1f5f9; font-family: sans-serif; text-align: center; padding: 80px 20px; }}
                .box {{ max-width: 450px; margin: 0 auto; background: #0d1b3e; border: 1px solid #c9a84c; padding: 30px; border-radius: 16px; }}
                h2 {{ color: #c9a84c; }}
                p {{ color: #94a3b8; font-size: 14px; line-height: 1.6; }}
                .btn {{ display: inline-block; margin-top: 20px; padding: 12px 28px; background: #c9a84c; color: #040711; text-decoration: none; font-weight: bold; border-radius: 8px; }}
            </style>
        </head>
        <body>
            <div class="box">
                <h2>결제 완료 · 신청서 누락</h2>
                <p>결제는 성공했으나, 신청 데이터가 유실되었습니다.<br/>관리자에게 주문번호({orderId})와 함께 문의해 주세요.</p>
                <a href="/app" class="btn">처음으로 돌아가기</a>
            </div>
        </body>
        </html>
        """)

    try:
        with open(pending_file, "r", encoding="utf-8") as f:
            req_data = json.load(f)
        
        # Determine schedule date
        scheduled_counts = {}
        if os.path.exists(REQUESTS_DIR):
            for filename in os.listdir(REQUESTS_DIR):
                if filename.endswith(".json"):
                    file_path = os.path.join(REQUESTS_DIR, filename)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            d = json.load(f)
                        if d.get("status") in ["Scheduled", "Approved"]:
                            sched_at = d.get("scheduled_at", 0)
                            if sched_at > 0:
                                sched_dt = datetime.fromtimestamp(sched_at / 1000)
                                date_str = sched_dt.strftime("%Y-%m-%d")
                                scheduled_counts[date_str] = scheduled_counts.get(date_str, 0) + 1
                    except:
                        pass
        
        daily_limit = 50
        send_time_type = "next_day_10"
        custom_send_time = "10:00"
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    config_data = json.load(f)
                    daily_limit = config_data.get("daily_limit", 50)
                    send_time_type = config_data.get("send_time_type", "next_day_10")
                    custom_send_time = config_data.get("custom_send_time", "10:00")
            except:
                pass
                
        search_date = datetime.now()
        found_date = None
        for _ in range(90):
            date_str = search_date.strftime("%Y-%m-%d")
            if scheduled_counts.get(date_str, 0) < daily_limit:
                found_date = date_str
                break
            search_date += timedelta(days=1)
            
        assigned_date = found_date or datetime.now().strftime("%Y-%m-%d")
        
        # Calculate schedule timestamp
        if send_time_type == "next_day_10":
            assigned_dt = datetime.strptime(assigned_date, "%Y-%m-%d")
            next_day_dt = assigned_dt + timedelta(days=1)
            dt = datetime.strptime(f"{next_day_dt.strftime('%Y-%m-%d')} 10:00:00", "%Y-%m-%d %H:%M:%S")
            scheduled_at = dt.timestamp() * 1000
        elif send_time_type == "custom_time":
            dt = datetime.strptime(f"{assigned_date} {custom_send_time}:00", "%Y-%m-%d %H:%M:%S")
            scheduled_at = dt.timestamp() * 1000
        else: # instant
            scheduled_at = (time.time() * 1000) + 60 * 1000

        # Calculate BioCode and AI Comment
        ai_comment = ""
        try:
            result = calculate_biocode(req_data)
            ai_comment = generate_ai_comment(
                student_name=req_data.get("name"),
                biocode=result["biocode"],
                constitution=result["constitution"],
                height_gap=result["height_gap"],
                lag_cause=result["lag_cause"],
                sports=req_data.get("sports")
            )
        except Exception as e:
            print(f"Calculate biocode error: {str(e)}")

        req_id = str(uuid.uuid4())
        final_data = {
            "id": req_id,
            "name": req_data.get("name"),
            "gender": req_data.get("gender"),
            "birth_date": req_data.get("birth_date"),
            "birth_time": req_data.get("birth_time", ""),
            "grade": req_data.get("grade"),
            "sports": req_data.get("sports"),
            "position": req_data.get("position", ""),
            "phone": req_data.get("phone", ""),  # Contains contact email
            "father_height": req_data.get("father_height", 173.0),
            "mother_height": req_data.get("mother_height", 160.0),
            "current_height": req_data.get("current_height"),
            "current_weight": req_data.get("current_weight"),
            "body_fat": req_data.get("body_fat"),
            "skeletal_muscle": req_data.get("skeletal_muscle"),
            "wingspan": req_data.get("wingspan"),
            "inbody_file": req_data.get("inbody_file", ""),
            "survey_responses": req_data.get("survey_responses"),
            "is_free": False,
            "is_completed": True,
            "status": "Scheduled",
            "scheduled_at": scheduled_at,
            "applied_at": time.time() * 1000,
            "ai_comment": ai_comment,
            "pdf_generated": False,
            "email_sent": False,
            "toss_payment_key": paymentKey,
            "toss_order_id": orderId,
            "toss_amount": amount
        }
        
        # Save to requests directory
        with open(os.path.join(REQUESTS_DIR, f"{req_id}.json"), "w", encoding="utf-8") as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
            
        # Remove pending file
        try:
            os.remove(pending_file)
        except:
            pass

        return HTMLResponse(content=f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>결제 및 신청 완료 · PHYSICAL UP</title>
            <style>
                body {{ background: #040711; color: #f1f5f9; font-family: sans-serif; text-align: center; padding: 60px 20px; }}
                .box {{ max-width: 480px; margin: 0 auto; background: #0d1b3e; border: 1.5px solid #c9a84c; padding: 40px 24px; border-radius: 20px; box-shadow: 0 10px 40px rgba(201, 168, 76, 0.2); }}
                .logo {{ color: #c9a84c; font-size: 14px; font-weight: 900; letter-spacing: 4px; margin-bottom: 24px; }}
                .success-icon {{ font-size: 56px; color: #c9a84c; margin-bottom: 16px; }}
                h2 {{ color: #f1f5f9; font-size: 22px; font-weight: 900; margin-bottom: 10px; }}
                p {{ color: #94a3b8; font-size: 13.5px; line-height: 1.8; margin-bottom: 30px; }}
                .btn {{ display: block; width: 100%; box-sizing: border-box; padding: 16px; background: linear-gradient(135deg, #c9a84c, #f5c754); color: #040711; text-decoration: none; font-weight: 800; border-radius: 12px; font-size: 15px; box-shadow: 0 4px 15px rgba(201,168,76,0.3); }}
                .btn:hover {{ filter: brightness(1.05); }}
            </style>
        </head>
        <body>
            <div class="box">
                <div class="logo">PHYSICAL UP 333</div>
                <div class="success-icon">🏆</div>
                <h2>프리미엄 성장 분석 신청 완료!</h2>
                <p>결제 및 신청이 안전하게 완료되었습니다.<br/>
                마스터 분석 엔진 v14.0의 정밀 분석 및 컨설턴트 2차 검수 후, <strong>24시간 이내에 입력하신 연락처(이메일 및 카카오 알림톡)</strong>로 정식 PDF 결과 리포트가 자동 발송됩니다.</p>
                <a href="/app" class="btn">333TEST 메인으로 돌아가기</a>
            </div>
        </body>
        </html>
        """)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return HTMLResponse(content=f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>오류 발생 · PHYSICAL UP</title>
            <style>
                body {{ background: #040711; color: #f1f5f9; font-family: sans-serif; text-align: center; padding: 80px 20px; }}
                .box {{ max-width: 450px; margin: 0 auto; background: #0d1b3e; border: 1px solid #f76f8e; padding: 30px; border-radius: 16px; }}
                h2 {{ color: #f76f8e; }}
                p {{ color: #94a3b8; font-size: 14px; line-height: 1.6; }}
                .btn {{ display: inline-block; margin-top: 20px; padding: 12px 28px; background: #c9a84c; color: #040711; text-decoration: none; font-weight: bold; border-radius: 8px; }}
            </style>
        </head>
        <body>
            <div class="box">
                <h2>시스템 처리 오류</h2>
                <p>결제는 승인되었으나 데이터베이스 등록 중 오류가 발생했습니다.<br/>관리자에게 주문번호({orderId})와 함께 문의해 주세요.<br/>오류내용: {str(e)}</p>
                <a href="/app" class="btn">처음으로 돌아가기</a>
            </div>
        </body>
        </html>
        """, status_code=500)

@app.get("/payment/toss/fail")
def toss_fail(code: str, message: str, orderId: str):
    """
    Renders Toss failure redirect page.
    """
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>결제 실패 · PHYSICAL UP</title>
        <style>
            body {{ background: #040711; color: #f1f5f9; font-family: sans-serif; text-align: center; padding: 80px 20px; }}
            .box {{ max-width: 450px; margin: 0 auto; background: #0d1b3e; border: 1px solid #f76f8e; padding: 30px; border-radius: 16px; box-shadow: 0 8px 32px rgba(247,111,142,0.1); }}
            h2 {{ color: #f76f8e; margin-bottom: 12px; }}
            p {{ color: #94a3b8; font-size: 14.5px; line-height: 1.7; margin-bottom: 24px; }}
            .btn {{ display: inline-block; padding: 12px 28px; background: #c9a84c; color: #040711; text-decoration: none; font-weight: bold; border-radius: 8px; }}
        </style>
    </head>
    <body>
        <div class="box">
            <h2>결제가 취소되거나 실패했습니다</h2>
            <p>메시지: {message}<br/>코드: {code}</p>
            <a href="/app" class="btn">다시 시도하기</a>
        </div>
    </body>
    </html>
    """)


@app.get("/app")
def read_app():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="React App index.html not found in static directory")


@app.get("/")
def read_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Physical Up 333 Backend Running. Put static index.html inside app/static/"}


@app.get("/{filename}.html")
def read_html(filename: str):
    file_path = os.path.join(STATIC_DIR, f"{filename}.html")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")


@app.get("/logo.png")
def get_logo():
    file_path = os.path.join(STATIC_DIR, "logo.png")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="logo.png not found")


@app.get("/og.png")
def get_og():
    file_path = os.path.join(STATIC_DIR, "og.png")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="og.png not found")


@app.get("/slogan_logo.png")
def get_slogan_logo():
    file_path = os.path.join(STATIC_DIR, "slogan_logo.png")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="slogan_logo.png not found")


@app.get("/favicon.ico")
def get_favicon():
    file_path = os.path.join(STATIC_DIR, "favicon.ico")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return Response(status_code=204)



# Mount static files (must be mounted after root get, otherwise it overrides root)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

def open_browser():
    webbrowser.open(f"http://127.0.0.1:{PORT}")

if __name__ == "__main__":
    # Automatically open local site in browser after 1.5 seconds if not in server mode
    if not SERVER_MODE:
        Timer(1.5, open_browser).start()
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=not SERVER_MODE)
