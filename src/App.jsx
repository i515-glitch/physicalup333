import { useState } from "react";

// ─── 대분류 (3가지) ───────────────────────────────────────────────────────────
const mainType = {
  교타자: {
    emoji: "🏏", color: "#4fcfa0",
    gradient: "linear-gradient(160deg, #061a12, #0a2a1e)",
    desc: "가볍고 빠르지만 에너지가 잘 쌓이지 않는 체질",
    goal: "목표 — 찌우기 · 흡수력 높이기",
    direction: "찌는 음식 · 소화효소 · 유산균 중심",
    food: [
      "칼로리 밀도 높은 음식 위주 (견과류·아보카도·달걀·치즈)",
      "따뜻하고 부드러운 찌는 음식 (죽·찜·국밥)",
      "소량씩 자주 먹이기 — 하루 5~6회",
      "차가운 음식·기름진 음식·밀가루 줄이기",
      "소화 잘 되는 단백질 (두부·달걀찜·흰살생선)",
    ],
    supplement: [
      "소화효소제 — 식사 직전 복용, 흡수력 핵심",
      "아연 — 식욕 증진, 성장 호르몬 활성화",
      "유산균 프로바이오틱스 — 장 흡수력 개선",
      "비타민 B군 — 에너지 대사 보조",
      "마그네슘 — 근육·신경 안정",
    ],
    exercise: {
      title: "소화 돕고 근육 쌓기 중심",
      caution: "격렬한 유산소 금물 — 칼로리 소모가 더 커집니다. 운동 후 30분 내 고칼로리 간식 필수!",
      ratio: [
        { name:"스트레칭", pct:40, color:"#4fcfa0",
          desc:"소화기 자극·식욕 촉진. 식후 10~15분 가벼운 스트레칭이 흡수율을 높입니다." },
        { name:"소근육\n근력", pct:35, color:"#4f8ef7",
          desc:"팔굽혀펴기·철봉·밴드운동. 큰 근육보다 작은 근육부터 단계적으로 쌓습니다." },
        { name:"벌크업", pct:20, color:"#f7d24f",
          desc:"스쿼트·런지·데드리프트 가볍게. 살이 붙을 근육 자극이 목적입니다." },
        { name:"유산소", pct:5,  color:"#f76f8e",
          desc:"산책 수준만. 에너지 소모를 최소화하는 게 핵심입니다." },
      ]
    },
    life: [
      "무리한 운동은 금물 — 에너지 소모 줄이기",
      "식사 분위기를 따뜻하고 편안하게",
      "강요 없이 즐거운 식사 환경 만들기",
    ],
    caution: "강제로 많이 먹이면 역효과! 흡수력을 먼저 키우는 게 순서입니다.",
  },
  클린업: {
    emoji: "⚾", color: "#4f8ef7",
    gradient: "linear-gradient(160deg, #040c1e, #081428)",
    desc: "흡수·연소·축적이 균형 잡힌 핵심 체질",
    goal: "목표 — 지금 이 상태 유지하기",
    direction: "균형 식단 · 영양제로 컨디션 관리",
    food: [
      "규칙적인 3끼 + 건강한 간식 유지",
      "단백질·탄수화물·지방의 균형 잡힌 식단",
      "다양한 색깔의 채소·과일 매일 섭취",
      "잡곡밥·고구마 등 복합 탄수화물 위주",
      "가공식품·인스턴트 줄이기",
    ],
    supplement: [
      "종합비타민 — 전반적 균형 유지 보조",
      "오메가3 — 두뇌 발달·집중력 향상",
      "비타민 D — 뼈 성장·면역 강화",
      "유산균 — 장 건강 예방적 관리",
      "마그네슘 — 수면·근육 회복 지원",
    ],
    exercise: {
      title: "균형 잡힌 전신 컨디션 유지",
      caution: "주 3~4회, 한 번에 40~60분이 이상적. 운동 후 충분한 수면으로 성장호르몬 극대화!",
      ratio: [
        { name:"스트레칭", pct:25, color:"#4fcfa0",
          desc:"준비·마무리 운동 철저히. 유연성 유지가 부상 예방과 성장에 모두 도움됩니다." },
        { name:"소근육\n근력", pct:30, color:"#4f8ef7",
          desc:"코어·균형감 중심. 전신 근육을 고르게 자극해 균형 잡힌 성장을 만듭니다." },
        { name:"벌크업", pct:20, color:"#f7d24f",
          desc:"전신 복합 운동으로 근육 밀도 높이기. 지금 체형을 탄탄하게 유지합니다." },
        { name:"유산소", pct:25, color:"#f76f8e",
          desc:"심폐 기능 유지. 땀 흘리는 활동을 꾸준히 해줘야 이 균형이 지속됩니다." },
      ]
    },
    life: [
      "규칙적인 운동으로 현재 상태 유지",
      "충분한 수면 — 성장호르몬 분비 핵심",
      "수분 섭취 충분히",
    ],
    caution: "지금 상태가 가장 이상적입니다. 과도한 영양제나 다이어트는 오히려 균형을 깹니다.",
  },
  슬러거: {
    emoji: "💪", color: "#f76f8e",
    gradient: "linear-gradient(160deg, #180408, #240810)",
    desc: "묵직한 저장력, 에너지가 잘 쌓이는 체질",
    goal: "목표 — 대사 높이기 · 체지방 관리",
    direction: "유산소 운동 · 저탄고단 · 대사 촉진",
    food: [
      "정제 탄수화물 (흰밥·빵·면) 줄이고 잡곡으로 교체",
      "고단백 저지방 위주 식단 (닭가슴살·두부·달걀)",
      "포만감 높은 채소·식이섬유 먼저 먹기",
      "야식·간식 시간대 조절 (저녁 7시 이후 금지)",
      "천천히 꼭꼭 씹어 먹는 습관 — 20분 이상",
    ],
    supplement: [
      "식이섬유 — 포만감·혈당 조절",
      "마그네슘 — 인슐린 감수성 개선",
      "비타민 D — 대사 기능 활성화",
      "유산균 — 장내 미생물 균형·체중 조절",
      "오메가3 — 체지방 분해 보조",
    ],
    exercise: {
      title: "대사 높이고 체지방 태우기 중심",
      caution: "주 5회 이상, 하루 40분 이상 땀 흘릴 강도로. 쉬는 날도 가벼운 산책 30분은 필수!",
      ratio: [
        { name:"스트레칭", pct:10, color:"#4fcfa0",
          desc:"준비·마무리만 간단히. 유산소와 근력에 시간을 더 투자하는 게 효율적입니다." },
        { name:"소근육\n근력", pct:15, color:"#4f8ef7",
          desc:"코어 강화 위주. 기초대사량을 올려 쉬는 동안에도 칼로리가 소모되게 합니다." },
        { name:"벌크업", pct:10, color:"#f7d24f",
          desc:"근육량 늘리기보다 체지방 관리가 우선. 과도한 근비대는 지금 단계에서 불필요합니다." },
        { name:"유산소", pct:65, color:"#f76f8e",
          desc:"인터벌 트레이닝 효과적. 빠르게 1분 + 쉬기 1분 반복. 대사를 끌어올리는 핵심입니다." },
      ]
    },
    life: [
      "유산소 운동 강화 — 걷기·수영·자전거·줄넘기",
      "하루 30분 이상 땀 흘리는 활동",
      "엘리베이터 대신 계단, 생활 속 활동량 늘리기",
    ],
    caution: "성장기 아이에게 무리한 식이 제한은 금물! 질 좋은 음식으로 배를 채우는 방향으로 접근하세요.",
  },
};

// ─── 세분류 (9가지) ───────────────────────────────────────────────────────────
const subType = {
  결핍형: {
    emoji: "🫙", color: "#94a3b8",
    main: "교타자",
    codes: ["111","112","121","211"],
    shortDesc: "흡수·연소·축적 세 축 모두 낮음",
    desc: "영양이 들어오는 양 자체가 부족합니다. 소화흡수부터 전반적으로 끌어올려야 합니다.",
    plus: "소화효소를 최우선으로 — 흡수·연소·축적 모두 낮으니 영양이 들어올 통로부터 열어야 합니다.",
  },
  버너형: {
    emoji: "🔥", color: "#f97316",
    main: "교타자",
    codes: ["331","231","321"],
    shortDesc: "흡수↑ 연소↑↑ 축적↓ — 잘 흡수하지만 너무 빠르게 태움",
    desc: "흡수는 잘 되지만 에너지를 너무 빠르게 태워버려 살이 붙지 않습니다.",
    plus: "고칼로리 간식을 하루 2~3회 추가 — 연소가 특히 강하니 태워도 남을 만큼 넣어줘야 합니다.",
  },
  역류형: {
    emoji: "🌀", color: "#a78bfa",
    main: "교타자",
    codes: ["131","132","133"],
    shortDesc: "흡수↓ 연소↓ 축적 불안정 — 들어오지도 나가지도 않음",
    desc: "흡수가 안 되니 연소도 축적도 불안정합니다. 장 건강 개선이 먼저입니다.",
    plus: "유산균·소화효소 집중 — 흡수 통로가 막혀 있어 장 환경 개선이 최우선입니다.",
  },
  빈그릇형: {
    emoji: "🏺", color: "#67e8f9",
    main: "교타자",
    codes: ["311","312"],
    shortDesc: "흡수↑ 연소↓ 축적↓ — 흡수는 되는데 어디로 가는지 모름",
    desc: "흡수는 잘 되는데 연소도 축적도 안 됩니다. 에너지 활용 경로가 불명확한 유형입니다.",
    plus: "비타민 B군 집중 투여 — 흡수된 영양이 에너지로 전환될 수 있도록 대사 경로를 열어줍니다.",
  },
  항온형: {
    emoji: "🌿", color: "#4ade80",
    main: "클린업",
    codes: ["222","221","212","122"],
    shortDesc: "세 축 모두 보통 — 가장 안정적인 균형 체질",
    desc: "흡수·연소·축적이 모두 균형 잡혀 있습니다. 현재 상태를 잘 유지하는 것이 핵심입니다.",
    plus: "지금 이 상태가 이상적입니다. 규칙적인 식사와 수면만 잘 지켜주세요.",
  },
  엔진형: {
    emoji: "⚡", color: "#fbbf24",
    main: "클린업",
    codes: ["333","323"],
    shortDesc: "흡수↑ 연소↑ 축적↑ — 세 축 모두 활발",
    desc: "흡수·연소·축적이 모두 강합니다. 성장기에 가장 이상적인 체질입니다.",
    plus: "활동량에 맞는 충분한 식사량이 핵심 — 많이 쓰고 많이 저장하는 체질입니다.",
  },
  활화산형: {
    emoji: "🌋", color: "#fb923c",
    main: "클린업",
    codes: ["332","322","232"],
    shortDesc: "흡수·연소 강 축적 보통 — 건강한 마름 경계",
    desc: "흡수와 연소가 강하고 축적은 보통입니다. 건강하지만 식사량이 부족하면 금방 마를 수 있습니다.",
    plus: "고칼로리 간식을 규칙적으로 추가 — 연소가 강해 의식적으로 더 먹어야 균형이 유지됩니다.",
  },
  저장고형: {
    emoji: "🏦", color: "#f472b6",
    main: "슬러거",
    codes: ["113","213","313"],
    shortDesc: "흡수↓~↑ 연소↓ 축적↑↑ — 조금 먹어도 잘 찜",
    desc: "흡수력에 관계없이 축적력이 매우 강합니다. 적게 먹어도 잘 찌는 체질입니다.",
    plus: "식이섬유·유산균 집중 — 장내 환경을 개선해 과도한 축적을 조절합니다.",
  },
  둑형: {
    emoji: "🌊", color: "#38bdf8",
    main: "슬러거",
    codes: ["233","223","123"],
    shortDesc: "연소↓ 축적↑ — 먹은 게 그대로 쌓임",
    desc: "연소가 낮고 축적이 강합니다. 에너지를 잘 쓰지 않아 먹은 것이 그대로 체지방으로 쌓입니다.",
    plus: "유산소 운동이 최우선 — 낮은 연소력을 운동으로 끌어올리는 것이 핵심입니다.",
  },
};

