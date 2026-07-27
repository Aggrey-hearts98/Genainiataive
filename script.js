document.addEventListener("DOMContentLoaded", () => {

  // Mobile Menu Toggle
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // === COLLABORATE FORM (now real backend call) ===
  const form = document.getElementById("collabForm");
  const statusEl = document.getElementById("formStatus");
  const statusEl = document.getElementById("formstatus");

  if (form && statusEl) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const type = document.getElementById("type").value;
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !type || !message) {
        statusEl.textContent = "Please fill in all fields.";
        statusEl.style.color = "red";
        return;
      }

      statusEl.textContent = "Submitting...";
      statusEl.style.color = "#0f2c3d";

      try {
        const response = await fetch('/api/collaborate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, type, message })
        });

        const result = await response.json();

        if (response.ok) {
          statusEl.textContent = result.message;
          statusEl.style.color = "green";
          form.reset();
        } else {
          statusEl.textContent = result.message || "Something went wrong.";
          statusEl.style.color = "red";
        }
      } catch (err) {
        statusEl.textContent = "Network error. Please try again.";
        statusEl.style.color = "red";
      }
    });
  }
});