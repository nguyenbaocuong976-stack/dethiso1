document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------
    // CHỨC NĂNG CHUNG: Hamburger Menu (Responsive)
    // ------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Kiểm tra xem chúng ta đang ở trang Bài 01 hay Bài 02
    if (document.body.id === 'bai01-page' || document.querySelector('#hero')) {
        handleBai01Features();
    }

    if (document.body.id === 'bai02-page' || document.querySelector('#guess-game')) {
        handleBai02Game();
    }
});

// ------------------------------------------------
// BÀI 01 - LANDING PAGE 
// ------------------------------------------------
function handleBai01Features() {
    // -------------------------------------
    // 1. Thư viện ảnh đơn giản (Gallery)
    // -------------------------------------
    const mainGalleryImage = document.getElementById('main-gallery-image');
    const thumbnails = document.querySelectorAll('.thumb-img');

    if (mainGalleryImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Lấy đường dẫn ảnh lớn từ data-full-src
                const newSrc = thumb.getAttribute('data-full-src');
                
                // Cập nhật ảnh lớn
                mainGalleryImage.src = newSrc;
                
                // Xóa trạng thái active cũ và thêm trạng thái active mới
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    // -------------------------------------
    // 2. Scroll Effect cho Header
    // -------------------------------------
    const header = document.getElementById('main-header');

    if (header) {
        window.addEventListener('scroll', () => {
            // Thêm class .scrolled khi cuộn qua 50px
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // -------------------------------------
    // 3. Tư duy sáng tạo: Features Animation (Intersection Observer API)
    // -------------------------------------
    const featureItems = document.querySelectorAll('.feature-item');
    
    if (featureItems.length > 0) {
        // Cấu hình Observer
        const observerOptions = {
            root: null, // Dùng viewport làm root
            rootMargin: '0px',
            threshold: 0.2 // Kích hoạt khi 20% phần tử xuất hiện
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Thêm class .visible để kích hoạt CSS animation
                    entry.target.classList.add('visible');
                    // Ngừng theo dõi sau khi đã xuất hiện
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        // Bắt đầu theo dõi từng phần tử
        featureItems.forEach(item => {
            observer.observe(item);
        });
    }
}


// ------------------------------------------------
// BÀI 02 - GAME ĐOÁN SỐ
// ------------------------------------------------
function handleBai02Game() {
    const guessInput = document.getElementById('guessInput');
    const submitGuess = document.getElementById('submitGuess');
    const message = document.getElementById('message');
    const attemptsSpan = document.getElementById('attempts');
    const resetGameBtn = document.getElementById('resetGame');
    const confettiContainer = document.getElementById('confetti-container');

    let secretNumber = 0;
    let attempts = 0;
    const MIN_RANGE = 50;
    const MAX_RANGE = 150;
    let isGameOver = false;

    // Logic 1: Generate Random Number (50-150)
    function generateRandomNumber(min, max) {
        // Công thức: Math.floor(Math.random() * (max - min + 1)) + min
        // Math.random() tạo số [0, 1)
        // Nhân với (150 - 50 + 1) = 101 để có [0, 101)
        // Làm tròn xuống để có số nguyên từ 0 đến 100
        // Cộng 50 để dịch chuyển khoảng: [50, 150]
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function initGame() {
        secretNumber = generateRandomNumber(MIN_RANGE, MAX_RANGE);
        attempts = 0;
        isGameOver = false;
        attemptsSpan.textContent = attempts;
        message.textContent = 'Hãy bắt đầu đoán!';
        guessInput.value = '';
        guessInput.disabled = false;
        submitGuess.disabled = false;
        resetGameBtn.style.display = 'none';
        confettiContainer.innerHTML = ''; // Xóa confetti cũ
        console.log('Mã số bí mật (chỉ dành cho dev):', secretNumber);
    }

    // Logic 2: Xử lý Input và so sánh
    function checkGuess() {
        if (isGameOver) return;

        // Lấy và xử lý input để tránh lỗi (đảm bảo là số nguyên trong khoảng)
        let userGuess = parseInt(guessInput.value);

        // Xử lý Input (Validation)
        if (isNaN(userGuess) || userGuess < MIN_RANGE || userGuess > MAX_RANGE) {
            message.textContent = `Vui lòng nhập một số hợp lệ từ ${MIN_RANGE} đến ${MAX_RANGE}.`;
            return;
        }

        attempts++;
        attemptsSpan.textContent = attempts;

        // So sánh
        if (userGuess === secretNumber) {
            message.textContent = `🎉 Chúc mừng! Bạn đã đoán đúng số ${secretNumber} sau ${attempts} lần thử!`;
            endGame(true);
        } else if (userGuess < secretNumber) {
            message.textContent = 'Quá thấp! Hãy thử một số lớn hơn.';
        } else {
            message.textContent = 'Quá cao! Hãy thử một số nhỏ hơn.';
        }
    }

    function endGame(isWin) {
        isGameOver = true;
        guessInput.disabled = true;
        submitGuess.disabled = true;
        resetGameBtn.style.display = 'block';

        if (isWin) {
            triggerConfetti();
        }
    }

    // 4. Confetti Animation (CSS đơn giản)
    function triggerConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random vị trí và màu sắc
            const randomX = Math.random() * window.innerWidth;
            const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            const randomEndTranslate = Math.random() * 200 - 100; // -100px đến 100px

            confetti.style.left = `${randomX}px`;
            confetti.style.backgroundColor = randomColor;
            // Thiết lập biến CSS để tạo hiệu ứng rơi ngẫu nhiên hơn
            confetti.style.setProperty('--x-end', `${randomEndTranslate}px`);
            
            confettiContainer.appendChild(confetti);

            // Xóa phần tử sau khi animation kết thúc để tránh đầy DOM
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    // Gán sự kiện
    if (submitGuess) {
        submitGuess.addEventListener('click', checkGuess);
    }
    if (guessInput) {
        // Cho phép nhấn Enter để đoán
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkGuess();
            }
        });
    }
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', initGame);
    }

    // Khởi tạo game khi load trang
    initGame();
}