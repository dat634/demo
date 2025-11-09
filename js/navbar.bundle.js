
// ================== HọcVui Universal Navbar ==================
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyC_8Y5vYXvXc0kvYH0jNOziiR0t1TtStTg",
    authDomain: "myproject-7ba9f.firebaseapp.com",
    projectId: "myproject-7ba9f",
    storageBucket: "myproject-7ba9f.appspot.com",
    messagingSenderId: "614709937741",
    appId: "1:614709937741:web:d11e5325162c249cfdfe04",
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // === CSS inject ===
  const style = document.createElement("style");
  style.textContent = `
  :root {
    --orange: #ff6b35;
    --orange-light: #ffb463;
    --blue: #2563eb;
    --blue-light: #60a5fa;
    --bg-dark: #0f1724;
    --bg-light: #f7f9fc;
    --text-dark: #e5e7eb;
    --text-light: #111827;
  }
  #hv-navbar {
    font-family: 'Inter', sans-serif;
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    z-index: 100;
    transition: background 0.3s, color 0.3s;
  }
  body.dark #hv-navbar { background: rgba(10, 15, 25, 0.8); color: var(--text-dark); }
  body.light #hv-navbar { background: rgba(255, 255, 255, 0.85); color: var(--text-light); }

  #hv-navbar .brand {
    font-weight: 800; font-size: 22px;
    display: flex; align-items: center; gap: 4px;
    cursor: pointer; user-select: none;
  }
  .brand span {
    background: linear-gradient(90deg, var(--orange), var(--orange-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: transform .25s ease;
  }
  .brand:hover span { transform: scale(1.1); }

  .nav-links {
    display: flex; align-items: center; gap: 20px;
  }
  .nav-links a {
    text-decoration: none;
    font-weight: 600;
    position: relative;
    transition: color 0.3s;
  }
  body.dark .nav-links a { color: var(--text-dark); }
  body.light .nav-links a { color: var(--text-light); }

  .nav-links a::after {
    content: "";
    position: absolute; bottom: -5px; left: 0;
    width: 0; height: 2px;
    background: linear-gradient(90deg, var(--orange), var(--orange-light));
    transition: width 0.3s;
  }
  .nav-links a:hover::after { width: 100%; }

  /* Avatar */
  .user-section {
    position: relative;
    display: flex; align-items: center; gap: 10px;
  }
  .avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--orange);
    cursor: pointer;
  }
  .avatar-initial {
    width: 38px; height: 38px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--orange), var(--orange-light));
    color: #fff; font-weight: 700;
    cursor: pointer;
  }
  .user-menu {
    position: absolute; right: 0; top: 52px;
    background: rgba(30,30,40,0.95);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.05);
    display: none; flex-direction: column;
    overflow: hidden; min-width: 160px;
  }
  body.light .user-menu { background: #fff; border: 1px solid rgba(0,0,0,0.05); }
  .user-menu button {
    background: none; border: none;
    color: inherit; font-weight: 600;
    padding: 10px 14px; text-align: left;
    cursor: pointer;
    transition: background 0.2s;
  }
  .user-menu button:hover { background: rgba(255,255,255,0.1); }
  body.light .user-menu button:hover { background: rgba(0,0,0,0.05); }

  /* Mobile */
  .menu-toggle { display: none; font-size: 22px; cursor: pointer; }
  @media (max-width: 768px) {
    .nav-links { display: none; position: absolute; top:64px; left:0; right:0;
      flex-direction: column; background: rgba(10,15,25,0.9); padding: 16px; }
    .nav-links.show { display: flex; }
    .menu-toggle { display: block; }
    body.light .nav-links { background: rgba(255,255,255,0.9); }
  }`;
  document.head.appendChild(style);

  // === HTML ===
  const navHTML = `
  <nav id="hv-navbar">
    <div class="brand" id="hvLogo">Học<span>Vui</span></div>
    <div class="menu-toggle" id="menuToggle">☰</div>
    <div class="nav-links" id="navLinks">
      <a href="main-lobby.html">Home</a>
      <a href="main-study.html">Study</a>
      <a href="flashcard_final2.html">Play</a>
      <a href="statistical.html">Statistic</a>
      <a href="advance.html">Advance</a>
    </div>
    <div class="user-section" id="userSection">
      <div class="avatar-initial" id="userAvatar">?</div>
      <div class="user-menu" id="userMenu">
        <button id="profileBtn">Trang cá nhân</button>
        <button id="logoutBtn">Đăng xuất</button>
      </div>
    </div>
  </nav>`;
  const container = document.getElementById("navbar");
  if (container) container.innerHTML = navHTML;

  // === JS ===
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const hvLogo = document.getElementById("hvLogo");
  const userAvatar = document.getElementById("userAvatar");
  const userMenu = document.getElementById("userMenu");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  hvLogo.onclick = () => (location.href = "main-lobby.html");
  menuToggle.onclick = () => navLinks.classList.toggle("show");

  userAvatar.onclick = () => {
    userMenu.style.display = userMenu.style.display === "flex" ? "none" : "flex";
  };

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !userAvatar.contains(e.target)) {
      userMenu.style.display = "none";
    }
  });

  profileBtn.onclick = () => (location.href = ".././html/navbar-console/navbar-setting/setting_v2.html");
  logoutBtn.onclick = () => {
    auth.signOut().then(() => (location.href = "../../html/loginRegister/login.html"));
  };

  // === Firebase Auth Avatar ===
  auth.onAuthStateChanged((user) => {
    if (!user) {
      userAvatar.textContent = "!";
      userAvatar.classList.add("avatar-initial");
      return;
    }
    if (user.photoURL) {
      userAvatar.outerHTML = `<img src="${user.photoURL}" class="avatar" id="userAvatar">`;
    } else {
      userAvatar.textContent = user.displayName
        ? user.displayName[0].toUpperCase()
        : user.email[0].toUpperCase();
    }
  });

  // === Theme sync ===
  const theme = localStorage.getItem("hv_theme_v2");
  let mode = "dark";
  if (theme) {
    try {
      mode = JSON.parse(theme).mode || "dark";
    } catch (e) {}
  }
  document.body.classList.remove("dark", "light");
  document.body.classList.add(mode);
})();

