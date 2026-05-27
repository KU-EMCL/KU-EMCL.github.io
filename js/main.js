/* ============================================================
   EMCL — shared chrome & interactions
   Header + footer are injected here so every page stays in sync.
   Edit NAV / FOOTER below to update the whole site at once.
   ============================================================ */
(function () {
  "use strict";

  var body  = document.body;
  var depth = parseInt(body.dataset.depth || "0", 10);     // 0 = root, 1 = /pages
  var page  = body.dataset.page || "home";
  var P     = depth === 1 ? "../" : "";                      // path prefix to root

  // top-level highlight map
  var GROUP = {
    home: "home", introduction: "intro", research: "intro",
    professor: "prof", members: "members", alumni: "members",
    lectures: "lectures", publications: "pubs", patents: "pubs",
    project: "project", community: "community", gallery: "community",
    contact: "contact"
  };
  var active = GROUP[page] || "";

  // navigation model
  var NAV = [
    { key: "intro",    label: "Introduction", href: "pages/introduction.html", sub: [
      { label: "About Us", href: "pages/introduction.html" },
      { label: "Research Area",  href: "pages/research.html" } ] },
    { key: "prof",     label: "Professor",    href: "pages/professor.html", sub: [
      { label: "Professor", href: "pages/professor.html" } ] },
    { key: "members",  label: "Members",      href: "pages/members.html", sub: [
      { label: "Students", href: "pages/members.html" },
      { label: "Alumni",     href: "pages/alumni.html" } ] },
    { key: "lectures", label: "Lectures",     href: "pages/lectures.html", sub: [
      { label: "Courses", href: "pages/lectures.html" } ] },
    { key: "pubs",     label: "Publications", href: "pages/publications.html", sub: [
      { label: "Paper", href: "pages/publications.html" },
      { label: "Patent", href: "pages/patents.html" } ] },
    { key: "project",  label: "Project",      href: "pages/project.html", sub: [
      { label: "Ongoing", href: "pages/project.html#ongoing" },
      { label: "Completed", href: "pages/project.html#completed" } ] },
    { key: "community",label: "Community",    href: "pages/community.html", sub: [
      { label: "News & Notice",   href: "pages/community.html" },
      { label: "Gallery",   href: "pages/gallery.html" } ] }
    { key: "contact",  label: "Contact",      href: "pages/contact.html", sub: [
      { label: "Visit Us", href: "pages/contact.html" } ] }
  ];

  function abs(h) { return P + h; }

  /* ---------- HEADER ---------- */
  var navHTML = NAV.map(function (n) {
    var cur = n.key === active ? " class=\"current\"" : "";
    var subs = n.sub.map(function (s) {
      return '<a href="' + abs(s.href) + '">' + s.label + "</a>";
    }).join("");
    return '<li' + cur + '><a href="' + abs(n.href) + '">' + n.label +
      '</a><div class="dropdown">' + subs + "</div></li>";
  }).join("");

  var header =
    '<header id="site-header">' +
      '<div class="topbar"><div class="wrap">' +
        '<span>Korea University · School of Mechanical Engineering</span>' +
        '<span class="util">' +
          '<a href="' + abs("index.html") + '">HOME</a>' +
          '<a href="mailto:ytkang@korea.ac.kr">EMAIL</a>' +
        '</span>' +
      '</div></div>' +
      '<div class="bar"><div class="wrap">' +
        '<a class="brand" href="' + abs("index.html") + '">' +
          '<img class="ku-logo" src="' + P + 'images/KU-logo.gif" alt="고려대학교" />' +
          '<span class="ku-name"><b>고려대학교</b><i>KOREA UNIVERSITY</i></span>' +
          '<span class="div"></span>' +
          '<span class="mark">EMCL</span>' +
          '<span class="meta"><span class="ko">에너지물질순환연구실</span>' +
          '<span class="en">Energy Materials Circulation Lab</span></span>' +
        '</a>' +
        '<nav><ul class="nav">' + navHTML + '</ul></nav>' +
        '<button class="nav-toggle" aria-label="메뉴"><span></span><span></span><span></span></button>' +
      '</div></div>' +
    '</header>' +
    '<nav id="mobile-nav">' + NAV.map(function (n) {
        return '<a href="' + abs(n.href) + '">' + n.label + '</a>' +
          '<div class="sub">' + n.sub.map(function (s) {
            return '<a href="' + abs(s.href) + '">' + s.label + '</a>';
          }).join("") + '</div>';
      }).join("") + '</nav>';

  /* ---------- FOOTER ---------- */
  var footer =
    '<footer id="site-footer"><div class="wrap">' +
      '<div class="top">' +
        '<div><div class="mark">EMCL</div>' +
          '<address>에너지물질순환연구실 (Energy Materials Circulation Laboratory)<br>' +
          '고려대학교 공과대학 기계공학부<br>' +
          '서울특별시 성북구 안암로 145 (02841)<br>' +
          'Innovation Hall 309 · ytkang@korea.ac.kr</address></div>' +
        '<div class="fcol"><h4>Navigate</h4>' +
          '<a href="' + abs("pages/introduction.html") + '">연구실 소개</a>' +
          '<a href="' + abs("pages/professor.html") + '">교수 소개</a>' +
          '<a href="' + abs("pages/publications.html") + '">Publications</a>' +
          '<a href="' + abs("pages/community.html") + '">게시판</a></div>' +
        '<div class="fcol"><h4>Links</h4>' +
          '<a href="https://www.korea.ac.kr" target="_blank" rel="noopener">고려대학교 ↗</a>' +
          '<a href="https://me.korea.ac.kr" target="_blank" rel="noopener">기계공학부 ↗</a>' +
          '<a href="' + abs("pages/contact.html") + '">오시는 길</a></div>' +
      '</div>' +
      '<div class="bottom"><span>© ' + new Date().getFullYear() +
        ' Energy Materials Circulation Laboratory. All rights reserved.</span>' +
        '<span>Korea University</span></div>' +
    '</div></footer>';

  // inject
  var mount = document.getElementById("app") || body;
  mount.insertAdjacentHTML("afterbegin", header);
  mount.insertAdjacentHTML("beforeend", footer);

  /* ---------- header scroll state ---------- */
  var hdr = document.getElementById("site-header");
  function onScroll() {
    if (window.scrollY > 40) hdr.classList.add("scrolled");
    else hdr.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var toggle = hdr.querySelector(".nav-toggle");
  var drawer = document.getElementById("mobile-nav");
  toggle.addEventListener("click", function () {
    var open = drawer.classList.toggle("open");
    toggle.classList.toggle("x", open);
    body.classList.toggle("nav-open", open);
  });
  drawer.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      drawer.classList.remove("open"); toggle.classList.remove("x"); body.classList.remove("nav-open");
    }
  });

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- stat counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var sObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { countUp(en.target); sObs.unobserve(en.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function (el) { sObs.observe(el); });

  /* ---------- smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.querySelector(this.getAttribute("href"));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });
})();
