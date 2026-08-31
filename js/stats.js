/* ============================================================
   EMCL — 홈 화면 STAT BAND 자동 집계  (js/stats.js)
   ------------------------------------------------------------
   index.html 의 숫자를 손으로 고칠 필요 없이, 데이터에서 직접 셉니다.

     · Members  : pages/members.html 안의 인원 카드(.member-list-item) 개수
     · SCI 게재 : window.EMCL_PAPERS 중 [최근 N개년] + [status 조건] 논문 수

   ▶ 사용법 (index.html 맨 아래, main.js 보다 "앞"에 넣으세요)
       <script src="js/papers.js"></script>   ← 논문 데이터 파일
       <script src="js/stats.js"></script>
       <script src="js/main.js"></script>

   ▶ index.html 의 statband 를 아래처럼 data-stat 만 추가해 주세요.
       <span data-count="22" data-stat="members">0</span>
       <span data-count="89" data-stat="papers">0</span>
     (data-count 값은 스크립트가 실패했을 때 보여줄 예비 숫자입니다)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 설정: 여기만 바꾸면 됩니다 ---------- */

  var YEARS = 5;          // 최근 몇 개년을 셀지 (2026년 기준 → 2022~2026)

  // TOP % 로 걸러낼지 여부.
  //   null → 필터 없이 전부 카운트 (현재 설정)
  //   10   → journal 에 "TOP 10% 이내"로 적힌 논문만 카운트
  var TOP_PERCENT = null;

  // 어떤 상태의 논문을 셀지. 소문자로 적습니다.
  // 게재 확정만          → ["published"]
  // 투고·심사중까지 포함 → ["published", "in revision", "under review", "submitted"]
  var COUNT_STATUS = ["published"];

  // members.html 에 카드가 없는 인원 수 (예: 지도교수 1명)
  var EXTRA_MEMBERS = 1;

  // true 로 두면 브라우저 콘솔(F12)에 연도별 집계가 표로 찍힙니다.
  var DEBUG = false;

  /* ---------- 여기서부터는 수정하지 않아도 됩니다 ---------- */

  var depth = parseInt(document.body.dataset.depth || "0", 10);
  var ROOT = depth === 1 ? "../" : "";
  var MEMBERS_URL = ROOT + "pages/members.html";

  function slot(name) {
    return document.querySelector('[data-stat="' + name + '"]');
  }

  /* 숫자 반영. main.js 의 카운트 애니메이션이 아직 안 돌았으면
     data-count 만 바꿔두고, 이미 돌았으면 직접 다시 그려 준다. */
  function setStat(el, value) {
    if (!el || value === null || isNaN(value)) return;
    el.dataset.count = value;
    if (el.textContent.trim() !== "0") animate(el, value);
  }

  function animate(el, target) {
    var from = parseFloat(el.textContent) || 0;
    var dur = 600, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * ease);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 1) 논문 수 ----------
     TOP_PERCENT 를 숫자로 바꿨을 때만 쓰입니다. journal 문자열에서
     "TOP 3.2%", "TOP 10.51%", "TOP 10 Journal" 같은 표기를 찾아 숫자만 뽑습니다. */
  function topPercentOf(paper) {
    var m = /TOP\s*=?\s*([0-9]+(?:\.[0-9]+)?)/i.exec(paper.journal || "");
    return m ? parseFloat(m[1]) : null;
  }

  function countPapers() {
    var all = window.EMCL_PAPERS;
    if (!Array.isArray(all) || !all.length) return null;

    var fromYear = new Date().getFullYear() - YEARS + 1;
    var byYear = {}, skipped = [], total = 0;

    all.forEach(function (p) {
      if (!p || typeof p.year !== "number" || p.year < fromYear) return;
      if (COUNT_STATUS.indexOf(String(p.status || "").trim().toLowerCase()) === -1) return;

      if (TOP_PERCENT !== null) {
        var top = topPercentOf(p);
        if (top === null || top > TOP_PERCENT) {
          if (DEBUG) skipped.push({ year: p.year, top: top, title: p.title });
          return;
        }
      }
      byYear[p.year] = (byYear[p.year] || 0) + 1;
      total++;
    });

    if (DEBUG) {
      console.log("[EMCL] " + fromYear + "년 이후 / 합계 " + total +
        (TOP_PERCENT === null ? " (TOP 필터 없음)" : " (TOP " + TOP_PERCENT + "% 이내)"));
      console.table(byYear);
      if (skipped.length) console.log("[EMCL] TOP 기준에서 제외된 논문", skipped);
    }
    return total;
  }

  /* ---------- 2) 멤버 수 ---------- */
  function countMembers(done) {
    if (!window.fetch) return done(null);
    fetch(MEMBERS_URL, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var n = doc.querySelectorAll(".member-list .member-list-item").length;
        if (DEBUG) console.log("[EMCL] members.html 인원 카드", n, "+ 추가", EXTRA_MEMBERS);
        done(n ? n + EXTRA_MEMBERS : null);
      })
      .catch(function (err) {
        if (DEBUG) console.warn("[EMCL] 멤버 수를 읽지 못했습니다:", err);
        done(null);   // 실패하면 index.html 의 data-count 예비 숫자를 그대로 씁니다
      });
  }

  /* ---------- 실행 ---------- */
  setStat(slot("papers"), countPapers());
  countMembers(function (n) { setStat(slot("members"), n); });
})();
