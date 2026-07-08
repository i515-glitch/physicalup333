import os

# 1. 사용자가 복사해서 보내주신 앞부분 HTML (약 155라인까지)
user_html_prefix = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PHYSICAL UP 성장잠재력 분석 보고서</title>
<style>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css");





  :root{
    --navy:#15233b;
    --navy2:#22344f;
    --gold:#b08a3e;
    --gold-d:#8a6b2c;
    --ink:#13191f;
    --ink2:#333d49;
    --ink3:#5f6976;
    --line:#c8cfd8;
    --line2:#dde2e8;
    --mist:#f4f6f8;
    --pos:#235c4e;
    --neu:#8a6a28;
    --neg:#8f3e2f;
    --page:#ffffff;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{
    font-family:'Pretendard',sans-serif;
    background:#6b7280;
    color:var(--ink);
    line-height:1.65;
    font-weight:450;
    -webkit-font-smoothing:antialiased;
    padding:30px 0;
  }
  .serif{font-family:'Pretendard',sans-serif;font-weight:700;}

  /* ===== A4 PAGE ===== */
  .sheet{
    width:160mm;
    min-height:297mm;
    box-sizing:border-box;
    background:var(--page);
    margin:0 auto 22px;
    padding:6mm 13mm 6mm;
    position:relative;
    box-shadow:0 2px 18px rgba(0,0,0,.28);
  }
  .chapter, h2, h3, table, .note, .interp, .engine, .scoreline, .qtable, .pbar, .verdict, .myth, .reco, .qa-intro{break-inside:avoid;}
  h2, h3{break-after:avoid;}
  /* page header band */
  .ph{
    position:absolute;top:9mm;left:13mm;right:13mm;
    display:flex;justify-content:space-between;align-items:center;
    padding-bottom:5px;border-bottom:1px solid var(--line2);
    font-size:8.5pt;letter-spacing:.5px;color:var(--ink3);
  }
  .ph .doc-id{color:var(--gold-d);font-weight:500;letter-spacing:1px;}
  .ph .crest-sm{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--navy);letter-spacing:2px;font-size:9pt;}
  .ph .crest-sm i{width:13px;height:16px;background:var(--gold);clip-path:polygon(50% 0,100% 22%,100% 65%,50% 100%,0 65%,0 22%);display:inline-block;font-style:normal;}
  /* page footer */
  .pf{
    position:absolute;bottom:10mm;left:13mm;right:13mm;
    display:flex;justify-content:space-between;align-items:center;
    padding-top:5px;border-top:1px solid var(--line2);
    font-size:8pt;color:var(--ink3);letter-spacing:.5px;
  }
  .pf .conf{text-transform:uppercase;letter-spacing:1.5px;}
  .body{flex:1;padding-top:12mm;padding-bottom:6mm;}

  /* ===== COVER PAGE (White Theme) ===== */
  .cover{
    background:var(--page);
    color:var(--navy);
    justify-content:flex-start;
    padding:24mm 13mm;
    width:160mm;
    margin:0 auto 22px;
    height:297mm; /* Full A4 height */
    position:relative;
    box-sizing:border-box;
    text-align:center;
    box-shadow:0 2px 18px rgba(0,0,0,.28);
  }
  .cover .logo-img{width:74mm;height:auto;margin:6mm auto 0;display:block;}
  .cover-mid{margin-top:14mm;margin-bottom:auto;}
  .cover .rule{width:60px;height:3px;background:var(--gold);margin:0 auto 22px;}
  .cover .kind{font-size:10pt;letter-spacing:7px;color:var(--gold);text-transform:uppercase;margin-bottom:16px;font-weight:600;}
  .cover h1{font-family:'Pretendard',sans-serif;font-size:34pt;font-weight:900;line-height:1.3;letter-spacing:-1px;color:var(--navy);}
  .cover .quote{margin:22px auto 0;text-align:center;}
  .cover .quote .slogan-img{width:68mm;height:auto;display:block;margin:0 auto;}
  .cover-info{
    border-top:2px solid rgba(176,138,62,.5);
    padding-top:22px;
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:16px 30px;
    max-width:110mm;
    position:absolute;
    bottom:20mm;
    left:50%;
    transform:translateX(-50%);
    width:110mm;
    margin:0;
    text-align:center;
  }
  .cover-info div span{font-size:8pt;letter-spacing:2px;color:var(--gold);text-transform:uppercase;display:block;margin-bottom:4px;font-weight:600;}
  .cover-info div b{font-size:13pt;color:var(--navy);font-weight:700;}

  /* ===== HEADINGS ===== */
  .chapter{display:flex;align-items:baseline;gap:12px;margin-bottom:3px;}
  .chapter .cn{font-family:'Pretendard',sans-serif;font-size:14pt;font-weight:900;color:var(--gold-d);letter-spacing:0;}
  .chapter .ck{font-size:8.5pt;letter-spacing:2px;color:var(--ink3);text-transform:uppercase;}
  /* new chapter starts get breathing room + divider */
  .section{margin-top:14mm;padding-top:9mm;border-top:1px solid var(--line);}
  .section:first-of-type{margin-top:0;padding-top:0;border-top:none;}
  .section.cont{margin-top:8mm;padding-top:0;border-top:none;}
  h2{font-family:'Pretendard',sans-serif;font-size:19pt;font-weight:700;letter-spacing:-.5px;margin:2px 0 3px;color:var(--navy);}
  .lead{font-size:12pt;color:var(--ink2);margin-bottom:18px;max-width:100%;line-height:1.65;}
  h3{font-size:13pt;font-weight:700;color:var(--navy);letter-spacing:0;margin:24px 0 11px;padding-bottom:7px;border-bottom:2px solid var(--navy);}
  h3 .kr{font-weight:400;color:var(--ink3);letter-spacing:0;text-transform:none;font-size:10pt;margin-left:7px;}
  p{font-size:11.5pt;color:var(--ink2);line-height:1.75;}

  /* ===== TABLE ===== */
  table{width:100%;border-collapse:separate;border-spacing:0;margin:14px 0;font-size:9.5pt;break-inside:avoid;page-break-inside:avoid;border-radius:9px;overflow:hidden;box-shadow:0 1px 8px rgba(21,35,59,.08);border:1px solid var(--line2);}
  thead th{background:linear-gradient(135deg,#1a2c47,#15233b);color:#f0e9d8;font-weight:600;text-align:left;padding:9px 13px;font-size:9pt;letter-spacing:.5px;border:none;}
  thead th:not(:last-child){border-right:1px solid rgba(255,255,255,.08);}
  tbody td{padding:8px 13px;border-bottom:1px solid var(--line2);color:var(--ink2);font-size:9.5pt;line-height:1.45;}
  tbody tr:last-child td{border-bottom:none;}
  tbody tr:nth-child(even){background:#f8f9fb;}
  tbody tr:hover{background:#f3f0e8;}
  td.v{font-family:'Pretendard',sans-serif;font-weight:700;color:var(--navy);}
  .tag{display:inline-block;font-size:8.5pt;padding:2px 10px;border-radius:20px;font-weight:600;letter-spacing:.2px;}
  .t-pos{background:rgba(44,99,86,.12);color:var(--pos);}
  .t-neu{background:rgba(154,120,54,.14);color:var(--neu);}
  .t-neg{background:rgba(156,69,54,.12);color:var(--neg);}

  /* engine note (문서용 — 점선 박스, 차분) */
  .engine{border:1px solid var(--line);background:var(--mist);border-left:3px solid var(--gold);padding:12px 15px;margin:13px 0;font-size:10pt;color:var(--ink2);line-height:1.65;;break-inside:avoid;}
  .engine b{color:var(--gold-d);font-size:8pt;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:3px;}

  .note{background:var(--mist);border-left:3px solid var(--navy);padding:14px 17px;margin:15px 0;font-size:11pt;color:var(--ink2);line-height:1.75;;break-inside:avoid;}
  .note b{color:var(--ink);}
  .fn{display:block;font-size:8.5pt;color:var(--ink3);margin-top:6px;font-style:italic;line-height:1.5;}
  .src{font-size:8pt;color:var(--ink3);line-height:1.5;margin:5px 0 14px;padding-left:2px;font-style:italic;}

  /* filler tip boxes for empty space */
  .tipbox{border:1.5px solid var(--gold);border-radius:6px;background:linear-gradient(180deg,#fdfaf3,#faf6ec);padding:14px 18px;margin:18px 0;break-inside:avoid;}
  .tipbox .tb-label{display:inline-block;font-size:8.5pt;font-weight:700;color:#fff;background:var(--gold-d);padding:2px 10px;border-radius:3px;letter-spacing:1px;margin-bottom:8px;}
  .tipbox h4{font-size:11.5pt;color:var(--navy);font-weight:700;margin-bottom:6px;}
  .tipbox p{font-size:10.5pt;color:var(--ink2);line-height:1.7;margin:0;}
  .tipbox.navy{border-color:var(--navy);background:linear-gradient(180deg,#f5f7fa,#eef2f7);}
  .tipbox.navy .tb-label{background:var(--navy);}

  /* company seal stamp */
  .seal-wrap{display:flex;justify-content:flex-end;align-items:center;gap:20px;margin-top:30px;padding-top:20px;border-top:1px solid var(--line2);}
  .seal-text{text-align:right;font-size:9pt;color:var(--ink3);line-height:1.7;}
  .seal-text b{color:var(--navy);font-size:10pt;display:block;margin-bottom:2px;}
  .seal{width:88px;height:88px;border-radius:50%;border:2.5px solid var(--neg);display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--neg);transform:rotate(-12deg);position:relative;flex-shrink:0;}
  .seal::before{content:'';position:absolute;inset:5px;border:1px solid var(--neg);border-radius:50%;}
  .seal .s-top{font-size:6.5pt;letter-spacing:1px;font-weight:700;}
  .seal .s-mid{font-family:'Pretendard',sans-serif;font-size:15pt;font-weight:900;line-height:1;margin:2px 0;}
  .seal .s-bot{font-size:6pt;letter-spacing:.5px;font-weight:600;}
  .refs{margin-top:11px;padding-top:9px;border-top:1px solid var(--line2);font-size:7.5pt;color:var(--ink3);line-height:1.6;}
  .refs b{color:var(--ink2);font-style:normal;}

  /* percentile bar */
  .pbar{margin:13px 0;}
  .pbar .t{display:flex;justify-content:space-between;font-size:9pt;margin-bottom:5px;}
  .pbar .t span:first-child{color:var(--ink);font-weight:600;}
  .pbar .t b{color:var(--gold-d);font-weight:700;}
  .ptrack{height:10px;background:#eaedf1;border-radius:6px;position:relative;box-shadow:inset 0 1px 2px rgba(0,0,0,.06);overflow:visible;}
  .pfill{height:100%;border-radius:6px;box-shadow:0 1px 3px rgba(21,35,59,.25);position:relative;}
  .pavg{position:absolute;top:-4px;bottom:-4px;width:0;border-left:1.5px dashed var(--navy);z-index:2;}
  .pavg::after{content:'평균';position:absolute;top:-13px;left:50%;transform:translateX(-50%);font-size:6pt;color:var(--ink3);white-space:nowrap;}

  /* diverging benchmark: 또래 평균 기준 0점, 좌(약점)/우(강점) */
  .dbar{margin:16px 0;}
  .dbar .dt{display:flex;justify-content:space-between;align-items:baseline;font-size:9.5pt;margin-bottom:6px;}
  .dbar .dt span{color:var(--ink);font-weight:600;}
  .dbar .dt b{font-weight:700;font-size:9pt;}
  .dtrack{height:22px;position:relative;background:linear-gradient(90deg,#fbeae6 0%,#fbeae6 48%,#eef1f5 48%,#eef1f5 52%,#e6f0ec 52%,#e6f0ec 100%);border-radius:5px;}
  .dmid{position:absolute;left:50%;top:-5px;bottom:-5px;width:2px;background:var(--navy);transform:translateX(-50%);z-index:3;}
  .dmid::after{content:'또래 평균';position:absolute;top:-14px;left:50%;transform:translateX(-50%);font-size:6.5pt;color:var(--navy);white-space:nowrap;font-weight:600;}
  .dseg{position:absolute;top:4px;height:14px;border-radius:4px;display:flex;align-items:center;z-index:2;}
  .dseg.neg{right:50%;background:linear-gradient(90deg,#c75f4a,#b04e3a);justify-content:flex-start;padding-left:7px;}
  .dseg.pos{left:50%;background:linear-gradient(90deg,#2c6356,#3f8a76);justify-content:flex-end;padding-right:7px;}
  .dseg span{font-size:7.5pt;color:#fff;font-weight:700;white-space:nowrap;}
  .dbar .dnote{font-size:7.5pt;color:var(--ink3);margin-top:4px;}

  /* three-force score bars */
  .force{margin:13px 0;}
  .force .ft{display:flex;justify-content:space-between;font-size:9.5pt;margin-bottom:5px;}
  .force .ft span{color:var(--ink);font-weight:600;}
  .force .ft b{font-weight:700;font-size:9.5pt;}
  .ftrack{height:16px;background:#eef1f5;border-radius:8px;position:relative;overflow:visible;box-shadow:inset 0 1px 2px rgba(0,0,0,.06);}
  .fseg{height:100%;border-radius:8px;position:relative;box-shadow:0 1px 3px rgba(21,35,59,.2);}
  .fseg.s1{background:linear-gradient(90deg,#c75f4a,#b04e3a);}
  .fseg.s2{background:linear-gradient(90deg,#c9a14e,#a87f30);}
  .fseg.s3{background:linear-gradient(90deg,#2c6356,#3f8a76);}
  .fc{position:absolute;top:-3px;bottom:-3px;width:0;border-left:1px dashed #9aa3b0;z-index:2;}

  /* biocode */
  .biocode{background:var(--navy);color:#eef1f6;padding:20px 24px;margin:12px 0;display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:center;}
  .bc-l{text-align:center;border-right:1px solid rgba(176,138,62,.3);padding-right:22px;}
  .bc-d{font-family:'Pretendard',sans-serif;font-size:34pt;font-weight:700;letter-spacing:6px;color:var(--gold);line-height:1;}
  .bc-t{font-size:9pt;color:#b9c2d2;margin-top:6px;}
  .bc-ax div{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:9pt;}
  .bc-ax div:last-child{border:none;}
  .bc-ax span{color:#9aa6ba;}.bc-ax b{color:#eef1f6;font-weight:500;}

  /* input trio */
  .trio{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0;}
  .trio .it{border:1px solid var(--line);padding:13px;}
  .trio .it .ic{font-size:8pt;letter-spacing:1px;color:var(--gold-d);text-transform:uppercase;font-weight:700;}
  .trio .it h4{font-family:'Pretendard',sans-serif;font-size:11pt;margin:4px 0 6px;color:var(--navy);}
  .trio .it p{font-size:8.5pt;color:var(--ink2);}

  /* phases */
  .phases{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);margin:12px 0;}
  .phase{padding:13px;border-right:1px solid var(--line2);}
  .phase:last-child{border:none;}
  .phase.now{background:var(--mist);}
  .phase .e{font-size:8pt;letter-spacing:1px;color:var(--gold-d);text-transform:uppercase;font-weight:700;}
  .phase .a{font-size:8pt;color:var(--ink3);margin-bottom:5px;}
  .phase h4{font-family:'Pretendard',sans-serif;font-size:10.5pt;margin-bottom:5px;color:var(--navy);}
  .phase p{font-size:8.5pt;}

  .verdict{background:var(--mist);border-left:4px solid var(--navy);color:var(--navy);padding:24px 28px;margin:16px 0;text-align:left;}
  .verdict .vq{font-family:'Pretendard',sans-serif;font-size:11pt;line-height:1.8;white-space:pre-wrap;word-break:break-all;text-align:justify;}
  .verdict .vq em{font-style:normal;color:var(--gold-d);font-weight:bold;}
  .verdict .vq h3{font-family:'Pretendard',sans-serif;font-size:12pt;color:var(--navy);margin-top:18px;margin-bottom:8px;border-bottom:1px solid rgba(21,35,59,0.1);padding-bottom:5px;font-weight:700;}
  .verdict .vq h3:first-child{margin-top:0;}
  .verdict .vq strong{color:var(--gold-d);font-weight:700;}

  .toc-list{margin-top:10px;}
  .toc-part{display:flex;align-items:baseline;gap:10px;margin:18px 0 4px;padding-bottom:6px;border-bottom:2px solid var(--navy);}
  .toc-part:first-child{margin-top:6px;}
  .toc-part .pn{font-family:'Pretendard',sans-serif;font-weight:900;font-size:15pt;color:var(--navy);}
  .toc-part .pt{font-weight:700;font-size:13pt;color:var(--navy);}
  .toc-part .pe{margin-left:auto;font-size:8pt;color:var(--gold-d);letter-spacing:2px;text-transform:uppercase;font-weight:600;}
  .toc-list .ti{display:flex;align-items:baseline;padding:8px 0 8px 16px;border-bottom:1px solid var(--line2);font-size:10pt;}
  .toc-list .ti .n{font-family:'Pretendard',sans-serif;font-weight:700;color:var(--gold-d);width:26px;}
  .toc-list .ti .nm{color:var(--ink);font-weight:500;}
  .toc-list .ti .en{margin-left:auto;font-size:8pt;color:var(--ink3);letter-spacing:1px;text-transform:uppercase;}

  .disc-text{font-size:8pt;color:var(--ink3);line-height:1.7;}
  .disc-text b{color:var(--ink2);}

  /* survey question analysis */
  .qa-intro{font-size:10pt;color:var(--ink2);margin:8px 0 11px;line-height:1.6;;break-inside:avoid;}
  .qa-intro .sc{display:inline-block;font-family:'Pretendard',sans-serif;font-weight:700;color:var(--gold-d);font-size:10pt;margin-right:3px;}
  .qtable td.qn{font-family:'Pretendard',sans-serif;font-weight:700;color:var(--navy);text-align:center;width:42px;}
  .qtable th:first-child{width:42px;white-space:nowrap;}
  .qtable td.qr{text-align:center;width:88px;}
  .qtable th:nth-child(3){width:88px;}
  .qresp{display:inline-block;font-size:8.5pt;padding:1px 8px;border-radius:2px;font-weight:500;background:rgba(21,35,59,.07);color:var(--navy);white-space:nowrap;}
  .qresp.y2{background:rgba(44,99,86,.13);color:var(--pos);}
  .qresp.n{background:rgba(156,69,54,.12);color:var(--neg);}
  .interp{background:#faf6ee;border-left:3px solid var(--gold);padding:13px 16px;margin:12px 0;font-size:11pt;color:var(--ink2);line-height:1.75;;break-inside:avoid;}
  .interp b{color:var(--navy);}
  .reco{font-size:9.5pt;color:var(--ink2);margin:8px 0 2px;padding-left:15px;border-left:2px solid var(--line);line-height:1.65;}
  .reco b{color:var(--gold-d);}
  .scoreline{display:flex;align-items:baseline;gap:8px;margin:14px 0 4px;padding-bottom:5px;border-bottom:1.5px solid var(--navy);;break-inside:avoid;}
  .scoreline .nm{font-size:11pt;font-weight:700;color:var(--navy);font-family:'Pretendard',sans-serif;}
  .scoreline .sc{font-size:9pt;color:var(--ink2);}
  .scoreline .st{margin-left:auto;font-size:8.5pt;}

  /* myth-busting table */
  .myth td.mq{font-weight:700;color:var(--neg);width:130px;}
  .myth td.mt{color:var(--ink2);}
  .myth td.mh{color:var(--pos);font-weight:500;width:150px;font-size:8.5pt;}
  .myth tbody tr:nth-child(even){background:var(--mist);}

  @media print{
    body{background:none;padding:0;}
    .page, .sheet{
      margin:0;
      box-shadow:none;
      page-break-after:always;
      width:160mm !important;
    }
    .cover{
      width:160mm !important;
      height:297mm !important;
      padding:24mm 13mm !important;
    }
  }


  @media(max-width:800px){
    body { background-color: #f3f4f6 !important; }
    .page, .sheet{
      width:96% !important;
      min-height:auto;
      padding:20px 14px 16px !important;
      box-shadow:0 8px 24px rgba(0,0,0,0.12) !important;
      margin:0 auto 28px !important;
      border-radius:14px;
      border-top: 5px solid var(--gold-d) !important; /* Top colored bar to indicate clear page start */
      background-color: #ffffff !important;
    }
    
    /* Scaled typography for mobile to prevent excessively long pages */
    .page h1, .sheet h1 { font-size: 18px !important; margin-bottom: 8px !important; }
    .page h2, .sheet h2 { font-size: 15px !important; margin-bottom: 6px !important; }
    .page h3, .sheet h3 { font-size: 13px !important; margin-bottom: 6px !important; }
    .page p, .page li, .sheet p, .sheet li { font-size: 11.5px !important; line-height: 1.5 !important; margin-bottom: 6px !important; }
    
    /* Table padding and typography compression */
    .page table, .sheet table { font-size: 10px !important; margin-bottom: 8px !important; }
    .page td, .page th, .sheet td, .sheet th { padding: 4px 6px !important; }
    
    /* 6가지 오해와 진실 테이블 모바일 가로폭 밸런스 패치 */
    .myth td.mq { width: 23% !important; min-width: 75px !important; }
    .myth td.mh { width: 27% !important; min-width: 85px !important; }
    .myth td.mt { width: 50% !important; }
    
    /* Layout block spacing compression */
    .box { padding: 8px 10px !important; margin-bottom: 8px !important; border-radius: 8px !important; }
    .scoreline { padding: 6px 10px !important; margin-bottom: 6px !important; }
    
    /* Make charts/canvases larger and clear on mobile devices */
    .chart-container, canvas { max-height: 300px !important; width: 100% !important; height: auto !important; }
    #growth-history-chart-img { max-width: 100% !important; height: auto !important; margin: 0 auto !important; display: block; }
    
    .cover{
      width:96% !important;
      height:auto;
      min-height:85vh;
      padding:20px 15px !important;
      margin:0 auto 16px !important;
      box-shadow:0 4px 15px rgba(0,0,0,0.08) !important;
      border-radius:12px;
    }
    .cover-mid{margin-top:6mm !important;margin-bottom:8mm !important;}
    .cover .quote{margin:10px auto 0 !important;}
    .cover .quote .slogan-img{width:40mm !important;}
    .cover-info{
      position:relative !important;
      bottom:auto !important;
      left:auto !important;
      transform:none !important;
      width:100% !important;
      max-width:100% !important;
      margin:15px auto 0 !important;
      gap:8px 15px !important;
    }
    .ph,.pf{left:13mm;right:13mm;}
    .scoreline{flex-wrap:wrap;}
    .scoreline .nm{white-space:nowrap;}
    .scoreline .st{margin-left:0;width:100%;margin-top:2px;}
  }

  .section{padding:0;}
  .section .body{padding:0;}
  .part-break{break-before:page;}

  @media print{
    table, .box, .scoreline, .ftrack, figure, svg, img, tr{
      break-inside: avoid; page-break-inside: avoid;
    }
  }
</style>
</head>
<body><!-- ============ PAGE 1 : COVER ============ -->
<div class="page cover">
  <img class="logo-img" src="/static/logo.png?v=2">
  <div class="cover-mid">
    <div class="rule"></div>
    <div class="kind">Premium Analysis Report</div>
    <h1>성장잠재력<br>분석 보고서</h1>
    <div class="quote"><img class="slogan-img" src="/static/slogan_logo.png?v=2" alt="Physical is Data."></div>
  </div>
  <div class="cover-info">
    <div><span>분석 대상</span><b>신지오</b></div>
    <div><span>연령 / 학년</span><b>13세 · 중1</b></div>
    <div><span>종목 / 포지션</span><b>야구 · 내야수</b></div>
    <div><span>분석 기준일</span><b>2026.06.24</b></div>
  </div>
</div>
<div class="sheet">
<!-- ============ PAGE 2 : 목차 ============ -->
<div class="section">
  <div class="body">
    <div class="chapter"><span class="cn">목차</span><span class="ck">Contents</span></div>
    <h2>보고서 구성</h2>
    <p class="lead">본 보고서는 아이의 잠재력을 깨우기 위한 <b>5단계 스토리텔링</b>으로 전개됩니다. 타고난 기질(BioCode)을 정의한 뒤, 또래 대비 격차와 원인을 밝히고, 마지막에 100일의 행동 지침을 제시합니다.</p>
    <div class="toc-list" style="margin-top: 15px;">
      <div class="ti" style="margin-bottom: 12px;"><span class="n">1</span><span class="nm" style="font-size: 11pt; font-weight: 700;">BioCode 종합 진단 결과</span><span class="en">BioCode Diagnostic</span></div>
      <div class="ti" style="margin-bottom: 12px;"><span class="n">2</span><span class="nm" style="font-size: 11pt; font-weight: 700;">또래 선수 대비 격차 추적</span><span class="en">Benchmark Gap</span></div>
      <div class="ti" style="margin-bottom: 12px;"><span class="n">3</span><span class="nm" style="font-size: 11pt; font-weight: 700;">타고난 몸의 결 (유전 · 체질)</span><span class="en">Genetic Baseline</span></div>
      <div class="ti" style="margin-bottom: 12px;"><span class="n">4</span><span class="nm" style="font-size: 11pt; font-weight: 700;">생활 행동 3축 밸런스 (영양 · 수면 · 운동)</span><span class="en">Lifestyle Balance</span></div>
      <div class="ti" style="margin-bottom: 12px;"><span class="n">5</span><span class="nm" style="font-size: 11pt; font-weight: 700;">100일 격차 극복 스케줄 및 처방전</span><span class="en">100-Day Prescription</span></div>
    </div>

    <h3>분석 방법 <span class="kr">Methodology</span></h3>
    <p>피지컬업 333 엔진은 유전적 기준선 위에 현재의 신체 발달과 일상생활의 균형을 얹어 분석합니다. "타고난 예상치를 뛰어넘는 30%의 환경적 임계 돌파"가 우리의 분석 지향점입니다.</p>
    <div class="trio">
      <div class="it"><div class="ic">과거</div><h4>타고난 선천 분석</h4><p>부모 키(유전 잠재치 MPH) + 타고난 골격·대사 성향.</p></div>
      <div class="it"><div class="ic">현재</div><h4>지금의 대사 격차</h4><p>또래 평균군과의 체중·근육 편차 + 위장 소화 흡수력 상태.</p></div>
      <div class="it"><div class="ic">미래</div><h4>앞으로의 도약 처방</h4><p>격차를 좁혀 성장을 극대화하기 위한 100일 행동 처방.</p></div>
    </div>
    <div class="engine"><b>분석엔진 — 3축 입체 융합</b>설문, 인바디, 유전 데이터를 융합하여 27가지 BioCode 유형을 도출하고, 목표 대비 격차를 줄이기 위한 피지컬 최적화 타임라인을 제시합니다.</div>
  </div>
</div>
</div>
<div class="sheet">
<!-- ============ PAGE 7 : Ⅴ BioCode ============ -->
<div class="section">
  <div class="body">
    
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
                
            <g id="cube-1-1-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,109.0 382.5166604983954,122.0 360.0,135.0 337.4833395016046,122.0" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,122.0 360.0,135.0 360.0,161.0 337.4833395016046,148.0" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,135.0 382.5166604983954,122.0 382.5166604983954,148.0 360.0,161.0" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-1-1</title>
            </g>

            <g id="cube-1-1-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,70.0 382.5166604983954,83.0 360.0,96.0 337.4833395016046,83.0" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,83.0 360.0,96.0 360.0,122.0 337.4833395016046,109.0" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,96.0 382.5166604983954,83.0 382.5166604983954,109.0 360.0,122.0" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-1-2</title>
            </g>

            <g id="cube-1-1-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,31.0 382.5166604983954,44.0 360.0,57.0 337.4833395016046,44.0" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,44.0 360.0,57.0 360.0,83.0 337.4833395016046,70.0" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,57.0 382.5166604983954,44.0 382.5166604983954,70.0 360.0,83.0" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-1-3</title>
            </g>

            <g id="cube-1-2-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="323.9733432025673,129.8 346.49000370096275,142.8 323.9733432025673,155.8 301.4566827041719,142.8" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="301.4566827041719,142.8 323.9733432025673,155.8 323.9733432025673,181.8 301.4566827041719,168.8" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="323.9733432025673,155.8 346.49000370096275,142.8 346.49000370096275,168.8 323.9733432025673,181.8" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-2-1</title>
            </g>

            <g id="cube-1-2-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="323.9733432025673,90.80000000000001 346.49000370096275,103.80000000000001 323.9733432025673,116.80000000000001 301.4566827041719,103.80000000000001" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="301.4566827041719,103.80000000000001 323.9733432025673,116.80000000000001 323.9733432025673,142.8 301.4566827041719,129.8" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="323.9733432025673,116.80000000000001 346.49000370096275,103.80000000000001 346.49000370096275,129.8 323.9733432025673,142.8" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-2-2</title>
            </g>

            <g id="cube-1-2-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="323.9733432025673,51.80000000000001 346.49000370096275,64.80000000000001 323.9733432025673,77.80000000000001 301.4566827041719,64.80000000000001" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="301.4566827041719,64.80000000000001 323.9733432025673,77.80000000000001 323.9733432025673,103.80000000000001 301.4566827041719,90.80000000000001" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="323.9733432025673,77.80000000000001 346.49000370096275,64.80000000000001 346.49000370096275,90.80000000000001 323.9733432025673,103.80000000000001" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-2-3</title>
            </g>

            <g id="cube-1-3-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="287.9466864051347,150.6 310.4633469035301,163.6 287.9466864051347,176.6 265.4300259067393,163.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="265.4300259067393,163.6 287.9466864051347,176.6 287.9466864051347,202.6 265.4300259067393,189.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="287.9466864051347,176.6 310.4633469035301,163.6 310.4633469035301,189.6 287.9466864051347,202.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-3-1</title>
            </g>

            <g id="cube-1-3-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="287.9466864051347,111.6 310.4633469035301,124.6 287.9466864051347,137.6 265.4300259067393,124.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="265.4300259067393,124.6 287.9466864051347,137.6 287.9466864051347,163.6 265.4300259067393,150.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="287.9466864051347,137.6 310.4633469035301,124.6 310.4633469035301,150.6 287.9466864051347,163.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-3-2</title>
            </g>

            <g id="cube-1-3-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="287.9466864051347,72.6 310.4633469035301,85.6 287.9466864051347,98.6 265.4300259067393,85.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="265.4300259067393,85.6 287.9466864051347,98.6 287.9466864051347,124.6 265.4300259067393,111.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="287.9466864051347,98.6 310.4633469035301,85.6 310.4633469035301,111.6 287.9466864051347,124.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 1-3-3</title>
            </g>

            <g id="cube-2-1-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="396.0266567974327,129.8 418.5433172958281,142.8 396.0266567974327,155.8 373.50999629903725,142.8" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="373.50999629903725,142.8 396.0266567974327,155.8 396.0266567974327,181.8 373.50999629903725,168.8" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="396.0266567974327,155.8 418.5433172958281,142.8 418.5433172958281,168.8 396.0266567974327,181.8" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-1-1</title>
            </g>

            <g id="cube-2-1-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="396.0266567974327,90.80000000000001 418.5433172958281,103.80000000000001 396.0266567974327,116.80000000000001 373.50999629903725,103.80000000000001" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="373.50999629903725,103.80000000000001 396.0266567974327,116.80000000000001 396.0266567974327,142.8 373.50999629903725,129.8" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="396.0266567974327,116.80000000000001 418.5433172958281,103.80000000000001 418.5433172958281,129.8 396.0266567974327,142.8" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-1-2</title>
            </g>

            <g id="cube-2-1-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="396.0266567974327,51.80000000000001 418.5433172958281,64.80000000000001 396.0266567974327,77.80000000000001 373.50999629903725,64.80000000000001" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="373.50999629903725,64.80000000000001 396.0266567974327,77.80000000000001 396.0266567974327,103.80000000000001 373.50999629903725,90.80000000000001" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="396.0266567974327,77.80000000000001 418.5433172958281,64.80000000000001 418.5433172958281,90.80000000000001 396.0266567974327,103.80000000000001" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-1-3</title>
            </g>

            <g id="cube-2-2-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,150.6 382.5166604983954,163.6 360.0,176.6 337.4833395016046,163.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,163.6 360.0,176.6 360.0,202.6 337.4833395016046,189.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,176.6 382.5166604983954,163.6 382.5166604983954,189.6 360.0,202.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-2-1</title>
            </g>

            <g id="cube-2-2-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,111.6 382.5166604983954,124.6 360.0,137.6 337.4833395016046,124.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,124.6 360.0,137.6 360.0,163.6 337.4833395016046,150.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,137.6 382.5166604983954,124.6 382.5166604983954,150.6 360.0,163.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-2-2</title>
            </g>

            <g id="cube-2-2-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,72.6 382.5166604983954,85.6 360.0,98.6 337.4833395016046,85.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,85.6 360.0,98.6 360.0,124.6 337.4833395016046,111.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,98.6 382.5166604983954,85.6 382.5166604983954,111.6 360.0,124.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-2-3</title>
            </g>

            <g id="cube-2-3-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="323.9733432025673,171.4 346.49000370096275,184.4 323.9733432025673,197.4 301.4566827041719,184.4" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="301.4566827041719,184.4 323.9733432025673,197.4 323.9733432025673,223.4 301.4566827041719,210.4" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="323.9733432025673,197.4 346.49000370096275,184.4 346.49000370096275,210.4 323.9733432025673,223.4" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-3-1</title>
            </g>

            <g id="cube-2-3-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="323.9733432025673,132.4 346.49000370096275,145.4 323.9733432025673,158.4 301.4566827041719,145.4" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="301.4566827041719,145.4 323.9733432025673,158.4 323.9733432025673,184.4 301.4566827041719,171.4" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="323.9733432025673,158.4 346.49000370096275,145.4 346.49000370096275,171.4 323.9733432025673,184.4" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-3-2</title>
            </g>

            <g id="cube-2-3-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="323.9733432025673,93.4 346.49000370096275,106.4 323.9733432025673,119.4 301.4566827041719,106.4" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="301.4566827041719,106.4 323.9733432025673,119.4 323.9733432025673,145.4 301.4566827041719,132.4" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="323.9733432025673,119.4 346.49000370096275,106.4 346.49000370096275,132.4 323.9733432025673,145.4" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 2-3-3</title>
            </g>

            <g id="cube-3-1-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="432.0533135948653,150.6 454.5699740932607,163.6 432.0533135948653,176.6 409.5366530964699,163.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="409.5366530964699,163.6 432.0533135948653,176.6 432.0533135948653,202.6 409.5366530964699,189.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="432.0533135948653,176.6 454.5699740932607,163.6 454.5699740932607,189.6 432.0533135948653,202.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-1-1</title>
            </g>

            <g id="cube-3-1-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="432.0533135948653,111.6 454.5699740932607,124.6 432.0533135948653,137.6 409.5366530964699,124.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="409.5366530964699,124.6 432.0533135948653,137.6 432.0533135948653,163.6 409.5366530964699,150.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="432.0533135948653,137.6 454.5699740932607,124.6 454.5699740932607,150.6 432.0533135948653,163.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-1-2</title>
            </g>

            <g id="cube-3-1-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="432.0533135948653,72.6 454.5699740932607,85.6 432.0533135948653,98.6 409.5366530964699,85.6" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="409.5366530964699,85.6 432.0533135948653,98.6 432.0533135948653,124.6 409.5366530964699,111.6" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="432.0533135948653,98.6 454.5699740932607,85.6 454.5699740932607,111.6 432.0533135948653,124.6" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-1-3</title>
            </g>

            <g id="cube-3-2-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="396.0266567974327,171.4 418.5433172958281,184.4 396.0266567974327,197.4 373.50999629903725,184.4" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="373.50999629903725,184.4 396.0266567974327,197.4 396.0266567974327,223.4 373.50999629903725,210.4" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="396.0266567974327,197.4 418.5433172958281,184.4 418.5433172958281,210.4 396.0266567974327,223.4" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-2-1</title>
            </g>

            <g id="cube-3-2-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="396.0266567974327,132.4 418.5433172958281,145.4 396.0266567974327,158.4 373.50999629903725,145.4" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="373.50999629903725,145.4 396.0266567974327,158.4 396.0266567974327,184.4 373.50999629903725,171.4" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="396.0266567974327,158.4 418.5433172958281,145.4 418.5433172958281,171.4 396.0266567974327,184.4" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-2-2</title>
            </g>

            <g id="cube-3-2-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="396.0266567974327,93.4 418.5433172958281,106.4 396.0266567974327,119.4 373.50999629903725,106.4" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="373.50999629903725,106.4 396.0266567974327,119.4 396.0266567974327,145.4 373.50999629903725,132.4" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="396.0266567974327,119.4 418.5433172958281,106.4 418.5433172958281,132.4 396.0266567974327,145.4" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-2-3</title>
            </g>

            <g id="cube-3-3-1" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,192.2 382.5166604983954,205.2 360.0,218.2 337.4833395016046,205.2" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,205.2 360.0,218.2 360.0,244.2 337.4833395016046,231.2" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,218.2 382.5166604983954,205.2 382.5166604983954,231.2 360.0,244.2" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-3-1</title>
            </g>

            <g id="cube-3-3-2" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,153.2 382.5166604983954,166.2 360.0,179.2 337.4833395016046,166.2" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,166.2 360.0,179.2 360.0,205.2 337.4833395016046,192.2" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,179.2 382.5166604983954,166.2 382.5166604983954,192.2 360.0,205.2" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-3-2</title>
            </g>

            <g id="cube-3-3-3" class="cube-group" style="transition: all 0.3s ease;">
                <polygon points="360.0,114.19999999999999 382.5166604983954,127.19999999999999 360.0,140.2 337.4833395016046,127.19999999999999" class="cube-top" fill="#f4f7fa" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="337.4833395016046,127.19999999999999 360.0,140.2 360.0,166.2 337.4833395016046,153.2" class="cube-left" fill="#e9eff6" stroke="#d5dde8" stroke-width="0.8"/>
                <polygon points="360.0,140.2 382.5166604983954,127.19999999999999 382.5166604983954,153.2 360.0,166.2" class="cube-right" fill="#dee5ef" stroke="#d5dde8" stroke-width="0.8"/>
                <title>BioCode 3-3-3</title>
            </g>

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
"""

# 2. report_premium.html의 원본을 읽어 155번째 라인(display: flex; flex-direction: column; gap: 6px;) 이후를 추출
premium_file_path = "app/static/report_premium.html"
target_file_path = "app/static/report.html"

with open(premium_file_path, "r", encoding="utf-8") as f:
    premium_lines = f.readlines()

# 병합 지점 찾기 (155번째 라인 근처)
merge_index = -1
for idx, line in enumerate(premium_lines):
    if "display: flex; flex-direction: column; gap: 6px;" in line or "bc-user-persona-val" in line:
        # 이 라인 다음부터 가져오기
        merge_index = idx + 1
        break

if merge_index == -1:
    # 안전장치: 155번째 라인으로 강제 지정
    merge_index = 155

# 155번째 라인의 실제 뒷부분 텍스트
remaining_html = "".join(premium_lines[merge_index:])

# 완성형 코드로 조립
# display: flex; flex-d 로 잘린 부분에 맞춰 뒷부분을 메꿔서 이어 붙임
complete_html = user_html_prefix + "irection: column; gap: 6px;\">\n" + remaining_html

# 3. report.html 로 덮어쓰기 저장
with open(target_file_path, "w", encoding="utf-8") as f:
    f.write(complete_html)

print("SUCCESS: Merged user's custom HTML prefix with premium HTML suffix and saved to report.html!")
