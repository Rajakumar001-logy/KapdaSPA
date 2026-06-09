(function () {
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("waitlist-form");
  var messageEl = document.getElementById("form-message");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  if (form && messageEl) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      messageEl.classList.remove("is-error");

      var email = form.querySelector("#email");
      var city = form.querySelector("#city");
      if (!email || !city) return;

      var ok =
        email.value.trim() &&
        city.value.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      if (!ok) {
        messageEl.textContent = "Please enter a valid email and city.";
        messageEl.classList.add("is-error");
        return;
      }

      var payload = {
        email: email.value.trim(),
        city: city.value.trim(),
      };

      fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("api");
          return res.json();
        })
        .then(function () {
          messageEl.textContent =
            "Thanks — you're on the list. We'll reach out when we launch in your area.";
        })
        .catch(function () {
          messageEl.textContent =
            "Thanks — you're on the list. (Saved locally; start the server to store on the server too.)";
        })
        .finally(function () {
          try {
            localStorage.setItem(
              "vastra_waitlist",
              JSON.stringify({
                email: payload.email,
                city: payload.city,
                at: new Date().toISOString(),
              })
            );
          } catch (_) {}
          form.reset();
        });
    });
  }
})();
