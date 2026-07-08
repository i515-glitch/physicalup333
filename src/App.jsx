import React, { useState } from "react";
import TossCheckoutButton from "./components/payment/TossCheckoutButton";
import PayPalCheckoutButton from "./components/payment/PayPalCheckoutButton";
import { TOSS_PRODUCTS, generateOrderId } from "./lib/toss";
import { PAYPAL_PRODUCTS } from "./lib/paypal";

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
  결핍형: {emoji:"🫙",color:"#94a3b8",main:"소비형",codes:["111","211","112","121"],shortDesc:"선천/대사/생활 세 축 모두 정체됨",desc:"영양이 들어오고 축적되는 효율이 다소 막혀 있습니다.",plus:"소화효소를 최우선으로 — 위장 대사 흡수력부터 활성화해야 합니다."},
  버너형: {emoji:"🔥",color:"#f97316",main:"소비형",codes:["133","132","123","122"],shortDesc:"대사·생활은 활발하나 선천 골격이 가벼움",desc:"에너지는 잘 쓰지만 몸집을 키우는 축적력이 비교적 약합니다.",plus:"고칼로리 간식을 하루 2~3회 추가 — 에너지 소실을 막아주어야 합니다."},
  역류형: {emoji:"🌀",color:"#a78bfa",main:"소비형",codes:["113","213","313","212"],shortDesc:"선천/생활 대비 대사 흡수율이 낮음",desc:"소화 흡수율이 낮아 먹는 에너지 중 손실되는 비율이 큽니다.",plus:"유산균·소화효소 집중 — 위장 기능 재생과 장 환경 개선이 최우선입니다."},
  빈그릇형: {emoji:"🏺",color:"#67e8f9",main:"소비형",codes:["131","231"],shortDesc:"선천 보통/약함 · 대사 고흡수 · 생활 정적",desc:"소화 흡수력은 높지만 에너지를 쓰는 생활 활동량이 정체되어 있습니다.",plus:"비타민 B군 집중 — 흡수된 영양이 활동 에너지로 전환되도록 대사를 돕습니다."},
  항온형: {emoji:"🌿",color:"#4ade80",main:"균형형",codes:["222","221"],shortDesc:"세 축 모두 보통 — 가장 안정적인 균형 체질",desc:"선천·대사·생활 3축이 고르게 균형을 잡고 있습니다.",plus:"성장기 최적의 상태입니다. 규칙적인 영양 식사와 숙면만 유지해 주세요."},
  엔진형: {emoji:"⚡",color:"#fbbf24",main:"균형형",codes:["333","332"],shortDesc:"선천 장대 · 대사 보통/우수 · 생활 활발",desc:"선천 골격이 우수하고 흡수와 생활 에너지가 모두 강력합니다.",plus:"스포츠 꿈나무 최적 체질입니다. 칼로리와 고단백 공급량이 핵심입니다."},
  활화산형: {emoji:"🌋",color:"#fb923c",main:"소비형",codes:["233","232","223"],shortDesc:"대사 고흡수 · 생활 활발 · 선천 보통",desc:"에너지 대사와 소화 흡수력이 우수하여 활발하게 에너지를 씁니다.",plus:"고단백질 및 고칼로리 간식 배치 — 활발한 대사 소모를 적극 채워야 합니다."},
  저장고형: {emoji:"🏦",color:"#f472b6",main:"저장형",codes:["311","321","331"],shortDesc:"선천 골격 장대 · 대사 흡수 약함",desc:"타고난 골격에 비해 소화 대사 효율이 떨어져 뼈와 근육의 성장이 정체됩니다.",plus:"식이섬유·유산균 집중 — 장내 영양 통로를 복구하고 단백질 합성을 돕습니다."},
  둑형: {emoji:"🌊",color:"#38bdf8",main:"저장형",codes:["323","322","312"],shortDesc:"선천 골격 장대 · 대사 보통 · 생활 정적",desc:"뼈대 잠재력은 우수하나 후천적 활동량 및 수면 불균형으로 에너지가 갇혀 있습니다.",plus:"유산소 및 플라이오메트릭 운동 — 성장판 혈류를 자극하는 운동 처방이 핵심입니다."},
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
  "111": {
    emoji: "🌱",
    nick: "무한성장 기대주",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "112": {
    emoji: "🌱",
    nick: "우리동네 골목대장",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "113": {
    emoji: "🌱",
    nick: "상큼발랄 팅커벨",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "121": {
    emoji: "🏃",
    nick: "출동준비 비행기",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "122": {
    emoji: "🏃",
    nick: "작은고추 매운맛",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "123": {
    emoji: "🏃",
    nick: "의지만렙 작은거인",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "131": {
    emoji: "🚲",
    nick: "엔진빵빵 클래식카",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "132": {
    emoji: "🚲",
    nick: "알짜배기 깡다구",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "133": {
    emoji: "🚲",
    nick: "대기만성 반전매력",
    wit: "타고난 체형: 슬림·작은 골격 / 기질 체질: 소음인(예민 위장) (정신성향: 情과다·예민)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "211": {
    emoji: "💪",
    nick: "비상임박 유망주",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "212": {
    emoji: "💪",
    nick: "내일향한 숨고르기",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "213": {
    emoji: "💪",
    nick: "안절부절 바른생활",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "221": {
    emoji: "⚖️",
    nick: "여유만만 도련님",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "222": {
    emoji: "⚖️",
    nick: "이세계의 무게중심",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "223": {
    emoji: "⚖️",
    nick: "바른생활 부반장",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "231": {
    emoji: "⚡",
    nick: "폭풍흡수 먹방러",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "232": {
    emoji: "⚡",
    nick: "뷔페 환영 보일러",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "233": {
    emoji: "⚡",
    nick: "노력형 디젤엔진",
    wit: "타고난 체형: 중간 프레임 / 기질 체질: 소양인(과연소) (정신성향: 心 주재·보통)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "311": {
    emoji: "🏔️",
    nick: "파업선언 장군님",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "312": {
    emoji: "🏔️",
    nick: "멘탈소심 거인",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "313": {
    emoji: "🏔️",
    nick: "예민보스 모범생",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 마름·저장약 (대사 흡수 수준: 막힘) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 소화쉬운 고영양밀도 (6끼 분할·소량자주) / 추천 맞춤 간식: 바나나·미숫가루"
  },
  "321": {
    emoji: "🏆",
    nick: "이중생활 천재선수",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "322": {
    emoji: "🏆",
    nick: "성장계의 엄친아",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "323": {
    emoji: "🏆",
    nick: "직진형 에너자이저",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 보통 (대사 흡수 수준: 보통) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 균형식 (4~5끼) / 추천 맞춤 간식: 견과·유제품"
  },
  "331": {
    emoji: "🔥",
    nick: "불타오른 야생마",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 정적·활동부족",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "332": {
    emoji: "🔥",
    nick: "성장가능 가치주",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 보통 활동",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
  "333": {
    emoji: "🔥",
    nick: "성장판 프리패스상",
    wit: "타고난 체형: 장대한 골격 / 기질 체질: 태음인(고흡수) (정신성향: 性 본연·강철멘탈)",
    tip: "현재 몸 상태: 잘 찜·근육잘붙음 (대사 흡수 수준: 고흡수) / 극복할 생활 습관: 활발·고활동",
    rx: "추천 영양 식단: 일반식+양 충분 (3끼 충분) / 추천 맞춤 간식: 자유"
  },
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

function formatPhoneNumber(value) {
  if (!value) return "";
  const clean = value.replace(/\D/g, "");
  if (clean.startsWith("02")) {
    if (clean.length < 3) return clean;
    if (clean.length < 6) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
    if (clean.length < 10) return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5)}`;
    return `${clean.slice(0, 2)}-${clean.slice(2, 6)}-${clean.slice(6, 10)}`;
  }
  if (clean.length < 4) return clean;
  if (clean.length < 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  if (clean.length < 11) return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
  return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
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
const getProjectedAdultHeight = (pct, gender) => {
  // Standard Korean Adult height tables (male vs female)
  const table = gender === "여" ? 
    [153.5, 156.5, 158.5, 161.0, 163.5, 166.0, 168.5] : // female percentiles: 3, 10, 25, 50, 75, 90, 97
    [166.0, 169.5, 172.0, 174.0, 177.0, 180.0, 183.5];  // male percentiles: 3, 10, 25, 50, 75, 90, 97
  
  const pcts = [3, 10, 25, 50, 75, 90, 97];
  if (pct <= 3) return table[0];
  if (pct >= 97) {
    // Extrapolate for >97th percentile
    return Math.round((table[6] + (pct - 97) * 0.3) * 10) / 10;
  }
  for (let i = 0; i < 6; i++) {
    if (pct >= pcts[i] && pct <= pcts[i+1]) {
      const ratio = (pct - pcts[i]) / (pcts[i+1] - pcts[i]);
      return Math.round((table[i] + ratio * (table[i+1] - table[i])) * 10) / 10;
    }
  }
  return gender === "여" ? 161.0 : 174.0;
};

const getOhengAnalysis = (fiveElements) => {
  if (!fiveElements) return null;
  const elements = [
    { name: "목 (木)", key: "목", organ: "간·담도계 (근육 및 인대)", desc: "근육의 수축·이완 및 관절 유연성" },
    { name: "화 (火)", key: "화", organ: "심장·순환계 (혈관 및 열대사)", desc: "심폐 지구력 및 체온 조절, 혈류 공급" },
    { name: "토 (土)", key: "토", organ: "비장·위장계 (소화 및 영양합성)", desc: "음식물 소화 흡수 및 살과 근육 합성" },
    { name: "금 (金)", key: "금", organ: "폐·대장계 (호흡기 및 뼈 골격)", desc: "산소 공급력, 장 건강 및 골격 강도" },
    { name: "수 (水)", key: "수", organ: "신장·방광계 (골수 및 성장호르몬)", desc: "뼈 성장 잠재력, 호르몬 균형 및 관절 윤활" }
  ];
  const excess = [];
  const deficient = [];
  elements.forEach(el => {
    const val = fiveElements[el.key] || 0;
    if (val >= 3) {
      excess.push(el);
    } else if (val === 0) {
      deficient.push(el);
    }
  });
  return { excess, deficient, elements };
};

const getConstitutionProse = (constStr) => {
  if (!constStr) return "";
  const s = constStr.toLowerCase();
  if (s.includes("이화") || s.includes("ectomorph") || s.includes("소양인")) {
    return "선천적으로 체내 신체 에너지를 외부에 매우 역동적이고 빠르게 소모하는 '이화 작용(Catabolism)' 성향이 극대화된 체형입니다. 신체 회전 속도와 첫 보폭의 대단한 순발력이 강점이며, 몸이 가벼워 관절에 가해지는 로드가 적어 어질리티(Agility) 운동과 민첩성 훈련에 탁월한 소질을 지닙니다. 다만, 에너지를 체내에 축적하는 능력이 약해 운동 강도가 급격히 높아지면 피로를 금방 느낄 수 있고 근육 밀도가 얇아지기 쉽습니다. 따라서 중간중간 짧은 고강도 휴식을 병행하는 것이 좋으며, 평소 고열량 고단백 식품 및 소화 흡수를 돕는 효소 보충제를 지속 공급하여 피지컬 크기 자체를 키우는 근력 트레이닝을 주축으로 삼는 것이 바람직합니다.";
  }
  if (s.includes("동화") || s.includes("mesomorph") || s.includes("소음인")) {
    return "섭취한 영양분을 뼈와 근육의 핵심 세포 조직으로 조밀하게 결합해내는 '동화 작용(Anabolism)'이 매우 우수하게 발달한 체형입니다. 신체의 좌우 균형과 밸런스 감각이 선천적으로 뛰어나 어떤 종목을 하더라도 기본 이상의 높은 습득력과 안정적인 퍼포먼스를 발휘합니다. 관절과 건의 신축성이 좋아 가동 범위가 넓고 부상 저항력이 높다는 큰 메리트가 있습니다. 영양분을 섬세하게 아미노산과 단백질로 전환하는 대사력이 원활하므로, 성장기 동안 적절한 미네랄과 칼슘을 충분히 보충하고 근육 밀도를 촘촘하게 채워주는 중강도의 저항성 운동 및 플라이오메트릭스 훈련을 균형 있게 배정하면 엘리트 스포츠형 피지컬로 성장할 잠재력이 대단히 큽니다.";
  }
  if (s.includes("수축") || s.includes("endomorph") || s.includes("태음인")) {
    return "기본적인 뼈의 두께와 관절 프레임 자체가 묵직하고 단단하게 형성된 선천적 체격형 체형입니다. 체내에 에너지를 오랫동안 축적하고 근섬유의 무게를 유지하는 능력이 탁월하여 지면 반발력을 활용한 힘 대결, 투척력, 그리고 충격을 견디고 버텨내는 대단한 힘과 파워를 지니고 있습니다. 무거운 프레임 덕분에 코어의 안정성이 매우 강하지만, 체내 대사 회전 속도가 비교적 완만하여 에너지가 지방으로 쉽게 고착될 우려가 있습니다. 운동량이 조금만 부족해도 순발력이 일시적으로 둔화될 수 있으므로, 평소 당류와 고탄수화물의 과다 섭취를 적절히 제어해야 하며, 주 4~5회 이상의 고강도 인터벌 러닝 및 전신 협응 유산소 운동을 지속해 주어야 스피드와 파워를 동시에 겸비한 압도적인 피지컬을 유지할 수 있습니다.";
  }
  if (s.includes("강발산") || s.includes("hyper") || s.includes("태양인")) {
    return "세포의 대사 및 에너지 전환 회전율이 일반적인 범주를 훌륭하게 상회하는 초고속 발산형 체형입니다. 젖산 축적에 저항하는 지치지 않는 근지구력과 폭발적인 신경계 반응 속도를 지니고 있어 경기 후반부까지 지치지 않고 엄청난 주력과 가속을 계속해서 이어가는 강력한 에너자이저 타입입니다. 관절의 유연성과 회복 탄력성이 매우 뛰어나 장시간 훈련을 견디는 근지구력 훈련에 엄청난 두각을 보입니다. 다만 체내 열 발산율이 높아 땀을 유독 많이 흘리며 이로 인해 수분과 필수 무기질 전해질의 체외 배출 속도가 매우 빠릅니다. 따라서 훈련 전후로 미네랄이 함유된 수분을 수시로 보충해 주어야 체온 조절 실패로 인한 조기 탈수를 예방할 수 있으며, 근 손실을 예방하기 위해 규칙적이고 밀도 높은 영양 공급에 신경 써야 합니다.";
  }
  return "선천적인 영양 흡수력과 운동 소비력의 균형이 치우침 없이 조화로운 가장 이상적인 중도 밸런스형 대사 기질을 가지고 있습니다. 섭취된 영양소와 단백질이 특정 기관이나 체지방으로 몰리지 않고 골격계, 근육계, 장기 조직 전반으로 매우 고르게 수송·배분되어 표준적인 성장 궤적을 아주 매끄럽게 유지해 나가는 강력한 기반을 갖추고 있습니다. 급격한 성조숙증이나 반대로 성장 지연 같은 대사성 교란의 위험이 상대적으로 낮으며, 어떤 운동이나 식습관 트레이닝도 몸에서 유연하게 다 수용합니다. 현재의 조화로운 3축 대사 밸런스가 무너지지 않도록 규칙적인 8시간 이상의 수면 패턴과 고른 3대 영양 균형 식단을 유지하고, 주 3회 이상의 전신 근력 및 관절 가동성 훈련을 병행하면 완성도 높은 명품 신체 피지컬을 완성해낼 수 있습니다.";
};

function getGrowthData(months,height,weight) {
  if(!months||!height||!weight) return null;
  const keys=Object.keys(growthRef).map(Number).sort((a,b)=>a-b);
  const closest=keys.reduce((a,b)=>Math.abs(b-months)<Math.abs(a-months)?b:a);
  const ref=growthRef[closest];
  const bmi=(weight/((height/100)**2)).toFixed(1);
  const hPct=calcPercentile(height,ref.h);
  const wPct=calcPercentile(weight,ref.w);
  
  // 야구 레벨별 나이대비 신장 표준 환산
  const collegeH = Math.round((ref.h[4] + ref.h[5]) / 2 * 10) / 10; // ~83rd percentile
  const proH = Math.round((ref.h[5] + (ref.h[6] - ref.h[5]) * 0.3) * 10) / 10; // ~92nd percentile
  const majorH = Math.round((ref.h[6] + 4) * 10) / 10; // ~99th percentile
  
  // 야구 레벨별 나이대비 체중 표준 환산
  const collegeW = Math.round((ref.w[4] + ref.w[5]) / 2 * 10) / 10;
  const proW = Math.round((ref.w[5] + (ref.w[6] - ref.w[5]) * 0.3) * 10) / 10;
  const majorW = Math.round((ref.w[6] + 5) * 10) / 10;

  return {
    bmi,hPct,wPct,
    stdH:ref.h[3],stdW:ref.w[3],
    diffH:(height-ref.h[3]).toFixed(1),
    diffW:(weight-ref.w[3]).toFixed(1),
    targetH:ref.h[5], // 90th
    targetW90:ref.w[5],
    targetW85:Math.round((ref.w[4]+ref.w[5])/2*10)/10,
    targetW75:ref.w[4],
    collegeH, proH, majorH,
    collegeW, proW, majorW
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

// ─── 설문 문항 (v13.1 엔진 공식 24문항 선별 풀) ───────────────────────────────
const questionPool = {
  absorb: [
    {id:"a3",text:"밥상 앞에 앉으면 입맛이 없다",dir:-1,weight:1.5},
    {id:"a4",text:"반찬도 골고루 잘 먹는다",dir:1,weight:1.5},
    {id:"a6",text:"배탈이 자주 나는 편이다",dir:-1,weight:1.5},
    {id:"a8",text:"한 번 먹을 때 양이 많은 편이다",dir:1,weight:1.5},
    {id:"a9",text:"편식이 심해서 먹는 게 한정적이다",dir:-1,weight:1.5},
    {id:"a10",text:"화장실을 매일 시원하게 다녀온다",dir:1,weight:1.5},
    {id:"a21",text:"입이 짧아서 조금만 먹어도 그만이다",dir:-1,weight:1.0},
    {id:"a25",text:"한 그릇 뚝딱 비우고 더 달라고 한다",dir:1,weight:1.0}
  ],
  burn: [
    {id:"b2",text:"밥 먹고 1시간도 안 돼서 또 배고프다",dir:1,weight:1.5},
    {id:"b3",text:"조금만 움직여도 쉽게 지친다",dir:-1,weight:1.5},
    {id:"b4",text:"가만히 있질 못하고 항상 움직인다",dir:1,weight:1.5},
    {id:"b9",text:"조금만 뛰어도 땀이 엄청 난다",dir:1,weight:1.0},
    {id:"b10",text:"활동량이 적고 느긋한 편이다",dir:-1,weight:1.5},
    {id:"b18",text:"먹는 양에 비해 살이 잘 안 찐다",dir:1,weight:1.5},
    {id:"b21",text:"에너지가 넘친다는 말을 자주 듣는다",dir:1,weight:1.0},
    {id:"b25",text:"움직이기보다 쉬는 걸 더 좋아한다",dir:-1,weight:1.5}
  ],
  store: [
    {id:"s2",text:"조금만 먹어도 금방 살이 찐다",dir:1,weight:1.5},
    {id:"s3",text:"아무리 먹어도 살이 안 붙는다",dir:-1,weight:1.5},
    {id:"s4",text:"단 음식이나 밀가루 음식을 유독 좋아한다",dir:1,weight:1.0},
    {id:"s9",text:"또래보다 마르고 가벼운 편이다",dir:-1,weight:1.5},
    {id:"s10",text:"또래보다 체중이 많이 나간다",dir:1,weight:1.5},
    {id:"s14",text:"살이 잘 안 쪄서 고민이다",dir:-1,weight:1.0},
    {id:"s24",text:"체격이 또래보다 큰 편이다",dir:1,weight:1.0},
    {id:"s30",text:"먹는 양에 비해 살이 잘 찐다",dir:1,weight:1.5}
  ]
};

// 고정된 24문항 반환 (v13.1 엔진 호환)
function getRandomQuestions(){
  return [
    ...questionPool.absorb,
    ...questionPool.burn,
    ...questionPool.store
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
      // 전혀(0)~항상(4) · dir:1 정방향, dir:-1 역방향(뒤집기)
      const score=q.dir===-1?(4-idx):idx;
      if(q.id.startsWith('a')) a+=score;
      else if(q.id.startsWith('b')) b+=score;
      else if(q.id.startsWith('s')) c+=score;
    }
  });
  // 각 축 6문항 × 최대4점 = 0~24점 → 1~3점 (8점 단위 구간배정: 0~7: 1점 / 8~15: 2점 / 16~24: 3점)
  const toScore=v=>v>=16?3:v>=8?2:1;
  const aScore=toScore(a);
  const bScore=toScore(b);
  const cScore=toScore(c);
  const code=`${cScore}${aScore}${bScore}`;
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

const IS_PROMO_ACTIVE = new Date() < new Date('2026-08-01T00:00:00');

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function App() {
  // ── 모든 state는 여기에 ──
  const [step,setStep]=useState("intro");
  const [pAns,setPAns]=useState(() => {
    try {
      const saved = localStorage.getItem("pu333_pans");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [pIdx,setPIdx]=useState(() => {
    try {
      const savedAns = localStorage.getItem("pu333_pans");
      const ansObj = savedAns ? JSON.parse(savedAns) : {};
      for (let i = 0; i < parentQuestions.length; i++) {
        if (ansObj[parentQuestions[i].id] === undefined) {
          return i;
        }
      }
      return 0;
    } catch {
      return 0;
    }
  });
  const [kIdx,setKIdx]=useState(0);
  const [kAns,setKAns]=useState({});
  const [result,setResult]=useState(null);
  const [serverResult,setServerResult]=useState(null);
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

  // ── 결제 및 유료 신청 관련 State ──
  const [gender, setGender] = useState(() => {
    try { return localStorage.getItem("pu333_gender") || "남"; }
    catch { return "남"; }
  });
  const [birthTime, setBirthTime] = useState(() => {
    try { return localStorage.getItem("pu333_birth_time") || ""; }
    catch { return ""; }
  });
  const [grade, setGrade] = useState("초등 4~6학년");
  const [sports, setSports] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState(() => {
    try { return localStorage.getItem("pu333_phone") || ""; }
    catch { return ""; }
  });
  const [fatherHeight, setFatherHeight] = useState(173);
  const [motherHeight, setMotherHeight] = useState(160);
  const [bodyFat, setBodyFat] = useState("");
  const [skeletalMuscle, setSkeletalMuscle] = useState("");
  const [wingspan, setWingspan] = useState("");
  const [inbodyFileUrl, setInbodyFileUrl] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState("toss"); // toss or paypal
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'error'
  const [paymentError, setPaymentError] = useState("");
  const [orderId, setOrderId] = useState(() => generateOrderId());

  // 토스페이먼츠 결제 요청 전 백엔드 임시 저장
  async function prepareTossPayment(genOrderId) {
    const surveyResponses = parentQuestions.map(q => {
      const idx = pAns[q.id] !== undefined ? pAns[q.id] : 2;
      const score = q.dir === -1 ? (4 - idx) : idx;
      return score + 1;
    });

    const payload = {
      orderId: genOrderId,
      request: {
        name: childName,
        gender: gender,
        birth_date: birth,
        birth_time: birthTime || "시간 모름",
        grade: grade,
        sports: sports,
        position: position || "",
        phone: phone,
        father_height: parseFloat(fatherHeight) || 173.0,
        mother_height: parseFloat(motherHeight) || 160.0,
        current_height: parseFloat(heightVal) || 160.0,
        current_weight: parseFloat(weightVal) || 50.0,
        body_fat: bodyFat ? parseFloat(bodyFat) : null,
        skeletal_muscle: skeletalMuscle ? parseFloat(skeletalMuscle) : null,
        wingspan: wingspan ? parseFloat(wingspan) : null,
        inbody_file: inbodyFileUrl || "",
        survey_responses: surveyResponses,
        is_free: false
      }
    };

    try {
      const res = await fetch("/api/payment/toss/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.detail || "결제 준비 실패");
      }
    } catch (e) {
      console.error(e);
      alert("결제 준비 중 오류가 발생했습니다: " + e.message);
      throw e;
    }
  }

  // 페이팔 결제 성공 콜백
  async function handlePayPalSuccess(details) {
    setPaymentStatus("processing");
    const surveyResponses = parentQuestions.map(q => {
      const idx = pAns[q.id] !== undefined ? pAns[q.id] : 2;
      const score = q.dir === -1 ? (4 - idx) : idx;
      return score + 1;
    });

    const payload = {
      name: childName,
      gender: gender,
      birth_date: birth,
      birth_time: birthTime || "시간 모름",
      grade: grade,
      sports: sports,
      position: position || "",
      phone: phone,
      father_height: parseFloat(fatherHeight) || 173.0,
      mother_height: parseFloat(motherHeight) || 160.0,
      current_height: parseFloat(heightVal) || 160.0,
      current_weight: parseFloat(weightVal) || 50.0,
      body_fat: bodyFat ? parseFloat(bodyFat) : null,
      skeletal_muscle: skeletalMuscle ? parseFloat(skeletalMuscle) : null,
      wingspan: wingspan ? parseFloat(wingspan) : null,
      inbody_file: inbodyFileUrl || "",
      survey_responses: surveyResponses,
      is_free: false
    };

    try {
      const res = await fetch("/api/online/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.status === 200) {
        setPaymentStatus("success");
      } else {
        throw new Error(data.detail || "신청서 등록 실패");
      }
    } catch (e) {
      console.error(e);
      setPaymentStatus("error");
      setPaymentError(e.message);
    }
  }

  async function handlePromoApply() {
    setPaymentStatus("processing");
    setPaymentError("");
    const surveyResponses = parentQuestions.map(q => {
      const idx = pAns[q.id] !== undefined ? pAns[q.id] : 2;
      const score = q.dir === -1 ? (4 - idx) : idx;
      return score + 1;
    });

    const payload = {
      name: childName,
      gender: gender,
      birth_date: birth,
      birth_time: birthTime || "시간 모름",
      grade: grade,
      sports: sports,
      position: position || "",
      phone: phone,
      father_height: parseFloat(fatherHeight) || 173.0,
      mother_height: parseFloat(motherHeight) || 160.0,
      current_height: parseFloat(heightVal) || 160.0,
      current_weight: parseFloat(weightVal) || 50.0,
      body_fat: bodyFat ? parseFloat(bodyFat) : null,
      skeletal_muscle: skeletalMuscle ? parseFloat(skeletalMuscle) : null,
      wingspan: wingspan ? parseFloat(wingspan) : null,
      inbody_file: inbodyFileUrl || "",
      survey_responses: surveyResponses,
      is_free: false
    };

    try {
      const res = await fetch("/api/online/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.status === 200) {
        setPaymentStatus("success");
      } else {
        throw new Error(data.detail || "신청서 등록 실패");
      }
    } catch (e) {
      console.error(e);
      setPaymentStatus("error");
      setPaymentError(e.message);
    }
  }

  const handleInbodyUpload = async (file) => {
    if (!file) return;
    setOcrLoading(true);
    setPaymentError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData
      });
      if (res.status === 200) {
        const data = await res.json();
        setInbodyFileUrl(data.file_url || "");
        if (data.muscle) setSkeletalMuscle(data.muscle.toString());
        if (data.fat) setBodyFat(data.fat.toString());
        alert("🎉 인바디 이미지 분석 완료! 골격근량과 체지방률이 자동 입력되었습니다.");
      } else {
        const errData = await res.json();
        throw new Error(errData.detail || "인바디 이미지 분석 실패");
      }
    } catch (e) {
      console.error("OCR failed:", e);
      alert("이미지 분석 실패: " + e.message + "\n직접 입력해 주시면 감사하겠습니다.");
    } finally {
      setOcrLoading(false);
    }
  };

  // 입력값 변경시 자동 저장
  const updateName=v=>{setChildName(v);try{localStorage.setItem("pu333_name",v);}catch{}};
  const updateBirth=v=>{setBirth(v);try{localStorage.setItem("pu333_birth",v);}catch{}};
  const updateHeight=v=>{setHeightVal(v);try{localStorage.setItem("pu333_height",v);}catch{}};
  const updateWeight=v=>{setWeightVal(v);try{localStorage.setItem("pu333_weight",v);}catch{}};
  const updateGender=v=>{setGender(v);try{localStorage.setItem("pu333_gender",v);}catch{}};
  const updateBirthTime=v=>{setBirthTime(v);try{localStorage.setItem("pu333_birth_time",v);}catch{}};
  const updatePhone=v=>{
    const formatted = formatPhoneNumber(v);
    setPhone(formatted);
    try{localStorage.setItem("pu333_phone",formatted);}catch{}
  };

  async function saveFreeSurvey(ans) {
    const surveyResponses = parentQuestions.map(q => {
      const idx = ans[q.id] !== undefined ? ans[q.id] : 2;
      const score = q.dir === -1 ? (4 - idx) : idx;
      return score + 1;
    });

    const payload = {
      name: childName || "무료진단자",
      gender: gender || "남",
      birth_date: birth || "000101",
      birth_time: birthTime || "시간 모름",
      grade: grade || "초등 4~6학년",
      sports: sports || "기타",
      position: position || "",
      phone: phone || "010-0000-0000",
      father_height: parseFloat(fatherHeight) || 173.0,
      mother_height: parseFloat(motherHeight) || 160.0,
      current_height: parseFloat(heightVal) || 0.0,
      current_weight: parseFloat(weightVal) || 0.0,
      body_fat: bodyFat ? parseFloat(bodyFat) : null,
      skeletal_muscle: skeletalMuscle ? parseFloat(skeletalMuscle) : null,
      wingspan: wingspan ? parseFloat(wingspan) : null,
      survey_responses: surveyResponses,
      is_free: true
    };

    try {
      await fetch("/api/online/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("무료 진단 저장 실패:", e);
    }
  }

  async function fetchServerAnalysis(ans) {
    const surveyResponses = parentQuestions.map(q => {
      const idx = ans[q.id] !== undefined ? ans[q.id] : 2;
      const score = q.dir === -1 ? (4 - idx) : idx;
      return score + 1;
    });

    const payload = {
      name: childName || "무료진단자",
      gender: gender || "남",
      birth_date: birth || "2012-01-01",
      birth_time: birthTime || "시간 모름",
      grade: grade || "초등 4~6학년",
      sports: sports || "기타",
      position: position || "",
      phone: phone || "010-0000-0000",
      father_height: parseFloat(fatherHeight) || 173.0,
      mother_height: parseFloat(motherHeight) || 160.0,
      current_height: parseFloat(heightVal) || 0.0,
      current_weight: parseFloat(weightVal) || 0.0,
      body_fat: bodyFat ? parseFloat(bodyFat) : null,
      skeletal_muscle: skeletalMuscle ? parseFloat(skeletalMuscle) : null,
      wingspan: wingspan ? parseFloat(wingspan) : null,
      survey_responses: surveyResponses,
      is_free: true
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.status === 200) {
        setServerResult(data);
      }
    } catch (e) {
      console.error("Server analysis fetch failed:", e);
    }
  }

  const pQ=parentQuestions[pIdx];
  const kQ=kidQuestions[kIdx];

  function handleParent(i){
    setSelP(i);
    setTimeout(()=>{
      const n={...pAns,[pQ.id]:i};
      setPAns(n);setSelP(null);
      try {
        localStorage.setItem("pu333_pans", JSON.stringify(n));
      } catch (e) {}
      if(pIdx<parentQuestions.length-1){
        setPIdx(pIdx+1);
      } else {
        const res=analyze(n,{});
        setResult(res);setStep("result");
        callAI(n,{},res,setAiAdvice,setLoading);
        saveFreeSurvey(n);
        fetchServerAnalysis(n);
      }
    },250);
  }

  function skipKid(){
    const res=analyze(pAns,{});
    setResult(res);setStep("result");
    callAI(pAns,{},res,setAiAdvice,setLoading);
    saveFreeSurvey(pAns);
    fetchServerAnalysis(pAns);
  }

  function goResult(){
    const res=analyze({},{});
    setResult(res);setStep("result");
    setAiAdvice(res.main==='소비형'?'흡수력이 낮은 소비형 체질입니다. 유산균·소화효소로 장 환경을 먼저 복구하고 근력 운동 비율을 높이세요.':res.main==='저장형'?'에너지 축적이 빠른 저장형 체질입니다. 유산소 운동 주 5회 이상, 탄수화물 타이밍을 운동 후로 집중하세요.':'3축이 균형 잡힌 체질입니다. 중강도 저항 운동을 꾸준히 하며 잔근육 밀도를 높이세요.');
    saveFreeSurvey({});
    fetchServerAnalysis({});
  }

  function reset(){
    setStep("intro");setPIdx(0);setKIdx(0);
    // Keep pAns to preserve previous answers!
    setKAns({});setResult(null);setServerResult(null);setAiAdvice("");
    setSaved(false);setCopied(false);setDownloading(false);setShowAll(false);
    // 이름·생년월일·키·몸무게는 유지 (다음에도 쓸 수 있게)
  }

  const handleStartTest = () => {
    if (!childName.trim()) {
      alert("아이 이름을 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("연락처(전화번호)를 입력해 주세요.");
      return;
    }
    if (birth.length !== 6 || !calcAgeFromShort(birth)) {
      alert("올바른 생년월일 6자리를 입력해 주세요.");
      return;
    }
    if (!birthTime) {
      alert("태어난 시를 선택하거나 [태어난 시 모름]을 체크해 주세요.");
      return;
    }
    if (!heightVal.trim() || parseFloat(heightVal) <= 0) {
      alert("아이 키를 입력해 주세요.");
      return;
    }
    if (!weightVal.trim() || parseFloat(weightVal) <= 0) {
      alert("아이 몸무게를 입력해 주세요.");
      return;
    }
    
    // 만약 이미 24개 문항이 모두 다 차 있다면 바로 결과로 이동
    if (Object.keys(pAns).length === parentQuestions.length) {
      handleQuickResult();
    } else {
      setStep("partA");
    }
  };

  const handleQuickResult = () => {
    if (!childName.trim()) {
      alert("아이 이름을 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("연락처(전화번호)를 입력해 주세요.");
      return;
    }
    if (birth.length !== 6 || !calcAgeFromShort(birth)) {
      alert("올바른 생년월일 6자리를 입력해 주세요.");
      return;
    }
    if (!birthTime) {
      alert("태어난 시를 선택하거나 [태어난 시 모름]을 체크해 주세요.");
      return;
    }
    if (!heightVal.trim() || parseFloat(heightVal) <= 0) {
      alert("아이 키를 입력해 주세요.");
      return;
    }
    if (!weightVal.trim() || parseFloat(weightVal) <= 0) {
      alert("아이 몸무게를 입력해 주세요.");
      return;
    }
    
    // 채워지지 않은 문항은 2(보통)로 채움
    const fullAns = { ...pAns };
    parentQuestions.forEach(q => {
      if (fullAns[q.id] === undefined) {
        fullAns[q.id] = 2; // 보통
      }
    });
    
    setPAns(fullAns);
    try {
      localStorage.setItem("pu333_pans", JSON.stringify(fullAns));
    } catch(e) {}
    
    const res = analyze(fullAns, {});
    setResult(res);
    setStep("result");
    callAI(fullAns, {}, res, setAiAdvice, setLoading);
    saveFreeSurvey(fullAns);
    fetchServerAnalysis(fullAns);
  };

  const handleGoResult = () => {
    if (!childName.trim()) {
      alert("아이 이름을 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("연락처(전화번호)를 입력해 주세요.");
      return;
    }
    if (birth.length !== 6 || !calcAgeFromShort(birth)) {
      alert("올바른 생년월일 6자리를 입력해 주세요.");
      return;
    }
    if (!birthTime) {
      alert("태어난 시를 선택하거나 [태어난 시 모름]을 체크해 주세요.");
      return;
    }
    if (!heightVal.trim() || parseFloat(heightVal) <= 0) {
      alert("아이 키를 입력해 주세요.");
      return;
    }
    if (!weightVal.trim() || parseFloat(weightVal) <= 0) {
      alert("아이 몸무게를 입력해 주세요.");
      return;
    }
    goResult();
  };

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
            title:`[피지컬업 333] ${childName || '우리 아이'} 선수의 BioCode 결과는 [${result.code}]`,
            description:`체질 유형: ${ment.nick}\n"타고난 잠재력을 깨우는 1년 성장 솔루션!"`,
            imageUrl:"https://physicalup333.vercel.app/static/human_diesel_engine_hero_1782604389084.png",
            imageWidth:800,
            imageHeight:400,
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
      <div class="ax-l" style="color:#4fcfa0">선천 (유전)</div>
      <div class="ax-d" style="color:#4fcfa0">${bar(result.scores.store)}</div>
      <div class="ax-n" style="color:#4fcfa0">${result.scores.store}/3</div>
    </div>
    <div class="ax" style="background:rgba(247,149,79,0.12)">
      <div class="ax-l" style="color:#f7954f">대사 (흡수)</div>
      <div class="ax-d" style="color:#f7954f">${bar(result.scores.absorb)}</div>
      <div class="ax-n" style="color:#f7954f">${result.scores.absorb}/3</div>
    </div>
    <div class="ax" style="background:rgba(247,111,142,0.12)">
      <div class="ax-l" style="color:#f76f8e">생활 (환경)</div>
      <div class="ax-d" style="color:#f76f8e">${bar(result.scores.burn)}</div>
      <div class="ax-n" style="color:#f76f8e">${result.scores.burn}/3</div>
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
  a.download="피지컬업333_${result.sub}_${result.main}.html";
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
    a.download=`피지컬업333_${result.main}_${ment.nick}.html`;
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
          <a href="/landing.html#about" style={{color:MUTED,fontSize:11,padding:"5px 8px",borderRadius:6,textDecoration:"none"}}>ABOUT</a>
          <a href="/shop.html" style={{color:MUTED,fontSize:11,padding:"5px 8px",borderRadius:6,textDecoration:"none"}}>SHOP</a>
          <a href="/app" style={{color:GOLD,fontSize:11,padding:"5px 10px",borderRadius:6,textDecoration:"none",border:`1px solid ${GOLD}`,fontWeight:700}}>무료 성장 진단</a>
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
          <div style={{display:"inline-block",padding:"10px 42px",borderRadius:24,background:"rgba(201,168,76,0.08)",border:"1.5px solid rgba(201,168,76,0.5)",boxShadow:"0 4px 24px rgba(201,168,76,0.15)"}}>
            <div style={{color:GOLD,fontSize:13,fontWeight:700,letterSpacing:4,marginBottom:2}}>Physical UP 333</div>
            <div style={{background:"linear-gradient(135deg,#c9a84c,#e8c76a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:30,fontWeight:900,letterSpacing:2}}>무료 성장 진단</div>
          </div>
        </div>
        <h1 style={{color:WHITE,fontSize:21,fontWeight:800,lineHeight:1.5,marginBottom:8}}>우리 아이 무료 성장 진단</h1>
        <p style={{color:MUTED,fontSize:13,lineHeight:2,marginBottom:20}}>선천(유전) · 대사(흡수) · 생활(환경)<br/>3축 점수로 성장 발달을 측정합니다</p>

        {/* 📏 아이 정보 입력 */}
        <div style={{background:"rgba(201,168,76,0.05)",borderRadius:14,padding:"16px",marginBottom:16,border:"1px solid rgba(201,168,76,0.18)"}}>
          <div style={{color:GOLD,fontSize:12,fontWeight:900,marginBottom:4,letterSpacing:1,textAlign:"left"}}>📏 우리 아이 신체 & 기질 분석 입력</div>
          <div style={{color:MUTED,fontSize:10.5,marginBottom:14,textAlign:"left",lineHeight:1.4}}>무료 성장 지표 분석 및 타고난 기질 분석을 위해 아래 정보를 입력해 주세요. (자동저장 지원)</div>
          
          {/* 이름 / 성별 */}
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:8,marginBottom:8}}>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${childName?"rgba(201,168,76,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>이름</div>
              <input type="text" value={childName} onChange={e=>updateName(e.target.value)} placeholder="홍길동"
                style={{width:"100%",background:"transparent",border:"none",color:childName?GOLD2:WHITE,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${gender?"rgba(201,168,76,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"9px 8px",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>성별</div>
              <div style={{display:"flex",justifyContent:"center",gap:8}}>
                {["남", "여"].map(g => (
                  <button key={g} onClick={() => updateGender(g)} style={{
                    padding:"2px 14px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",
                    background:gender===g ? GOLD : "rgba(255,255,255,0.03)",
                    color:gender===g ? NAVY : WHITE,
                    border:gender===g ? `1px solid ${GOLD}` : "1px solid rgba(255,255,255,0.15)",
                    outline:"none",transition:"all 0.2s"
                  }}>{g}</button>
                ))}
              </div>
            </div>
          </div>

          {/* 생년월일 / 태어난 시 */}
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:8,marginBottom:8}}>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${birth.length===6?"rgba(201,168,76,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>생년월일 <span style={{fontSize:8}}>(YYMMDD)</span></div>
              <input type="text" value={birth} onChange={e=>updateBirth(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="190523" maxLength={6}
                style={{width:"100%",background:"transparent",border:"none",color:birth.length===6?GOLD2:WHITE,fontSize:13,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box",letterSpacing:0.5}}/>
              {birth.length===6&&(()=> {
                const age=calcAgeFromShort(birth);
                return age?<div style={{color:GOLD,fontSize:8,marginTop:3}}>✓ {age.display}</div>:<div style={{color:"#f76f8e",fontSize:8,marginTop:3}}>날짜 오류</div>;
              })()}
            </div>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${birthTime && birthTime !== "시간 모름"?"rgba(201,168,76,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:4}}>태어난 시</div>
              <select value={birthTime === "시간 모름" ? "" : birthTime} onChange={e=>updateBirthTime(e.target.value)} disabled={birthTime === "시간 모름"} style={{
                width:"100%",background:"transparent",border:"none",color:birthTime && birthTime !== "시간 모름" ? GOLD2 : WHITE,fontSize:11,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box",textAlignLast:"center",cursor:birthTime === "시간 모름" ? "not-allowed" : "pointer"
              }}>
                <option value="" disabled style={{background:"#0d1b3e",color:MUTED}}>선택</option>
                {["23:30 ~ 01:30","01:30 ~ 03:30","03:30 ~ 05:30","05:30 ~ 07:30","07:30 ~ 09:30","09:30 ~ 11:30","11:30 ~ 13:30","13:30 ~ 15:30","15:30 ~ 17:30","17:30 ~ 19:30","19:30 ~ 21:30","21:30 ~ 23:30"].map(op=>(
                  <option key={op} value={op} style={{background:"#0d1b3e",color:WHITE}}>{op}</option>
                ))}
              </select>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginTop:6}}>
                <input type="checkbox" id="birthTimeUnknown" checked={birthTime === "시간 모름"}
                  onChange={e => {
                    if(e.target.checked) {
                      updateBirthTime("시간 모름");
                    } else {
                      updateBirthTime("");
                    }
                  }}
                  style={{cursor:"pointer",accentColor:GOLD}}/>
                <label htmlFor="birthTimeUnknown" style={{color:MUTED,fontSize:10,cursor:"pointer",userSelect:"none"}}>태어난 시 모름</label>
              </div>
            </div>
          </div>

          {/* 키 / 몸무게 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${heightVal?"rgba(201,168,76,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>키 (cm)</div>
              <input type="number" value={heightVal} onChange={e=>updateHeight(e.target.value)} placeholder="145"
                style={{width:"100%",background:"transparent",border:"none",color:heightVal?GOLD2:WHITE,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${weightVal?"rgba(201,168,76,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>몸무게 (kg)</div>
              <input type="number" value={weightVal} onChange={e=>updateWeight(e.target.value)} placeholder="38"
                style={{width:"100%",background:"transparent",border:"none",color:weightVal?GOLD2:WHITE,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
          </div>

          {/* 연락처 */}
          <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${phone?"rgba(201,168,76,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
            <div style={{color:MUTED,fontSize:10,marginBottom:6}}>연락처 (전화번호)</div>
            <input type="tel" value={phone} onChange={e=>updatePhone(e.target.value)} placeholder="010-1234-5678"
              style={{width:"100%",background:"transparent",border:"none",color:phone?GOLD2:WHITE,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
          </div>
        </div>

        <div style={{marginBottom:10}}>
          <button onClick={handleStartTest} style={{width:"100%",padding:"16px",borderRadius:12,background:"linear-gradient(135deg,#c9a84c,#e8c76a)",color:NAVY,fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(201,168,76,0.3)",lineHeight:1.5}}>
            무료 성장 진단 시작하기<br/><span style={{fontSize:11,fontWeight:600,opacity:0.7}}>24문항 · 약 3~5분 · 무료</span>
          </button>
          {Object.keys(pAns).length > 0 && (
            <button onClick={handleQuickResult} style={{width:"100%",marginTop:10,padding:"14px",borderRadius:12,background:"rgba(201,168,76,0.1)",color:GOLD2,fontSize:13,fontWeight:800,border:"1.5px solid rgba(201,168,76,0.4)",cursor:"pointer",lineHeight:1.5}}>
              🔄 임시 저장된 답변({Object.keys(pAns).length}개)으로 결과 바로보기
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );

  // ── PART A (24문항) ─────────────────────────────────────────────────────────
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
          <div style={{display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:5}}>
            {["전혀","가끔","보통","자주","항상"].map((label,i)=>(
              <button key={i} onClick={()=>handleParent(i)} style={{padding:"16px 2px",borderRadius:10,textAlign:"center",background:selP===i?"rgba(201,168,76,0.25)":pAns[pQ.id]===i?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.03)",border:selP===i?"1.5px solid rgba(201,168,76,0.9)":pAns[pQ.id]===i?"1.5px solid rgba(201,168,76,0.4)":"1.5px solid rgba(255,255,255,0.07)",color:pAns[pQ.id]===i?GOLD3:"#9ab8cc",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s",transform:selP===i?"scale(0.95)":"scale(1)"}}>
                {label}
              </button>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:18}}>
            {pIdx>0 ? (
              <button onClick={()=>setPIdx(pIdx-1)} style={{background:"none",border:"none",color:MUTED,fontSize:13,cursor:"pointer"}}>← 이전</button>
            ) : (
              <div/>
            )}
            <button onClick={handleQuickResult} style={{
              background:"rgba(201,168,76,0.08)",
              border:"1.5px solid rgba(201,168,76,0.35)",
              borderRadius:8,
              padding:"8px 14px",
              color:GOLD2,
              fontSize:11.5,
              fontWeight:800,
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              gap:4
            }}>
              결과 바로보기 ➔
            </button>
          </div>
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
    const axes=[{label:"선천 (유전)",val:result.scores.store,color:"#4fcfa0"},{label:"대사 (흡수)",val:result.scores.absorb,color:"#f7954f"},{label:"생활 (환경)",val:result.scores.burn,color:"#f76f8e"}];
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
            <div style={{color:MUTED,fontSize:13,marginTop:4}}>의 무료 성장 진단 결과입니다 ⚾</div>
          </div>

          {/* 코드 메인 카드 (잠금 노출) */}
          <div style={{textAlign:"center",padding:"24px 20px",background:"linear-gradient(160deg,#0d1b3e,#0f2050)",border:`1px solid rgba(201,168,76,0.35)`,borderRadius:20,marginBottom:12,boxShadow:"0 8px 40px rgba(201,168,76,0.15)",position:"relative",overflow:"hidden"}}>
            {/* 검사 날짜 */}
            <div style={{color:MUTED,fontSize:11,marginBottom:14,letterSpacing:1}}>
              📅 검사일 {new Date().toLocaleDateString("ko-KR")}
            </div>
            <div style={{marginTop:8,textAlign:"left"}}>
              <div style={{color:GOLD2,fontSize:11,fontWeight:700,marginBottom:4}}>🧬 타고난 유전/체질 특성</div>
              <div style={{color:WHITE,fontSize:13,lineHeight:1.5,marginBottom:10}}>{ment.wit}</div>
              <div style={{color:GOLD2,fontSize:11,fontWeight:700,marginBottom:4}}>💡 현재 상태 특이사항</div>
              <div style={{color:WHITE,fontSize:13,lineHeight:1.5}}>{ment.tip}</div>
            </div>
          </div>

          {/* 성장 지표 */}
          {gd&&(
            <div style={{...cardStyle,border:"1px solid rgba(201,168,76,0.3)",boxShadow:"0 4px 20px rgba(201,168,76,0.1)"}}>
              <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>📏 성장 지표 분석</div>
              <div style={{color:MUTED,fontSize:11,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:10}}>{ageDisplay} · BMI {gd.bmi}</div>

              <div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:16}}>
                {[
                  {label:"키",value:parseFloat(heightVal),unit:"cm",avg:gd.stdH,mine:parseFloat(heightVal),target:gd.targetH,color:"#4fcfa0",isSlug:false},
                  {label:"몸무게",value:parseFloat(weightVal),unit:"kg",avg:gd.stdW,mine:parseFloat(weightVal),target:gd.targetW90,color:"#4f8ef7",isSlug:false}
                ].map(ax=>{
                  const vals=[ax.avg,ax.mine,ax.target];
                  const minV=Math.min(...vals)*0.95;
                  const maxV=Math.max(...vals)*1.05;
                  const range = maxV - minV || 1;
                  const toPos=v=>Math.round(15 + ((v-minV)/range)*70);
                  const avgPos=toPos(ax.avg);
                  const minePos=toPos(ax.mine);
                  const targetPos=toPos(ax.target);
                  const reached=ax.isSlug?ax.mine<=ax.target:ax.mine>=ax.target;

                  return (
                    <div key={ax.label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(255,255,255,0.015)",borderRadius:14,padding:"12px 6px",border:"1px solid rgba(255,255,255,0.04)"}}>
                      {/* 타이틀 및 비교 문구 */}
                      <div style={{width:"100%",textAlign:"center",marginBottom:14,borderBottom:"1px solid rgba(255,255,255,0.04)",paddingBottom:8}}>
                        <div style={{color:WHITE,fontSize:13,fontWeight:900,marginBottom:3}}>{ax.label}</div>
                        <div style={{fontSize:10,fontWeight:800}}>
                          {reached
                            ? <span style={{color:"#4fcfa0"}}>
                                {ax.label === "몸무게" && result.main === "저장형" ? "✓ 적정 체중" : "🏆 목표 충족!"}
                              </span>
                            : <span style={{color:GOLD}}>
                                {ax.label === "키" 
                                  ? `대비 -${Math.abs(ax.target-ax.mine).toFixed(1)}${ax.unit}` 
                                  : (result.main === "저장형" 
                                      ? `초과 +${Math.abs(ax.target-ax.mine).toFixed(1)}${ax.unit}` 
                                      : `대비 -${Math.abs(ax.target-ax.mine).toFixed(1)}${ax.unit}`)}
                              </span>
                          }
                        </div>
                      </div>

                      {/* 세로 그래프 트랙 */}
                      <div style={{position:"relative",width:"100%",height:200,marginBottom:4}}>
                        {/* 세로 중심선 */}
                        <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:4,background:"rgba(255,255,255,0.08)",transform:"translateX(-50%)",borderRadius:2}}/>

                        {/* 1. 자기나이 평균 (좌측 배치) */}
                        <div style={{
                          position:"absolute",bottom:`${avgPos}%`,right:"calc(50% + 8px)",
                          transform:"translateY(50%)",textAlign:"right",whiteSpace:"nowrap"
                        }}>
                          <div style={{color:MUTED,fontSize:8,fontWeight:700,lineHeight:1}}>평균</div>
                          <div style={{color:MUTED,fontSize:10,fontWeight:600,marginTop:2}}>{ax.avg}{ax.unit}</div>
                        </div>
                        {/* 평균 눈금 */}
                        <div style={{
                          position:"absolute",bottom:`${avgPos}%`,left:"50%",
                          transform:"translate(-50%, 50%)",width:8,height:2,
                          background:"rgba(255,255,255,0.4)",zIndex:6
                        }}/>

                        {/* 2. 권장 목표 (좌측 배치) */}
                        <div style={{
                          position:"absolute",bottom:`${targetPos}%`,right:"calc(50% + 8px)",
                          transform:"translateY(50%)",textAlign:"right",whiteSpace:"nowrap"
                        }}>
                          <div style={{
                            color:GOLD,fontSize:8,fontWeight:900,lineHeight:1
                          }}>
                            {ax.label === "키" 
                              ? "목표" 
                              : (result.main === "저장형" 
                                  ? "권장" 
                                  : (result.main === "소비형" 
                                      ? "목표" 
                                      : "목표"))}
                          </div>
                          <div style={{color:GOLD,fontSize:10,fontWeight:700,marginTop:2}}>{ax.target}{ax.unit}</div>
                        </div>
                        {/* 목표 눈금 */}
                        <div style={{
                          position:"absolute",bottom:`${targetPos}%`,left:"50%",
                          transform:"translate(-50%, 50%)",width:10,height:2,
                          background:GOLD,zIndex:6
                        }}/>

                        {/* 3. 내 아이 (우측 배치 및 강조 배지) */}
                        <div style={{
                          position:"absolute",bottom:`${minePos}%`,left:"calc(50% + 8px)",
                          transform:"translateY(50%)",textAlign:"left",whiteSpace:"nowrap",
                          background:"rgba(255,255,255,0.06)",border:`1px solid ${ax.color}`,
                          borderRadius:6,padding:"2px 6px",boxShadow:`0 0 8px rgba(255,255,255,0.05)`
                        }}>
                          <div style={{color:ax.color,fontSize:8,fontWeight:900,lineHeight:1}}>내 아이</div>
                          <div style={{color:WHITE,fontSize:11,fontWeight:800,marginTop:2}}>{ax.mine}{ax.unit}</div>
                        </div>
                        {/* 내 아이 큰 점 */}
                        <div style={{
                          position:"absolute",bottom:`${minePos}%`,left:"50%",
                          transform:"translate(-50%, 50%)",width:10,height:10,
                          borderRadius:"50%",background:ax.color,border:"2px solid #0d1b3e",
                          boxShadow:`0 0 8px ${ax.color}`,zIndex:9
                        }}/>
                      </div>

                      {/* 성인 피지컬 목표 수치 */}
                      <div style={{
                        width:"100%",marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.06)",
                        display:"flex",flexDirection:"column",gap:4,textAlign:"left"
                      }}>
                        <div style={{color:GOLD2,fontSize:10,fontWeight:800,marginBottom:3,textAlign:"center"}}>⚾ 성인 피지컬 목표</div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:WHITE}}>
                          <span style={{color:MUTED}}>대학 선수:</span>
                          <span style={{fontWeight:700}}>{ax.label === "키" ? "180cm" : "82kg"}</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:WHITE}}>
                          <span style={{color:WHITE}}>KBO 프로:</span>
                          <span style={{color:GOLD2,fontWeight:700}}>{ax.label === "키" ? "183cm" : "87kg"}</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:WHITE}}>
                          <span style={{color:GOLD}}>MLB 메이저:</span>
                          <span style={{color:GOLD,fontWeight:700}}>{ax.label === "키" ? "190cm" : "95kg"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 종합 성장 지표 진단 소견 */}
              <div style={{
                marginTop:16,padding:"12px 14px",background:"rgba(255,255,255,0.02)",
                borderRadius:12,border:"1px solid rgba(255,255,255,0.04)",textAlign:"left"
              }}>
                <div style={{color:GOLD2,fontSize:11,fontWeight:700,marginBottom:8}}>📋 종합 성장 지표 진단 소견</div>
                
                <div style={{display:"flex",flexDirection:"column",gap:10,fontSize:13,lineHeight:1.6,color:WHITE}}>
                  {/* 키 상태 */}
                  <div>
                    <span style={{color:GOLD,fontWeight:700}}>• 신장 분포: </span>
                    {gd.hPct >= 90 ? 
                      `또래 백분위 상위 10% 이내(최상위권)에 속합니다. 골격 성장 발달 속도가 매우 우수하며 타고난 신장 잠재력을 잘 발현하고 있습니다.` : 
                     gd.hPct >= 75 ? 
                      `또래 백분위 상위 25% 이내(상위권)에 속합니다. 또래 평균보다 우수한 성장 궤적을 보이고 있으며, 안정적인 골격 발달이 이루어지고 있습니다.` : 
                     gd.hPct >= 25 ? 
                      `또래 백분위 중간 범위(상위 25% ~ 75%)에 속하여 지극히 표준적인 성장 속도로 자라고 있습니다. 성장판 자극 운동과 균형 잡힌 영양 공급을 통해 잠재력을 더욱 끌어올려 줄 필요가 있습니다.` : 
                      `또래 백분위 하위 25% 범위에 머물러 있어 성장이 다소 정체된 흐름을 보입니다. 성장판 혈류를 자극하는 전신 운동 및 필수 미네랄 영양의 체내 흡수율 개선이 추천되는 시점입니다.`
                    }
                    <div style={{color:MUTED,fontSize:11,marginTop:2}}>
                      (또래 평균 대비 키는 {parseFloat(gd.diffH) >= 0 ? `+${gd.diffH}` : gd.diffH}cm 차이)
                    </div>
                  </div>

                  {/* 몸무게 및 체성분 상태 */}
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:8}}>
                    <span style={{color:GOLD,fontWeight:700}}>• 체질량 및 체성분: </span>
                    {parseFloat(gd.bmi) < 18.5 ? 
                      `BMI 수치(${gd.bmi}) 기준 저체중 성향을 보입니다. 에너지 소비 대비 위장관 영양소 흡수와 단백질 합성력이 부족할 수 있으므로, 칼로리 밀도가 높은 양질의 단백질 식단과 보충 간식이 권장됩니다.` : 
                     parseFloat(gd.bmi) < 23.0 ? 
                      `BMI 수치(${gd.bmi}) 기준 아주 이상적인 표준 체형 및 체중 균형을 유지하고 있습니다. 근육량 증강 트레이닝과 양질의 아미노산 섭취로 질적인 피지컬 벌크업에 집중하기 좋은 상태입니다.` : 
                     parseFloat(gd.bmi) < 25.0 ? 
                      `BMI 수치(${gd.bmi}) 기준 과체중 경향이 보입니다. 체내 에너지가 근육 증강보다 지방 세포로 고착화되는 속도가 빠르므로, 정제 탄수화물(당류, 탄산)을 제어하고 대사 회전 속도를 높이는 유산소 활동량을 늘려야 합니다.` : 
                      `BMI 수치(${gd.bmi}) 기준 비만(체중 과다) 범위에 해당합니다. 뼈 관절에 가해지는 물리적 로드가 늘어 성장판 스트레스를 유발하고 성조숙증 위험도를 높일 수 있으므로, 규칙적인 유산소 운동과 정밀한 식이 제한이 필수적입니다.`
                    }
                    <div style={{color:MUTED,fontSize:11,marginTop:2}}>
                      (또래 평균 대비 몸무게는 {parseFloat(gd.diffW) >= 0 ? `+${gd.diffW}` : gd.diffW}kg 차이)
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 타고난 체질 분석 카드 (신체, 장기, 성격 3축 종합) */}
          <div style={cardStyle}>
            <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>🧬 타고난 신체 기질 분석</div>
            <div style={{color:MUTED,fontSize:11,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:8}}>
              {birth ? `${birth.slice(0,2)}년 ${birth.slice(2,4)}월 ${birth.slice(4,6)}일` : ""} {birthTime} 출생 사주 및 설문 3축 종합
            </div>
            
            <div style={{display:"flex",flexDirection:"column",gap:16,textAlign:"left"}}>
              {/* 1. 신체 기질 */}
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:14}}>🦴</span>
                  <span style={{color:GOLD2,fontSize:12,fontWeight:700}}>신체 기질 (체격 및 근육)</span>
                </div>
                <div style={{color:WHITE,fontSize:13,lineHeight:1.6.toString()}}>
                  {result.scores.store === 3 ? 
                    "선천적인 뼈의 두께와 관절 프레임 자체가 묵직하고 견고하게 타고났습니다. 지면 반발력을 활용한 힘 대결, 투척력, 그리고 상대 선수와의 충격을 견디고 버텨내는 대단한 힘과 파워를 지니고 있어 체격 조건에서 큰 강점을 지닙니다." : 
                   result.scores.store === 2 ? 
                    "골격과 체중의 밸런스가 매우 이상적인 표준형 신체 구조를 자랑합니다. 기초 근육량과 관절의 회전 가동력이 균형을 이루고 있어 어떤 운동 종목이나 기술 훈련도 무리 없이 자연스럽게 습득하고 조율해낼 수 있는 든든한 피지컬 토대를 지닙니다." : 
                    "골격 프레임이 또래에 비해 가볍고 날렵하게 타고났습니다. 몸이 가벼워 순발력과 첫 보폭의 대단한 민첩성이 강점이며, 아질리티(Agility)나 방향 전환 운동 시 관절에 무리가 덜 가므로 역동적인 스피드 플레이에 아주 유리한 피지컬 구조입니다."
                  }
                </div>
              </div>

              {/* 2. 장기 대사 */}
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:14}}>🥗</span>
                  <span style={{color:GOLD2,fontSize:12,fontWeight:700}}>장기 대사 (영양 및 소화)</span>
                </div>
                <div style={{color:WHITE,fontSize:13,lineHeight:1.6.toString()}}>
                  {result.scores.absorb === 3 ? 
                    "체내로 들어온 모든 음식물의 단백질과 유기물을 세포로 매우 빠르게 흡수하고 합성해내는 능력이 뛰어납니다. 뼈와 근육의 부피를 단시간에 성장시키는 힘이 강하나, 운동량이 부족하면 지방으로 가기 쉬우므로 꾸준한 관리가 필요합니다." : 
                   result.scores.absorb === 2 ? 
                    "소화 효소 분비가 풍부하고 영양분을 뼈와 장기 세포로 분배하는 기초 대사 균형이 매우 안정적입니다. 일상적인 고른 식단 관리만으로도 운동 후 소모된 장기 내 수분과 에너지원을 신속하게 원복할 수 있는 건전한 내부 환경을 갖췄습니다." : 
                    "위장관의 흡수 면적이 조심스럽고 다소 예민한 소화 환경을 타고났습니다. 한 번에 폭식하기보다는 고단백 고에너지 밀도 식단을 자주 나누어 공급하여 장에 부담을 줄이고 소화 흡수 효소의 낭비를 방지하는 세심한 케어가 필요합니다."
                  }
                </div>
              </div>

              {/* 3. 성격 및 활동성 */}
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:14}}>⚡</span>
                  <span style={{color:GOLD2,fontSize:12,fontWeight:700}}>성격 및 활동성 (에너지 발산)</span>
                </div>
                <div style={{color:WHITE,fontSize:13,lineHeight:1.6.toString()}}>
                  {result.scores.burn === 3 ? 
                    "세포 대사 회전율이 대단히 빠르며 몸 안에 가만히 에너지를 가둬두지 않고 폭발적으로 소모하려는 강력한 활동성을 지닙니다. 지치지 않는 근지구력과 빠른 주력이 돋보이지만 수분과 전해질의 체외 배출량이 크므로 수시로 수분을 보충해주어야 피로 회복이 원활합니다." : 
                   result.scores.burn === 2 ? 
                    "신체 대사 회전이 경쾌하고 움직임에 대한 적극적인 기질을 타고났습니다. 에너지 발산 속도와 피로 물질(젖산) 분해 속도가 균형 있게 작동하여, 연속된 고강도 훈련 중에도 일정한 운동 효율을 탄탄하고 지속력 있게 뽑아낼 수 있습니다." : 
                    "불필요한 에너지를 낭비하지 않는 차분하고 집중력 높은 침착한 기질을 보입니다. 섣불리 덤비지 않고 상황을 지략적으로 살피는 능력이 우수하나, 활발한 신체 발산을 위해 훈련 전 충분한 웜업(Warm-up)으로 체온을 올리는 습관이 필요합니다."
                  }
                </div>
              </div>
            </div>
            
            <div style={{color:MUTED,fontSize:10,marginTop:12,lineHeight:1.4,textAlign:"left",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:8}}>
              ※ 타고난 성별, 생년월일시 사주 오행 분포와 24가지 3축 라이프 설문 응답을 교차 분석하여 성의껏 도출한 무료 종합 기질 분석 결과입니다.
            </div>
          </div>

          {/* 사주 오행 건강 및 장기 대사 분석 카드 */}
          {serverResult && serverResult.five_elements && (() => {
            const oheng = getOhengAnalysis(serverResult.five_elements);
            if (!oheng) return null;
            
            // Build descriptions
            let stateTexts = [];
            let solutionTexts = [];
            
            // Deficient element logic
            if (oheng.deficient.length > 0) {
              oheng.deficient.forEach(el => {
                if (el.key === "목") {
                  stateTexts.push("근육과 인대(木) 기운의 결핍으로 관절 및 힘줄의 긴장도가 높고 피로 물질(젖산) 분해 속도가 지연되기 쉽습니다.");
                  solutionTexts.push("운동 시작 전 15분 이상 충분한 정적 스트레칭을 실시하여 건과 인대의 긴장을 풀고, 비타민 C와 아미노산 공급을 통해 근육 회복력을 올려주어야 합니다.");
                }
                if (el.key === "화") {
                  stateTexts.push("심폐 및 혈류 순환(火) 기운이 약해 심폐 가동 능력이 일시적으로 지연되거나 전신 열 배출 대사가 완만할 수 있습니다.");
                  solutionTexts.push("초기부터 숨이 차는 격렬한 운동보다 가벼운 페이스의 조깅부터 점진적으로 심폐 지구력을 늘려 혈류 순환 효율을 점진적으로 개선시켜야 합니다.");
                }
                if (el.key === "토") {
                  stateTexts.push("소화 장기(土) 기운이 약하여 소화 효소 분비가 부진하고 음식물을 세포 조직(살·근육)으로 합성하는 힘이 더딥니다.");
                  solutionTexts.push("단백질 파우더나 소화 효소 유산균제를 식사와 병행하고, 위장에 부담을 주지 않도록 고에너지 밀도의 음식을 조금씩 자주(하루 4~5회) 섭취하는 대책이 필요합니다.");
                }
                if (el.key === "금") {
                  stateTexts.push("뼈 골격 및 호흡 대장계(金) 기운이 약하여 뼈의 무기질 축적 속도가 다소 더디거나 장 환경이 민감해지기 쉽습니다.");
                  solutionTexts.push("성장판을 수직으로 자극하는 줄넘기, 가벼운 플라이오메트릭 점프 운동을 적극 권장하며 칼슘 및 비타민 D3를 아침 식후 필수 공급해야 합니다.");
                }
                if (el.key === "수") {
                  stateTexts.push("신장 및 성장호르몬(水) 기운의 부족으로 관절 내 윤활막 작동이 부드럽지 못하거나 밤 시간대 성장호르몬 분비가 깊지 않을 수 있습니다.");
                  solutionTexts.push("무엇보다 밤 10시 이전 깊은 수면(숙면)을 유도하는 수면 환경을 조성하고, 관절과 뼈의 기질을 이루는 콜라겐 단백질과 충분한 수분 전해질 공급이 필수적입니다.");
                }
              });
            }
            
            // Excessive element logic
            if (oheng.excess.length > 0) {
              oheng.excess.forEach(el => {
                if (el.key === "목") {
                  stateTexts.push("근육계(木) 기운이 너무 왕성하여 근수축 속도는 빠르지만, 근육이 쉽게 뭉쳐 유연성이 저하되고 쥐가 자주 날 수 있습니다.");
                  solutionTexts.push("근육 피로를 즉각 풀어줄 수 있도록 폼롤러 마사지와 온열 요법을 자주 실시하고, 근육 완화를 돕는 마그네슘을 필수 섭취해야 합니다.");
                }
                if (el.key === "화") {
                  stateTexts.push("순환계 및 심폐 체열(火) 기운이 대단히 강하여 땀 분비량이 매우 많고 탈수 속도가 빨라 조기 피로를 겪기 쉽습니다.");
                  solutionTexts.push("급격한 수분 및 필수 전해질 소실을 막기 위해 훈련 중 15분마다 150ml씩 미네랄 워터나 이온 음료를 규칙적으로 급수하는 것이 최고의 대책입니다.");
                }
                if (el.key === "토") {
                  stateTexts.push("소화 및 체내 영양 합성력(土)이 과도하게 강하여 섭취된 탄수화물이 단시간에 체지방으로 갇히고 몸이 무거워지기 쉽습니다.");
                  solutionTexts.push("정제 탄수화물(당류, 액상과당, 빵)을 차단하고 식이섬유 섭취 비중을 2배로 올려 혈당 스파이크와 내장지방 축적을 제어해야 합니다.");
                }
                if (el.key === "금") {
                  stateTexts.push("골격 프레임(金)의 기운이 너무 묵직하고 단단하여 지면 반발력은 우수하지만, 관절와 상하체의 가동 범위가 다소 뻣뻣하게 굳어지기 쉽습니다.");
                  solutionTexts.push("몸의 회전 회전력을 극대화할 수 있는 요가, 모빌리티(Mobility) 훈련, 그리고 흉추 가동성 스트레칭을 훈련 루틴에 반드시 포함시켜야 합니다.");
                }
                if (el.key === "수") {
                  stateTexts.push("골수 및 수분 대사(水) 기운이 과다하여 체내 수분 정체가 일어나거나 몸이 다소 붓는 현상이 발생하기 쉽습니다.");
                  solutionTexts.push("나트륨 섭취를 적절히 조절하고, 전신 땀 배출을 돕는 심폐 유산소 운동을 지속하여 체액의 역동적인 순환을 도와야 합니다.");
                }
              });
            }
            
            // Balanced saju
            if (stateTexts.length === 0) {
              stateTexts.push("목, 화, 토, 금, 수 오행 기운이 치우침 없이 대단히 균형 잡혀 있어, 선천적인 장기 취약점이나 대사 교란 현상이 없는 대단히 조화롭고 건강한 내부 환경을 타고났습니다.");
              solutionTexts.push("현재의 이상적인 대사 균형이 깨지지 않도록 불규칙한 생활과 정제 야식을 제한하고, 3대 필수 영양소와 기본 비타민D를 공급하는 표준 성장 케어를 유지하시면 충분합니다.");
            }
            
            return (
              <div style={cardStyle}>
                <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>🔮 선천 사주 오행(五行) 건강 & 장기 대사 분석</div>
                <div style={{color:MUTED,fontSize:11,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:8}}>
                  타고난 5가지 자연 기운(오행)과 신체 오장육부(五臟六腑) 건강 대응 분석
                </div>
                
                {/* 오행 그래프 */}
                <div style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  background:"rgba(255,255,255,0.02)",borderRadius:12,padding:"12px 10px",
                  border:"1px solid rgba(255,255,255,0.04)",marginBottom:16
                }}>
                  {oheng.elements.map(el => {
                    const count = serverResult.five_elements[el.key] || 0;
                    return (
                      <div key={el.key} style={{flex:1,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <div style={{color:count >= 3 ? "#f76f8e" : count === 0 ? "#64748b" : WHITE,fontSize:11,fontWeight:800}}>
                          {el.key}
                        </div>
                        <div style={{color:MUTED,fontSize:9,marginTop:2,marginBottom:4}}>{el.key === "목" ? "木" : el.key === "화" ? "火" : el.key === "토" ? "土" : el.key === "금" ? "金" : "水"}</div>
                        <div style={{
                          display:"flex",flexDirection:"column",gap:2,width:8,height:40,
                          background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden",
                          justifyContent:"flex-end"
                        }}>
                          <div style={{
                            height:`${(count / 5) * 100}%`,
                            background: count >= 3 ? "linear-gradient(to top, #ef4444, #f76f8e)" : count === 0 ? "transparent" : "linear-gradient(to top, #3b82f6, #60a5fa)",
                            borderRadius:2
                          }}/>
                        </div>
                        <div style={{color:count >= 3 ? "#f76f8e" : count === 0 ? "#64748b" : GOLD2,fontSize:11,fontWeight:900,marginTop:4}}>
                          {count}개
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 분석 텍스트 */}
                <div style={{textAlign:"left",display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <div style={{color:GOLD2,fontSize:11,fontWeight:700,marginBottom:4}}>⚠️ 선천적 신체 장기 상태 (취약점)</div>
                    <ul style={{margin:0,paddingLeft:16,color:WHITE,fontSize:13,lineHeight:1.6}}>
                      {stateTexts.map((txt, idx) => (
                        <li key={idx} style={{marginBottom:6}}>{txt}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:10}}>
                    <div style={{color:GOLD2,fontSize:11,fontWeight:700,marginBottom:4}}>🛠️ 대사 불균형 개선 대책 (조언)</div>
                    <ul style={{margin:0,paddingLeft:16,color:"#a5b4fc",fontSize:13,lineHeight:1.6}}>
                      {solutionTexts.map((txt, idx) => (
                        <li key={idx} style={{marginBottom:6}}>{txt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div style={{color:MUTED,fontSize:10,marginTop:12,lineHeight:1.4,textAlign:"left",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:8}}>
                  ※ 동양 의학의 사상 체질론과 명리학의 오행상생상극(五行相生相剋) 이론을 응용하여 오장육부의 기운 분포를 도출한 자율 참고용 신체 경향성 분석입니다.
                </div>
              </div>
            );
          })()}

          {/* 솔루션 (완전 공개) */}
          <div style={cardStyle}>
            <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>{mi.goal}</div>
            <div style={{color:MUTED,fontSize:12,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:12}}>{mi.direction}</div>
            
            <div>
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
                  {mi.exercise.ratio.map(r=><div key={r.name} style={{width:`${r.pct}%`,background:r.color,display:"flex",alignItems:"center",justifyContent:"center",minWidth:r.pct>0?2:0,color:NAVY,fontSize:9,fontWeight:900}}>{r.name} ({r.pct}%)</div>)}
                </div>
              </div>
            </div>
          </div>



          {/* 실전 행동 처방 (완전 공개) */}
          {ment.rx&&(
          <div style={{
            borderRadius:14,padding:"16px",marginBottom:12,
            background:"linear-gradient(135deg,rgba(201,168,76,0.04),rgba(13,27,62,0.4))",
            border:"1.5px solid rgba(255,255,255,0.06)",
            position:"relative",overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`}}/>
            <div style={{color:GOLD,fontSize:11,fontWeight:800,letterSpacing:1,marginBottom:8}}>
              ⚡ 지금 당장 실천할 것
            </div>
            <div>
              <p style={{color:WHITE,fontSize:13,lineHeight:1.6,margin:0}}>{ment.rx}</p>
            </div>
          </div>
          )}

          {/* 축적력 3점 특별 코멘트 (완전 공개) */}
          {result.scores.store===3&&(
            <div style={{
              borderRadius:14,padding:"16px",marginBottom:12,
              background:"linear-gradient(135deg,rgba(247,111,142,0.04),rgba(13,27,62,0.4))",
              border:"1.5px solid rgba(255,255,255,0.06)",
              position:"relative",overflow:"hidden"
            }}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#f76f8e,transparent)"}}/>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{fontSize:24,flexShrink:0}}>🏃</div>
                <div>
                  <div style={{color:"#f76f8e",fontSize:12,fontWeight:800,marginBottom:6,letterSpacing:0.5}}>
                    축적력 3점 · 체중 관리 포인트
                  </div>
                  <div style={{color:WHITE,fontSize:13,lineHeight:1.6}}>
                    선천 축적력이 3점(높음)인 아이는 에너지를 근육과 지방으로 저장하는 힘이 강합니다. 운동량이 적어지면 순식간에 체지방이 불어 스피드와 순발력이 저하될 수 있으므로, 고강도 인터벌 운동과 함께 당류/탄수화물 과다 섭취를 상시 통제해야 합니다.
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



          {/* 버튼 */}
          <div style={{marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {/* 카톡 공유 */}
              <button onClick={async()=>{
                const shortWit=ment.wit.length>20?ment.wit.slice(0,20)+'..':ment.wit;
                const shortTip=ment.tip.length>20?ment.tip.slice(0,20)+'..':ment.tip;
                const txt=`🧬 Physical UP 333 · 333TEST\n\n유형: ${result.main} ${ment.emoji} ${ment.nick}\n\n"${shortWit}"\n💡${shortTip}\n\n▶ 무료 성장 & 기질 분석\npu333.kr`;
                try{
                  if(navigator.share){
                    await navigator.share({title:'333TEST 분석 결과',text:txt,url:'https://pu333.kr'});
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

          {/* 1:1 프리미엄 성장 분석 보고서 신청 폼 */}
          <div style={{
            padding:"20px 16px",borderRadius:16,marginBottom:15,
            background:"linear-gradient(135deg,rgba(13,27,62,0.85),rgba(4,7,17,0.95))",
            border:"1px solid rgba(201,168,76,0.35)",
            position:"relative",overflow:"hidden",
            boxShadow:"0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})`}}/>
            
            {paymentStatus === "success" ? (
              <div style={{textAlign:"center",padding:"20px 10px"}}>
                <div style={{fontSize:40,marginBottom:12}}>🏆</div>
                <div style={{color:GOLD2,fontSize:18,fontWeight:900,marginBottom:10}}>분석 신청 완료!</div>
                <div style={{color:WHITE,fontSize:13,lineHeight:1.7}}>
                  신청이 정상 완료되었습니다.<br/>
                  24시간 이내에 기입하신 연락처(카카오 알림톡)로 정밀 분석 보고서가 전송됩니다.
                </div>
              </div>
            ) : paymentStatus === "processing" ? (
              <div style={{textAlign:"center",padding:"40px 10px"}}>
                <div style={{color:GOLD2,fontSize:15,fontWeight:800,marginBottom:10}}>{IS_PROMO_ACTIVE ? "신청서 접수 및 처리 중..." : "결제 승인 및 처리 중..."}</div>
                <div style={{color:MUTED,fontSize:12}}>잠시만 기다려 주세요.</div>
              </div>
            ) : (
              <>
                <div style={{color:GOLD2,fontSize:15,fontWeight:900,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                  <span>🏆 1:1 프리미엄 분석 보고서 신청</span>
                </div>
                
                <div style={{color:MUTED,fontSize:11.5,lineHeight:1.6,marginBottom:18,textAlign:"left"}}>
                  기본 분석만으로도 훌륭하지만, <span style={{color:WHITE,fontWeight:800}}>더 깊은 비밀이 궁금하시거나 앞으로의 정밀한 성장 로드맵 및 미래 성장 가능성</span>을 마스터하고 싶다면 신청하세요.
                  <ul style={{margin:"6px 0 0 16px",padding:0,color:"#8aa8c8"}}>
                    <li style={{marginBottom:3}}>나만의 3자리 <strong>정밀 BioCode 및 캐릭터 유형 해제</strong></li>
                    <li style={{marginBottom:3}}>부모 키 유전 확률을 반영한 <strong>성인 예측 키 & 윙스팬 분석</strong></li>
                    <li style={{marginBottom:3}}>체내 수분/단백질/골격근/체지방 <strong>인바디 정밀 비교군 분석</strong></li>
                    <li style={{marginBottom:3}}>종목·포지션 매칭 적합도 진단 및 <strong>연간 성장 로드맵 제공</strong></li>
                    <li style={{marginBottom:3}}>모바일/PC로 보관 가능한 <strong>13페이지 프리미엄 PDF 보고서 발송</strong></li>
                  </ul>
                </div>
              
                {/* 입력 폼 필드들 */}
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
                  {/* 운동 종목 및 포지션 */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div>
                      <div style={{color:MUTED,fontSize:10,marginBottom:4}}>운동 종목 (필수)</div>
                      <input type="text" value={sports} onChange={e => setSports(e.target.value)} placeholder="예: 축구, 수영" style={{
                        width:"100%",padding:"8px 10px",borderRadius:8,background:"#040711",color:WHITE,border:"1px solid rgba(255,255,255,0.12)",fontSize:12,fontWeight:700,outline:"none",boxSizing:"border-box"
                      }}/>
                    </div>
                    <div>
                      <div style={{color:MUTED,fontSize:10,marginBottom:4}}>포지션 (선택)</div>
                      <input type="text" value={position} onChange={e => setPosition(e.target.value)} placeholder="예: 공격수, 피처" style={{
                        width:"100%",padding:"8px 10px",borderRadius:8,background:"#040711",color:WHITE,border:"1px solid rgba(255,255,255,0.12)",fontSize:12,fontWeight:700,outline:"none",boxSizing:"border-box"
                      }}/>
                    </div>
                  </div>

                  {/* 부모 키 */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div>
                      <div style={{color:MUTED,fontSize:10,marginBottom:4}}>아버지 키 (cm) (필수)</div>
                      <input type="number" value={fatherHeight} onChange={e => setFatherHeight(e.target.value)} style={{
                        width:"100%",padding:"8px 10px",borderRadius:8,background:"#040711",color:WHITE,border:"1px solid rgba(255,255,255,0.12)",fontSize:12,fontWeight:700,outline:"none",boxSizing:"border-box"
                      }}/>
                    </div>
                    <div>
                      <div style={{color:MUTED,fontSize:10,marginBottom:4}}>어머니 키 (cm) (필수)</div>
                      <input type="number" value={motherHeight} onChange={e => setMotherHeight(e.target.value)} style={{
                        width:"100%",padding:"8px 10px",borderRadius:8,background:"#040711",color:WHITE,border:"1px solid rgba(255,255,255,0.12)",fontSize:12,fontWeight:700,outline:"none",boxSizing:"border-box"
                      }}/>
                    </div>
                  </div>

                  {/* 인바디 실측치 입력 */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                    <div>
                      <div style={{color:MUTED,fontSize:9,marginBottom:4}}>골격근량 (kg) (필수)</div>
                      <input type="number" value={skeletalMuscle} onChange={e => setSkeletalMuscle(e.target.value)} placeholder="실측치" style={{
                        width:"100%",padding:"8px 8px",borderRadius:8,background:"#040711",color:WHITE,border:"1px solid rgba(255,255,255,0.12)",fontSize:11,fontWeight:700,outline:"none",boxSizing:"border-box"
                      }}/>
                    </div>
                    <div>
                      <div style={{color:MUTED,fontSize:9,marginBottom:4}}>체지방률 (%) (필수)</div>
                      <input type="number" value={bodyFat} onChange={e => setBodyFat(e.target.value)} placeholder="실측치" style={{
                        width:"100%",padding:"8px 8px",borderRadius:8,background:"#040711",color:WHITE,border:"1px solid rgba(255,255,255,0.12)",fontSize:11,fontWeight:700,outline:"none",boxSizing:"border-box"
                      }}/>
                    </div>
                    <div>
                      <div style={{color:MUTED,fontSize:9,marginBottom:4}}>양팔길이 (cm) (필수)</div>
                      <input type="number" value={wingspan} onChange={e => setWingspan(e.target.value)} placeholder="실측치" style={{
                        width:"100%",padding:"8px 8px",borderRadius:8,background:"#040711",color:WHITE,border:"1px solid rgba(255,255,255,0.12)",fontSize:11,fontWeight:700,outline:"none",boxSizing:"border-box"
                      }}/>
                    </div>
                  </div>

                  {/* 인바디 이미지 업로드 / 카메라 촬영 */}
                  <div style={{background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(201,168,76,0.3)",borderRadius:8,padding:"10px",textAlign:"center"}}>
                    <div style={{color:GOLD,fontSize:10,fontWeight:700,marginBottom:6}}>📸 인바디 용지 사진 촬영 또는 스캔 파일 첨부 (선택)</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                      <label style={{
                        display:"inline-block",padding:"6px 14px",borderRadius:6,background:"rgba(201,168,76,0.12)",border:`1px solid ${GOLD}`,
                        color:GOLD2,fontSize:11,fontWeight:700,cursor:ocrLoading?"not-allowed":"pointer"
                      }}>
                        {ocrLoading ? "분석 중..." : "파일 선택 / 촬영"}
                        <input type="file" accept="image/*,application/pdf" capture="environment" onChange={e => handleInbodyUpload(e.target.files[0])} disabled={ocrLoading} style={{display:"none"}}/>
                      </label>
                      {inbodyFileUrl && (
                        <span style={{color:"#4fcfa0",fontSize:10,fontWeight:700}}>✓ 첨부 완료</span>
                      )}
                    </div>
                    <div style={{color:MUTED,fontSize:9,marginTop:6,lineHeight:1.4}}>
                      ※ 사진을 등록하시면 골격근량과 지방률이 자동 판독되어 채워집니다.<br/>
                      판독에 실패할 경우 직접 텍스트로 수치를 보정해 주실 수 있습니다.
                    </div>
                  </div>
                </div>

                {/* 결제 수단 선택 */}
                {!IS_PROMO_ACTIVE && (
                  <div style={{display:"flex",gap:8,marginBottom:15}}>
                    <button onClick={() => setPaymentMethod("toss")} style={{
                      flex:1,padding:"10px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",
                      background:paymentMethod==="toss" ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.02)",
                      color:paymentMethod==="toss" ? GOLD2 : MUTED,
                      border:paymentMethod==="toss" ? `1px solid ${GOLD}` : "1px solid rgba(255,255,255,0.08)"
                    }}>🇰🇷 토스페이먼츠</button>
                    <button onClick={() => setPaymentMethod("paypal")} style={{
                      flex:1,padding:"10px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",
                      background:paymentMethod==="paypal" ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.02)",
                      color:paymentMethod==="paypal" ? GOLD2 : MUTED,
                      border:paymentMethod==="paypal" ? `1px solid ${GOLD}` : "1px solid rgba(255,255,255,0.08)"
                    }}>🌐 PayPal (해외)</button>
                  </div>
                )}

                {/* 에러 발생 시 노출 */}
                {paymentError && (
                  <div style={{color:"#f76f8e",fontSize:11,marginBottom:10,textAlign:"center"}}>{paymentError}</div>
                )}

                {/* 결제 실행 버튼 */}
                {!sports || !wingspan || !fatherHeight || !motherHeight || ((!skeletalMuscle || !bodyFat) && !inbodyFileUrl) ? (
                  <div style={{
                    padding:"14px",borderRadius:12,background:"#334155",color:"#94a3b8",fontSize:13,fontWeight:700,textAlign:"center"
                  }}>⚠️ 모든 성장 정보(종목, 부모 키, 양팔길이 및 인바디 실측치 또는 사진 파일)를 입력해 주세요.</div>
                ) : IS_PROMO_ACTIVE ? (
                  <button onClick={handlePromoApply} style={{
                    width:"100%",padding:"15px",borderRadius:12,background:`linear-gradient(135deg, ${GOLD}, ${GOLD2})`,color:WHITE,fontSize:14,fontWeight:900,border:"none",cursor:"pointer",boxShadow:"0 4px 15px rgba(201,168,76,0.3)",textAlign:"center"
                  }}>✨ 1:1 프리미엄 분석 보고서 무료 신청하기</button>
                ) : paymentMethod === "toss" ? (
                  <TossCheckoutButton
                    product={TOSS_PRODUCTS[0]}
                    customerEmail={undefined}
                    customerName={childName}
                    method="카드"
                    onPrepare={prepareTossPayment}
                    onError={(err) => setPaymentError(err?.message || "토스 결제 실패")}
                    className="cta-pay-btn"
                  />
                ) : (
                  <PayPalCheckoutButton
                    product={PAYPAL_PRODUCTS[0]}
                    onSuccess={handlePayPalSuccess}
                    onError={(err) => setPaymentError(err || "PayPal 결제 실패")}
                    onCancel={() => console.log('PayPal cancel')}
                  />
                )}
              </>
            )}
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
