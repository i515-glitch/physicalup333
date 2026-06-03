import { useState } from "react";

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

function CubeChart({code, ment}){
  const canvasRef = React.useRef(null);
  const typeColor = {
    burner:{fill:'rgba(79,207,160,0.15)',stroke:'rgba(79,207,160,0.5)',text:'#4fcfa0'},
    balanced:{fill:'rgba(201,168,76,0.15)',stroke:'rgba(201,168,76,0.5)',text:'#c9a84c'},
    storer:{fill:'rgba(247,111,142,0.15)',stroke:'rgba(247,111,142,0.5)',text:'#f76f8e'},
  };
  const selectedColor = {fill:'rgba(120,160,255,0.4)',stroke:'#78a0ff'};

  React.useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const W=280,H=280;
    const cellSize=50;

    function project(ix,iy,iz){
      const x=(ix-iz)*(cellSize+5)*Math.cos(Math.PI/6)*0.7;
      const y=-(iy)*(cellSize+5)*0.7+(ix+iz)*(cellSize+5)*Math.sin(Math.PI/6)*0.7;
      return {x:W/2+x*0.9, y:H/2+y*0.85+20};
    }

    function drawCell(ix,iy,iz,fill,stroke){
      const cs=cellSize*0.62;
      const p=project(ix,iy,iz);
      const cx=p.x,cy=p.y;
      const hw=cs*Math.cos(Math.PI/6)*0.85;
      const hh=cs*Math.sin(Math.PI/6)*0.85;
      const vc=cs*0.75;
      ctx.beginPath();
      ctx.moveTo(cx,cy-vc);ctx.lineTo(cx+hw,cy-vc+hh);
      ctx.lineTo(cx,cy-vc+hh*2);ctx.lineTo(cx-hw,cy-vc+hh);
      ctx.closePath();ctx.fillStyle=fill;ctx.fill();
      ctx.strokeStyle=stroke;ctx.lineWidth=0.8;ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx-hw,cy-vc+hh);ctx.lineTo(cx,cy-vc+hh*2);
      ctx.lineTo(cx,cy+vc);ctx.lineTo(cx-hw,cy+vc-hh);
      ctx.closePath();ctx.fillStyle=fill.replace(/[\d.]+\)$/,'0.07)');ctx.fill();
      ctx.strokeStyle=stroke;ctx.lineWidth=0.8;ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx+hw,cy-vc+hh);ctx.lineTo(cx,cy-vc+hh*2);
      ctx.lineTo(cx,cy+vc);ctx.lineTo(cx+hw,cy+vc-hh);
      ctx.closePath();ctx.fillStyle=fill.replace(/[\d.]+\)$/,'0.12)');ctx.fill();
      ctx.strokeStyle=stroke;ctx.lineWidth=0.8;ctx.stroke();
    }

    ctx.clearRect(0,0,W,H);
    for(let iz=0;iz<3;iz++){
      for(let ix=0;ix<3;ix++){
        for(let iy=2;iy>=0;iy--){
          const c=`${ix+1}${iy+1}${iz+1}`;
          const d=cubeCodeInfo[c];
          if(!d) continue;
          const tc=typeColor[d.type];
          const isMe=c===code;
          drawCell(ix,iy,iz,isMe?selectedColor.fill:tc.fill,isMe?selectedColor.stroke:tc.stroke);
        }
      }
    }
    ctx.font='10px sans-serif';
    ctx.fillStyle='rgba(200,200,200,0.4)';
    const p0=project(-0.3,1,1.5);ctx.fillText('흡수',p0.x-14,p0.y+4);
    const p1=project(1,2.6,1);ctx.fillText('연소',p1.x-10,p1.y-4);
    const p2=project(1,1,3.2);ctx.fillText('축적',p2.x-4,p2.y+4);
  },[code]);

  const d = cubeCodeInfo[code];
  const tc = d ? typeColor[d.type] : typeColor['balanced'];

  return (
    <div>
      <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
        <canvas ref={canvasRef} width={280} height={280} style={{borderRadius:12,border:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}/>
        {d && (
          <div style={{flex:1,minWidth:140}}>
            <div style={{fontSize:32,fontWeight:900,letterSpacing:6,color:tc.text,marginBottom:2}}>{code}</div>
            <div style={{fontSize:14,fontWeight:700,color:'#f0f4ff',marginBottom:4}}>{ment?.nick||d.nick}</div>
            <div style={{fontSize:11,color:'#4a6080',marginBottom:12}}>{d.type==='burner'?'BURNER':d.type==='balanced'?'BALANCED':'STORER'}</div>
            <div style={{display:'flex',gap:4,marginBottom:12,flexWrap:'wrap'}}>
              {['흡수력','연소력','축적력'].map((n,i)=>(
                <span key={n} style={{padding:'2px 8px',borderRadius:10,fontSize:10,fontWeight:700,background:tc.fill,color:tc.text,border:`0.5px solid ${tc.stroke}`}}>{n} {code[i]}</span>
              ))}
            </div>
            <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:10,marginBottom:10}}>
              <div style={{color:'#4a6080',fontSize:10,marginBottom:4}}>또래 분포</div>
              <div><span style={{fontSize:20,fontWeight:900,color:'#f0f4ff'}}>{d.pct}%</span><span style={{fontSize:11,color:'#4a6080',marginLeft:4}}>이 코드</span></div>
            </div>
            {/* 유료 티저 */}
            <div style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:10,padding:12,marginTop:4}}>
              <div style={{color:'#c9a84c',fontSize:11,fontWeight:700,marginBottom:6}}>🔒 프리미엄 분석</div>
              <div style={{color:'#4a6080',fontSize:11,lineHeight:1.8,marginBottom:8}}>
                · 27칸 큐브 전체 상세 분석<br/>
                · 인접 체질과 퍼포먼스 비교<br/>
                · 맞춤 성장 로드맵 설계<br/>
                · 밀착 데이터 관리
              </div>
              <div style={{color:'#e8c76a',fontSize:10,fontWeight:700}}>피지컬업333 유료 서비스 준비 중</div>
            </div>
          </div>
        )}
      </div>
      <div style={{display:'flex',gap:10,marginTop:12,fontSize:10,color:'#4a6080'}}>
        {[['소비형','#4fcfa0'],['균형형','#c9a84c'],['저장형','#f76f8e'],['내 코드','#78a0ff']].map(([n,c])=>(
          <span key={n} style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{width:8,height:8,borderRadius:2,background:c,display:'inline-block'}}/>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

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
const parentQuestions = [
  {id:"p1",section:"🍽️ 식탁 풍경",text:"\"밥 먹어!\" 불렀을 때 아이가 오는 방식은?",hint:"부르고 나서 밥상까지 오는 그 과정을 떠올려보세요",options:[{text:"\"응!\" 하고 바로 달려와서 숟가락 잡음 🏃",absorb:1,burn:0,store:0},{text:"\"어~ 알았어~\" 하고 5분 뒤에 슬쩍 옴 😐",absorb:0,burn:0,store:0},{text:"세 번은 불러야 겨우 옴. 표정도 별로 😑",absorb:-1,burn:0,store:-1},{text:"부르기도 전에 밥 냄새 맡고 먼저 와 있음 👃",absorb:1,burn:1,store:1}]},
  {id:"p2",section:"🍽️ 식탁 풍경",text:"밥 먹는 도중 아이가 가장 자주 하는 행동은?",hint:"밥상 앞 아이의 단골 패턴, 딱 하나만 골라주세요",options:[{text:"\"잠깐만\" \"좀 이따가\" \"지금 배 안 고픈데\" 시전 후 결국 안 먹음 🙄",absorb:-1,burn:-1,store:-1},{text:"먹다가 갑자기 화장실. 이게 꽤 자주 있음 🚽",absorb:-1,burn:0,store:-1},{text:"다 먹고 나서도 냉장고 문을 습관적으로 열어 둘러봄 🧊",absorb:1,burn:1,store:1},{text:"반찬 보이면 일단 \"이거 누구 꺼야?\" 먼저 찜 👀",absorb:1,burn:0,store:1}]},
  {id:"p3",section:"🍽️ 식탁 풍경",text:"밥상에 처음 보는 음식이 올라왔을 때 아이의 반응은?",hint:"낯선 음식 앞에서 튀어나오는 첫 반응을 보세요",options:[{text:"쳐다도 안 봄. \"이게 뭐야\" 한마디 하고 옆으로 밀어냄 🙅",absorb:-1,burn:0,store:-1},{text:"냄새부터 맡고... 한참 고민하다가 결국 손도 안 댐 👃",absorb:-1,burn:0,store:0},{text:"\"이거 뭐야?\" 묻고 나서 조심스럽게 한 입 시도 😬",absorb:0,burn:0,store:0},{text:"처음 보는 것도 일단 입에 넣고 봄. 맛이 궁금해서 😋",absorb:1,burn:1,store:1}]},
  {id:"p4",section:"🔭 몸 상태 관찰",text:"아침에 깨웠을 때 아이의 첫 마디는?",hint:"오늘 아침, 혹은 평소 아침을 떠올려보세요",options:[{text:"\"5분만...\" — 이걸 최소 세 번은 반복함 🧟",absorb:-1,burn:-1,store:-1},{text:"눈 뜨자마자 \"배고파\" — 주방까지 직행 🏃",absorb:1,burn:1,store:0},{text:"말없이 천천히 일어나서 조용히 준비 시작 😌",absorb:0,burn:0,store:1},{text:"불 켜기도 전에 혼자 일어나 돌아다니고 있음 ⚡",absorb:1,burn:1,store:0}]},
  {id:"p5",section:"🔭 몸 상태 관찰",text:"밥 먹고 나서 아이 배를 슬쩍 건드려보면?",hint:"식사 끝나고 20~30분 후, 살짝 눌러보거나 표정을 보세요",options:[{text:"북처럼 빵빵함. 본인도 \"배 빵빵해\" 하며 두드림 🥁",absorb:-1,burn:-1,store:1},{text:"가끔 \"배 아파\" 하면서 쪼그리고 앉음 😣",absorb:-1,burn:0,store:-1},{text:"언제 먹었냐는 듯 씩씩하게 놀러 나감 👍",absorb:1,burn:1,store:0},{text:"다 먹자마자 또 \"배고프다\" — 냉장고 앞으로 직행 🚶",absorb:1,burn:1,store:1}]},
  {id:"p6",section:"🔭 몸 상태 관찰",text:"화장실 패턴이 어떤가요? (예민하지만 아주 중요해요!)",hint:"최근 한 달, 솔직하게 떠올려보세요",options:[{text:"하루에도 여러 번, 묽거나 설사 형태가 잦음 💨",absorb:-2,burn:0,store:-1},{text:"며칠에 한 번씩, 늘 힘들게 보고 나옴 😫",absorb:0,burn:-1,store:1},{text:"매일 비슷한 시간에 알아서 해결하고 나옴 ✅",absorb:1,burn:1,store:0},{text:"색깔이나 냄새가 유독 강하고 기름진 느낌 🟤",absorb:-1,burn:0,store:1}]},
  {id:"p7",section:"⚡ 에너지 관찰",text:"학교 마치고 집에 돌아온 아이의 첫 행동은?",hint:"현관문 열고 들어오는 그 순간부터 관찰해보세요",options:[{text:"가방도 안 내려놓고 \"뭐 먹을 것 없어?\" 주방 직행 🎒",absorb:1,burn:1,store:1},{text:"손 씻고 간식 먹고 숙제하는 루틴이 있음 📚",absorb:1,burn:0,store:0},{text:"가방 던지고 바로 쓰러짐. 피곤해 죽겠다는 표정 😵",absorb:-1,burn:-1,store:-1},{text:"들어오자마자 어디 나가서 놀겠다고 다시 나감 🏃",absorb:1,burn:2,store:0}]},
  {id:"p8",section:"⚡ 에너지 관찰",text:"같은 걸 뛰었는데 아이 땀 양은 또래와 비교하면?",hint:"체육 수업 후, 운동장 놀이 후 등 비슷한 활동 기준",options:[{text:"친구들보다 훨씬 많이 흘림. 머리까지 흠뻑 😅",absorb:0,burn:2,store:-1},{text:"다들 비슷한 것 같음. 딱 보통 👌",absorb:0,burn:0,store:0},{text:"친구들은 땀 범벅인데 우리 아이는 멀쩡 🧊",absorb:0,burn:-1,store:1},{text:"운동할 때보다 주로 잠잘 때 땀을 많이 흘림 🌙",absorb:-1,burn:0,store:-1}]},
  {id:"p9",section:"😴 수면·회복 관찰",text:"불 끄고 나서 아이가 잠들기까지의 과정은?",hint:"어젯밤을 떠올려보세요",options:[{text:"눕자마자 10분 안에 조용해짐. 기절 수준 💤",absorb:1,burn:1,store:0},{text:"\"배고파\" \"물 줘\" \"화장실\" — 이유 대며 계속 나옴 🚽",absorb:1,burn:1,store:1},{text:"조용히 누워 있는데 한참 뒤에 잠듦. 생각이 많은 듯 🤔",absorb:-1,burn:-1,store:-1},{text:"더웠다 추웠다, 뒤척이다 땀 흘리며 자주 깸 😰",absorb:-1,burn:1,store:-1}]},
  {id:"p10",section:"😴 수면·회복 관찰",text:"아이가 감기에 걸렸을 때, 어떻게 앓나요?",hint:"형제·자매 또는 같은 반 친구들과 비교해서",options:[{text:"잘 안 걸리고, 걸려도 3~4일이면 씩씩하게 나음 💪",absorb:1,burn:1,store:1},{text:"걸리면 일주일 정도, 딱 평범하게 앓고 나음 🙂",absorb:0,burn:0,store:0},{text:"한 번 걸리면 2주 이상. 중이염·폐렴으로 이어진 적도 있음 😷",absorb:-2,burn:-1,store:-1},{text:"잘 걸리진 않는데 한번 걸리면 유독 처져 있고 밥을 안 먹음 😩",absorb:-1,burn:-1,store:0}]},
  {id:"p11",section:"📈 성장 패턴",text:"최근 6개월, 아이 체중이 어떻게 됐나요?",hint:"건강검진 수첩이나 성장 앱 기록을 떠올려보세요",options:[{text:"거의 그대로. 체중계가 고장난 줄 알았음 😅",absorb:-1,burn:1,store:-2},{text:"조금 늘긴 했는데 또래보다는 덜 늘었다는 느낌 📉",absorb:-1,burn:1,store:-1},{text:"꾸준히 잘 늘고 있음. 성장 곡선 따라가는 중 📊",absorb:1,burn:0,store:1},{text:"또래보다 확실히 빠르게, 많이 늘고 있음 📈",absorb:1,burn:-1,store:2}]},
  {id:"p12",section:"📈 성장 패턴",text:"우리 아이 평소 모습과 제일 가까운 것은?",hint:"집에서, 학교에서 관찰되는 일상 속 성향",options:[{text:"낯선 것엔 일단 겁부터. 새 음식·새 장소·새 친구 다 적응 느림 🐌",absorb:-1,burn:-1,store:-1},{text:"가만히 있는 걸 못 함. 항상 뭔가 하고 있어야 직성이 풀림 🌪️",absorb:1,burn:2,store:-1},{text:"뭘 줘도 \"응\" 하고 받아들임. 불평이 별로 없음 🐻",absorb:1,burn:-1,store:1},{text:"조용하고 혼자 있는 걸 좋아함. 자기 세계가 있음 🌙",absorb:-1,burn:-1,store:0}]},
];

const kidQuestions = [
  {id:"k1",section:"🍚 밥이랑 나랑",text:"\"밥 먹어!\" 소리 들었을 때 내 속마음은?",hint:"진짜 솔직하게! 아무도 안 봐",options:[{text:"🎉 오예! 드디어! 달려가는 중",absorb:1,burn:1,store:0},{text:"😒 또...? 방금 먹은 것 같은데...",absorb:-1,burn:-1,store:-1},{text:"🤷 뭐 나왔는지 보고 결정",absorb:0,burn:0,store:0},{text:"😋 밥 차리는 냄새 맡고 벌써 침 고임",absorb:1,burn:1,store:1}]},
  {id:"k2",section:"🍚 밥이랑 나랑",text:"급식에서 내가 젤 싫어하는 반찬이 나왔어. 나는?",hint:"학교 급식 또는 집 밥에서 실제로 해본 것!",options:[{text:"🙅 안 먹어. 진짜로. 굶어도 괜찮아.",absorb:-2,burn:0,store:-1},{text:"😤 선생님 몰래 냅킨에 싸서 버림 (실화)",absorb:-1,burn:0,store:-1},{text:"😬 코 막고 한 입. 후다닥 삼키고 물로 넘김",absorb:0,burn:0,store:0},{text:"😎 싫은 건 없는데? 다 먹을 수 있음",absorb:1,burn:1,store:1}]},
  {id:"k3",section:"🍚 밥이랑 나랑",text:"점심 먹고 오후 수업 시간, 내 배 상태는?",hint:"오늘 오후를 떠올려봐. 아니면 어제",options:[{text:"🔔 벌써 배고파. 시계만 보고 있음 (간식 생각)",absorb:1,burn:2,store:0},{text:"😌 든든하고 괜찮음. 수업에 집중 가능",absorb:1,burn:0,store:1},{text:"🤢 뭔가 부글부글하거나 묵직하게 불편함",absorb:-2,burn:0,store:0},{text:"😶 배고픈지 배부른지 솔직히 잘 모르겠음",absorb:-1,burn:-1,store:-1}]},
  {id:"k4",section:"🔥 내 몸의 온도",text:"체육 시간에 친구들이랑 같이 뛰고 나서, 나만의 특징은?",hint:"같은 걸 했는데 나만 다른 점이 있으면 골라봐",options:[{text:"💦 나만 땀이 폭포임. 머리카락까지 젖음",absorb:0,burn:2,store:-1},{text:"😅 다들 비슷하게 흘리는 것 같음. 나도 보통",absorb:0,burn:0,store:0},{text:"🧊 친구들은 땀 범벅인데 나는 별로 안 남",absorb:0,burn:-1,store:1},{text:"🥵 얼굴은 빨개지는데 땀은 별로 없고 속이 더움",absorb:-1,burn:1,store:0}]},
  {id:"k5",section:"🔥 내 몸의 온도",text:"교실에서 에어컨 온도 전쟁이 나면, 나는 어느 팀?",hint:"진짜 솔직하게! 눈치 보지 말고",options:[{text:"🥵 덥다팀. 나만 더운 것 같음. 에어컨 더 틀어줘",absorb:0,burn:2,store:-1},{text:"🥶 춥다팀. 여름에도 긴팔 입고 싶음. 항상 추워",absorb:-1,burn:-1,store:0},{text:"😊 중간파. 어느 쪽이든 별로 신경 안 씀",absorb:0,burn:0,store:0},{text:"🤔 때에 따라 다름. 오늘은 덥고 내일은 추운 타입",absorb:0,burn:0,store:0}]},
  {id:"k6",section:"💩 은밀한 화장실 이야기",text:"나의 화장실 루틴은? (아무도 모르는 나만의 비밀!)",hint:"진짜 솔직하게 — 여기서만 말해봐",options:[{text:"✅ 매일 같은 시간에 시원하게 해결. 기분 좋음",absorb:1,burn:1,store:0},{text:"😫 며칠에 한 번. 오래 앉아 있어야 하고 힘듦",absorb:0,burn:-1,store:1},{text:"🚨 갑자기 배가 아프다가 급하게 달려가는 스타일",absorb:-2,burn:0,store:-1},{text:"💭 딱히 패턴이 없음. 마려우면 가고 아니면 안 가고",absorb:0,burn:0,store:0}]},
  {id:"k7",section:"😴 잠이랑 나랑",text:"불 끄고 누웠을 때, 잠들기까지 나는?",hint:"어젯밤 자기 직전을 떠올려봐",options:[{text:"💤 눕자마자 기억 없음. 눈 감으면 끝",absorb:1,burn:1,store:0},{text:"🍕 배가 고파서 뭔가 먹고 싶은데 참다가 잠듦",absorb:1,burn:2,store:0},{text:"🤔 오늘 있었던 일이 자꾸 생각나서 한참 뒤에 잠듦",absorb:-1,burn:-1,store:-1},{text:"🌡️ 덥거나 추워서 이불을 계속 조정하다 겨우 잠듦",absorb:-1,burn:1,store:-1}]},
  {id:"k8",section:"😴 잠이랑 나랑",text:"학교 가는 날 아침, 일어났을 때 내 몸은?",hint:"오늘 아침 딱 그 느낌",options:[{text:"⚡ 멀쩡함. 일어나면 바로 움직일 수 있음",absorb:1,burn:1,store:0},{text:"🍳 배고파서 빨리 밥 먹고 싶음. 그게 제일 먼저",absorb:1,burn:2,store:0},{text:"🧟 몸이 무겁고 피곤함. 학교 가기 싫은 게 반, 피곤한 게 반",absorb:-1,burn:-1,store:-1},{text:"😐 그냥 보통. 졸리지도 않고 신나지도 않음",absorb:0,burn:0,store:0}]},
  {id:"k9",section:"🧠 내 마음 속",text:"급식 줄 서면서 메뉴 보고 \"오늘 별로다\" 싶을 때, 진짜 이유는?",hint:"제일 자주 드는 그 생각으로 골라봐",options:[{text:"🤢 냄새나 식감이 너무 싫음. 그냥 보기만 해도 거부감",absorb:-2,burn:0,store:-1},{text:"😶 딱히 이유는 없는데 그냥 별로 안 고픔",absorb:-1,burn:-1,store:-1},{text:"😤 저번에 먹고 배 아팠던 기억이 있어서",absorb:-2,burn:0,store:0},{text:"😊 그런 생각 별로 안 함. 나오면 먹는 편",absorb:1,burn:0,store:1}]},
  {id:"k10",section:"🧠 내 마음 속",text:"시험이나 발표 있는 날 아침, 밥 앞에서 나는?",hint:"긴장되는 날 아침 밥상 앞의 내 모습",options:[{text:"🤮 배가 아프거나 메스꺼워서 한 숟갈도 못 먹겠음",absorb:-2,burn:0,store:-1},{text:"😐 긴장해도 밥은 밥. 그냥 평소처럼 먹고 나감",absorb:0,burn:0,store:0},{text:"💪 긴장하면 오히려 배가 더 고픔. 든든하게 먹어야 함",absorb:1,burn:1,store:0},{text:"🍫 스트레스받으면 단 거나 과자가 더 당김",absorb:0,burn:0,store:2}]},
  {id:"k11",section:"🏃 몸 쓰는 이야기",text:"체육 수업 끝나고 딱 그 순간, 내 몸이 제일 먼저 원하는 건?",hint:"수업 끝나는 종소리 들리는 그 순간",options:[{text:"💧 물! 물 마시고 싶음. 일단 수분 보충",absorb:0,burn:1,store:0},{text:"🍔 배고파 죽겠음. 다음 급식까지 못 기다리겠음",absorb:1,burn:2,store:0},{text:"🛋️ 앉고 싶음. 너무 힘들었음. 좀 쉬고 싶음",absorb:-1,burn:-1,store:0},{text:"🤢 배가 살살 아프거나 울렁거림. 이게 종종 있음",absorb:-2,burn:0,store:-1}]},
  {id:"k12",section:"🏃 몸 쓰는 이야기",text:"마지막 질문! 지금 이 순간 솔직히, 내 배는?",hint:"설문 푸는 바로 지금 이 순간",options:[{text:"🔔 배고파. 이거 끝나면 뭔가 먹을 것 같음",absorb:1,burn:1,store:0},{text:"😌 적당히 든든함. 딱 좋음",absorb:1,burn:0,store:1},{text:"😶 잘 모르겠음. 배고픈 것 같기도 하고 아닌 것 같기도 함",absorb:-1,burn:-1,store:-1},{text:"🤢 좀 불편하거나 더부룩함. 뭔가 걸린 느낌",absorb:-1,burn:0,store:0}]},
];

// ─── 분석 함수 ────────────────────────────────────────────────────────────────
function analyze(pAns,kAns) {
  let a=0,b=0,c=0,pCount=0,kCount=0;
  parentQuestions.forEach(q=>{
    const idx=pAns[q.id];
    if(idx!==undefined){a+=q.options[idx].absorb;b+=q.options[idx].burn;c+=q.options[idx].store;pCount++;}
  });
  kidQuestions.forEach(q=>{
    const idx=kAns[q.id];
    if(idx!==undefined){a+=q.options[idx].absorb;b+=q.options[idx].burn;c+=q.options[idx].store;kCount++;}
  });
  const thr=pCount>0&&kCount===0?2:3;
  const norm=v=>v<=-thr?1:v>=thr?3:v<0?1:v===0?2:3;
  const code=`${norm(a)}${norm(b)}${norm(c)}`;
  const sub=codeMap[code]||"항온형";
  const main=(subType[sub]&&subType[sub].main)||"균형형";
  return {code,sub,main,scores:{absorb:norm(a),burn:norm(b),store:norm(c)}};
}

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
      if(pIdx<parentQuestions.length-1) setPIdx(pIdx+1);
      else setStep("bridge");
    },250);
  }

  function handleKid(i){
    setSelK(i);
    setTimeout(()=>{
      const n={...kAns,[kQ.id]:i};
      setKAns(n);setSelK(null);
      if(kIdx<kidQuestions.length-1) setKIdx(kIdx+1);
      else {
        const res=analyze(pAns,n);
        setResult(res);setStep("result");
        callAI(pAns,n,res,setAiAdvice,setLoading);
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
    setAiAdvice("설문 응답이 없어 AI 상담을 제공하기 어렵습니다. 신체 정보 기반 성장 지표를 확인해보세요.");
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
            title:"우리 아이 체질 코드 찾기 →",
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
    <div class="detail-title">체질 상세 결과 확인서</div>
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
    <div class="hashtag">#피지컬업333테스트 #Physical UP 333 #체질코드</div>
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

  // ── BRIDGE ─────────────────────────────────────────────────────────────────
  if(step==="bridge") return (
    <div style={{minHeight:"100vh",background:bg,fontFamily:font}}>
      <NavBar/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px"}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{width:70,height:70,borderRadius:"50%",margin:"0 auto 18px",background:"linear-gradient(135deg,#c9a84c,#e8c76a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:"0 0 30px rgba(201,168,76,0.4)"}}>🎉</div>
        <h2 style={{color:WHITE,fontSize:20,fontWeight:800,marginBottom:8}}>PART A 완료!</h2>
        <p style={{color:MUTED,fontSize:14,lineHeight:1.9,marginBottom:24}}>부모님의 날카로운 관찰 완료 👀<br/>아이 설문을 추가하면 더 정확해져요.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <button onClick={()=>setStep("partB")} style={{padding:"16px 8px",borderRadius:12,background:"linear-gradient(135deg,#c9a84c,#e8c76a)",color:NAVY,fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(201,168,76,0.3)",lineHeight:1.6}}>
            🙋 아이 설문<br/><span style={{fontSize:11,fontWeight:600,opacity:0.7}}>PART B · 12문항</span>
          </button>
          <button onClick={skipKid} style={{padding:"16px 8px",borderRadius:12,background:"rgba(201,168,76,0.08)",color:GOLD2,fontSize:14,fontWeight:800,border:`1.5px solid rgba(201,168,76,0.3)`,cursor:"pointer",lineHeight:1.6}}>
            ⚡ 바로 결과<br/><span style={{fontSize:11,fontWeight:600,opacity:0.7}}>부모 응답만으로</span>
          </button>
        </div>
        <p style={{color:MUTED,fontSize:11,opacity:0.5}}>아이 설문 건너뛰면 정확도가 낮아질 수 있어요</p>
      </div>
      </div>
    </div>
  );

  // ── PART B ─────────────────────────────────────────────────────────────────
  if(step==="partB"){
    const prog=Math.round((Object.keys(kAns).length/kidQuestions.length)*100);
    return (
      <div style={{minHeight:"100vh",background:bg,fontFamily:font}}>
        <NavBar/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px"}}>
        <div style={{maxWidth:400,width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:20,padding:"4px 14px",color:GOLD,fontSize:11,fontWeight:700}}>🙋 PART B · 아이 자가체크</div>
            <span style={{color:GOLD,fontSize:13,fontWeight:800,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:20,padding:"3px 12px"}}>{kIdx+1} / 12</span>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4,marginBottom:6}}>
            <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#e8c76a,#f5e0a0)",width:`${prog}%`,transition:"width 0.3s",boxShadow:"0 0 8px rgba(232,199,106,0.5)"}}/>
          </div>
          <div style={{textAlign:"right",color:MUTED,fontSize:10,marginBottom:18}}>{prog}%</div>
          <div style={{color:MUTED,fontSize:12,marginBottom:8}}>✏️ {kQ.hint}</div>
          <h2 style={{color:WHITE,fontSize:18,fontWeight:700,lineHeight:1.6,marginBottom:20}}>{kQ.text}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {kQ.options.map((opt,i)=>(
              <button key={i} onClick={()=>handleKid(i)} style={{padding:"14px 16px",borderRadius:12,textAlign:"left",background:selK===i?"rgba(201,168,76,0.18)":kAns[kQ.id]===i?"rgba(201,168,76,0.10)":"rgba(255,255,255,0.03)",border:selK===i?"1.5px solid rgba(201,168,76,0.8)":kAns[kQ.id]===i?"1.5px solid rgba(201,168,76,0.4)":"1.5px solid rgba(255,255,255,0.07)",color:kAns[kQ.id]===i?GOLD3:"#e8c8d4",fontSize:14,cursor:"pointer",transition:"all 0.2s",transform:selK===i?"scale(0.98)":"scale(1)"}}>
                {opt.text}
              </button>
            ))}
          </div>
          {kIdx>0&&<button onClick={()=>setKIdx(kIdx-1)} style={{marginTop:18,background:"none",border:"none",color:MUTED,fontSize:13,cursor:"pointer"}}>← 이전</button>}
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
            <div style={{color:MUTED,fontSize:13,marginTop:4}}>의 체질 코드 분석 결과입니다 ⚾</div>
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
            <div style={{color:GOLD,fontSize:11,marginBottom:14,fontWeight:700,letterSpacing:1,borderBottom:"1px solid rgba(201,168,76,0.15)",paddingBottom:10}}>⚾ 3축 체질 코드 분석</div>
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

          {/* 3D 큐브 분포도 */}
          <div style={cardStyle}>
            <div style={{color:GOLD,fontSize:11,marginBottom:4,fontWeight:700,letterSpacing:1}}>📦 333 체질 코드 큐브</div>
            <div style={{color:MUTED,fontSize:10,marginBottom:14}}>흡수력 · 연소력 · 축적력 3축의 27가지 코드 — 우리 아이 위치가 표시됩니다</div>
            <CubeChart code={result.code} ment={ment}/>
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
                const txt=`🧬 Physical UP 333 · 333TEST\n\n체질코드: ${result.code} ${ment.emoji} ${ment.nick}\n유형: ${result.main}\n\n"${shortWit}"\n💡${shortTip}\n\n▶ 무료 체질검사\npu333.kr`;
                try{
                  if(navigator.share){
                    await navigator.share({title:'333TEST 체질 코드 결과',text:txt,url:'https://pu333.kr'});
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

            {/* 유료회원 전환 배너 */}
            <div style={{
              padding:"14px 16px",borderRadius:12,marginBottom:10,
              background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(13,27,62,0.6))",
              border:"1px solid rgba(201,168,76,0.3)",
              position:"relative",overflow:"hidden"
            }}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})`}}/>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:24,flexShrink:0}}>🏅</div>
                <div>
                  <div style={{color:GOLD2,fontSize:12,fontWeight:800,marginBottom:3}}>유료회원 전환 준비 중</div>
                  <div style={{color:MUTED,fontSize:11,lineHeight:1.6}}>
                    피지컬UP을 위한 <span style={{color:GOLD}}>철저한 식단 · 운동 · 체중관리</span> 기능이 곧 제공됩니다
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 맞춤 제품 추천 */}
          {(()=>{
            const shopMap={
              "111":["#소화효소","#유산균"],"112":["#단백질","#유산균"],
              "121":["#소화효소","#종합비타민"],"211":["#유산균","#소화효소"],
              "331":["#단백질","#칼슘마그네슘"],"231":["#단백질","#오메가3"],
              "321":["#키성장","#칼슘마그네슘"],"131":["#유산균","#소화효소"],
              "132":["#소화효소","#유산균"],"133":["#유산균","#비타민D"],
              "311":["#단백질","#종합비타민"],"312":["#단백질","#칼슘마그네슘"],
              "222":["#종합비타민","#오메가3"],"221":["#종합비타민","#오메가3"],
              "212":["#단백질","#칼슘마그네슘"],"122":["#비타민D","#유산균"],
              "333":["#종합비타민","#칼슘마그네슘"],"323":["#비타민D","#칼슘마그네슘"],
              "332":["#오메가3","#종합비타민"],"322":["#칼슘마그네슘","#비타민D"],
              "232":["#단백질","#종합비타민"],"113":["#식이섬유","#홈트"],
              "213":["#식이섬유","#유산균"],"313":["#종합비타민","#홈트"],
              "233":["#식이섬유","#홈트"],"223":["#식이섬유","#칼슘마그네슘"],
              "123":["#홈트","#식이섬유"],
            };
            const nameMap={
              "#소화효소":"소화효소","#유산균":"유산균","#단백질":"단백질·벌크업",
              "#종합비타민":"종합비타민","#오메가3":"오메가3","#비타민D":"비타민D",
              "#칼슘마그네슘":"칼슘·마그네슘","#키성장":"키성장","#식이섬유":"식이섬유",
              "#홈트":"홈트기구",
            };
            const links=shopMap[result.code]||["#종합비타민","#유산균"];
            return (
              <div style={{...cardStyle,marginBottom:10}}>
                <div style={{color:GOLD,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:10}}>🛒 {ment.nick} 맞춤 추천 제품</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {links.map((l,i)=>(
                    <a key={i} href={`/shop.html${l}`} target="_blank" rel="noopener noreferrer" style={{
                      padding:"8px 16px",borderRadius:10,
                      background:`linear-gradient(135deg,${GOLD}18,rgba(13,27,62,0.6))`,
                      border:`1px solid ${GOLD}40`,
                      color:GOLD2,fontSize:13,fontWeight:700,
                      textDecoration:"none",display:"flex",alignItems:"center",gap:4
                    }}>🛒 {nameMap[l]} →</a>
                  ))}
                  <a href="/shop.html" target="_blank" rel="noopener noreferrer" style={{
                    padding:"8px 16px",borderRadius:10,
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(255,255,255,0.08)",
                    color:MUTED,fontSize:12,fontWeight:500,
                    textDecoration:"none"
                  }}>전체 보기</a>
                </div>
              </div>
            );
          })()}

          <button onClick={reset} style={{width:"100%",padding:"14px",borderRadius:12,background:"rgba(201,168,76,0.06)",color:MUTED,fontSize:14,border:"1px solid rgba(201,168,76,0.2)",cursor:"pointer",marginBottom:4}}>🔄 처음부터 다시하기</button>
          <p style={{color:"#1a2a3a",fontSize:11,textAlign:"center",marginTop:14,lineHeight:1.7}}>본 결과는 참고용이며 의학적 진단을 대체하지 않습니다.<br/>성장곡선이 지속 하락 시 소아과 진료를 권장합니다.</p>
        </div>
        </div>
      </div>
    );
  }

  // ── SHOP ──────────────────────────────────────────────────────────────────
  if(step==="shop"&&result){
    const mi=mainType[result.main]||mainType["균형형"];
    const ment=codeMents[result.code]||{emoji:"⚖️",nick:"완벽균형"};

    const shopData={
      소비형:{
        tag:"찌우기 필요",color:"#4fcfa0",
        products:[
          {name:"소화효소제",desc:"식사 직전 복용 · 흡수력 향상 핵심",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
          {name:"아연",desc:"식욕 증진 · 성장 호르몬 활성화",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"유산균",desc:"장 흡수력 개선 · 면역 강화",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
          {name:"비타민 B군",desc:"에너지 대사 보조 · 식욕 촉진",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"무가당 땅콩버터",desc:"고칼로리 밀도 간식 · 증량 필수템",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
          {name:"마그네슘",desc:"근육·신경 안정 · 숙면 유도",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
        ]
      },
      균형형:{
        tag:"현상태 관리",color:"#4f8ef7",
        products:[
          {name:"종합비타민",desc:"전반적 균형 유지 · 컨디션 관리",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"오메가3",desc:"두뇌 발달 · 집중력 향상",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
          {name:"비타민 D",desc:"뼈 성장 · 면역 강화",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"유산균",desc:"장 건강 예방적 관리",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
          {name:"마그네슘",desc:"수면 · 근육 회복 · 성장호르몬",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"칼슘",desc:"뼈 성장 · 골격 강화",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
        ]
      },
      저장형:{
        tag:"살빼기 필요",color:"#f76f8e",
        products:[
          {name:"식이섬유",desc:"포만감 · 혈당 조절 · 장 건강",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"마그네슘",desc:"인슐린 감수성 개선 · 대사 활성화",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
          {name:"비타민 D",desc:"대사 기능 활성화 · 체중 관리",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"유산균",desc:"장내 미생물 균형 · 체중 조절",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
          {name:"오메가3",desc:"체지방 분해 보조 · 염증 억제",links:[{shop:"쿠팡",url:"#"},{shop:"올리브영",url:"#"}]},
          {name:"아연",desc:"대사 효소 활성화 · 면역 강화",links:[{shop:"쿠팡",url:"#"},{shop:"네이버",url:"#"}]},
        ]
      }
    };

    const shopColor={쿠팡:"#e5302a",네이버:"#03c75a",올리브영:"#a50034"};
    const current=shopData[shopTab||result.main]||shopData["균형형"];

    return (
      <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 20px 60px",fontFamily:font}}>
        <div style={{maxWidth:400,width:"100%"}}>

          {/* 헤더 */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{background:"linear-gradient(135deg,#c9a84c,#e8c76a,#c9a84c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:13,fontWeight:900,letterSpacing:3,marginBottom:8}}>Physical UP 333 · Physical UP 333</div>
            <div style={{color:WHITE,fontSize:18,fontWeight:800,marginBottom:4}}>🛒 내 체질 맞춤 제품</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:`${current.color}18`,border:`1px solid ${current.color}40`}}>
              <span style={{color:current.color,fontSize:13,fontWeight:700}}>{mi.emoji} {result.main}</span>
              <span style={{color:"rgba(255,255,255,0.3)"}}>|</span>
              <span style={{color:GOLD,fontSize:13,fontWeight:700}}>{ment.emoji} {ment.nick}</span>
            </div>
          </div>

          {/* 제품 목록 */}
          <div style={{...cardStyle,border:`1px solid ${current.color}30`}}>
            <div style={{color:current.color,fontSize:12,fontWeight:700,marginBottom:4,letterSpacing:1}}>{mi.emoji} {result.main} · {current.tag}</div>
            <div style={{color:MUTED,fontSize:11,marginBottom:16,borderBottom:"1px solid rgba(255,255,255,0.06)",paddingBottom:10}}>
              체질에 맞는 추천 제품이에요. 링크를 눌러 확인해보세요!
            </div>
            {current.products.map((p,i)=>(
              <div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:i<current.products.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    <div style={{color:WHITE,fontSize:14,fontWeight:700,marginBottom:2}}>{p.name}</div>
                    <div style={{color:MUTED,fontSize:12}}>{p.desc}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {p.links.map((l,j)=>(
                    <a key={j} href={l.url} target="_blank" rel="noopener noreferrer" style={{
                      padding:"6px 14px",borderRadius:8,
                      background:`${shopColor[l.shop]}20`,
                      border:`1px solid ${shopColor[l.shop]}50`,
                      color:shopColor[l.shop],
                      fontSize:12,fontWeight:700,
                      textDecoration:"none",
                      display:"inline-block"
                    }}>{l.shop} →</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 다른 체질 보기 */}
          <div style={{...cardStyle}}>
            <div style={{color:GOLD,fontSize:11,fontWeight:700,marginBottom:12,letterSpacing:1}}>다른 체질 제품도 보기</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {Object.entries(shopData).map(([name,data])=>(
                <button key={name} onClick={()=>setShopTab(name)} style={{
                  padding:"10px 6px",borderRadius:10,textAlign:"center",
                  background:(shopTab||result.main)===name?`${data.color}20`:"rgba(255,255,255,0.03)",
                  border:`1px solid ${(shopTab||result.main)===name?data.color:"rgba(255,255,255,0.07)"}`,
                  color:(shopTab||result.main)===name?data.color:MUTED,
                  fontSize:11,fontWeight:(shopTab||result.main)===name?800:400,cursor:"pointer"
                }}>
                  {mainType[name]?.emoji}<br/>{name}
                </button>
              ))}
            </div>
          </div>

          {/* 뒤로가기 */}
          <button onClick={()=>setStep("result")} style={{width:"100%",padding:"14px",borderRadius:12,background:"rgba(201,168,76,0.06)",color:MUTED,fontSize:14,border:"1px solid rgba(201,168,76,0.2)",cursor:"pointer"}}>← 결과로 돌아가기</button>
        </div>
      </div>
    );
  }
  return null;
}
