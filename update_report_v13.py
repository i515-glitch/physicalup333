# -*- coding: utf-8 -*-
import os
import re
import math

premium_path = "/Users/midas/Library/CloudStorage/GoogleDrive-hellomidas@gmail.com/내 드라이브/[gg_i515]/[gg]2사업기획/23.Physical Up Research/Anti_333유료/app/static/report_premium.html"
report_path = "/Users/midas/Library/CloudStorage/GoogleDrive-hellomidas@gmail.com/내 드라이브/[gg_i515]/[gg]2사업기획/23.Physical Up Research/Anti_333유료/app/static/report.html"

with open(premium_path, "r", encoding="utf-8") as f:
    premium_content = f.read()

# 1. HTML 분해 및 파싱
body_start = premium_content.find("<body>")
body_end = premium_content.find("</body>")

head_part = premium_content[:body_start + 6]
body_part = premium_content[body_start + 6:body_end]
tail_part = premium_content[body_end:]

# 정규식 시트 분리
sheets_raw = re.split(r'(?=<div class="sheet(?:[^>]*?)>)', body_part)
sheets = [s.strip() for s in sheets_raw if s.strip()]

print(f"INFO: Successfully parsed {len(sheets)} sheets.")

# 2. v13용 시트 레이아웃 재배열 (총 8개 시트 구성!)
# ordered_indices: Cover(0), TOC(1), BioCode결론(10), 유전설계도(2), 현재몸인바디(6), 큐브궁합(9), 1년약속(16), Appendix속설(13)
ordered_indices = [0, 1, 10, 2, 6, 9, 16, 13]

new_sheets = []
for idx in ordered_indices:
    if idx < len(sheets):
        new_sheets.append(sheets[idx])

print(f"INFO: Reassembled sheets count for v13: {len(new_sheets)}")

# ----------------------------------------------------
# 3. 각 시트 내용 v13.0 스토리텔링 전면 치환
# ----------------------------------------------------

# (1) 목차 시트 (new_sheets[1] -> INDEX 01)
new_sheets[1] = re.sub(
    r'<div class="chapter"><span class="cn">목차</span>.*?Ⅱ\. 미래 실행 영역.*?</div>\s*</div>',
    """<div class="chapter"><span class="cn">목차</span><span class="ck">Contents</span></div>
    <h2>성장잠재력 분석 목차</h2>
    <p class="lead">본 보고서는 아이의 잠재력을 깨우기 위한 <b>5단계 스토리텔링</b>으로 전개됩니다. 타고난 기질(BioCode)을 정의한 뒤, 또래 대비 격차와 원인을 밝히고, 마지막에 1년의 행동 지침을 제시합니다.</p>
    <div style="margin:25px 0; border:1px solid var(--line2); padding:25px 30px; border-radius:10px; background:var(--mist); box-shadow:0 1px 10px rgba(21,35,59,0.04);">
      <ul style="list-style:none; padding-left:0; line-height:2.4; font-size:11pt; color:var(--ink2);">
        <li><b>1. BioCode 종합 진단 결과 (결론)</b> — 신지오의 BioCode 종합 진단 결과 및 처방 요약 <span style="color:var(--ink3); font-size:9pt; margin-left:6px;">(3p)</span></li>
        <li><b>2. 타고난 설계도 (과거 · 선천)</b> — 유전 예상 키 및 타고난 오행 체질 분석 <span style="color:var(--ink3); font-size:9pt; margin-left:6px;">(4p)</span></li>
        <li><b>3. 지금 몸의 증언 (현재 · 대사)</b> — 주관적 설문과 객관적 인바디 분석의 흡수 누수 증명 <span style="color:var(--ink3); font-size:9pt; margin-left:6px;">(5p)</span></li>
        <li><b>4. 너의 자리 (종목 궁합)</b> — 3D 큐브 위 지격 및 야구 내야수 목표 격차 매핑 <span style="color:var(--ink3); font-size:9pt; margin-left:6px;">(6p)</span></li>
        <li><b>5. 1년의 약속 (미래 · 처방)</b> — 1년 뒤 목표 성취 수치 및 분기별 극복 로드맵 <span style="color:var(--ink3); font-size:9pt; margin-left:6px;">(7p)</span></li>
        <li><b>부록 (Appendix)</b> — 부모님이 자주 믿는 피지컬 성장 속설 3가지 <span style="color:var(--ink3); font-size:9pt; margin-left:6px;">(8p)</span></li>
      </ul>
    </div>
    <h3>분석 방법 <span class="kr">Methodology</span></h3>
    <p>피지컬업 333 엔진은 유전적 기준선 위에 현재의 신체 발달과 일상생활의 균형을 얹어 분석합니다. "타고난 예상치를 뛰어넘는 30%의 환경적 임계 돌파"가 우리의 분석 지향점입니다.</p>
    <div class="trio">
      <div class="it"><div class="ic">과거</div><h4>타고난 선천 분석</h4><p>부모 키(유전 잠재치 MPH) + 타고난 골격·대사 성향.</p></div>
      <div class="it"><div class="ic">현재</div><h4>지금의 대사 격차</h4><p>또래 평균군과의 체중·근육 편차 + 위장 소화 흡수력 상태.</p></div>
      <div class="it"><div class="ic">미래</div><h4>앞으로의 도약 처방</h4><p>격차를 좁혀 성장을 극대화하기 위한 100일 행동 처방.</p></div>
    </div>
    <div class="engine"><b>분석엔진 — 3축 입체 융합</b>설문, 인바디, 유전 데이터를 융합하여 27가지 BioCode 유형을 도출하고, 목표 대비 격차를 줄이기 위한 피지컬 최적화 타임라인을 제시합니다.</div>""",
    new_sheets[1],
    flags=re.DOTALL
)

# 27개 입체 큐브 SVG 생성 로직
x_origin = 360
y_origin = 135
size = 26
cos30 = math.cos(30 * math.pi / 180)
sin30 = math.sin(30 * math.pi / 180)

cube_svg_elements = []
for u in range(3):
    for v in range(3):
        for w in range(3):
            bc_str = f"{u+1}-{v+1}-{w+1}"
            cx = x_origin + (u - v) * size * 1.6 * cos30
            cy = y_origin + (u + v) * size * 1.6 * sin30 - w * size * 1.5
            dx = size * cos30
            dy = size * sin30
            h = size
            p_top = f"{cx},{cy-h} {cx+dx},{cy-h+dy} {cx},{cy-h+2*dy} {cx-dx},{cy-h+dy}"
            p_left = f"{cx-dx},{cy-h+dy} {cx},{cy-h+2*dy} {cx},{cy+2*dy} {cx-dx},{cy+dy}"
            p_right = f"{cx},{cy-h+2*dy} {cx+dx},{cy-h+dy} {cx+dx},{cy+dy} {cx},{cy+2*dy}"
            
            cube_svg_elements.append(f"""
            <g id="cube-{bc_str}" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="{p_top}" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="{p_left}" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="{p_right}" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode {bc_str}</title>
            </g>""")
