import React, { useState } from "react";

// ─── 브랜드 컬러 ──────────────────────────────────────────────────────────────
const GOLD="#c9a84c", GOLD2="#e8c76a", GOLD3="#f5e0a0";
const NAVY="#0d1b3e", WHITE="#f0f4ff", MUTED="#3a5070";
const bg="linear-gradient(160deg,#060a14 0%,#0a1128 60%,#070c1c 100%)";
const font="'Apple SD Gothic Neo','Noto Sans KR',sans-serif";

// ─── 3D 큐브 컴포넌트 ─────────────────────────────────────────────────────────
const cubeCodeInfo = {
  '111':{nick:'텅빈창고',pct:12,type:'burner',tip:'소화효소+유산균으로 흡수 공장 가동이 최우선. 유산소 금지, 근력 운동 집중.'},
  '112':{nick:'빠른연료통',pct:9,type:'burner',tip:'연소가 빠르고 축적이 낮아 에너지 보충 주기를 짧게 가져가야 합니다.'},
  '113':{nick:'역설체형',pct:6,type:'burner',tip:'흡수는 낮지만 축적 경로는 열려 있어 장 환경 개선 시 빠른 체중 증가 가능.'},
  '121':{nick:'마른엔진',pct:8,type:'burner',tip:'흡수와 축적 모두 낮아 체중 증가에 시간이 걸립니다.'},
  '122':{nick:'날렵한선수',pct:7,type:'burner',tip:'스피드와 지구력은 좋으나 근육량 부족. 단백질 타이밍 관리가 핵심.'},
  '123':{nick:'숨은가능성',pct:5,type:'balanced',tip:'흡수는 낮지만 연소·축적 균형으로 영양 환경 개선 시 폭발적 성장 가능.'},
  '131':{nick:'에너지과부하',pct:4,type:'burner',tip:'연소력이 매우 높아 수면과 회복에 집중하세요.'},
  '132':{nick:'잠재형선수',pct:5,type:'balanced',tip:'지금은 마르지만 영양 관리로 빠르게 균형 체형으로 전환 가능합니다.'},
  '133':{nick:'변환형',pct:4,type:'balanced',tip:'흡수만 개선되면 에너지가 근육으로 전환될 준비가 되어 있습니다.'},
  '211':{nick:'영양소실',pct:7,type:'burner',tip:'흡수는 보통이지만 연소·축적이 낮아 섭취 에너지 대부분이 낭비됩니다.'},
  '212':{nick:'안정형',pct:6,type:'balanced',tip:'3축이 고르게 낮아 안정적이지만 성장 속도가 느립니다.'},
  '213':{nick:'선수형기반',pct:5,type:'balanced',tip:'흡수와 연소가 중간, 축적력이 높아 영양 집중 시 빠른 체중 증가 가능.'},
  '221':{nick:'기초탄탄',pct:6,type:'balanced',tip:'흡수·연소는 보통이지만 축적이 낮아 근육량 증가에 꾸준한 노력 필요.'},
  '222':{nick:'완벽균형',pct:8,type:'balanced',tip:'이상적인 균형 체질. 지금의 3축 균형을 유지하며 잔근육 밀도를 높이는 훈련.'},
  '223':{nick:'축적우세',pct:6,type:'balanced',tip:'균형형이지만 축적 경향이 강해 탄수화물 타이밍 관리가 필요합니다.'},
  '231':{nick:'연소강화',pct:5,type:'balanced',tip:'연소가 강해 에너지 보충 주기를 짧게 유지해야 근육 손실이 없습니다.'},
  '232':{nick:'선수기준',pct:6,type:'balanced',tip:'선수로서 이상적인 체질 구성. 훈련 강도를 높일수록 퍼포먼스가 비례 향상.'},
  '233':{nick:'전환주의',pct:5,type:'storer',tip:'균형형이지만 저장 경향이 강해 운동 없이 고칼로리 식이 시 지방 축적 위험.'},
  '311':{nick:'흡수과잉',pct:4,type:'burner',tip:'흡수는 좋지만 에너지 변환·축적이 안 되어 소화 부담이 생깁니다.'},
  '312':{nick:'흡수형선수',pct:5,type:'balanced',tip:'흡수력이 강점. 영양 공급만 잘 되면 안정적 성장을 기대할 수 있습니다.'},
  '313':{nick:'성장준비',pct:4,type:'balanced',tip:'흡수와 축적이 좋아 성장판이 열려 있는 시기에 집중적 영양 관리 권장.'},
  '321':{nick:'근육잠재',pct:5,type:'balanced',tip:'흡수와 연소가 좋아 운동 자극에 반응이 빠릅니다.'},
  '322':{nick:'엘리트형',pct:6,type:'balanced',tip:'흡수·연소·축적이 고르게 높은 엘리트형. 훈련 효율이 가장 좋은 체질.'},
  '323':{nick:'체중관리필요',pct:4,type:'storer',tip:'흡수·축적이 강해 칼로리 관리와 유산소 운동을 소홀히 하면 안 됩니다.'},
  '331':{nick:'대사활성화',pct:4,type:'storer',tip:'흡수·연소가 높지만 축적 경로도 열려 있어 운동 없이는 지방 축적 가능.'},
  '332':{nick:'저장우세',pct:5,type:'storer',tip:'전반적으로 높은 체질이지만 축적 경향이 강합니다. 유산소를 주 5회 이상.'},
  '333':{nick:'완전저장',pct:6,type:'storer',tip:'모든 축이 높아 지방 축적이 빠릅니다. 식이 관리+유산소가 퍼포먼스의 핵심.'},
};

// ─── 333 체질 코드 큐브 끝 ────────────────────────────────────────────────────
const mainType = {
  소비형: {
    emoji:"🏃", color:"#4fcfa0",
    goal:"목표 — 찌우기 · 흡수력 높이기",
    direction:"찌는 음식 · 소화효소 · 유산균 중심",
    food:["칼로리 밀도 높은 음식 위주 (견과류·아보카도·달걀·치즈)","따뜻하고 부드러운 찌는 음식 (죽·찜·국밥)","소량씩 자주 먹이기 — 하루 5~6회","차가운 음식·기름진 음식·밀가루 줄이기","소화 잘 되는 단백질 (두부·달걀찜·흰살생선)"],
    supplement:["소화효소제 — 식사 직전 복용","아연 — 식욕 증진, 성장 호르몬 활성화","유산균 — 장 흡수력 개선","비타민 B군 — 에너지 대사 보조","마그네슘 — 근육·신경 안정"],
    exercise:{title:"소화 돕고 근육 쌓기 중심",caution:"격렬한 유산소 금물! 운동 후 30분 내 고칼로리 간식 필수!",ratio:[{name:"스트레칭",pct:40,color:"#4fcfa0",desc:"소화기 자극·식욕 촉진. 식후 10~15분 가벼운 스트레칭이 흡수율을 높입니다."},{name:"소근육\n근력",pct:35,color:"#4f8ef7",desc:"팔굽혀펴기·철봉·밴드운동. 작은 근육부터 단계적으로 쌓습니다."},{name:"벌크업",pct:20,color:"#f7d24f",desc:"스쿼트·런지 가볍게. 살이 붙을 근육 자극이 목적입니다."},{name:"유산소",pct:5,color:"#f76f8e",desc:"산책 수준만. 에너지 소모를 최소화하는 게 핵심입니다."}]},
    life:["무리한 운동은 금물 — 에너지 소모 줄이기","식사 분위기를 따뜻하고 편안하게","강요 없이 즐거운 식사 환경 만들기"],
    caution:"강제로 많이 먹이면 역효과! 흡수력을 먼저 키우는 게 순서입니다.",
    tag:"찌우기 필요",
  },
  균형형: {
    emoji:"💪", color:"#4f8ef7",
    goal:"목표 — 현상태 관리",
    direction:"균형 식단 · 영양제로 컨디션 관리",
    food:["규칙적인 3끼 + 건강한 간식 유지","단백질·탄수화물·지방의 균형 잡힌 식단","다양한 색깔의 채소·과일 매일 섭취","잡곡밥·고구마 등 복합 탄수화물 위주","가공식품·인스턴트 줄이기"],
    supplement:["종합비타민 — 전반적 균형 유지","오메가3 — 두뇌 발달·집중력","비타민 D — 뼈 성장·면역","유산균 — 장 건강 예방적 관리","마그네슘 — 수면·근육 회복"],
    exercise:{title:"균형 잡힌 전신 컨디션 유지",caution:"주 3~4회, 40~60분이 이상적. 운동 후 충분한 수면으로 성장호르몬 극대화!",ratio:[{name:"스트레칭",pct:25,color:"#4fcfa0",desc:"준비·마무리 철저히. 유연성 유지가 부상 예방과 성장에 모두 도움됩니다."},{name:"소근육\n근력",pct:30,color:"#4f8ef7",desc:"코어·균형감 중심. 전신 근육을 고르게 자극해 균형 잡힌 성장을 만듭니다."},{name:"벌크업",pct:20,color:"#f7d24f",desc:"전신 복합 운동으로 근육 밀도 높이기. 지금 체형을 탄탄하게 유지합니다."},{name:"유산소",pct:25,color:"#f76f8e",desc:"심폐 기능 유지. 땀 흘리는 활동을 꾸준히 해줘야 이 균형이 지속됩니다."}]},
    life:["규칙적인 운동으로 현재 상태 유지","충분한 수면 — 성장호르몬 분비 핵심","수분 섭취 충분히"],
    caution:"지금 상태가 가장 이상적입니다. 과도한 영양제나 다이어트는 오히려 균형을 깹니다.",
    tag:"현상태 관리",
  },
  저장형: {
    emoji:"🏋️", color:"#f76f8e",
    goal:"목표 — 대사 높이기 · 체지방 관리",
    direction:"유산소 운동 · 저탄고단 · 대사 촉진",
    food:["정제 탄수화물 줄이고 잡곡으로 교체","고단백 저지방 위주 식단 (닭가슴살·두부·달걀)","포만감 높은 채소·식이섬유 먼저 먹기","야식·간식 시간대 조절 (저녁 7시 이후 금지)","천천히 꼭꼭 씹어 먹기 — 20분 이상"],
    supplement:["식이섬유 — 포만감·혈당 조절","마그네슘 — 인슐린 감수성 개선","비타민 D — 대사 기능 활성화","유산균 — 장내 미생물 균형·체중 조절","오메가3 — 체지방 분해 보조"],
    exercise:{title:"대사 높이고 체지방 태우기 중심",caution:"주 5회 이상, 하루 40분 이상 땀 흘릴 강도로. 쉬는 날도 산책 30분은 필수!",ratio:[{name:"스트레칭",pct:10,color:"#4fcfa0",desc:"준비·마무리만 간단히. 유산소와 근력에 시간을 더 투자하세요."},{name:"소근육\n근력",pct:15,color:"#4f8ef7",desc:"코어 강화 위주. 기초대사량을 올려 쉬는 동안에도 칼로리가 소모되게 합니다."},{name:"벌크업",pct:10,color:"#f7d24f",desc:"체지방 관리 우선. 과도한 근비대는 지금 단계에서 불필요합니다."},{name:"유산소",pct:65,color:"#f76f8e",desc:"인터벌 트레이닝 효과적. 빠르게 1분 + 쉬기 1분 반복으로 대사를 끌어올리세요."}]},
    life:["유산소 운동 강화 — 걷기·수영·자전거·줄넘기","하루 30분 이상 땀 흘리는 활동","엘리베이터 대신 계단, 생활 속 활동량 늘리기"],
    caution:"성장기 아이에게 무리한 식이 제한은 금물! 질 좋은 음식으로 배를 채우는 방향으로 접근하세요.",
    tag:"살빼기 필요",
  },
};

