import base64
import json
import requests
import os

OLLAMA_VISION_URL = os.environ.get("OLLAMA_API_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.environ.get("OLLAMA_VISION_MODEL", "llava")  # Default local vision model

def parse_inbody_image(image_bytes):
    """
    Tries to call local Gemma/Llava vision API to extract InBody metrics.
    If it fails or is offline, falls back to a Mock parser with simulation.
    image_bytes: raw image byte data
    """
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    # 1. Try Google Gemini API first if API key is provided (Multimodal JSON Mode)
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            print("[OCR] Requesting Google Gemini API (gemini-2.5-flash) for InBody OCR via native urllib...")
            import urllib.request
            import ssl
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
            prompt = "Identify the values for Height (cm), Weight (kg), Skeletal Muscle Mass (SMM, kg), and Percent Body Fat (PBF, %) from this InBody sheet. Output ONLY a valid JSON object in this format: {\"height\": float, \"weight\": float, \"muscle\": float, \"fat\": float}."
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {
                            "inlineData": {
                                "mimeType": "image/jpeg",
                                "data": base64_image
                            }
                        }
                    ]
                }],
                "generationConfig": {
                    "responseMimeType": "application/json"
                }
            }
            data_bytes = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url, 
                data=data_bytes, 
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            ctx = ssl._create_unverified_context()
            with urllib.request.urlopen(req, context=ctx, timeout=30.0) as response:
                if response.status == 200:
                    res_data = json.loads(response.read().decode("utf-8"))
                    response_text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    data = json.loads(response_text)
                    return {
                        "success": True,
                        "is_mock": False,
                        "height": float(data.get("height", 165.0)),
                        "weight": float(data.get("weight", 48.0)),
                        "muscle": float(data.get("muscle", 22.0)),
                        "fat": float(data.get("fat", 18.0))
                    }
        except Exception as e:
            print(f"[OCR] Google Gemini API call failed: {e}. Trying local Ollama next.")

    # 2. Attempt local Ollama vision API
    try:
        payload = {
            "model": MODEL_NAME,
            "prompt": "Identify the values for Height (cm), Weight (kg), Skeletal Muscle Mass (SMM, kg), and Percent Body Fat (PBF, %) from this InBody sheet. Output ONLY a valid JSON object in this format: {\"height\": float, \"weight\": float, \"muscle\": float, \"fat\": float}. Do not include markdown formatting or backticks. Only return the JSON.",
            "images": [base64_image],
            "stream": False
        }
        # Set a short timeout (3 seconds) to prevent freezing if Ollama is not running
        response = requests.post(OLLAMA_VISION_URL, json=payload, timeout=3.0)
        
        if response.status_code == 200:
            result_json = response.json()
            response_text = result_json.get("response", "").strip()
            # Clean possible markdown wrapping
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            return {
                "success": True,
                "is_mock": False,
                "height": float(data.get("height", 165.0)),
                "weight": float(data.get("weight", 48.0)),
                "muscle": float(data.get("muscle", 22.0)),
                "fat": float(data.get("fat", 18.0))
            }
    except Exception as e:
        print(f"[OCR] Local Vision API call failed: {e}. Falling back to simulation mode.")
        
    # 3. Fallback Mock parser (Simulated OCR)
    # Return typical player stats for testing
    return {
        "success": True,
        "is_mock": True,
        "height": 165.0,
        "weight": 48.0,
        "muscle": 22.0,
        "fat": 18.0,
        "message": "로컬 Gemma 비전 API 오프라인 상태. 테스트용 모의(Mock) 데이터로 자동 로딩되었습니다."
    }
