// content.js
// Runs on https://leetcode.com/problems/*

/*  Polling-based description wait */

function waitForNewDescription(prevDescription, timeout = 10000, interval = 200) {
  return new Promise((resolve) => {
    const start = Date.now();

    const timer = setInterval(() => {
      const el = document.querySelector('[data-track-load="description_content"]');
      if (!el) return;

      const text = el.innerText.trim();
      if (text && text !== prevDescription) {
        clearInterval(timer);
        resolve(text);
      }

      if (Date.now() - start > timeout) {
        clearInterval(timer);
        resolve(text);
      }
    }, interval);
  });
}

/*  Scraper */

function getProblemStatement() {
  const match = window.location.pathname.match(/^\/problems\/([^\/]+)/);
  if (!match) return null;

  const slug = match[1];
  const title = slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const descriptionEl = document.querySelector(
    '[data-track-load="description_content"]'
  );

  const description = descriptionEl?.innerText.trim();
  if (!description) return null;

  return {
    title,
    description,
    descriptionLength: description.length,
    url: window.location.href
  };
}

/*  State */

let lastUrl = null;
let lastDescription = null;
let lastProblemKey = null;
let debounceTimer = null;

/*  Core Logic */

async function detectProblemUpdate(reason) {
  const urlChanged = window.location.href !== lastUrl;
  if (!urlChanged) return;

  lastUrl = window.location.href;

  const initial = getProblemStatement();
  if (!initial) return;

  const oldDescription = lastDescription ?? initial.description;

  // 🔑 WAIT UNTIL DESCRIPTION CONTENT ACTUALLY CHANGES
  const newDescription = await waitForNewDescription(oldDescription);

  const final = getProblemStatement();
  if (!final) return;

  // Calculate key ONLY AFTER description is finalized
  const problemKey =
    `${final.title}-${final.url}-${final.descriptionLength}`;

  if (problemKey === lastProblemKey) return;

  lastProblemKey = problemKey;
  lastDescription = final.description;

  chrome.runtime.sendMessage({
    action: "problemDetected",
    problemData: final
  });
}

/*  Init */

(async function init() {
  lastUrl = window.location.href;
  const initial = getProblemStatement();
  if (initial) {
    lastDescription = initial.description;
    lastProblemKey =
      `${initial.title}-${initial.url}-${initial.descriptionLength}`;
  }
})();

/*  SPA Observer (URL-based only) */

const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    detectProblemUpdate("url-change");
  }, 300);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

/*  Message Listener */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProblemStatement") {
    sendResponse({ problemData: getProblemStatement() });
  }
});