// ─── 세분류 ───────────────────────────────────────────────────────────────────
const subType = {
  결핍형: {emoji:"🫙",color:"#94a3b8",main:"소비형",codes:["111","112","121","211"],shortDesc:"흡수·연소·축적 세 축 모두 낮음",desc:"영양이 들어오는 양 자체가 부족합니다.",plus:"소화효소를 최우선으로 — 영양이 들어올 통로부터 열어야 합니다."},
  버너형: {emoji:"🔥",color:"#f97316",main:"소비형",codes:["331","231","321"],shortDesc:"흡수↑ 연소↑↑ 축적↓ — 빠르게 태워버리는 체질",desc:"흡수는 잘 되지만 에너지를 너무 빠르게 태워버려 살이 붙지 않습니다.",plus:"고칼로리 간식을 하루 2~3회 추가 — 태워도 남을 만큼 넣어줘야 합니다."},
  역류형: {emoji:"🌀",color:"#a78bfa",main:"소비형",codes:["131","132","133"],shortDesc:"흡수↓ 연소·축적 불안정",desc:"흡수가 안 되니 연소도 축적도 불안정합니다.",plus:"유산균·소화효소 집중 — 장 환경 개선이 최우선입니다."},
  빈그릇형: {emoji:"🏺",color:"#67e8f9",main:"소비형",codes:["311","312"],shortDesc:"흡수↑ 연소↓ 축적↓ — 흡수는 되는데 어디로 가는지 모름",desc:"흡수는 잘 되는데 연소도 축적도 안 됩니다.",plus:"비타민 B군 집중 — 흡수된 영양이 에너지로 전환되도록 대사 경로를 열어줍니다."},
  항온형: {emoji:"🌿",color:"#4ade80",main:"균형형",codes:["222","221","212","122"],shortDesc:"세 축 모두 보통 — 가장 안정적인 균형 체질",desc:"흡수·연소·축적이 모두 균형 잡혀 있습니다.",plus:"지금 이 상태가 이상적입니다. 규칙적인 식사와 수면만 잘 지켜주세요."},
  엔진형: {emoji:"⚡",color:"#fbbf24",main:"균형형",codes:["333","323"],shortDesc:"흡수↑ 연소↑ 축적↑ — 세 축 모두 활발",desc:"흡수·연소·축적이 모두 강합니다. 성장기에 가장 이상적인 체질입니다.",plus:"활동량에 맞는 충분한 식사량이 핵심입니다."},
  활화산형: {emoji:"🌋",color:"#fb923c",main:"균형형",codes:["332","322","232"],shortDesc:"흡수·연소 강 축적 보통 — 건강한 마름 경계",desc:"흡수와 연소가 강하고 축적은 보통입니다.",plus:"고칼로리 간식을 규칙적으로 추가 — 의식적으로 더 먹어야 균형이 유지됩니다."},
  저장고형: {emoji:"🏦",color:"#f472b6",main:"저장형",codes:["113","213","313"],shortDesc:"연소↓ 축적↑↑ — 조금 먹어도 잘 찜",desc:"흡수력에 관계없이 축적력이 매우 강합니다.",plus:"식이섬유·유산균 집중 — 장내 환경을 개선해 과도한 축적을 조절합니다."},
  둑형: {emoji:"🌊",color:"#38bdf8",main:"저장형",codes:["233","223","123"],shortDesc:"연소↓ 축적↑ — 먹은 게 그대로 쌓임",desc:"연소가 낮고 축적이 강합니다. 먹은 것이 그대로 체지방으로 쌓입니다.",plus:"유산소 운동이 최우선 — 낮은 연소력을 운동으로 끌어올리는 것이 핵심입니다."},
};

// ─── 코드 매핑 ────────────────────────────────────────────────────────────────
const codeMap = {};
Object.entries(subType).forEach(([name,info])=>info.codes.forEach(c=>{codeMap[c]=name;}));
for(let a=1;a<=3;a++) for(let b=1;b<=3;b++) for(let c=1;c<=3;c++){
  const k=`${a}${b}${c}`;
  if(!codeMap[k]){
    if(a<=1&&c>=2) codeMap[k]="역류형";
    else if(a>=3&&c<=1) codeMap[k]="버너형";
    else if(c>=3&&b<=1) codeMap[k]="저장고형";
    else if(c>=2&&b<=2) codeMap[k]="둑형";
    else if(a>=2&&b>=2&&c>=2) codeMap[k]="엔진형";
    else codeMap[k]="항온형";
  }
}

// ─── 27가지 멘트 ──────────────────────────────────────────────────────────────
const codeMents = {
  "111":{emoji:"🫙",nick:"텅빈창고",wit:"먹어도 먹어도 어디 가는지 모름. 몸이 블랙홀",tip:"소화효소 하나로 흡수 문 열면 게임 체인저!",rx:"아침 기상 직후 10분 내로 따뜻한 꿀물 한 잔부터 먹이세요. 식어버린 속을 데워야 다음 식사가 겨우 흡수됩니다."},
  "112":{emoji:"🍃",nick:"깃털몸매",wit:"먹는 건 취미. 살 찌는 건 남 얘기",tip:"유산균으로 장 깨우면 영양 흡수 신세계 등극!",rx:"간식 타임에 천연 유기농 무가당 땅콩버터 한 스푼을 먹이세요. 밥 양을 늘리는 것보다 칼로리 밀도를 높여야 살이 붙습니다."},
  "121":{emoji:"😶",nick:"식욕실종",wit:"식욕도 없고 소화도 안 됨. 위장이 휴가 중",tip:"아연 하나로 식욕 스위치 켜면 별세계 진입!",rx:"2주간 모든 가공음료와 이온음료를 전면 차단하세요. 입맛을 오염시키는 액상과당을 지워야 밥을 삼킵니다."},
  "211":{emoji:"💸",nick:"지출본능",wit:"잘 먹는 척하지만 몸은 아무것도 못 받음",tip:"따뜻한 음식 습관만으로 흡수력 최강 등극!",rx:"식탁에 백김치(낙산균)를 매일 배치하여 장내 영양소 흡수 통로를 복구하고, 식사 직후 10초 내로 땅콩버터 한 스푼을 즉시 먹이세요."},
  "331":{emoji:"🚀",nick:"소비대왕",wit:"살? 그런 거 모름. 먹으면 바로 연기됨 🔥",tip:"고칼로리 간식 하루 3번이면 근육맨 등극!",rx:"야간 훈련 종료 후 늦은 저녁밥을 전면 금지하세요. 훈련 직후 차 안에서 10분 내로 WPI 단백질 드링크를 신속 공급해야 합니다."},
  "231":{emoji:"💨",nick:"연기체질",wit:"잘 흡수하고 바로 태움. 몸이 24시간 난로",tip:"견과류·아보카도로 칼로리 올리면 파워업 완성!",rx:"운동 직후 차 안에서 10분 내로 WPI 단백질 드링크에 초코우유를 섞어 즉시 공급하여 근손실을 철벽 방어하세요."},
  "321":{emoji:"🪄",nick:"천생날씬",wit:"많이 먹어도 날씬. 친구들이 제일 부러워하는 타입",tip:"근력 운동 더하면 최강 스포츠 체질 완성!",rx:"밤늦게 야식으로 장기를 혹사하지 마세요. 저녁을 일찍 마감하고 완벽한 공복 상태로 숙면을 취해야 성장 호르몬이 폭발합니다."},
  "131":{emoji:"🌪️",nick:"영양미로",wit:"들어오기 싫다는 영양소와 매일 협상 중",tip:"유산균+소화효소 세트면 장 환경 혁명 가능!",rx:"아침 식사로 딱딱한 고형식 대신 따뜻한 죽을 차려주세요. 밑 빠진 독을 막으려면 장벽 복구용 유산균이 필수입니다."},
  "132":{emoji:"🤢",nick:"소화파업",wit:"소화기가 파업 선언. 먹어도 흡수 거부",tip:"식전 따뜻한 물 한 컵으로 소화기 레벨업!",rx:"구워 먹는 고기를 오늘부터 중단하세요. 기름기를 빼고 결을 연하게 찢은 부드러운 수육 형태로만 단백질을 공급해야 장벽이 열립니다."},
  "133":{emoji:"🚄",nick:"무사통과",wit:"먹는 족족 그냥 통과. 위장이 고속도로",tip:"꼭꼭 씹기만 해도 흡수율 폭발적으로 올라감!",rx:"찬 우유와 차가운 요구르트를 즉시 끊으세요. 영양이 씻겨 내려가지 않도록 식물성 김치 낙산균 유산균이 필수 처방입니다."},
  "311":{emoji:"🕳️",nick:"새는구멍",wit:"흡수는 천재. 저장은 꽝. 에너지 행방불명",tip:"비타민 B군으로 에너지 전환 경로 열면 최강!",rx:"훈련 전후 얼음물을 압수하세요. 급격한 방전을 막기 위해 상온 스포츠 카보샷 에너지젤을 차 안에 상시 지참시켜야 합니다."},
  "312":{emoji:"🏜️",nick:"모래성몸",wit:"잘 받아들이는데 쌓이질 않음. 모래성 체질",tip:"단백질 식사 후 스쿼트 10개면 근육 장착 시작!",rx:"체중계 숫자에 속지 마세요. 비계가 아닌 골격근량 중심의 신체 추이를 실시간으로 추적해야 정체기를 깹니다."},
  "222":{emoji:"⚖️",nick:"완벽균형",wit:"딱 평균. 근데 그게 제일 어려운 거임 💪",tip:"종합비타민 하나로 이미 상위 1% 관리 중!",rx:"시합 당일 6시간 영양 공백 타임라인을 스포츠 카보샷 영양젤로 철벽 방어하여 근손실을 원천 차단하세요."},
  "221":{emoji:"🎯",nick:"딱맞춤형",wit:"균형의 신. 먹는 것도 쓰는 것도 딱 맞음",tip:"오메가3 더하면 두뇌까지 완전체 등극!",rx:"성장기 최적의 경로입니다. 뼈대와 근육 경로가 정체되지 않도록 꾸준히 관리하세요."},
  "212":{emoji:"🔄",nick:"자동조절",wit:"몸이 알아서 다 조절함. 자동관리 체질",tip:"수면만 지키면 성장호르몬이 알아서 최강 만들어줌!",rx:"훈련 30분 전 바나나와 땅콩버터 조합을 필수 루틴으로 세팅하세요. 훈련 중 급격한 칼로리 방전을 막고 탄성 토크를 배가시킵니다."},
  "122":{emoji:"🌿",nick:"효율달인",wit:"조금 덜 받아도 잘 버팀. 효율의 달인",tip:"비타민 D 하나면 면역까지 무적 체질 완성!",rx:"훈련 직후 골든타임에 구운 가래떡을 즉시 공급하여 잉여 탄수화물 서지를 근육 세포로 먼저 밀어 넣으세요."},
  "333":{emoji:"⚙️",nick:"인간엔진",wit:"먹고 쓰고 쌓고. 다 잘함. 그냥 인간 엔진 ⚡",tip:"충분히 먹기만 해도 이미 운동선수 체질 완성!",rx:"경기 중 머리가 띵할 정도의 얼음물 섭취를 100% 금지하세요. 오직 상온 생수나 보리차만 마시게 제어해야 합니다."},
  "323":{emoji:"🏆",nick:"선수체질",wit:"흡수·연소·축적 풀옵션. 운동선수 기본 스펙",tip:"칼슘+비타민 D 추가하면 뼈까지 철갑 완성!",rx:"성장판 가속도가 정점인 시기입니다. 고함량 비타민D3 & 미네랄 영양제를 필수로 상시 복용시켜 뼈대 동화작용을 가속하세요."},
  "332":{emoji:"🌡️",nick:"인간화로",wit:"에너지 넘치는데 살은 안 찜. 인간 화로 🌋",tip:"운동 후 30분 내 단백질 간식으로 근육맨 등극!",rx:"시합 당일 갈증과 속열이 폭발할 때는 얼음물 대신 상온 보리차나 결명자차를 차 안에서 수시로 마시게 하여 대사 열을 식혀주세요."},
  "322":{emoji:"🎽",nick:"균형운동",wit:"잘 먹고 잘 태움. 체중계 숫자가 안 변함",tip:"마그네슘으로 회복 속도 올리면 슈퍼 선수 등극!",rx:"밥과 반찬의 비율을 1:1로 통제하는 식판 통제법을 가동하여 영양 불균형 진입을 예방하세요."},
  "232":{emoji:"🔋",nick:"항상웜업",wit:"보통으로 받아서 확 태움. 몸이 항상 웜업 중",tip:"고칼로리 간식으로 연료 채우면 무한 에너지 등극!",rx:"시합 당일 긴장으로 속이 미슥거릴 때는 억지로 밥을 먹이지 말고 소화 장벽에 부담 없는 액상 WPI 단백질로 대체하세요."},
  "113":{emoji:"🏦",nick:"절약본능",wit:"조금만 먹어도 몸이 저장함. 절약 본능 만렙 🏦",tip:"유산소+식이섬유로 대사 깨우면 체지방 관리 고수!",rx:"식사 직전 천연 식이섬유 파우더를 물에 타서 먼저 먹이세요. 인슐린 과분비를 제어하여 열량이 비계로 가기 전에 차단합니다."},
  "213":{emoji:"🪣",nick:"알뜰체질",wit:"흡수 보통인데 저장은 프로. 알뜰 체질",tip:"잡곡밥으로만 바꿔도 대사 혁명 시작!",rx:"밤늦게 편의점 삼각김밥이나 배달 야식을 가족 전체가 끈질기게 차단해야 합니다. 야식이 아침 기상 불능과 짜증의 주범입니다."},
  "313":{emoji:"🧊",nick:"냉동창고",wit:"잘 흡수하고 꽁꽁 쌓음. 몸이 냉동창고",tip:"줄넘기 20분이면 냉동창고에서 화덕으로 레벨업!",rx:"단기적으로 천연 아연 미네랄 영양제를 복용시키세요. 미각을 리셋해야 당분을 끊고 진짜 단백질을 갈구하는 정상 입맛이 됩니다."},
  "233":{emoji:"📦",nick:"적재본능",wit:"먹은 게 어디 안 감. 몸이 다 기억함 🌊",tip:"유산소 주 5회면 기억력 좋은 몸도 태울 수 있음!",rx:"탄산음료와 편의점 당류 간식을 집안에서 전면 퇴출하여 기민한 신체 탄성 토크를 회복시켜야 합니다."},
  "223":{emoji:"🛢️",nick:"저축대왕",wit:"태우기 싫어하는 몸. 에너지 저축왕",tip:"천천히 먹기+야식 금지만으로 체질 개조 가능!",rx:"운동 중 이온음료를 당장 끊으세요. 순수 미네랄 워터와 천연 아연 영양제 조합으로 전면 교체해야 대사 꼬임을 방어합니다."},
  "123":{emoji:"🔒",nick:"철벽저장",wit:"흡수는 적은데 저장은 철저. 알뜰의 끝판왕",tip:"단백질 식단으로 체지방 대신 근육 채우면 역대급!",rx:"억지로 밥 양을 늘리면 설사만 늘어납니다. 고강도 인터벌 줄넘기와 튜빙 밴드로 기초대사량을 강제로 끌어올려야 진짜 골격근이 됩니다."},
};

