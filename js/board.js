/* ============================================================
   EMCL — 게시판 / 홈 최신소식 (읽기 전용)
   ------------------------------------------------------------
   • 게시글은 js/seed-posts.js 의 EMCL_SEED_POSTS 배열에 들어
     있습니다. 글을 추가·수정·삭제하려면 그 파일을 GitHub에서
     직접 고쳐 커밋하세요. (브라우저에서 글을 쓰는 기능은 없으며,
     비밀번호/로그인도 없습니다.)
   • 이 파일은 그 데이터를 화면에 보여 주기만 합니다.
   • 갤러리 사진은 js/gallery-data.js 에서 관리합니다.
   ============================================================ */
(function () {
  "use strict";

  var PER_PAGE = 10;
  var CATS = { notice: "공지", seminar: "세미나", news: "소식", general: "일반" };

  /* ---------- 헬퍼 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  /* ---------- 라이트박스 (게시글 이미지 확대) ---------- */
  function lightbox(src) {
    var lb = el("div", "lightbox");
    lb.innerHTML = '<button class="lb-close">&times;</button>';
    var img = el("img"); img.src = src; lb.appendChild(img);
    document.body.appendChild(lb);
    requestAnimationFrame(function () { lb.classList.add("open"); });
    function done() { lb.classList.remove("open"); setTimeout(function () { lb.remove(); }, 250); }
    lb.addEventListener("click", function (e) { if (e.target !== img) done(); });
  }

  /* ============================================================
     게시글 데이터 (seed-posts.js 에서 읽기)
     ============================================================ */
  function getPosts() {
    var all = (window.EMCL_SEED_POSTS || []).slice();
    all.sort(function (a, b) {
      if ((b.pinned ? 1 : 0) !== (a.pinned ? 1 : 0)) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return (b.date || "").localeCompare(a.date || "");
    });
    return all;
  }

  /* ============================================================
     게시판
     ============================================================ */
  function initBoard(mount) {
    var state = { page: 1, q: "" };

    function header() {
      var bar = el("div", "board-toolbar");
      var search = el("div", "board-search",
        '<svg viewBox="0 0 24 24"><path d="M21 21l-4.3-4.3M19 11a8 8 0 11-16 0 8 8 0 0116 0z" fill="none" stroke="currentColor" stroke-width="2"/></svg>');
      var input = el("input"); input.type = "text"; input.placeholder = "제목·내용 검색"; input.value = state.q;
      input.addEventListener("input", function () { state.q = input.value; state.page = 1; renderList(); });
      search.appendChild(input);
      bar.appendChild(search);
      return bar;
    }

    function renderList() {
      mount.innerHTML = "";
      mount.appendChild(header());

      var posts = getPosts();
      if (state.q) {
        var q = state.q.toLowerCase();
        posts = posts.filter(function (p) {
          return (p.title + " " + p.content + " " + p.author).toLowerCase().indexOf(q) > -1;
        });
      }

      var total = posts.length;
      var pages = Math.max(1, Math.ceil(total / PER_PAGE));
      if (state.page > pages) state.page = pages;
      var slice = posts.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);

      var list = el("div", "board-list");
      list.appendChild(el("div", "board-row head",
        '<span class="b-no">No</span><span class="b-cat">분류</span><span class="b-title">제목</span><span class="b-author">작성자</span><span class="b-date">날짜</span>'));

      if (!slice.length) {
        list.appendChild(el("div", "board-empty", "게시글이 없습니다."));
      } else {
        slice.forEach(function (p, i) {
          var no = total - ((state.page - 1) * PER_PAGE) - i;
          var row = el("div", "board-row");
          var clip = (p.images && p.images.length) ? ' <span class="clip">' + p.images.length + '</span>' : "";
          var pin = p.pinned ? '<span class="pin">★</span> ' : "";
          row.innerHTML =
            '<span class="b-no always">' + (p.pinned ? "★" : no) + '</span>' +
            '<span class="b-cat ' + p.category + '">' + (CATS[p.category] || "일반") + '</span>' +
            '<span class="b-title">' + pin + esc(p.title) + clip + '</span>' +
            '<span class="b-author">' + esc(p.author || "관리자") + '</span>' +
            '<span class="b-date">' + esc(p.date) + '</span>';
          row.addEventListener("click", function () { renderDetail(p.id); });
          list.appendChild(row);
        });
      }
      mount.appendChild(list);

      // 페이지 이동
      var pager = el("div", "board-pager");
      var prev = el("button", "", "‹"); prev.disabled = state.page === 1;
      prev.addEventListener("click", function () { state.page--; renderList(); window.scrollTo({ top: mount.offsetTop - 120, behavior: "smooth" }); });
      pager.appendChild(prev);
      for (var n = 1; n <= pages; n++) {
        (function (n) {
          var b = el("button", n === state.page ? "active" : "", n);
          b.addEventListener("click", function () { state.page = n; renderList(); window.scrollTo({ top: mount.offsetTop - 120, behavior: "smooth" }); });
          pager.appendChild(b);
        })(n);
      }
      var next = el("button", "", "›"); next.disabled = state.page === pages;
      next.addEventListener("click", function () { state.page++; renderList(); window.scrollTo({ top: mount.offsetTop - 120, behavior: "smooth" }); });
      pager.appendChild(next);
      mount.appendChild(pager);
    }

    function renderDetail(id) {
      var posts = getPosts();
      var p = posts.filter(function (x) { return x.id === id; })[0];
      if (!p) { renderList(); return; }

      mount.innerHTML = "";
      var wrap = el("div", "post-detail");
      var head = el("div", "post-head",
        '<span class="b-cat ' + p.category + '">' + (CATS[p.category] || "일반") + '</span>' +
        '<h2>' + esc(p.title) + '</h2>' +
        '<div class="meta"><span>작성자 ' + esc(p.author || "관리자") + '</span><span>' + esc(p.date) + '</span></div>');
      wrap.appendChild(head);

      var content = el("div", "post-content"); content.textContent = p.content || "";
      wrap.appendChild(content);

      if (p.images && p.images.length) {
        var imgs = el("div", "post-images");
        p.images.forEach(function (src) {
          var im = el("img"); im.src = src; im.loading = "lazy";
          im.addEventListener("click", function () { lightbox(src); });
          imgs.appendChild(im);
        });
        wrap.appendChild(imgs);
      }

      var foot = el("div", "post-foot");
      var back = el("button", "btn btn-ghost btn-sm", "‹ 목록");
      back.addEventListener("click", renderList);
      foot.appendChild(back);
      wrap.appendChild(foot);

      mount.appendChild(wrap);
      window.scrollTo({ top: mount.offsetTop - 120, behavior: "smooth" });
    }

    renderList();
  }

  /* ============================================================
     부팅
     ============================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("board");
    if (b) initBoard(b);

    // 홈 화면 최신 소식
    var feed = document.getElementById("home-news");
    if (feed) {
      var prefix = (document.body.dataset.depth === "1") ? "" : "pages/";
      getPosts().slice(0, 5).forEach(function (p) {
        var a = el("a", "feed-item");
        a.href = prefix + "community.html";
        a.innerHTML = '<span class="tag' + (p.category === "seminar" ? " acc" : "") + '">' + (CATS[p.category] || "일반") +
          '</span><span class="ti">' + esc(p.title) + '</span><span class="dt">' + esc(p.date) + '</span>';
        feed.appendChild(a);
      });
    }
  });
})();
