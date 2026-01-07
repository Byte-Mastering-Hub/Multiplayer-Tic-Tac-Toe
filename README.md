# ❌⭕ Real-Time Multiplayer Tic-Tac-Toe

A modern, real-time multiplayer Tic-Tac-Toe game built with **HTML5**, **CSS3**, and **JavaScript**. It features a lobby system for matchmaking and integrates with **Firebase** to sync game state instantly between two players across different devices.

## 🚀 Features

- **Real-Time Multiplayer:** Instant moves and status updates using Firestore.
- **Lobby System:** Create a private game room or join one using a unique 6-character Game ID.
- **Turn-Based Logic:** Prevents move collisions and automatically detects wins or draws.
- **Responsive Design:** Optimized layout for desktops and mobile devices using CSS Grid and Flexbox.
- **User Feedback:** Dynamic status messages (Waiting, Your Turn, Win/Loss) and easy “Copy ID” functionality.
- **Anonymous Auth:** Seamless background authentication without requiring user sign-ups.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6 Modules).
- **Backend / Database:** Firebase Firestore (NoSQL).
- **Authentication:** Firebase Auth (Anonymous sign-in).

## 📂 Project Structure

```text
.
├── index.html   # Main UI, lobby, and game board container
├── script.js    # Game logic, Firebase connections, and state management
├── style.css    # Styling, animations, and responsive layout
└── README.md    # Project documentation
```

## ⚙️ Firebase Configuration

1. Open `script.js`.
2. Locate the `firebaseConfig` object near the top of the file (around line 27).
3. Replace the placeholder values with your Firebase project keys.

```javascript
// =================================================================================
//  FIREBASE CONFIGURATION - PASTE YOUR CONFIG HERE
// =================================================================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

> **Note:** Copy the full config object from **Firebase Console → Project Settings → General → Your Apps**.

## 📦 Running Locally

Because the project uses JavaScript modules (`type="module"`), you must serve it via a local server rather than opening the file directly.

### Visual Studio Code (Recommended)

- Install the **Live Server** extension by Ritwick Dey.
- Right-click `index.html` and select **Open with Live Server**.

### Python

```bash
python -m http.server
```

Visit `http://localhost:8000`.

## 🎮 Gameplay

1. **Create Game:** Click **Create New Game** to generate a unique Game ID (e.g., `X7K9LP`).
2. **Invite:** Click the Game ID to copy it and share it with a friend.
3. **Join Game:** The second player enters the ID in the “Enter Game ID” box and clicks **Join**.
4. **Play:** Player 1 is X and starts first; Player 2 is O.
5. **Result:** The game detects wins, losses, or draws automatically and allows for a reset.

## 👩‍💻 Author

- **ByteMasteringHub** — Web & iOS Developer
- 📧 [sumitsumit53092@gmail.com](mailto:sumitsumit53092@gmail.com)
- 🔗 [LinkedIn](https://www.linkedin.com/in/sumit-tak-9049092b5/)
- 🔗 [GitHub](https://github.com/Byte-Mastering-Hub)

## 📜 License

This project is open source and free to use.

## ⚠️ Important

If your Firestore security rules are set to **locked mode**, the game will not write data. Ensure your Firestore rules allow reads/writes for authenticated users.
