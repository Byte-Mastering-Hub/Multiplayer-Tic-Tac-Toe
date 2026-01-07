// =================================================================================
//  IMPORTS - Firebase SDK modules
// =================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// =================================================================================
//  DOM ELEMENTS
// =================================================================================
const lobbySection = document.getElementById("lobby-section");
const createGameBtn = document.getElementById("create-game-btn");
const joinGameBtn = document.getElementById("join-game-btn");
const gameIdInput = document.getElementById("game-id-input");
const userIdElement = document.getElementById("user-id-text");

const gameBoardContainer = document.getElementById("game-board-container");
const gameBoard = document.getElementById("game-board");
const gameIdDisplay = document.getElementById("game-id-display");
const statusText = document.getElementById("status-text");
const resetGameBtn = document.getElementById("reset-game-btn");

// =================================================================================
//  FIREBASE CONFIG
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDR3P-3mc_IZ0PYC4NS5XR9W-Z_dixPsio",
  authDomain: "tic-tac-toe-online-7b13e.firebaseapp.com",
  projectId: "tic-tac-toe-online-7b13e",
  storageBucket: "tic-tac-toe-online-7b13e.firebasestorage.app",
  messagingSenderId: "1066784917631",
  appId: "1:1066784917631:web:8ba98a29a24a23abe5174a"
};

// =================================================================================
//  GLOBAL STATE
// =================================================================================
let db, auth;
let currentGameId = null;
let currentPlayerSymbol = null;
let unsubscribeGame = null;
let authReady = false;

// Disable buttons until auth is ready
createGameBtn.disabled = true;
joinGameBtn.disabled = true;

// =================================================================================
//  INITIALIZE FIREBASE + AUTH
// =================================================================================
function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userIdElement.textContent = user.uid;
      authReady = true;

      createGameBtn.disabled = false;
      joinGameBtn.disabled = false;
    } else {
      signInAnonymously(auth).catch(console.error);
    }
  });
}

// =================================================================================
//  CREATE GAME
// =================================================================================
const createNewGame = async () => {
  if (!authReady || !auth.currentUser) {
    alert("Connecting... please wait");
    return;
  }

  const userId = auth.currentUser.uid;
  const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const gameRef = doc(db, "tictactoe_games", gameId);

  await setDoc(gameRef, {
    board: Array(9).fill(null),
    players: { X: userId, O: null },
    currentPlayer: "X",
    status: "waiting",
    winner: null
  });

  currentGameId = gameId;
  currentPlayerSymbol = "X";

  showGameScreen();
  listenToGameUpdates(gameId);
};

// =================================================================================
//  JOIN GAME
// =================================================================================
const joinGame = async () => {
  if (!authReady || !auth.currentUser) {
    alert("Connecting... please wait");
    return;
  }

  const gameId = gameIdInput.value.trim().toUpperCase();
  if (!gameId) return alert("Enter Game ID");

  const gameRef = doc(db, "tictactoe_games", gameId);
  const snap = await getDoc(gameRef);

  if (!snap.exists()) return alert("Game not found");

  const data = snap.data();
  const userId = auth.currentUser.uid;

  if (!data.players.O && data.players.X !== userId) {
    await updateDoc(gameRef, {
      "players.O": userId,
      status: "active"
    });
    currentPlayerSymbol = "O";
  } else if (data.players.X === userId) {
    currentPlayerSymbol = "X";
  } else if (data.players.O === userId) {
    currentPlayerSymbol = "O";
  } else {
    return alert("Game already full");
  }

  currentGameId = gameId;
  showGameScreen();
  listenToGameUpdates(gameId);
};

// =================================================================================
//  REALTIME GAME LISTENER
// =================================================================================
function listenToGameUpdates(gameId) {
  if (unsubscribeGame) unsubscribeGame();

  const gameRef = doc(db, "tictactoe_games", gameId);
  unsubscribeGame = onSnapshot(gameRef, (snap) => {
    const data = snap.data();
    if (data) {
      renderBoard(data);
      updateStatus(data);
    }
  });
}

// =================================================================================
//  GAME LOGIC
// =================================================================================
const handleCellClick = async (data, index) => {
  const userId = auth.currentUser.uid;

  if (
    data.status !== "active" ||
    data.players[data.currentPlayer] !== userId ||
    data.board[index] !== null
  ) return;

  const board = [...data.board];
  board[index] = data.currentPlayer;

  const winner = checkWinner(board);
  let status = "active";

  if (winner) status = "won";
  else if (!board.includes(null)) status = "draw";

  await updateDoc(doc(db, "tictactoe_games", currentGameId), {
    board,
    currentPlayer: data.currentPlayer === "X" ? "O" : "X",
    status,
    winner
  });
};

function checkWinner(board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// =================================================================================
//  RESET GAME
// =================================================================================
const resetGame = async () => {
  await updateDoc(doc(db, "tictactoe_games", currentGameId), {
    board: Array(9).fill(null),
    currentPlayer: "X",
    status: "active",
    winner: null
  });
  resetGameBtn.classList.add("hidden");
};

// =================================================================================
//  UI RENDERING
// =================================================================================
function renderBoard(data) {
  gameBoard.innerHTML = "";
  data.board.forEach((value, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (value) cell.classList.add(value.toLowerCase());
    cell.textContent = value || "";
    cell.onclick = () => handleCellClick(data, i);
    gameBoard.appendChild(cell);
  });
}

function updateStatus(data) {
  const userId = auth.currentUser.uid;

  if (data.status === "waiting") {
    statusText.textContent = "Waiting for opponent...";
  } else if (data.status === "active") {
    statusText.textContent =
      data.players[data.currentPlayer] === userId
        ? "Your turn!"
        : "Opponent's turn";
    resetGameBtn.classList.add("hidden");
  } else if (data.status === "won") {
    statusText.textContent =
      data.winner === currentPlayerSymbol ? "You Won 🎉" : "You Lost 😕";
    resetGameBtn.classList.remove("hidden");
  } else {
    statusText.textContent = "Draw 🤝";
    resetGameBtn.classList.remove("hidden");
  }
}

function showGameScreen() {
  lobbySection.classList.add("hidden");
  gameBoardContainer.classList.remove("hidden");
  gameIdDisplay.textContent = currentGameId;
}

// =================================================================================
//  EVENTS
// =================================================================================
createGameBtn.onclick = createNewGame;
joinGameBtn.onclick = joinGame;
resetGameBtn.onclick = resetGame;

gameIdDisplay.onclick = () => {
  navigator.clipboard.writeText(currentGameId);
  gameIdDisplay.textContent = "Copied!";
  setTimeout(() => gameIdDisplay.textContent = currentGameId, 1200);
};

// =================================================================================
//  START APP
// =================================================================================
initializeFirebase();
