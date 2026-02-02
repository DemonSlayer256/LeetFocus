chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.action === "problemDetected") {
    const problemData = msg.problemData;

    chrome.storage.local.set({ currentProblem: problemData }, () => {
      console.log("Problem stored:", problemData);
      sendResponse({ success: true });
    });

    return true;
  }

  if (msg.action === "getHints") {
    (async () => {
      try {
        const { currentProblem, hintsByProblem = {} } =
          await chrome.storage.local.get(["currentProblem", "hintsByProblem"]);

        if (!currentProblem) {
          sendResponse({ error: "No problem detected yet." });
          return;
        }
        const problemId =
          currentProblem.id ||
          currentProblem.slug ||
          currentProblem.title;

        if (hintsByProblem[problemId]) {
          console.log("Returning cached hints");
          sendResponse({
            hints: hintsByProblem[problemId],
            cached: true
          });
          return;
        }

        const response = await fetch("https://leetfocus.vercel.app/api/getHints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            problemStatement: currentProblem.description,
            difficulty: currentProblem.difficulty
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        const hintsArray = [
          data.hint1,
          data.hint2,
          data.hint3
        ].filter(Boolean);

        if (hintsArray.length === 0) {
          throw new Error("No hints returned from API");
        }

        hintsByProblem[problemId] = hintsArray;

        await chrome.storage.local.set({ hintsByProblem });

        sendResponse({
          hints: hintsArray,
          cached: false
        });

      } catch (err) {
        console.error("Failed to fetch hints:", err);
        sendResponse({ error: "Failed to fetch hints." });
      }
    })();

    return true;
  }
});
