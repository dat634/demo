/* === HOCVUI NAVBAR SYSTEM === */
/* Author: HọcVui Dev 2025 */

(function(){
  // === FIREBASE INIT ===
  const firebaseConfig = {
    apiKey: "AIzaSyC_8Y5vYXvXc0kvYH0jNOziiR0t1TtStTg",
    authDomain: "myproject-7ba9f.firebaseapp.com",
    projectId: "myproject-7ba9f",
    storageBucket: "myproject-7ba9f.appspot.com",
    messagingSenderId: "614709937741",
    appId: "1:614709937741:web:d11e5325162c249cfdfe04",
    measurementId: "G-LB9VZG4BHB"
  };
  if (!window.firebase) {
    const s1 = document.createElement("script");
    const s2 = document.createElement("script");
    s1.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
    s2.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js";
    document.head.appendChild(s1);
    s1.onload = () => document.head.appendChild(s2);
  }

  // === THEME SYNC ===
  const themeKey = 'hv_theme';
  const theme = localStorage.getItem(themeKey) || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  // === NAVBAR HTML ===
  const html = `
  <style>
  :root {
  --primary: #ff6b35;
  --accent: #ffd6a5;
  --text: #e6eef8;
  --bg-dark: #0f1724;

  /* Navbar vars */
  --navbar-bg: rgba(15, 23, 36, 0.9);
  --navbar-border: rgba(255, 255, 255, 0.05);
  --navbar-text: #e6eef8;
  --dropdown-bg: rgba(20, 28, 40, 0.95);
}

[data-theme="light"] {
  --primary: #2563eb;
  --accent: #60a5fa;
  --text: #0f1724;
  --bg-dark: #f7f8fb;

  --navbar-bg: rgba(255, 255, 255, 0.9);
  --navbar-border: rgba(0, 0, 0, 0.08);
  --navbar-text: #1e293b;
  --dropdown-bg: rgba(255, 255, 255, 0.98);
}

#global-navbar {
  position: fixed;
  top: 0; left: 0; right: 0; height: 70px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  background: var(--navbar-bg);
  color: var(--navbar-text);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--navbar-border);
  z-index: 999;
  transition: background .3s, color .3s, border-color .3s;
}

.nav-logo {
  font-weight: 800; font-size: 22px; cursor: pointer;
  color: var(--navbar-text);
}
.nav-logo span {
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: .3s;
}
.nav-logo:hover span {
  filter: brightness(1.2);
  transform: scale(1.05);
}

.nav-links {
  display: flex; gap: 28px; align-items: center;
}
.nav-links a {
  text-decoration: none;
  color: var(--navbar-text);
  font-weight: 600;
  transition: color .3s;
  position: relative;
}
.nav-links a:hover { color: var(--accent); }
.nav-links a.active::after {
  content: "";
  position: absolute;
  bottom: -6px; left: 0;
  width: 100%; height: 2px;
  background: var(--primary);
}

.user-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  border: 2px solid var(--primary);
  object-fit: cover; cursor: pointer;
  transition: border-color .3s;
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: 65px; right: 40px;
  display: none; flex-direction: column;
  background: var(--dropdown-bg);
  backdrop-filter: blur(6px);
  border: 1px solid var(--navbar-border);
  border-radius: 10px;
  overflow: hidden;
  transition: background .3s;
}
.dropdown a {
  padding: 10px 14px;
  color: var(--navbar-text);
  text-decoration: none;
  font-weight: 500;
  transition: background .2s, color .3s;
}
.dropdown a:hover {
  background: rgba(255, 255, 255, 0.08);
}
.dropdown.show {
  display: flex;
  animation: fadeIn .3s ease both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media(max-width:800px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 70px; left: 0; right: 0;
    flex-direction: column;
    background: var(--navbar-bg);
    border-bottom: 1px solid var(--navbar-border);
    padding: 20px 0;
  }
  .nav-links.open { display: flex; }
  .menu-toggle { display: block; }
}

.menu-toggle {
  display: none;
  cursor: pointer;
  font-size: 24px;
  color: var(--navbar-text);
  transition: color .3s;
}

  </style>
  <div id="global-navbar">
    <div class="nav-logo" onclick="location.href='../main-lobby.html'"><span>HọcVui</span></div>
    <div class="menu-toggle">☰</div>
    <div class="nav-links">
      <a href="../mainAll/main-lobby.html">Home</a>
      <a href="../study-place/main-study.html">Study</a>
      <a href="../playground/MainConsole_Playground.html">Play</a>
      <a href="#">Statistic</a>
      <a href="#">Advance</a>
    </div>
    <img id="navbarAvatar" class="user-avatar" src="../../src/undefined_user.jpg" alt="avatar">
    <div id="navbarDropdown" class="dropdown">
      <a href="../navbar-console/navbar-setting/setting_v2.html">Trang cá nhân</a>
      <a href="../loginNregister/login.html" id="navbarLogout">Đăng xuất</a>
    </div>
  </div>`;
  
  const navbarDiv = document.getElementById("navbar") || document.body.prepend(document.createElement('div'));
  if (navbarDiv) navbarDiv.innerHTML = html;
  document.body.classList.add('has-global-navbar');

  // === Interactions ===
  const avatar = document.getElementById('navbarAvatar');
  const dropdown = document.getElementById('navbarDropdown');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  avatar.addEventListener('click',()=>dropdown.classList.toggle('show'));
  window.addEventListener('click',(e)=>{
    if(!avatar.contains(e.target)&&!dropdown.contains(e.target)) dropdown.classList.remove('show');
  });
  menuToggle.addEventListener('click',()=>navLinks.classList.toggle('open'));

  // === Firebase auth ===
  function initAuth(){
    if(!firebase.apps.length)return;
    const auth = firebase.auth();
    auth.onAuthStateChanged(u=>{
      if(u){
        if(u.photoURL) avatar.src=u.photoURL;
        else avatar.src='https://ui-avatars.com/api/?background=random&name='+(u.displayName||u.email[0]);
      }
    });
    document.getElementById('navbarLogout').addEventListener('click',()=>auth.signOut().then(()=>location.href='../loginRegister/login.html'));
  }
  setTimeout(initAuth,1000); // delay for firebase to load
})();
