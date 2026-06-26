# Project Context for Agents (Next Steps Guide)

이 파일은 다음 세션에서 작업을 이어받는 AI 에이전트를 위한 컨텍스트 요약 문서입니다.

## 📌 현재 상태 및 히스토리 (2026-06-26 기준)
1. **리포트 화면 수정 완료 (`app/static/report.html`)**:
   * 8페이지 이후 레이아웃 깨짐(SVG 태그 중첩/누락) 현상을 완전히 수정했습니다.
   * 6페이지의 '목표 기준' 사다리 뷰를 정상 복원했습니다.
2. **대시보드 무료 버전 롤백 완료 (`app/static/admin.html`, `public/admin.html`)**:
   * 유료 매출 관련 지표(누적 예상 매출액 카드, 각 시트의 예상 매출 열)를 모두 제거하고 4열 KPI 구조로 롤백했습니다.
   * 하단 R&D 데이터베이스 통계 섹션(자가진단 건수, 전환율, BioCode 27패턴 분포 분석 시트, 3대 설문 평균 점수 비교 시트) 전체를 마크업 및 JS 로직에서 완벽하게 제거했습니다.
   * 메인 목록 테이블에서 "결제 상태" 열을 제거하고 정상 렌더링(colspan 12)이 작동하도록 수정했습니다.
   * 수정된 두 파일(`app/static/admin.html`과 `public/admin.html`)은 완전히 일치합니다.

## 📂 주요 파일 위치
* **대시보드 HTML/JS**:
  * [app/static/admin.html](file:///Users/midas/Library/CloudStorage/GoogleDrive-hellomidas@gmail.com/%EB%82%B4%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/%5Bgg_i515%5D/%5Bgg%5D2%EC%82%AC%EC%97%85%EA%B8%B0%ED%9A%8D/23.Physical%20Up%20Research/Anti_333%EC%9C%A0%EB%A3%8C/app/static/admin.html)
  * [public/admin.html](file:///Users/midas/Library/CloudStorage/GoogleDrive-hellomidas@gmail.com/%EB%82%B4%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/%5Bgg_i515%5D/%5Bgg%5D2%EC%82%AC%EC%97%85%EA%B8%B0%ED%9A%8D/23.Physical%20Up%20Research/Anti_333%EC%9C%A0%EB%A3%8C/public/admin.html)
* **학부모 브리핑 리포트 HTML/CSS**:
  * [app/static/report.html](file:///Users/midas/Library/CloudStorage/GoogleDrive-hellomidas@gmail.com/%EB%82%B4%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/%5Bgg_i515%5D/%5Bgg%5D2%EC%82%AC%EC%97%85%EA%B8%B0%ED%9A%8D/23.Physical%20Up%20Research/Anti_333%EC%9C%A0%EB%A3%8C/app/static/report.html)
* **아티팩트 폴더 내 진행 기록**:
  * [implementation_plan.md](file:///Users/midas/.gemini/antigravity-ide/brain/852a46ce-41c5-4255-af40-0000577cd7fc/implementation_plan.md) (구현 계획서)
  * [walkthrough.md](file:///Users/midas/.gemini/antigravity-ide/brain/852a46ce-41c5-4255-af40-0000577cd7fc/walkthrough.md) (작업 결과 보고서 및 검증 미디어 목록)
  * [task.md](file:///Users/midas/.gemini/antigravity-ide/brain/852a46ce-41c5-4255-af40-0000577cd7fc/task.md) (체크리스트)

## ⚠️ 다음 작업 시 주의 사항
* 대시보드는 현재 전면 **무료 333 서비스 형태**에 맞춰져 있으므로, 다시 유료 비즈니스나 매출 카드를 강제로 연동하라는 명시적인 지시가 있기 전까지는 매출 컬럼이나 유/무료 전환 추적 카드를 복구하지 마십시오.
* FastAPI 백엔드는 `app/static/admin.html`을 서빙하므로, 로컬 웹 브라우저 검증 시 `http://127.0.0.1:8000/static/admin.html`을 활용하면 됩니다.
