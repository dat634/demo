// === HọcVui Navbar ===
document.addEventListener('DOMContentLoaded', async ()=>{
  const navbar = document.getElementById('navbar');
  if(!navbar) return;

  navbar.innerHTML = `
    <div class="navbar">
      <div class="nav-left">
        <div class="nav-logo" id="logo"><span>Học</span>Vui</div>
        <div class="hamburger" id="hamburger"><div></div><div></div><div></div></div>
        <div class="nav-links" id="navLinks">
          <a href="../main-lobby.html">Home</a>
          <a href="../main-study.html">Study</a>
          <a href="../MainPlayground-console.html">Play</a>
          <a href="../statistical.html">Statistic</a>
          <a href="../advance.html">Advance</a>
        </div>
      </div>
      <div class="nav-right">
        <img id="userAvatar" class="user-avatar" src="https://i.imgur.com/ZCk5pQp.png" alt="avatar">
        <div class="user-menu" id="userMenu">
          <button id="profileBtn">Trang cá nhân</button>
          <button id="logoutBtn">Đăng xuất</button>
        </div>
      </div>
    </div>
  `;

  const logo = document.getElementById('logo');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const userAvatar = document.getElementById('userAvatar');
  const userMenu = document.getElementById('userMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileBtn = document.getElementById('profileBtn');

  // Toggle mobile menu
  hamburger.addEventListener('click', ()=> navLinks.classList.toggle('active'));

  // Toggle user menu
  userAvatar.addEventListener('click', ()=> userMenu.classList.toggle('active'));
  document.addEventListener('click', (e)=>{
    if(!userMenu.contains(e.target) && !userAvatar.contains(e.target)){
      userMenu.classList.remove('active');
    }
  });

  // Logo click
  logo.addEventListener('click', ()=> location.href = '../main-lobby.html');

  // Firebase
  if(typeof firebase !== 'undefined'){
    const auth = firebase.auth();
    auth.onAuthStateChanged(user=>{
      if(user){
        if(user.photoURL) userAvatar.src = user.photoURL;
        else userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=ff6b35&color=fff`;
      } else {
        userAvatar.src = 'https://i.imgur.com/ZCk5pQp.png';
      }
    });

    logoutBtn.addEventListener('click', ()=>{
      auth.signOut().then(()=>{
        alert('Đã đăng xuất');
        location.href = '../loginRegister/login.html';
      }).catch(err=>alert('Lỗi: '+err.message));
    });
  }

  // Profile button
  profileBtn.addEventListener('click', ()=> location.href = '../navbar-console/navbar-setting/setting_v2.html');
});
