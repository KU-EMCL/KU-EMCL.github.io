# EMCL - Energy Materials Circulation Laboratory

고려대학교 에너지물질순환연구실 공식 홈페이지

## 프로젝트 구조

```
emcl-lab/
├── index.html              # 메인 홈페이지
├── css/
│   └── style.css           # 전체 스타일시트
├── js/
│   └── main.js             # 슬라이더, 네비게이션 등 인터랙션
├── images/                 # 이미지 파일 (직접 추가)
└── pages/
    ├── introduction.html   # 연구실 소개
    ├── research.html       # 연구 분야
    ├── professor.html      # 교수 소개
    ├── members.html        # 연구원 소개
    ├── alumni.html         # 졸업생
    ├── lectures.html       # 강의
    ├── publications.html   # 논문
    ├── patents.html        # 특허
    ├── project.html        # 연구 과제
    ├── community.html      # 공지사항
    ├── gallery.html        # 갤러리
    └── contact.html        # 오시는 길
```

## GitHub Pages 배포 방법

### 1단계: GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인합니다.
2. 우측 상단 **+** 버튼 → **New repository** 클릭
3. Repository name: `emcl-lab` (또는 원하는 이름)
4. **Public** 선택 (GitHub Pages 무료 사용)
5. **Create repository** 클릭

### 2단계: 코드 업로드

```bash
# 로컬에서 Git 초기화
git init
git add .
git commit -m "Initial commit: EMCL lab website"

# GitHub 원격 저장소 연결 (본인 계정으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/emcl-lab.git
git branch -M main
git push -u origin main
```

### 3단계: GitHub Pages 활성화

1. 저장소 페이지에서 **Settings** 탭 클릭
2. 좌측 메뉴 **Pages** 클릭
3. **Source** → **Deploy from a branch** 선택
4. **Branch** → `main` / `/ (root)` 선택 후 **Save**
5. 약 1~2분 후 `https://YOUR_USERNAME.github.io/emcl-lab/` 에서 접속 가능

### 커스텀 도메인 설정 (선택)

1. **Pages** 설정에서 **Custom domain** 입력
2. DNS 설정에서 CNAME 레코드 추가: `YOUR_USERNAME.github.io`

## 콘텐츠 수정 방법

### 교수 정보 수정
`pages/professor.html` 파일에서 이름, 소속, 연락처 등을 수정합니다.

### 연구원 추가/수정
`pages/members.html` 파일에서 `.member-card` 블록을 복사하여 추가합니다.

### 논문 추가
`pages/publications.html` 파일에서 `.pub-item` 블록을 추가합니다.

### 공지사항 추가
`pages/community.html` 파일의 `<tbody>` 내에 `<tr>` 행을 추가합니다.

### 이미지 교체
`images/` 폴더에 이미지를 추가하고 HTML에서 경로를 참조합니다.

예시:
```html
<img src="../images/professor.jpg" alt="교수 사진" />
```

### 색상 테마 변경
`css/style.css` 상단의 CSS 변수를 수정합니다:
```css
:root {
  --color-primary:    #8b0000;  /* 주 색상 (진한 빨강) */
  --color-accent:     #c0392b;  /* 강조 색상 */
}
```

## 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - CSS Grid, Flexbox, CSS 변수, 반응형 디자인
- **Vanilla JavaScript** - 슬라이더, 모바일 네비게이션
- **Google Fonts** - Noto Sans KR, Roboto

## 브라우저 지원

- Chrome, Edge, Firefox, Safari (최신 버전)
- 모바일: iOS Safari, Android Chrome

---

문의: emcl@korea.ac.kr
