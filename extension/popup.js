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
    button.innerText = "View next hint";
  }
}

button.onclick = async () => {
  // First click: fetch all hints
  if (hints.length === 0) {
    const res = await chrome.runtime.sendMessage({
      action: "getHints"
    });

    if (res.error) {
      output.innerText = res.error;
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
