import re

file_path = "update_report_v13.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. 교체할 신형 renderAIComment JS 코드 본체 (Raw string 또는 단순 string)
target_js_block = r"""new_render_comment_js = """ + '"""' + """function renderAIComment(comment, biocode = "2-1-2", persona = "내일을 향한 숨고르기") {
        const verdictVq = document.querySelector(".verdict .vq");
        const parentSheet = verdictVq ? verdictVq.closest(".sheet") : null;
        
        // Remove any old temp sheets if they exist
        document.querySelectorAll(".temp-ai-sheet").forEach(el => el.remove());
        
        if (comment) {
            const cleanedComment = comment.replace(/teat/gi, "").replace(/test/gi, "");
            
            // Split comment by ### headers
            const parts = cleanedComment.split(/(?=###)/g);
            
            let introPart = parts[0] || "";
            if (introPart.includes("학부모님께") || introPart.includes("부모님께") || introPart.includes("부모님") || introPart.includes("학부모")) {
                const paragraphs = introPart.split(new RegExp(String.fromCharCode(92) + String.fromCharCode(92) + "r?" + String.fromCharCode(92) + String.fromCharCode(92) + "n"));
                const filteredParagraphs = paragraphs.filter(para => {
                    const trimmed = para.trim();
                    if (!trimmed) return true;
                    if (trimmed.includes("학부모님께") || trimmed.includes("부모님께") || trimmed.includes("부모님") || trimmed.includes("학부모")) return false;
                    if (trimmed.includes("연구하고 지도하는") || trimmed.includes("전문가입니다") || trimmed.includes("연구하는 지도자")) return false;
                    if (trimmed.includes("안녕하십니까") || trimmed.includes("안녕하세요")) return false;
                    if (trimmed.includes("의학 고문으로서") || trimmed.includes("피지컬 코칭 팀입니다") || trimmed.includes("코칭 팀입니다")) return false;
                    if (trimmed.includes("정성껏 준비했습니다") || trimmed.includes("동반자가 되어") || trimmed.includes("감사드립니다")) return false;
                    if (trimmed.includes("소견서를 전달드립니다") || trimmed.includes("신뢰에 보답하고자")) return false;
                    if (trimmed.includes("자녀분의 건강한") || trimmed.includes("성장 의학 고문")) return false;
                    return true;
                });
                introPart = filteredParagraphs.join(String.fromCharCode(10)).trim();
            }
            
            if (verdictVq) {
                verdictVq.innerHTML = parseMarkdown(introPart);
            }
            
            const bodyParts = parts.slice(1);
            if (bodyParts.length > 0) {
                let paragraphsQueue = [];
                bodyParts.forEach(part => {
                    const rawLines = part.split(String.fromCharCode(10));
                    rawLines.forEach(line => {
                        const trimmed = line.trim();
                        if (trimmed) {
                            paragraphsQueue.push(trimmed);
                        }
                    });
                });
                
                const MAX_CHARS_PER_PAGE = 850;
                let currentPageNum = 10;
                let currentSheetEl = null;
                let currentBodyContentEl = null;
                let currentCharsCount = 0;
                
                function createNewSheet(pageNum, isFirst = false) {
                    const sheet = document.createElement("div");
                    sheet.className = "sheet temp-ai-sheet";
                    sheet.innerHTML = `
                        <div class="ph">
                            <span class="crest-sm"><i></i>PHYSICAL UP</span>
                            <span class="doc-id">PU-333-0418 · 소견</span>
                        </div>
                        <div class="section">
                            <div class="body" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 250mm;">
                                <div class="page-main-body">
                                    <div class="content-area">
                                        \\${isFirst ? `
                                            <div class="chapter"><span class="cn">10</span><span class="ck">종합 솔루션 · 피지컬업 소견</span></div>
                                            <h2 style="color: var(--gold-d); margin-bottom: 18px;">피지컬업 맞춤소견</h2>
                                        ` : `
                                            <div class="chapter"><span class="cn">10</span><span class="ck">종합 솔루션 · 피지컬업 소견 (계속)</span></div>
                                            <h2 style="color: var(--gold-d); margin-bottom: 18px; opacity: 0.5;">피지컬업 맞춤소견 (계속)</h2>
                                        `}
                                        <div class="ai-comment-content" style="white-space: pre-wrap; margin-top: 15px; letter-spacing: -0.2px; font-size: 10.5pt; line-height: 1.7; color: var(--ink2);"></div>
                                    </div>
                                    <div class="bottom-seal-area" style="display: none; margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--line2);"></div>
                                </div>
                                <div class="pf" style="margin-top: auto; padding-top: 8px;">
                                    <span class="conf">Confidential</span>
                                    <span class="pinfo-text">13세 · 중2 · 야구 내야수 신지오</span>
                                </div>
                            </div>
                        </div>
                    `;
                    return sheet;
                }
                
                let lastInsertedSheet = parentSheet;
                
                paragraphsQueue.forEach(blockText => {
                    const blockLength = blockText.length;
                    
                    if (!currentSheetEl || (currentCharsCount + blockLength > MAX_CHARS_PER_PAGE)) {
                        currentPageNum++;
                        const isFirstPage = (currentPageNum === 11);
                        const newSheet = createNewSheet(currentPageNum, isFirstPage);
                        
                        if (lastInsertedSheet && lastInsertedSheet.parentNode) {
                            lastInsertedSheet.parentNode.insertBefore(newSheet, lastInsertedSheet.nextSibling);
                        }
                        
                        lastInsertedSheet = newSheet;
                        currentSheetEl = newSheet;
                        currentBodyContentEl = newSheet.querySelector(".ai-comment-content");
                        currentCharsCount = 0;
                    }
                    
                    if (currentBodyContentEl) {
                        const parsedHTML = parseMarkdown(blockText);
                        currentBodyContentEl.innerHTML += parsedHTML + "<br><br>";
                        currentCharsCount += blockLength;
                    }
                });
                
                // 마지막 시트 하단에 직인 렌더링
                if (currentSheetEl) {
                    const bottomSeal = currentSheetEl.querySelector(".bottom-seal-area");
                    if (bottomSeal) {
                        bottomSeal.style.display = "block";
                        bottomSeal.innerHTML = `
                            <div class="seal-wrap" style="margin-top: 15px; display: flex; justify-content: flex-end; align-items: center; gap: 15px; border-top: none; padding-top: 0;">
                                <div class="seal-text" style="font-size: 8.5pt; color: var(--ink3); text-align: right; line-height: 1.6;">
                                    <b>PHYSICAL UP 333</b>
                                    발행일: \\${new Date().getFullYear()}.\\${String(new Date().getMonth() + 1).padStart(2, '0')}.\\${String(new Date().getDate()).padStart(2, '0')}<br>
                                    <span style="font-size: 7.5pt; opacity: 0.65;">(engine v13.0)</span>
                                </div>
                                <div class="seal" style="width: 76px; height: 76px; border: 2.5px solid var(--neg); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--neg); transform: rotate(-10deg); flex-shrink: 0; position: relative;">
                                    <span style="font-size: 6pt; font-weight: 700; letter-spacing: 0.5px;">PHYSICAL UP</span>
                                    <span style="font-size: 13pt; font-weight: 900; line-height: 1; margin: 1px 0;">333</span>
                                    <span style="font-size: 5.5pt; font-weight: 600; letter-spacing: 0.3px;">OFFICIAL</span>
                                </div>
                            </div>
                        `;
                    }
                }
            }
            
            const sealArea = document.querySelector(".seal-wrap");
            if (sealArea) {
                const codeParts = biocode.split("-").map(Number);
                const absNum = codeParts[0] || 2;
                const actNum = codeParts[1] || 2;
                const retNum = codeParts[2] || 2;
                
                let absPrescription = "";
                if (absNum === 1) absPrescription = "💊 <b>[식후 즉시 소화효소 보급]</b> 위장 흡수 효율을 극대화하여 영양이 골격근으로 유입되게 돕습니다.";
                else if (absNum === 2) absPrescription = "💊 <b>[미량 영양소 보충]</b> 뼈 성장을 돕는 칼슘 유입 효율 극대화를 위해 비타민D와 아연을 보완합니다.";
                else absPrescription = "💊 <b>[단백질 & 수분 조율]</b> 먹는 영양이 충분히 축적되므로 잉여 찌꺼기 억제를 위해 수분 공급을 늘립니다.";
                
                let actPrescription = "";
                if (actNum === 1) actPrescription = "🏃 <b>[성장판 자극 루틴]</b> 매일 가벼운 관절 물리 자극을 보존하기 위해 줄넘기 150회 루틴을 권장합니다.";
                else if (actNum === 2) actPrescription = "🏃 <b>[종목 맞춤 훈련 유지]</b> 주 운동 종목에 요구되는 스피드와 민첩성 훈련을 평균 수준으로 유지합니다.";
                else actPrescription = "🏃 <b>[오버트레이닝 주의]</b> 활동 에너지가 매우 과하여 근피로가 높으므로 훈련 후 젖산 회복 마사지가 시급합니다.";
                
                let retPrescription = "";
                if (retNum === 1) retPrescription = "🛌 <b>[10시 30분 암막 골든수면]</b> 밤 10시~새벽 2시 성장호르몬 집중 방출을 위해 완전 암막 침실을 구성합니다.";
                else if (retNum === 2) retPrescription = "🛌 <b>[규칙적인 멜라토닌 리듬]</b> 일정한 기상/취침 스케줄을 확보하여 성장 호르몬 분비 리듬을 유지합니다.";
                else retPrescription = "🛌 <b>[야식 금지 및 공복 취침]</b> 에너지를 잘 저장하여 쉽게 체지방이 찌는 체형이므로 취침 2시간 전엔 공복을 유지합니다.";

                const summaryAbsEl = document.querySelector(".bc-summary-abs");
                const summaryActEl = document.querySelector(".bc-summary-act");
                const summaryRetEl = document.querySelector(".bc-summary-ret");
                if (summaryAbsEl) summaryAbsEl.innerHTML = absPrescription;
                if (summaryActEl) summaryActEl.innerHTML = actPrescription;
                if (summaryRetEl) summaryRetEl.innerHTML = retPrescription;
            }
            
            // 우측 바이오코드 진단 설명 카드의 동적 데이터 연동 복원!
            const userCodeVal = document.querySelector(".bc-user-code-val");
            if (userCodeVal) {
                userCodeVal.textContent = biocode.replaceAll("-", " · ");
            }
            
            const userPersonaVal = document.querySelector(".bc-user-persona-val");
            if (userPersonaVal) {
                const maturityText = (biocode === "2-1-2" || biocode === "2-1-1" || biocode.startsWith("1-")) ? "만숙성향" : "성장지향";
                userPersonaVal.textContent = `\\${persona} (\\${maturityText})`;
            }
        }

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
    }` + '"""'

