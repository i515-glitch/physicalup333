# Physical Up 333 - 서버 이전 및 배포 가이드 (v11.1)

본 가이드는 로컬 개발 환경에서 개발된 **Physical Up 333 분석 시스템**을 외부 클라우드/컨테이너 서버로 배포 및 이전하기 위한 상세 단계별 매뉴얼입니다.

---

## 1. 개요 및 권장 구성

본 시스템은 **FastAPI**로 구축된 연산 및 API 백엔드와, 고품질 A4 PDF 리포트 출력을 수행하는 **Playwright(Chromium)**, 그리고 명품 성장 진단 소견을 작성하는 **구글 제미나이(Gemini) API**의 하이브리드 연동 구조를 채택하고 있습니다.

* **최소 서버 사양**: 1 vCPU, 2GB RAM 이상 (Docker 구동 기준)
* **추천 배포 방식**: **Docker 컨테이너 배포** (Playwright의 시스템 라이브러리 및 나눔 폰트가 내장된 이미지를 활용하므로 배포 실패가 전혀 없습니다.)

---

## 2. 구글 제미나이 API 설정 방법 (비용 대폭 절감)

서버 내부에 무거운 로컬 AI 모델(Ollama/Gemma)을 또 설치할 필요가 없도록 구글 본사의 제미나이 API를 최우선으로 작동하게끔 설계되어 있습니다.

1. **[Google AI Studio](https://aistudio.google.com/)**에 접속 및 구글 계정 로그인.
2. 좌측 상단 **[Get API Key]** 클릭 ➡️ **[Create API Key]** 버튼을 통해 새로운 키를 생성합니다.
3. 생성된 키(형태: `AIzaSy...`로 시작하는 약 40글자의 문자열)를 복사합니다.
4. 해당 키를 아래 환경 변수 파일의 `GEMINI_API_KEY` 항목에 붙여넣습니다.

---

## 3. 환경 설정 (.env 파일 생성)

프로젝트 루트 디렉토리의 `.env.example` 파일을 복사하여 `.env` 파일을 생성하고 설정을 입력합니다.

```bash
cp .env.example .env
```

`.env` 파일 내부 핵심 설정 예시:
```env
HOST=0.0.0.0
PORT=8000
SERVER_MODE=false # 서버 배포 환경이므로 브라우저 자동 실행 차단(false)

# 구글 제미나이 API Key 등록
GEMINI_API_KEY=AIzaSyD-여기에_복사한_진짜_API_KEY_입력

# Playwright가 HTML 리포트에 접속할 본인 서버 주소
PLAYWRIGHT_SERVER_URL=http://127.0.0.1:8000
```

---

## 4. Docker를 이용한 배포 (강력 추천)

도커를 이용하면 복잡한 의존성 설치 과정(나눔 폰트, Playwright 브라우저 의존 라이브러리 등) 없이 명령어 몇 줄로 완전한 구동이 가능합니다.

### 1) Docker 이미지 빌드
프로젝트 루트 디렉토리에서 아래 명령을 실행하여 이미지를 빌드합니다.
```bash
docker build -t physicalup333 .
```

### 2) 컨테이너 구동 (데이터 영구 유지 보존)
사용자의 접수 데이터 및 생성된 PDF 리포트 파일(`app/data`)이 컨테이너 재부팅 시 소멸되지 않도록, 호스트 디렉토리에 **볼륨 마운트(Volume Mount)**하여 구동합니다.

```bash
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  -v $(pwd)/app/data:/workspace/app/data \
  --name physicalup-app \
  physicalup333
```
* `-p 8000:8000`: 서버의 8000번 포트로 서비스를 오픈합니다.
* `--env-file .env`: 작성해 둔 API 키와 환경 설정을 컨테이너 내부로 주입합니다.
* `-v ...`: 서버 로컬 경로와 컨테이너 내부 데이터 폴더를 동기화하여 데이터를 안전하게 영구 보존합니다.

---

## 5. 로컬 가상 환경에서 수동 구동하는 방법

Docker가 아닌 서버 OS 환경에 직접 구동할 경우의 절차입니다.

### 1) 의존성 라이브러리 설치
```bash
pip install -r requirements.txt
```

### 2) Playwright 전용 브라우저 드라이버 설치
```bash
playwright install chromium --with-deps
```

### 3) 리눅스 서버 한글 폰트 설치 (중요: 차트 한글 깨짐 방지)
우분투/데비안 리눅스의 경우 아래 명령을 통해 나눔 폰트를 반드시 설치해 주어야 차트 내 한글이 깨지지 않고 렌더링됩니다.
```bash
sudo apt-get update && sudo apt-get install -y fonts-nanum
sudo fc-cache -fv
```

### 4) 서버 실행
```bash
# .env 환경 변수를 로드한 후 모듈 방식으로 실행합니다.
export $(cat .env | xargs)
python -m app.main
```

---

## 6. 메일 전송이 실패할 때 (Gmail SMTP 설정 팁)

만약 `app/config.json`의 이메일 전송 정보로 메일 발송이 실패할 경우, 다음 사항을 점검하십시오.
1. 사용하고자 하는 Gmail 계정의 **[구글 계정 관리] ➡️ [보안]** 탭으로 이동합니다.
2. **2단계 인증**을 활성화합니다.
3. 검색창에 **"앱 비밀번호(App Password)"**를 검색하여 `PhysicalUpMail` 등의 이름으로 16자리 임시 비밀번호를 생성합니다.
4. `config.json` 파일의 `smtp_password` 자리에 구글 계정 비밀번호 대신 이 **16자리 앱 비밀번호(띄어쓰기 없이)**를 입력해 줍니다.
