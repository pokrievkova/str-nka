document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const yearElement = document.querySelector("#current-year");
const bookingForm = document.querySelector("#booking-form");
const bookingDate = document.querySelector("#booking-date");
const formFeedback = document.querySelector("#form-feedback");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (bookingDate) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
  bookingDate.min = localToday;
}

if (menuToggle && navLinks) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otvoriť navigáciu");
    navLinks.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Otvoriť navigáciu" : "Zavrieť navigáciu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

if (bookingForm && formFeedback) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
      return;
    }

    const formData = new FormData(bookingForm);
    const service = formData.get("service");
    const date = formData.get("date");
    const time = formData.get("time");
    const name = formData.get("name");

    if (
      typeof service !== "string" ||
      typeof date !== "string" ||
      typeof time !== "string" ||
      typeof name !== "string"
    ) {
      formFeedback.textContent = "Skontrolujte, prosím, vyplnené povinné údaje.";
      return;
    }

    const formattedDate = new Intl.DateTimeFormat("sk-SK", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(`${date}T12:00:00`));

    const firstName = name.trim().split(/\s+/)[0];
    formFeedback.textContent = `Ďakujeme${firstName ? `, ${firstName}` : ""}! Ukážková rezervácia služby ${service} na ${formattedDate} o ${time} je pripravená. Nebola odoslaná do systému štúdia a termín nie je potvrdený.`;
  });
}
