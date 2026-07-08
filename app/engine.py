# PHYSICAL UP 333 - Scoring Engine v15.0 (Strict Concern Mode)
from datetime import datetime
from app.db import get_manse_info, get_biocode_pattern

# Growth percentage curve by age for boys and girls (approximated from CDC/Korean growth charts)
BOY_GROWTH_CURVE = {
    10: 0.81, 11: 0.84, 12: 0.88, 13: 0.92, 14: 0.95, 15: 0.975, 16: 0.99, 17: 0.997, 18: 1.0
}
GIRL_GROWTH_CURVE = {
    10: 0.85, 11: 0.89, 12: 0.93, 13: 0.965, 14: 0.985, 15: 0.995, 16: 1.0, 17: 1.0, 18: 1.0
}

def normalize_birth_date(birth_str):
    if not birth_str:
        return "2012-01-01"
    clean = "".join(c for c in str(birth_str) if c.isdigit())
    if len(clean) == 6:
        return f"20{clean[0:2]}-{clean[2:4]}-{clean[4:6]}"
    elif len(clean) == 8:
        return f"{clean[0:4]}-{clean[4:6]}-{clean[6:8]}"
    return str(birth_str)

def calculate_age(birth_date_str):
    """
    Calculate Korean standard age (or international age for growth charts)
    """
    try:
        norm_date = normalize_birth_date(birth_date_str)
        birth_date = datetime.strptime(norm_date, "%Y-%m-%d")
        today = datetime.now()
        age = today.year - birth_date.year
        # Adjust based on month/day for precise decimal age if needed, 
        # but integer age is fine for our table lookup.
        if (today.month, today.day) < (birth_date.month, birth_date.day):
            age -= 1
        return max(10, min(18, age))
    except:
        return 14 # default middle school age

