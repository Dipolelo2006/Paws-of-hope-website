// main.js - Paws of Hope interactive features

document.addEventListener("DOMContentLoaded", function () {

  initLightbox();
  initAnimalSearch();
  initAccordion();
  initFormValidation();
  initSmoothScroll();
});

// LIGHTBOX GALLERY (for animal images)
function initLightbox() {
  const images = document.querySelectorAll(".animal-card img, #hero img, section img");
  if (!images.length) return;

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  overlay.innerHTML = `
    <div class="lightbox-content">
      <button id="lightbox-close" aria-label="Close">&times;</button>
      <img id="lightbox-img" src="" alt="">
    </div>
  `;
  document.body.appendChild(overlay);

  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");

  images.forEach(function (img) {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
}

// ANIMAL SEARCH / FILTER
function initAnimalSearch() {
  const section = document.getElementById("animal-profiles");
  if (!section) return;

  const searchBox = document.createElement("div");
  searchBox.className = "search-box";
  searchBox.innerHTML = `
    <label for="animal-search">Search animals:</label>
    <input type="text" id="animal-search" placeholder="Type name, dog, cat, size..." aria-label="Search animals">
  `;
  const heading = section.querySelector("h2");
  if (heading && heading.nextSibling) {
    section.insertBefore(searchBox, heading.nextSibling);
  } else {
    section.appendChild(searchBox);
  }

  const input = document.getElementById("animal-search");
  const cards = section.querySelectorAll(".animal-card");

  input.addEventListener("input", function () {
    const term = input.value.toLowerCase().trim();
    cards.forEach(function (card) {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? "" : "none";
    });
  });
}

// ACCORDION (How Adoption Works)
function initAccordion() {
  const lists = document.querySelectorAll("section ol");
  lists.forEach(function (ol) {
    const heading = ol.previousElementSibling;
    if (!heading || heading.tagName !== "H2") return;
    if (!heading.textContent.toLowerCase().includes("adoption works")) return;

    ol.classList.add("accordion-list");
    const items = ol.querySelectorAll("li");
    items.forEach(function (li, index) {
      const content = li.innerHTML;
      li.innerHTML = "";
      li.classList.add("accordion-item");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "accordion-btn";
      btn.setAttribute("aria-expanded", index === 0 ? "true" : "false");
      btn.innerHTML = '<span>Step ' + (index + 1) + '</span> <span class="accordion-icon">' + (index === 0 ? "−" : "+") + '</span>';

      const panel = document.createElement("div");
      panel.className = "accordion-panel" + (index === 0 ? " open" : "");
      panel.innerHTML = content;

      btn.addEventListener("click", function () {
        const isOpen = panel.classList.contains("open");
        ol.querySelectorAll(".accordion-panel").forEach(function (p) {
          p.classList.remove("open");
        });
        ol.querySelectorAll(".accordion-btn").forEach(function (b) {
          b.setAttribute("aria-expanded", "false");
          const icon = b.querySelector(".accordion-icon");
          if (icon) icon.textContent = "+";
        });
        if (!isOpen) {
          panel.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          const icon = btn.querySelector(".accordion-icon");
          if (icon) icon.textContent = "−";
        }
      });

      li.appendChild(btn);
      li.appendChild(panel);
    });
  });
}

// FORM VALIDATION (enquiry + contact)
function initFormValidation() {
  const forms = document.querySelectorAll("form");
  forms.forEach(function (form) {
    form.setAttribute("novalidate", "true");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);

      let valid = true;
      const requiredFields = form.querySelectorAll("[required]");

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          showError(field, "This field is required.");
          valid = false;
        }
      });

      const email = form.querySelector('input[type="email"]');
      if (email && email.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
          showError(email, "Please enter a valid email address.");
          valid = false;
        }
      }

      const phone = form.querySelector('input[type="tel"]');
      if (phone && phone.value.trim()) {
        const phonePattern = /^[0-9\s\-\+\(\)]{7,15}$/;
        if (!phonePattern.test(phone.value.trim())) {
          showError(phone, "Please enter a valid phone number.");
          valid = false;
        }
      }

      if (valid) {
        showSuccess(form);
        form.reset();
      }
    });
  });
}

function showError(field, message) {
  field.classList.add("error-field");
  const error = document.createElement("span");
  error.className = "error-message";
  error.textContent = message;
  field.parentNode.insertBefore(error, field.nextSibling);
}

function clearErrors(form) {
  form.querySelectorAll(".error-message").forEach(function (el) {
    el.remove();
  });
  form.querySelectorAll(".error-field").forEach(function (el) {
    el.classList.remove("error-field");
  });
  const oldSuccess = form.querySelector(".success-message");
  if (oldSuccess) oldSuccess.remove();
}

function showSuccess(form) {
  const msg = document.createElement("div");
  msg.className = "success-message";
  msg.setAttribute("role", "alert");

  if (form.closest("#adoption-form") || form.closest("#volunteer-form") || form.closest("#donation-form")) {
    msg.innerHTML = "<strong>Thank you!</strong> Your enquiry has been received. We will get back to you within a few working days.";
  } else {
    msg.innerHTML = "<strong>Thank you!</strong> Your message has been sent. We will reply as soon as we can.";
  }

  form.appendChild(msg);
  msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// SMOOTH SCROLL for internal links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