// ─── 코드 → 세분류 매핑 ──────────────────────────────────────────────────────
const codeMap = {};
Object.entries(subType).forEach(([name, info]) => {
  info.codes.forEach(c => { codeMap[c] = name; });
});
// 나머지 코드 처리
const allCodes = [];
for(let a=1;a<=3;a++) for(let b=1;b<=3;b++) for(let c=1;c<=3;c++) allCodes.push(`${a}${b}${c}`);
allCodes.forEach(c => {
  if(!codeMap[c]) {
    // 가장 가까운 유형으로 매핑
    const a=+c[0], b=+c[1], cc=+c[2];
    if(a<=1 && cc>=2) codeMap[c]="역류형";
    else if(a>=3 && cc<=1) codeMap[c]="버너형";
    else if(cc>=3 && b<=1) codeMap[c]="저장고형";
    else if(cc>=2 && b<=2) codeMap[c]="둑형";
    else if(a>=2 && b>=2 && cc>=2) codeMap[c]="엔진형";
    else codeMap[c]="항온형";
  }
});

// ─── 설문 문항 ────────────────────────────────────────────────────────────────
const parentQuestions = [
  {
    id:"p1", section:"🍽️ 식탁 풍경",
    text:"\"밥 먹어!\" 불렀을 때 아이가 오는 방식은?",
    hint:"부르고 나서 밥상까지 오는 그 과정을 떠올려보세요",
    options:[
      {text:"\"응!\" 하고 바로 달려와서 숟가락 잡음 🏃", absorb:1, burn:0, store:0},
      {text:"\"어~ 알았어~\" 하고 5분 뒤에 슬쩍 옴 😐", absorb:0, burn:0, store:0},
      {text:"세 번은 불러야 겨우 옴. 표정도 별로 😑", absorb:-1, burn:0, store:-1},
      {text:"부르기도 전에 밥 냄새 맡고 먼저 와 있음 👃", absorb:1, burn:1, store:1},
    ]
  },
  {
    id:"p2", section:"🍽️ 식탁 풍경",
    text:"밥 먹는 도중 아이가 가장 자주 하는 행동은?",
    hint:"밥상 앞 아이의 단골 패턴, 딱 하나만 골라주세요",
    options:[
      {text:"\"잠깐만\" \"좀 이따가\" \"지금 배 안 고픈데\" 시전 후 결국 안 먹음 🙄", absorb:-1, burn:-1, store:-1},
      {text:"먹다가 갑자기 화장실. 이게 꽤 자주 있음 🚽", absorb:-1, burn:0, store:-1},
      {text:"다 먹고 나서도 냉장고 문을 습관적으로 열어 둘러봄 🧊", absorb:1, burn:1, store:1},
      {text:"반찬 보이면 일단 \"이거 누구 꺼야?\" 먼저 찜 👀", absorb:1, burn:0, store:1},
    ]
  },
  {
    id:"p3", section:"🍽️ 식탁 풍경",
    text:"밥상에 처음 보는 음식이 올라왔을 때 아이의 반응은?",
    hint:"낯선 음식 앞에서 튀어나오는 첫 반응을 보세요",
    options:[
      {text:"쳐다도 안 봄. \"이게 뭐야\" 한마디 하고 옆으로 밀어냄 🙅", absorb:-1, burn:0, store:-1},
      {text:"냄새부터 맡고... 한참 고민하다가 결국 손도 안 댐 👃", absorb:-1, burn:0, store:0},
      {text:"\"이거 뭐야?\" 묻고 나서 조심스럽게 한 입 시도 😬", absorb:0, burn:0, store:0},
      {text:"처음 보는 것도 일단 입에 넣고 봄. 맛이 궁금해서 😋", absorb:1, burn:1, store:1},
    ]
  },
  {
    id:"p4", section:"🔭 몸 상태 관찰",
    text:"아침에 깨웠을 때 아이의 첫 마디는?",
    hint:"오늘 아침, 혹은 평소 아침을 떠올려보세요",
    options:[
      {text:"\"5분만...\" — 이걸 최소 세 번은 반복함 🧟", absorb:-1, burn:-1, store:-1},
      {text:"눈 뜨자마자 \"배고파\" — 주방까지 직행 🏃", absorb:1, burn:1, store:0},
      {text:"말없이 천천히 일어나서 조용히 준비 시작 😌", absorb:0, burn:0, store:1},
      {text:"불 켜기도 전에 혼자 일어나 돌아다니고 있음 ⚡", absorb:1, burn:1, store:0},
    ]
  },
  {
    id:"p5", section:"🔭 몸 상태 관찰",
    text:"밥 먹고 나서 아이 배를 슬쩍 건드려보면?",
    hint:"식사 끝나고 20~30분 후, 살짝 눌러보거나 표정을 보세요",
    options:[
      {text:"북처럼 빵빵함. 본인도 \"배 빵빵해\" 하며 두드림 🥁", absorb:-1, burn:-1, store:1},
      {text:"가끔 \"배 아파\" 하면서 쪼그리고 앉음 😣", absorb:-1, burn:0, store:-1},
      {text:"언제 먹었냐는 듯 씩씩하게 놀러 나감 👍", absorb:1, burn:1, store:0},
      {text:"다 먹자마자 또 \"배고프다\" — 냉장고 앞으로 직행 🚶", absorb:1, burn:1, store:1},
    ]
  },
  {
    id:"p6", section:"🔭 몸 상태 관찰",
    text:"화장실 패턴이 어떤가요? (예민하지만 아주 중요해요!)",
    hint:"최근 한 달, 솔직하게 떠올려보세요",
    options:[
      {text:"하루에도 여러 번, 묽거나 설사 형태가 잦음 💨", absorb:-2, burn:0, store:-1},
      {text:"며칠에 한 번씩, 늘 힘들게 보고 나옴 😫", absorb:0, burn:-1, store:1},
      {text:"매일 비슷한 시간에 알아서 해결하고 나옴 ✅", absorb:1, burn:1, store:0},
      {text:"색깔이나 냄새가 유독 강하고 기름진 느낌 🟤", absorb:-1, burn:0, store:1},
    ]
  },
  {
    id:"p7", section:"⚡ 에너지 관찰",
    text:"학교 마치고 집에 돌아온 아이의 첫 행동은?",
    hint:"현관문 열고 들어오는 그 순간부터 관찰해보세요",
    options:[
      {text:"가방도 안 내려놓고 \"뭐 먹을 것 없어?\" 주방 직행 🎒", absorb:1, burn:1, store:1},
      {text:"손 씻고 간식 먹고 숙제하는 루틴이 있음 📚", absorb:1, burn:0, store:0},
      {text:"가방 던지고 바로 쓰러짐. 피곤해 죽겠다는 표정 😵", absorb:-1, burn:-1, store:-1},
      {text:"들어오자마자 어디 나가서 놀겠다고 다시 나감 🏃", absorb:1, burn:2, store:0},
    ]
  },
  {
    id:"p8", section:"⚡ 에너지 관찰",
    text:"같은 걸 뛰었는데 아이 땀 양은 또래와 비교하면?",
    hint:"체육 수업 후, 운동장 놀이 후 등 비슷한 활동 기준",
    options:[
      {text:"친구들보다 훨씬 많이 흘림. 머리까지 흠뻑 😅", absorb:0, burn:2, store:-1},
      {text:"다들 비슷한 것 같음. 딱 보통 👌", absorb:0, burn:0, store:0},
      {text:"친구들은 땀 범벅인데 우리 아이는 멀쩡 🧊", absorb:0, burn:-1, store:1},
      {text:"운동할 때보다 주로 잠잘 때 땀을 많이 흘림 🌙", absorb:-1, burn:0, store:-1},
    ]
  },
  {
    id:"p9", section:"😴 수면·회복 관찰",
    text:"불 끄고 나서 아이가 잠들기까지의 과정은?",
    hint:"어젯밤을 떠올려보세요",
    options:[
      {text:"눕자마자 10분 안에 조용해짐. 기절 수준 💤", absorb:1, burn:1, store:0},
      {text:"\"배고파\" \"물 줘\" \"화장실\" — 이유 대며 계속 나옴 🚽", absorb:1, burn:1, store:1},
      {text:"조용히 누워 있는데 한참 뒤에 잠듦. 생각이 많은 듯 🤔", absorb:-1, burn:-1, store:-1},
      {text:"더웠다 추웠다, 뒤척이다 땀 흘리며 자주 깸 😰", absorb:-1, burn:1, store:-1},
    ]
  },
  {
    id:"p10", section:"😴 수면·회복 관찰",
    text:"아이가 감기에 걸렸을 때, 어떻게 앓나요?",
    hint:"형제·자매 또는 같은 반 친구들과 비교해서",
    options:[
      {text:"잘 안 걸리고, 걸려도 3~4일이면 씩씩하게 나음 💪", absorb:1, burn:1, store:1},
      {text:"걸리면 일주일 정도, 딱 평범하게 앓고 나음 🙂", absorb:0, burn:0, store:0},
      {text:"한 번 걸리면 2주 이상. 중이염·폐렴으로 이어진 적도 있음 😷", absorb:-2, burn:-1, store:-1},
      {text:"잘 걸리진 않는데 한번 걸리면 유독 처져 있고 밥을 안 먹음 😩", absorb:-1, burn:-1, store:0},
    ]
  },
  {
    id:"p11", section:"📈 성장 패턴",
    text:"최근 6개월, 아이 체중이 어떻게 됐나요?",
    hint:"건강검진 수첩이나 성장 앱 기록을 떠올려보세요",
    options:[
      {text:"거의 그대로. 체중계가 고장난 줄 알았음 😅", absorb:-1, burn:1, store:-2},
      {text:"조금 늘긴 했는데 또래보다는 덜 늘었다는 느낌 📉", absorb:-1, burn:1, store:-1},
      {text:"꾸준히 잘 늘고 있음. 성장 곡선 따라가는 중 📊", absorb:1, burn:0, store:1},
      {text:"또래보다 확실히 빠르게, 많이 늘고 있음 📈", absorb:1, burn:-1, store:2},
    ]
  },
  {
    id:"p12", section:"📈 성장 패턴",
    text:"우리 아이 평소 모습과 제일 가까운 것은?",
    hint:"집에서, 학교에서 관찰되는 일상 속 성향",
    options:[
      {text:"낯선 것엔 일단 겁부터. 새 음식·새 장소·새 친구 다 적응 느림 🐌", absorb:-1, burn:-1, store:-1},
      {text:"가만히 있는 걸 못 함. 항상 뭔가 하고 있어야 직성이 풀림 🌪️", absorb:1, burn:2, store:-1},
      {text:"뭘 줘도 \"응\" 하고 받아들임. 불평이 별로 없음 🐻", absorb:1, burn:-1, store:1},
      {text:"조용하고 혼자 있는 걸 좋아함. 자기 세계가 있음 🌙", absorb:-1, burn:-1, store:0},
    ]
  },
];

