(function () {
  "use strict";

  const form = document.querySelector(".php-email-form");
  if (!form) return;

  form.setAttribute("novalidate", "true");

  form.innerHTML = `
    <div class="form-group">
      <label>Vardas</label>
      <input type="text" name="vardas" required>
    </div>

    <div class="form-group">
      <label>Pavardė</label>
      <input type="text" name="pavarde" required>
    </div>

    <div class="form-group">
      <label>El. paštas</label>
      <input type="email" name="email" required>
    </div>

    <div class="form-group">
      <label>Telefono numeris</label>
      <input type="tel" name="telefonas" required>
    </div>

    <div class="form-group">
      <label>Adresas</label>
      <input type="text" name="adresas" required>
    </div>

    <div style="display:flex; gap:20px; justify-content:space-between; margin-top:10px;">
      <div class="form-group" style="flex:1;">
        <label>Klausimas 1 (1–10)</label>
        <input type="number" name="klausimas1" min="1" max="10" required>
      </div>
      <div class="form-group" style="flex:1;">
        <label>Klausimas 2 (1–10)</label>
        <input type="number" name="klausimas2" min="1" max="10" required>
      </div>
      <div class="form-group" style="flex:1;">
        <label>Klausimas 3 (1–10)</label>
        <input type="number" name="klausimas3" min="1" max="10" required>
      </div>
    </div>

    <button type="submit" class="submit-btn" style="margin-top:20px;">
      <span>Submit</span>
      <i class="bi bi-arrow-right"></i>
    </button>
  `;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.6";
  submitBtn.style.cursor = "not-allowed";

  const resultBox = document.createElement("div");
  resultBox.style.marginTop = "20px";
  resultBox.style.padding = "15px";
  resultBox.style.backgroundColor = "#141c26";
  resultBox.style.color = "#ffffff";
  resultBox.style.fontStyle = "italic";
  resultBox.style.borderRadius = "10px";
  form.parentNode.appendChild(resultBox);

  const successPopup = document.createElement("div");
  successPopup.textContent = "Duomenys pateikti sėkmingai!";
  successPopup.style.position = "fixed";
  successPopup.style.top = "20px";
  successPopup.style.right = "20px";
  successPopup.style.padding = "12px 18px";
  successPopup.style.backgroundColor = "#198754";
  successPopup.style.color = "white";
  successPopup.style.borderRadius = "8px";
  successPopup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  successPopup.style.fontWeight = "600";
  successPopup.style.zIndex = "9999";
  successPopup.style.display = "none";
  document.body.appendChild(successPopup);

  const fields = {
    vardas: form.querySelector('input[name="vardas"]'),
    pavarde: form.querySelector('input[name="pavarde"]'),
    email: form.querySelector('input[name="email"]'),
    adresas: form.querySelector('input[name="adresas"]')
  };

  function getErrorElement(input) {
    let el = input.nextElementSibling;
    if (!el || !el.classList.contains("field-error")) {
      el = document.createElement("div");
      el.className = "field-error";
      el.style.color = "#ff6b6b";
      el.style.fontSize = "0.85rem";
      el.style.marginTop = "4px";
      input.parentNode.appendChild(el);
    }
    return el;
  }

  function showError(input, message) {
    const errorEl = getErrorElement(input);
    errorEl.textContent = message;
    input.style.border = "1px solid #ff4d4d";
  }

  function clearError(input) {
    const errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains("field-error")) {
      errorEl.textContent = "";
    }
    input.style.border = "";
  }

  const nameRegex = /^[A-Za-z\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(key) {
    const input = fields[key];
    const value = input.value.trim();

    if (!value) {
      showError(input, "Šis laukas privalomas.");
      return false;
    }

    if (key === "vardas" || key === "pavarde") {
      if (!nameRegex.test(value)) {
        showError(input, "Leidžiamos tik raidės.");
        return false;
      }
    }

    if (key === "email") {
      if (!emailRegex.test(value)) {
        showError(input, "Neteisingas el. pašto formatas.");
        return false;
      }
    }

    if (key === "adresas") {
      if (!/[A-Za-z]/.test(value)) {
        showError(input, "Adresas turi būti tekstas (ne vien skaičiai).");
        return false;
      }
    }

    clearError(input);
    return true;
  }

  function validateAllMainFields() {
    let ok = true;
    ok = validateField("vardas") && ok;
    ok = validateField("pavarde") && ok;
    ok = validateField("email") && ok;
    ok = validateField("adresas") && ok;
    return ok;
  }

  const phoneInput = form.querySelector('input[name="telefonas"]');
  let isFormattingPhone = false;

  function formatPhone() {
    if (!phoneInput) return;
    if (isFormattingPhone) return;
    isFormattingPhone = true;

    let digits = phoneInput.value.replace(/\D/g, "");

    if (digits.startsWith("370")) digits = digits.slice(3);
    else if (digits.startsWith("86")) digits = digits.slice(1);

    digits = digits.slice(0, 8);

    if (digits.length === 0) {
      phoneInput.value = "";
      isFormattingPhone = false;
      updateSubmitState();
      return;
    }

    let formatted = "+370 ";

    if (digits.length <= 3) formatted += digits;
    else formatted += digits.slice(0, 3) + " " + digits.slice(3);

    phoneInput.value = formatted;
    isFormattingPhone = false;
    updateSubmitState();
  }

  function isPhoneValid() {
    let digits = phoneInput.value.replace(/\D/g, "");
    if (digits.startsWith("370")) digits = digits.slice(3);
    else if (digits.startsWith("86")) digits = digits.slice(1);
    return digits.length === 8;
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", formatPhone);
    phoneInput.addEventListener("blur", formatPhone);
  }

  function areRatingsValid() {
    const r1 = Number(form.klausimas1.value);
    const r2 = Number(form.klausimas2.value);
    const r3 = Number(form.klausimas3.value);
    if (!r1 || !r2 || !r3) return false;
    return [r1, r2, r3].every(x => x >= 1 && x <= 10);
  }

  function hasErrors() {
    return Array.from(form.querySelectorAll(".field-error")).some(el => el.textContent.trim() !== "");
  }

  function areAllFilled() {
    return (
      form.vardas.value.trim() &&
      form.pavarde.value.trim() &&
      form.email.value.trim() &&
      form.telefonas.value.trim() &&
      form.adresas.value.trim() &&
      form.klausimas1.value &&
      form.klausimas2.value &&
      form.klausimas3.value
    );
  }

  function updateSubmitState() {
    const canSubmit =
      areAllFilled() &&
      !hasErrors() &&
      isPhoneValid() &&
      areRatingsValid();

    submitBtn.disabled = !canSubmit;
    submitBtn.style.opacity = canSubmit ? "1" : "0.6";
    submitBtn.style.cursor = canSubmit ? "pointer" : "not-allowed";
  }

  Object.keys(fields).forEach(key => {
    const input = fields[key];
    input.addEventListener("input", function () {
      validateField(key);
      updateSubmitState();
    });
    input.addEventListener("blur", function () {
      validateField(key);
      updateSubmitState();
    });
  });

  form.klausimas1.addEventListener("input", updateSubmitState);
  form.klausimas2.addEventListener("input", updateSubmitState);
  form.klausimas3.addEventListener("input", updateSubmitState);

  updateSubmitState();

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateAllMainFields() || !isPhoneValid() || !areRatingsValid()) {
      updateSubmitState();
      return;
    }

    const data = {
      vardas: form.vardas.value.trim(),
      pavarde: form.pavarde.value.trim(),
      email: form.email.value.trim(),
      telefonas: form.telefonas.value.trim(),
      adresas: form.adresas.value.trim(),
      klausimas1: form.klausimas1.value,
      klausimas2: form.klausimas2.value,
      klausimas3: form.klausimas3.value
    };

    console.log(data);

    resultBox.innerHTML = `
      <p><strong>Vardas:</strong> ${escapeHtml(data.vardas)}</p>
      <p><strong>Pavardė:</strong> ${escapeHtml(data.pavarde)}</p>
      <p><strong>El. paštas:</strong> 
        <a href="mailto:${encodeURIComponent(data.email)}">
          ${escapeHtml(data.email)}
        </a>
      </p>
      <p><strong>Tel. numeris:</strong> ${escapeHtml(data.telefonas)}</p>
      <p><strong>Adresas:</strong> ${escapeHtml(data.adresas)}</p>
      <p><strong>Klausimas 1:</strong> ${escapeHtml(data.klausimas1)}</p>
      <p><strong>Klausimas 2:</strong> ${escapeHtml(data.klausimas2)}</p>
      <p><strong>Klausimas 3:</strong> ${escapeHtml(data.klausimas3)}</p>
    `;

    const avg =
      (Number(data.klausimas1) +
       Number(data.klausimas2) +
       Number(data.klausimas3)) / 3;

    const averageLine = document.createElement("p");
    averageLine.style.marginTop = "15px";
    averageLine.style.fontWeight = "bold";
    averageLine.textContent = `${data.vardas} ${data.pavarde}: ${avg.toFixed(1)}`;
    resultBox.appendChild(averageLine);

    successPopup.style.display = "block";
    setTimeout(() => {
      successPopup.style.display = "none";
    }, 3000);
  });
})();