cubes_joined = "\n".join(cube_svg_elements)

# (2) ① 결론 충격 시트 (new_sheets[2] -> INDEX 10)
cube_html_markup = f"""
    <div class="chapter"><span class="cn">1</span><span class="ck">BioCode 종합 진단 결과 · BioCode Diagnostic</span></div>
    <h2>신지오의 BioCode는 <span style="font-family:'Outfit';color:var(--navy);font-weight:900;">2 · 1 · 2</span></h2>
    <p class="lead"><b>한마디로 — "엔진은 좋은데, 연료가 안 들어가는 차"입니다.</b></p>
    <div style="font-size:10pt; line-height:1.6; color:var(--ink2); text-align:justify; margin-bottom:15px; word-break:keep-all;">
      타고난 차체(선천)는 훌륭합니다. 달리고 싶은 마음(생활)도 있습니다. 그런데 연료를 넣는 입구(대사·흡수)가 막혀 있습니다. 그래서 좋은 차가 제 속도를 못 내고 있습니다. 이 보고서는 그 하나를 증명하고, 1년 안에 뚫는 길을 보여드립니다.
    </div>

    <!-- [상단] 좌우 분할 Flex 레이아웃 보드 -->
    <div style="display: flex; align-items: stretch; justify-content: space-between; gap: 15px; margin: 12px 0 15px; background: radial-gradient(circle at center, #ffffff, #f8fbfd); padding: 12px; border-radius: 12px; border: 1px solid var(--line2); box-shadow: 0 2px 10px rgba(21,35,59,0.03);">
        
        <!-- [왼쪽] 3D 큐브 SVG (너비 48%) -->
        <div style="width: 48%; text-align: center; display: flex; flex-direction: column; justify-content: center; position: relative;">
            <svg width="100%" height="240" viewBox="100 20 520 240" preserveAspectRatio="xMidYMid meet" style="display: block; margin: 0 auto;">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0ea5e9" />
                    </marker>
                </defs>
                <!-- 27개 입체 큐브 컴포넌트 -->
                {cubes_joined}

                <!-- 지오 핀포인트 링 및 네임택 레이블 -->
                <g id="cube-user-pin" style="transition: all 0.3s ease;">
                    <rect id="cube-pin-bg" x="0" y="0" rx="4" ry="4" width="96" height="18" fill="#15233b" opacity="0.95"/>
                    <text id="cube-pin-text" x="0" y="12" font-size="8.5" fill="#f0e9d8" text-anchor="middle" font-weight="700">신지오 2·1·2</text>
                    <circle id="cube-pin-dot" r="4.5" fill="#c9a84c" stroke="#fff" stroke-width="1.5"/>
                </g>

                <!-- 내야수 목표 핀포인트 링 및 레이블 -->
                <g id="cube-target-pin" style="transition: all 0.3s ease; display:none;">
                    <rect id="cube-target-bg" x="0" y="0" rx="4" ry="4" width="96" height="18" fill="#0ea5e9" opacity="0.95"/>
                    <text id="cube-target-text" x="0" y="12" font-size="8.5" fill="#ffffff" text-anchor="middle" font-weight="700">목표 2·3·3</text>
                    <circle id="cube-target-dot" r="4.5" fill="#0ea5e9" stroke="#fff" stroke-width="1.5"/>
                </g>
            </svg>
        </div>

        <!-- [오른쪽] 자기 바이오코드 요약 진단 설명 카드 (너비 48%) -->
        <div style="width: 48%; display: flex; flex-direction: column; justify-content: center;">
            <div style="border: 2px solid rgba(201,168,76,0.4); border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 15px rgba(21,35,59,0.06); text-align: left; height: 100%; display: flex; flex-direction: column;">
                <div style="padding: 10px 14px; background: #15233b; color: #fff; border-bottom: 2.5px solid rgba(201,168,76,0.4);">
                    <div style="font-size: 7.5pt; text-transform: uppercase; color: var(--gold-d); font-weight: 800; letter-spacing: 1.2px; display: flex; align-items: center; gap: 4px;">
                       <i class="fa-solid fa-dna"></i> BioCode Diagnostic Card
                    </div>
                </div>
                <div style="padding: 14px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
                    <div>
                        <div style="font-size: 7.5pt; color: var(--ink3); font-weight: 700; margin-bottom: 2px;">지오 학생의 융합 기질 코드</div>
                        <div style="font-size: 26pt; font-weight: 900; color: var(--navy); font-family: 'Outfit', sans-serif; letter-spacing: -1px; line-height: 1; margin: 2px 0;">
                           <span class="bc-user-code-val">2 · 1 · 2</span>
                        </div>
                        <div style="background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: var(--gold-d); padding: 4px 8px; border-radius: 4px; font-weight: 800; font-size: 9pt; display: inline-block; margin-top: 5px;">
                           <span class="bc-user-persona-val">내일을 향한 숨고르기 (만숙성향)</span>
                        </div>
                    </div>
                    <div style="font-size: 8.3pt; color: var(--ink2); line-height: 1.5; text-align: justify; word-break: keep-all; border-top: 1px dashed var(--line2); padding-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                        <div>
                            📌 <b>선천 형질 (2단계):</b> 타고난 프레임과 골격 성장 잠재력은 또래 표준 범위 이상으로 우수하게 타고난 상태입니다.
                        </div>
                        <div>
                            📌 <b>후천 흡수 (1단계):</b> 위장 대사 흡수율이 정체되어 영양이 골격근으로 유입되지 못하는 가장 취약한 지점입니다.
                        </div>
                        <div>
                            📌 <b>생활 활동 (2단계):</b> 활동량이 왕성해 에너지 소모가 크으므로, 6끼 분할 섭취와 코어 트레이닝을 권장합니다.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 네 줄 정리 요약 카드 -->
    <div style="background: rgba(201,168,76,0.05); border: 1.5px solid rgba(201,168,76,0.25); border-radius: 8px; padding: 12px 15px; margin: 10px 0 12px; text-align:left;">
        <div style="font-size: 9.8pt; font-weight: 900; color: var(--gold-d); margin-bottom: 6px;">📋 핵심 요약 — 네 줄 정리</div>
        <div style="font-size: 8.8pt; color: var(--ink2); line-height: 1.5; display:flex; flex-direction:column; gap:4px;">
            <div>• <b>안심하셔도 됩니다.</b> 신지오는 또래 중에선 잘 크고 있습니다 (현재 165cm).</div>
            <div>• <b>다만 솔직히.</b> 야구 잘하는 선수들은 벌써 175cm를 넘습니다. 그들과 경쟁해야 합니다.</div>
            <div>• <b>그래서 목표.</b> 1년 안에 175cm (선수 상위 10%). 타고난 잠재력(177.5cm)이면 닿는 자리입니다.</div>
            <div>• <b>길은 우리가.</b> 무엇을 어떻게 바꿀지 피지컬업이 짭니다. 따라오기만 하세요.</div>
        </div>
    </div>

    <!-- 1장 한 장 요약 테이블 -->
    <table style="font-size:9pt; margin:10px 0;">
      <thead>
        <tr><th style="width:25%;">항목</th><th style="width:75%;">내용</th></tr>
      </thead>
      <tbody>
        <tr><td><b>타고난 잠재력</b></td><td>예상 키 177.5cm — 이미 선수 상위권 바탕</td></tr>
        <tr><td><b>지금의 문제</b></td><td>대사(흡수)가 막혀 타고난 잠재력을 꺼내지 못함</td></tr>
        <tr><td><b>목표 (야구 · 내야수)</b></td><td>1년 안에 175cm 도약, 코드 2-1-2 ➡️ 2-3-3 전환</td></tr>
        <tr><td><b>핵심 솔루션</b></td><td>위장 흡수 장벽을 뚫어내면 나머지는 자연스럽게 따라옴</td></tr>
      </tbody>
    </table>

    <div style="background: var(--mist); border-left: 4px solid var(--navy); padding: 12px 15px; margin: 12px 0 10px; border-radius: 0 8px 8px 0; text-align: left;">
      <div style="font-size: 9.5pt; font-weight: 700; color: var(--navy); margin-bottom: 5px;"><i class="fa-solid fa-feather-pointed"></i> 피지컬 코칭 총평</div>
      <div class="ai-comment-intro" style="font-size: 8.8pt; color: var(--ink2); line-height: 1.6; text-align: justify; white-space: pre-wrap; letter-spacing: -0.2px;">학부모 소견 및 가이드 요약 로딩 중...</div>
    </div>
</div>
"""
new_sheets[2] = re.sub(
    r'<div class="chapter"><span class="cn">5</span><span class="ck">성장 코드 · BioCode 종합</span></div>.*',
    cube_html_markup,
    new_sheets[2],
    flags=re.DOTALL
)