const kidQuestions = [
  {
    id:"k1", section:"🍚 밥이랑 나랑",
    text:"\"밥 먹어!\" 소리 들었을 때 내 속마음은?",
    hint:"진짜 솔직하게! 아무도 안 봐",
    options:[
      {text:"🎉 오예! 드디어! 달려가는 중", absorb:1, burn:1, store:0},
      {text:"😒 또...? 방금 먹은 것 같은데...", absorb:-1, burn:-1, store:-1},
      {text:"🤷 뭐 나왔는지 보고 결정", absorb:0, burn:0, store:0},
      {text:"😋 밥 차리는 냄새 맡고 벌써 침 고임", absorb:1, burn:1, store:1},
    ]
  },
  {
    id:"k2", section:"🍚 밥이랑 나랑",
    text:"급식에서 내가 젤 싫어하는 반찬이 나왔어. 나는?",
    hint:"학교 급식 또는 집 밥에서 실제로 해본 것!",
    options:[
      {text:"🙅 안 먹어. 진짜로. 굶어도 괜찮아.", absorb:-2, burn:0, store:-1},
      {text:"😤 선생님 몰래 냅킨에 싸서 버림 (실화)", absorb:-1, burn:0, store:-1},
      {text:"😬 코 막고 한 입. 후다닥 삼키고 물로 넘김", absorb:0, burn:0, store:0},
      {text:"😎 싫은 건 없는데? 다 먹을 수 있음", absorb:1, burn:1, store:1},
    ]
  },
  {
    id:"k3", section:"🍚 밥이랑 나랑",
    text:"점심 먹고 오후 수업 시간, 내 배 상태는?",
    hint:"오늘 오후를 떠올려봐. 아니면 어제",
    options:[
      {text:"🔔 벌써 배고파. 시계만 보고 있음 (간식 생각)", absorb:1, burn:2, store:0},
      {text:"😌 든든하고 괜찮음. 수업에 집중 가능", absorb:1, burn:0, store:1},
      {text:"🤢 뭔가 부글부글하거나 묵직하게 불편함", absorb:-2, burn:0, store:0},
      {text:"😶 배고픈지 배부른지 솔직히 잘 모르겠음", absorb:-1, burn:-1, store:-1},
    ]
  },
  {
    id:"k4", section:"🔥 내 몸의 온도",
    text:"체육 시간에 친구들이랑 같이 뛰고 나서, 나만의 특징은?",
    hint:"같은 걸 했는데 나만 다른 점이 있으면 골라봐",
    options:[
      {text:"💦 나만 땀이 폭포임. 머리카락까지 젖음", absorb:0, burn:2, store:-1},
      {text:"😅 다들 비슷하게 흘리는 것 같음. 나도 보통", absorb:0, burn:0, store:0},
      {text:"🧊 친구들은 땀 범벅인데 나는 별로 안 남", absorb:0, burn:-1, store:1},
      {text:"🥵 얼굴은 빨개지는데 땀은 별로 없고 속이 더움", absorb:-1, burn:1, store:0},
    ]
  },
  {
    id:"k5", section:"🔥 내 몸의 온도",
    text:"교실에서 에어컨 온도 전쟁이 나면, 나는 어느 팀?",
    hint:"진짜 솔직하게! 눈치 보지 말고",
    options:[
      {text:"🥵 덥다팀. 나만 더운 것 같음. 에어컨 더 틀어줘", absorb:0, burn:2, store:-1},
      {text:"🥶 춥다팀. 여름에도 긴팔 입고 싶음. 항상 추워", absorb:-1, burn:-1, store:0},
      {text:"😊 중간파. 어느 쪽이든 별로 신경 안 씀", absorb:0, burn:0, store:0},
      {text:"🤔 때에 따라 다름. 오늘은 덥고 내일은 추운 타입", absorb:0, burn:0, store:0},
    ]
  },
  {
    id:"k6", section:"💩 은밀한 화장실 이야기",
    text:"나의 화장실 루틴은? (아무도 모르는 나만의 비밀!)",
    hint:"진짜 솔직하게 — 여기서만 말해봐",
    options:[
      {text:"✅ 매일 같은 시간에 시원하게 해결. 기분 좋음", absorb:1, burn:1, store:0},
      {text:"😫 며칠에 한 번. 오래 앉아 있어야 하고 힘듦", absorb:0, burn:-1, store:1},
      {text:"🚨 갑자기 배가 아프다가 급하게 달려가는 스타일", absorb:-2, burn:0, store:-1},
      {text:"💭 딱히 패턴이 없음. 마려우면 가고 아니면 안 가고", absorb:0, burn:0, store:0},
    ]
  },
  {
    id:"k7", section:"😴 잠이랑 나랑",
    text:"불 끄고 누웠을 때, 잠들기까지 나는?",
    hint:"어젯밤 자기 직전을 떠올려봐",
    options:[
      {text:"💤 눕자마자 기억 없음. 눈 감으면 끝", absorb:1, burn:1, store:0},
      {text:"🍕 배가 고파서 뭔가 먹고 싶은데 참다가 잠듦", absorb:1, burn:2, store:0},
      {text:"🤔 오늘 있었던 일이 자꾸 생각나서 한참 뒤에 잠듦", absorb:-1, burn:-1, store:-1},
      {text:"🌡️ 덥거나 추워서 이불을 계속 조정하다 겨우 잠듦", absorb:-1, burn:1, store:-1},
    ]
  },
  {
    id:"k8", section:"😴 잠이랑 나랑",
    text:"학교 가는 날 아침, 일어났을 때 내 몸은?",
    hint:"오늘 아침 딱 그 느낌",
    options:[
      {text:"⚡ 멀쩡함. 일어나면 바로 움직일 수 있음", absorb:1, burn:1, store:0},
      {text:"🍳 배고파서 빨리 밥 먹고 싶음. 그게 제일 먼저", absorb:1, burn:2, store:0},
      {text:"🧟 몸이 무겁고 피곤함. 학교 가기 싫은 게 반, 피곤한 게 반", absorb:-1, burn:-1, store:-1},
      {text:"😐 그냥 보통. 졸리지도 않고 신나지도 않음", absorb:0, burn:0, store:0},
    ]
  },
  {
    id:"k9", section:"🧠 내 마음 속",
    text:"급식 줄 서면서 메뉴 보고 \"오늘 별로다\" 싶을 때, 진짜 이유는?",
    hint:"제일 자주 드는 그 생각으로 골라봐",
    options:[
      {text:"🤢 냄새나 식감이 너무 싫음. 그냥 보기만 해도 거부감", absorb:-2, burn:0, store:-1},
      {text:"😶 딱히 이유는 없는데 그냥 별로 안 고픔", absorb:-1, burn:-1, store:-1},
      {text:"😤 저번에 먹고 배 아팠던 기억이 있어서", absorb:-2, burn:0, store:0},
      {text:"😊 그런 생각 별로 안 함. 나오면 먹는 편", absorb:1, burn:0, store:1},
    ]
  },
  {
    id:"k10", section:"🧠 내 마음 속",
    text:"시험이나 발표 있는 날 아침, 밥 앞에서 나는?",
    hint:"긴장되는 날 아침 밥상 앞의 내 모습",
    options:[
      {text:"🤮 배가 아프거나 메스꺼워서 한 숟갈도 못 먹겠음", absorb:-2, burn:0, store:-1},
      {text:"😐 긴장해도 밥은 밥. 그냥 평소처럼 먹고 나감", absorb:0, burn:0, store:0},
      {text:"💪 긴장하면 오히려 배가 더 고픔. 든든하게 먹어야 함", absorb:1, burn:1, store:0},
      {text:"🍫 스트레스받으면 단 거나 과자가 더 당김", absorb:0, burn:0, store:2},
    ]
  },
  {
    id:"k11", section:"🏃 몸 쓰는 이야기",
    text:"체육 수업 끝나고 딱 그 순간, 내 몸이 제일 먼저 원하는 건?",
    hint:"수업 끝나는 종소리 들리는 그 순간",
    options:[
      {text:"💧 물! 물 마시고 싶음. 일단 수분 보충", absorb:0, burn:1, store:0},
      {text:"🍔 배고파 죽겠음. 다음 급식까지 못 기다리겠음", absorb:1, burn:2, store:0},
      {text:"🛋️ 앉고 싶음. 너무 힘들었음. 좀 쉬고 싶음", absorb:-1, burn:-1, store:0},
      {text:"🤢 배가 살살 아프거나 울렁거림. 이게 종종 있음", absorb:-2, burn:0, store:-1},
    ]
  },
  {
    id:"k12", section:"🏃 몸 쓰는 이야기",
    text:"마지막 질문! 지금 이 순간 솔직히, 내 배는?",
    hint:"설문 푸는 바로 지금 이 순간",
    options:[
      {text:"🔔 배고파. 이거 끝나면 뭔가 먹을 것 같음", absorb:1, burn:1, store:0},
      {text:"😌 적당히 든든함. 딱 좋음", absorb:1, burn:0, store:1},
      {text:"😶 잘 모르겠음. 배고픈 것 같기도 하고 아닌 것 같기도 함", absorb:-1, burn:-1, store:-1},
      {text:"🤢 좀 불편하거나 더부룩함. 뭔가 걸린 느낌", absorb:-1, burn:0, store:0},
    ]
  },
];

// ─── 3축 분석 함수 ────────────────────────────────────────────────────────────
function analyze(pAns, kAns) {
  let a=0, b=0, c=0;
  [...parentQuestions,...kidQuestions].forEach(q => {
    const idx = q.id.startsWith("p") ? pAns[q.id] : kAns[q.id];
    if(idx !== undefined) {
      a += q.options[idx].absorb;
      b += q.options[idx].burn;
      c += q.options[idx].store;
    }
  });
  // -∞~+∞ → 1~3 정규화
  const norm = v => v <= -3 ? 1 : v >= 3 ? 3 : v < 0 ? 1 : v === 0 ? 2 : 3;
  const code = `${norm(a)}${norm(b)}${norm(c)}`;
  const sub = codeMap[code] || "항온형";
  const main = subType[sub].main;
  return {
    code, sub, main,
    scores: { absorb: norm(a), burn: norm(b), store: norm(c) },
    raw: { a, b, c }
  };
}

// ─── 색상 맵 ──────────────────────────────────────────────────────────────────
const sectionColor = {
  "🍽️ 식탁 풍경":"#f7954f","🔭 몸 상태 관찰":"#4fcfa0","⚡ 에너지 관찰":"#f7d24f",
  "😴 수면·회복 관찰":"#c46ff7","📈 성장 패턴":"#4f8ef7",
  "🍚 밥이랑 나랑":"#f7954f","🔥 내 몸의 온도":"#ff6b6b",
  "💩 은밀한 화장실 이야기":"#4fcfa0","😴 잠이랑 나랑":"#a78bfa",
  "🧠 내 마음 속":"#c46ff7","🏃 몸 쓰는 이야기":"#f7d24f",
};

const font = "'Apple SD Gothic Neo','Noto Sans KR',sans-serif";
const bg = "linear-gradient(160deg,#060a14 0%,#0a1128 60%,#070c1c 100%)";

// ── 피지컬업 브랜드 컬러 ──
const GOLD  = "#c9a84c";
const GOLD2 = "#e8c76a";
const GOLD3 = "#f5e0a0";
const NAVY  = "#0d1b3e";
const WHITE = "#f0f4ff";
const MUTED = "#3a5070";

