import requests
import json
import os

OLLAMA_URL = os.environ.get("OLLAMA_API_URL", "http://localhost:11434/api/generate")
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "gemma4:latest") # Or llama3, gemma, etc.

def generate_ai_comment(student_name, biocode, constitution, height_gap, lag_cause, sports):
    """
    Calls local Ollama or Google Gemini to write a high-fidelity coach comment.
    Aligns perfectly with the backend engine's official prescriptions.
    """
    # 1. Parse BioCode grades for detailed diagnostic text
    grades = [int(x) for x in biocode.split('-')] if '-' in biocode else [2, 2, 2]
    body_g, metab_g, behavior_g = grades[0], grades[1], grades[2]
    
    body_desc = "선천적 피지컬 잠재력과 골격 구조가 비교적 튼튼하고 곧게 잡혀 있어 성장의 기초 동력이 견고한 상태입니다." if body_g == 3 else \
                "표준적인 유전적 성장 잠재력을 지니고 있으며 후천적인 습관 교정 및 영양 섭취량에 따라 성장 성과가 크게 달라지는 상태입니다." if body_g == 2 else \
                "선천적 골격 에너지와 기질적 활력이 다소 조심스럽게 형성되어 있어, 뼈 성장을 위한 후천적 자극이 필수적인 형태입니다."
                
    metab_desc = "위장의 영양소 소화 흡수력이 우수하고 대사 순환 효율이 원활하여 에너지가 뼈와 근육으로 온전히 전달되고 있습니다." if metab_g == 3 else \
                 "영양 흡수 및 체내 대사 기능이 일반적인 수준이나 소화 기관의 불필요한 과부하나 장내 불균형이 오지 않도록 부분적 식단 정리가 필요합니다." if metab_g == 2 else \
                 "소화기계(위장)의 영양분 흡수율이 크게 떨어져 있거나, 근육 성장을 유도하는 아미노산 대사가 정체되어 대사 효율을 개선해야 하는 구간입니다."
                 
    behavior_desc = "일상의 신체 활동과 취침 루틴이 성장을 돕는 방향으로 매우 훌륭하게 세팅되어 있어 호르몬 분비가 원활합니다." if behavior_g == 3 else \
                    "수면 리듬과 일일 활동량이 안정적이나, 엘리트 피지컬 목표 달성을 위해 수면 깊이 및 운동 강도를 부분 보완할 여지가 있습니다." if behavior_g == 2 else \
                    "늦은 숙면 유입, 운동량 결핍 또는 과도한 스트레스 노출 등 일상 습관에서 성장을 방해하는 제한 요인의 즉각적인 교정이 요구됩니다."

    # 2. Tailor advice based on Constitution
    const_advice = ""
    if "태음" in constitution or "수렴" in constitution or "저장" in constitution:
        const_advice = "수렴-저장형 대사 유형은 기운을 안으로 수렴하고 저장하는 성질이 강해 섭취한 영양이 쉽게 체지방으로 축적됩니다. 정제 탄수화물과 가공 당류를 조율하고, 골격을 형성하는 양질의 소고기, 두부 등의 단백질 및 무기질 중심 식단을 권장하며, 몸의 대사율을 활성화하기 위해 땀을 흘리는 중강도 유산소 운동을 반드시 병행해 주십시오."
    elif "소양" in constitution or "발산" in constitution or "순환" in constitution:
        const_advice = "순환-발산형 대사 유형은 신체의 열감과 에너지가 외부로 빠르게 발산되어 수분이 쉽게 마르고 건조해지는 특징을 보입니다. 장벽을 보호하는 양질의 지방과 돼지고기, 등푸른 생선, 해조류 위주의 보습 식단을 적극 추천하며, 무리하게 땀을 빼기보다는 충분한 수분 섭취와 함께 전신 스트레칭 중심의 부드러운 순환 운동을 병행해 주십시오."
    else:
        const_advice = "민감-조율형 대사 유형은 소화 기관의 흡수력이 비교적 약하고 신경계가 예민하여 스트레스나 과로 시 쉽게 체력이 저하되는 경향을 보입니다. 위장에 부담을 주지 않는 따뜻하고 부드러운 음식, 익힌 채소 및 소고기, 전복 등의 고영양 보양 식단을 추천하며, 수면 효율을 극대화하고 가벼운 스트레칭과 전신 마사지로 근피로를 즉각 풀어 주는 관리가 요구됩니다."

    # 3. Determine cause-specific prescription
    cause_solution = ""
    if "수면" in lag_cause or "활동" in lag_cause:
        cause_solution = "- 뼈 성장을 자극하기 위한 일 45분 이상의 중강도 저항성 운동 및 유산소 복합 운동 수행\n" \
                         "- 성장호르몬 분비 극대화를 위해 밤 10시 30분 이전 취침 및 암막 커튼 등을 활용한 깊은 수면 환경 조성"
    elif "소화" in lag_cause or "흡수" in lag_cause:
        cause_solution = "- 장내 미생물 환경 개선을 위한 프로바이오틱스 및 식이섬유 위주 식습관 적용\n" \
                         "- 소화 효소 분비를 촉진하기 위해 식사 시 30회 이상 천천히 씹기 및 식후 가벼운 15분 산책"
    elif "예민" in lag_cause or "스트레스" in lag_cause:
        cause_solution = "- 교감신경 긴장 해소를 위해 마그네슘, L-테아닌이 풍부한 식품 섭취\n" \
                         "- 숙면 및 심리 안정을 유도하는 가벼운 입욕 요법 및 취침 전 미온수 섭취, 명상 10분 진행"
    else:
        cause_solution = "- 현재의 모범적인 신체 발달 및 생활 리듬 유지를 권장\n" \
                         "- 주기적 성장 발달 측정 및 체력 한계 도달을 방지하는 정기 리커버리 요법 적용"

    # 4. Resolve the exact 3-axis report prescriptions
    abs_num, act_num, ret_num = body_g, metab_g, behavior_g
    
    abs_rule = "[식후 즉시 소화효소 보급] 위장 흡수 효율을 극대화하여 영양이 골격근으로 유입되게 돕습니다." if abs_num == 1 else \
               "[미량 영양소 보충] 뼈 성장을 돕는 칼슘 유입 효율 극대화를 위해 비타민D와 아연을 보완합니다." if abs_num == 2 else \
               "[단백질 & 수분 조율] 먹는 영양이 충분히 축적되므로 잉여 찌꺼기 억제를 위해 수분 공급을 늘립니다."
               
    act_rule = "[성장판 자극 루틴] 매일 가벼운 관절 물리 자극을 보존하기 위해 줄넘기 150회 루틴을 권장합니다." if act_num == 1 else \
               "[종목 맞춤 훈련 유지] 주 운동 종목에 요구되는 스피드와 민첩성 훈련을 평균 수준으로 유지합니다." if act_num == 2 else \
               "[오버트레이닝 주의] 활동 에너지가 매우 과하여 근피로가 높으므로 훈련 후 젖산 회복 마사지가 시급합니다."
               
    ret_rule = "[10시 30분 암막 골든수면] 밤 10시~새벽 2시 성장호르몬 집중 방출을 위해 완전 암막 침실을 구성합니다." if ret_num == 1 else \
               "[규칙적인 멜라토닌 리듬] 일정한 기상/취침 스케줄을 확보하여 성장 호르몬 분비 리듬을 유지합니다." if ret_num == 2 else \
               "[야식 금지 및 공복 취침] 에너지를 잘 저장하여 쉽게 체지방이 찌는 체형이므로 취침 2시간 전엔 공복을 유지합니다."

    # 5. Determine gap tone
    gap_analysis = f"현재 유전적으로 예측되는 신장 대비 약 {abs(height_gap):.1f}cm가량 뒤처져 있는 둔화 궤적을 보이고 있습니다." if height_gap < 0 else \
                   f"유전적 예상 궤적보다 약 {height_gap:.1f}cm가량 우수하게 자라나는 긍정적인 발달 궤적을 보여주고 있습니다."

    fallback_comment = f"### [1. 피지컬 성장 분석]\n" \
                       f"{student_name} 학생은 희망 종목인 {sports} 분야에서 요구되는 최종 목표 신체 규격 대비 현재 성장 속도 격차를 파악해 적극적인 조율이 필요합니다.\n" \
                       f"격차 분석 결과, {gap_analysis} {body_desc} 또한 {metab_desc} {behavior_desc}\n\n" \
                       f"### [2. 영양 및 소화 흡수 전략]\n" \
                       f"아이의 기질인 '{constitution}' 특성에 최적화된 맞춤형 장벽 보호 및 흡수율 극대화 식이 전략이 핵심입니다. {abs_rule} 또한 {const_advice}\n\n" \
                       f"### [3. 맞춤형 운동 및 수면 설계]\n" \
                       f"{sports} 종목에 최적화된 하체 뼈 길이 및 상체 wingspan 비율을 극대화하려면 맞춤 자극 요법이 동반되어야 합니다. 특히 공식 처방인 '{act_rule}' 및 '{ret_rule}'을 준수하며 다음 가이드를 결합하십시오:\n" \
                       f"{cause_solution}\n" \
                       f"이 가이드는 아이의 성장판 연골 세포 증식 능력을 극대화하여 목표 스펙에 빠르게 도달할 수 있도록 이끌어 줄 것입니다."

    prompt = f"당신은 엘리트 유소년 스포츠 피지컬 성장 전문가 그룹인 '피지컬업 333 피지컬 코칭 팀'입니다.\n" \
             f"당신의 역할은 독자적으로 새로운 피지컬 진단을 수행하거나 임의의 처방을 창작하는 것이 결코 아닙니다.\n" \
             f"오직 제공된 아래의 '[학생 정보]' 및 '[보고서 본문 공식 지침 및 처방]'에 담긴 엔진의 분석 결과와 팩트만을 바탕으로, " \
             f"학부모가 읽기 편하게 문맥을 다듬고 정리해주는 **교열/편집자(Text Polisher)**의 역할로 귀하의 모든 조언을 한정해 주십시오.\n\n" \
             f"[학생 및 진단 정보]\n" \
             f"- 아동 이름: {student_name}\n" \
             f"- 희망/진행 운동 종목: {sports}\n" \
             f"- 성장 등급 코드 (BioCode): {biocode} (선천-대사-생활 등급 순서)\n" \
             f"- 사상 체질: {constitution}\n" \
             f"- 유전 예상 신장 대비 현재 실측 신장 격차: {height_gap:.1f} cm (음수면 성장이 뒤처진 상태, 양수면 우수)\n" \
             f"- 성장의 주된 저해 원인: {lag_cause}\n\n" \
             f"[보고서 본문 공식 지침 및 처방 (엔진 소스)]\n" \
             f"1. 영양/소화 부문 처방: {abs_rule}\n" \
             f"   * 체질 식단 조언: {const_advice}\n" \
             f"2. 운동/활동 부문 처방: {act_rule}\n" \
             f"3. 수면/생활 부문 처방: {ret_rule}\n" \
             f"   * 생활 습관 보강안: {cause_solution.replace('- ', '')}\n\n" \
             f"작성 가이드라인 (반드시 철저히 준수할 것):\n" \
             f"1. **문장 개수 극단적 제한**: 리포트의 표 및 그래프가 돋보이도록 각 단락(1, 2, 3, 4)은 **반드시 2문장 이내(절대 3문장 초과 금지)**로 매우 짧고 명확하게 요약해 주세요. 장황한 인삿말이나 수식어는 절대 금지합니다.\n" \
             f"2. **엔진 소스 100% 정합성**: 위 '[보고서 본문 공식 지침 및 처방]' 외에 새로운 지침을 상상하여 추가하지 마십시오. 처방 문구를 교열하는 성격으로만 서술하십시오.\n" \
             f"3. 의료법 저촉 방지: '의학', '의사', '진단', '처방', '치료', '소견', '의료' 등 병원/의료 오인 소지가 있는 단어는 일절 사용하지 마십시오.\n" \
             f"4. 마크다운 단락 구성을 철저히 지키고, 불필요한 백틱(```), 특수 기호 없이 텍스트만 출력하세요:\n" \
             f"   - ### [1. 피지컬 성장 분석] : BioCode({biocode})와 유전 격차({height_gap:.1f}cm) 원인을 엔진 팩트 기반으로 요약 (2문장 이내)\n" \
             f"   - ### [2. 영양 및 소화 흡수 전략] : 공식 영양 처방 '{abs_rule}' 및 체질별 조언을 매끄럽게 다듬어 설명 (2문장 이내)\n" \
             f"   - ### [3. 맞춤형 운동 및 수면 설계] : 공식 운동 처방 '{act_rule}' 및 수면 처방 '{ret_rule}'을 매끄럽게 다듬어 설명 (2문장 이내)\n" \
             f"   - ### [4. 피지컬 코칭 종합 총평] : 부모님의 실천을 따뜻하게 독려하는 세련된 마무리 메시지 (2문장 이내)\n" \
             f"5. 학부모가 신뢰할 수 있는 차분하고 전문적인 '~입니다', '~합니다' 톤을 유지하십시오."

    # 1. Try Google Gemini API first if API key is provided
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            print(f"[AI Writer] Requesting Google Gemini API (gemini-2.5-flash) for {student_name} via native urllib...")
            import urllib.request
            import ssl
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
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
                    comment = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    comment = comment.replace("```html", "").replace("```json", "").replace("```", "").strip()
                    if comment:
                        print(f"[AI Writer] Successfully generated Gemini AI comment ({len(comment)} chars)")
                        return comment
        except Exception as e:
            print(f"[AI Writer] Google Gemini API call failed: {e}. Trying local Ollama next.")

    # 2. Try Local Ollama (Gemma) if offline/not configured
    payload = {
        "model": DEFAULT_MODEL,
        "prompt": prompt,
        "stream": False
    }

    try:
        print(f"[AI Writer] Requesting local Ollama ({DEFAULT_MODEL}) for {student_name}...")
        response = requests.post(OLLAMA_URL, json=payload, timeout=45.0)
        if response.status_code == 200:
            result = response.json()
            comment = result.get("response", "").strip()
            if comment:
                print(f"[AI Writer] Successfully generated local LLM comment ({len(comment)} chars)")
                return comment
    except Exception as e:
        print(f"[AI Writer] Local Ollama offline ({e}). Using rule-based fallback comment.")
        
    return fallback_comment