# (3) ② 설계도 (과거) 시트 (new_sheets[3] -> INDEX 02)
past_design_html = """
    <div class="chapter"><span class="cn">2</span><span class="ck">타고난 설계도 (과거 · 선천) · Genetic Baseline</span></div>
    <h2>타고난 설계도 — 선천 필터</h2>
    <p class="lead">코드의 첫 자리 <b>2</b>는 "타고난 것"입니다. 바꿀 수 없는 출발점이자, 신지오의 가장 큰 강점입니다.</p>
    
    <h3>잠재력은 이미 선수 상위권입니다</h3>
    <div style="font-size: 9.3pt; line-height: 1.6; color: var(--ink2); text-align: justify; margin-bottom: 15px; word-break:keep-all;">
      • <b>유전 잠재력:</b> 아버지 180cm · 어머니 162cm ➡️ 유전 예상 키 <b>177.5cm ± 5cm</b><br>
      • <b>포지션 적합성:</b> 야구 내야수의 이상적 키는 <b>175~178cm</b>입니다. 신지오의 예상 키는 여기에 정확히 들어맞습니다. 만약 투수(185cm+ 필요)가 꿈이었다면 키가 다소 아쉬울 수 있었으나, <b>내야수라서 타고난 설계도가 완벽합니다.</b><br>
      • <b>핵심 메시지:</b> 키(선천)는 이미 목표에 맞습니다. 채울 것은 유전이 아니라 후천적 요인인 흡수와 수면입니다.
    </div>

    <h3>타고난 체질 — 만세력이 말해주는 것</h3>
    <p>생년월일시(2012.08.28 09:35)를 분석하여 타고난 선천 대사 체질을 파악합니다.</p>
    <div style="background: var(--mist); padding: 12px 15px; border-radius: 8px; margin-bottom:15px; border:1px solid var(--line2); font-size:9.2pt; line-height:1.55; color:var(--ink2);">
      • <b>오행 구성:</b> 오행상 <b>水(저장 · 수분)가 강하고 金(뼈 · 응축)이 비어</b> 있습니다.<br>
      • <b>사상 체질:</b> 사상의학적으로 <b>소음인 경향</b>이 뚜렷합니다. 소음인은 위장 기능이 예민하고 소화 흡수력이 정체되기 쉬운 타입입니다.<br>
      • <b>체질 결론:</b> 타고난 기질 자체가 <b>"많이 먹어도 흡수가 더딘 몸"</b>을 가리키고 있습니다. 이는 요행이 아니라 선천적 에너지 흐름으로, 아래 실측 데이터(③)에서 객관적인 수치로 그대로 증명됩니다.
    </div>

    <div class="note"><b>선천 분석 요약:</b> 잠재량 자체는 이미 야구 내야수 또래의 최상위 프레임을 충족합니다. 다만 위장 대사의 효율을 끌어올려 뼈와 근육으로 저장되게 만드는 마무리가 중요합니다.</div>
  </div>
</div>
</div>
"""
new_sheets[3] = re.sub(
    r'<div class="chapter"><span class="cn">1</span><span class="ck">현재 진단 · 타고난 몸 — 유전·체질</span></div>.*',
    past_design_html,
    new_sheets[3],
    flags=re.DOTALL
)

