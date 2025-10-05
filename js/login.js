// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_8Y5vYXvXc0kvYH0jNOziiR0t1TtStTg",
    authDomain: "myproject-7ba9f.firebaseapp.com",
    projectId: "myproject-7ba9f",
    storageBucket: "myproject-7ba9f.firebasestorage.app",
    messagingSenderId: "614709937741",
    appId: "1:614709937741:web:d11e5325162c249cfdfe04",
    measurementId: "G-LB9VZG4BHB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login form functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
            submitBtn.disabled = true;
            
            // Firebase Authentication
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    const user = userCredential.user;
                    
                    // Save user data to localStorage
                    localStorage.setItem('currentUser', JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0],
                        loginTime: new Date().toISOString()
                    }));
                    
                    // Update user's last login time in Firestore
                    db.collection('users').doc(user.uid).update({
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }).catch(error => {
                        console.log('Error updating last login:', error);
                    });
                    
                    alert('Đăng nhập thành công! Chào mừng bạn đến với DOL English!');
                    window.location.href = 'main-page.html';
                })
                .catch((error) => {
                    // Handle errors
                    let errorMessage = 'Đăng nhập thất bại!';
                    
                    switch(error.code) {
                        case 'auth/user-not-found':
                            errorMessage = 'Email không tồn tại!';
                            break;
                        case 'auth/wrong-password':
                            errorMessage = 'Mật khẩu không đúng!';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Email không hợp lệ!';
                            break;
                        case 'auth/user-disabled':
                            errorMessage = 'Tài khoản đã bị vô hiệu hóa!';
                            break;
                        case 'auth/too-many-requests':
                            errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau!';
                            break;
                        default:
                            errorMessage = 'Đăng nhập thất bại: ' + error.message;
                    }
                    
                    alert(errorMessage);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, redirect to main page
            window.location.href = 'main-page.html';
        }
    });
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
