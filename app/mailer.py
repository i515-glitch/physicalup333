import os
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "config.json")

def load_smtp_config():
    """
    Loads SMTP details from app/data/config.json if it exists.
    Otherwise returns default mock / standard configurations.
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
        "use_mock": True
    }
    
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                config = json.load(f)
                return {**default_config, **config}
        except Exception as e:
            print(f"[Mailer] Error loading config.json: {e}")
            
    try:
        # Create directory if not exists
        os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(default_config, f, indent=4, ensure_ascii=False)
    except:
        pass
        
    return default_config

def send_report_email(to_email, student_name, pdf_path):
    """
    Sends the generated PDF report via SMTP to the recipient.
    """
    config = load_smtp_config()
    
    if not to_email or "@" not in to_email:
        print(f"[Mailer] Invalid recipient email '{to_email}'. Skipping email send.")
        return False
        
    # Check mock settings
    if config["smtp_user"] == "your_email@gmail.com":
        print("[Mailer] WARNING: Default SMTP credentials detected in config.json. Printing mock email console log instead:")
        print(f"--- MOCK EMAIL TO: {to_email} ---")
        print(f"Subject: [PHYSICAL UP] {student_name} 학생의 정밀 성장분석 보고서 (v11.1)")
        print(f"Body: 안녕하세요. PHYSICAL UP 333 엘리트 스포츠 랩입니다. {student_name} 학생의 분석 보고서를 보내드립니다...")
        print(f"Attachment: {os.path.basename(pdf_path)}")
        print("---------------------------------")
        return True

    # Build message
    msg = MIMEMultipart()
    msg['From'] = f'"{config["sender_name"]}" <{config["smtp_user"]}>'
    msg['To'] = to_email
    msg['Subject'] = f'[PHYSICAL UP] {student_name} 학생의 정밀 성장분석 보고서 (v11.1)'

    body = f"""
    <html>
    <body>
        <h2 style="color: #15233b;">PHYSICAL UP 333 — 성장잠재력 정밀 분석 결과</h2>
        <p>안녕하세요, 학부모님 및 지도자님. PHYSICAL UP 333 엘리트 스포츠 랩입니다.</p>
        <p>요청하신 <b>{student_name}</b> 학생의 18페이지 프리미엄 성장분석 보고서(v11.1) 발송을 승인 완료하였습니다.</p>
        <p>본 메일에 첨부된 PDF 파일을 다운로드하시어 자세한 BioCode 유형 분석 및 5대 성장 솔루션을 확인해 주시기 바랍니다.</p>
        <br>
        <p style="color: #8a6b2c; font-weight: bold;">"타고났으나, 더 클 수 있습니다."</p>
        <br>
        <hr>
        <p style="font-size: 11px; color: #7b8493;">본 메일은 발신 전용이며 문의 사항은 고객센터 카카오톡 채널로 남겨주시기 바랍니다.</p>
    </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html', 'utf-8'))

    # Attach PDF
    if os.path.exists(pdf_path):
        try:
            with open(pdf_path, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f"attachment; filename*=UTF-8''{student_name}_성장잠재력_보고서_v11.1.pdf"
                )
                msg.attach(part)
        except Exception as e:
            print(f"[Mailer] Error attaching PDF: {e}")
            return False
    else:
        print(f"[Mailer] Attachment PDF file not found at: {pdf_path}")
        return False

    # Send email
    try:
        print(f"[Mailer] Connecting to SMTP server {config['smtp_server']}:{config['smtp_port']}...")
        server = smtplib.SMTP(config['smtp_server'], config['smtp_port'])
        server.starttls()
        server.login(config['smtp_user'], config['smtp_password'])
        server.sendmail(config['smtp_user'], to_email, msg.as_string())
        server.close()
        print(f"[Mailer] Email successfully sent to {to_email} with PDF.")
        return True
    except Exception as e:
        print(f"[Mailer] Failed to send email to {to_email}: {e}")
        return False
