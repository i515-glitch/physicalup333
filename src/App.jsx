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
    setStep("partA");
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
          <a href="/landing.html#about" style={{color:MUTED,fontSize:11,padding:"5px 8px",borderRadius:6,textDecoration:"none"}}>ABOUT</a>
          <a href="/landing.html#science" style={{color:MUTED,fontSize:11,padding:"5px 8px",borderRadius:6,textDecoration:"none"}}>LAB</a>
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
        <p style={{color:MUTED,fontSize:13,lineHeight:2,marginBottom:20}}>선천(유전) · 대사(흡수) · 생활(환경)<br/>3축 점수로 BIO CODE를 측정합니다</p>

        {/* 신체 정보 입력 */}
        <div style={{background:"rgba(201,168,76,0.05)",borderRadius:14,padding:"14px",marginBottom:16,border:"1px solid rgba(201,168,76,0.15)"}}>
          <div style={{color:GOLD,fontSize:11,fontWeight:700,marginBottom:4,letterSpacing:1}}>📏 아이 정보 입력 (선택 · 자동저장)</div>
          <div style={{color:MUTED,fontSize:10,marginBottom:12,opacity:0.8}}>※ 만 18세 이하 유소년 선수 대상 서비스입니다</div>
          {/* Row 1: 이름, 연락처 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${childName?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>이름</div>
              <input type="text" value={childName} onChange={e=>updateName(e.target.value)} placeholder="홍길동"
                style={{width:"100%",background:"transparent",border:"none",color:childName?GOLD2:MUTED,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${phone?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>연락처 (전화번호)</div>
              <input type="tel" value={phone} onChange={e=>updatePhone(e.target.value.replace(/[^0-9-]/g,""))} placeholder="010-1234-5678"
                style={{width:"100%",background:"transparent",border:"none",color:phone?GOLD2:MUTED,fontSize:13,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
          </div>

          {/* Row 2: 생년월일, 태어난 시 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${birth.length===6?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:6}}>생년월일 <span style={{fontSize:9}}>(YYMMDD)</span></div>
              <input type="text" value={birth} onChange={e=>updateBirth(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="190523" maxLength={6}
                style={{width:"100%",background:"transparent",border:"none",color:birth.length===6?GOLD2:MUTED,fontSize:14,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box",letterSpacing:2}}/>
              {birth.length===6&&(()=>{
                const age=calcAgeFromShort(birth);
                return age?<div style={{color:GOLD,fontSize:9,marginTop:3}}>✓ {age.display}</div>:<div style={{color:"#f76f8e",fontSize:9,marginTop:3}}>날짜 확인</div>;
              })()}
            </div>
            <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${birthTime && birthTime !== "시간 모름"?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"10px 8px",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{color:MUTED,fontSize:10,marginBottom:4}}>태어난 시</div>
              <select value={birthTime === "시간 모름" ? "" : birthTime} onChange={e=>updateBirthTime(e.target.value)} disabled={birthTime === "시간 모름"} style={{
                width:"100%",background:"transparent",border:"none",color:birthTime && birthTime !== "시간 모름" ? GOLD2 : MUTED,fontSize:12,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box",textAlignLast:"center",cursor:birthTime === "시간 모름" ? "not-allowed" : "pointer"
              }}>
                <option value="" disabled style={{background:"#0d1b3e",color:MUTED}}>태어난 시 선택</option>
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

          {/* Row 3: 키, 몸무게 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
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

          {/* Row 4: 성별 */}
          <div style={{background:"rgba(13,27,62,0.6)",border:`1px solid ${gender?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)"}`,borderRadius:10,padding:"9px 8px",textAlign:"center"}}>
            <div style={{color:MUTED,fontSize:10,marginBottom:6}}>성별</div>
            <div style={{display:"flex",justifyContent:"center",gap:20}}>
              {["남", "여"].map(g => (
                <button key={g} onClick={() => updateGender(g)} style={{
                  padding:"4px 24px",borderRadius:6,fontSize:12,fontWeight:700,cursor:"pointer",
                  background:gender===g ? GOLD : "rgba(255,255,255,0.03)",
                  color:gender===g ? NAVY : WHITE,
                  border:gender===g ? `1px solid ${GOLD}` : "1px solid rgba(255,255,255,0.15)",
                  outline:"none",transition:"all 0.2s"
                }}>{g}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{marginBottom:10}}>
          <button onClick={handleStartTest} style={{width:"100%",padding:"16px",borderRadius:12,background:"linear-gradient(135deg,#c9a84c,#e8c76a)",color:NAVY,fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(201,168,76,0.3)",lineHeight:1.5}}>
            333TEST 시작하기<br/><span style={{fontSize:11,fontWeight:600,opacity:0.7}}>24문항 · 약 3~5분 · 무료</span>
          </button>
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
            <div style={{color:MUTED,fontSize:13,marginTop:4}}>의 BIO CODE 분석 결과입니다 ⚾</div>
          </div>

          {/* 코드 메인 카드 (결과 해제 노출) */}
          <div style={{textAlign:"center",padding:"24px 20px",background:"linear-gradient(160deg,#0d1b3e,#0f2050)",border:`1px solid rgba(201,168,76,0.35)`,borderRadius:20,marginBottom:12,boxShadow:"0 8px 40px rgba(201,168,76,0.15)",position:"relative",overflow:"hidden"}}>
            {/* 검사 날짜 */}
            <div style={{color:MUTED,fontSize:11,marginBottom:14,letterSpacing:1}}>
              📅 검사일 {new Date().toLocaleDateString("ko-KR")}
            </div>
            {/* 결과 한 줄 노출 */}
            <div style={{
              display:"inline-flex",
              alignItems:"center",
              justifyContent:"center",
              padding:"12px 24px",
              borderRadius:24,
              background:"rgba(201,168,76,0.06)",
              border:"1.5px solid rgba(201,168,76,0.35)",
              boxShadow:"0 4px 20px rgba(0,0,0,0.25)",
              color:GOLD2,
              fontSize:15,
              fontWeight:900,
              gap:8
            }}>
              <span>BioCode {result.code}</span>
              <span style={{color:"rgba(255,255,255,0.15)"}}>ㅣ</span>
              <span>{result.main}</span>
              <span style={{color:"rgba(255,255,255,0.15)"}}>ㅣ</span>
              <span>{ment.nick}</span>
            </div>
            <p style={{color:MUTED,fontSize:11,lineHeight:1.6,marginTop:12,marginBottom:0}}>
              ※ 상세 맞춤 운동/식단 가이드라인은 프리미엄 보고서에서 제공됩니다.
            </p>
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

          {/* 타고난 체질 분석 카드 */}
          <div style={cardStyle}>
            <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>🧬 타고난 신체 기질 분석 (만세력 기준)</div>
            <div style={{color:MUTED,fontSize:11,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:10}}>
              {birth ? `${birth.slice(0,2)}년 ${birth.slice(2,4)}월 ${birth.slice(4,6)}일` : ""} {birthTime} 출생
            </div>
            
            {serverResult ? (
              <div>
                <div style={{marginBottom:14}}>
                  <span style={{color:MUTED,fontSize:11,display:"block",marginBottom:4}}>체질 경향성</span>
                  <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"10px 12px"}}>
                    <span style={{color:WHITE,fontSize:13,fontWeight:800}}>{serverResult.constitution}</span>
                  </div>
                </div>
                <div>
                  <span style={{color:MUTED,fontSize:11,display:"block",marginBottom:6}}>타고난 오행(五行) 분포</span>
                  <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
                    {Object.entries(serverResult.five_elements).map(([name, count]) => {
                      const colors = { "목": "#4fcfa0", "화": "#f76f8e", "토": "#f7d24f", "금": "#e5e5e5", "수": "#4f8ef7" };
                      return (
                        <div key={name} style={{flex:1,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 4px",textAlign:"center"}}>
                          <div style={{color:colors[name],fontSize:12,fontWeight:800,marginBottom:4}}>{name}</div>
                          <div style={{color:WHITE,fontSize:14,fontWeight:900}}>{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{color:MUTED,fontSize:12,textAlign:"center",padding:"16px 0"}}>
                기질 분석 데이터를 불러오는 중...
              </div>
            )}
          </div>

          {/* 3축 게이지 (잠금 처리) */}
          <div style={{...cardStyle,position:"relative",overflow:"hidden"}}>
            <div style={{color:GOLD,fontSize:11,marginBottom:14,fontWeight:700,letterSpacing:1,borderBottom:"1px solid rgba(201,168,76,0.15)",paddingBottom:10}}>⚾ 3축 BIO CODE 분석</div>
            <div style={{filter:"blur(4px)",opacity:0.6,userSelect:"none"}}>
              {axes.map(ax=>(
                <div key={ax.label} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{color:WHITE,fontSize:12,fontWeight:600}}>{ax.label}</span>
                    <span style={{color:ax.color,fontSize:12,fontWeight:700}}>{ax.val} · {["낮음","보통","높음"][ax.val-1]}</span>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    {[1,2,3].map(n=><div key={n} style={{flex:1,height:10,borderRadius:4,background:n<=ax.val?ax.color:"rgba(255,255,255,0.06)",boxShadow:n<=ax.val?`0 0 6px ${ax.color}60`:"none"}}/>)}
                  </div>
                </div>
              ))}
            </div>
            {/* 자물쇠 오버레이 */}
            <div style={{position:"absolute",inset:0,top:40,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(13,27,62,0.4)"}}>
              <span style={{fontSize:20,marginBottom:6}}>🔒</span>
              <span style={{color:GOLD2,fontSize:12,fontWeight:800}}>선천 · 대사 · 생활 3축 상세 레벨 잠김</span>
              <span style={{color:MUTED,fontSize:10,marginTop:2}}>프리미엄 보고서에서 분석 수치가 공개됩니다</span>
            </div>
          </div>

          {/* 솔루션 (잠금 처리) */}
          <div style={{...cardStyle,position:"relative",overflow:"hidden"}}>
            <div style={{color:GOLD,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>{mi.goal}</div>
            <div style={{color:MUTED,fontSize:12,marginBottom:14,borderBottom:"1px solid rgba(201,168,76,0.1)",paddingBottom:12}}>{mi.direction}</div>
            
            <div style={{filter:"blur(5px)",opacity:0.35,userSelect:"none",pointerEvents:"none"}}>
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
                  {mi.exercise.ratio.map(r=><div key={r.name} style={{width:`${r.pct}%`,background:r.color,display:"flex",alignItems:"center",justifyContent:"center",minWidth:r.pct>0?2:0}}/>)}
                </div>
              </div>
            </div>
            
            {/* 자물쇠 오버레이 */}
            <div style={{position:"absolute",inset:0,top:50,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(13,27,62,0.5)",padding:"20px"}}>
              <div style={{background:"rgba(13,27,62,0.9)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:16,padding:"20px 16px",textAlign:"center",maxWidth:300}}>
                <span style={{fontSize:24,display:"block",marginBottom:8}}>🔒</span>
                <div style={{color:GOLD2,fontSize:14,fontWeight:800,marginBottom:6}}>{result.main} 유형 정밀 가이드 잠김</div>
                <p style={{color:MUTED,fontSize:11,lineHeight:1.6,margin:0,whiteSpace:"pre-line"}}>우리 아이의 유형에 딱 맞춘<br/>운동방법, 식단관리, 생활 수칙 및 1년 로드맵은<br/>프리미엄 정식 보고서에서 해제됩니다.</p>
              </div>
            </div>
          </div>

          {/* 세분류 포인트 (잠금 처리) */}
          <div style={{...cardStyle,position:"relative",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,filter:"blur(3px)",opacity:0.5}}>
              <span style={{fontSize:16}}>{si.emoji}</span>
              <span style={{color:si.color,fontSize:12,fontWeight:700}}>정밀 맞춤 포인트</span>
            </div>
            <p style={{color:MUTED,fontSize:13,lineHeight:1.7,margin:0,filter:"blur(3px)",userSelect:"none"}}>아이의 선천적 기질과 유전적 체형을 교차 분석하여 도출되는 1:1 핵심 맞춤 관리법 영역입니다.</p>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(13,27,62,0.4)"}}>
              <span style={{color:GOLD2,fontSize:12,fontWeight:800}}>🔒 맞춤 관리 포인트 잠김</span>
            </div>
          </div>

          {/* 실전 행동 처방 (잠금 처리) */}
          {ment.rx&&(
          <div style={{
            borderRadius:14,padding:"16px",marginBottom:12,
            background:"linear-gradient(135deg,rgba(201,168,76,0.04),rgba(13,27,62,0.4))",
            border:"1.5px solid rgba(255,255,255,0.06)",
            position:"relative",overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`}}/>
            <div style={{color:GOLD,fontSize:11,fontWeight:800,letterSpacing:1,marginBottom:8,filter:"blur(3px)",opacity:0.5}}>
              ⚡ 지금 당장 실천할 것
            </div>
            <p style={{color:MUTED,fontSize:13,lineHeight:1.6,margin:0,filter:"blur(3.5px)",userSelect:"none"}}>보고서 발급 즉시 오늘부터 행동으로 옮겨야 할 첫 번째 훈련 및 영양 미션이 잠겨 있습니다.</p>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(13,27,62,0.4)"}}>
              <span style={{color:GOLD2,fontSize:12,fontWeight:800}}>🔒 오늘 당장 실천할 미션 잠김</span>
            </div>
          </div>
          )}

          {/* 축적력 3점 특별 코멘트 (잠금 처리) */}
          {result.scores.store===3&&(
            <div style={{
              borderRadius:14,padding:"16px",marginBottom:12,
              background:"linear-gradient(135deg,rgba(247,111,142,0.04),rgba(13,27,62,0.4))",
              border:"1.5px solid rgba(255,255,255,0.06)",
              position:"relative",overflow:"hidden"
            }}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#f76f8e,transparent)"}}/>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{fontSize:24,flexShrink:0,filter:"blur(3px)",opacity:0.5}}>🏃</div>
                <div>
                  <div style={{color:"#f76f8e",fontSize:12,fontWeight:800,marginBottom:6,letterSpacing:0.5,filter:"blur(3px)",opacity:0.5}}>
                    축적력 3점 · 체중 관리 포인트
                  </div>
                  <div style={{color:MUTED,fontSize:13,lineHeight:1.6,filter:"blur(3.5px)",userSelect:"none"}}>
                    에너지 저장량이 많은 체질을 위한 체중 및 속도 관리 처방 가이드라인입니다.
                  </div>
                </div>
              </div>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(13,27,62,0.4)"}}>
                <span style={{color:GOLD2,fontSize:12,fontWeight:800}}>🔒 체중 관리 포인트 잠김</span>
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
                
                {IS_PROMO_ACTIVE ? (
                  <div style={{
                    background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:10,padding:"10px 12px",marginBottom:14,textAlign:"center"
                  }}>
                    <div style={{color:GOLD2,fontSize:12,fontWeight:900,marginBottom:4}}>🎁 베타테스트 기념 100% 무료 프로모션 중</div>
                    <div style={{color:WHITE,fontSize:10.5,lineHeight:1.5}}>7월 31일까지 1:1 프리미엄 분석 보고서(정가 29,800원) 신청을 무료로 지원해 드립니다. 아래 성장 스펙을 채워 신청을 완료해 주세요!</div>
                  </div>
                ) : (
                  <div style={{color:MUTED,fontSize:11,lineHeight:1.6,marginBottom:18}}>
                    인바디 분석, 양팔길이 측정치, 부모 유전 키를 적용하여 13페이지 분량의 정식 성장 솔루션 PDF 보고서를 카카오톡으로 자동 발송해 드립니다.
                  </div>
                )}
              
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