// ─── 성장 기준치 ──────────────────────────────────────────────────────────────
const growthRef = {
  24:{h:[80,82,84,86,89,91,93],w:[10.0,10.8,11.5,12.2,13.0,13.8,14.6]},
  36:{h:[88,90,93,96,99,101,104],w:[12.0,12.9,13.8,14.7,15.7,16.7,17.7]},
  48:{h:[95,97,100,103,106,109,112],w:[13.5,14.6,15.6,16.7,17.8,19.0,20.2]},
  60:{h:[101,104,107,110,114,117,120],w:[14.8,16.0,17.2,18.5,19.8,21.1,22.5]},
  72:{h:[107,110,114,117,121,124,127],w:[16.3,17.7,19.1,20.6,22.2,23.8,25.5]},
  84:{h:[112,116,120,123,127,131,134],w:[18.0,19.5,21.2,23.0,24.9,26.8,28.9]},
  96:{h:[117,121,125,129,133,137,141],w:[19.7,21.5,23.4,25.5,27.7,30.0,32.5]},
  108:{h:[122,126,130,134,138,143,147],w:[21.5,23.5,25.7,28.1,30.7,33.4,36.3]},
  120:{h:[126,131,135,140,144,149,153],w:[23.4,25.7,28.2,31.0,34.0,37.2,40.6]},
  132:{h:[130,135,140,145,150,154,159],w:[25.4,28.1,31.0,34.2,37.7,41.4,45.4]},
  144:{h:[134,139,144,149,155,160,165],w:[27.6,30.7,34.0,37.7,41.7,45.8,50.3]},
  156:{h:[138,143,148,154,159,165,170],w:[30.2,33.7,37.5,41.7,46.2,50.9,55.9]},
  168:{h:[142,148,153,158,164,169,175],w:[33.2,37.1,41.4,46.1,51.2,56.5,62.1]},
};

function calcAgeFromShort(str) {
  if(!str||str.length!==6) return null;
  const yy=parseInt(str.slice(0,2)),mm=parseInt(str.slice(2,4)),dd=parseInt(str.slice(4,6));
  if(mm<1||mm>12||dd<1||dd>31) return null;
  const now=new Date(), fullYear=yy<=now.getFullYear()%100?2000+yy:1900+yy;
  const b=new Date(fullYear,mm-1,dd);
  if(isNaN(b.getTime())) return null;
  const months=(now.getFullYear()-b.getFullYear())*12+(now.getMonth()-b.getMonth());
  if(months<0||months>240) return null;
  return {months,years:Math.floor(months/12),display:`만 ${Math.floor(months/12)}세 ${months%12}개월`};
}

function calcPercentile(val,refs) {
  const pcts=[3,10,25,50,75,90,97];
  if(val<=refs[0]) return 3;
  if(val>=refs[6]) return 97;
  for(let i=0;i<6;i++) if(val>=refs[i]&&val<=refs[i+1]){
    return Math.round(pcts[i]+(val-refs[i])/(refs[i+1]-refs[i])*(pcts[i+1]-pcts[i]));
  }
  return 50;
}

function getGrowthData(months,height,weight) {
  if(!months||!height||!weight) return null;
  const keys=Object.keys(growthRef).map(Number).sort((a,b)=>a-b);
  const closest=keys.reduce((a,b)=>Math.abs(b-months)<Math.abs(a-months)?b:a);
  const ref=growthRef[closest];
  const bmi=(weight/((height/100)**2)).toFixed(1);
  const hPct=calcPercentile(height,ref.h);
  const wPct=calcPercentile(weight,ref.w);
  return {
    bmi,hPct,wPct,
    stdH:ref.h[3],stdW:ref.w[3],
    diffH:(height-ref.h[3]).toFixed(1),
    diffW:(weight-ref.w[3]).toFixed(1),
    targetH:ref.h[5], // 90th
    targetW90:ref.w[5],
    targetW85:Math.round((ref.w[4]+ref.w[5])/2*10)/10,
    targetW15:Math.round((ref.w[0]+ref.w[1])/2*10)/10,
  };
}

function getPctLabel(pct) {
  const n=typeof pct==="number"?pct:parseInt(pct);
  if(isNaN(n)) return {label:"하위 3%",color:"#f76f8e",comment:"또래 100명 중 하위 3명 수준"};
  if(n<=3)  return {label:"하위 3%", color:"#f76f8e",comment:"또래 100명 중 하위 3명 수준"};
  if(n<=10) return {label:"하위 10%",color:"#f97316",comment:"또래 100명 중 하위 10명 수준"};
  if(n<=25) return {label:"하위 25%",color:"#f7d24f",comment:"또래 100명 중 하위 25명 수준"};
  if(n<=75) return {label:`상위 ${100-n}%`,color:"#4fcfa0",comment:"또래 100명 중 중간 범위"};
  if(n<=90) return {label:`상위 ${100-n}%`,color:"#4f8ef7",comment:`또래 100명 중 상위 ${100-n}명 수준`};
  if(n<=97) return {label:`상위 ${100-n}%`,color:"#a78bfa",comment:`또래 100명 중 상위 ${100-n}명 수준`};
  return {label:"상위 3%",color:"#a78bfa",comment:"또래 최상위권"};
}

