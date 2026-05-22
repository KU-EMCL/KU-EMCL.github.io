# EMCL — 고려대학교 에너지물질순환연구실 홈페이지

Korea University · School of Mechanical Engineering
**Energy Materials Circulation Laboratory (EMCL)**

정적(static) HTML/CSS/JS 사이트입니다. 서버 없이 **GitHub Pages**로 바로 배포됩니다.

---

## 1. 폴더 구조

```
emcl-lab/
├── index.html              ← 메인(홈)
├── css/
│   └── style.css           ← 전체 디자인 시스템 (색·폰트·레이아웃·게시판 스타일)
├── js/
│   ├── main.js             ← 공통 헤더/푸터/내비게이션 자동 삽입, 스크롤 효과
│   ├── seed-posts.js       ← ★ 발행된(모두에게 보이는) 게시글·사진 데이터
│   └── board.js            ← 게시판/갤러리 엔진 (글쓰기·검색·관리자)
├── pages/                  ← 하위 페이지들
│   ├── introduction.html   연구실 소개
│   ├── research.html       연구 분야
│   ├── professor.html      교수 소개
│   ├── members.html        연구원
│   ├── alumni.html         졸업생
│   ├── lectures.html       강의
│   ├── publications.html   논문
│   ├── patents.html        특허
│   ├── project.html        연구 과제
│   ├── community.html      게시판
│   ├── gallery.html        갤러리
│   └── contact.html        오시는 길
├── images/                 ← 교수·연구원 사진 등 직접 넣는 이미지
└── .github/workflows/
    └── deploy.yml          ← GitHub Pages 자동 배포 설정 (그대로 두세요)
```

---

## 2. 배포 방법 (GitHub Pages)

1. 이 폴더 전체를 GitHub 저장소의 **main** 브랜치에 올립니다(commit & push).
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
3. push 할 때마다 자동으로 다시 배포됩니다. 주소는 Actions 탭 또는 Settings → Pages에서 확인할 수 있습니다.

> 로컬에서 미리 보려면 폴더에서 `python3 -m http.server` 실행 후 브라우저로 `http://localhost:8000` 접속.

---

## 3. 게시판(Community)·갤러리 동작 방식 ★ 중요

이 사이트는 서버·데이터베이스가 없습니다. 그래서 게시판은 **두 단계**로 동작합니다.

**(A) 모두에게 보이는 글 = `js/seed-posts.js` 파일**
이 파일에 들어 있는 글과 사진은 사이트에 접속하는 **모든 사람**에게 보입니다.
공개 글은 결국 이 파일에 들어가 있어야 합니다.

**(B) 내가 새로 쓴 글 = 내 브라우저에만 임시 저장(localStorage)**
게시판에서 "글쓰기"로 작성한 글이나 갤러리에 올린 사진은, 우선 **글을 쓴 그 브라우저에만** 저장됩니다. 다른 사람·다른 기기에서는 아직 보이지 않습니다.

### 새 글을 "진짜로 공개"하는 절차
1. 게시판 우측 상단 **관리자 로그인** → 비밀번호 입력(아래 4번 참고).
2. **글쓰기**로 공지/소식/사진을 작성합니다. (이 시점엔 내 브라우저에만 저장됨)
3. 툴바의 **발행 파일 내보내기** 버튼을 누르면 `seed-posts.js` 파일이 새로 다운로드됩니다.
4. 그 파일을 저장소의 `js/seed-posts.js` 자리에 덮어쓰기 하고 commit & push 합니다.
5. 배포가 끝나면 모든 방문자에게 해당 글/사진이 보입니다.

> 요약: **글쓰기 → 발행 파일 내보내기 → js/seed-posts.js 교체 → push.**
> 이 과정을 거치지 않은 글은 "내 브라우저에서만" 보이는 임시 글입니다.

`백업 가져오기`(JSON) 기능으로 다른 기기에서 작성하던 임시 글을 옮겨올 수도 있습니다.

---

## 4. 관리자 비밀번호 변경

`js/board.js` 맨 위:

```js
var ADMIN_PASSWORD = "emcl2025";   // ← 이 값을 바꾸세요
```

⚠️ 이 비밀번호는 브라우저(클라이언트)에서 확인하는 방식이라, 소스를 보면 누구나 알 수 있습니다. **소규모 연구실 사이트의 글쓰기 잠금 용도**일 뿐 실제 보안 장치가 아닙니다. 외부 침입을 막아야 한다면 5번의 Firebase 방식을 권장합니다.

---

## 5. (선택) 진짜 실시간 공용 게시판으로 업그레이드

여러 사람이 각자 글을 올리고 즉시 모두에게 보이게 하려면, 무료 백엔드인
**Firebase Firestore**를 붙이면 됩니다. (가입 → 프로젝트 생성 → 웹 SDK 키 입력 →
`board.js`의 localStorage 부분을 Firestore 읽기/쓰기로 교체.)
원하시면 이 구조에 맞춘 Firebase 연동 코드를 추가로 만들어 드릴 수 있습니다.

---

## 6. 내용 수정 가이드

| 바꾸고 싶은 것 | 수정할 파일 |
|---|---|
| 메뉴(내비게이션) 항목·순서 | `js/main.js` 상단 `NAV` 부분 (전 페이지 자동 반영) |
| 푸터 주소·연락처 | `js/main.js` 푸터 부분 |
| 연구원 추가/수정 | `pages/members.html` 의 `member-card` 블록 복사·수정 |
| 졸업생 | `pages/alumni.html` 표(`lab-table`) 행 추가 |
| 논문 | `pages/publications.html` 의 `pub-row` 추가 (`data-type="journal"` 또는 `"conference"`) |
| 특허 | `pages/patents.html` 표 행 추가 |
| 연구 과제 | `pages/project.html` 의 `proj-card` 추가 |
| 교수 정보·사진 | `pages/professor.html` (사진은 `images/`에 넣고 주석 처리된 `<img>`로 교체) |
| 색·폰트 등 디자인 | `css/style.css` 최상단 `:root` 변수 |
| 지도 | `pages/contact.html` 의 `iframe`을 Google/Kakao 지도 임베드로 교체 |

### 사진(교수·연구원) 넣기
1. 이미지를 `images/` 폴더에 넣습니다. (예: `images/professor.jpg`)
2. 해당 페이지에서 회색 SVG 자리표시자(placeholder) 대신 주석 처리된 `<img>` 줄을 사용합니다.
   예) `professor.html`의 `<!-- 사진 교체: <img src="../images/professor.jpg" alt="교수 사진"> -->`

---

## 7. 디자인 메모

- 색: 따뜻한 아이보리 종이 바탕 + 고려대 크림슨(#8A1538) + 순환/지속가능성 틸 그린 + 골드 포인트.
- 글꼴: Fraunces(영문 제목 세리프), Noto Serif KR(국문 제목), Noto Sans KR(본문), Spline Sans Mono(라벨/기술 텍스트). 모두 Google Fonts에서 자동 로드됩니다.
- 모든 페이지는 `js/main.js`가 공통 헤더·푸터·모바일 메뉴를 자동으로 삽입하므로, 페이지 본문만 관리하면 됩니다.