# (4) ③ 지금 몸의 증언 (현재) 시트 (new_sheets[4] -> INDEX 06)
present_testimony_html = """
    <div class="chapter"><span class="cn">3</span><span class="ck">지금 몸의 증언 (현재 · 대사) · Metabolism Testimony</span></div>
    <h2>지금 몸의 증언 — 대사 누수 증명</h2>
    <p class="lead">코드의 둘째 자리 <b>1</b>은 "지금의 대사"입니다. 신지오의 가장 약한 지점이자, 성장에 제동을 걸고 있는 원인입니다.</p>

    <h3>두 개의 증거가 같은 곳을 가리킵니다</h3>
    <p>주관적 설문 응답과 객관적 인바디 계측 결과가 따로 놀지 않고, <b>"영양 흡수가 막혔다"</b>고 한목소리로 소리치고 있습니다. 이는 절대 우연이 아닙니다.</p>

    <div style="display: flex; gap: 15px; margin: 15px 0;">
      <div style="flex: 1; border: 1.5px solid var(--line2); padding: 12px; border-radius: 8px; background: #ffffff;">
        <h4 style="color: var(--neg); margin-top: 0; font-size:9.5pt; font-weight:700;"><i class="fa-solid fa-clipboard-question"></i> 증거 A — 설문 (아이가 느끼는 것)</h4>
        <ul style="padding-left: 15px; margin: 5px 0; font-size: 8.5pt; line-height: 1.6; color: var(--ink2);">
          <li>"배탈이 자주 나는 편이다" ➡️ <b>매우 그렇다</b></li>
          <li>"먹어도 흡수가 잘 안 되는 느낌" ➡️ <b>매우 그렇다</b></li>
          <li>"아침밥을 잘 먹지 못한다" ➡️ <b>그렇다</b></li>
          <li>"한 번에 먹는 식사량이 많다" ➡️ <b>아니다</b></li>
        </ul>
      </div>
      <div style="flex: 1; border: 1.5px solid var(--line2); padding: 12px; border-radius: 8px; background: #ffffff;">
        <h4 style="color: var(--navy); margin-top: 0; font-size:9.5pt; font-weight:700;"><i class="fa-solid fa-square-poll-horizontal"></i> 증거 B — 인바디 (몸이 증명하는 것)</h4>
        <ul style="padding-left: 15px; margin: 5px 0; font-size: 8.5pt; line-height: 1.6; color: var(--ink2);">
          <li><b>체지방률 8.8%</b> (또래 선수 대비 극히 낮음)</li>
          <li><b>골격근량 21.6kg</b> (하위 30%, 채워 넣을 공간 풍부)</li>
          <li>먹은 에너지 칼로리가 체내에 축적되지 못하고 밖으로 소실되고 있음을 의미합니다.</li>
        </ul>
      </div>
    </div>

    <div class="note"><b>주관과 객관의 일치:</b> 위장의 대사 흡수율이 고착되어 소화 용량이 바닥나 있는 상태입니다. <b>둘째 자리가 1인 핵심 이유</b>이며, 이 흡수 필터를 뚫어내는 것이 피지컬 점프의 제1 관건입니다.</div>

    <!-- AI 영양 및 소화 흡수 전략 보드 -->
    <div style="background: rgba(201,168,76,0.04); border-left: 4px solid var(--gold-d); padding: 12px 15px; margin: 15px 0 10px; border-radius: 0 8px 8px 0; text-align: left;">
      <div style="font-size: 9.5pt; font-weight: 700; color: var(--gold-d); margin-bottom: 5px;"><i class="fa-solid fa-apple-whole"></i> 피지컬 영양 · 소화 흡수 소견</div>
      <div class="ai-comment-nutrition" style="font-size: 8.8pt; color: var(--ink2); line-height: 1.6; text-align: justify; white-space: pre-wrap; letter-spacing: -0.2px;">영양 및 소화 흡수 소견 로딩 중...</div>
    </div>
  </div>
</div>
</div>
"""
new_sheets[4] = re.sub(
    r'<div class="chapter"><span class="cn">3</span><span class="ck">현재 진단 · 현재 몸 — 인바디 분석</span></div>.*',
    present_testimony_html,
    new_sheets[4],
    flags=re.DOTALL
)

# (5) ④⑤ 너의 자리 (큐브 궁합) 시트 (new_sheets[5] -> INDEX 09)
cube_matching_html = """
    <div class="chapter"><span class="cn">4</span><span class="ck">너의 자리 (종목과의 궁합) · Position Compatibility</span></div>
    <h2>종목과의 궁합 — 3D 큐브 벡터</h2>
    <p class="lead">BioCode 2-1-2는 그 자체로 좋고 나쁨이 없습니다. <b>목표 종목인 "야구 내야수"가 평가의 기준을 세웁니다.</b></p>
    
    <h3>같은 코드도, 종목이 바뀌면 평가가 정반대입니다</h3>
    <div style="font-size: 9pt; line-height: 1.55; color: var(--ink2); margin-bottom:12px;">
      • <b>승마 (가벼운 체격이 극도로 유리):</b> 2-1-2 코드는 거의 완벽한 A급 기질입니다.<br>
      • <b>야구 내야수 (목표 종목):</b> 키와 프레임(선천)은 완벽하지만, 대사(흡수) 영역이 많이 부족합니다.<br>
      • <b>야구 투수 (185cm 이상 필요):</b> 유전 잠재력 키부터 한계가 걸려 적합도가 떨어집니다.
    </div>

    <!-- 3D 큐브 위 벡터 목표 맵핑 해설 -->
    <div style="background: rgba(14,165,233,0.05); border: 1.5px solid rgba(14,165,233,0.25); border-radius: 10px; padding: 12px 15px; margin: 15px 0;">
      <div style="font-size: 10pt; font-weight: 800; color: #0284c7; margin-bottom: 6px;"><i class="fa-solid fa-location-crosshairs"></i> 3D 큐브 위 지오의 자리와 목표 지점</div>
      <div style="font-size: 8.8pt; line-height: 1.5; color: var(--ink2);">
        • <b>현재 위치 (금색 핀):</b> **2 - 1 - 2** (선천 보통 · 대사 약함 · 생활 보통)<br>
        • <b>내야수 목표 (청록색 핀):</b> **2 - 3 - 3** (선천 보통 · 대사 우수 · 생활 우수)<br>
        • <b>성장 벡터 (피지컬 1년 성장 방향):</b> 선천 0 (이미 충족) ➡️ **대사 +2 · 생활 +1**<br>
        ➡️ "선천적인 골격 잠재력은 그대로 살려두고, <b>대사 흡수력을 1단계에서 3단계로 부팅시키는 것</b>이 성장 궤도의 핵심 지향점입니다."
      </div>
    </div>

    <h3>또래 에이스 대비 피지컬 격차 (선수 상위 10% 기준)</h3>
    <p>현재 또래 에이스 목표 선수군(상위 10%, 175cm)과의 절대 비교 수치입니다.</p>
    <table>
      <thead>
        <tr><th>항목</th><th>현재 측정값</th><th>선수 상위 10% 목표치</th><th>격차 (Gap)</th></tr>
      </thead>
      <tbody>
        <tr><td><b>신장</b></td><td>165 cm</td><td>175 cm</td><td><b style="color:var(--neg);">-10.0 cm</b></td></tr>
        <tr><td><b>체중</b></td><td>48 kg</td><td>58 kg</td><td><b style="color:var(--neg);">-10.0 kg</b></td></tr>
        <tr><td><b>골격근량</b></td><td>21.6 kg</td><td>27.6 kg</td><td><b style="color:var(--neg);">-6.0 kg</b></td></tr>
      </tbody>
    </table>

    <div style="background: rgba(35,92,78,0.04); border-left: 4px solid var(--pos); padding: 12px 15px; margin: 15px 0 10px; border-radius: 0 8px 8px 0; text-align: left;">
      <div style="font-size: 9.5pt; font-weight: 700; color: #235c4e; margin-bottom: 5px;"><i class="fa-solid fa-chart-line"></i> 피지컬 성장 정밀 분석 소견</div>
      <div class="ai-comment-growth" style="font-size: 8.8pt; color: var(--ink2); line-height: 1.6; text-align: justify; white-space: pre-wrap; letter-spacing: -0.2px;">피지컬 성장 분석 로딩 중...</div>
    </div>
  </div>
</div>
</div>
"""
new_sheets[5] = re.sub(
    r'<div class="chapter"><span class="cn">4</span><span class="ck">현재 진단 · 비교군 — 선수 기준 내 위치</span></div>.*',
    cube_matching_html,
    new_sheets[5],
    flags=re.DOTALL
)