// ─── 성장 기준치 (대한소아과학회 기준 근사값) ────────────────────────────────
// 남녀 평균 합산 근사치 [나이(개월)] → {height: [p3,p10,p25,p50,p75,p90,p97], weight: [...]}
const growthRef = {
  24:  {h:[80,82,84,86,89,91,93],   w:[10.0,10.8,11.5,12.2,13.0,13.8,14.6]},
  30:  {h:[84,86,89,91,94,96,99],   w:[11.0,11.9,12.7,13.6,14.5,15.4,16.3]},
  36:  {h:[88,90,93,96,99,101,104], w:[12.0,12.9,13.8,14.7,15.7,16.7,17.7]},
  42:  {h:[91,94,97,99,102,105,108],w:[12.8,13.8,14.8,15.8,16.9,18.0,19.1]},
  48:  {h:[95,97,100,103,106,109,112],w:[13.5,14.6,15.6,16.7,17.8,19.0,20.2]},
  54:  {h:[98,101,104,107,110,113,116],w:[14.2,15.3,16.4,17.6,18.8,20.0,21.3]},
  60:  {h:[101,104,107,110,114,117,120],w:[14.8,16.0,17.2,18.5,19.8,21.1,22.5]},
  72:  {h:[107,110,114,117,121,124,127],w:[16.3,17.7,19.1,20.6,22.2,23.8,25.5]},
  84:  {h:[112,116,120,123,127,131,134],w:[18.0,19.5,21.2,23.0,24.9,26.8,28.9]},
  96:  {h:[117,121,125,129,133,137,141],w:[19.7,21.5,23.4,25.5,27.7,30.0,32.5]},
  108: {h:[122,126,130,134,138,143,147],w:[21.5,23.5,25.7,28.1,30.7,33.4,36.3]},
  120: {h:[126,131,135,140,144,149,153],w:[23.4,25.7,28.2,31.0,34.0,37.2,40.6]},
  132: {h:[130,135,140,145,150,154,159],w:[25.4,28.1,31.0,34.2,37.7,41.4,45.4]},
  144: {h:[134,139,144,149,155,160,165],w:[27.6,30.7,34.0,37.7,41.7,45.8,50.3]},
  156: {h:[138,143,148,154,159,165,170],w:[30.2,33.7,37.5,41.7,46.2,50.9,55.9]},
  168: {h:[142,148,153,158,164,169,175],w:[33.2,37.1,41.4,46.1,51.2,56.5,62.1]},
};

function calcAgeFromShort(str) {
  if(!str || str.length !== 6) return null;
  const yy = parseInt(str.slice(0,2));
  const mm = parseInt(str.slice(2,4));
  const dd = parseInt(str.slice(4,6));
  if(mm<1||mm>12||dd<1||dd>31) return null;
  const now = new Date();
  const fullYear = yy <= now.getFullYear()%100 ? 2000+yy : 1900+yy;
  const b = new Date(fullYear, mm-1, dd);
  if(isNaN(b.getTime())) return null;
  const months = (now.getFullYear()-b.getFullYear())*12 + (now.getMonth()-b.getMonth());
  if(months < 0 || months > 240) return null;
  const years = Math.floor(months/12);
  return { months, years, display:`만 ${years}세 ${months%12}개월` };
}

function calcAge(birthStr) {
  if(!birthStr) return null;
  const b = new Date(birthStr);
  const now = new Date();
  const months = (now.getFullYear()-b.getFullYear())*12 + (now.getMonth()-b.getMonth());
  const years = Math.floor(months/12);
  return { months, years, display: `만 ${years}세 ${months%12}개월` };
}

function getGrowthData(months, height, weight) {
  if(!months || !height || !weight) return null;
  const keys = Object.keys(growthRef).map(Number).sort((a,b)=>a-b);
  const closest = keys.reduce((a,b) => Math.abs(b-months)<Math.abs(a-months)?b:a);
  const ref = growthRef[closest];
  const bmi = (weight / ((height/100)**2)).toFixed(1);

  const hPct = calcPercentile(height, ref.h);
  const wPct = calcPercentile(weight, ref.w);

  // 50th 표준
  const stdH = ref.h[3];
  const stdW = ref.w[3];
  const diffH = (height - stdH).toFixed(1);
  const diffW = (weight - stdW).toFixed(1);

  // 목표값 실제 cm/kg
  // ref.h = [p3, p10, p25, p50, p75, p90, p97] → 인덱스 5=90th, 4=75th, 2=25th, 1=10th
  const targetH90  = ref.h[5]; // 키 90th (상위 10%)
  const targetW90  = ref.w[5]; // 몸무게 90th
  const targetW85  = Math.round((ref.w[4]+ref.w[5])/2 * 10)/10; // 85th ≈ 75th~90th 중간
  const targetW15  = Math.round((ref.w[0]+ref.w[1])/2 * 10)/10; // 15th ≈ 3th~10th 중간

  return {
    bmi, hPct, wPct, stdH, stdW, diffH, diffW,
    targetH90, targetW90, targetW85, targetW15
  };
}

function calcPercentile(val, refs) {
  const pcts = [3,10,25,50,75,90,97];
  if(val <= refs[0]) return "3 이하";
  if(val >= refs[6]) return "97 이상";
  for(let i=0;i<6;i++){
    if(val>=refs[i] && val<=refs[i+1]){
      const ratio = (val-refs[i])/(refs[i+1]-refs[i]);
      return Math.round(pcts[i] + ratio*(pcts[i+1]-pcts[i]));
    }
  }
  return 50;
}

