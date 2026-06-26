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
from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
        content = await file.read()
        ocr_result = parse_inbody_image(content)
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
    Check if the same student has an active Scheduled/Approved request within the last 30 days.
    """
    # [임시 비활성화] 베타 서비스 테스트를 위해 중복 신청 제한을 해제합니다.
    return False
    
    import time
    current_time_ms = time.time() * 1000
    thirty_days_ms = 30 * 24 * 60 * 60 * 1000 # 30 days in ms
    
    if not os.path.exists(REQUESTS_DIR):
        return False
        
    for filename in os.listdir(REQUESTS_DIR):
        if filename.endswith(".json"):
            file_path = os.path.join(REQUESTS_DIR, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                # Check status
                status = data.get("status")
                if status not in ["Scheduled", "Approved"]:
                    continue
                    
                # Match student unique identity
                if (data.get("name") == name and 
                    data.get("birth_date") == birth_date and 
                    data.get("phone") == phone):
                    
                    # Check if within 30 days
                    req_timestamp = data.get("timestamp", 0)
                    if current_time_ms - req_timestamp < thirty_days_ms:
                        return True
            except:
                pass
    return False

class ReservationConfig(BaseModel):
    open_dates: List[str]
    default_send_time: str
    approval_mode: str

@app.get("/api/admin/config")
def get_reservation_config():
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            return {
                "open_dates": data.get("open_dates", []),
                "default_send_time": data.get("default_send_time", "10:00"),
                "approval_mode": data.get("approval_mode", "ai")
            }
        else:
            return {"open_dates": [], "default_send_time": "10:00", "approval_mode": "ai"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/config")
def update_reservation_config(config: ReservationConfig):
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        time_parts = config.default_send_time.split(":")
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
    from datetime import datetime
    try:
        # Load open dates from config
        open_dates = []
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                config_data = json.load(f)
                open_dates = config_data.get("open_dates", [])
        
        # Filter out past dates (based on local date YYYY-MM-DD)
        today_str = datetime.now().strftime("%Y-%m-%d")
        valid_dates = [d for d in open_dates if d >= today_str]
        
        # Scan data/requests for scheduled counts
        scheduled_counts = {}
        if os.path.exists(REQUESTS_DIR):
            for filename in os.listdir(REQUESTS_DIR):
                if filename.endswith(".json"):
                    file_path = os.path.join(REQUESTS_DIR, filename)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            data = json.load(f)
                        if data.get("status") == "Scheduled":
                            sched_at = data.get("scheduled_at", 0)
                            if sched_at > 0:
                                sched_dt = datetime.fromtimestamp(sched_at / 1000)
                                date_str = sched_dt.strftime("%Y-%m-%d")
                                scheduled_counts[date_str] = scheduled_counts.get(date_str, 0) + 1
                    except:
                        pass
        
        # Prepare response
        result = []
        for date_str in valid_dates:
            booked = scheduled_counts.get(date_str, 0)
            remaining = max(0, 50 - booked)
            result.append({
                "date": date_str,
                "booked": booked,
                "remaining": remaining,
                "is_available": remaining > 0
            })
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/online/apply")
def online_apply(request: AnalysisRequest):
    """
    Endpoint for online survey & InBody applications.
    Computes standard BioCode, triggers AI draft comments, and saves as pending or scheduled.
    """
    from datetime import datetime
    try:
        status = "Pending"
        scheduled_at = None
        is_completed = False
        
        # Determine if data is fully completed (for scheduling / reports)
        # Check required fields for full analysis
        if (request.current_height > 0 and 
            request.current_weight > 0 and 
            request.body_fat is not None and 
            request.skeletal_muscle is not None and 
            len(request.survey_responses) == 24):
            is_completed = True
            
        if request.is_free:
            reservation_date = request.reservation_date
            
            # 예약 날짜가 입력되지 않은 경우 -> 자동으로 내일부터 50명이 안 찬 가장 빠른 날짜를 예약일로 자동 배정
            if not reservation_date:
                from datetime import timedelta
                search_date = datetime.now() + timedelta(days=1)
                found_date = None
                
                # 예약 카운팅을 위한 사전 스캔
                scheduled_counts = {}
                if os.path.exists(REQUESTS_DIR):
                    for filename in os.listdir(REQUESTS_DIR):
                        if filename.endswith(".json"):
                            file_path = os.path.join(REQUESTS_DIR, filename)
                            try:
                                with open(file_path, "r", encoding="utf-8") as f:
                                    d = json.load(f)
                                if d.get("status") == "Scheduled":
                                    sched_at = d.get("scheduled_at", 0)
                                    if sched_at > 0:
                                        sched_dt = datetime.fromtimestamp(sched_at / 1000)
                                        date_str = sched_dt.strftime("%Y-%m-%d")
                                        scheduled_counts[date_str] = scheduled_counts.get(date_str, 0) + 1
                            except:
                                pass
                                
                for _ in range(60):  # 최대 60일 뒤까지 탐색
                    date_str = search_date.strftime("%Y-%m-%d")
                    if scheduled_counts.get(date_str, 0) < 50:
                        found_date = date_str
                        break
                    search_date += timedelta(days=1)
                    
                if not found_date:
                    raise HTTPException(status_code=400, detail="현재 예약이 밀려 있어 신청이 불가능합니다. 관리자에게 문의해 주세요.")
                
                reservation_date = found_date
            else:
                # 지정 예약일을 선택한 경우 -> config에 열린 날짜인지 검증
                open_dates = []
                if os.path.exists(CONFIG_FILE):
                    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                        config_data = json.load(f)
                        open_dates = config_data.get("open_dates", [])
                
                if reservation_date not in open_dates:
                    raise HTTPException(status_code=400, detail="지정된 예약 오픈 날짜가 아닙니다.")
                    
                today_str = datetime.now().strftime("%Y-%m-%d")
                if reservation_date < today_str:
                    raise HTTPException(status_code=400, detail="이미 지난 날짜로는 예약 신청이 불가합니다.")
                    
                # 50명 정원 체크
                booked_count = 0
                if os.path.exists(REQUESTS_DIR):
                    for filename in os.listdir(REQUESTS_DIR):
                        if filename.endswith(".json"):
                            file_path = os.path.join(REQUESTS_DIR, filename)
                            try:
                                with open(file_path, "r", encoding="utf-8") as f:
                                    data = json.load(f)
                                if data.get("status") == "Scheduled":
                                    sched_at = data.get("scheduled_at", 0)
                                    if sched_at > 0:
                                        sched_dt = datetime.fromtimestamp(sched_at / 1000)
                                        if sched_dt.strftime("%Y-%m-%d") == reservation_date:
                                            booked_count += 1
                            except:
                                pass
                if booked_count >= 50:
                    raise HTTPException(status_code=400, detail="선택하신 예약 날짜의 정원(50명)이 이미 초과 마감되었습니다.")
                
            # 3. 중복 신청 제한 검증 (이름 + 생년월일 + 연락처 기준 30일 제한)
            if check_duplicate_application(request.name, request.birth_date, request.phone):
                raise HTTPException(
                    status_code=400, 
                    detail="학생 1인당 월 1회 신청으로 제한됩니다. 최근 30일 이내에 이미 예약 또는 검사 완료된 이력이 있습니다."
                )
                
            status = "Scheduled"
            # Load default send time from config (e.g. "10:00")
            default_send_time = "10:00"
            if os.path.exists(CONFIG_FILE):
                try:
                    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                        config_data = json.load(f)
                        default_send_time = config_data.get("default_send_time", "10:00")
                except:
                    pass
            if ":" not in default_send_time:
                default_send_time = "10:00"
                
            dt = datetime.strptime(f"{reservation_date} {default_send_time}:00", "%Y-%m-%d %H:%M:%S")
            scheduled_at = dt.timestamp() * 1000

        # Calculate BioCode only if completed, otherwise generate dummy or skip AI comment draft
        ai_comment = ""
        if is_completed:
            try:
                result = calculate_biocode(request.dict())
                ai_comment = generate_ai_comment(
                    student_name=request.name,
                    biocode=result["biocode"],
                    constitution=result["constitution"],
                    height_gap=result["height_gap"],
                    lag_cause=result["lag_cause"],
                    sports=request.sports
                )
            except Exception as e:
                # If calculations fail but it is a scheduled incomplete draft, we can skip
                pass

        req_id = str(uuid.uuid4())
        req_data = {
            "id": req_id,
            "status": status,
            "is_completed": is_completed,
            "timestamp": time.time() * 1000,
            "ai_comment": ai_comment,
            **request.dict()
        }
        if scheduled_at:
            req_data["scheduled_at"] = scheduled_at
            
        file_path = os.path.join(REQUESTS_DIR, f"{req_id}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(req_data, f, indent=4, ensure_ascii=False)
            
        return {
            "success": True, 
            "id": req_id, 
            "status": status,
            "is_completed": is_completed,
            "message": "예약이 성공적으로 완료되었습니다." if status == "Scheduled" else "Application submitted successfully."
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

    return {
        "success": True,
        "email_sent": email_success,
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
            "message": "Report approved, PDF generated, and email sent.",
            "email_sent": res["email_sent"],
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


# Mount static files (must be mounted after root get, otherwise it overrides root)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

def open_browser():
    webbrowser.open(f"http://127.0.0.1:{PORT}")

if __name__ == "__main__":
    # Automatically open local site in browser after 1.5 seconds if not in server mode
    if not SERVER_MODE:
        Timer(1.5, open_browser).start()
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=not SERVER_MODE)
