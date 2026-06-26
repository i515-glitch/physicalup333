# ==========================================
# Physical Up 333 - Dockerfile
# ==========================================

# 1. Playwright와 Python 환경이 완벽하게 사전 구성된 Microsoft 공식 이미지 채택
FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

# 2. 서버 환경에서 Matplotlib 차트 시각화 시 한글 깨짐 방지를 위한 나눔 폰트 설치 및 캐시 갱신
RUN apt-get update && apt-get install -y \
    fonts-nanum \
    fontconfig \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -fv

# 3. 컨테이너 내부 작업 디렉토리 생성 및 지정
WORKDIR /workspace

# 4. requirements.txt 복사 및 파이썬 패키지 설치 (캐시 제외하여 가볍게 빌드)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 5. 프로젝트 소스 코드 및 엑셀 데이터베이스 파일 전체 복사
COPY . .

# 6. 외부 포트 노출
EXPOSE 8000

# 7. 서버용 기본 환경 변수 설정
ENV HOST=0.0.0.0
ENV PORT=8000
ENV SERVER_MODE=true
ENV PLAYWRIGHT_SERVER_URL=http://127.0.0.1:8000
ENV CHART_FONT_FAMILY=NanumGothic

# 8. FastAPI 서버 모듈 실행
CMD ["python", "-m", "app.main"]
