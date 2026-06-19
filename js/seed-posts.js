/* ============================================================
   EMCL — 게시판 공개 콘텐츠 (모든 방문자에게 표시됨)
   ------------------------------------------------------------
   이 파일이 게시판(News & Notice)에 보이는 글 목록입니다.
   방문자의 브라우저는 이 파일을 그대로 읽어 화면에 보여 줍니다.

   ── 글을 추가·수정·삭제하는 방법 (GitHub에서 직접 편집) ──
     1. 아래 EMCL_SEED_POSTS 배열에서 항목을 고치거나,
        새 항목 { ... } 을 넣거나 빼세요.
     2. 변경 내용을 커밋(commit) 후 푸시(push)합니다.
     3. GitHub Pages 재배포가 끝나면 모두에게 반영됩니다.

   ── 글 항목 형식 ──
     {
       id:       "p11",          // 다른 글과 겹치지 않는 고유값
       category: "notice",       // notice | seminar | news | general
       pinned:   false,          // 상단 고정 여부 (true / false)
       title:    "제목",
       author:   "관리자",
       date:     "2026.06.19",   // YYYY.MM.DD 형식
       content:  "본문 내용. 줄을 바꾸려면 \n 을 넣으세요.",
       images:   []              // 보통은 비워 둡니다
     }

   ※ 정렬은 자동입니다 — 고정(pinned) 글이 먼저, 그다음 날짜 내림차순.
   ※ 갤러리 사진은 이 파일이 아니라 js/gallery-data.js 에서 관리합니다.
   ============================================================ */
window.EMCL_SEED_POSTS = [
  { id: "p10", category: "notice",  pinned: true,
    title: "2027년 신입 연구원 모집 공고",
    author: "관리자", date: "2026.05.26",
    content: "에너지물질순환연구실(EMCL)에서 2027학년도 신입 대학원생(석사·박사) 및 학부연구생을 모집합니다.\n\n· 모집 분야: 플러스에너지빌딩, CO₂ 포집·활용, 차세대 히트펌프, 열관리·에너지 하베스팅\n· 지원 자격: 기계공학·화학공학·재료공학 등 관련 전공\n· 문의: ytkang@korea.ac.kr\n\n연구에 열정이 있는 분들의 많은 지원 바랍니다.",
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
];