# (6) ⑥⑦ 1년의 약속 시트 (new_sheets[6] -> INDEX 16)
promise_roadmap_html = """
    <div class="chapter"><span class="cn">5</span><span class="ck">1년의 약속 (미래 · 처방) · 1-Year Prescription Roadmap</span></div>
    <h2>1년의 약속 — 성장 극대화 스케줄</h2>
    <p class="lead">목표를 정하면 비로소 길이 보입니다. 신지오 학생의 1년 뒤 도달 수치와 분기별 로드맵입니다.</p>

    <h3>1년 뒤 도달 약속 수치 (우리 스케줄을 완벽히 이행했을 시)</h3>
    <table>
      <thead>
        <tr><th>구분</th><th>현재 실측</th><th>1년 뒤 목표</th><th>예상 도달 변화량</th></tr>
      </thead>
      <tbody>
        <tr><td><b>신장</b></td><td>165.0 cm</td><td>173.0 ~ 175.0 cm</td><td><b style="color:var(--pos);">+8.0 ~ +10.0 cm</b></td></tr>
        <tr><td><b>체중</b></td><td>48.0 kg</td><td>56.0 ~ 58.0 kg</td><td><b style="color:var(--pos);">+8.0 ~ +10.0 kg</b></td></tr>
        <tr><td><b>골격근량</b></td><td>21.6 kg</td><td>27.0 ~ 28.0 kg</td><td><b style="color:var(--pos);">+5.4 ~ +6.4 kg</b></td></tr>
        <tr><td><b>BioCode</b></td><td>2 - 1 - 2 (만숙형)</td><td>2 - 2 - 3 ➡️ 2 - 3 - 3</td><td>대사 및 생활 행동 3축 성장</td></tr>
      </tbody>
    </table>
    <div style="font-size:7.8pt; color:var(--ink3); margin-top:2px;">* 본 수치는 축별 가중치 비율(선천 60%, 대사 22%, 생활 18%)을 기반으로, 맞춤 처방을 100% 이행했을 때 도달 가능한 정량적 목표 시뮬레이션 결과입니다.</div>

    <h3>분석엔진 분기별 성장 로드맵 (대사 흡수부터 뚫는다)</h3>
    <table style="font-size: 8.8pt;">
      <thead>
        <tr><th style="width:20%;">단계</th><th style="width:30%;">도약 과제</th><th style="width:50%;">핵심 실천 행동</th></tr>
      </thead>
      <tbody>
        <tr><td><b>1~3개월</b></td><td><b>위장 세포 장벽 재생 (대사 1➡️2)</b></td><td>장내 유산균 및 유기산 균형 보완, 아침 결식 방지, 하루 6끼 분할 식단</td></tr>
        <tr><td><b>4~6개월</b></td><td><b>영양 잉여 저장 루틴 정착</b></td><td>소화 소실 방지 고영양 밀도 식단, 밤 10시 멜라토닌 수면 루틴 확립</td></tr>
        <tr><td><b>7~9개월</b></td><td><b>하체 및 코어 증량 (생활 2➡️3)</b></td><td>체중 1kg당 1.5g 단백질 비축, 속근육(코어) 저항 훈련, 순발력 활성화</td></tr>
        <tr><td><b>10~12개월</b></td><td><b>성장 궤적 최종 재측정</b></td><td>인바디 재측정 및 BioCode 등급 추적 검증 ➡️ 차년도 2단계 훈련 설계</td></tr>
      </tbody>
    </table>

    <!-- AI 맞춤형 운동 및 수면 설계 보드 -->
    <div style="background: rgba(21,35,59,0.03); border-left: 4px solid var(--navy); padding: 12px 15px; margin: 15px 0 10px; border-radius: 0 8px 8px 0; text-align: left;">
      <div style="font-size: 9.5pt; font-weight: 700; color: var(--navy); margin-bottom: 5px;"><i class="fa-solid fa-bed"></i> 피지컬 운동 · 수면 관리 소견</div>
      <div class="ai-comment-workout" style="font-size: 8.8pt; color: var(--ink2); line-height: 1.6; text-align: justify; white-space: pre-wrap; letter-spacing: -0.2px;">운동 및 수면 관리 소견 로딩 중...</div>
    </div>

    <!-- 최종 합의 판결문 및 서명란 -->
    <div class="verdict" style="margin-top:15px; padding: 10px 14px;"><div class="vq" style="font-size: 10pt; line-height: 1.6;">현재 상태는 <em>2·1·2 · 내일을 향한 숨고르기</em>입니다.<br>선천적 뼈대는 탄탄하나 <em>대사 흡수(지금의 몸)</em>가 유일하게 막힌 병목 현상 상태이며,<br>이 대사 필터를 뚫어내면 최종 내야수 이상형인 <em>2·3·3 · 고효율 디젤엔진</em>으로 성장할 것입니다.</div></div>
    
    <p class="serif" style="text-align:center;font-size:10pt;color:var(--gold-d);margin-top:10px;margin-bottom:8px;">우리는 아이의 몸을 판정하지 않습니다. 설명하고, 함께 바꿉니다.<br>유전은 60% 설계도일 뿐, 후천 40%를 1년간 함께 채우겠습니다.</p>
    
    <div class="seal-wrap" style="margin-top:5px;">
      <!-- 공식 직인은 renderAIComment 내부에서 동적으로 갱신 주입됩니다 -->
    </div>
  </div>
</div>
</div>
"""
new_sheets[6] = re.sub(
    r'<div class="chapter"><span class="cn">9</span><span class="ck">실행 설계 · 실행 로드맵</span></div>.*',
    promise_roadmap_html,
    new_sheets[6],
    flags=re.DOTALL
)

# (7) 부록 시트 (new_sheets[7] -> INDEX 13)
# new_sheets[7] 에는 이미 6가지 속설이 완벽하게 정리되어 있으므로, 챕터 번호만 '부록'으로 단정하게 세팅합니다.
new_sheets[7] = new_sheets[7].replace(
    '<div class="chapter"><span class="cn">8</span><span class="ck">실행 설계 · 실행 전략 (처방에 앞서)</span></div>',
    '<div class="chapter"><span class="cn">부록</span><span class="ck">부모님이 자주 믿는 피지컬 성장 속설 · Physical Myths</span></div>'
)
new_sheets[7] = new_sheets[7].replace(
    '<h2>부모님이 자주 믿는 6가지 오해</h2>',
    '<h2>부모님이 자주 믿는 피지컬 성장 속설 3가지</h2>'
)

# ----------------------------------------------------
# 4. 전체 시트 한글 용어 정비 (양팔길이 순화 등)
# ----------------------------------------------------
for i in range(len(new_sheets)):
    new_sheets[i] = new_sheets[i].replace("<td>윙스팬</td>", "<td>양팔길이</td>")
    new_sheets[i] = new_sheets[i].replace("윙스팬·신장은 키 트랙에", "양팔길이·신장은 키 트랙에")
    new_sheets[i] = new_sheets[i].replace("윙스팬과 순발력", "양팔길이와 순발력")
    new_sheets[i] = new_sheets[i].replace("양팔 길이(윙스팬)가", "양팔길이가")
    new_sheets[i] = new_sheets[i].replace("윙스팬은 아직 성장 여력", "양팔길이는 아직 성장 여력")

