import os

# Define file paths
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app", "static")
report_html_path = os.path.join(static_dir, "report.html")

print(f"Target file: {report_html_path}")

if not os.path.exists(report_html_path):
    print("Error: report.html not found.")
    exit(1)

# Read file with utf-8 encoding (ignoring errors to prevent encoding crash)
with open(report_html_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# 1. Insert 3.5 Chapter before 4 Chapter sheet start
# Find the exact occurrences of <div class="sheet">
target_marker = '<div class="sheet">'
occurrences = [i for i in range(len(content)) if content.startswith(target_marker, i)]

print(f"Found {len(occurrences)} occurrences of <div class=\"sheet\">")

# The 8th sheet (index 7) corresponds to line 554
# Let's target the occurrence around line 554. We can count the index or do a precise string match.
# Instead of line counting which might be offset, let's look for:
# "실행 설계 · 자기발전 로드맵" or "현재 진단 · 비교군" 
# Let's search for "현재 진단 · 비교군" which is near the target sheet start.
target_text = '현재 진단 · 비교군'
target_idx = content.find(target_text)

if target_idx != -1:
    # Find the nearest <div class="sheet"> before "현재 진단 · 비교군"
    sheet_idx = content.rfind('<div class="sheet">', 0, target_idx)
    if sheet_idx != -1:
        new_sheet_html = """<!-- 3.5장 누적 성장 추이 신설 -->
<div class="sheet" id="growth-history-section" style="display: none;">
  <div class="ph"><span class="doc-id">DOC-333-0001</span><span class="logo">PHYSICAL UP 333</span></div>
  <div class="chapter"><span class="cn">3.5</span><span class="ck">현재 몸 · 누적 성장 추이</span></div>
  <h2 style="margin-top: 15px; font-size: 15pt; color: var(--navy); font-weight: 800;">우리아이 누적 성장 추이 곡선</h2>
  <div class="box" style="text-align: center; padding: 25px; margin-top: 25px;">
    <img id="growth-history-chart-img" src="" style="max-width: 90%; height: auto; border-radius: 6px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" />
    <p class="src" id="growth-history-notice" style="margin-top: 20px; font-size: 10pt; color: var(--gold); font-weight: 700; text-align: center;"></p>
  </div>
  <div class="note" style="margin-top: 20px; padding: 15px 20px;">
    <b>성장 관리 가이드 — 꾸준함이 데이터를 만들고, 데이터가 성장을 증명합니다.</b>
    <p style="margin: 5px 0 0; line-height: 1.6; font-size: 9.5pt; color: var(--ink2);">아이가 자람에 따라 키와 몸무게는 일정한 주기(월 1회 권장)로 체크하는 것이 가장 과학적입니다. 점들이 모여 선이 되고, 그 선이 아이가 가야 할 최적의 성장 경로를 명확하게 제시해 줍니다. 매달 꾸준한 측정으로 변화를 확인하세요.</p>
  </div>
  <p class="src" style="margin-top: 30px;">근거: 질병관리청 소아청소년 표준 성장도표 / 자체 누적 신체 발달 데이터 추적.</p>
</div>

"""
        # Insert new_sheet_html before the matched sheet start
        content = content[:sheet_idx] + new_sheet_html + content[sheet_idx:]
        print("Success: Inserted 3.5 Chapter page!")
    else:
        print("Error: Could not find sheet tag before target text.")
else:
    print("Error: Could not find target text '현재 진단 · 비교군'")

# 2. Insert Javascript binding code inside DomContentLoaded handler
# Let's find "verdictVq.innerHTML = data.ai_comment.replaceAll" or "verdictVq"
js_marker = 'const verdictVq = document.querySelector(".verdict .vq");'
js_idx = content.find(js_marker)

if js_idx != -1:
    # Find the closing block of this if(verdictVq) block
    # Or simply insert our JS code right before it or inside the DOMContentLoaded end.
    # To be extremely safe, we can append our code right after verdictVq handling block.
    # Let's search for "const verdictVq = document.querySelector(\".verdict .vq\");" block end.
    target_block = """    const verdictVq = document.querySelector(".verdict .vq");
    if (verdictVq) {
        if (data.ai_comment) {
            verdictVq.innerHTML = data.ai_comment.replaceAll("\\n", "<br>");
        } else {
            verdictVq.innerHTML = `현재 상태는 <em>${biocode.replaceAll("-", "·")} · ${persona}</em>입니다.<br>아동 고유의 생활 루틴 and 대사 작용을 교정하여 잠재력을 최대로 실현하도록 권장합니다.`;
        }
    }"""
    
    # Check if target block exists (due to potential whitespace/newlines difference, let's find the nearest "}" after js_idx)
    # We can find the closing '}' of the if (verdictVq) block.
    # The if starts at line 1573. Let's find the next closing bracket.
    if_idx = content.find("if (verdictVq)", js_idx)
    if if_idx != -1:
        closing_idx = content.find("}", if_idx) # outer if close? No, outer if has two branches with internal brackets.
        # Let's find the exact block end by counting braces
        brace_count = 0
        block_end_idx = -1
        for i in range(if_idx, len(content)):
            if content[i] == '{':
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    block_end_idx = i + 1
                    break
        
        if block_end_idx != -1:
            js_binding_code = """
    // 누적 성장 추이 차트 바인딩
    const growthHistorySection = document.getElementById("growth-history-section");
    const growthHistoryChartImg = document.getElementById("growth-history-chart-img");
    const growthHistoryNotice = document.getElementById("growth-history-notice");
    if (growthHistoryChartImg && data.chart_growth_history) {
        if (growthHistorySection) growthHistorySection.style.display = "block";
        growthHistoryChartImg.src = data.chart_growth_history;
        
        const historyCount = data.history_count || 1;
        if (growthHistoryNotice) {
            if (historyCount <= 1) {
                growthHistoryNotice.innerText = "💡 이번이 첫 번째 측정입니다. 다음 달에 다시 측정하시면 멋진 누적 성장 추이 곡선이 그려집니다!";
            } else {
                growthHistoryNotice.innerText = `💡 총 ${historyCount}회의 누적 데이터를 기반으로 분석된 성장 추이 곡선입니다.`;
            }
        }
    }
"""
            content = content[:block_end_idx] + js_binding_code + content[block_end_idx:]
            print("Success: Inserted Javascript binding code!")
        else:
            print("Error: Could not find block end brace.")
    else:
        print("Error: Could not find 'if (verdictVq)' block start.")
else:
    print("Error: Could not find javascript marker.")

# Write back to file
with open(report_html_path, "w", encoding="utf-8") as f:
    f.write(content)
print("File report.html updated successfully!")
