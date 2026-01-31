// content.js
// Runs on https://leetcode.com/problems/*

// ---------------------------
// Utility: wait for an element
// ---------------------------
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

// ---------------------------
// Core scraper
// ---------------------------
function getProblemStatement() {
  // Title (fairly stable)
  const titleEl = document.querySelector("h4");

  // Description container
  const descriptionEl = document.querySelector(
    '[data-track-load="description_content"]'
  );

  // Difficulty (text-based, safest)
  const difficultyEl = Array.from(document.querySelectorAll("span"))
    .find(el =>
      ["Easy", "Medium", "Hard"].includes(el.innerText.trim())
    );

  if (!titleEl || !descriptionEl) {
    return null;
  }

  return {
    title: titleEl.innerText.trim(),
    description: descriptionEl.innerText.trim(),
    difficulty: difficultyEl?.innerText.trim() || "Unknown",
    url: window.location.href
  };
}

// ---------------------------
// State
// ---------------------------
let lastProblemKey = null;

// ---------------------------
// Notify background if problem changes
// ---------------------------
function notifyIfProblemChanged() {
  const data = getProblemStatement();
  if (!data) return;

  const problemKey = `${data.title}-${data.url}`;
  if (problemKey === lastProblemKey) return;

  lastProblemKey = problemKey;

  chrome.runtime.sendMessage({
    action: "problemDetected",
    problemData: data
  });
}

// ---------------------------
// Initial load (important)
// ---------------------------
(async function init() {
  // Wait until the description actually exists
  await waitForElement('[data-track-load="description_content"]');
  notifyIfProblemChanged();
})();

// ---------------------------
// SPA navigation detection
// ---------------------------
const observer = new MutationObserver(() => {
  notifyIfProblemChanged();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// ---------------------------
// Message listener (popup/background pull access)
// ---------------------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProblemStatement") {
    sendResponse({ problemData: getProblemStatement() });
  }
});
