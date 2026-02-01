chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.action === "problemDetected") {
    const problemData = msg.problemData;

    chrome.storage.local.set({ currentProblem: problemData }, () => {
      console.log("Problem stored:", problemData);
      sendResponse({ success: true });
    });

    return true; // async storage write
  }

  if (msg.action === "getHints") {
    (async () => {
      try {
        const { currentProblem, hintsByProblem = {} } =
          await chrome.storage.local.get(["currentProblem", "hintsByProblem"]);

        if (!currentProblem) {
          console.log("Entered getHints but no currentProblem");
          sendResponse({ error: "No problem detected yet." });
          return;
        }
        const problemId =
          currentProblem.id ||
          currentProblem.slug ||
          currentProblem.title;
          
        // CHECK CACHE
        
        if (hintsByProblem[problemId]) {
          console.log("Returning cached hints");
          sendResponse({ hints: hintsByProblem[problemId], cached: true });
          return;
        }
        // FAKE API CALL (STUB)
        
        const hintsArray = [
          "Hint 1: Think about edge cases.",
          "Hint 2: Consider time complexity.",
          "Hint 3: Can this be solved with a hash map?"
        ];

        await new Promise(resolve => setTimeout(resolve, 200));
        console.log("Fetched new hints");

        // PERSIST TO STORAGE
        hintsByProblem[problemId] = hintsArray;

        await chrome.storage.local.set({ hintsByProblem });
        //SEND RESPONSE
        sendResponse({ hints: hintsArray, cached: false });

      } catch (err) {
        console.error(err);
        sendResponse({ error: "Failed to fetch hints." });
      }
    })();

    return true;
  }
});
