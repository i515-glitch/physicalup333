import os
import json
import requests
import time
import hmac
import hashlib
from datetime import datetime, timezone

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "config.json")

def load_notifier_config():
    """
    Loads API key and Kakao channel configuration from config.json.
    """
    default_config = {
        "smtp_server": "smtp.gmail.com",
        "smtp_port": 587,
        "smtp_user": "your_email@gmail.com",
        "smtp_password": "your_app_password",
        "sender_name": "PHYSICAL UP 엘리트 스포츠 랩",
        "solapi_api_key": "YOUR_SOLAPI_API_KEY",
        "solapi_api_secret": "YOUR_SOLAPI_API_SECRET",
        "kakao_pf_id": "YOUR_PF_ID",
        "kakao_template_id": "YOUR_TEMPLATE_ID",
        "sender_phone": "YOUR_VERIFIED_SENDER_PHONE",
        "use_mock": True,
        "telegram_bot_token": "YOUR_TELEGRAM_BOT_TOKEN",
        "telegram_chat_id": "YOUR_TELEGRAM_CHAT_ID",
        "use_telegram": False
    }
    
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                config = json.load(f)
                return {**default_config, **config}
        except Exception as e:
            print(f"[Notifier] Error loading config.json: {e}")
            
    try:
        os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(default_config, f, indent=4, ensure_ascii=False)
    except:
        pass
        
    return default_config

def send_kakao_alimtalk(to_phone, student_name, biocode, report_url):
    """
    Sends Kakao Alimtalk via Solapi (CoolSMS) API v4.
    If 'use_mock' is True, it simulates in console logs without making real HTTP charges.
    """
    config = load_notifier_config()
    
    # Format phone to standard E.164 or digits only
    clean_phone = "".join(filter(str.isdigit, to_phone))
    
    # Format biocode: strip hyphens and append BioCode (e.g. 3-3-3 -> 333 BioCode)
    clean_biocode = f"{biocode.replace('-', '')} BioCode"
    
    # 1. Mock execution fallback
    if config.get("use_mock") or config["solapi_api_key"] == "YOUR_SOLAPI_API_KEY":
        print("\n--- [MOCK KAKAO ALIMTALK SENDING] ---")
        print(f"To (Recipient Phone): {to_phone}")
        print(f"Kakao Sender Channel ID: {config['kakao_pf_id']}")
        print(f"Kakao Template ID: {config['kakao_template_id']}")
        print("Message Body Preview:")
        print(f"[PHYSICAL UP] {student_name} 보호자님, 우리 아이의 정밀 성장 분석 결과({clean_biocode}) 보고서가 준비되었습니다. 아래 링크를 터치해 상세 결과를 확인해 보세요!")
        print(f"▶ 분석 결과지 열람하기: {report_url}")
        print("--------------------------------------\n")
        return True

    # 2. Real Solapi Kakao Alimtalk API Protocol (v4)
    # Ref: https://docs.solapi.com/
    api_key = config["solapi_api_key"]
    api_secret = config["solapi_api_secret"]
    
    # Generate Solapi Authentication Headers
    date_str = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    salt = os.urandom(16).hex()
    signature_data = date_str + salt
    signature = hmac.new(
        api_secret.encode('utf-8'),
        signature_data.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    headers = {
        "Authorization": f"HMAC-SHA256 apiKey={api_key}, date={date_str}, salt={salt}, signature={signature}",
        "Content-Type": "application/json"
    }
    
    # Kakao Alimtalk payload body
    message = {
        "to": clean_phone,
        "from": config["sender_phone"],
        "type": "ATA",  # ATA = Alimtalk type code in Solapi
        "text": f"[PHYSICAL UP] {student_name} 보호자님, 우리 아이의 정밀 성장 분석 결과({clean_biocode}) 보고서가 준비되었습니다. 아래 링크를 터치해 상세 결과를 확인해 보세요!\n▶ 분석 결과지 열람하기: {report_url}",
        "kakaoOptions": {
            "pfId": config["kakao_pf_id"],
            "templateId": config["kakao_template_id"],
            "buttons": [
                {
                    "buttonType": "WL",  # WL = Web Link button
                    "buttonName": "결과지 확인하기",
                    "linkMo": report_url,
                    "linkPc": report_url
                }
            ]
        }
    }
    
    payload = {"message": message}
    url = "https://api.solapi.com/messages/v4/send"
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        res_json = response.json()
        if response.status_code == 200 or res_json.get("statusCode") == "2000":
            print(f"[Notifier] Kakao Alimtalk sent successfully to {to_phone} (MessageId: {res_json.get('messageId')})")
            return True
        else:
            print(f"[Notifier] Solapi API responded with error: {res_json}")
            return False
    except Exception as e:
        print(f"[Notifier] Failed to communicate with Solapi API: {e}")
        return False

def send_telegram_alert(student_name, sports, phone, grade, gender):
    """
    Sends real-time admin notification via Telegram Bot API when a new survey is submitted.
    """
    config = load_notifier_config()
    token = config.get("telegram_bot_token")
    chat_id = config.get("telegram_chat_id")
    
    if not config.get("use_telegram") or token == "YOUR_TELEGRAM_BOT_TOKEN":
        print("\n--- [MOCK TELEGRAM ADMIN ALERT] ---")
        print(f"Content: [Physical UP 333] 새로운 무료 피지컬 상담 신청! {student_name}({gender}/{grade}) - 종목: {sports} - 연락처: {phone}")
        print("-----------------------------------\n")
        return True

    text = (
        f"🔔 [신청접수] Physical UP 333\n"
        f"새로운 무료 피지컬 상담 신청이 도착했습니다!\n\n"
        f"👤 이름: {student_name} ({gender})\n"
        f"🏫 학년: {grade}\n"
        f"⚾️ 종목: {sports}\n"
        f"📞 연락처: {phone}\n"
        f"⏰ 접수시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )
    
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        if response.status_code == 200:
            print("[Notifier] Telegram admin alert sent successfully.")
            return True
        else:
            print(f"[Notifier] Telegram failed: {response.text}")
            return False
    except Exception as e:
        print(f"[Notifier] Telegram exception: {e}")
        return False
