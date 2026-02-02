
# LeetFocus

## Introduction
**LeetFocus** is a powerful Chrome extension designed to enhance your coding experience on LeetCode. By generating contextual hints for the programming challenges you encounter, LeetFocus helps you approach problems with confidence and clarity. Unlike generic hints provided in the platform, LeetFocus offers tailored, implementation-oriented hints that are specifically designed to address the complexities of each problem. This makes it invaluable for both beginners and experienced developers seeking a deeper understanding of algorithms and code development.

---

## Why LeetFocus is Essential
While LeetCode already offers a hint section, these hints can often be vague or overly simplistic, leaving you with more questions than answers. **LeetFocus goes beyond that** by delivering hints that are actionable and precise, ensuring you're not just given a nudge but a clear direction on how to tackle the problem at hand. 

- **Technical Depth**: Our hints guide you through critical steps necessary for coding solutions, focusing on the underlying principles that govern algorithm design and implementation.
- **Contextual Relevance**: Each hint is directly linked to the specific problem's requirements, addressing potential pitfalls or common mistakes that may arise.
- **Confidence Building**: Having proper hints at your fingertips reduces anxiety and boosts your confidence, allowing you to approach problems more strategically and successfully.

---

## Features
- **Real-time Problem Detection**: Automatically detects when you’re on a new problem and stores its details.
- **Contextual Hints**: Fetches useful hints tailored to the specific problem at hand, ensuring you have the right guidance when you need it.
- **User-friendly Interface**: Simple and intuitive UI that allows you to navigate hints effortlessly.
- **Cache Mechanism**: Reduces loading times for hints you’ve previously accessed by storing them locally.

---

## Technical Overview

### Architecture
LeetFocus is built using a three-part architecture involving:
1. **Background Script (`background.js`)**: Manages message handling between the content and popup scripts. It retrieves hints from an external API and stores them locally for quick access.
2. **Content Script (`content.js`)**: Runs on problem pages, monitors for updates, and collects problem details such as title, description, and difficulty.
3. **Popup Script (`popup.js`)**: Provides the user interface for interacting with fetched hints. It handles user actions and updates the display in real time.

### Technology Stack
- **JavaScript**: The primary programming language used for building the extension.
- **Chrome Extensions API**: Utilizes Chrome's extension APIs for functionality such as message passing and local storage.
- **Fetch API**: For making requests to the external hints API.

### Key Functions
- `chrome.runtime.onMessage.addListener`: Listens for messages from other parts of the extension, enabling communication.
- `chrome.storage.local.set`: Saves data locally, ensuring your hints and problem states persist.
- `fetch()`: Retrieves hints from an external service, providing timely assistance directly in your coding environment.

---

## Getting Started

### Installation
1. Download the latest release of LeetFocus from [the GitHub repository](#).
2. Navigate to `chrome://extensions/` in your Chrome browser.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click "Load unpacked" and select the directory for the downloaded extension.
5. Pin the LeetFocus icon to your browser toolbar for easy access.

### Usage
1. Open a LeetCode problem page.
2. Click on the LeetFocus icon in your toolbar.
3. Press the "Get Hint" button, and watch as the hints populate! 
4. Use the button to cycle through available hints.

---

## Contributing
LeetFocus is an open-source project! If you have suggestions, improvements, or bug fixes:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License
This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

---

## Issues
For questions, feedback, or support, please raise an issue in the repository. We appreciate your contributions and will address any concerns promptly

---

LeetFocus is here to help you conquer your coding challenges and elevate your skills, one hint at a time!
    