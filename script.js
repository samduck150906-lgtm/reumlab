// REUMLAB — interactions
(function () {
  "use strict";

  // header shadow on scroll
  var header = document.querySelector(".header");
  function onScroll() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // mobile nav
  var burger = document.getElementById("burger");
  var mnav = document.getElementById("mobileNav");
  function closeNav() {
    burger.classList.remove("open");
    mnav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", function () {
    var open = burger.classList.toggle("open");
    mnav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mnav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        if (o !== item) {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  // 신청 폼 (main-apply) — Netlify Forms로 접수, 페이지 이동 없이 AJAX 제출
  var applyForms = document.querySelectorAll("[data-reum-apply]");
  if (applyForms.length) {
    // 광고 유입값(utm_*·fbclid) 확보 → 폼에 함께 실어 어떤 캠페인에서 온 신청인지 기록
    var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
    var utm = {};
    try {
      var params = new URLSearchParams(window.location.search);
      var fromUrl = {};
      UTM_KEYS.forEach(function (k) { var v = params.get(k); if (v) fromUrl[k] = v; });
      if (Object.keys(fromUrl).length) {
        sessionStorage.setItem("reum_utm", JSON.stringify(fromUrl));
        utm = fromUrl;
      } else {
        var saved = sessionStorage.getItem("reum_utm");
        if (saved) utm = JSON.parse(saved);
      }
    } catch (e) { /* sessionStorage 차단 환경 무시 */ }

    applyForms.forEach(function (form) {
      form.querySelectorAll("[data-utm]").forEach(function (input) {
        var k = input.getAttribute("data-utm");
        if (utm[k]) input.value = utm[k];
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.dataset.submitting === "1") return;
        var btn = form.querySelector(".af-submit");
        var errEl = form.querySelector(".af-error");
        form.dataset.submitting = "1";
        if (errEl) errEl.hidden = true;
        var origLabel = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "신청 중…"; }

        var body = new URLSearchParams(new FormData(form)).toString();
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body
        }).then(function (res) {
          if (!res.ok) throw new Error("status " + res.status);
          var card = form.closest(".af-card");
          var head = card ? card.querySelector(".af-head") : null;
          var done = card ? card.querySelector(".af-done") : null;
          form.hidden = true;
          if (head) head.hidden = true;
          if (done) done.hidden = false;
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
          try { if (typeof window.fbq === "function") window.fbq("track", "Lead"); } catch (e2) {}
          try { if (window.dataLayer) window.dataLayer.push({ event: "main_apply_submit" }); } catch (e3) {}
        }).catch(function () {
          if (errEl) errEl.hidden = false;
        }).then(function () {
          form.dataset.submitting = "0";
          if (btn) { btn.disabled = false; btn.textContent = origLabel; }
        });
      });
    });
  }
})();
