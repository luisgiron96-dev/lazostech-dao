const DIAMOND_ADDRESS = "0xd225CBF92DC4a0A9512094B215b7b4Df2870DeE8";

const DAO_ABI = [
  "function openSession(string calldata name)",
  "function createResolution(string calldata description)",
  "function vote(uint256 resolutionId, bool support)"
];

let provider;
let signer;
let daoContract;

/* =========================
   🔗 CONNECT WALLET
========================= */
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask no está instalado");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);

  // 🔐 Solicita conexión
  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();
  const address = await signer.getAddress();

  // UI
  document.getElementById("walletAddress").innerText =
    `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;

  document.getElementById("connectWallet").innerText = "✅ Wallet Connected";

  daoContract = new ethers.Contract(
    DIAMOND_ADDRESS,
    DAO_ABI,
    signer
  );
}

/* =========================
   🏛 OPEN SESSION
========================= */
async function openSession() {
  if (!daoContract) {
    alert("Connect wallet first");
    return;
  }

  const name = document.getElementById("sessionName").value;
  const tx = await daoContract.openSession(name);
  await tx.wait();

  alert("Session opened successfully");
}

/* =========================
   📜 CREATE RESOLUTION
========================= */
async function createResolution() {
  if (!daoContract) {
    alert("Connect wallet first");
    return;
  }

  const text = document.getElementById("resolutionText").value;
  const tx = await daoContract.createResolution(text);
  await tx.wait();

  alert("Resolution created");
}

/* =========================
   🗳 VOTE
========================= */
async function vote(support) {
  if (!daoContract) {
    alert("Connect wallet first");
    return;
  }

  const id = document.getElementById("resolutionId").value;
  const tx = await daoContract.vote(id, support);
  await tx.wait();

  alert(`Vote ${support ? "YES" : "NO"} submitted`);
}

/* =========================
   🔁 AUTO DETECT WALLET
========================= */
async function autoConnect() {
  if (!window.ethereum) return;

  provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_accounts", []);

  if (accounts.length > 0) {
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    document.getElementById("walletAddress").innerText =
      `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;

    document.getElementById("connectWallet").innerText = "✅ Wallet Connected";

    daoContract = new ethers.Contract(
      DIAMOND_ADDRESS,
      DAO_ABI,
      signer
    );
  }
}

/* =========================
   🔄 LISTENERS
========================= */
document
  .getElementById("connectWallet")
  .addEventListener("click", connectWallet);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => location.reload());
}

/* Auto-run */
autoConnect();