// ─── 설문 문항 ────────────────────────────────────────────────────────────────
// ─── 90문항 풀 ────────────────────────────────────────────────────────────────
const questionPool = {
  // 흡수력 — dir:1(항상=흡수좋음/정방향), dir:-1(역방향) · 역방향 9개(30%)
  absorb: [
    {id:"a1",text:"식당에 가면 메뉴판을 꼼꼼히 본다",dir:1},
    {id:"a2",text:"음식 냄새만 맡아도 배가 고파진다",dir:1},
    {id:"a3",text:"밥상 앞에 앉으면 입맛이 없다",dir:-1},
    {id:"a4",text:"반찬도 골고루 잘 먹는다",dir:1},
    {id:"a5",text:"밥 냄새 맡으면 저절로 주방으로 간다",dir:1},
    {id:"a6",text:"배탈이 자주 나는 편이다",dir:-1},
    {id:"a7",text:"새로운 음식도 호기심 있게 먹어본다",dir:1},
    {id:"a8",text:"한 번 먹을 때 양이 많은 편이다",dir:1},
    {id:"a9",text:"편식이 심해서 먹는 게 한정적이다",dir:-1},
    {id:"a10",text:"화장실을 매일 시원하게 다녀온다",dir:1},
    {id:"a11",text:"급식 메뉴가 대체로 다 맛있다",dir:1},
    {id:"a12",text:"먹어도 영양분이 흡수가 안 되는 느낌이다",dir:-1},
    {id:"a13",text:"밥을 남기지 않고 다 먹는다",dir:1},
    {id:"a14",text:"음식 사진만 봐도 침이 고인다",dir:1},
    {id:"a15",text:"아침밥을 잘 못 먹는다",dir:-1},
    {id:"a16",text:"식사 시간을 기다린다",dir:1},
    {id:"a17",text:"외식하면 평소보다 더 잘 먹는다",dir:1},
    {id:"a18",text:"영양제를 먹으면 속이 불편하다",dir:-1},
    {id:"a19",text:"배고프다는 말을 자주 한다",dir:1},
    {id:"a20",text:"맛집 가자고 먼저 조른다",dir:1},
    {id:"a21",text:"입이 짧아서 조금만 먹어도 그만이다",dir:-1},
    {id:"a22",text:"새 반찬이 나오면 먼저 맛본다",dir:1},
    {id:"a23",text:"밥 먹는 속도가 또래보다 느리다",dir:-1},
    {id:"a24",text:"먹는 걸 좋아한다고 자주 말한다",dir:1},
    {id:"a25",text:"한 그릇 뚝딱 비우고 더 달라고 한다",dir:1},
    {id:"a26",text:"먹는 것에 별로 관심이 없다",dir:-1},
    {id:"a27",text:"맛있게 먹고 소화도 잘 시킨다",dir:1},
    {id:"a28",text:"우유나 기름진 음식 먹으면 배가 아프다",dir:-1},
    {id:"a29",text:"먹고 싶은 음식이 늘 분명하다",dir:1},
    {id:"a30",text:"간식을 입에 달고 산다",dir:1},
  ],
  // 연소력 — 역방향 9개(30%)
  burn: [
    {id:"b1",text:"쉬는 시간이면 어느새 매점 앞에 와 있다",dir:1},
    {id:"b2",text:"밥 먹고 1시간도 안 돼서 또 배고프다",dir:1},
    {id:"b3",text:"조금만 움직여도 쉽게 지친다",dir:-1},
    {id:"b4",text:"가만히 있질 못하고 항상 움직인다",dir:1},
    {id:"b5",text:"체육 시간을 제일 기다린다",dir:1},
    {id:"b6",text:"추위를 많이 타고 손발이 차갑다",dir:-1},
    {id:"b7",text:"운동하고 나면 꼭 뭔가 먹어야 한다",dir:1},
    {id:"b8",text:"아침에 일어나면 몸이 무겁고 처진다",dir:-1},
    {id:"b9",text:"조금만 뛰어도 땀이 엄청 난다",dir:1},
    {id:"b10",text:"활동량이 적고 느긋한 편이다",dir:-1},
    {id:"b11",text:"학교 마치고 오면 항상 배고프다",dir:1},
    {id:"b12",text:"쉽게 피곤하다고 말한다",dir:-1},
    {id:"b13",text:"걸을 때보다 뛸 때가 더 많다",dir:1},
    {id:"b14",text:"몸 쓰는 활동을 귀찮아한다",dir:-1},
    {id:"b15",text:"친구들이 지쳐도 혼자 멀쩡하다",dir:1},
    {id:"b16",text:"운동회 날이 제일 신난다",dir:1},
    {id:"b17",text:"숨이 차도 끝까지 뛰어다닌다",dir:1},
    {id:"b18",text:"먹는 양에 비해 살이 잘 안 찐다",dir:1},
    {id:"b19",text:"하루 대부분을 실내에서 보낸다",dir:-1},
    {id:"b20",text:"활동량 많은 날 컨디션이 더 좋다",dir:1},
    {id:"b21",text:"에너지가 넘친다는 말을 자주 듣는다",dir:1},
    {id:"b22",text:"늘 나른하고 졸려 한다",dir:-1},
    {id:"b23",text:"몸 쓰는 놀이를 좋아한다",dir:1},
    {id:"b24",text:"아침부터 활발하게 움직인다",dir:1},
    {id:"b25",text:"움직이기보다 쉬는 걸 더 좋아한다",dir:-1},
    {id:"b26",text:"잠시도 쉬지 않고 뛰어다닌다",dir:1},
    {id:"b27",text:"몸에서 열이 많은 편이다",dir:1},
    {id:"b28",text:"운동 후 회복이 빠르다",dir:1},
    {id:"b29",text:"동작이 빠르고 날쌔다",dir:1},
    {id:"b30",text:"하루 종일 뛰어놀아도 안 지친다",dir:1},
  ],
  // 축적력 — 역방향 9개(30%)
  store: [
    {id:"s1",text:"배부르면 기분이 좋아진다",dir:1},
    {id:"s2",text:"조금만 먹어도 금방 살이 찐다",dir:1},
    {id:"s3",text:"아무리 먹어도 살이 안 붙는다",dir:-1},
    {id:"s4",text:"단 음식이나 밀가루 음식을 유독 좋아한다",dir:1},
    {id:"s5",text:"체중이 늘 제자리고 잘 안 는다",dir:-1},
    {id:"s6",text:"냉장고 문을 하루에 10번은 열어본다",dir:1},
    {id:"s7",text:"마른 편이라 살 좀 쪘으면 좋겠다",dir:-1},
    {id:"s8",text:"먹고 자면 살이 더 찐다",dir:1},
    {id:"s9",text:"또래보다 마르고 가벼운 편이다",dir:-1},
    {id:"s10",text:"또래보다 체중이 많이 나간다",dir:1},
    {id:"s11",text:"야식 먹으면 다음날 바로 티가 난다",dir:1},
    {id:"s12",text:"많이 먹어도 체중 변화가 거의 없다",dir:-1},
    {id:"s13",text:"물만 마셔도 살찐다는 말이 공감된다",dir:1},
    {id:"s14",text:"살이 잘 안 쪄서 고민이다",dir:-1},
    {id:"s15",text:"군것질을 자주 한다",dir:1},
    {id:"s16",text:"입맛이 없어 끼니를 거를 때가 많다",dir:-1},
    {id:"s17",text:"한번 먹기 시작하면 멈추기 어렵다",dir:1},
    {id:"s18",text:"먹어도 금방 다시 홀쭉해진다",dir:-1},
    {id:"s19",text:"밤에 야식 생각이 자주 난다",dir:1},
    {id:"s20",text:"체격이 또래보다 왜소하다",dir:-1},
    {id:"s21",text:"먹는 걸로 스트레스를 푼다",dir:1},
    {id:"s22",text:"한 끼 굶어도 끄떡없다",dir:1},
    {id:"s23",text:"간식을 늘 가까이 둔다",dir:1},
    {id:"s24",text:"체격이 또래보다 큰 편이다",dir:1},
    {id:"s25",text:"먹을 것 앞에서 참기 힘들어 한다",dir:1},
    {id:"s26",text:"통통하다는 말을 자주 듣는다",dir:1},
    {id:"s27",text:"잘 먹어서 든든하다는 말을 듣는다",dir:1},
    {id:"s28",text:"밥 먹고 나서 든든함이 오래간다",dir:1},
    {id:"s29",text:"끼니 사이에도 간식을 챙겨 먹는다",dir:1},
    {id:"s30",text:"먹는 양에 비해 살이 잘 찐다",dir:1},
  ]
};

