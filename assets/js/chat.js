"use strict";

(() => {
  const dialog = document.querySelector("#assistant");
  const launcher = document.querySelector(".assistant-launcher");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const form = dialog.querySelector("form");
  const input = form.querySelector("input");
  const sendButton = form.querySelector("button");
  const log = dialog.querySelector(".assistant-messages");
  const suggestions = [...dialog.querySelectorAll("[data-question]")];
  const history = [];
  let pending = false;
  const endpoint = dialog.dataset.endpoint || "";
  const context = `You are an AI guide on Luke (Guanhua) Cao's personal portfolio, not Luke himself. Answer concisely using only this information. Luke is a Sydney-based Senior Machine Learning Engineer at Beamtree, focused on production ML systems, MLOps and healthcare. His LinkedIn also lists The Evolve Collaborative (2025), RxMx Nightingale cloud NLP service (April 2020 to January 2022), medical image segmentation (April to May 2020), and University of Sydney education (2017 to 2019; degree unspecified). Skills: regression, gradient boosting, random forests, ensemble forecasting, clinical NLP and information extraction, LLM agents, retrieval-augmented generation, health record analytics, clinical decision support, and predictive patient monitoring. Projects: ML forecasting for the Health Roundtable Insights Platform; clinical notes analysis; patient deterioration prediction using vital signs and lab results; automated ICD and procedure coding using LLM agents and RAG. Do not invent employers, dates, qualifications, years of experience, outcomes, availability, or additional skills. Do not give medical advice. Contact: guanhuacao@outlook.com, LinkedIn https://www.linkedin.com/in/guanhuacao/, GitHub https://github.com/cadae. Direct detailed project or recruitment questions to Luke.`;
  const disclosure = dialog.querySelector(".assistant-disclosure");
  if (endpoint)
    disclosure.textContent =
      "An AI guide to Luke’s work, not Luke. Questions are sent to an external AI service. Please do not include patient or confidential information.";
  function portfolioAnswer(question) {
    const text = question.toLowerCase();
    if (
      /contact|email|touch|hire|hiring|recruit|collaborat/.test(text) &&
      !/evolve/.test(text)
    )
      return "You can reach Luke at guanhuacao@outlook.com, or through LinkedIn: https://www.linkedin.com/in/guanhuacao/. Use the contact form below to send an enquiry about roles, collaboration, or a project.";
    if (/evolve|roundtable|forecast/.test(text))
      return "Luke’s work includes machine learning forecasting for the Health Roundtable Insights Platform. His portfolio also features the Evolve Collaborative, which brings analytics and predictive forecasting to hospital performance improvement. See Selected work for the project details and product links.";
    if (/coding|rag|llm|language|nlp|notes/.test(text))
      return "Luke’s language AI work includes clinical information extraction and automated clinical coding using LLM agents and retrieval-augmented generation (RAG). His earlier RxMx Nightingale project was a cloud NLP service for creating, training, and managing models.";
    if (/patient|deteriorat|ainsoff|monitor/.test(text))
      return "The patient monitoring work brings vital signs and laboratory results together to support deterioration risk assessment and earlier clinical decisions. The portfolio links to the Ainsoff product and its published study results; those are product-level results.";
    if (/skill|technolog|stack|mlops|expert|production/.test(text))
      return "Luke’s focus is production machine learning, MLOps, and healthcare AI. His listed methods include regression, gradient boosting, random forests, ensemble forecasting, clinical NLP, LLM agents, and RAG. For a detailed technology stack, please ask Luke directly.";
    if (/beamtree|current|employ|role|experience|work|project/.test(text))
      return "Luke is a Senior Machine Learning Engineer at Beamtree in Sydney. His current focus is production ML systems, MLOps, and applied healthcare AI. The portfolio highlights hospital forecasting, the Evolve Collaborative, clinical information extraction, automated coding, and patient monitoring.";
    if (/education|university|degree/.test(text))
      return "Luke’s profile lists University of Sydney education from 2017 to 2019. A degree title is not specified in this portfolio; his LinkedIn profile has further details.";
    if (/hello|^hi\b|hey/.test(text))
      return "Hi! I’m a guide to the information on this portfolio. Ask about Luke’s current Beamtree role, healthcare projects, skills, or how to get in touch.";
    return "I can answer questions about Luke’s Beamtree role, projects, skills, and contact details using the information on this page. For anything more specific, email guanhuacao@outlook.com. Live AI responses are currently unavailable.";
  }
  launcher.hidden = false;
  launcher.addEventListener("click", () => dialog.showModal());
  dialog
    .querySelector(".assistant-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    )
      dialog.close();
  });
  function addMessage(text, kind = "") {
    const paragraph = document.createElement("p");
    paragraph.className = `chat-message ${kind}`;
    paragraph.textContent = text;
    log.append(paragraph);
    log.scrollTop = log.scrollHeight;
    return paragraph;
  }
  async function send(question) {
    if (pending || !question.trim()) return;
    const message = question.trim().slice(0, 1500);
    if (!endpoint) {
      addMessage(message, "chat-message-user");
      input.value = "";
      addMessage(portfolioAnswer(message));
      input.focus();
      return;
    }
    pending = true;
    sendButton.disabled = true;
    suggestions.forEach((button) => {
      button.disabled = true;
    });
    addMessage(message, "chat-message-user");
    input.value = "";
    const typing = addMessage("Thinking…");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            { role: "system", content: context },
            ...history.slice(-12),
            { role: "user", content: message },
          ],
        }),
      });
      if (!response.ok) throw new Error("Service unavailable");
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (typeof answer !== "string" || !answer.trim())
        throw new Error("Empty response");
      typing.remove();
      addMessage(answer);
      history.push(
        { role: "user", content: message },
        { role: "assistant", content: answer },
      );
    } catch {
      typing.remove();
      addMessage(
        "The AI service is unavailable. From the portfolio: " +
          portfolioAnswer(message),
        "chat-error",
      );
      if (!input.value) input.value = message;
    } finally {
      clearTimeout(timer);
      pending = false;
      sendButton.disabled = false;
      suggestions.forEach((button) => {
        button.disabled = false;
      });
      if (dialog.open) input.focus();
    }
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    send(input.value);
  });
  suggestions.forEach((button) =>
    button.addEventListener("click", () => send(button.dataset.question)),
  );
})();
