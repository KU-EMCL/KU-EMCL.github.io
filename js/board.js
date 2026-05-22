/* ============================================================
   EMCL — Board & Gallery engine (client-side, no server)
   ------------------------------------------------------------
   • Published content lives in js/seed-posts.js (committed → seen
     by everyone). New posts/photos you write are stored in THIS
     browser (localStorage) until you "발행 파일 내보내기" and commit.
   • Admin password gates writing/deleting. It is client-side only
     (anyone reading the source can find it) — fine for a small lab
     site, not real security. Change ADMIN_PASSWORD below.
   ============================================================ */
(function () {
  "use strict";

  var ADMIN_PASSWORD = "emcl2025";          // ← change this
  var LS_POSTS   = "emcl_board_v1";
  var LS_GALLERY = "emcl_gallery_v1";
  var SS_ADMIN   = "emcl_admin";
  var PER_PAGE   = 10;

  /* ---------- tiny helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function todayStr() { var d = new Date(); var p = function (n) { return (n < 10 ? "0" : "") + n; }; return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()); }
  function load(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { toast("저장 공간이 부족합니다. 이미지를 줄여 주세요."); return false; } }
  function isAdmin() { return sessionStorage.getItem(SS_ADMIN) === "1"; }
  function setAdmin(v) { if (v) sessionStorage.setItem(SS_ADMIN, "1"); else sessionStorage.removeItem(SS_ADMIN); }
  var CATS = { notice: "공지", seminar: "세미나", news: "소식", general: "일반" };

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = el("div", "toast"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  /* ---------- image downscale ---------- */
  function fileToDataURL(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1280, w = img.width, h = img.height;
        if (w > max || h > max) { var r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
        var c = el("canvas"); c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { cb(reader.result); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------- modal / lightbox ---------- */
  function modal(titleText, bodyNode, footNode) {
    var bd = el("div", "modal-backdrop");
    var m = el("div", "modal");
    var head = el("div", "m-head", '<h3>' + esc(titleText) + '</h3>');
    var close = el("button", "m-close", "&times;");
    head.appendChild(close);
    var bodyWrap = el("div", "m-body"); bodyWrap.appendChild(bodyNode);
    m.appendChild(head); m.appendChild(bodyWrap);
    if (footNode) { var f = el("div", "m-foot"); f.appendChild(footNode); m.appendChild(f); }
    bd.appendChild(m); document.body.appendChild(bd);
    requestAnimationFrame(function () { bd.classList.add("open"); });
    function done() { bd.classList.remove("open"); setTimeout(function () { bd.remove(); }, 250); }
    close.addEventListener("click", done);
    bd.addEventListener("click", function (e) { if (e.target === bd) done(); });
    return { close: done, root: m };
  }
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
     BOARD
     ============================================================ */
  function getPosts() {
    var seed = (window.EMCL_SEED_POSTS || []).map(function (p) { p._src = "seed"; return p; });
    var local = load(LS_POSTS).map(function (p) { p._src = "local"; return p; });
    var byId = {}; var all = [];
    local.concat(seed).forEach(function (p) { if (!byId[p.id]) { byId[p.id] = 1; all.push(p); } });
    all.sort(function (a, b) {
      if ((b.pinned ? 1 : 0) !== (a.pinned ? 1 : 0)) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return (b.date || "").localeCompare(a.date || "");
    });
    return all;
  }

  function initBoard(mount) {
    var state = { page: 1, q: "" };

    function header() {
      var bar = el("div", "board-toolbar");
      var search = el("div", "board-search",
        '<svg viewBox="0 0 24 24"><path d="M21 21l-4.3-4.3M19 11a8 8 0 11-16 0 8 8 0 0116 0z" fill="none" stroke="currentColor" stroke-width="2"/></svg>');
      var input = el("input"); input.type = "text"; input.placeholder = "제목·내용 검색"; input.value = state.q;
      input.addEventListener("input", function () { state.q = input.value; state.page = 1; renderList(); });
      search.appendChild(input);

      var actions = el("div", "board-actions");
      var dot = el("span", "admin-dot" + (isAdmin() ? " on" : ""), '<i></i>' + (isAdmin() ? "관리자 모드" : "방문자 모드"));
      actions.appendChild(dot);

      if (isAdmin()) {
        var write = el("button", "btn btn-primary btn-sm", "글쓰기");
        write.addEventListener("click", openWrite);
        var exp = el("button", "btn btn-ghost btn-sm", "발행 파일 내보내기");
        exp.addEventListener("click", exportSeed);
        var imp = el("button", "btn btn-ghost btn-sm", "백업 가져오기");
        imp.addEventListener("click", importJSON);
        var out = el("button", "btn btn-ghost btn-sm", "로그아웃");
        out.addEventListener("click", function () { setAdmin(false); toast("로그아웃되었습니다."); renderList(); });
        actions.appendChild(write); actions.appendChild(exp); actions.appendChild(imp); actions.appendChild(out);
      } else {
        var login = el("button", "btn btn-ghost btn-sm", "관리자 로그인");
        login.addEventListener("click", openLogin);
        actions.appendChild(login);
      }
      bar.appendChild(search); bar.appendChild(actions);
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
          var clip = (p.images && p.images.length) ? ' <span class="clip">📎' + p.images.length + '</span>' : "";
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

      // pager
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
        '<div class="meta"><span>작성자 ' + esc(p.author || "관리자") + '</span><span>' + esc(p.date) + '</span>' +
        (p._src === "local" ? '<span style="color:var(--accent)">· 이 브라우저에만 저장됨</span>' : "") + '</div>');
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
      if (isAdmin()) {
        var right = el("div", "board-actions");
        var edit = el("button", "btn btn-ghost btn-sm", "수정");
        edit.addEventListener("click", function () { openWrite(p); });
        var del = el("button", "btn btn-primary btn-sm", "삭제");
        del.addEventListener("click", function () {
          if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
          if (p._src === "seed") { toast("발행된 글입니다. seed-posts.js에서 삭제 후 커밋하세요."); return; }
          var local = load(LS_POSTS).filter(function (x) { return x.id !== id; });
          save(LS_POSTS, local); toast("삭제되었습니다."); renderList();
        });
        right.appendChild(edit); right.appendChild(del);
        foot.appendChild(right);
      }
      wrap.appendChild(foot);
      mount.appendChild(wrap);
      window.scrollTo({ top: mount.offsetTop - 120, behavior: "smooth" });
    }

    /* ----- write / edit ----- */
    function openWrite(existing) {
      var form = el("div");
      var pending = (existing && existing.images) ? existing.images.slice() : [];
      form.innerHTML =
        '<div class="field-row">' +
          '<div class="field"><label>분류</label><select id="f-cat">' +
            Object.keys(CATS).map(function (k) { return '<option value="' + k + '"' + (existing && existing.category === k ? " selected" : "") + '>' + CATS[k] + '</option>'; }).join("") +
          '</select></div>' +
          '<div class="field"><label>작성자</label><input id="f-author" value="' + esc(existing ? existing.author : "관리자") + '"></div>' +
        '</div>' +
        '<div class="field"><label><input type="checkbox" id="f-pin" style="width:auto;margin-right:8px"' + (existing && existing.pinned ? " checked" : "") + '> 상단 고정</label></div>' +
        '<div class="field"><label>제목</label><input id="f-title" value="' + esc(existing ? existing.title : "") + '"></div>' +
        '<div class="field"><label>내용</label><textarea id="f-content">' + esc(existing ? existing.content : "") + '</textarea></div>' +
        '<div class="field"><label>이미지 첨부</label><div class="file-drop" id="f-drop">클릭하거나 이미지를 끌어다 놓으세요 (자동으로 압축됩니다)</div>' +
          '<input type="file" id="f-file" accept="image/*" multiple hidden>' +
          '<div class="file-previews" id="f-prev"></div>' +
          '<div class="form-note">이미지는 이 브라우저에 저장됩니다. 모두에게 공개하려면 "발행 파일 내보내기" 후 커밋하세요.</div></div>';

      var m = modal(existing ? "글 수정" : "새 글 작성", form, makeFoot());
      var drop = $("#f-drop", form), file = $("#f-file", form), prev = $("#f-prev", form);

      function drawPrev() {
        prev.innerHTML = "";
        pending.forEach(function (src, idx) {
          var fp = el("div", "fp"); var im = el("img"); im.src = src; fp.appendChild(im);
          var x = el("button", "", "×"); x.addEventListener("click", function () { pending.splice(idx, 1); drawPrev(); });
          fp.appendChild(x); prev.appendChild(fp);
        });
      }
      drawPrev();
      function addFiles(files) {
        Array.prototype.forEach.call(files, function (f) {
          if (!/^image\//.test(f.type)) return;
          fileToDataURL(f, function (d) { pending.push(d); drawPrev(); });
        });
      }
      drop.addEventListener("click", function () { file.click(); });
      file.addEventListener("change", function () { addFiles(file.files); file.value = ""; });
      drop.addEventListener("dragover", function (e) { e.preventDefault(); drop.style.borderColor = "var(--crimson)"; });
      drop.addEventListener("dragleave", function () { drop.style.borderColor = ""; });
      drop.addEventListener("drop", function (e) { e.preventDefault(); drop.style.borderColor = ""; addFiles(e.dataTransfer.files); });

      function makeFoot() {
        var f = el("div", "board-actions");
        var cancel = el("button", "btn btn-ghost btn-sm", "취소");
        var submit = el("button", "btn btn-primary btn-sm", existing ? "수정 저장" : "등록");
        f.appendChild(cancel); f.appendChild(submit);
        // bind after modal exists
        setTimeout(function () {
          cancel.addEventListener("click", function () { m.close(); });
          submit.addEventListener("click", function () {
            var title = $("#f-title", form).value.trim();
            if (!title) { toast("제목을 입력하세요."); return; }
            var post = {
              id: existing ? existing.id : "u" + Date.now(),
              category: $("#f-cat", form).value,
              author: $("#f-author", form).value.trim() || "관리자",
              pinned: $("#f-pin", form).checked,
              title: title,
              content: $("#f-content", form).value,
              date: existing ? existing.date : todayStr(),
              images: pending
            };
            var local = load(LS_POSTS).filter(function (x) { return x.id !== post.id; });
            local.unshift(post);
            if (save(LS_POSTS, local)) { m.close(); toast(existing ? "수정되었습니다." : "등록되었습니다. (이 브라우저에 저장)"); renderList(); }
          });
        }, 0);
        return f;
      }
    }

    function exportSeed() {
      var posts = getPosts().map(function (p) {
        return { id: p.id, category: p.category, pinned: !!p.pinned, title: p.title, author: p.author, date: p.date, content: p.content, images: p.images || [] };
      });
      var gallery = (function () {
        var seed = (window.EMCL_SEED_GALLERY || []);
        var local = load(LS_GALLERY); var byId = {}; var all = [];
        local.concat(seed).forEach(function (g) { if (!byId[g.id]) { byId[g.id] = 1; all.push(g); } });
        return all;
      })();
      var body =
        "/* EMCL published content — generated " + new Date().toISOString() + " */\n" +
        "window.EMCL_SEED_POSTS = " + JSON.stringify(posts, null, 2) + ";\n\n" +
        "window.EMCL_SEED_GALLERY = " + JSON.stringify(gallery, null, 2) + ";\n";
      downloadFile("seed-posts.js", body, "text/javascript");
      toast("seed-posts.js 다운로드됨 — js/ 폴더에 덮어쓰고 커밋하세요.");
    }

    function importJSON() {
      var input = el("input"); input.type = "file"; input.accept = ".json,.js,application/json";
      input.addEventListener("change", function () {
        var f = input.files[0]; if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          try {
            var txt = r.result, data;
            try { data = JSON.parse(txt); } catch (e) {
              var m = txt.match(/EMCL_SEED_POSTS\s*=\s*(\[[\s\S]*?\]);/);
              data = m ? JSON.parse(m[1]) : null;
            }
            if (!Array.isArray(data)) { toast("형식을 인식할 수 없습니다."); return; }
            save(LS_POSTS, data); toast("가져왔습니다. (이 브라우저)"); renderList();
          } catch (e) { toast("가져오기 실패."); }
        };
        r.readAsText(f);
      });
      input.click();
    }

    function openLogin() {
      var form = el("div");
      form.innerHTML = '<div class="field"><label>관리자 비밀번호</label><input type="password" id="f-pw" placeholder="••••••••"></div>' +
        '<div class="form-note">기본 비밀번호는 js/board.js의 ADMIN_PASSWORD에서 변경할 수 있습니다.</div>';
      var foot = el("div", "board-actions");
      var ok = el("button", "btn btn-primary btn-sm", "로그인");
      foot.appendChild(ok);
      var m = modal("관리자 로그인", form, foot);
      function attempt() {
        if ($("#f-pw", form).value === ADMIN_PASSWORD) { setAdmin(true); m.close(); toast("관리자로 로그인했습니다."); renderList(); }
        else toast("비밀번호가 올바르지 않습니다.");
      }
      ok.addEventListener("click", attempt);
      $("#f-pw", form).addEventListener("keydown", function (e) { if (e.key === "Enter") attempt(); });
      setTimeout(function () { $("#f-pw", form).focus(); }, 60);
    }

    renderList();
  }

  /* ============================================================
     GALLERY
     ============================================================ */
  function getGallery() {
    var seed = (window.EMCL_SEED_GALLERY || []).map(function (g) { g._src = "seed"; return g; });
    var local = load(LS_GALLERY).map(function (g) { g._src = "local"; return g; });
    var byId = {}; var all = [];
    local.concat(seed).forEach(function (g) { if (!byId[g.id]) { byId[g.id] = 1; all.push(g); } });
    return all;
  }

  function initGallery(mount) {
    function render() {
      mount.innerHTML = "";
      var bar = el("div", "board-toolbar");
      var dot = el("span", "admin-dot" + (isAdmin() ? " on" : ""), '<i></i>' + (isAdmin() ? "관리자 모드" : "방문자 모드"));
      bar.appendChild(dot);
      var actions = el("div", "board-actions");
      if (isAdmin()) {
        var add = el("button", "btn btn-primary btn-sm", "사진 추가");
        add.addEventListener("click", openAdd);
        var out = el("button", "btn btn-ghost btn-sm", "로그아웃");
        out.addEventListener("click", function () { setAdmin(false); toast("로그아웃되었습니다."); render(); });
        actions.appendChild(add); actions.appendChild(out);
      } else {
        var login = el("button", "btn btn-ghost btn-sm", "관리자 로그인");
        login.addEventListener("click", openLogin);
        actions.appendChild(login);
      }
      bar.appendChild(actions);
      mount.appendChild(bar);

      var grid = el("div", "gallery-grid");
      getGallery().forEach(function (g) {
        var item = el("div", "gallery-item");
        var thumb = el("div", "thumb");
        if (g.src) { var im = el("img"); im.src = g.src; im.loading = "lazy"; thumb.appendChild(im); }
        else { thumb.style.background = g.color || "linear-gradient(135deg,#8A1538,#A52B4E)"; thumb.appendChild(el("span", "ph", esc(g.title))); }
        item.appendChild(thumb);
        var cap = el("div", "cap", '<span class="t">' + esc(g.title) + '</span><span class="d">' + esc(g.date || "") + '</span>');
        item.appendChild(cap);
        item.addEventListener("click", function () { if (g.src) lightbox(g.src); });
        if (isAdmin() && g._src === "local") {
          var x = el("button", "btn btn-ghost btn-sm", "삭제");
          x.style.margin = "0 14px 14px"; x.addEventListener("click", function (e) {
            e.stopPropagation();
            var local = load(LS_GALLERY).filter(function (i) { return i.id !== g.id; });
            save(LS_GALLERY, local); toast("삭제되었습니다."); render();
          });
          item.appendChild(x);
        }
        grid.appendChild(item);
      });
      mount.appendChild(grid);
    }

    function openAdd() {
      var form = el("div");
      var pending = [];
      form.innerHTML =
        '<div class="field"><label>이미지</label><div class="file-drop" id="g-drop">클릭하거나 사진을 끌어다 놓으세요</div>' +
        '<input type="file" id="g-file" accept="image/*" multiple hidden><div class="file-previews" id="g-prev"></div></div>' +
        '<div class="field"><label>설명 (선택)</label><input id="g-cap" placeholder="예: 연구실 MT"></div>' +
        '<div class="field"><label>날짜 (선택)</label><input id="g-date" placeholder="예: 2024"></div>' +
        '<div class="form-note">사진은 이 브라우저에 저장됩니다. 모두에게 공개하려면 게시판에서 "발행 파일 내보내기" 후 커밋하세요.</div>';
      var foot = el("div", "board-actions");
      var ok = el("button", "btn btn-primary btn-sm", "추가");
      foot.appendChild(ok);
      var m = modal("사진 추가", form, foot);
      var drop = $("#g-drop", form), file = $("#g-file", form), prev = $("#g-prev", form);
      function drawPrev() { prev.innerHTML = ""; pending.forEach(function (s, i) { var fp = el("div", "fp"); var im = el("img"); im.src = s; fp.appendChild(im); var x = el("button", "", "×"); x.addEventListener("click", function () { pending.splice(i, 1); drawPrev(); }); fp.appendChild(x); prev.appendChild(fp); }); }
      function addFiles(fs) { Array.prototype.forEach.call(fs, function (f) { if (!/^image\//.test(f.type)) return; fileToDataURL(f, function (d) { pending.push(d); drawPrev(); }); }); }
      drop.addEventListener("click", function () { file.click(); });
      file.addEventListener("change", function () { addFiles(file.files); file.value = ""; });
      drop.addEventListener("dragover", function (e) { e.preventDefault(); });
      drop.addEventListener("drop", function (e) { e.preventDefault(); addFiles(e.dataTransfer.files); });
      ok.addEventListener("click", function () {
        if (!pending.length) { toast("이미지를 선택하세요."); return; }
        var local = load(LS_GALLERY);
        var cap = $("#g-cap", form).value.trim(), date = $("#g-date", form).value.trim();
        pending.forEach(function (src, i) { local.unshift({ id: "ug" + Date.now() + i, title: cap || "연구실 사진", date: date, src: src }); });
        if (save(LS_GALLERY, local)) { m.close(); toast("추가되었습니다."); render(); }
      });
    }

    function openLogin() {
      var form = el("div");
      form.innerHTML = '<div class="field"><label>관리자 비밀번호</label><input type="password" id="g-pw"></div>';
      var foot = el("div", "board-actions"); var ok = el("button", "btn btn-primary btn-sm", "로그인"); foot.appendChild(ok);
      var m = modal("관리자 로그인", form, foot);
      function attempt() { if ($("#g-pw", form).value === ADMIN_PASSWORD) { setAdmin(true); m.close(); toast("관리자로 로그인했습니다."); render(); } else toast("비밀번호가 올바르지 않습니다."); }
      ok.addEventListener("click", attempt);
      $("#g-pw", form).addEventListener("keydown", function (e) { if (e.key === "Enter") attempt(); });
      setTimeout(function () { $("#g-pw", form).focus(); }, 60);
    }

    render();
  }

  function downloadFile(name, content, type) {
    var blob = new Blob([content], { type: type || "text/plain" });
    var a = el("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- recent posts for home page ---------- */
  window.EMCL_recentPosts = function (n) { return getPosts().slice(0, n || 4); };

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("board"); if (b) initBoard(b);
    var g = document.getElementById("gallery-board"); if (g) initGallery(g);
    // home recent news
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