// 랜덤 추출 함수 (각 테마에서 6개씩 = 18문항)
function getRandomQuestions(){
  function shuffle(arr){
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  return [
    ...shuffle(questionPool.absorb).slice(0,6),
    ...shuffle(questionPool.burn).slice(0,6),
    ...shuffle(questionPool.store).slice(0,6),
  ];
}

const parentQuestions = getRandomQuestions();
const kidQuestions = [];

// ─── 분석 함수 ────────────────────────────────────────────────────────────────
function analyze(pAns,kAns) {
  let a=0,b=0,c=0;
  parentQuestions.forEach(q=>{
    const idx=pAns[q.id];
    if(idx!==undefined){
      // 전혀(0)~항상(3) · dir:1 정방향, dir:-1 역방향(뒤집기)
      const score=q.dir===-1?(3-idx):idx;
      if(q.id.startsWith('a')) a+=score;
      else if(q.id.startsWith('b')) b+=score;
      else if(q.id.startsWith('s')) c+=score;
    }
  });
  // 각 축 6문항 × 최대3점 = 0~18점 → 1~3점
  const toScore=v=>v>=12?3:v>=6?2:1;
  const aScore=toScore(a);
  const bScore=toScore(b);
  const cScore=toScore(c);
  const code=`${aScore}${bScore}${cScore}`;
  const sub=codeMap[code]||"항온형";
  const main=(subType[sub]&&subType[sub].main)||"균형형";
  return {code,main,sub,scores:{absorb:aScore,burn:bScore,store:cScore}};
}
// ─── 분석 함수 ────────────────────────────────────────────────────────────────

// ─── 분포 데이터 ──────────────────────────────────────────────────────────────
const distData={"111":3,"112":2,"121":3,"211":2,"331":5,"231":4,"321":4,"131":3,"132":2,"133":2,"311":3,"312":2,"222":8,"221":5,"212":4,"122":4,"333":5,"323":4,"332":5,"322":4,"232":3,"113":3,"213":2,"313":2,"233":5,"223":4,"123":3};
const codeColor=code=>{const s=codeMap[code],m=subType[s]?.main;return m==="소비형"?"#4fcfa0":m==="균형형"?GOLD:"#f76f8e";};
const distGrid=[["111","112","113","121","122","123","131","132","133"],["211","212","213","221","222","223","231","232","233"],["311","312","313","321","322","323","331","332","333"]];

// ─── AI 호출 ─────────────────────────────────────────────────────────────────
async function callAI(pAns,kAns,res,setAiAdvice,setLoading) {
  setLoading(true);
  const advice = {
    "소비형": "흡수력이 낮은 소비형 체질입니다. 유산균·소화효소로 장 환경을 먼저 복구하고, 고칼로리 밀도 식품(견과류·아보카도·땅콩버터)을 추가하세요. 유산소 운동은 최소화하고 근력 운동 비율을 높여야 근육량이 늘어납니다.",
    "균형형": "3축이 균형 잡힌 이상적인 체질입니다. 지금의 균형을 유지하며 잔근육 밀도를 높이는 중강도 저항 운동을 꾸준히 하세요. 종합비타민·오메가3·칼슘으로 기반을 탄탄히 다지면 선수 체형으로 발전합니다.",
    "저장형": "에너지 축적이 빠른 저장형 체질입니다. 식이섬유·마그네슘으로 인슐린 감수성을 높이고, 달리기·줄넘기 유산소 운동을 주 5회 이상 실시하세요. 탄수화물 섭취 타이밍을 운동 후로 집중하면 체지방 관리에 효과적입니다.",
  };
  setTimeout(()=>{
    setAiAdvice(advice[res.main] || advice["균형형"]);
    setLoading(false);
  }, 500);
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function App() {
  // ── 모든 state는 여기에 ──
  const [step,setStep]=useState("intro");
  const [pIdx,setPIdx]=useState(0);
  const [kIdx,setKIdx]=useState(0);
  const [pAns,setPAns]=useState({});
  const [kAns,setKAns]=useState({});
  const [result,setResult]=useState(null);
  const [aiAdvice,setAiAdvice]=useState("");
  const [loading,setLoading]=useState(false);
  const [selP,setSelP]=useState(null);
  const [selK,setSelK]=useState(null);
  const [childName,setChildName]=useState(()=>{try{return localStorage.getItem("pu333_name")||"";}catch{return "";}});
  const [birth,setBirth]=useState(()=>{try{return localStorage.getItem("pu333_birth")||"";}catch{return "";}});
  const [heightVal,setHeightVal]=useState(()=>{try{return localStorage.getItem("pu333_height")||"";}catch{return "";}});
  const [weightVal,setWeightVal]=useState(()=>{try{return localStorage.getItem("pu333_weight")||"";}catch{return "";}});
  const [saved,setSaved]=useState(false);
  const [copied,setCopied]=useState(false);
  const [downloading,setDownloading]=useState(false);
  const [shopTab,setShopTab]=useState(null);

  // 입력값 변경시 자동 저장
  const updateName=v=>{setChildName(v);try{localStorage.setItem("pu333_name",v);}catch{}};
  const updateBirth=v=>{setBirth(v);try{localStorage.setItem("pu333_birth",v);}catch{}};
  const updateHeight=v=>{setHeightVal(v);try{localStorage.setItem("pu333_height",v);}catch{}};
  const updateWeight=v=>{setWeightVal(v);try{localStorage.setItem("pu333_weight",v);}catch{}};

  const pQ=parentQuestions[pIdx];
  const kQ=kidQuestions[kIdx];

  function handleParent(i){
    setSelP(i);
    setTimeout(()=>{
      const n={...pAns,[pQ.id]:i};
      setPAns(n);setSelP(null);
      if(pIdx<parentQuestions.length-1){
        setPIdx(pIdx+1);
      } else {
        const res=analyze(n,{});
        setResult(res);setStep("result");
        callAI(n,{},res,setAiAdvice,setLoading);
      }
    },250);
  }

  function skipKid(){
    const res=analyze(pAns,{});
    setResult(res);setStep("result");
    callAI(pAns,{},res,setAiAdvice,setLoading);
  }

  function goResult(){
    const res=analyze({},{});
    setResult(res);setStep("result");
    setAiAdvice(res.main==='소비형'?'흡수력이 낮은 소비형 체질입니다. 유산균·소화효소로 장 환경을 먼저 복구하고 근력 운동 비율을 높이세요.':res.main==='저장형'?'에너지 축적이 빠른 저장형 체질입니다. 유산소 운동 주 5회 이상, 탄수화물 타이밍을 운동 후로 집중하세요.':'3축이 균형 잡힌 체질입니다. 중강도 저항 운동을 꾸준히 하며 잔근육 밀도를 높이세요.');
  }

  function reset(){
    setStep("intro");setPIdx(0);setKIdx(0);
    setPAns({});setKAns({});setResult(null);setAiAdvice("");
    setSaved(false);setCopied(false);setDownloading(false);setShowAll(false);
    // 이름·생년월일·키·몸무게는 유지 (다음에도 쓸 수 있게)
  }

  function handleSave(){
    try{
      localStorage.setItem("physicalup_result",JSON.stringify({
        date:new Date().toLocaleDateString("ko-KR"),
        code:result?.code,main:result?.main,sub:result?.sub,
        scores:result?.scores,birth,heightVal,weightVal,aiAdvice
      }));
      setSaved(true);setTimeout(()=>setSaved(false),2500);
    }catch(e){alert("저장 실패");}
  }

  async function handleShare(){
    if(!result) return;
    const si=subType[result.sub]||subType["항온형"];
    const mi=mainType[result.main]||mainType["균형형"];
    const ment=codeMents[result.code]||{emoji:"⚖️",nick:"완벽균형",wit:"나만의 특별한 체질",tip:"피지컬업333 Test로 맞춤 관리 시작!"};
    const shortWit=ment.wit.length>20?ment.wit.slice(0,20)+'..':ment.wit;
    const shortTip=ment.tip.length>20?ment.tip.slice(0,20)+'..':ment.tip;

    // 카카오 SDK 방식 시도
    try{
      if(window.Kakao&&window.Kakao.isInitialized()){
        // 링크도 클립보드에 복사해두기
        try{ await navigator.clipboard.writeText("https://www.physicalup333.com"); }catch(e){}
        window.Kakao.Share.sendDefault({
          objectType:"feed",
          content:{
            title:`${ment.emoji} ${result.code} ${mi.emoji}${result.main} · ${ment.nick} | Physical UP 333 333TEST`,
            description:`"${shortWit}" 💡${shortTip}`,
            imageUrl:"https://pu333.kr/og.png",
            imageWidth:1200,
            imageHeight:630,
            link:{
              mobileWebUrl:"https://www.physicalup333.com",
              webUrl:"https://www.physicalup333.com"
            }
          },
          buttons:[{
            title:"우리 아이 BIO CODE 찾기 →",
            link:{
              mobileWebUrl:"https://www.physicalup333.com",
              webUrl:"https://www.physicalup333.com"
            }
          }],
          installTalk:true,
          callback:()=>{
            setCopied(true);
            setTimeout(()=>setCopied(false),4000);
          }
        });
        return;
      }
    }catch(e){
      console.log("카카오 SDK 실패, 텍스트 복사로 전환");
    }

    // 폴백: 텍스트 복사
    const ageInfo=birth.length===6?calcAgeFromShort(birth):null;
    const growthTxt=(ageInfo&&heightVal&&weightVal)?`\n키 ${heightVal}cm · 몸무게 ${weightVal}kg · ${ageInfo.display}`:"";
    const txt=`Physical UP 333 333TEST\n\n${ment.emoji}${result.code} ${mi.emoji}${result.main} ${ment.nick}\n"${shortWit}"\n💡${shortTip}${growthTxt}\n\nwww.physicalup333.com`;
    try{ await navigator.clipboard.writeText(txt); }
    catch(e){
      const el=document.createElement("textarea");
      el.value=txt;document.body.appendChild(el);
      el.select();document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(()=>setCopied(false),4000);
  }

  async function handleDownload(){
    if(!result) return;
    setDownloading(true);
    const mi=mainType[result.main]||mainType["균형형"];
    const si=subType[result.sub]||subType["항온형"];
    const ment=codeMents[result.code]||{emoji:"⚖️",nick:"균형형",wit:"나만의 특별한 체질 코드",tip:"피지컬업333 Test로 맞춤 관리 시작!",rx:"체질 코드에 맞는 맞춤 관리를 시작하세요."};
    const bar=n=>"●".repeat(n)+"○".repeat(3-n);
    const date=new Date().toLocaleDateString("ko-KR");
    const ageInfo=birth.length===6?calcAgeFromShort(birth):null;
    const growthSection=(ageInfo&&heightVal&&weightVal)?`
      <div class="section">
        <div class="section-title">📏 성장 지표</div>
        <div class="info-row">
          <span>${ageInfo.display} · 키 <strong>${heightVal}cm</strong> · 몸무게 <strong>${weightVal}kg</strong></span>
        </div>
      </div>` : "";

    const html=`<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>피지컬업333 Test · ${result.sub} ${result.code}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#f5f3ef;font-family:'Noto Sans KR',sans-serif;padding:30px 20px;}
.page{max-width:600px;margin:0 auto;}

/* 헤더 카드 */
.header-card{background:linear-gradient(145deg,#0d1b3e,#1a2d5a);border-radius:16px;padding:28px;margin-bottom:16px;border:2px solid #c9a84c;position:relative;overflow:hidden;}
.header-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#c9a84c,#e8c76a,#c9a84c);}
.brand-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.brand{color:#c9a84c;font-size:10px;letter-spacing:4px;font-weight:700;}
.test-name{font-size:20px;font-weight:900;color:#e8c76a;letter-spacing:2px;}
.seal{width:44px;height:44px;background:linear-gradient(135deg,#c9a84c,#e8c76a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;}
.divider{height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:16px 0;}
.code-wrap{text-align:center;margin-bottom:16px;}
.code-badge{display:inline-block;background:linear-gradient(135deg,#c9a84c,#e8c76a);color:#0d1b3e;font-size:44px;font-weight:900;letter-spacing:12px;padding:10px 24px;border-radius:12px;margin-bottom:12px;}
.type-row{display:flex;align-items:center;justify-content:center;gap:12px;}
.main-tag{background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.4);color:#c9a84c;font-size:12px;padding:4px 14px;border-radius:20px;font-weight:700;}
.sub-name{font-family:'Noto Serif KR',serif;font-size:26px;font-weight:900;color:#f0f4ff;}
.wit-box{background:rgba(255,255,255,0.06);border-left:4px solid #c9a84c;padding:12px 16px;border-radius:0 10px 10px 0;margin-bottom:14px;}
.wit{font-family:'Noto Serif KR',serif;color:#f0f4ff;font-size:14px;line-height:1.8;margin-bottom:6px;}
.tip{color:#e8c76a;font-size:13px;font-weight:700;}
.axes{display:flex;gap:2px;border-radius:10px;overflow:hidden;margin-bottom:14px;}
.ax{flex:1;padding:10px 6px;text-align:center;}
.ax-l{font-size:10px;letter-spacing:1px;margin-bottom:4px;opacity:0.6;}
.ax-d{font-size:14px;letter-spacing:2px;}
.ax-n{font-size:10px;font-weight:700;margin-top:3px;}
.btn-wrap{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.btn-kakao{padding:14px 8px;border-radius:12px;background:#FEE500;color:#000000;font-size:13px;font-weight:800;border:none;cursor:pointer;font-family:'Noto Sans KR',sans-serif;line-height:1.5;width:100%;}
.btn-save{padding:14px 8px;border-radius:12px;background:linear-gradient(145deg,#0d1b3e,#1a2d5a);color:#e8c76a;font-size:13px;font-weight:800;border:1.5px solid #c9a84c;cursor:pointer;font-family:'Noto Sans KR',sans-serif;line-height:1.5;position:relative;overflow:hidden;width:100%;}
.btn-save::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#e8c76a,#c9a84c);}


/* 상세 카드 */
.detail-card{background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid #e8e4dc;box-shadow:0 2px 12px rgba(0,0,0,0.06);}
.detail-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #c9a84c;}
.detail-title{font-family:'Noto Serif KR',serif;color:#0d1b3e;font-size:15px;font-weight:700;letter-spacing:1px;}
.detail-badge{background:linear-gradient(135deg,#c9a84c,#e8c76a);color:#0d1b3e;font-size:14px;font-weight:900;letter-spacing:3px;padding:4px 14px;border-radius:8px;}
.section{margin-bottom:18px;}
.section-title{font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:2px;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(201,168,76,0.3),transparent);}
.item{display:flex;gap:8px;margin-bottom:7px;align-items:flex-start;}
.bullet{color:#c9a84c;font-size:11px;margin-top:3px;flex-shrink:0;}
.item-text{color:#2a3550;font-size:12px;line-height:1.7;}
.info-row{color:#2a3550;font-size:13px;line-height:1.8;}
.info-row strong{color:#0d1b3e;}

/* 운동 비율 */
.ex-stack{display:flex;height:22px;border-radius:6px;overflow:hidden;gap:1px;margin:8px 0 10px;}
.ex-row{display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.ex-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0;}
.ex-lbl{font-size:11px;color:#3a4a60;flex:1;}
.ex-pct{font-size:11px;font-weight:700;}

/* 포인트 박스 */
.point-box{background:#f8f5f0;border-left:3px solid #c9a84c;padding:12px 14px;border-radius:0 8px 8px 0;margin-bottom:14px;}
.point-txt{color:#2a3550;font-size:12px;line-height:1.8;}
.warn-box{background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:10px 14px;text-align:center;}
.warn-txt{color:#8a7040;font-size:11px;line-height:1.6;}

/* 하단 */
.bottom-card{background:linear-gradient(135deg,#0d1b3e,#1a2d5a);border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;}
.stamp{width:48px;height:48px;border-radius:50%;border:2px solid rgba(201,168,76,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-12deg);}
.stamp div{color:#c9a84c;font-size:6px;font-weight:700;letter-spacing:1px;line-height:1.5;}
.stamp .mid{font-size:9px;font-weight:900;}
.hashtag{color:rgba(201,168,76,0.4);font-size:9px;letter-spacing:1px;margin-top:3px;}

@media print{
  body{background:white;padding:10px;}
  .page{max-width:100%;}
}
</style></head><body>
<div class="page">

<!-- 헤더 카드 -->
<div class="header-card">
  <div class="brand-row">
    <div>
      <div class="brand">Physical UP 333</div>
      <div class="test-name">333TEST</div>
      <div style="color:rgba(201,168,76,0.4);font-size:8px;letter-spacing:2px;">ELITE SPORTS LAB</div>
    </div>
    <div class="seal">⚾</div>
  </div>
  <div class="divider"></div>
  <div class="code-wrap">
    <div class="code-badge">${result.code}</div>
    <div class="type-row">
      <div class="main-tag">${result.main}</div>
      <span style="font-size:26px;">${si.emoji}</span>
      <div class="sub-name">${ment.nick}</div>
    </div>
  </div>
  <div class="wit-box">
    <div class="wit">"${ment.wit}"</div>
    <div class="tip">💡 ${ment.tip}</div>
  </div>
  <div class="axes">
    <div class="ax" style="background:rgba(79,207,160,0.12)">
      <div class="ax-l" style="color:#4fcfa0">흡수력</div>
      <div class="ax-d" style="color:#4fcfa0">${bar(result.scores.absorb)}</div>
      <div class="ax-n" style="color:#4fcfa0">${result.scores.absorb}/3</div>
    </div>
    <div class="ax" style="background:rgba(247,149,79,0.12)">
      <div class="ax-l" style="color:#f7954f">연소력</div>
      <div class="ax-d" style="color:#f7954f">${bar(result.scores.burn)}</div>
      <div class="ax-n" style="color:#f7954f">${result.scores.burn}/3</div>
    </div>
    <div class="ax" style="background:rgba(247,111,142,0.12)">
      <div class="ax-l" style="color:#f76f8e">축적력</div>
      <div class="ax-d" style="color:#f76f8e">${bar(result.scores.store)}</div>
      <div class="ax-n" style="color:#f76f8e">${result.scores.store}/3</div>
    </div>
  </div>
  <div class="footer-row">
    <div class="footer-date">${date}</div>
    <div class="footer-url">www.physicalup333.com</div>
  </div>
</div>

<!-- 버튼 두 개 -->
<div class="btn-wrap">
  <button class="btn-kakao" onclick="shareKakao()">
    💬 카톡 공유<br/>
    <span style="font-size:10px;font-weight:600">복사 후 카톡 열기</span>
  </button>
  <button class="btn-save" onclick="saveHtml()">
    💾 검사지 저장<br/>
    <span style="font-size:10px;opacity:0.7;font-weight:600">HTML 파일 보관</span>
  </button>
</div>
<div id="kakao-msg" style="display:none;background:#FEE500;border-radius:10px;padding:10px 14px;margin-bottom:16px;text-align:center;font-size:12px;font-weight:700;color:#000;font-family:'Noto Sans KR',sans-serif;">
  ✅ 결과가 복사됐어요!<br/>
  <span style="font-size:11px;font-weight:500">카카오톡 → 채팅창 → 길게 누르기 → 붙여넣기</span>
</div>
<div class="detail-card">
  <div class="detail-header">
    <div class="detail-title">BIO CODE 상세 결과 확인서</div>
    <div class="detail-badge">${result.code}</div>
  </div>

  ${growthSection}

  <div class="section">
    <div class="section-title">🥗 음식 대책</div>
    ${mi.food.map(f=>`<div class="item"><span class="bullet">▸</span><span class="item-text">${f}</span></div>`).join("")}
  </div>

  <div class="section">
    <div class="section-title">💊 영양제 대책</div>
    ${mi.supplement.map(s=>`<div class="item"><span class="bullet">▸</span><span class="item-text">${s}</span></div>`).join("")}
  </div>

  <div class="section">
    <div class="section-title">🏃 추천 운동 비율</div>
    <div class="ex-stack">
      ${mi.exercise.ratio.map(r=>`<div style="width:${r.pct}%;background:${r.color};display:flex;align-items:center;justify-content:center;min-width:${r.pct>0?2:0}px"><span style="color:#0d1b3e;font-size:8px;font-weight:900">${r.pct>=14?r.pct+"%":""}</span></div>`).join("")}
    </div>
    ${mi.exercise.ratio.map(r=>`<div class="ex-row"><div class="ex-dot" style="background:${r.color}"></div><span class="ex-lbl">${r.name.replace("\n","·")}</span><span class="ex-pct" style="color:${r.color}">${r.pct}%</span></div>`).join("")}
    <div style="margin-top:8px;padding:8px 12px;background:rgba(201,168,76,0.05);border-radius:8px;border:1px solid rgba(201,168,76,0.15);">
      <span style="color:#8a7040;font-size:11px;">${mi.exercise.caution}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">✨ ${ment.emoji} {ment.nick} 맞춤 포인트</div>
    <div class="point-box"><div class="point-txt">${si.plus}</div></div>
  </div>

  <div class="section">
    <div class="section-title">✅ 생활 습관</div>
    ${mi.life.map(l=>`<div class="item"><span class="bullet">▸</span><span class="item-text">${l}</span></div>`).join("")}
  </div>

  <div class="warn-box">
    <div class="warn-txt">⚠️ ${mi.caution}</div>
  </div>
</div>

<!-- 하단 -->
<div class="bottom-card">
  <div>
    <div style="color:rgba(201,168,76,0.6);font-size:10px;margin-bottom:2px;">검사일 ${date} · 발급처 Physical UP 333 Physical UP 333</div>
    <div style="color:#c9a84c;font-size:12px;font-weight:700;letter-spacing:1px;">www.physicalup333.com</div>
    <div class="hashtag">#피지컬업333테스트 #Physical UP 333 #BIOCODE</div>
  </div>
  <div class="stamp">
    <div>PHYSICAL</div><div class="mid">UP</div><div>OFFICIAL</div>
  </div>
</div>

</div>

<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" crossorigin="anonymous"></script>
<script>
function shareKakao(){
  const txt="Physical UP 333 333TEST\\n\\n${ment.emoji}${result.code} ${mi.emoji}${result.main} ${ment.nick}\\n\\"${ment.wit.slice(0,16)}${ment.wit.length>16?'..':''}\\"\\n💡${ment.tip.slice(0,16)}${ment.tip.length>16?'..':''}\\n\\nwww.physicalup333.com";
  if(navigator.clipboard){
    navigator.clipboard.writeText(txt).then(()=>{
      document.getElementById('kakao-msg').style.display='block';
    }).catch(()=>{ fallbackCopy(txt); });
  } else { fallbackCopy(txt); }
}
function fallbackCopy(txt){
  const el=document.createElement('textarea');
  el.value=txt; document.body.appendChild(el);
  el.select(); document.execCommand('copy');
  document.body.removeChild(el);
  document.getElementById('kakao-msg').style.display='block';
}
function saveHtml(){
  const blob=new Blob([document.documentElement.outerHTML],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="피지컬업333_${result.sub}_${result.code}.html";
  document.body.appendChild(a);a.click();
  document.body.removeChild(a);URL.revokeObjectURL(url);
}
</script>
</body></html>`;

    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    setDownloading(false);
    const a=document.createElement('a');
    a.href=url;
    a.download=`피지컬업333_${result.code}_${ment.nick}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  }


  // ── 공통 스타일 ──
  const cardStyle={background:"rgba(13,27,62,0.6)",borderRadius:16,padding:"18px",marginBottom:12,border:`1px solid rgba(201,168,76,0.15)`};

  // ── 공통 네비바 ──
  const NavBar=()=>(
    <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(6,10,20,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(201,168,76,0.12)",padding:"0 20px"}}>
      <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
        <a href="/landing.html" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
          <img src="/logo.png" alt="Physical UP 333" style={{width:32,height:32,objectFit:"contain",borderRadius:"50%"}}/>
          <div>
            <div style={{color:GOLD,fontSize:12,fontWeight:900,letterSpacing:2,lineHeight:1}}>Physical UP 333</div>
            <div style={{color:MUTED,fontSize:9,letterSpacing:1}}>ELITE SPORTS LAB</div>
          </div>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <a href="/landing.html" style={{color:MUTED,fontSize:11,padding:"5px 8px",borderRadius:6,textDecoration:"none"}}>ABOUT</a>
          <a href="/worry.html" style={{color:MUTED,fontSize:11,padding:"5px 8px",borderRadius:6,textDecoration:"none"}}>LAB</a>
          <a href="/shop.html" style={{color:MUTED,fontSize:11,padding:"5px 8px",borderRadius:6,textDecoration:"none"}}>SHOP</a>
          <a href="/app" style={{color:GOLD,fontSize:11,padding:"5px 10px",borderRadius:6,textDecoration:"none",border:`1px solid ${GOLD}`,fontWeight:700}}>333TEST</a>
        </div>
      </div>
    </nav>
  );


  // ── INTRO ──────────────────────────────────────────────────────────────────
  if(step==="intro") return (
    <div style={{minHeight:"100vh",background:bg,fontFamily:font}}>
      <NavBar/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px",paddingTop:40}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{marginBottom:20,textAlign:"center"}}>
          <div style={{display:"inline-block",padding:"10px 52px",borderRadius:24,background:"rgba(201,168,76,0.08)",border:"1.5px solid rgba(201,168,76,0.5)",boxShadow:"0 4px 24px rgba(201,168,76,0.15)"}}>
            <div style={{color:GOLD,fontSize:13,fontWeight:700,letterSpacing:4,marginBottom:2}}>Physical UP 333</div>
            <div style={{background:"linear-gradient(135deg,#c9a84c,#e8c76a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:36,fontWeight:900,letterSpacing:4}}>333TEST</div>
          </div>
        </div>
        <h1 style={{color:WHITE,fontSize:21,fontWeight:800,lineHeight:1.5,marginBottom:8}}>우리 아이 BIO CODE 찾기</h1>
        <p style={{color:MUTED,fontSize:13,lineHeight:2,marginBottom:20}}>흡수력 · 연소력 · 축적력<br/>3축 점수로 BIO CODE를 측정합니다</p>

        {/* 신체 정보 입력 */}
        <div style={{background:"rgba(201,168,76,0.05)",borderRadius:14,padding:"14px",marginBottom:16,border:"1px solid rgba(201,168,76,0.15)"}}>
          <div style={{color:GOLD,fontSize:11,fontWeight:700,marginBottom:4,letterSpacing:1}}>📏 아이 정보 입력 (선택 · 자동저장)</div>
          <div style={{color:MUTED,fontSize:10,marginBottom:12,opacity:0.8}}>※ 만 18세 이하 유소년 선수 대상 서비스입니다</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${childName?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>이름</div>
              <input type="text" value={childName} onChange={e=>updateName(e.target.value)} placeholder="홍길동"
                style={{width:"100%",background:"transparent",border:"none",color:childName?GOLD2:MUTED,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${birth.length===6?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>생년월일 <span style={{fontSize:9}}>(YYMMDD)</span></div>
              <input type="text" value={birth} onChange={e=>updateBirth(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="190523" maxLength={6}
                style={{width:"100%",background:"transparent",border:"none",color:birth.length===6?GOLD2:MUTED,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box",letterSpacing:2}}/>
              {birth.length===6&&(()=>{
                const age=calcAgeFromShort(birth);
                return age?<div style={{color:GOLD,fontSize:9,marginTop:3}}>✓ {age.display}</div>:<div style={{color:"#f76f8e",fontSize:9,marginTop:3}}>날짜 확인</div>;
              })()}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${heightVal?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>키 (cm)</div>
              <input type="number" value={heightVal} onChange={e=>updateHeight(e.target.value)} placeholder="115"
                style={{width:"100%",background:"transparent",border:"none",color:heightVal?GOLD2:MUTED,fontSize:16,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${weightVal?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>몸무게 (kg)</div>
              <input type="number" value={weightVal} onChange={e=>updateWeight(e.target.value)} placeholder="20"
                style={{width:"100%",background:"transparent",border:"none",color:weightVal?GOLD2:MUTED,fontSize:16,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
          </div>
        </div>

        <div style={{marginBottom:10}}>
          <button onClick={()=>setStep("partA")} style={{width:"100%",padding:"16px",borderRadius:12,background:"linear-gradient(135deg,#c9a84c,#e8c76a)",color:NAVY,fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(201,168,76,0.3)",lineHeight:1.5}}>
            333TEST 시작하기<br/><span style={{fontSize:11,fontWeight:600,opacity:0.7}}>18문항 · 약 3~5분 · 무료</span>
          </button>
        </div>
        <button onClick={goResult} style={{width:"100%",padding:"12px",borderRadius:12,background:"rgba(255,255,255,0.03)",color:MUTED,fontSize:13,border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",marginBottom:4}}>
          ⚡ 신체 정보만으로 성장 지표 확인
        </button>
        <p style={{color:MUTED,fontSize:11,opacity:0.5}}>18문항 · 약 3~5분 소요</p>
      </div>
      </div>
    </div>
  );

  // ── PART A (18문항) ─────────────────────────────────────────────────────────
  if(step==="partA"){
    const prog=Math.round((Object.keys(pAns).length/parentQuestions.length)*100);
    const themeLabel=pQ&&pQ.id.startsWith('a')?"🍽️ 먹고 소화하기":pQ&&pQ.id.startsWith('b')?"⚡ 에너지 쓰기":"💪 저장하고 성장하기";
    return (
      <div style={{minHeight:"100vh",background:bg,fontFamily:font}}>
        <NavBar/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px"}}>
        <div style={{maxWidth:400,width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:20,padding:"4px 14px",color:GOLD,fontSize:11,fontWeight:700}}>{themeLabel}</div>
            <span style={{color:GOLD,fontSize:13,fontWeight:800,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:20,padding:"3px 12px"}}>{pIdx+1} / {parentQuestions.length}</span>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4,marginBottom:6}}>
            <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#c9a84c,#e8c76a)",width:`${prog}%`,transition:"width 0.3s",boxShadow:"0 0 8px rgba(201,168,76,0.5)"}}/>
          </div>
          <div style={{textAlign:"right",color:MUTED,fontSize:10,marginBottom:24}}>{prog}%</div>
          <h2 style={{color:WHITE,fontSize:19,fontWeight:700,lineHeight:1.6,marginBottom:28,textAlign:"center",minHeight:60,display:"flex",alignItems:"center",justifyContent:"center"}}>{pQ&&pQ.text}</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
            {["전혀","가끔","자주","항상"].map((label,i)=>(
              <button key={i} onClick={()=>handleParent(i)} style={{padding:"18px 4px",borderRadius:10,textAlign:"center",background:selP===i?"rgba(201,168,76,0.25)":pAns[pQ.id]===i?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.03)",border:selP===i?"1.5px solid rgba(201,168,76,0.9)":pAns[pQ.id]===i?"1.5px solid rgba(201,168,76,0.4)":"1.5px solid rgba(255,255,255,0.07)",color:pAns[pQ.id]===i?GOLD3:"#9ab8cc",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all 0.2s",transform:selP===i?"scale(0.95)":"scale(1)"}}>
                {label}
              </button>
            ))}
          </div>
          {pIdx>0&&<button onClick={()=>setPIdx(pIdx-1)} style={{marginTop:18,background:"none",border:"none",color:MUTED,fontSize:13,cursor:"pointer"}}>← 이전</button>}
        </div>
        </div>
      </div>
    );
  }


  // ── RESULT ─────────────────────────────────────────────────────────────────
  if(step==="result"&&result){
    const mi=mainType[result.main]||mainType["균형형"];
    const si=subType[result.sub]||subType["항온형"];
    const ment=codeMents[result.code]||{emoji:"⚖️",nick:"균형형",wit:"나만의 특별한 체질 코드",tip:"피지컬업333 Test로 맞춤 관리 시작!",rx:"체질 코드에 맞는 맞춤 관리를 시작하세요."};
    const bar=n=>"●".repeat(n)+"○".repeat(3-n);
    const axes=[{label:"흡수력",val:result.scores.absorb,color:"#4fcfa0"},{label:"연소력",val:result.scores.burn,color:"#f7954f"},{label:"축적력",val:result.scores.store,color:"#f76f8e"}];
    // NavBar는 결과 화면 최상단에
    const maxDist=Math.max(...Object.values(distData));

    // 성장 데이터
    const ageInfo = birth.length===6 ? calcAgeFromShort(birth) : null;
    const ageMonths = ageInfo?.months || null;
    const gd=(ageMonths&&heightVal&&weightVal)?getGrowthData(ageMonths,parseFloat(heightVal),parseFloat(weightVal)):null;
    const ageDisplay = ageInfo ? ageInfo.display : "";
    const nameDisplay = childName ? `${childName} 선수` : "우리 아이";
    const hTarget=90;
    const wTarget=result.main==="저장형"?15:result.main==="소비형"?85:90;
    const wTargetLabel=result.main==="저장형"?"상위15%관리":result.main==="소비형"?"상위15%목표":"상위10%목표";
    const bands=[{l:"3",p:3},{l:"10",p:10},{l:"25",p:25},{l:"50",p:50},{l:"75",p:75},{l:"90",p:90},{l:"97",p:97}];

    return (
      <div style={{minHeight:"100vh",background:bg,fontFamily:font}}>
        <NavBar/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 20px 60px"}}>
        <div style={{maxWidth:400,width:"100%"}}>

          {/* 브랜드 */}
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{background:"linear-gradient(135deg,#c9a84c,#e8c76a,#c9a84c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:13,fontWeight:900,letterSpacing:3}}>Physical UP 333 · Physical UP 333</div>
          </div>

          {/* 인사말 */}
          <div style={{
            textAlign:"center",padding:"16px 20px",marginBottom:14,
            background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(13,27,62,0.6))",
            borderRadius:14,border:"1px solid rgba(201,168,76,0.25)",
            position:"relative",overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})`}}/>
            <div style={{color:MUTED,fontSize:12,marginBottom:4}}>안녕하세요! 👋</div>
            <div style={{color:WHITE,fontSize:16,fontWeight:800,lineHeight:1.6}}>
              <span style={{color:GOLD2}}>{nameDisplay}</span>
              {ageInfo&&<span style={{color:MUTED,fontSize:13,fontWeight:600}}> ({ageInfo.display})</span>}
            </div>
            <div style={{color:MUTED,fontSize:13,marginTop:4}}>의 BIO CODE 분석 결과입니다 ⚾</div>
          </div>

          {/* 코드 메인 카드 */}
          <div style={{textAlign:"center",padding:"26px 20px",background:"linear-gradient(160deg,#0d1b3e,#0f2050)",border:`1px solid rgba(201,168,76,0.35)`,borderRadius:20,marginBottom:12,boxShadow:"0 8px 40px rgba(201,168,76,0.15)"}}>
            {/* 검사 날짜 */}
            <div style={{color:MUTED,fontSize:11,marginBottom:12,letterSpacing:1}}>
              📅 검사일 {new Date().toLocaleDateString("ko-KR")}
            </div>
            {/* 코드 배지 - 투명 + 골드 테두리 */}
            <div style={{display:"inline-block",padding:"10px 32px",borderRadius:24,marginBottom:16,background:"rgba(201,168,76,0.08)",border:"1.5px solid rgba(201,168,76,0.5)",boxShadow:"0 4px 20px rgba(201,168,76,0.15)",textDecoration:"none"}}>
              <span style={{color:"#e8c76a",fontSize:32,fontWeight:900,letterSpacing:8,display:"block"}}>{result.code}</span>
            </div>
            {/* 이모지+4글자 + 대분류 나란히 */}
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:18}}>{mi.emoji}</span>
                  <span style={{color:GOLD2,fontSize:18,fontWeight:800}}>{result.main}</span>
                </div>
                <div style={{width:1,height:20,background:"rgba(201,168,76,0.3)"}}/>
                <div style={{display:"inline-block",padding:"4px 16px",borderRadius:20,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)"}}>
                  <span style={{color:GOLD,fontSize:15,fontWeight:800,letterSpacing:1}}>{ment.emoji} {ment.nick}</span>
                </div>
              </div>
            </div>
            <p style={{color:MUTED,fontSize:13,lineHeight:1.7,margin:0}}>{si.shortDesc}</p>
          </div>

          {/* 성장 지표 */}
          {gd&&(
            <div style={{...cardStyle,border:"1px solid rgba(201,168,76,0.3)",boxShadow:"0 4px 20px rgba(201,168,76,0.1)"}}>
              <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>📏 성장 지표 분석</div>
              <div style={{color:MUTED,fontSize:11,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:10}}>{ageDisplay} · BMI {gd.bmi}</div>

              {[
                {label:"키",value:parseFloat(heightVal),unit:"cm",avg:gd.stdH,mine:parseFloat(heightVal),target:gd.targetH,color:"#4fcfa0",isSlug:false},
                {label:"몸무게",value:parseFloat(weightVal),unit:"kg",avg:gd.stdW,mine:parseFloat(weightVal),target:result.main==="저장형"?gd.targetW15:result.main==="소비형"?gd.targetW85:gd.targetW90,color:"#4f8ef7",isSlug:result.main==="저장형"}
              ].map(ax=>{
                // 3개 값을 정렬해서 위치 계산
                const vals=[ax.avg,ax.mine,ax.target];
                const minV=Math.min(...vals)*0.97;
                const maxV=Math.max(...vals)*1.03;
                const toPos=v=>Math.round(((v-minV)/(maxV-minV))*100);
                const avgPos=toPos(ax.avg);
                const minePos=toPos(ax.mine);
                const targetPos=toPos(ax.target);
                const reached=ax.isSlug?ax.mine<=ax.target:ax.mine>=ax.target;

                return (
                  <div key={ax.label} style={{marginBottom:20}}>
                    {/* 타이틀 */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <span style={{color:WHITE,fontSize:13,fontWeight:700}}>{ax.label}</span>
                      {reached
                        ? <span style={{color:"#4fcfa0",fontSize:11,fontWeight:700}}>🏆 목표 달성!</span>
                        : <span style={{color:GOLD,fontSize:11,fontWeight:700}}>🎯 {Math.abs(ax.target-ax.mine).toFixed(1)}{ax.unit} {ax.isSlug?"감량 필요":"더 필요"}</span>
                      }
                    </div>

                    {/* 그래프 영역 */}
                    <div style={{position:"relative",height:80,marginBottom:8}}>
                      {/* 베이스 라인 */}
                      <div style={{position:"absolute",bottom:28,left:0,right:0,height:2,background:"rgba(255,255,255,0.08)",borderRadius:1}}/>

                      {/* 평균 선 */}
                      <div style={{position:"absolute",bottom:16,left:`${avgPos}%`,transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",zIndex:7}}>
                        <div style={{color:MUTED,fontSize:10,fontWeight:700,marginBottom:3,whiteSpace:"nowrap"}}>평균</div>
                        <div style={{width:2,height:36,background:"rgba(255,255,255,0.3)",borderRadius:1}}/>
                        <div style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.4)",marginTop:2}}/>
                        <div style={{color:MUTED,fontSize:10,fontWeight:600,marginTop:3,whiteSpace:"nowrap"}}>{ax.avg}{ax.unit}</div>
                      </div>

                      {/* 내 아이 선 */}
                      <div style={{position:"absolute",bottom:16,left:`${minePos}%`,transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",zIndex:9}}>
                        <div style={{color:ax.color,fontSize:11,fontWeight:900,marginBottom:3,whiteSpace:"nowrap"}}>내 아이</div>
                        <div style={{width:3,height:36,background:ax.color,borderRadius:1,boxShadow:`0 0 8px ${ax.color}`}}/>
                        <div style={{width:8,height:8,borderRadius:"50%",background:ax.color,marginTop:2,boxShadow:`0 0 8px ${ax.color}`}}/>
                        <div style={{color:ax.color,fontSize:11,fontWeight:900,marginTop:3,whiteSpace:"nowrap"}}>{ax.mine}{ax.unit}</div>
                      </div>

                      {/* 목표 선 */}
                      <div style={{position:"absolute",bottom:16,left:`${targetPos}%`,transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",zIndex:8}}>
                        <div style={{color:GOLD,fontSize:10,fontWeight:700,marginBottom:3,whiteSpace:"nowrap"}}>🎯목표</div>
                        <div style={{width:2,height:36,background:GOLD,borderRadius:1,boxShadow:`0 0 6px ${GOLD}`}}/>
                        <div style={{width:7,height:7,background:GOLD,transform:"rotate(45deg)",marginTop:2,boxShadow:`0 0 6px ${GOLD}`}}/>
                        <div style={{color:GOLD,fontSize:10,fontWeight:700,marginTop:3,whiteSpace:"nowrap"}}>{ax.target}{ax.unit}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3축 게이지 */}
          <div style={cardStyle}>
            <div style={{color:GOLD,fontSize:11,marginBottom:14,fontWeight:700,letterSpacing:1,borderBottom:"1px solid rgba(201,168,76,0.15)",paddingBottom:10}}>⚾ 3축 BIO CODE 분석</div>
            {axes.map(ax=>(
              <div key={ax.label} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{color:WHITE,fontSize:12,fontWeight:600}}>{ax.label}</span>
                  <span style={{color:ax.color,fontSize:12,fontWeight:700}}>{ax.val} · {["낮음","보통","높음"][ax.val-1]}</span>
                </div>
                <div style={{display:"flex",gap:4}}>
                  {[1,2,3].map(n=><div key={n} style={{flex:1,height:10,borderRadius:4,background:n<=ax.val?ax.color:"rgba(255,255,255,0.06)",boxShadow:n<=ax.val?`0 0 6px ${ax.color}60`:"none",transition:"all 0.5s"}}/>)}
                </div>
              </div>
            ))}
          </div>

          {/* 솔루션 */}
          <div style={cardStyle}>
            <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>{mi.goal}</div>
            <div style={{color:MUTED,fontSize:12,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:12}}>{mi.direction}</div>
            {[["🥗 음식 대책",mi.food],["💊 영양제 대책",mi.supplement],["✅ 생활 습관",mi.life]].map(([title,items])=>(
              <div key={title} style={{marginBottom:14}}>
                <div style={{color:GOLD2,fontSize:12,fontWeight:700,marginBottom:8}}>{title}</div>
                {items.map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                    <span style={{color:GOLD,fontSize:10,marginTop:4,flexShrink:0}}>▸</span>
                    <span style={{color:"#7a9ab8",fontSize:13,lineHeight:1.7}}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
            {/* 운동 비율 */}
            <div>
              <div style={{color:GOLD2,fontSize:12,fontWeight:700,marginBottom:4}}>🏃 추천 운동 비율</div>
              <div style={{color:MUTED,fontSize:11,marginBottom:10}}>{mi.exercise.title}</div>
              <div style={{display:"flex",height:26,borderRadius:8,overflow:"hidden",marginBottom:12,gap:1}}>
                {mi.exercise.ratio.map(r=><div key={r.name} style={{width:`${r.pct}%`,background:r.color,display:"flex",alignItems:"center",justifyContent:"center",minWidth:r.pct>0?2:0}}>
                  {r.pct>=12&&<span style={{color:NAVY,fontSize:9,fontWeight:800}}>{r.pct}%</span>}
                </div>)}
              </div>
              {mi.exercise.ratio.map(r=>(
                <div key={r.name} style={{display:"flex",gap:10,marginBottom:9,alignItems:"flex-start"}}>
                  <div style={{flexShrink:0,textAlign:"center",width:52}}>
                    <div style={{background:`${r.color}20`,border:`1px solid ${r.color}50`,borderRadius:6,padding:"3px 4px",marginBottom:2}}>
                      <div style={{color:r.color,fontSize:11,fontWeight:800,lineHeight:1.2,whiteSpace:"pre-line"}}>{r.name}</div>
                    </div>
                    <div style={{color:r.color,fontSize:13,fontWeight:900}}>{r.pct}%</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:4}}>
                      <div style={{height:"100%",borderRadius:2,background:r.color,width:`${r.pct}%`,boxShadow:`0 0 4px ${r.color}60`}}/>
                    </div>
                    <span style={{color:"#6a8aaa",fontSize:12,lineHeight:1.6}}>{r.desc}</span>
                  </div>
                </div>
              ))}
              <div style={{padding:"8px 12px",borderRadius:8,background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)"}}>
                <span style={{color:GOLD,fontSize:10}}>⚠️ </span>
                <span style={{color:"#8a7840",fontSize:11,lineHeight:1.6}}>{mi.exercise.caution}</span>
              </div>
            </div>
          </div>

          {/* 세분류 포인트 */}
          <div style={{...cardStyle,border:`1px solid ${si.color}25`}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{fontSize:16}}>{si.emoji}</span>
              <span style={{color:si.color,fontSize:12,fontWeight:700}}>{ment.emoji} {ment.nick} 맞춤 포인트</span>
            </div>
            <p style={{color:MUTED,fontSize:13,lineHeight:1.7,margin:0}}>{si.plus}</p>
          </div>

          {/* 실전 행동 처방 */}
          {ment.rx&&(
          <div style={{
            borderRadius:14,padding:"16px",marginBottom:12,
            background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(13,27,62,0.6))",
            border:"1.5px solid rgba(201,168,76,0.3)",
            position:"relative",overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`}}/>
            <div style={{color:GOLD,fontSize:11,fontWeight:800,letterSpacing:1,marginBottom:8}}>
              ⚡ 지금 당장 실천할 것
            </div>
            <p style={{color:"#e8d8a0",fontSize:13,lineHeight:1.9,margin:0}}>{ment.rx}</p>
          </div>
          )}

          {/* 축적력 3점 특별 코멘트 */}
          {result.scores.store===3&&(
            <div style={{
              borderRadius:14,padding:"16px",marginBottom:12,
              background:"linear-gradient(135deg,rgba(247,111,142,0.08),rgba(13,27,62,0.6))",
              border:"1.5px solid rgba(247,111,142,0.35)",
              position:"relative",overflow:"hidden"
            }}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#f76f8e,transparent)"}}/>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{fontSize:24,flexShrink:0}}>🏃</div>
                <div>
                  <div style={{color:"#f76f8e",fontSize:12,fontWeight:800,marginBottom:6,letterSpacing:0.5}}>
                    축적력 3점 · 체중 관리 포인트
                  </div>
                  <div style={{color:"#c8a0a8",fontSize:13,lineHeight:1.8}}>
                    에너지 저장력이 강한 체질이에요.<br/>
                    달리기 선수에게 체중은 곧 기록입니다.<br/>
                    <span style={{color:"#f9c8d0",fontWeight:700}}>몸이 무거워지면 속도가 느려져요.</span><br/>
                    유산소 운동을 꾸준히 해서<br/>
                    <span style={{color:"#f76f8e",fontWeight:700}}>지금의 스피드를 지켜봅시다! ⚡</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 주의 */}
          <div style={{background:"rgba(201,168,76,0.06)",borderRadius:12,padding:"12px 14px",marginBottom:12,border:"1px solid rgba(201,168,76,0.2)"}}>
            <span style={{color:GOLD,fontSize:12}}>⚠️ </span>
            <span style={{color:"#8a7840",fontSize:13,lineHeight:1.7}}>{mi.caution}</span>
          </div>

          {/* AI 상담 */}
          <div style={{...cardStyle,border:"1px solid rgba(201,168,76,0.25)",boxShadow:"0 4px 20px rgba(201,168,76,0.08)"}}>
            <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:10,letterSpacing:1}}>🤖 AI 통합 맞춤 상담</div>
            {loading?<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:8,height:8,borderRadius:"50%",background:GOLD}}/><span style={{color:MUTED,fontSize:13}}>3축 데이터 분석 중...</span></div>:<p style={{color:"#8aa8c8",fontSize:13,lineHeight:1.9,margin:0}}>{aiAdvice}</p>}
          </div>

          {/* 버튼 */}
          <div style={{marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {/* 카톡 공유 */}
              <button onClick={async()=>{
                const shortWit=ment.wit.length>20?ment.wit.slice(0,20)+'..':ment.wit;
                const shortTip=ment.tip.length>20?ment.tip.slice(0,20)+'..':ment.tip;
                const txt=`🧬 Physical UP 333 · 333TEST\n\nBIO CODE: ${result.code} ${ment.emoji} ${ment.nick}\n유형: ${result.main}\n\n"${shortWit}"\n💡${shortTip}\n\n▶ 무료 BIO CODE 검사\npu333.kr`;
                try{
                  if(navigator.share){
                    await navigator.share({title:'333TEST BIO CODE 결과',text:txt,url:'https://pu333.kr'});
                  } else {
                    try{await navigator.clipboard.writeText(txt);}catch(e){
                      const el=document.createElement('textarea');el.value=txt;
                      document.body.appendChild(el);el.select();
                      document.execCommand('copy');document.body.removeChild(el);
                    }
                    alert('✅ 복사됐어요!\n카톡 채팅창에 붙여넣기 하세요!');
                  }
                }catch(e){
                  try{await navigator.clipboard.writeText(txt);}catch(e2){}
                  alert('✅ 복사됐어요!\n카톡 채팅창에 붙여넣기 하세요!');
                }
              }} style={{padding:"14px 8px",borderRadius:12,background:"#FEE500",color:"#000",fontSize:13,fontWeight:800,border:"none",cursor:"pointer",lineHeight:1.5}}>
                💬 카톡 공유<br/><span style={{fontSize:10,opacity:0.7}}>결과 텍스트 공유</span>
              </button>
              {/* 결과지 저장 */}
              <button onClick={handleDownload} style={{
                padding:"14px 8px",borderRadius:12,
                background:downloading?"rgba(79,207,160,0.15)":"linear-gradient(145deg,#0d1b3e,#1a2d5a)",
                color:downloading?"#4fcfa0":GOLD2,
                fontSize:13,fontWeight:800,
                border:downloading?"1.5px solid #4fcfa0":`1.5px solid ${GOLD}`,
                cursor:"pointer",lineHeight:1.5,position:"relative",overflow:"hidden"
              }}>
                {!downloading&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})`}}/>}
                {downloading?"✅ 저장 중!":"💾 결과지 저장"}<br/>
                <span style={{fontSize:10,opacity:0.7}}>{downloading?"잠시만요...":"HTML 파일"}</span>
              </button>
            </div>

          {/* 맞춤 제품 추천 바로가기 */}
          {(()=>{
            const shopMap={
              "111":["소화효소","유산균"],"112":["단백질","유산균"],
              "121":["소화효소","종합비타민"],"211":["유산균","소화효소"],
              "331":["단백질","칼슘·마그네슘"],"231":["단백질","오메가3"],
              "321":["키성장","칼슘·마그네슘"],"131":["유산균","소화효소"],
              "132":["소화효소","유산균"],"133":["유산균","비타민D"],
              "311":["단백질","종합비타민"],"312":["단백질","칼슘·마그네슘"],
              "222":["종합비타민","오메가3"],"221":["종합비타민","오메가3"],
              "212":["단백질","칼슘·마그네슘"],"122":["비타민D","유산균"],
              "333":["종합비타민","칼슘·마그네슘"],"323":["비타민D","칼슘·마그네슘"],
              "332":["오메가3","종합비타민"],"322":["칼슘·마그네슘","비타민D"],
              "232":["단백질","종합비타민"],"113":["식이섬유","유산균"],
              "213":["식이섬유","유산균"],"313":["종합비타민","비타민D"],
              "233":["식이섬유","오메가3"],"223":["식이섬유","칼슘·마그네슘"],
              "123":["종합비타민","식이섬유"],
            };
            const items=shopMap[result.code]||["종합비타민","유산균"];
            return (
              <div style={{marginBottom:10}}>
                <div style={{color:GOLD,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8}}>🛒 {ment.nick} 맞춤 제품 추천</div>
                <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                  {items.map((name,i)=>(
                    <span key={i} style={{
                      padding:"6px 14px",borderRadius:20,
                      background:`rgba(201,168,76,0.12)`,
                      border:`1px solid rgba(201,168,76,0.35)`,
                      color:GOLD2,fontSize:12,fontWeight:700,
                    }}>💊 {name}</span>
                  ))}
                </div>
                <a href="/shop.html" style={{
                  display:"block",width:"100%",padding:"13px",
                  borderRadius:12,textAlign:"center",
                  background:"linear-gradient(135deg,#c9a84c,#e8c76a)",
                  color:NAVY,fontSize:14,fontWeight:900,
                  textDecoration:"none",boxSizing:"border-box",
                  boxShadow:"0 4px 16px rgba(201,168,76,0.35)"
                }}>
                  🛍️ 맞춤 제품 추천 바로가기
                </a>
                <div style={{color:MUTED,fontSize:9,marginTop:8,lineHeight:1.6,opacity:0.7,textAlign:"center"}}>쿠팡 파트너스·네이버 쇼핑 파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다.</div>
              </div>
            );
          })()}

          {/* 유료 서비스 전환 준비 중 */}
          <div style={{
            padding:"16px",borderRadius:12,marginBottom:10,
            background:"linear-gradient(135deg,rgba(201,168,76,0.06),rgba(13,27,62,0.5))",
            border:"1px solid rgba(201,168,76,0.25)",
            position:"relative",overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})`}}/>
            <div style={{color:GOLD2,fontSize:13,fontWeight:800,marginBottom:6}}>🏅 프리미엄 서비스 출시 예정</div>
            <div style={{color:MUTED,fontSize:11,lineHeight:1.8}}>
              <span style={{color:GOLD}}>인바디 분석 + 종목별 훈련 스케줄 + BIO CODE 맞춤 식단·영양</span>까지<br/>
              더 정밀하게 관리해 드리는 1:1 프리미엄이 곧 출시됩니다.
            </div>
          </div>

          <button onClick={reset} style={{width:"100%",padding:"14px",borderRadius:12,background:"rgba(201,168,76,0.06)",color:MUTED,fontSize:14,border:"1px solid rgba(201,168,76,0.2)",cursor:"pointer",marginBottom:4}}>🔄 처음부터 다시하기</button>
          <p style={{color:"#1a2a3a",fontSize:11,textAlign:"center",marginTop:14,lineHeight:1.7}}>문항에 따라 결과는 다를 수 있으며 재미있는 참고용입니다.<br/>보다 완벽한 BIO CODE 결과는 유료 서비스로 제공해 드릴 예정입니다.</p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return null;
}
