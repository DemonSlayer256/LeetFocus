let currentProblem = null;

// Listen for content script updates
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.action === "problemDetected") {
      currentProblem = msg.problemData;
      console.log("Problem updated:", currentProblem);
      return;
    }

    if (msg.action === "getHints") {
      if (!currentProblem) {
        sendResponse({ error: "No problem detected yet." });
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/getHints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemStatement: currentProblem.description,
            difficulty: currentProblem.difficulty
          })
        });

        const data = await response.json();

        // Convert { hint1, hint2, hint3 } → array
        const hintsArray = [data.hint1, data.hint2, data.hint3].filter(Boolean);

        sendResponse({ hints: hintsArray });
      } catch (err) {
        console.error(err);
        sendResponse({ error: "Failed to fetch hints." });
      }

      return true; // Keep message channel open for async
    }
  })();
});
