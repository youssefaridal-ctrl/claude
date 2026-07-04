/* مكتبة النخبة — سلوكيات الموقع */
(function () {
  "use strict";

  // قائمة الجوال
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }

  // تصفية الكتب حسب التصنيف (الصفحة الرئيسية)
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll(".book-card[data-cat]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.style.display = show ? "" : "none";
      });
    });
  });

  // شريط تقدم القراءة (صفحات الكتب)
  var bar = document.querySelector(".progress-bar");
  if (bar) {
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }, { passive: true });
  }

  // زر العودة للأعلى
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // السنة الحالية في التذييل
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // نماذج تجريبية (النشرة البريدية / اتصل بنا)
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.getAttribute("data-success") || "تم الإرسال بنجاح، شكراً لتواصلك معنا!";
      var note = form.querySelector(".form-feedback");
      if (!note) {
        note = document.createElement("p");
        note.className = "form-feedback";
        note.style.cssText = "margin-top:14px;color:#2e7d5b;font-weight:700;";
        form.appendChild(note);
      }
      note.textContent = "✓ " + msg;
      form.reset();
    });
  });
})();