# 1. new_render_comment_js = """...""" 변수 정의 부분을 정규식으로 전면 치환
pattern_var = r'new_render_comment_js = ""\".*?\"""'
modified_content, count = re.subn(pattern_var, target_js_block, content, flags=re.DOTALL)

# 2. Slice replacement 및 find 로직도 절대 실패하지 않도록 통째로 단순 텍스트 교체!
target_find_logic_str = """# Slice replacement 기법으로 JS 렌더 부분 치환
js_start = revised_html.find("function renderAIComment(comment)")
if js_start == -1:
    js_start = revised_html.find("function renderAIComment(comment, biocode =")

js_end = revised_html.find("// 누적 성장 추이 차트 바인딩")

if js_start != -1 and js_end != -1:
    revised_html = revised_html[:js_start] + new_render_comment_js + "\\n\\n    " + revised_html[js_end:]"""

# target_find_logic_str이 이전에 에러난 슬라이스 로직으로 바뀌어 있는 상태일 수도 있으므로,
# 유연하게 search하여 교체합니다.
slice_pattern_search = r'# Slice replacement 기법으로 JS 렌더 부분 치환.*?revised_html = revised_html\[:js_start\].*?revised_html\[js_end:\]'

new_slice_logic_fixed = """# Slice replacement 기법으로 JS 렌더 부분 치환
import re
match_start = re.search(r'function\\\\s+renderAIComment\\\\s*\\\\(', revised_html)
js_start = match_start.start() if match_start else -1

match_end = re.search(r'//\\\\s*누적\\\\s*성장\\\\s*추이\\\\s*차트\\\\s*바인딩', revised_html)
js_end = match_end.start() if match_end else -1

if js_start != -1 and js_end != -1:
    revised_html = revised_html[:js_start] + new_render_comment_js + "\\n\\n    " + revised_html[js_end:]"""

# 덮어쓰기 실행
modified_content, count_slice = re.subn(slice_pattern_search, new_slice_logic_fixed, modified_content, flags=re.DOTALL)

if count > 0:
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(modified_content)
    print(f"SUCCESS: Patched new_render_comment_js and Slice replacement logic in {file_path} successfully!")
else:
    print("ERROR: Failed to match the target block.")
