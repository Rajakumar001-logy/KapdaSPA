(function () {
  var TOKEN_KEY = "vastra_token";
  var apiBase = "/api";

  function token() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (_) {
      return null;
    }
  }

  function setToken(t) {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }

  function api(path, opts) {
    opts = opts || {};
    var headers = opts.headers || {};
    headers["Content-Type"] = "application/json";
    if (token()) headers.Authorization = "Bearer " + token();
    return fetch(apiBase + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (_) {
            data = { raw: text };
          }
        }
        if (!res.ok) {
          var err = new Error((data && data.error) || res.statusText || "Request failed");
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  function show(el, on) {
    if (!el) return;
    el.hidden = !on;
  }

  function setMessage(el, text, isError) {
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("is-error", !!isError);
  }

  /* Tabs */
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var name = tab.getAttribute("data-tab");
      document.querySelectorAll(".tab").forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
      });
      document.querySelectorAll(".tab-panel").forEach(function (p) {
        p.classList.toggle("is-active", p.id === "form-" + name);
      });
    });
  });

  var authPanel = document.getElementById("auth-panel");
  var appLogged = document.getElementById("app-logged-in");
  var authMsg = document.getElementById("auth-message");

  function showApp(user) {
    show(authPanel, false);
    show(appLogged, true);
    document.getElementById("user-name").textContent = user.name + " (" + user.email + ")";
    refreshAddresses();
    refreshServices();
    refreshBookings();
    setDefaultSlots();
  }

  function showAuth() {
    show(authPanel, true);
    show(appLogged, false);
    setToken(null);
  }

  document.getElementById("form-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    setMessage(authMsg, "");
    api("/auth/login", {
      method: "POST",
      body: { email: fd.get("email"), password: fd.get("password") },
    })
      .then(function (data) {
        setToken(data.token);
        setMessage(authMsg, "Welcome back.");
        showApp(data.user);
      })
      .catch(function (err) {
        setMessage(
          authMsg,
          (err.data && err.data.error) || err.message || "Login failed",
          true
        );
      });
  });

  document.getElementById("form-register").addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    setMessage(authMsg, "");
    api("/auth/register", {
      method: "POST",
      body: {
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        phone: fd.get("phone") || undefined,
      },
    })
      .then(function (data) {
        setToken(data.token);
        setMessage(authMsg, "Account created.");
        showApp(data.user);
      })
      .catch(function (err) {
        var msg =
          err.data && err.data.error
            ? err.data.error
            : err.message || "Could not register";
        setMessage(authMsg, msg, true);
      });
  });

  document.getElementById("btn-logout").addEventListener("click", function () {
    showAuth();
    setMessage(authMsg, "Logged out.");
  });

  /* Addresses */
  var addressSelect = document.getElementById("address-select");
  var addressMsg = document.getElementById("address-message");

  function refreshAddresses() {
    return api("/addresses")
      .then(function (rows) {
        addressSelect.innerHTML = "";
        if (!rows.length) {
          var o = document.createElement("option");
          o.value = "";
          o.textContent = "Add an address above first";
          addressSelect.appendChild(o);
          return;
        }
        rows.forEach(function (a) {
          var opt = document.createElement("option");
          opt.value = String(a.id);
          opt.textContent =
            (a.label ? a.label + " — " : "") +
            a.line1 +
            ", " +
            a.city +
            " " +
            a.pincode;
          addressSelect.appendChild(opt);
        });
      })
      .catch(function (err) {
        setMessage(addressMsg, err.message || "Could not load addresses", true);
      });
  }

  document.getElementById("form-address").addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    setMessage(addressMsg, "");
    api("/addresses", {
      method: "POST",
      body: {
        label: fd.get("label") || undefined,
        line1: fd.get("line1"),
        line2: fd.get("line2") || undefined,
        city: fd.get("city"),
        pincode: fd.get("pincode"),
      },
    })
      .then(function () {
        setMessage(addressMsg, "Address saved.");
        e.target.reset();
        return refreshAddresses();
      })
      .catch(function (err) {
        setMessage(addressMsg, err.message || "Save failed", true);
      });
  });

  /* Services */
  var servicesList = document.getElementById("services-list");
  var servicesCache = [];

  function refreshServices() {
    return api("/services").then(function (rows) {
      servicesCache = rows;
      servicesList.innerHTML = "";
      rows.forEach(function (s) {
        var row = document.createElement("div");
        row.className = "service-row";
        var unitLabel = s.unit === "kg" ? "kg" : "pieces";
        var price = "₹" + s.pricePerUnit + "/" + unitLabel;
        row.innerHTML =
          '<label><input type="checkbox" data-sid="' +
          s.id +
          '" /> ' +
          s.name +
          '<span class="service-meta">' +
          (s.description || "") +
          " · " +
          price +
          "</span></label>" +
          '<input class="input service-qty" type="number" min="0.5" step="0.5" value="1" data-qty-for="' +
          s.id +
          '" disabled />';
        servicesList.appendChild(row);
        var cb = row.querySelector('input[type="checkbox"]');
        var qty = row.querySelector("[data-qty-for]");
        cb.addEventListener("change", function () {
          qty.disabled = !cb.checked;
        });
      });
    });
  }

  function setDefaultSlots() {
    var start = document.getElementById("pickup-start");
    var end = document.getElementById("pickup-end");
    if (!start || !end || start.value) return;
    var d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(16, 0, 0, 0);
    var d2 = new Date(d);
    d2.setHours(18, 0, 0, 0);
    start.value = toLocalInput(d);
    end.value = toLocalInput(d2);
  }

  function toLocalInput(date) {
    var pad = function (n) {
      return String(n).padStart(2, "0");
    };
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  var bookMsg = document.getElementById("book-message");

  document.getElementById("btn-book").addEventListener("click", function () {
    setMessage(bookMsg, "");
    var addressId = Number(addressSelect.value);
    if (!addressId) {
      setMessage(bookMsg, "Please save and select an address.", true);
      return;
    }
    var items = [];
    servicesCache.forEach(function (s) {
      var cb = servicesList.querySelector('input[data-sid="' + s.id + '"]');
      if (!cb || !cb.checked) return;
      var qtyEl = servicesList.querySelector("[data-qty-for=\"" + s.id + '"]');
      var qty = Number(qtyEl && qtyEl.value);
      if (!qty || qty <= 0) return;
      items.push({ serviceId: s.id, quantity: qty });
    });
    if (!items.length) {
      setMessage(bookMsg, "Select at least one service with quantity.", true);
      return;
    }
    var ps = document.getElementById("pickup-start").value;
    var pe = document.getElementById("pickup-end").value;
    if (!ps || !pe) {
      setMessage(bookMsg, "Choose pickup window.", true);
      return;
    }
    var body = {
      addressId: addressId,
      pickupSlotStart: new Date(ps).toISOString(),
      pickupSlotEnd: new Date(pe).toISOString(),
      notes: document.getElementById("booking-notes").value || undefined,
      items: items,
    };
    api("/bookings", { method: "POST", body: body })
      .then(function () {
        setMessage(bookMsg, "Booking placed. You can track it below.");
        refreshBookings();
      })
      .catch(function (err) {
        var msg = err.message || "Booking failed";
        if (err.data && err.data.errors) msg = JSON.stringify(err.data.errors);
        setMessage(bookMsg, msg, true);
      });
  });

  /* Bookings list + detail */
  var bookingsList = document.getElementById("bookings-list");
  var detail = document.getElementById("booking-detail");
  var currentDetailId = null;

  function refreshBookings() {
    return api("/bookings").then(function (rows) {
      bookingsList.innerHTML = "";
      if (!rows.length) {
        var li = document.createElement("li");
        li.textContent = "No bookings yet.";
        bookingsList.appendChild(li);
        return;
      }
      rows.forEach(function (b) {
        var li = document.createElement("li");
        var left = document.createElement("span");
        left.textContent =
          "#" + b.id + " · " + b.status + " · ₹" + b.totalAmount;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Details";
        btn.addEventListener("click", function () {
          openDetail(b.id);
        });
        li.appendChild(left);
        li.appendChild(btn);
        bookingsList.appendChild(li);
      });
    });
  }

  function openDetail(id) {
    currentDetailId = id;
    api("/bookings/" + id).then(function (b) {
      show(detail, true);
      document.getElementById("detail-id").textContent = String(b.id);
      document.getElementById("detail-status").textContent = b.status;
      document.getElementById("detail-total").textContent = String(b.totalAmount);
      var itemsEl = document.getElementById("detail-items");
      itemsEl.innerHTML = "";
      (b.items || []).forEach(function (it) {
        var li = document.createElement("li");
        li.textContent =
          it.serviceName +
          " × " +
          it.quantity +
          " " +
          it.unit +
          " — ₹" +
          it.lineTotal;
        itemsEl.appendChild(li);
      });
      var tl = document.getElementById("detail-timeline");
      tl.innerHTML = "";
      (b.statusHistory || []).forEach(function (ev) {
        var li = document.createElement("li");
        li.textContent =
          ev.createdAt +
          " — " +
          ev.status +
          (ev.message ? " (" + ev.message + ")" : "");
        tl.appendChild(li);
      });
      var cancelBtn = document.getElementById("detail-cancel");
      cancelBtn.disabled = b.status === "delivered" || b.status === "cancelled";
    });
  }

  document.getElementById("detail-close").addEventListener("click", function () {
    show(detail, false);
    currentDetailId = null;
  });

  document.getElementById("detail-cancel").addEventListener("click", function () {
    if (!currentDetailId) return;
    api("/bookings/" + currentDetailId + "/cancel", { method: "PATCH" })
      .then(function () {
        return refreshBookings();
      })
      .then(function () {
        return openDetail(currentDetailId);
      })
      .catch(function (err) {
        alert(err.message || "Could not cancel");
      });
  });

  /* Boot */
  api("/auth/me")
    .then(function (user) {
      showApp(user);
      setMessage(authMsg, "");
    })
    .catch(function () {
      setToken(null);
      showAuth();
    });
})();