def calculate_biocode(input_data):

    """
    input_data structure:
    {
        "name": str,
        "gender": str ("남" or "여"),
        "birth_date": str ("YYYY-MM-DD"),
        "grade": str,
        "sports": str,
        "position": str,
        "father_height": float,
        "mother_height": float,
        "current_height": float,
        "current_weight": float,
        "body_fat": float,
        "skeletal_muscle": float,
        "wingspan": float,
        "survey_responses": list of 24 ints (1 to 5)
    }
    """
    gender = input_data.get("gender", "남")
    birth_date = normalize_birth_date(input_data.get("birth_date", "2012-01-01"))
    father = input_data.get("father_height", 173.0)
    mother = input_data.get("mother_height", 160.0)
    height = input_data.get("current_height", 160.0)
    weight = input_data.get("current_weight", 50.0)
    fat = input_data.get("body_fat")
    if fat is None:
        fat = 18.0
    muscle = input_data.get("skeletal_muscle")
    if muscle is None:
        muscle = 22.0
    responses = input_data.get("survey_responses", [3]*24)
    
    # --- 0. Preprocess Survey Responses (24 문항, 1-indexed for mapping) ---
    # Convert list to 1-indexed dict for convenience
    raw_q = {i+16: responses[i] for i in range(24)}
    
    # Reverse reverse-scored questions: 6 - score (Disable: Done beforehand in frontend)
    rev_questions = []
    q = {}
    for q_idx in range(16, 40):
        q[q_idx] = raw_q.get(q_idx, 3)

    # Section Sums (8 questions each, range 8 to 40)
    absorption_score = sum(q[i] for i in range(16, 24))
    activity_score = sum(q[i] for i in range(24, 32))
    retention_score = sum(q[i] for i in range(32, 40))

    # --- 1. 선천 점수 (Body Code - 40점 만점) ---
    
    # 1-1. 유전키 (12.0점 만점)
    if gender == "남":
        mph = (father + mother + 13.0) / 2.0
        mph_score = ((mph - 165.0) / 15.0) * 12.0
    else:
        mph = (father + mother - 13.0) / 2.0
        mph_score = ((mph - 152.0) / 15.0) * 12.0
    mph_score = max(0.0, min(12.0, mph_score))
    
    # 1-2. 음양오행 (10.0점 만점)
    manse_info = get_manse_info(birth_date)
    five_elements = [
        manse_info.get('목', 0),
        manse_info.get('화', 0),
        manse_info.get('토', 0),
        manse_info.get('금', 0),
        manse_info.get('수', 0)
    ]
    # Calculate balance index (standard deviation of elements)
    import math
    mean_val = sum(five_elements) / 5.0
    variance = sum((x - mean_val) ** 2 for x in five_elements) / 5.0
    std_val = math.sqrt(variance)
    zero_count = five_elements.count(0)
    
    # Formula for 10-point scale: higher balance (lower std) = higher score
    five_elem_score = 10.0 - (zero_count * 1.5) - (std_val * 1.2)
    five_elem_score = max(3.0, min(10.0, five_elem_score))
    
    # 1-3. 사상의학 체질 (10.0점 만점)
    constitution_str = manse_info.get('체질', '소양인')
    if '소음인' in constitution_str:
        const_score = 3.0
    elif '소양인' in constitution_str:
        const_score = 7.0
    elif '태음인' in constitution_str:
        const_score = 10.0
    else:
        const_score = 7.0
        
    # 1-4. 성리학 심성정 멘탈 (8.0점 만점)
    mental_indicators = [raw_q[18], raw_q[20], raw_q[21], raw_q[23], raw_q[27], raw_q[30]]
    mental_avg = sum(mental_indicators) / len(mental_indicators)
    mental_score = 8.0 - (mental_avg - 1.0) * 1.5
    mental_score = max(1.0, min(8.0, mental_score))
    
    body_total = mph_score + five_elem_score + const_score + mental_score
    
    # --- 2. 대사 점수 (Metabolism Code - 35점 만점) ---
    
    # 2-1. 위장설문 (17.5점 만점)
    digest_score = (absorption_score / 40.0) * 17.5
    
    # 2-2. 인바디 대사 (17.5점 만점)
    muscle_ratio = (muscle / weight) * 100.0
    if muscle_ratio >= 52.0:
        muscle_score = 100.0
    elif muscle_ratio <= 38.0:
        muscle_score = 30.0
    else:
        muscle_score = 30.0 + ((muscle_ratio - 38.0) / 14.0) * 70.0
        
    if 12.0 <= fat <= 16.0:
        fat_score = 100.0
    elif fat < 12.0:
        fat_score = max(40.0, 100.0 - (12.0 - fat) * 12.0)
    else:
        fat_score = max(15.0, 100.0 - (fat - 16.0) * 10.0)
        
    bmi = weight / ((height / 100.0) ** 2)
    if 18.5 <= bmi <= 23.0:
        bmi_score = 100.0
    elif bmi < 18.5:
        bmi_score = max(35.0, 100.0 - (18.5 - bmi) * 18.0)
    else:
        bmi_score = max(25.0, 100.0 - (bmi - 23.0) * 12.0)
        
    inbody_total_pct = (muscle_score * 0.5) + (fat_score * 0.3) + (bmi_score * 0.2)
    inbody_metab_score = (inbody_total_pct / 100.0) * 17.5
    
    metab_total = digest_score + inbody_metab_score
    
    # --- 3. 생활 점수 (Behavior Code - 25점 만점) ---
    
    # 3-1. 수면/활동설문 (17.5점 만점)
    sleep_act_score = (activity_score / 40.0) * 17.5
    
    # 3-2. 위장설문 생활 가산 (2.5점 만점)
    digest_life_score = (absorption_score / 40.0) * 2.5
    
    # 3-3. 인바디 생활 가산 (5.0점 만점)
    inbody_life_score = (inbody_total_pct / 100.0) * 5.0
    
    behavior_total = sleep_act_score + digest_life_score + inbody_life_score

    # --- 4. BioCode 3자리 결정 및 27패턴 매칭 ---
    
    # Adjusted Cutoff thresholds for sports kids with higher physical targets
    # Shifting the normal distribution so average scores are classified as grade 1 (소비형)
    # Body (40 max): 0-26.0=1 (skinny/under target), 26.0-32.0=2, 32.0-40=3
    if body_total <= 26.0:
        body_grade = 1
    elif body_total <= 32.0:
        body_grade = 2
    else:
        body_grade = 3
        
    # Metabolism (35 max): 0-24.0=1 (absorption needs improvement), 24.0-29.0=2, 29.0-35=3
    if metab_total <= 24.0:
        metab_grade = 1
    elif metab_total <= 29.0:
        metab_grade = 2
    else:
        metab_grade = 3
        
    # Behavior (25 max): 0-12.0=1, 12.0-18.0=2, 18.0-25=3
    if behavior_total <= 12.0:
        behavior_grade = 1
    elif behavior_total <= 18.0:
        behavior_grade = 2
    else:
        behavior_grade = 3
        
    biocode = f"{body_grade}-{metab_grade}-{behavior_grade}"
    pattern_info = get_biocode_pattern(biocode)

    # --- 5. 예상키 기준 격차 분석 (Gap Tracking) ---
    age = calculate_age(birth_date)
    curve = BOY_GROWTH_CURVE if gender == "남" else GIRL_GROWTH_CURVE
    growth_pct = curve.get(age, 0.95)
    
    expected_height_now = mph * growth_pct
    height_gap = height - expected_height_now
    
    # Trace the main cause of lag if height is lagging (gap < 0)
    cause = "양호"
    if height_gap < -2.0:
        # Find the lowest score area
        scores = {
            "수면 및 활동량 부족": activity_score,
            "소화 및 영양 흡수 불량": absorption_score,
            "예민한 성향 및 심리 스트레스": 100 - mental_avg * 20 # scale mental
        }
        cause = min(scores, key=scores.get)
    
    # Map traditional Sasang constitution names to modern metabolic somatotype terms
    const_mapping = {
        "소양인": "이화-발산형 (Active Ectomorph)",
        "소음인": "동화-민감형 (Sensitive Mesomorph)",
        "태음인": "수축-저장형 (Storage Endomorph)",
        "태양인": "강발산-활동형 (Hyper-Ectomorph)"
    }
    
    display_constitution = "균형 대사형 (Balanced Metabolic Type)"
    for k, v in const_mapping.items():
        if k in constitution_str:
            display_constitution = v
            break

    # 6. Build the response payload
    return {
        "biocode": biocode,
        "body_score": round(body_total, 2),
        "metab_score": round(metab_total, 2),
        "behavior_score": round(behavior_total, 2),
        "body_grade": body_grade,
        "metab_grade": metab_grade,
        "behavior_grade": behavior_grade,
        "pattern_name": pattern_info["name"],
        "pattern_current": pattern_info["current"],
        "pattern_flaw": pattern_info["flaw"],
        "pattern_solution": pattern_info["solution"],
        "mph": round(mph, 1),
        "expected_height_now": round(expected_height_now, 1),
        "height_gap": round(height_gap, 1),
        "lag_cause": cause,
        "constitution": display_constitution,
        "five_elements": {
            "목": five_elements[0],
            "화": five_elements[1],
            "토": five_elements[2],
            "금": five_elements[3],
            "수": five_elements[4]
        },
        "bmi": round(bmi, 1),
        "muscle_ratio": round(muscle_ratio, 1)
    }