# ----------------------------------------------------
# 5. HTML 바디 재조립
# ----------------------------------------------------
assembled_body = "\n".join(new_sheets)
revised_html = head_part + assembled_body + tail_part

# ----------------------------------------------------
# 6. 자바스크립트 용어 교정 및 기능 보완
# ----------------------------------------------------
revised_html = revised_html.replace('item === "윙스팬"', '(item === "윙스팬" || item === "양팔길이")')
revised_html = revised_html.replace(
    'inputs.current_height, inputs.current_weight, inputs.bmi, inputs.wingspan',
    'inputs.current_height, inputs.current_weight, inputs.bmi, (inputs.wingspan || inputs.yangpal_length)'
)
revised_html = revised_html.replace('BMI, 윙스팬) 상태를', 'BMI, 양팔길이) 상태를')

# ----------------------------------------------------
# 7. 자바스크립트 PAPS 사다리 차트 텍스트 겹침 방지 (Anti-Overlap) 정밀 패치!
# ----------------------------------------------------
ladder_overlap_pattern = r'if \(ladExpLabel\) \{\s*ladExpLabel\.setAttribute\("y", expY - 10\);\s*ladExpLabel\.textContent = `예상키 \${expHeightNow\.toFixed\(1\)}cm`;\s*\}'
new_ladder_overlap = """if (ladExpLabel) {
        let finalExpY = expY - 10;
        if (Math.abs(curY - expY) < 25) {
            finalExpY = curY > expY ? expY - 18 : expY + 26;
        }
        ladExpLabel.setAttribute("y", finalExpY);
        ladExpLabel.textContent = `예상키 ${expHeightNow.toFixed(1)}cm`;
    }"""
revised_html = re.sub(ladder_overlap_pattern, new_ladder_overlap, revised_html)

ladder_cur_overlap_pattern = r'if \(ladCurLabel\) \{\s*try \{\s*ladCurLabel\.setAttribute\("y", curY \+ 22\);\s*ladCurLabel\.textContent = `현재 \${curHeight\.toFixed\(1\)}cm`;\s*\}'
new_cur_ladder_overlap = """if (ladCurLabel) {
        try {
            let finalCurY = curY + 22;
            if (Math.abs(curY - expY) < 25) {
                finalCurY = curY > expY ? curY + 26 : curY - 18;
            }
            ladCurLabel.setAttribute("y", finalCurY);
            ladCurLabel.textContent = `현재 ${curHeight.toFixed(1)}cm`;
        }"""
revised_html = re.sub(ladder_cur_overlap_pattern, new_cur_ladder_overlap, revised_html)

# ----------------------------------------------------
# 8. doc-id 및 버전 v13.0 통일화 수술!
# ----------------------------------------------------
revised_html = revised_html.replace("DOC-333-0001", "DOC-333-v13.0")
revised_html = revised_html.replace("(engine v12.0)", "(engine v13.0)")
revised_html = revised_html.replace("engine: v12.0", "engine: v13.0")
revised_html = revised_html.replace("const biocode = data.biocode || \"2-1-2\";", "const biocode = data.biocode || \"2-1-2\";")