def ai_double_check_comment(student_name, biocode, constitution, height, weight, muscle, fat, original_comment):
    """
    AI 2차 최종 검수: 기존 소견서 내용(대표님이 수동 수정했거나 AI가 1차 자동 생성한 글)을 바탕으로
    아동의 실제 신체 스펙 데이터와의 수치적 모순을 최종 검증하고 오탈자와 문체 완성도를 정교하게 보정하는 2차 검수 모듈.
    """
    prompt = f"당신은 엘리트 유소년 피지컬 성장 분석 리포트의 수석 최종 검수관인 '피지컬업 333 피지컬 코칭 팀'입니다.\n" \
             f"제공된 {student_name} 학생의 실제 피지컬 데이터와 1차로 작성된 가이드 본문을 정밀히 비교 분석하여 " \
             f"오탈자를 최종 교열하고 내용적 모순을 수정한 완성도 극대화된 최종 피지컬 코칭 종합 가이드 본문만을 출력해 주세요. (잡담 및 ``` 등의 특수 기호는 제외할 것)\n\n" \
             f"[아동 피지컬 스펙 정보]\n" \
             f"- 아동 이름: {student_name}\n" \
             f"- 성장 코드 (BioCode): {biocode}\n" \
             f"- 사상 체질: {constitution}\n" \
             f"- 실측 스펙: 신장 {height}cm, 체중 {weight}kg, 골격근량 {muscle}kg, 체지방률 {fat}%\n\n" \
             f"[1차 작성 가이드 원본]\n" \
             f"{original_comment}\n\n" \
             f"[검수 및 최종 교열 가이드라인]\n" \
             f"1. **데이터 정합성 최종 확인**: 가이드 본문 내의 설명 중 아동의 실제 골격근량 수준이나 체지방량 기질이 수치 스펙과 모순되는 단어나 잘못 쓴 표현(예: 근육량이 표준 미달인데 높은 편이라고 언급된 오점 등)이 있다면 앞뒤 수치 정합성에 맞게 정교하게 문장을 수정해 주십시오.\n" \
             f"2. **분량 최소화 (핵심 요약)**: 리포트 디자인에 맞춰 각 단락(1, 2, 3, 4)의 텍스트 길이를 **최대 2~3문장 이내**로 극도로 압축하십시오. 군더더기 서술이나 반복적인 설명은 삭제하고, 오직 핵심 관찰 결과와 실천 지침만 드러나도록 요약하십시오.\n" \
             f"3. **맞춤법 및 문체 보정**: 오타와 띄어쓰기를 철저하게 보정하고, 문맥 흐름을 더욱 세련되게 다듬으십시오. 부모가 신뢰할 수 있도록 따뜻하면서도 과학적 권위가 있는 '~입니다', '~합니다' 톤을 견고하게 유지하십시오.\n" \
             f"4. **의료법 저촉 방지**: 가이드 내부에 '의학', '의사', '의학적 진단', '소견', '처방', '치료', '의료' 등 병원/의료 오해 소지가 있는 표현이나 '젬마', '잼마', '제미나이', 'AI' 등 인공지능 또는 특정 인물 이름이 있다면 이를 '피지컬업 333 피지컬 코칭 팀'의 피지컬 가이드 내용으로 정교하게 보정하십시오.\n" \
             f"5. **헤더 규격 및 단락 구조 유지**: 원본 가이드의 4대 단락 구조인 '### [1. 피지컬 성장 분석]', '### [2. 영양 및 소화 흡수 전략]', '### [3. 맞춤형 운동 및 수면 설계]', '### [4. 피지컬 코칭 종합 총평]' 헤더 구조는 반드시 100% 동일하게 지켜 주십시오.\n" \
             f"6. **공식 처방 보존**: 1차 작성 가이드에 언급된 보고서 공식 처방 문구(예: [식후 즉시 소화효소 보급], [성장판 자극 루틴], [10시 30분 암막 골든수면] 등 대괄호 안의 처방 제목과 지침 내용)는 절대 수정하거나 지우지 마시고 그대로 보존 및 보조하여 서술하십시오.\n" \
             f"7. 가이드라인 외의 해석이나 잡담 없이 오직 '최종 교열 완료된 가이드 원문'만 텍스트로 깔끔하게 반환하십시오."

    # 1. Gemini API 우선 기동
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            print(f"[AI 2차 검수] Google Gemini API (gemini-2.5-flash) 요청 중... ({student_name})")
            import urllib.request
            import ssl
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            data_bytes = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url, 
                data=data_bytes, 
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            ctx = ssl._create_unverified_context()
            with urllib.request.urlopen(req, context=ctx, timeout=25.0) as response:
                if response.status == 200:
                    res_data = json.loads(response.read().decode("utf-8"))
                    comment = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    comment = comment.replace("```html", "").replace("```json", "").replace("```", "").strip()
                    if comment:
                        print(f"[AI 2차 검수] 완료: Gemini API ({len(comment)} 자)")
                        return comment
        except Exception as e:
            print(f"[AI 2차 검수] Gemini API 실패: {e}. Ollama fallback 시도.")

    # 2. Local Ollama Fallback
    payload = {
        "model": DEFAULT_MODEL,
        "prompt": prompt,
        "stream": False
    }
    try:
        print(f"[AI 2차 검수] local Ollama ({DEFAULT_MODEL}) 요청 중...")
        response = requests.post(OLLAMA_URL, json=payload, timeout=40.0)
        if response.status_code == 200:
            result = response.json()
            comment = result.get("response", "").strip()
            if comment:
                print(f"[AI 2차 검수] 완료: Ollama LLM ({len(comment)} 자)")
                return comment
    except Exception as e:
        print(f"[AI 2차 검수] Fallback 실패 ({e}). 원본 텍스트를 그대로 유지합니다.")
        
    return original_comment


