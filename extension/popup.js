let hints = [];
let currentHintIndex = 0;

const button = document.getElementById("getHintBtn");
const output = document.getElementById("hintOutput");
const counter = document.getElementById("hintCounter");

function updateUI() {
  output.innerText = hints[currentHintIndex];
  counter.innerText = `Hints left: ${hints.length - currentHintIndex - 1}`;

  if (currentHintIndex === hints.length - 1) {
    button.disabled = true;
    button.innerText = "No more hints";
  } else {
    button.disabled = false;
    button.innerText = "View next hint";
  }
  console.log("UI updated");
}

button.onclick = async () => {
  // First click: fetch all hints
  console.log("Button clicked");
  if (hints.length === 0) {
    button.disabled = true;
    button.innerText = "Loading...";

    const res = await chrome.runtime.sendMessage({
      action: "getHints"
    });

    if (!res || res.error) {
      console.log("Error fetching hints:", res?.error);
      output.innerText = res?.error || "Failed to fetch hints";
      button.disabled = false;
      button.innerText = "Get Hint";
      return;
    }

    hints = res.hints.slice(0, 3); // enforce 3 hints
    currentHintIndex = 0;
    updateUI();
  } else {
    // Subsequent clicks: show next hint
    currentHintIndex++;
    updateUI();
  }
};