function getPctLabel(pct) {
  const n = typeof pct === "number" ? pct : parseInt(pct);
  if(isNaN(n)) return { label: "하위 3%", color: "#f76f8e", comment: "또래 100명 중 하위 3명 수준" };
  if(n <= 3)  return { label: "하위 3%",  color: "#f76f8e", comment: "또래 100명 중 하위 3명 수준" };
  if(n <= 10) return { label: "하위 10%", color: "#f97316", comment: "또래 100명 중 하위 10명 수준" };
  if(n <= 25) return { label: "하위 25%", color: "#f7d24f", comment: "또래 100명 중 하위 25명 수준" };
  if(n <= 50) return { label: `상위 ${100-n}%`, color: "#4fcfa0", comment: "또래 100명 중 중간 범위" };
  if(n <= 75) return { label: `상위 ${100-n}%`, color: "#4fcfa0", comment: "또래 100명 중 상위권" };
  if(n <= 90) return { label: `상위 ${100-n}%`, color: "#4f8ef7", comment: `또래 100명 중 상위 ${100-n}명 수준` };
  if(n <= 97) return { label: `상위 ${100-n}%`, color: "#a78bfa", comment: `또래 100명 중 상위 ${100-n}명 수준` };
  return { label: "상위 3%", color: "#a78bfa", comment: "또래 최상위권" };
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("intro");
  const [pIdx, setPIdx] = useState(0);
  const [kIdx, setKIdx] = useState(0);
  const [pAns, setPAns] = useState({});
  const [kAns, setKAns] = useState({});
  const [result, setResult] = useState(null);
  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [selP, setSelP] = useState(null);
  const [selK, setSelK] = useState(null);

  // 성장 데이터
  const [birth, setBirth] = useState("");
  const [heightVal, setHeightVal] = useState("");
  const [weightVal, setWeightVal] = useState("");

  const pQ = parentQuestions[pIdx];
  const kQ = kidQuestions[kIdx];

  function handleParent(i) {
    setSelP(i);
    setTimeout(() => {
      const n = {...pAns,[pQ.id]:i};
      setPAns(n); setSelP(null);
      if(pIdx < parentQuestions.length-1) setPIdx(pIdx+1);
      else setStep("bridge");
    }, 250);
  }

  function handleKid(i) {
    setSelK(i);
    setTimeout(() => {
      const n = {...kAns,[kQ.id]:i};
      setKAns(n); setSelK(null);
      if(kIdx < kidQuestions.length-1) setKIdx(kIdx+1);
      else {
        const res = analyze(pAns, n);
        setResult(res); setStep("result");
        fetchAI(pAns, n, res);
      }
    }, 250);
  }

  // 파트 B 스킵 — 부모 응답만으로 결과 보기
  function skipKid() {
    const res = analyze(pAns, {});
    setResult(res); setStep("result");
    fetchAI(pAns, {}, res);
  }

  async function fetchAI(pa, ka, res) {
    setLoading(true);
    const pS = parentQuestions.map(q=>`${q.text}: ${pa[q.id]!==undefined?q.options[pa[q.id]]?.text:"미응답"}`).join("\n");
    const kS = kidQuestions.map(q=>`${q.text}: ${ka[q.id]!==undefined?q.options[ka[q.id]]?.text:"미응답"}`).join("\n");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:
            `당신은 아동 영양 체질 전문 상담사입니다.\n\n[부모 관찰]\n${pS}\n\n[아이 자가 응답]\n${kS}\n\n[분석 결과]\n체질 코드: ${res.code}\n대분류: ${res.main}\n세분류: ${res.sub}\n흡수력: ${res.scores.absorb}/3 · 연소력: ${res.scores.burn}/3 · 축적력: ${res.scores.store}/3\n\n위 결과를 바탕으로 이 아이에게 맞는 실용적인 상담을 해주세요.\n- 200자 내외 한국어\n- 대분류(${res.main}) 방향에 맞는 구체적 조언 2~3가지\n- 따뜻하고 공감적인 톤`
          }]
        })
      });
      const d = await r.json();
      setAiAdvice(d.content?.map(i=>i.text||"").join("")||"");
    } catch { setAiAdvice("AI 상담 연결에 실패했습니다. 위 결과를 참고해 주세요."); }
    setLoading(false);
  }

  function reset() {
    setStep("intro");setPIdx(0);setKIdx(0);
    setPAns({});setKAns({});setResult(null);setAiAdvice("");
    setBirth(""); setHeightVal(""); setWeightVal("");
  }

  // ── INTRO ──
  if(step==="intro") return (
    <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px",fontFamily:font}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>

        {/* 로고 영역 */}
        <div style={{marginBottom:6}}>
          <div style={{
            display:"inline-block",
            background:"linear-gradient(135deg,#c9a84c,#e8c76a,#c9a84c)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            fontSize:34,fontWeight:900,letterSpacing:3,
          }}>PHYSICAL UP</div>
        </div>
        <div style={{
          display:"inline-block",padding:"3px 16px",borderRadius:20,
          background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.35)",
          color:GOLD,fontSize:11,letterSpacing:2,marginBottom:24
        }}>YOUTH SPORTS CLUB · 피지컬333 Test</div>

        {/* 타이틀 */}
        <h1 style={{color:WHITE,fontSize:22,fontWeight:800,lineHeight:1.5,marginBottom:8}}>
          우리 아이 체질 코드 찾기
        </h1>
        <p style={{color:MUTED,fontSize:13,lineHeight:2,marginBottom:24}}>
          흡수력 · 연소력 · 축적력<br/>
          3축 점수로 체질 코드를 산출합니다
        </p>

        {/* 3대 분류 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {[
            {name:"교타자",icon:"🏏",sub:"찌우기",color:"#4fcfa0"},
            {name:"클린업",icon:"⚾",sub:"유지",color:GOLD},
            {name:"슬러거",icon:"💪",sub:"빼기",color:"#f76f8e"},
          ].map(t=>(
            <div key={t.name} style={{
              background:`${t.color}10`,border:`1px solid ${t.color}30`,
              borderRadius:14,padding:"14px 8px",textAlign:"center"
            }}>
              <div style={{fontSize:22,marginBottom:5}}>{t.icon}</div>
              <div style={{color:t.color,fontSize:12,fontWeight:700}}>{t.name}</div>
              <div style={{color:MUTED,fontSize:10,marginTop:3}}>{t.sub}</div>
            </div>
          ))}
        </div>

        {/* 3축 설명 */}
        <div style={{
          background:"rgba(201,168,76,0.05)",borderRadius:14,
          padding:"16px",marginBottom:28,
          border:"1px solid rgba(201,168,76,0.15)",textAlign:"left"
        }}>
          <div style={{color:GOLD,fontSize:11,marginBottom:12,textAlign:"center",fontWeight:700,letterSpacing:1}}>
            ⚾ 체질 코드 읽는 법
          </div>
          {[
            ["첫째 자리","흡수력","먹은 것이 얼마나 잘 흡수되나","#4fcfa0"],
            ["둘째 자리","연소력","에너지를 얼마나 빠르게 쓰나","#f7954f"],
            ["셋째 자리","축적력","영양을 얼마나 잘 저장하나","#f76f8e"],
          ].map(([pos,name,desc,color])=>(
            <div key={name} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
              <div style={{
                background:`${color}18`,border:`1px solid ${color}40`,
                borderRadius:6,padding:"2px 8px",color,fontSize:10,fontWeight:700,flexShrink:0
              }}>{pos}</div>
              <div>
                <span style={{color:WHITE,fontSize:12,fontWeight:600}}>{name} </span>
                <span style={{color:MUTED,fontSize:11}}>{desc}</span>
              </div>
            </div>
          ))}
          <div style={{
            marginTop:12,textAlign:"center",
            color:GOLD2,fontSize:12,fontWeight:700,letterSpacing:3,
            borderTop:"1px solid rgba(201,168,76,0.15)",paddingTop:10
          }}>1 낮음 · 2 보통 · 3 높음</div>
        </div>

        {/* 신체 정보 입력 */}
        <div style={{
          background:"rgba(201,168,76,0.05)",borderRadius:14,
          padding:"16px",marginBottom:20,
          border:"1px solid rgba(201,168,76,0.15)",textAlign:"left"
        }}>
          <div style={{color:GOLD,fontSize:11,fontWeight:700,marginBottom:14,letterSpacing:1}}>
            📏 아이 신체 정보 입력 (선택)
          </div>
          <div style={{marginBottom:12}}>
            <div style={{color:WHITE,fontSize:12,marginBottom:6}}>생년월일 6자리 <span style={{color:MUTED,fontSize:11}}>(예: 190523)</span></div>
            <input
              type="text"
              value={birth}
              onChange={e=>{
                const v = e.target.value.replace(/\D/g,"").slice(0,6);
                setBirth(v);
              }}
              placeholder="YYMMDD · 예: 190523"
              maxLength={6}
              style={{
                width:"100%",padding:"10px 12px",borderRadius:8,
                background:"rgba(255,255,255,0.05)",
                border:`1px solid ${birth.length===6?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.25)"}`,
                color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",
                letterSpacing:3
              }}
            />
            {birth.length===6 && (()=>{
              const age = calcAgeFromShort(birth);
              return age
                ? <div style={{color:GOLD,fontSize:11,marginTop:5}}>✓ {age.display}</div>
                : <div style={{color:"#f76f8e",fontSize:11,marginTop:5}}>날짜를 다시 확인해주세요</div>;
            })()}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{color:WHITE,fontSize:12,marginBottom:6}}>현재 키 (cm)</div>
              <input type="number" value={heightVal} onChange={e=>setHeightVal(e.target.value)}
                placeholder="예: 115"
                style={{
                  width:"100%",padding:"10px 12px",borderRadius:8,
                  background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(201,168,76,0.25)",
                  color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box"
                }}
              />
            </div>
            <div>
              <div style={{color:WHITE,fontSize:12,marginBottom:6}}>현재 몸무게 (kg)</div>
              <input type="number" value={weightVal} onChange={e=>setWeightVal(e.target.value)}
                placeholder="예: 20"
                style={{
                  width:"100%",padding:"10px 12px",borderRadius:8,
                  background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(201,168,76,0.25)",
                  color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box"
                }}
              />
            </div>
          </div>
          {birth.length===6 && heightVal && weightVal && (()=>{
            const age = calcAgeFromShort(birth);
            const gd = getGrowthData(age?.months, parseFloat(heightVal), parseFloat(weightVal));
            if(!gd) return null;
            const hp = getPctLabel(gd.hPct);
            const wp = getPctLabel(gd.wPct);
            return (
              <div style={{
                marginTop:14,padding:"12px",borderRadius:8,
                background:"rgba(13,27,62,0.6)",border:"1px solid rgba(201,168,76,0.2)"
              }}>
                <div style={{color:GOLD,fontSize:11,fontWeight:700,marginBottom:8}}>
                  📊 {age.display} 성장 미리보기
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{color:MUTED,fontSize:10,marginBottom:3}}>키</div>
                    <div style={{color:hp.color,fontSize:18,fontWeight:900}}>{hp.label}</div>
                    <div style={{color:MUTED,fontSize:10,marginTop:2}}>표준 {gd.stdH}cm</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{color:MUTED,fontSize:10,marginBottom:3}}>몸무게</div>
                    <div style={{color:wp.color,fontSize:18,fontWeight:900}}>{wp.label}</div>
                    <div style={{color:MUTED,fontSize:10,marginTop:2}}>표준 {gd.stdW}kg</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <button onClick={()=>setStep("partA")} style={{
            padding:"16px 8px",borderRadius:12,
            background:"linear-gradient(135deg,#c9a84c,#e8c76a)",
            color:NAVY,fontSize:14,fontWeight:800,border:"none",cursor:"pointer",
            boxShadow:"0 4px 20px rgba(201,168,76,0.3)",lineHeight:1.5
          }}>
            👀 부모 설문<br/>
            <span style={{fontSize:11,fontWeight:600,opacity:0.7}}>PART A · 12문항</span>
          </button>
          <button onClick={()=>setStep("partB")} style={{
            padding:"16px 8px",borderRadius:12,
            background:"rgba(201,168,76,0.1)",
            color:GOLD2,fontSize:14,fontWeight:800,
            border:"1.5px solid rgba(201,168,76,0.4)",cursor:"pointer",lineHeight:1.5
          }}>
            🙋 아이 설문<br/>
            <span style={{fontSize:11,fontWeight:600,opacity:0.7}}>PART B · 12문항</span>
          </button>
        </div>
        <button onClick={()=>{
          const res = analyze({},{});
          setResult(res); setStep("result");
          fetchAI({},{},res);
        }} style={{
          width:"100%",padding:"12px",borderRadius:12,
          background:"rgba(255,255,255,0.03)",
          color:MUTED,fontSize:13,
          border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",marginBottom:4
        }}>⚡ 신체 정보만으로 결과 바로 보기</button>
        <p style={{color:MUTED,fontSize:11,marginTop:6,opacity:0.5}}>설문 없이 성장 지표만 확인</p>
      </div>
    </div>
  );

  // ── PART A ──
  if(step==="partA") {
    const prog = Math.round((Object.keys(pAns).length/parentQuestions.length)*100);
    return (
      <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"24px",fontFamily:font}}>
        <div style={{maxWidth:400,width:"100%"}}>

          {/* 헤더 */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{
              background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",
              borderRadius:20,padding:"4px 14px",color:GOLD,fontSize:11,fontWeight:700
            }}>👀 PART A · 부모 관찰</div>
            <span style={{
              color:GOLD,fontSize:13,fontWeight:800,
              background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.2)",
              borderRadius:20,padding:"3px 12px"
            }}>{pIdx+1} / 12</span>
          </div>

          {/* 진행바 */}
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4,marginBottom:6}}>
            <div style={{
              height:"100%",borderRadius:4,
              background:"linear-gradient(90deg,#c9a84c,#e8c76a)",
              width:`${prog}%`,transition:"width 0.3s",
              boxShadow:"0 0 8px rgba(201,168,76,0.5)"
            }}/>
          </div>
          <div style={{textAlign:"right",color:MUTED,fontSize:10,marginBottom:20}}>{prog}%</div>

          {/* 섹션 태그 */}
          <div style={{
            display:"inline-block",padding:"3px 12px",borderRadius:20,marginBottom:10,
            background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",
            color:GOLD2,fontSize:11
          }}>{pQ.section}</div>

          {/* 힌트 */}
          <div style={{color:MUTED,fontSize:12,marginBottom:10}}>💡 {pQ.hint}</div>

          {/* 질문 */}
          <h2 style={{color:WHITE,fontSize:18,fontWeight:700,lineHeight:1.6,marginBottom:22}}>{pQ.text}</h2>

          {/* 선택지 */}
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {pQ.options.map((opt,i)=>(
              <button key={i} onClick={()=>handleParent(i)} style={{
                padding:"14px 16px",borderRadius:12,textAlign:"left",
                background: selP===i
                  ? "rgba(201,168,76,0.18)"
                  : pAns[pQ.id]===i
                  ? "rgba(201,168,76,0.10)"
                  : "rgba(255,255,255,0.03)",
                border: selP===i
                  ? "1.5px solid rgba(201,168,76,0.8)"
                  : pAns[pQ.id]===i
                  ? "1.5px solid rgba(201,168,76,0.4)"
                  : "1.5px solid rgba(255,255,255,0.07)",
                color: pAns[pQ.id]===i ? GOLD3 : "#9ab8cc",
                fontSize:14,cursor:"pointer",transition:"all 0.2s",
                transform:selP===i?"scale(0.98)":"scale(1)"
              }}>{opt.text}</button>
            ))}
          </div>

          {pIdx>0&&<button onClick={()=>setPIdx(pIdx-1)} style={{
            marginTop:18,background:"none",border:"none",color:MUTED,fontSize:13,cursor:"pointer"
          }}>← 이전</button>}
        </div>
      </div>
    );
  }

  // ── BRIDGE ──
  if(step==="bridge") return (
    <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px",fontFamily:font}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{
          width:70,height:70,borderRadius:"50%",margin:"0 auto 20px",
          background:"linear-gradient(135deg,#c9a84c,#e8c76a)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,
          boxShadow:"0 0 30px rgba(201,168,76,0.4)"
        }}>🎉</div>
        <h2 style={{color:WHITE,fontSize:20,fontWeight:800,marginBottom:10}}>PART A 완료!</h2>
        <p style={{color:MUTED,fontSize:14,lineHeight:1.9,marginBottom:24}}>
          부모님의 날카로운 관찰 완료 👀<br/>
          아이 설문을 추가하면 더 정확해져요.
        </p>

        {/* 두 버튼 나란히 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <button onClick={()=>setStep("partB")} style={{
            padding:"16px 8px",borderRadius:12,
            background:"linear-gradient(135deg,#c9a84c,#e8c76a)",
            color:NAVY,fontSize:14,fontWeight:800,border:"none",cursor:"pointer",
            boxShadow:"0 4px 16px rgba(201,168,76,0.3)",lineHeight:1.6
          }}>
            🙋 아이 설문<br/>
            <span style={{fontSize:11,fontWeight:600,opacity:0.7}}>PART B · 12문항</span>
          </button>
          <button onClick={skipKid} style={{
            padding:"16px 8px",borderRadius:12,
            background:"rgba(201,168,76,0.08)",
            color:GOLD2,fontSize:14,fontWeight:800,
            border:"1.5px solid rgba(201,168,76,0.3)",cursor:"pointer",lineHeight:1.6
          }}>
            ⚡ 바로 결과<br/>
            <span style={{fontSize:11,fontWeight:600,opacity:0.7}}>부모 응답만으로</span>
          </button>
        </div>
        <p style={{color:MUTED,fontSize:11,opacity:0.5}}>
          아이 설문 건너뛰면 정확도가 낮아질 수 있어요
        </p>
      </div>
    </div>
  );

  // ── PART B ──
  if(step==="partB") {
    const prog = Math.round((Object.keys(kAns).length/kidQuestions.length)*100);
    return (
      <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"24px",fontFamily:font}}>
        <div style={{maxWidth:400,width:"100%"}}>

          {/* 헤더 */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{
              background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",
              borderRadius:20,padding:"4px 14px",color:GOLD,fontSize:11,fontWeight:700
            }}>🙋 PART B · 아이 자가체크</div>
            <span style={{
              color:GOLD,fontSize:13,fontWeight:800,
              background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.2)",
              borderRadius:20,padding:"3px 12px"
            }}>{kIdx+1} / 12</span>
          </div>

          {/* 진행바 */}
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4,marginBottom:6}}>
            <div style={{
              height:"100%",borderRadius:4,
              background:"linear-gradient(90deg,#e8c76a,#f5e0a0)",
              width:`${prog}%`,transition:"width 0.3s",
              boxShadow:"0 0 8px rgba(232,199,106,0.5)"
            }}/>
          </div>
          <div style={{textAlign:"right",color:MUTED,fontSize:10,marginBottom:20}}>{prog}%</div>

          {/* 섹션 태그 */}
          <div style={{
            display:"inline-block",padding:"3px 12px",borderRadius:20,marginBottom:10,
            background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",
            color:GOLD2,fontSize:11
          }}>{kQ.section}</div>

          {/* 힌트 */}
          <div style={{color:MUTED,fontSize:12,marginBottom:10}}>✏️ {kQ.hint}</div>

          {/* 질문 */}
          <h2 style={{color:WHITE,fontSize:18,fontWeight:700,lineHeight:1.6,marginBottom:22}}>{kQ.text}</h2>

          {/* 선택지 */}
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {kQ.options.map((opt,i)=>(
              <button key={i} onClick={()=>handleKid(i)} style={{
                padding:"14px 16px",borderRadius:12,textAlign:"left",
                background: selK===i
                  ? "rgba(201,168,76,0.18)"
                  : kAns[kQ.id]===i
                  ? "rgba(201,168,76,0.10)"
                  : "rgba(255,255,255,0.03)",
                border: selK===i
                  ? "1.5px solid rgba(201,168,76,0.8)"
                  : kAns[kQ.id]===i
                  ? "1.5px solid rgba(201,168,76,0.4)"
                  : "1.5px solid rgba(255,255,255,0.07)",
                color: kAns[kQ.id]===i ? GOLD3 : "#9ab8cc",
                fontSize:14,cursor:"pointer",transition:"all 0.2s",
                transform:selK===i?"scale(0.98)":"scale(1)"
              }}>{opt.text}</button>
            ))}
          </div>

          {kIdx>0&&<button onClick={()=>setKIdx(kIdx-1)} style={{
            marginTop:18,background:"none",border:"none",color:MUTED,fontSize:13,cursor:"pointer"
          }}>← 이전</button>}
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if(step==="result"&&result) {
    const mi = mainType[result.main];
    const si = subType[result.sub];
    const axes = [
      {label:"흡수력",val:result.scores.absorb,color:"#4fcfa0",desc:["낮음","보통","높음"]},
      {label:"연소력",val:result.scores.burn,color:"#f7954f",desc:["낮음","보통","높음"]},
      {label:"축적력",val:result.scores.store,color:"#f76f8e",desc:["낮음","보통","높음"]},
    ];

    return (
      <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 20px 60px",fontFamily:font}}>
        <div style={{maxWidth:400,width:"100%"}}>

          {/* 브랜드 헤더 */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{
              background:"linear-gradient(135deg,#c9a84c,#e8c76a,#c9a84c)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              fontSize:13,fontWeight:900,letterSpacing:3
            }}>PHYSICAL UP · 피지컬333 Test</div>
          </div>

      {/* 성장 지표 카드 */}
          {(()=>{
            if(!birth || birth.length!==6 || !heightVal || !weightVal) return null;
            const age = calcAgeFromShort(birth);
            const gd = getGrowthData(age?.months, parseFloat(heightVal), parseFloat(weightVal));
            if(!gd) return null;
            const hp = getPctLabel(gd.hPct);
            const wp = getPctLabel(gd.wPct);
            const hDiff = parseFloat(gd.diffH);
            const wDiff = parseFloat(gd.diffW);

            // 백분위 → 가로 위치 % 변환
            const pctToPos = (pct) => {
              if(pct === "3 이하") return 1;
              if(pct === "97 이상") return 99;
              return Math.min(99, Math.max(1, typeof pct === "number" ? pct : parseInt(pct)));
            };
            const hPos = pctToPos(gd.hPct);
            const wPos = pctToPos(gd.wPct);

            // ── 체질별 운동선수 기대치 (실제 cm/kg) ──
            const hTargetVal = gd.targetH90;  // 키 목표: 상위 10% 실제값
            const wTargetVal = result.main === "교타자" ? gd.targetW85
                             : result.main === "클린업" ? gd.targetW90
                             : gd.targetW15; // 슬러거는 하위 15%가 목표
            const wTargetLabel = result.main === "교타자" ? "상위 15% 목표"
                               : result.main === "클린업" ? "상위 10% 목표"
                               : "상위 15% 관리";

            // cm/kg → 위치% 변환 (백분위 역산)
            const hTargetPos = pctToPos(calcPercentile(hTargetVal, (() => {
              const keys = Object.keys(growthRef).map(Number).sort((a,b)=>a-b);
              const age2 = calcAgeFromShort(birth);
              const closest = keys.reduce((a,b)=>Math.abs(b-age2.months)<Math.abs(a-age2.months)?b:a);
              return growthRef[closest].h;
            })()));
            const wTargetPos = result.main === "슬러거" ? 15 :
              pctToPos(calcPercentile(wTargetVal, (() => {
                const keys = Object.keys(growthRef).map(Number).sort((a,b)=>a-b);
                const age2 = calcAgeFromShort(birth);
                const closest = keys.reduce((a,b)=>Math.abs(b-age2.months)<Math.abs(a-age2.months)?b:a);
                return growthRef[closest].w;
              })()));

            // 백분위 구간 라벨
            const bands = [
              {label:"3",pos:3},{label:"10",pos:10},{label:"25",pos:25},
              {label:"50",pos:50},{label:"75",pos:75},{label:"90",pos:90},{label:"97",pos:97}
            ];

            const GrowthBar = ({label, value, unit, pos, color, diff, stdVal, targetPos, targetVal, targetUnit, targetLabel}) => {
              const myVal = parseFloat(value);
              const tVal  = parseFloat(targetVal);
              const isSlugger = result.main === "슬러거" && unit === "kg";
              const reached = isSlugger ? myVal <= tVal : myVal >= tVal;
              const gap = Math.abs(tVal - myVal).toFixed(1);

              return (
              <div style={{marginBottom:20}}>
                {/* 제목줄 */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{color:WHITE,fontSize:12,fontWeight:700}}>{label}</span>
                    <span style={{
                      background:`${color}20`,border:`1px solid ${color}40`,
                      borderRadius:10,padding:"1px 8px",color,fontSize:11,fontWeight:800
                    }}>{value}{unit}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{
                      display:"flex",alignItems:"center",gap:4,
                      background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",
                      borderRadius:10,padding:"1px 8px"
                    }}>
                      <span style={{color:GOLD,fontSize:9}}>🎯</span>
                      <span style={{color:GOLD,fontSize:10,fontWeight:700}}>{targetVal}{targetUnit}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span style={{color:color,fontSize:13,fontWeight:900}}>{getPctLabel(pos).label}</span>
                      <span style={{color:MUTED,fontSize:10,marginLeft:3}}>현재</span>
                    </div>
                  </div>
                </div>

                {/* 그래프 트랙 */}
                <div style={{position:"relative",height:48,marginBottom:4}}>
                  <div style={{
                    position:"absolute",top:20,left:0,right:0,height:10,borderRadius:5,
                    background:"linear-gradient(90deg,#f76f8e 0%,#f7d24f 25%,#4fcfa0 50%,#4f8ef7 75%,#a78bfa 100%)",
                    opacity:0.2
                  }}/>
                  {bands.map(b=>(
                    <div key={b.label} style={{
                      position:"absolute",top:18,left:`${b.pos}%`,
                      width:1,height:14,background:"rgba(255,255,255,0.12)",
                      transform:"translateX(-50%)"
                    }}/>
                  ))}
                  <div style={{
                    position:"absolute",top:16,left:"50%",
                    width:2,height:18,background:"rgba(255,255,255,0.25)",borderRadius:1,
                    transform:"translateX(-50%)"
                  }}/>
                  {/* 🎯 기대치 마커 */}
                  <div style={{
                    position:"absolute",bottom:0,left:`${targetPos}%`,
                    transform:"translateX(-50%)",
                    display:"flex",flexDirection:"column",alignItems:"center",zIndex:8
                  }}>
                    <div style={{width:0,height:0,
                      borderLeft:"5px solid transparent",borderRight:"5px solid transparent",
                      borderBottom:`7px solid ${GOLD}`}}/>
                    <div style={{width:2,height:12,background:GOLD,borderRadius:1}}/>
                    <div style={{width:7,height:7,background:GOLD,transform:"rotate(45deg)",
                      boxShadow:`0 0 8px ${GOLD}`}}/>
                  </div>
                  {/* ★ 내 아이 마커 */}
                  <div style={{
                    position:"absolute",top:0,left:`${pos}%`,
                    transform:"translateX(-50%)",
                    display:"flex",flexDirection:"column",alignItems:"center",zIndex:10
                  }}>
                    <div style={{width:0,height:0,
                      borderLeft:"6px solid transparent",borderRight:"6px solid transparent",
                      borderTop:`8px solid ${color}`}}/>
                    <div style={{width:2,height:14,background:color,borderRadius:1}}/>
                    <div style={{width:8,height:8,borderRadius:"50%",background:color,
                      boxShadow:`0 0 8px ${color}`}}/>
                  </div>
                </div>

                {/* 구간 라벨 + 위치 라벨 */}
                <div style={{position:"relative",height:22}}>
                  {bands.map(b=>(
                    <div key={b.label} style={{
                      position:"absolute",left:`${b.pos}%`,transform:"translateX(-50%)",
                      color:"rgba(255,255,255,0.18)",fontSize:8,textAlign:"center"
                    }}>{b.label}</div>
                  ))}
                  <div style={{
                    position:"absolute",left:`${pos}%`,transform:"translateX(-50%)",
                    color:color,fontSize:9,fontWeight:800,whiteSpace:"nowrap",top:9
                  }}>★ {value}{unit}</div>
                  <div style={{
                    position:"absolute",left:`${targetPos}%`,transform:"translateX(-50%)",
                    color:GOLD,fontSize:8,fontWeight:700,whiteSpace:"nowrap",top:0,
                    textShadow:`0 0 6px ${GOLD}`
                  }}>🎯{targetVal}{targetUnit}</div>
                </div>

                {/* 현재 vs 목표 */}
                <div style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  marginTop:10,padding:"8px 12px",borderRadius:8,
                  background: reached ? "rgba(79,207,160,0.08)" : "rgba(201,168,76,0.06)",
                  border: reached ? "1px solid rgba(79,207,160,0.2)" : "1px solid rgba(201,168,76,0.15)"
                }}>
                  <div>
                    <span style={{color:MUTED,fontSize:11}}>또래 평균 {stdVal}{unit}</span>
                    <span style={{
                      color: parseFloat(diff)>=0 ? "#4fcfa0" : "#f76f8e",
                      fontSize:11,fontWeight:700,marginLeft:8
                    }}>{parseFloat(diff)>=0?"+":""}{diff}{unit}</span>
                  </div>
                  {reached ? (
                    <span style={{color:"#4fcfa0",fontSize:11,fontWeight:700}}>🏆 목표 달성!</span>
                  ) : (
                    <span style={{color:GOLD,fontSize:11,fontWeight:700}}>
                      🎯 {isSlugger ? `${gap}${unit} 감량 필요` : `${gap}${unit} 더 필요`}
                    </span>
                  )}
                </div>
              </div>
            );};

            return (
              <div style={{
                background:"rgba(13,27,62,0.8)",borderRadius:16,padding:"18px",marginBottom:12,
                border:"1px solid rgba(201,168,76,0.3)",
                boxShadow:"0 4px 20px rgba(201,168,76,0.1)"
              }}>
                <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:2,letterSpacing:1}}>
                  📏 성장 지표 분석
                </div>
                <div style={{color:MUTED,fontSize:11,marginBottom:16,
                  borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:10}}>
                  {age.display} · BMI {gd.bmi}
                </div>

                <GrowthBar
                  label="키" value={heightVal} unit="cm"
                  pos={hPos} color="#4fcfa0"
                  diff={hDiff} stdVal={gd.stdH}
                  targetPos={hTargetPos} targetVal={hTargetVal} targetUnit="cm"
                  targetLabel="선수 목표"
                />
                <GrowthBar
                  label="몸무게" value={weightVal} unit="kg"
                  pos={wPos} color="#4f8ef7"
                  diff={wDiff} stdVal={gd.stdW}
                  targetPos={wTargetPos} targetVal={wTargetVal} targetUnit="kg"
                  targetLabel={wTargetLabel}
                />

                {/* 종합 코멘트 */}
                <div style={{
                  padding:"12px",borderRadius:8,
                  background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)"
                }}>
                  <div style={{
                    color:GOLD,fontSize:11,fontWeight:700,marginBottom:8,letterSpacing:1
                  }}>⚾ 운동선수 성장 기대치 분석</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:MUTED,fontSize:11}}>📐 키 목표 {hTargetVal}cm (상위 10%)</span>
                      {parseFloat(heightVal) >= hTargetVal
                        ? <span style={{color:"#4fcfa0",fontSize:11,fontWeight:700}}>🏆 달성!</span>
                        : <span style={{color:GOLD,fontSize:11,fontWeight:700}}>
                            🎯 {(hTargetVal - parseFloat(heightVal)).toFixed(1)}cm 더 필요
                          </span>
                      }
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:MUTED,fontSize:11}}>
                        ⚖️ 몸무게 목표 {wTargetVal}kg ({wTargetLabel})
                      </span>
                      {(result.main==="슬러거"
                        ? parseFloat(weightVal) <= wTargetVal
                        : parseFloat(weightVal) >= wTargetVal)
                        ? <span style={{color:"#4fcfa0",fontSize:11,fontWeight:700}}>🏆 달성!</span>
                        : <span style={{color:GOLD,fontSize:11,fontWeight:700}}>
                            🎯 {Math.abs(wTargetVal - parseFloat(weightVal)).toFixed(1)}kg{" "}
                            {result.main==="슬러거" ? "감량 필요" : "더 필요"}
                          </span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 코드 메인 카드 */}
          <div style={{
            textAlign:"center",padding:"28px 20px",
            background:"linear-gradient(160deg,#0d1b3e,#0f2050)",
            border:"1px solid rgba(201,168,76,0.35)",
            borderRadius:20,marginBottom:12,
            boxShadow:"0 8px 40px rgba(201,168,76,0.15)"
          }}>
            {/* 코드 뱃지 */}
            <div style={{
              display:"inline-block",padding:"8px 28px",borderRadius:12,marginBottom:18,
              background:"linear-gradient(135deg,#c9a84c,#e8c76a)",
              boxShadow:"0 4px 16px rgba(201,168,76,0.4)"
            }}>
              <span style={{color:NAVY,fontSize:28,fontWeight:900,letterSpacing:8}}>{result.code}</span>
            </div>

            {/* 대분류 + 세분류 */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12}}>
              <div>
                <div style={{color:MUTED,fontSize:10,marginBottom:3,letterSpacing:1}}>대분류</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:24}}>{mi.emoji}</span>
                  <span style={{color:GOLD2,fontSize:20,fontWeight:800}}>{result.main}</span>
                </div>
              </div>
              <div style={{width:1,height:40,background:"rgba(201,168,76,0.2)"}}/>
              <div>
                <div style={{color:MUTED,fontSize:10,marginBottom:3,letterSpacing:1}}>세분류</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:18}}>{si.emoji}</span>
                  <span style={{color:si.color,fontSize:18,fontWeight:800}}>{result.sub}</span>
                </div>
              </div>
            </div>
            <p style={{color:MUTED,fontSize:13,lineHeight:1.7,margin:0}}>{si.shortDesc}</p>
          </div>

          {/* 3축 게이지 */}
          <div style={{
            background:"rgba(13,27,62,0.6)",borderRadius:16,padding:"18px",marginBottom:12,
            border:"1px solid rgba(201,168,76,0.15)"
          }}>
            <div style={{
              color:GOLD,fontSize:11,marginBottom:16,fontWeight:700,letterSpacing:1,
              borderBottom:"1px solid rgba(201,168,76,0.15)",paddingBottom:10
            }}>⚾ 3축 체질 코드 분석</div>
            {axes.map(ax=>(
              <div key={ax.label} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{color:WHITE,fontSize:12,fontWeight:600}}>{ax.label}</span>
                  <span style={{color:ax.color,fontSize:12,fontWeight:700}}>{ax.val} · {ax.desc[ax.val-1]}</span>
                </div>
                <div style={{display:"flex",gap:4}}>
                  {[1,2,3].map(n=>(
                    <div key={n} style={{
                      flex:1,height:10,borderRadius:4,
                      background:n<=ax.val?ax.color:"rgba(255,255,255,0.06)",
                      boxShadow:n<=ax.val?`0 0 6px ${ax.color}60`:"none",
                      transition:"all 0.5s"
                    }}/>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 27가지 분포도 */}
          {(()=>{
            // 27가지 유형별 가상 분포 데이터 (실제 통계 근사값)
            const distData = {
              "111":3,"112":2,"121":3,"211":2,  // 결핍형
              "331":5,"231":4,"321":4,           // 버너형
              "131":3,"132":2,"133":2,           // 역류형
              "311":3,"312":2,                   // 빈그릇형
              "222":8,"221":5,"212":4,"122":4,   // 항온형
              "333":5,"323":4,                   // 엔진형
              "332":5,"322":4,"232":3,           // 활화산형
              "113":3,"213":2,"313":2,           // 저장고형
              "233":5,"223":4,"123":3,           // 둑형
            };
            const myCode = result.code;
            const allCodes = Object.keys(distData);
            const maxVal = Math.max(...Object.values(distData));

            // 대분류별 색상
            const codeColor = (code) => {
              const sub = codeMap[code];
              const main = subType[sub]?.main;
              if(main==="교타자") return "#4fcfa0";
              if(main==="클린업") return GOLD;
              return "#f76f8e";
            };

            // 3x9 그리드로 배치 (흡수 1~3 × 연소/축적 조합)
            const grid = [
              ["111","112","113","121","122","123","131","132","133"],
              ["211","212","213","221","222","223","231","232","233"],
              ["311","312","313","321","322","323","331","332","333"],
            ];

            return (
              <div style={{
                background:"rgba(13,27,62,0.6)",borderRadius:16,padding:"18px",marginBottom:12,
                border:"1px solid rgba(201,168,76,0.15)"
              }}>
                <div style={{
                  color:GOLD,fontSize:11,marginBottom:6,fontWeight:700,letterSpacing:1,
                }}>📊 또래 아이들 체질 분포도</div>
                <div style={{color:MUTED,fontSize:10,marginBottom:16}}>
                  ⭐ 표시가 우리 아이 위치입니다
                </div>

                {/* 범례 */}
                <div style={{display:"flex",gap:12,marginBottom:14,justifyContent:"center"}}>
                  {[["교타자","#4fcfa0"],["클린업",GOLD],["슬러거","#f76f8e"]].map(([name,color])=>(
                    <div key={name} style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:8,height:8,borderRadius:2,background:color}}/>
                      <span style={{color:MUTED,fontSize:10}}>{name}</span>
                    </div>
                  ))}
                </div>

                {/* 흡수력 라벨 */}
                <div style={{display:"flex",marginBottom:4}}>
                  <div style={{width:28}}/>
                  {["흡수 1","흡수 2","흡수 3"].map(l=>(
                    <div key={l} style={{flex:3,textAlign:"center",color:MUTED,fontSize:9}}>{l}</div>
                  ))}
                </div>

                {/* 분포 그리드 */}
                {grid.map((row, rowIdx)=>{
                  const rowLabels = ["연소\n1·2·3","연소\n1·2·3","연소\n1·2·3"];
                  return (
                    <div key={rowIdx} style={{display:"flex",gap:3,marginBottom:3,alignItems:"center"}}>
                      {/* 왼쪽 라벨 */}
                      <div style={{
                        width:28,fontSize:8,color:MUTED,textAlign:"center",lineHeight:1.3,flexShrink:0
                      }}>
                        {rowIdx===0?"축적\n1~3":rowIdx===1?"축적\n1~3":"축적\n1~3"}
                      </div>
                      {row.map(code=>{
                        const isMe = code === myCode;
                        const val = distData[code] || 1;
                        const color = codeColor(code);
                        const sub = codeMap[code];
                        const barH = Math.round((val/maxVal)*36)+8;
                        return (
                          <div key={code} style={{
                            flex:1,display:"flex",flexDirection:"column",
                            alignItems:"center",gap:2
                          }}>
                            {/* 내 아이 표시 */}
                            <div style={{
                              fontSize:isMe?12:0,
                              color:GOLD2,
                              lineHeight:1,
                              height:14,
                              display:"flex",alignItems:"center"
                            }}>{isMe?"⭐":""}</div>
                            {/* 막대 */}
                            <div style={{
                              width:"100%",height:barH,borderRadius:"3px 3px 0 0",
                              background: isMe
                                ? `linear-gradient(180deg,${GOLD2},${GOLD})`
                                : `${color}${isMe?"ff":"55"}`,
                              border: isMe ? `1.5px solid ${GOLD}` : "none",
                              boxShadow: isMe ? `0 0 10px ${GOLD}80` : "none",
                              transition:"all 0.3s",
                              position:"relative"
                            }}/>
                            {/* 코드 */}
                            <div style={{
                              fontSize:isMe?9:8,
                              color: isMe ? GOLD2 : `${color}99`,
                              fontWeight: isMe ? 800 : 400,
                              letterSpacing:0
                            }}>{code}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* X축 설명 */}
                <div style={{
                  marginTop:12,padding:"10px 12px",
                  background:"rgba(201,168,76,0.05)",borderRadius:8,
                  border:"1px solid rgba(201,168,76,0.1)"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{color:GOLD2,fontSize:12}}>⭐</span>
                    <span style={{color:GOLD2,fontSize:12,fontWeight:700}}>
                      우리 아이 — {myCode} {result.sub}
                    </span>
                  </div>
                  <div style={{color:MUTED,fontSize:11,lineHeight:1.6}}>
                    또래 100명 중 약 <span style={{color:GOLD2,fontWeight:700}}>{distData[myCode]||2}명</span>이
                    같은 체질 코드예요.
                    {distData[myCode]>=6
                      ? " 가장 흔한 체질 그룹에 속합니다."
                      : distData[myCode]>=4
                      ? " 비교적 일반적인 체질입니다."
                      : " 비교적 드문 체질 유형입니다."
                    }
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 대분류 솔루션 */}
          <div style={{
            background:"rgba(13,27,62,0.6)",borderRadius:16,padding:"18px",marginBottom:12,
            border:"1px solid rgba(201,168,76,0.15)"
          }}>
            <div style={{
              color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1
            }}>{mi.goal}</div>
            <div style={{
              color:MUTED,fontSize:12,marginBottom:16,
              borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:12
            }}>{mi.direction}</div>

            {[["🥗 음식 대책",mi.food],["💊 영양제 대책",mi.supplement],["✅ 생활 습관",mi.life]].map(([title,items])=>(
              <div key={title} style={{marginBottom:16}}>
                <div style={{color:GOLD2,fontSize:12,fontWeight:700,marginBottom:8}}>{title}</div>
                {items.map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                    <span style={{color:GOLD,fontSize:10,marginTop:4,flexShrink:0}}>▸</span>
                    <span style={{color:"#7a9ab8",fontSize:13,lineHeight:1.7}}>{item}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* 운동 비율 차트 */}
            <div style={{marginBottom:8}}>
              <div style={{color:GOLD2,fontSize:12,fontWeight:700,marginBottom:4}}>🏃 추천 운동 비율</div>
              <div style={{color:MUTED,fontSize:11,marginBottom:12}}>{mi.exercise.title}</div>

              {/* 스택 바 */}
              <div style={{display:"flex",height:28,borderRadius:8,overflow:"hidden",marginBottom:14,gap:1}}>
                {mi.exercise.ratio.map(r=>(
                  <div key={r.name} style={{
                    width:`${r.pct}%`,background:r.color,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"width 0.6s",minWidth:r.pct>0?2:0
                  }}>
                    {r.pct>=12&&<span style={{color:NAVY,fontSize:9,fontWeight:800,lineHeight:1.2,textAlign:"center"}}>
                      {r.pct}%
                    </span>}
                  </div>
                ))}
              </div>

              {/* 항목별 상세 */}
              {mi.exercise.ratio.map(r=>(
                <div key={r.name} style={{
                  display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"
                }}>
                  {/* 색상 + 이름 + % */}
                  <div style={{flexShrink:0,textAlign:"center",width:52}}>
                    <div style={{
                      background:`${r.color}20`,border:`1px solid ${r.color}50`,
                      borderRadius:6,padding:"3px 4px",marginBottom:2
                    }}>
                      <div style={{color:r.color,fontSize:11,fontWeight:800,lineHeight:1.2,whiteSpace:"pre-line"}}>{r.name}</div>
                    </div>
                    <div style={{color:r.color,fontSize:13,fontWeight:900}}>{r.pct}%</div>
                  </div>
                  {/* 설명 + 개별 바 */}
                  <div style={{flex:1}}>
                    <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:5}}>
                      <div style={{
                        height:"100%",borderRadius:2,background:r.color,
                        width:`${r.pct}%`,transition:"width 0.8s",
                        boxShadow:`0 0 4px ${r.color}60`
                      }}/>
                    </div>
                    <span style={{color:"#6a8aaa",fontSize:12,lineHeight:1.6}}>{r.desc}</span>
                  </div>
                </div>
              ))}

              {/* 주의 */}
              <div style={{
                marginTop:4,padding:"8px 12px",borderRadius:8,
                background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)"
              }}>
                <span style={{color:GOLD,fontSize:10}}>⚠️ </span>
                <span style={{color:"#8a7840",fontSize:11,lineHeight:1.6}}>{mi.exercise.caution}</span>
              </div>
            </div>
          </div>

          {/* 세분류 포인트 */}
          <div style={{
            background:"rgba(13,27,62,0.6)",borderRadius:14,padding:"16px",marginBottom:12,
            border:`1px solid ${si.color}30`
          }}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{fontSize:16}}>{si.emoji}</span>
              <span style={{color:si.color,fontSize:12,fontWeight:700}}>{result.sub} 맞춤 포인트</span>
            </div>
            <p style={{color:MUTED,fontSize:13,lineHeight:1.7,margin:0}}>{si.plus}</p>
          </div>

          {/* 주의 */}
          <div style={{
            background:"rgba(201,168,76,0.06)",borderRadius:12,padding:"12px 14px",marginBottom:12,
            border:"1px solid rgba(201,168,76,0.2)"
          }}>
            <span style={{color:GOLD,fontSize:12}}>⚠️ </span>
            <span style={{color:"#8a7840",fontSize:13,lineHeight:1.7}}>{mi.caution}</span>
          </div>

          {/* AI 상담 */}
          <div style={{
            background:"rgba(13,27,62,0.8)",borderRadius:16,padding:"18px",marginBottom:20,
            border:"1px solid rgba(201,168,76,0.25)",
            boxShadow:"0 4px 20px rgba(201,168,76,0.08)"
          }}>
            <div style={{
              color:GOLD,fontSize:12,fontWeight:700,marginBottom:12,letterSpacing:1
            }}>🤖 AI 통합 맞춤 상담</div>
            {loading ? (
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{
                  width:8,height:8,borderRadius:"50%",background:GOLD,
                  animation:"pulse 1s infinite"
                }}/>
                <span style={{color:MUTED,fontSize:13}}>3축 데이터 분석 중...</span>
              </div>
            ) : (
              <p style={{color:"#8aa8c8",fontSize:13,lineHeight:1.9,margin:0}}>{aiAdvice}</p>
            )}
          </div>

          {/* 결과 저장 + 공유 버튼 */}
          {(()=>{
            const mi = mainType[result.main];
            const si = subType[result.sub];

            // 저장 텍스트 생성
            const savedDate = new Date().toLocaleDateString("ko-KR");
            const growthTxt = (birth?.length===6 && heightVal && weightVal)
              ? `\n키 ${heightVal}cm · 몸무게 ${weightVal}kg` : "";

            const shareText =
`⚾ 피지컬333 Test 결과
━━━━━━━━━━━━━━━━
PHYSICAL UP · 피지컬업

체질 코드    ${result.code}
대분류       ${result.main}
세분류       ${result.sub}
${growthTxt}
━━━━━━━━━━━━━━━━
흡수력 ${result.scores.absorb}/3  연소력 ${result.scores.burn}/3  축적력 ${result.scores.store}/3

📌 ${si.shortDesc}
🎯 ${mi.goal}

🥗 음식
${mi.food.slice(0,3).map(f=>`· ${f}`).join("\n")}

💊 영양제
${mi.supplement.slice(0,3).map(s=>`· ${s}`).join("\n")}

🏃 운동 비율
${mi.exercise.ratio.map(r=>`· ${r.name.replace("\n","")} ${r.pct}%`).join("  ")}
━━━━━━━━━━━━━━━━
${savedDate} · 피지컬업 (physicalup.kr)`;

            const [saved, setSaved] = useState(false);
            const [copied, setCopied] = useState(false);

            // 결과 저장
            const handleSave = () => {
              try {
                const saveData = {
                  date: savedDate,
                  code: result.code,
                  main: result.main,
                  sub: result.sub,
                  scores: result.scores,
                  birth, heightVal, weightVal,
                  aiAdvice
                };
                localStorage.setItem("physicalup_result", JSON.stringify(saveData));
                setSaved(true);
                setTimeout(()=>setSaved(false), 2500);
              } catch(e) {
                alert("저장에 실패했습니다.");
              }
            };

            // 클립보드 복사 → 카톡 공유
            const handleShare = async () => {
              try {
                await navigator.clipboard.writeText(shareText);
                setCopied(true);
                setTimeout(()=>setCopied(false), 3000);
              } catch(e) {
                // fallback
                const el = document.createElement("textarea");
                el.value = shareText;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
                setCopied(true);
                setTimeout(()=>setCopied(false), 3000);
              }
            };

            return (
              <div style={{marginBottom:16}}>
                {/* 버튼 두 개 나란히 */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {/* 결과 저장 */}
                  <button onClick={handleSave} style={{
                    padding:"14px 8px",borderRadius:12,
                    background: saved
                      ? "rgba(79,207,160,0.15)"
                      : "linear-gradient(135deg,#c9a84c,#e8c76a)",
                    color: saved ? "#4fcfa0" : NAVY,
                    fontSize:14,fontWeight:800,border: saved
                      ? "1.5px solid #4fcfa0"
                      : "none",
                    cursor:"pointer",lineHeight:1.5,
                    boxShadow: saved ? "none" : "0 4px 16px rgba(201,168,76,0.3)",
                    transition:"all 0.3s"
                  }}>
                    {saved ? "✅ 저장됨!" : "💾 결과 저장"}<br/>
                    <span style={{fontSize:10,fontWeight:600,opacity:0.7}}>
                      {saved ? "기기에 저장 완료" : "기기에 보관하기"}
                    </span>
                  </button>

                  {/* 카카오톡 공유 */}
                  <button onClick={handleShare} style={{
                    padding:"14px 8px",borderRadius:12,
                    background: copied
                      ? "rgba(79,207,160,0.15)"
                      : "rgba(254,229,0,0.12)",
                    color: copied ? "#4fcfa0" : "#f9e000",
                    fontSize:14,fontWeight:800,
                    border: copied
                      ? "1.5px solid #4fcfa0"
                      : "1.5px solid rgba(254,229,0,0.4)",
                    cursor:"pointer",lineHeight:1.5,
                    transition:"all 0.3s"
                  }}>
                    {copied ? "✅ 복사됨!" : "💬 카톡 공유"}<br/>
                    <span style={{fontSize:10,fontWeight:600,opacity:0.7}}>
                      {copied ? "카톡에 붙여넣기!" : "복사 후 톡 전송"}
                    </span>
                  </button>
                </div>

                {/* 복사 후 안내 */}
                {copied && (
                  <div style={{
                    padding:"10px 14px",borderRadius:10,
                    background:"rgba(254,229,0,0.06)",
                    border:"1px solid rgba(254,229,0,0.2)",
                    textAlign:"center"
                  }}>
                    <div style={{color:"#f9e000",fontSize:12,fontWeight:700,marginBottom:3}}>
                      💬 결과가 복사됐어요!
                    </div>
                    <div style={{color:MUTED,fontSize:11,lineHeight:1.6}}>
                      카카오톡 열기 → 채팅창 → 길게 누르기 → 붙여넣기
                    </div>
                  </div>
                )}

                {/* 저장 후 안내 */}
                {saved && (
                  <div style={{
                    padding:"10px 14px",borderRadius:10,
                    background:"rgba(79,207,160,0.06)",
                    border:"1px solid rgba(79,207,160,0.2)",
                    textAlign:"center"
                  }}>
                    <div style={{color:"#4fcfa0",fontSize:12,fontWeight:700,marginBottom:3}}>
                      💾 이 기기에 저장됐어요!
                    </div>
                    <div style={{color:MUTED,fontSize:11}}>
                      다음에 앱을 열면 이전 결과를 확인할 수 있어요
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <button onClick={reset} style={{
            width:"100%",padding:"14px",borderRadius:12,
            background:"rgba(201,168,76,0.06)",
            color:MUTED,fontSize:14,
            border:"1px solid rgba(201,168,76,0.2)",cursor:"pointer",marginBottom:4
          }}>🔄 처음부터 다시하기</button>

          <p style={{color:"#1a2a3a",fontSize:11,textAlign:"center",marginTop:14,lineHeight:1.7}}>
            본 결과는 참고용이며 의학적 진단을 대체하지 않습니다.<br/>성장곡선이 지속 하락 시 소아과 진료를 권장합니다.
          </p>
        </div>
      </div>
    );
  }
  return null;
}