# ----------------------------------------------------
# 9. 자바스크립트의 renderAIComment 정의부 전면 개편!
# ----------------------------------------------------
new_render_comment_js = """function renderAIComment(comment, biocode = "2-1-2", persona = "내일을 향한 숨고르기") {
        const verdictVq = document.querySelector(".verdict .vq");
        const parentSheet = verdictVq ? verdictVq.closest(".sheet") : null;
        document.querySelectorAll(".temp-ai-sheet").forEach(el => el.remove());
        if (comment) {
            const cleanedComment = comment.replace(/teat/gi, "").replace(/test/gi, "");
            const parts = cleanedComment.split(/(?=###)/g);
            let introPart = parts[0] || "";
            if (introPart.includes("학부모")) {
                introPart = introPart.split(String.fromCharCode(10)).filter(p => !p.includes("학부모") && !p.includes("안녕하십니까")).join(String.fromCharCode(10)).trim();
            }
            if (verdictVq) verdictVq.innerHTML = parseMarkdown(introPart);
            const bodyParts = parts.slice(1);
            if (bodyParts.length > 0) {
                let paragraphsQueue = [];
                bodyParts.forEach(part => part.split(String.fromCharCode(10)).forEach(line => { if (line.trim()) paragraphsQueue.push(line.trim()); }));
                const MAX_CHARS_PER_PAGE = 850;
                let currentPageNum = 10, currentSheetEl = null, currentBodyContentEl = null, currentCharsCount = 0;
                function createNewSheet(pageNum, isFirst = false) {
                    const sheet = document.createElement("div");
                    sheet.className = "sheet temp-ai-sheet";
                    sheet.innerHTML = `<div class="ph"><span class="crest-sm"><i></i>PHYSICAL UP</span><span class="doc-id">PU-333-0418 · 소견</span></div><div class="section"><div class="body" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 250mm;"><div class="page-main-body"><div class="content-area"><div class="chapter"><span class="cn">10</span><span class="ck">종합 솔루션 · 피지컬업 소견</span></div><h2 style="color: var(--gold-d); margin-bottom: 18px;">피지컬업 맞춤소견</h2><div class="ai-comment-content" style="white-space: pre-wrap; margin-top: 15px; letter-spacing: -0.2px; font-size: 10.5pt; line-height: 1.7; color: var(--ink2);"></div></div><div class="bottom-seal-area" style="display: none; margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--line2);"></div></div><div class="pf" style="margin-top: auto; padding-top: 8px;"><span class="conf">Confidential</span><span class="pinfo-text">13세 · 중2 · 야구 내야수 신지오</span></div></div></div>`;
                    return sheet;
                }
                let lastInsertedSheet = parentSheet;
                paragraphsQueue.forEach(blockText => {
                    if (!currentSheetEl || (currentCharsCount + blockText.length > MAX_CHARS_PER_PAGE)) {
                        currentPageNum++;
                        const newSheet = createNewSheet(currentPageNum);
                        if (lastInsertedSheet && lastInsertedSheet.parentNode) lastInsertedSheet.parentNode.insertBefore(newSheet, lastInsertedSheet.nextSibling);
                        lastInsertedSheet = newSheet;
                        currentSheetEl = newSheet;
                        currentBodyContentEl = newSheet.querySelector(".ai-comment-content");
                        currentCharsCount = 0;
                    }
                    if (currentBodyContentEl) {
                        currentBodyContentEl.innerHTML += parseMarkdown(blockText) + "<br><br>";
                        currentCharsCount += blockText.length;
                    }
                });
                if (currentSheetEl) {
                    const bottomSeal = currentSheetEl.querySelector(".bottom-seal-area");
                    if (bottomSeal) { bottomSeal.style.display = "block"; bottomSeal.innerHTML = `<div class="seal-wrap" style="margin-top: 15px; display: flex; justify-content: flex-end; align-items: center; gap: 15px;"><div class="seal-text" style="font-size: 8.5pt; color: var(--ink3); text-align: right;"><b>PHYSICAL UP 333</b><br>(engine v13.0)</div><div class="seal" style="width: 76px; height: 76px; border: 2.5px solid var(--neg); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--neg); transform: rotate(-10deg);"><span style="font-size: 6pt;">PHYSICAL UP</span><span style="font-size: 13pt; font-weight: 900;">333</span></div></div>`; }
                }
            }
            const sealArea = document.querySelector(".seal-wrap");
            if (sealArea) {
                const codeParts = biocode.split("-").map(Number);
                if (summaryActEl) summaryActEl.innerHTML = actPrescription;
                if (summaryRetEl) summaryRetEl.innerHTML = retPrescription;

                // 스케줄 & 처방 보드 렌더링
                sealArea.innerHTML = `
                    <!-- 1년 정량 목표 수치 패널 (v13.0 프리미엄 보드 스타일) -->
                    <div style="border:1px solid rgba(176,138,62,.4); border-radius:9px; padding:12px; background:var(--page); margin:12px 0; box-shadow:0 1px 6px rgba(0,0,0,0.05); text-align:left;">
                        <div style="font-size: 10pt; font-weight: 700; color: var(--navy); margin-bottom: 8px; text-align: center; letter-spacing: 0.5px;">🎯 향후 1년간 1차 피지컬 도달 목표치</div>
                        <div style="display: flex; justify-content: space-around; text-align: center; gap: 8px;">
                            <div style="flex: 1; background: var(--mist); padding: 8px; border-radius: 6px; border: 1px solid var(--line2);">
                                <span style="font-size: 7.5pt; color: var(--ink3); display: block; margin-bottom:3px; font-weight:600;">1년 후 목표 신장</span>
                                <b style="font-size: 12.5pt; color: var(--navy); font-weight:900;">\${(parseFloat(inputs.current_height || 165.0) + (parseInt(biocode.split("-")[0]) === 1 ? 8.5 : (parseInt(biocode.split("-")[0]) === 3 ? 6.0 : 7.5))).toFixed(1)} cm</b>
                                <span style="font-size: 7pt; color: var(--pos); display: block; margin-top: 3px; font-weight:700;">현재 대비 +\${(parseInt(biocode.split("-")[0]) === 1 ? 8.5 : (parseInt(biocode.split("-")[0]) === 3 ? 6.0 : 7.5)).toFixed(1)}cm</span>
                            </div>
                            <div style="flex: 1; background: var(--mist); padding: 8px; border-radius: 6px; border: 1px solid var(--line2);">
                                <span style="font-size: 7.5pt; color: var(--ink3); display: block; margin-bottom:3px; font-weight:600;">1년 후 목표 체중</span>
                                <b style="font-size: 12.5pt; color: var(--navy); font-weight:900;">\${(parseFloat(inputs.current_weight || 48.0) + (parseInt(biocode.split("-")[0]) === 1 ? 12.0 : 10.0)).toFixed(1)} kg</b>
                                <span style="font-size: 7pt; color: var(--pos); display: block; margin-top: 3px; font-weight:700;">현재 대비 +\${(parseInt(biocode.split("-")[0]) === 1 ? 12.0 : 10.0).toFixed(1)}kg</span>
                            </div>
                            <div style="flex: 1; background: var(--mist); padding: 8px; border-radius: 6px; border: 1px solid var(--line2);">
                                <span style="font-size: 7.5pt; color: var(--ink3); display: block; margin-bottom:3px; font-weight:600;">1년 후 목표 골격근량</span>
                                <b style="font-size: 12.5pt; color: var(--navy); font-weight:900;">\${(parseFloat(inputs.skeletal_muscle || 20.0) + (parseInt(biocode.split("-")[0]) === 1 ? 7.2 : 6.0)).toFixed(1)} kg</b>
                                <span style="font-size: 7pt; color: var(--pos); display: block; margin-top: 3px; font-weight:700;">현재 대비 +\${(parseInt(biocode.split("-")[0]) === 1 ? 7.2 : 6.0).toFixed(1)}kg</span>
                            </div>
                        </div>
                    </div>

                    <!-- 333 피지컬 집중 처방전 카드 -->
                    <div style="background: rgba(201,168,76,0.06); border: 1.5px solid rgba(201,168,76,0.25); border-radius: 8px; padding: 15px; margin-bottom: 20px; margin-top:20px; text-align:left;">
                        <div style="font-size: 11pt; font-weight: 900; color: var(--gold-d); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid rgba(201,168,76,0.2); padding-bottom: 6px;">
                            <i class="fa-solid fa-file-prescription"></i> 333 피지컬 집중 처방전 <span style="font-size: 7.5pt; font-weight: normal; color: var(--text-muted); margin-left: auto;">오늘부터 실천할 3대 가이드</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 9.5pt; color: var(--text-main); line-height: 1.5;">
                            <div>\${absPrescription}</div>
                            <div style="border-top: 1px dashed rgba(201,168,76,0.2); padding-top: 8px;">\${actPrescription}</div>
                            <div style="border-top: 1px dashed rgba(201,168,76,0.2); padding-top: 8px;">\${retPrescription}</div>
                        </div>
                    </div>

                    <!-- 공식 직인 -->
                    <div class="seal-wrap" style="margin-top:15px; display:flex; justify-content:center; align-items:center; gap:15px;">
                        <div class="seal-text" style="font-size:9.5pt; color:var(--text-muted); line-height:1.6; text-align:center;">
                            <b style="font-size:11pt; color:var(--text-main); letter-spacing:0.5px;">PHYSICAL UP 333</b><br>
                            발행일: \${new Date().getFullYear()}.\${String(new Date().getMonth() + 1).padStart(2, '0')}.\${String(new Date().getDate()).padStart(2, '0')}<br>
                            <span style="font-size:8pt; opacity:0.65; letter-spacing:0.3px;">(engine v13.0)</span>
                        </div>
                        <div class="seal" style="flex-shrink:0; margin-left:5px;">
                            <span class="s-top">PHYSICAL UP</span>
                            <span class="s-mid">333</span>
                            <span class="s-bot">OFFICIAL</span>
                        </div>
                    </div>
                `;
            }
        }
        
        // === 27유형 입체 큐브 매트릭스 동적 하이라이트 및 이중 핀, 벡터 화살표 그리기 ===
        if (biocode) {
            document.querySelectorAll(".cube-group").forEach(el => {
                el.classList.remove("active");
            });
            
            // 1. 현재 핀 배치 (지오의 코드)
            const targetCube = document.getElementById(`cube-\${biocode}`);
            let curX = 360, curY = 135; // default fallback
            if (targetCube) {
                targetCube.classList.add("active");
                const topPolygon = targetCube.querySelector(".cube-top");
                if (topPolygon) {
                    const pointsStr = topPolygon.getAttribute("points");
                    const points = pointsStr.trim().split(/\\\\s+/).map(pt => pt.split(",").map(Number));
                    curX = points.reduce((sum, pt) => sum + pt[0], 0) / 4;
                    curY = points.reduce((sum, pt) => sum + pt[1], 0) / 4;
                    
                    const pinGroup = document.getElementById("cube-user-pin");
                    if (pinGroup) {
                        const pinDot = document.getElementById("cube-pin-dot");
                        const pinBg = document.getElementById("cube-pin-bg");
                        const pinText = document.getElementById("cube-pin-text");
                        
                        if (pinDot) { pinDot.setAttribute("cx", curX); pinDot.setAttribute("cy", curY); }
                        if (pinBg) { pinBg.setAttribute("x", curX - 48); pinBg.setAttribute("y", curY - 28); }
                        if (pinText) {
                            pinText.setAttribute("x", curX); pinText.setAttribute("y", curY - 16);
                            pinText.textContent = `\${targetName} \${biocode.replaceAll("-", "·")}`;
                        }
                    }
                }
            }
            
            // 2. 목표 핀 배치 (내야수 목표 2-3-3 또는 2-2-3)
            const targetCode = (biocode === "2-1-2" || biocode === "2-1-1") ? "2-3-3" : "2-3-3";
            const targetCubeObj = document.getElementById(`cube-\${targetCode}`);
            let tarX = 360, tarY = 135;
            if (targetCubeObj) {
                targetCubeObj.classList.add("active"); // 활성화 표시
                const topPolygon = targetCubeObj.querySelector(".cube-top");
                if (topPolygon) {
                    const pointsStr = topPolygon.getAttribute("points");
                    const points = pointsStr.trim().split(/\\\\s+/).map(pt => pt.split(",").map(Number));
                    tarX = points.reduce((sum, pt) => sum + pt[0], 0) / 4;
                    tarY = points.reduce((sum, pt) => sum + pt[1], 0) / 4;
                    
                    const tarGroup = document.getElementById("cube-target-pin");
                    if (tarGroup) {
                        tarGroup.style.display = "block"; // 노출 처리
                        const tarDot = document.getElementById("cube-target-dot");
                        const tarBg = document.getElementById("cube-target-bg");
                        const tarText = document.getElementById("cube-target-text");
                        
                        if (tarDot) { tarDot.setAttribute("cx", tarX); tarDot.setAttribute("cy", tarY); }
                        if (tarBg) { tarBg.setAttribute("x", tarX - 48); tarBg.setAttribute("y", tarY - 28); }
                        if (tarText) {
                            tarText.setAttribute("x", tarX); tarText.setAttribute("y", tarY - 16);
                            tarText.textContent = `내야수목표 \${targetCode.replaceAll("-", "·")}`;
                        }
                    }
                }
            }
            
            // 3. 성장 벡터 점선 화살표 연결 (오프셋 튜닝 반영!)
            if (targetCube && targetCubeObj && biocode !== targetCode) {
                let vectorArrow = document.getElementById("cube-vector-arrow");
                if (!vectorArrow) {
                    vectorArrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    vectorArrow.setAttribute("id", "cube-vector-arrow");
                    vectorArrow.setAttribute("stroke", "#0ea5e9");
                    vectorArrow.setAttribute("stroke-width", "2.8");
                    vectorArrow.setAttribute("stroke-dasharray", "4 3");
                    vectorArrow.setAttribute("marker-end", "url(#arrow)");
                    const pinGroup = document.getElementById("cube-user-pin");
                    if (pinGroup) {
                        pinGroup.parentNode.insertBefore(vectorArrow, pinGroup);
                    }
                }
                
                // 기하학적 각도 계산을 통한 오프셋 여백 조정
                const angle = Math.atan2(tarY - curY, tarX - curX);
                const startX = curX + 10 * Math.cos(angle);
                const startY = curY + 10 * Math.sin(angle);
                const endX = tarX - 16 * Math.cos(angle);
                const endY = tarY - 16 * Math.sin(angle);
                
                vectorArrow.setAttribute("x1", startX);
                vectorArrow.setAttribute("y1", startY);
                vectorArrow.setAttribute("x2", endX);
                vectorArrow.setAttribute("y2", endY);
                vectorArrow.style.display = "block";
            } else {
                const vectorArrow = document.getElementById("cube-vector-arrow");
                if (vectorArrow) vectorArrow.style.display = "none";
            }
            
            // 우측 바이오코드 진단 설명 카드의 동적 데이터 연동 복원!
            const userCodeVal = document.querySelector(".bc-user-code-val");
            if (userCodeVal) {
                userCodeVal.textContent = biocode.replaceAll("-", " · ");
            }
            
            const userPersonaVal = document.querySelector(".bc-user-persona-val");
            if (userPersonaVal) {
                const maturityText = (biocode === "2-1-2" || biocode === "2-1-1" || biocode.startsWith("1-")) ? "만숙성향" : "성장지향";
                userPersonaVal.textContent = `\${persona} (\${maturityText})`;
            }
        }

        // Standalone share buttons outside the card (appended at bottom of the main container)
        const container = document.querySelector(".container");
        if (container) {
            document.querySelectorAll(".mobile-external-share-area").forEach(el => el.remove());
            const externalShareArea = document.createElement("div");
            externalShareArea.className = "mobile-external-share-area";
            externalShareArea.style.cssText = "margin: 25px auto 45px auto; max-width: 340px; padding: 0 15px; text-align: center;";
            externalShareArea.innerHTML = `
                <div style="display: flex; gap: 10px; justify-content: center; width: 100%;">
                    <button onclick="shareToKakao()" style="flex: 1; height: 44px; background-color: #FEE500; color: #191919; border: none; border-radius: 8px; font-size: 10pt; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.12);">
                        💬 카카오톡 공유
                    </button>
                    <button onclick="copyReportLink()" style="flex: 1; height: 44px; background-color: var(--navy); color: white; border: none; border-radius: 8px; font-size: 10pt; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.12);">
                        🔗 결과 링크 복사
                    </button>
                </div>
            `;
            container.appendChild(externalShareArea);
        }
    }"""

# Slice replacement 기법으로 JS 렌더 부분 치환
import re
match_start = re.search(r'function\s+renderAIComment\s*\(', revised_html)
js_start = match_start.start() if match_start else -1

match_end = re.search(r'//\s*누적\s*성장\s*추이\s*차트\s*바인딩', revised_html)
js_end = match_end.start() if match_end else -1

if js_start != -1 and js_end != -1:
    revised_html = revised_html[:js_start] + new_render_comment_js + "\n\n    " + revised_html[js_end:]

# 최하단 호출부를 renderAIComment(data.ai_comment, biocode, persona) 로 단일화 연동!
revised_html = revised_html.replace(
    "renderAIComment(data.ai_comment, biocode);",
    "renderAIComment(data.ai_comment, biocode, persona);"
)
revised_html = revised_html.replace(
    "renderAIComment(data.ai_comment);",
    "renderAIComment(data.ai_comment, biocode, persona);"
)

# 10. 최종 조립된 HTML을 파일에 작성
with open(report_path, "w", encoding="utf-8") as f:
    f.write(revised_html)

print("SUCCESS: v13.0 report layout reassembled and compiled successfully!")
