(function () {
  var TOKEN_KEY = "vastra_token";
  var STATUSES = [
    "placed",
    "confirmed",
    "pickup_scheduled",
    "picked_up",
    "processing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
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
          var err = new Error((data && data.error) || res.statusText);
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  var authMsg = document.getElementById("admin-auth-msg");
  var workspace = document.getElementById("admin-workspace");
  var listEl = document.getElementById("admin-bookings");
  var detail = document.getElementById("admin-detail");
  var currentId = null;

  function msg(text, isErr) {
    authMsg.textContent = text || "";
    authMsg.classList.toggle("is-error", !!isErr);
  }

  function fillStatusSelect(sel, current) {
    sel.innerHTML = "";
    STATUSES.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s;
      o.textContent = s.replace(/_/g, " ");
      if (s === current) o.selected = true;
      sel.appendChild(o);
    });
  }

  document.getElementById("admin-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    msg("");
    api("/auth/login", {
      method: "POST",
      body: { email: fd.get("email"), password: fd.get("password") },
    })
      .then(function (data) {
        if (data.user.role !== "admin") {
          setToken(null);
          msg("That account is not an admin.", true);
          return;
        }
        setToken(data.token);
        document.getElementById("admin-logout").hidden = false;
        workspace.hidden = false;
        msg("Signed in.");
        refreshList();
      })
      .catch(function (err) {
        msg((err.data && err.data.error) || err.message, true);
      });
  });

  document.getElementById("admin-logout").addEventListener("click", function () {
    setToken(null);
    workspace.hidden = true;
    detail.hidden = true;
    document.getElementById("admin-logout").hidden = true;
    msg("Logged out.");
  });

  document.getElementById("admin-refresh").addEventListener("click", function () {
    refreshList();
  });

  function refreshList() {
    return api("/admin/bookings").then(function (rows) {
      listEl.innerHTML = "";
      rows.forEach(function (b) {
        var li = document.createElement("li");
        var left = document.createElement("span");
        left.textContent =
          "#" +
          b.id +
          " · " +
          b.userName +
          " · " +
          b.status +
          " · ₹" +
          b.totalAmount;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Open";
        btn.style.cssText =
          "font:inherit;background:none;border:none;color:var(--accent-strong);cursor:pointer;text-decoration:underline;padding:0;";
        btn.addEventListener("click", function () {
          openDetail(b.id);
        });
        li.appendChild(left);
        li.appendChild(btn);
        listEl.appendChild(li);
      });
    });
  }

  function openDetail(id) {
    currentId = id;
    return api("/admin/bookings/" + id).then(function (b) {
      detail.hidden = false;
      document.getElementById("adm-detail-id").textContent = String(b.id);
      document.getElementById("adm-customer").textContent =
        b.userName + " <" + b.userEmail + ">";
      document.getElementById("adm-address").textContent =
        (b.addressLabel ? b.addressLabel + ", " : "") +
        b.line1 +
        (b.line2 ? ", " + b.line2 : "") +
        ", " +
        b.city +
        " " +
        b.pincode;
      document.getElementById("adm-status").textContent = b.status;
      fillStatusSelect(document.getElementById("adm-status-select"), b.status);
      document.getElementById("adm-status-note").value = "";
      document.getElementById("adm-save-msg").textContent = "";
      var tl = document.getElementById("adm-timeline");
      tl.innerHTML = "";
      (b.statusHistory || []).forEach(function (ev) {
        var li = document.createElement("li");
        li.textContent =
          ev.createdAt + " — " + ev.status + (ev.message ? " (" + ev.message + ")" : "");
        tl.appendChild(li);
      });
    });
  }

  document.getElementById("adm-close").addEventListener("click", function () {
    detail.hidden = true;
    currentId = null;
  });

  document.getElementById("adm-save-status").addEventListener("click", function () {
    if (!currentId) return;
    var status = document.getElementById("adm-status-select").value;
    var note = document.getElementById("adm-status-note").value;
    var saveMsg = document.getElementById("adm-save-msg");
    saveMsg.textContent = "";
    saveMsg.classList.remove("is-error");
    api("/admin/bookings/" + currentId + "/status", {
      method: "PATCH",
      body: { status: status, message: note || undefined },
    })
      .then(function () {
        saveMsg.textContent = "Status updated.";
        return refreshList();
      })
      .then(function () {
        return openDetail(currentId);
      })
      .catch(function (err) {
        saveMsg.textContent = err.message || "Update failed";
        saveMsg.classList.add("is-error");
      });
  });

  api("/auth/me")
    .then(function (user) {
      if (user.role === "admin") {
        document.getElementById("admin-logout").hidden = false;
        workspace.hidden = false;
        refreshList();
      }
    })
    .catch(function () {});
})();
