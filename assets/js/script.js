"use strict";

const navigation = document.querySelector("#navigation");
const menuToggle = document.querySelector(".menu-toggle");
const mobileQuery = window.matchMedia("(max-width: 760px)");
navigation.classList.add("is-enhanced");
function setMenu(open, restoreFocus = false) {
  navigation.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "Close" : "Menu";
  if (restoreFocus) menuToggle.focus();
}
function updateMenu() {
  menuToggle.hidden = !mobileQuery.matches;
  setMenu(false);
}
updateMenu();
mobileQuery.addEventListener("change", updateMenu);
menuToggle.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open"))
    setMenu(false, true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenu(false);
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
const filters = document.querySelector(".filters");
const filterButtons = [...filters.querySelectorAll("button")];
const projects = [...document.querySelectorAll("[data-category]")];
filters.hidden = false;
function filterProjects(category) {
  let visible = 0;
  projects.forEach((project) => {
    project.hidden =
      category !== "all" && project.dataset.category !== category;
    if (!project.hidden) visible++;
  });
  filterButtons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === category),
    ),
  );
  document.querySelector(".project-count").textContent =
    category === "all"
      ? `${visible} selected projects`
      : `${visible} of ${projects.length} projects`;
}
filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (button) filterProjects(button.dataset.filter);
});
document
  .querySelectorAll("[data-show-filter]")
  .forEach((link) =>
    link.addEventListener("click", () =>
      filterProjects(link.dataset.showFilter),
    ),
  );

const form = document.querySelector(".contact-form");
const formStatus = document.querySelector("#form-status");
const emailFallback = document.querySelector("#email-fallback");
const draftFields = ["name", "email", "message"].map((name) =>
  form.elements.namedItem(name),
);
function updateEmailDraft() {
  const [name, email, message] = draftFields.map((field) => field.value.trim());
  const subject = name ? `Portfolio enquiry from ${name}` : "Portfolio enquiry";
  const body = `${message}\n\nFrom: ${name}\nReply to: ${email}`;
  emailFallback.href = `mailto:guanhuacao@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
form.addEventListener("input", (event) => {
  event.target.removeAttribute("aria-invalid");
  updateEmailDraft();
});
updateEmailDraft();
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity() || form.dataset.sending === "true") return;
  const button = form.querySelector("button[type=submit]");
  const originalLabel = button.innerHTML;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  // Snapshot this submission. Keep the fields editable, and never erase a newer draft.
  const submittedValues = draftFields.map((field) => field.value);
  form.dataset.sending = "true";
  form.setAttribute("aria-busy", "true");
  button.disabled = true;
  button.textContent = "Sending…";
  formStatus.dataset.state = "pending";
  formStatus.textContent = "Sending your message…";
  draftFields.forEach((field) => field.removeAttribute("aria-invalid"));
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (
      !response.ok ||
      !data ||
      data.ok === false ||
      data.error ||
      data.errors?.length
    ) {
      const failure = new Error("Submission not confirmed");
      failure.status = response.status;
      failure.errors = Array.isArray(data?.errors) ? data.errors : [];
      throw failure;
    }
    formStatus.dataset.state = "success";
    formStatus.textContent =
      "Thanks for reaching out. Your message has been submitted successfully.";
    if (draftFields.every((field, i) => field.value === submittedValues[i]))
      form.reset();
    updateEmailDraft();
  } catch (error) {
    formStatus.dataset.state = "error";
    const fieldErrors = (error.errors || []).filter((item) =>
      ["name", "email", "message"].includes(item.field),
    );
    if (fieldErrors.length) {
      fieldErrors.forEach((item) =>
        form.elements
          .namedItem(item.field)
          .setAttribute("aria-invalid", "true"),
      );
      formStatus.textContent =
        "Please check the highlighted fields. Your message has not been sent.";
      form.elements.namedItem(fieldErrors[0].field).focus();
    } else if (error.status === 429) {
      formStatus.textContent =
        "The form is receiving too many requests. Please try again later or use the email option below.";
    } else if (error.name === "AbortError") {
      formStatus.textContent =
        "Delivery could not be confirmed before the connection timed out. Your draft is still here; use the email option below if needed.";
    } else {
      formStatus.textContent =
        "The form could not confirm delivery. Your draft is still here—please use the email option below or try again later.";
    }
    updateEmailDraft();
  } finally {
    clearTimeout(timer);
    form.dataset.sending = "false";
    form.setAttribute("aria-busy", "false");
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
});
