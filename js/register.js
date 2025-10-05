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

// Register form functionality
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const course = document.getElementById('course').value;
            
            // Basic validation
            if (!fullName || !email || !phone || !password || !confirmPassword || !course) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            
            if (password.length < 8) {
                alert('Mật khẩu phải có ít nhất 8 ký tự!');
                return;
            }
             const Upper = /[A-Z]/;
            const Lower = /[a-z]/;
            const Number = /[0-9]/;
            const Special = /[!@#$%^&*(),.?":{}|<>]/;
            if (!Upper.test(password) || !Lower.test(password) || !Number.test(password) || !Special.test(password)) {
                alert('Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!');
                return;
            }
            
            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng ký...';
            submitBtn.disabled = true;
            
            // Firebase Authentication
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    const user = userCredential.user;
                    
                    // Update user profile
                    user.updateProfile({
                        displayName: fullName
                    }).then(() => {
                        // Save additional user data to Firestore
                        return db.collection('users').doc(user.uid).set({
                            uid: user.uid,
                            email: user.email,
                            fullName: fullName,
                            phone: phone,
                            course: course,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                            gameStats: {
                                totalScore: 0,
                                gamesPlayed: 0,
                                streak: 0,
                                gameStats: {
                                    flashcard: { highScore: 0, plays: 0 },
                                    'multiple-choice': { highScore: 0, plays: 0 },
                                    typing: { highScore: 0, plays: 0 },
                                    speed: { highScore: 0, plays: 0 },
                                    shooter: { highScore: 0, plays: 0 },
                                    puzzle: { highScore: 0, plays: 0 },
                                    memory: { highScore: 0, plays: 0 }
                                }
                            },
                            vocabularyProgress: {},
                            favorites: []
                        });
                    }).then(() => {
                        // Save user data to localStorage
                        localStorage.setItem('currentUser', JSON.stringify({
                            uid: user.uid,
                            email: user.email,
                            displayName: fullName,
                            phone: phone,
                            course: course,
                            loginTime: new Date().toISOString()
                        }));
                        
                        alert('Đăng ký thành công! Chào mừng bạn đến với DOL English!');
                        window.location.href = 'main-page.html';
                    });
                })
                .catch((error) => {
                    // Handle errors
                    let errorMessage = 'Đăng ký thất bại!';
                    
                    switch(error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'Email này đã được sử dụng!';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Email không hợp lệ!';
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'Mật khẩu quá yếu! Vui lòng chọn mật khẩu mạnh hơn.';
                            break;
                        case 'auth/operation-not-allowed':
                            errorMessage = 'Đăng ký tài khoản hiện không được phép!';
                            break;
                        default:
                            errorMessage = 'Đăng ký thất bại: ' + error.message;
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
