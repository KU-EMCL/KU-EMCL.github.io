/* ============================================================
   EMCL — Published content (visible to EVERYONE)
   ------------------------------------------------------------
   This file holds the board posts and gallery photos that are
   "published" for all visitors. It is loaded by every browser.

   HOW TO PUBLISH NEW CONTENT FOR EVERYONE:
     1. Open 게시판 / 갤러리 on the site.
     2. Log in as admin (관리자), write a post or add photos.
        (These are saved only in YOUR browser at first.)
     3. Click "발행 파일 내보내기" → downloads a new seed-posts.js.
     4. Replace this file with the downloaded one and commit / push.
     5. After GitHub Pages redeploys, everyone sees the new content.

   You can also just hand-edit the arrays below.
   Dates use the format "YYYY.MM.DD".
   ============================================================ */

window.EMCL_SEED_POSTS = [
  { id: "p10", category: "notice",  pinned: true,
    title: "2024년 신입 연구원 모집 공고",
    author: "관리자", date: "2024.11.01",
    content: "에너지물질순환연구실(EMCL)에서 2025학년도 신입 대학원생(석사·박사) 및 학부연구생을 모집합니다.\n\n· 모집 분야: 플러스에너지빌딩, CO₂ 포집·활용, 차세대 히트펌프, 열관리·에너지 하베스팅\n· 지원 자격: 기계공학·화학공학·재료공학 등 관련 전공\n· 문의: ytkang@korea.ac.kr\n\n연구에 열정이 있는 분들의 많은 지원 바랍니다.",
    images: [] },
  { id: "p9", category: "seminar", pinned: false,
    title: "국제 학술대회 논문 발표 안내",
    author: "관리자", date: "2024.10.15",
    content: "국제 학술대회에서 본 연구실의 플러스에너지빌딩 및 솝션 열배터리 연구 결과를 발표합니다.\n\n· 발표 주제: Sorption thermal battery integrated with heat pump for plus energy buildings",
    images: [] },
  { id: "p8", category: "news", pinned: false,
    title: "고려대 플러스에너지빌딩 연구센터 성과 발표회",
    author: "관리자", date: "2024.09.20",
    content: "플러스에너지빌딩(PEB) 혁신기술연구센터(ERC)의 연간 성과 발표회가 개최되었습니다. 본 연구실은 솝션 열배터리 및 고밀도 축열 시스템 부문 성과를 공유하였습니다.",
    images: [] },
  { id: "p7", category: "seminar", pinned: false,
    title: "연구실 세미나 일정 안내 (2024년 2학기)",
    author: "관리자", date: "2024.09.01",
    content: "2024학년도 2학기 연구실 정기 세미나는 매주 금요일 오후 2시에 진행됩니다. 발표 순서 및 주제는 내부 공유 문서를 참고해 주세요.",
    images: [] },
  { id: "p6", category: "news", pinned: false,
    title: "졸업생 취업 현황 업데이트",
    author: "관리자", date: "2024.08.20",
    content: "2024년 졸업생들의 진로 현황을 업데이트하였습니다. 자세한 내용은 Members > 졸업생 페이지를 참고해 주세요.",
    images: [] },
  { id: "p5", category: "news", pinned: false,
    title: "2024년 1학기 우수 연구원 시상",
    author: "관리자", date: "2024.07.05",
    content: "2024년 1학기 우수 연구 성과를 거둔 연구원들에 대한 시상이 진행되었습니다. 축하드립니다.",
    images: [] },
  { id: "p4", category: "seminar", pinned: false,
    title: "한국기계학회 춘계 학술대회 발표 결과",
    author: "관리자", date: "2024.05.20",
    content: "한국기계학회(KSME) 춘계 학술대회에서 본 연구실 연구원들이 다수의 논문을 발표하였습니다.",
    images: [] },
  { id: "p3", category: "news", pinned: false,
    title: "신규 연구 과제 수주 안내",
    author: "관리자", date: "2024.04.10",
    content: "직접 공기 포집(DAC) 및 CO₂ 활용 시스템 개발 연구 과제를 신규 수주하였습니다. 대기 중 CO₂ 포집과 물 하베스팅을 연계하는 통합 모듈을 개발할 예정입니다.",
    images: [] },
  { id: "p2", category: "notice", pinned: false,
    title: "연구실 홈페이지 리뉴얼 안내",
    author: "관리자", date: "2024.03.01",
    content: "연구실 홈페이지가 새롭게 단장되었습니다. 게시판 및 갤러리 기능이 추가되어 연구실 소식을 더욱 편리하게 확인하실 수 있습니다.",
    images: [] },
  { id: "p1", category: "notice", pinned: false,
    title: "2024년 신학기 연구실 오리엔테이션",
    author: "관리자", date: "2024.02.28",
    content: "2024학년도 신학기 연구실 오리엔테이션을 진행합니다. 신규 구성원의 많은 참여 바랍니다.",
    images: [] }
];

window.EMCL_SEED_GALLERY = [
  { id: "g1", title: "연구실 전경", date: "2024", color: "linear-gradient(135deg,#8A1538,#A52B4E)", src: "" },
  { id: "g2", title: "실험실 연구", date: "2024", color: "linear-gradient(135deg,#1F5048,#2C6E63)", src: "" },
  { id: "g3", title: "국제학술대회 발표", date: "2024", color: "linear-gradient(135deg,#7a5a16,#B0832B)", src: "" },
  { id: "g4", title: "연구실 MT",  date: "2024", color: "linear-gradient(135deg,#5d3a1a,#9a6a2e)", src: "" },
  { id: "g5", title: "정기 세미나", date: "2024", color: "linear-gradient(135deg,#3a2233,#6b3450)", src: "" },
  { id: "g6", title: "2024 졸업식", date: "2024", color: "linear-gradient(135deg,#1a3340,#2e6b80)", src: "" },
  { id: "g7", title: "신규 장비 설치", date: "2024", color: "linear-gradient(135deg,#2e4057,#48907f)", src: "" },
  { id: "g8", title: "우수논문상 수상", date: "2024", color: "linear-gradient(135deg,#4a2c1a,#8a5a3a)", src: "" }
];
