// Learning Hub JavaScript
class LearningHub {
    constructor() {
        // Use the vocabulary database instead of hardcoded array
        
        this.currentGame = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.currentDifficulty = 'easy';
        this.gameData = this.loadGameData();
        this.leaderboard = this.loadLeaderboard();
        this.favorites = this.loadFavorites();
        
        this.init();
    }
    
    init() {
        this.updateStats();
        this.updateLeaderboard();
        this.setupEventListeners();
    }
    
    loadGameData() {
        const saved = localStorage.getItem('dolGameData');
        return saved ? JSON.parse(saved) : {
            totalScore: 0,
            gamesPlayed: 0,
            streak: 0,
            lastPlayDate: null,
            gameStats: {
                flashcard: { highScore: 0, plays: 0 },
                'multiple-choice': { highScore: 0, plays: 0 },
                typing: { highScore: 0, plays: 0 },
                speed: { highScore: 0, plays: 0 },
                shooter: { highScore: 0, plays: 0 },
                puzzle: { highScore: 0, plays: 0 },
                memory: { highScore: 0, plays: 0 },
                'word-shooter': { highScore: 0, plays: 0 }
            }
        };
    }
    
    saveGameData() {
        localStorage.setItem('dolGameData', JSON.stringify(this.gameData));
    }
    
    loadLeaderboard() {
        const saved = localStorage.getItem('dolLeaderboard');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveLeaderboard() {
        localStorage.setItem('dolLeaderboard', JSON.stringify(this.leaderboard));
    }
    
    loadFavorites() {
        const saved = localStorage.getItem('dolGameFavorites');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFavorites() {
        localStorage.setItem('dolGameFavorites', JSON.stringify(this.favorites));
    }
    
    updateStats() {
        let totalScore = 0;
        let totalPlays = 0;
        
        // Update individual game stats and calculate totals
        Object.keys(this.gameData.gameStats).forEach(game => {
            const highElement = document.getElementById(`${game}-high`);
            const playsElement = document.getElementById(`${game}-plays`);
            const favElement = document.getElementById(`${game}-fav`);
            
            if (highElement) highElement.textContent = this.gameData.gameStats[game].highScore;
            if (playsElement) playsElement.textContent = this.gameData.gameStats[game].plays;
            if (favElement) favElement.textContent = this.favorites.includes(game) ? '1' : '0';
            
            // Calculate total score from game history
            const history = this.getGameHistory(game);
            const gameTotalScore = history.reduce((sum, game) => sum + game.score, 0);
            totalScore += gameTotalScore;
            totalPlays += this.gameData.gameStats[game].plays;
        });
        
        // Update total stats
        document.getElementById('totalScore').textContent = totalScore;
        document.getElementById('totalPlays').textContent = totalPlays;
        
        // Update other stats if elements exist
        const streakElement = document.getElementById('streak');
        if (streakElement) streakElement.textContent = this.gameData.streak;
    }
    
    updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;
        
        const sortedLeaderboard = [...this.leaderboard].sort((a, b) => b.score - a.score);
        
        leaderboardList.innerHTML = sortedLeaderboard.slice(0, 10).map((player, index) => `
            <div class="leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}">
                <div class="rank-number">${index + 1}</div>
                <div class="player-name">${player.name}</div>
                <div class="player-score">${player.score} điểm</div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Floating buttons
        document.querySelectorAll('.floating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = btn.classList.contains('fb-btn') ? 'Facebook' : 'Zalo';
                alert(`Liên hệ với DOL English qua ${platform}!`);
            });
        });
    }
    
    startGame(gameType) {
        this.currentGame = gameType;
        this.currentQuestion = 0;
        this.score = 0;
        
        // Show difficulty selection for games that support it
        if (['flashcard', 'multiple-choice', 'speed'].includes(gameType)) {
            this.showDifficultySelection(gameType);
        } else {
            this.launchGame(gameType, 'easy');
        }
    }
    
    showDifficultySelection(gameType) {
        const modal = document.getElementById('gameModal');
        const gameContainer = document.getElementById('gameContainer');
        
        const difficulties = {
            'flashcard': [
                { id: 'easy', name: 'Dễ (A1-A2)', description: '19 từ vựng cơ bản' },
                { id: 'medium', name: 'Trung bình (B1-C1)', description: '19 từ vựng trung cấp' },
                { id: 'hard', name: 'Khó (C1-C2)', description: '19 từ vựng nâng cao' }
            ],
            'multiple-choice': [
                { id: 'easy', name: 'Dễ (A1-A2)', description: '4 lựa chọn, từ A1-A2' },
                { id: 'medium', name: 'Trung bình (A2-B2)', description: '6 lựa chọn, từ A2-B2' },
                { id: 'hard', name: 'Khó (B2-C2)', description: '8 lựa chọn, từ B2-C2' }
            ],
            'speed': [
                { id: 'easy', name: 'Dễ (A1-A2)', description: '40s, 3 lựa chọn' },
                { id: 'medium', name: 'Trung bình (A1-B1)', description: '30s, 4 lựa chọn' },
                { id: 'hard', name: 'Khó (B1-C1)', description: '25s, 5 lựa chọn' },
                { id: 'expert', name: 'Chuyên gia (C1-C2)', description: '20s, 6 lựa chọn' }
            ]
        };
        
        const gameNames = {
            'flashcard': 'Flashcard Quiz',
            'multiple-choice': 'Multiple Choice',
            'speed': 'Speed Mode'
        };
        
        gameContainer.innerHTML = `
            <div class="difficulty-selection">
                <h2>Chọn độ khó - ${gameNames[gameType]}</h2>
                <div class="difficulty-options">
                    ${difficulties[gameType].map(diff => `
                        <div class="difficulty-card" onclick="learningHub.launchGame('${gameType}', '${diff.id}')">
                            <h3>${diff.name}</h3>
                            <p>${diff.description}</p>
                        </div>
                    `).join('')}
                </div>
                <button class="action-btn secondary" onclick="learningHub.closeGame()">
                    <i class="fas fa-times"></i> Hủy
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }
    
    launchGame(gameType, difficulty) {
        this.currentDifficulty = difficulty;
        const modal = document.getElementById('gameModal');
        const gameContainer = document.getElementById('gameContainer');
        
        switch (gameType) {
            case 'flashcard':
                this.startFlashcardGame(gameContainer, difficulty);
                break;
            case 'multiple-choice':
                this.startMultipleChoiceGame(gameContainer, difficulty);
                break;
            case 'typing':
                this.startTypingGame(gameContainer);
                break;
            case 'speed':
                this.startSpeedGame(gameContainer, difficulty);
                break;
            case 'shooter':
                this.startShooterGame(gameContainer);
                break;
            case 'puzzle':
                this.startPuzzleGame(gameContainer);
                break;
            case 'memory':
                this.startMemoryGame(gameContainer);
                break;
        }
        
        modal.style.display = 'block';
    }
    
    startFlashcardGame(container, difficulty = 'easy') {
        // Show mode selection first
        container.innerHTML = `
            <div class="flashcard-mode-selection">
                <h2>Chọn chế độ Flashcard</h2>
                <div class="mode-options">
                    <div class="mode-card" onclick="learningHub.startFlashcardMode('study', '${difficulty}')">
                        <h3>📚 Chế độ Học</h3>
                        <p>Xem từ vựng và nghĩa để học</p>
                    </div>
                    <div class="mode-card" onclick="learningHub.startFlashcardMode('test', '${difficulty}')">
                        <h3>🧪 Chế độ Kiểm tra</h3>
                        <p>Trả lời đúng/sai và điền từ</p>
                    </div>
                </div>
                <div class="difficulty-info">
                    <p><strong>Độ khó đã chọn:</strong> ${this.getDifficultyName(difficulty)}</p>
                </div>
                <button class="action-btn secondary" onclick="learningHub.closeGame()">
                    <i class="fas fa-times"></i> Hủy
                </button>
            </div>
        `;
    }
    
    startFlashcardMode(mode, difficulty) {
        const container = document.getElementById('gameContainer');
        this.flashcardMode = mode;
        this.flashcardWords = this.getFlashcardWords(difficulty);
        this.currentFlashcardIndex = 0;
        this.flashcardScore = 0;
        
        if (mode === 'study') {
            this.showFlashcardStudy(container);
        } else {
            this.showFlashcardTest(container);
        }
    }
    
    getFlashcardWords(difficulty) {
        let words = [];
        switch (difficulty) {
            case 'easy':
                words = vocabularyDB.getVocabularyByDifficultyRange('A1', 'A2');
                break;
            case 'medium':
                words = vocabularyDB.getVocabularyByDifficultyRange('B1', 'C1');
                break;
            case 'hard':
                words = vocabularyDB.getVocabularyByDifficultyRange('C1', 'C2');
                break;
        }
        
        // Get 19 random words
        const shuffled = vocabularyDB.shuffleArray([...words]);
        return shuffled.slice(0, 19);
    }
    
    showFlashcardStudy(container) {
        if (this.currentFlashcardIndex >= this.flashcardWords.length) {
            this.endFlashcardStudy(container);
            return;
        }
        
        const word = this.flashcardWords[this.currentFlashcardIndex];
        
        container.innerHTML = `
            <div class="flashcard-study">
                <div class="game-header">
                    <div class="game-progress">Từ ${this.currentFlashcardIndex + 1}/${this.flashcardWords.length}</div>
                </div>
                <div class="flashcard-container" onclick="learningHub.flipFlashcard()">
                    <div class="flashcard" id="flashcard">
                        <div class="flashcard-front">
                            <div class="word-english">${word.english}</div>
                            <div class="word-pronunciation">${word.pronunciation}</div>
                            <div class="word-example">"${word.example}"</div>
                            <div class="flip-hint">Nhấn để xem nghĩa</div>
                        </div>
                        <div class="flashcard-back">
                            <div class="word-vietnamese">${word.vietnamese}</div>
                            <div class="flip-hint">Nhấn để lật lại</div>
                        </div>
                    </div>
                </div>
                <div class="flashcard-actions">
                    <button class="action-btn primary" onclick="learningHub.nextFlashcard()">
                        <i class="fas fa-arrow-right"></i> Tiếp theo
                    </button>
                    <button class="action-btn secondary" onclick="learningHub.closeGame()">
                        Dừng
                    </button>
                </div>
            </div>
        `;
    }
    
    flipFlashcard() {
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.toggle('flipped');
    }
    
    nextFlashcard() {
        this.currentFlashcardIndex++;
        this.showFlashcardStudy(document.getElementById('gameContainer'));
    }
    
    endFlashcardStudy(container) {
        container.innerHTML = `
            <div class="study-complete">
                <h2>🎉 Hoàn thành học tập!</h2>
                <p>Bạn đã học xong ${this.flashcardWords.length} từ vựng</p>
                <div class="study-actions">
                    <button class="action-btn primary" onclick="learningHub.startFlashcardMode('test', '${this.currentDifficulty}')">
                        <i class="fas fa-question-circle"></i> Kiểm tra ngay
                    </button>
                    <button class="action-btn secondary" onclick="learningHub.startFlashcardMode('study', '${this.currentDifficulty}')">
                        <i class="fas fa-redo"></i> Học lại
                    </button>
                    <button class="action-btn tertiary" onclick="learningHub.closeGame()">
                        <i class="fas fa-times"></i> Đóng
                    </button>
                </div>
            </div>
        `;
    }
    
    showFlashcardTest(container) {
        if (this.currentFlashcardIndex >= this.flashcardWords.length) {
            this.endFlashcardTest(container);
            return;
        }
        
        const word = this.flashcardWords[this.currentFlashcardIndex];
        const isTrueFalse = this.currentFlashcardIndex < 14;
        
        container.innerHTML = `
            <div class="flashcard-test">
                <div class="game-header">
                    <div class="game-score">Điểm: ${this.flashcardScore}</div>
                    <div class="game-progress">Câu ${this.currentFlashcardIndex + 1}/${this.flashcardWords.length}</div>
                </div>
                <div class="test-question">
                    <h2>${word.english}</h2>
                    <p class="word-pronunciation">${word.pronunciation}</p>
                    ${isTrueFalse ? `
                        <div class="true-false-options">
                            <button class="action-btn success" onclick="learningHub.answerFlashcardTest(true, '${word.english}')">
                                ✅ Đúng
                            </button>
                            <button class="action-btn danger" onclick="learningHub.answerFlashcardTest(false, '${word.english}')">
                                ❌ Sai
                            </button>
                        </div>
                    ` : `
                        <div class="fill-blank">
                            <p>Nghĩa tiếng Việt: <strong>${word.vietnamese}</strong></p>
                            <input type="text" id="fillAnswer" placeholder="Nhập từ tiếng Anh..." class="game-input">
                            <button class="action-btn primary" onclick="learningHub.checkFillAnswer('${word.english}')">
                                Kiểm tra
                            </button>
                        </div>
                    `}
                </div>
                <div class="test-feedback" id="testFeedback" style="display: none;">
                    <div id="feedbackContent"></div>
                    <button class="action-btn primary" onclick="learningHub.nextFlashcardTest()">
                        Tiếp theo
                    </button>
                </div>
            </div>
        `;
        
        // Add enter key listener for fill-in-the-blank
        if (!isTrueFalse) {
            document.getElementById('fillAnswer').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkFillAnswer(word.english);
                }
            });
        }
    }
    
    answerFlashcardTest(isCorrect, english) {
        const word = this.flashcardWords.find(w => w.english === english);
        const feedback = document.getElementById('testFeedback');
        const feedbackContent = document.getElementById('feedbackContent');
        
        if (isCorrect === (word.vietnamese !== 'Sai nghĩa')) {
            this.flashcardScore += 10;
            feedbackContent.innerHTML = `
                <div class="correct-answer">
                    <h3>✅ Đúng rồi!</h3>
                    <p>Nghĩa: ${word.vietnamese}</p>
                </div>
            `;
        } else {
            this.flashcardScore = Math.max(0, this.flashcardScore - 5);
            feedbackContent.innerHTML = `
                <div class="wrong-answer">
                    <h3>❌ Sai rồi!</h3>
                    <p>Nghĩa đúng: ${word.vietnamese}</p>
                </div>
            `;
        }
        
        feedback.style.display = 'block';
    }
    
    checkFillAnswer() {
        const input = document.getElementById('fillAnswer');
        const answer = input.value.toLowerCase().trim();
        const expected = input.dataset.expected.toLowerCase();
        const feedback = document.getElementById('testFeedback');
        const feedbackContent = document.getElementById('feedbackContent');
        
        if (answer === expected) {
            this.flashcardScore += 10;
            feedbackContent.innerHTML = `
                <div class="correct-answer">
                    <i class="fas fa-check-circle"></i>
                    <p>Chính xác! +10 điểm</p>
                    <p>Đáp án: ${input.dataset.expected}</p>
                </div>
            `;
        } else {
            this.flashcardScore -= 5;
            feedbackContent.innerHTML = `
                <div class="wrong-answer">
                    <i class="fas fa-times-circle"></i>
                    <p>Sai rồi! -5 điểm</p>
                    <p>Đáp án đúng: <strong>${input.dataset.expected}</strong></p>
                </div>
            `;
        }
        
        feedback.style.display = 'block';
    }
    
    nextFlashcardTest() {
        this.currentFlashcardIndex++;
        this.showFlashcardTest(document.getElementById('gameContainer'));
    }
    
    endFlashcardTest(container) {
        const title = this.getFlashcardTitle(this.flashcardScore);
        
        container.innerHTML = `
            <div class="test-results">
                <h2>${title}</h2>
                <div class="final-score">
                    <h3>Điểm số: ${this.flashcardScore}</h3>
                    <p>Tổng số câu: ${this.flashcardWords.length}</p>
                </div>
                <div class="test-actions">
                    <button class="action-btn primary" onclick="learningHub.startFlashcardMode('test', '${this.currentDifficulty}')">
                        Chơi lại
                    </button>
                    <button class="action-btn secondary" onclick="learningHub.closeGame()">
                        Đóng
                    </button>
                </div>
            </div>
        `;
        
        // Save score
        this.saveFlashcardScore(this.flashcardScore);
    }
    
    getFlashcardTitle(score) {
        if (score >= 40) {
            return "Hãy cố gắng hết sức nhé !!";
        } else if (score >= 100) {
            return "Continue your Streak !!!";
        } else {
            return "Phá vỡ mọi giới hạn.";
        }
    }
    
    saveFlashcardScore(score) {
        this.gameData.gameStats.flashcard.plays++;
        if (score > this.gameData.gameStats.flashcard.highScore) {
            this.gameData.gameStats.flashcard.highScore = score;
        }
        this.gameData.totalScore += score;
        this.gameData.gamesPlayed++;
        this.saveGameData();
        this.saveGameHistory('flashcard', score, this.currentDifficulty);
        this.updateStats();
    }
    
    showAnswer() {
        document.getElementById('answer').style.display = 'block';
        document.querySelector('.action-btn.secondary').style.display = 'none';
        document.getElementById('correctBtn').style.display = 'inline-block';
        document.getElementById('wrongBtn').style.display = 'inline-block';
    }
    
    answerFlashcard(isCorrect) {
        if (isCorrect) {
            this.score += 10;
        }
        this.nextQuestion();
    }
    
    startMultipleChoiceGame(container, difficulty = 'easy') {
        this.multipleChoiceScore = 0;
        this.multipleChoiceQuestion = 0;
        this.multipleChoiceWords = this.getMultipleChoiceWords(difficulty);
        this.multipleChoiceDifficulty = difficulty;
        
        this.showMultipleChoiceQuestion(container);
    }
    
    getMultipleChoiceWords(difficulty) {
        let words = [];
        switch (difficulty) {
            case 'easy':
                words = vocabularyDB.getVocabularyByDifficultyRange('A1', 'A2');
                break;
            case 'medium':
                words = vocabularyDB.getVocabularyByDifficultyRange('A2', 'B2');
                break;
            case 'hard':
                words = vocabularyDB.getVocabularyByDifficultyRange('B2', 'C2');
                break;
        }
        
        // Get 15 random words
        const shuffled = vocabularyDB.shuffleArray([...words]);
        return shuffled.slice(0, 15);
    }
    
    showMultipleChoiceQuestion(container) {
        if (this.multipleChoiceQuestion >= this.multipleChoiceWords.length) {
            this.endMultipleChoiceGame(container);
            return;
        }
        
        const word = this.multipleChoiceWords[this.multipleChoiceQuestion];
        const options = this.getMultipleChoiceOptions(word, this.multipleChoiceDifficulty);
        
        container.innerHTML = `
            <div class="multiple-choice-game">
                <div class="game-header">
                    <div class="game-score">Điểm: ${this.multipleChoiceScore}</div>
                    <div class="game-progress">Câu ${this.multipleChoiceQuestion + 1}/${this.multipleChoiceWords.length}</div>
                </div>
                <div class="game-question">
                    <h2>Nghĩa của "${word.vietnamese}" là gì?</h2>
                </div>
                <div class="game-options multiple-choice-layout">
                    ${options.map((option, index) => `
                        <button class="option-btn" onclick="learningHub.selectMultipleChoiceOption('${option}', '${word.english}')">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getMultipleChoiceOptions(correctWord, difficulty) {
        const options = [correctWord.english];
        let numOptions = 4;
        
        switch (difficulty) {
            case 'easy':
                numOptions = 4;
                break;
            case 'medium':
                numOptions = 6;
                break;
            case 'hard':
                numOptions = 8;
                break;
        }
        
        // Get words from appropriate difficulty range
        let allWords = [];
        switch (difficulty) {
            case 'easy':
                allWords = vocabularyDB.getVocabularyByDifficultyRange('A1', 'A2');
                break;
            case 'medium':
                allWords = vocabularyDB.getVocabularyByDifficultyRange('A2', 'B2');
                break;
            case 'hard':
                allWords = vocabularyDB.getVocabularyByDifficultyRange('B2', 'C2');
                break;
        }
        
        const wordList = allWords.map(w => w.english);
        
        while (options.length < numOptions) {
            const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
            if (!options.includes(randomWord)) {
                options.push(randomWord);
            }
        }
        
        return vocabularyDB.shuffleArray(options);
    }
    
    selectMultipleChoiceOption(selected, correct) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            } else if (btn.textContent === selected && selected !== correct) {
                btn.classList.add('incorrect');
            }
        });
        
        if (selected === correct) {
            this.multipleChoiceScore += 10;
        } else {
            this.multipleChoiceScore = Math.max(0, this.multipleChoiceScore - 5);
        }
        
        setTimeout(() => {
            this.multipleChoiceQuestion++;
            this.showMultipleChoiceQuestion(document.getElementById('gameContainer'));
        }, 1500);
    }
    
    endMultipleChoiceGame(container) {
        const title = this.getMultipleChoiceTitle(this.multipleChoiceScore);
        
        container.innerHTML = `
            <div class="test-results">
                <h2>${title}</h2>
                <div class="final-score">
                    <h3>Điểm số: ${this.multipleChoiceScore}</h3>
                    <p>Tổng số câu: ${this.multipleChoiceWords.length}</p>
                </div>
                <div class="test-actions">
                    <button class="action-btn primary" onclick="learningHub.launchGame('multiple-choice', '${this.multipleChoiceDifficulty}')">
                        Chơi lại
                    </button>
                    <button class="action-btn secondary" onclick="learningHub.closeGame()">
                        Đóng
                    </button>
                </div>
            </div>
        `;
        
        // Save score
        this.saveMultipleChoiceScore(this.multipleChoiceScore);
    }
    
    getMultipleChoiceTitle(score) {
        if (score >= 45) {
            return "Hãy cố gắng hết sức nhé !!";
        } else if (score >= 50) {
            return "Continue your Streak !!!";
        } else {
            return "Phá vỡ mọi giới hạn.";
        }
    }
    
    saveMultipleChoiceScore(score) {
        this.gameData.gameStats['multiple-choice'].plays++;
        if (score > this.gameData.gameStats['multiple-choice'].highScore) {
            this.gameData.gameStats['multiple-choice'].highScore = score;
        }
        this.gameData.totalScore += score;
        this.gameData.gamesPlayed++;
        this.saveGameData();
        this.saveGameHistory('multiple-choice', score, this.multipleChoiceDifficulty);
        this.updateStats();
    }
    
    selectOption(selected, correct) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            } else if (btn.textContent === selected && selected !== correct) {
                btn.classList.add('incorrect');
            }
        });
        
        if (selected === correct) {
            this.score += 10;
        } else {
            this.score = Math.max(0, this.score - 5);
        }
        
        setTimeout(() => this.nextQuestion(), 1500);
    }
    
    startTypingGame(container) {
        const vocab = this.getRandomVocabulary();
        
        container.innerHTML = `
            <div class="game-header">
                <div class="game-score">Điểm: ${this.score}</div>
                <div class="game-timer">Câu: ${this.currentQuestion + 1}/10</div>
            </div>
            <div class="game-question">
                <h2>Gõ từ tiếng Anh có nghĩa là: "${vocab.vietnamese}"</h2>
            </div>
            <input type="text" class="game-input" id="typingInput" placeholder="Gõ từ tiếng Anh..." autocomplete="off">
            <div class="game-actions">
                <button class="action-btn primary" onclick="learningHub.checkTypingAnswer('${vocab.english}')">Kiểm tra</button>
                <button class="action-btn secondary" onclick="learningHub.skipQuestion()">Bỏ qua</button>
            </div>
        `;
        
        document.getElementById('typingInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkTypingAnswer(vocab.english);
            }
        });
    }
    
    checkTypingAnswer(correct) {
        const input = document.getElementById('typingInput');
        const answer = input.value.toLowerCase().trim();
        
        if (answer === correct.toLowerCase()) {
            this.score += 15;
            input.style.borderColor = 'var(--dol-green)';
            input.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
        } else {
            this.score = Math.max(0, this.score - 3);
            input.style.borderColor = 'var(--dol-red)';
            input.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        }
        
        setTimeout(() => this.nextQuestion(), 1000);
    }
    
    startSpeedGame(container, difficulty = 'easy') {
        // Show ready screen first
        this.showSpeedReadyScreen(container, difficulty);
    }
    
    showSpeedReadyScreen(container, difficulty) {
        const settings = this.getSpeedSettings(difficulty);
        
        container.innerHTML = `
            <div class="speed-ready-screen">
                <div class="ready-container">
                    <h2>Are You Ready?</h2>
                    <div class="speed-settings">
                        <p><strong>Độ khó:</strong> ${settings.name}</p>
                        <p><strong>Thời gian:</strong> ${settings.time}s</p>
                        <p><strong>Lựa chọn:</strong> ${settings.choices} options</p>
                        <p><strong>Từ vựng:</strong> ${settings.levels}</p>
                    </div>
                    <div class="ready-buttons">
                        <button class="action-btn primary" onclick="learningHub.startSpeedCountdown('${difficulty}')">
                            <i class="fas fa-play"></i> Yes
                        </button>
                        <button class="action-btn secondary" onclick="learningHub.closeGame()">
                            <i class="fas fa-times"></i> Later
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getSpeedSettings(difficulty) {
        const settings = {
            'easy': {
                name: 'Dễ (A1-A2)',
                time: 40,
                choices: 3,
                levels: 'A1-A2',
                minLevel: 'A1',
                maxLevel: 'A2'
            },
            'medium': {
                name: 'Trung bình (A1-B1)',
                time: 30,
                choices: 4,
                levels: 'A1-B1',
                minLevel: 'A1',
                maxLevel: 'B1'
            },
            'hard': {
                name: 'Khó (B1-C1)',
                time: 25,
                choices: 5,
                levels: 'B1-C1',
                minLevel: 'B1',
                maxLevel: 'C1'
            },
            'expert': {
                name: 'Chuyên gia (C1-C2)',
                time: 20,
                choices: 6,
                levels: 'C1-C2',
                minLevel: 'C1',
                maxLevel: 'C2'
            }
        };
        return settings[difficulty];
    }
    
    startSpeedCountdown(difficulty) {
        const container = document.getElementById('gameContainer');
        this.speedDifficulty = difficulty;
        this.speedSettings = this.getSpeedSettings(difficulty);
        this.speedScore = 0;
        this.speedQuestionCount = 0;
        
        container.innerHTML = `
            <div class="speed-countdown">
                <div class="countdown-container">
                    <div class="countdown-number" id="countdownNumber">3</div>
                </div>
            </div>
        `;
        
        let count = 3;
        const countdownInterval = setInterval(() => {
            const countdownElement = document.getElementById('countdownNumber');
            
            if (count > 0) {
                countdownElement.textContent = count;
                countdownElement.style.opacity = '0';
                setTimeout(() => {
                    countdownElement.style.opacity = '1';
                }, 100);
                count--;
            } else if (count === 0) {
                countdownElement.textContent = 'GO!';
                countdownElement.style.opacity = '0';
                setTimeout(() => {
                    countdownElement.style.opacity = '1';
                }, 100);
                count--;
            } else {
                clearInterval(countdownInterval);
                this.startSpeedGameplay(container);
            }
        }, 1000);
    }
    
    startSpeedGameplay(container) {
        this.speedTimeLeft = this.speedSettings.time;
        this.speedWords = vocabularyDB.getVocabularyByDifficultyRange(
            this.speedSettings.minLevel, 
            this.speedSettings.maxLevel
        );
        
        this.startSpeedTimer();
        this.showSpeedQuestion(container);
    }
    
    startSpeedTimer() {
        this.speedTimer = setInterval(() => {
            this.speedTimeLeft--;
            const timerElement = document.querySelector('.game-timer');
            if (timerElement) {
                timerElement.textContent = `Thời gian: ${this.speedTimeLeft}s`;
            }
            
            if (this.speedTimeLeft <= 0) {
                this.endSpeedGame();
            }
        }, 1000);
    }
    
    showSpeedQuestion(container) {
        const vocab = vocabularyDB.shuffleArray([...this.speedWords])[0];
        const options = this.getSpeedOptions(vocab);
        
        container.innerHTML = `
            <div class="speed-game">
                <div class="game-header">
                    <div class="game-score">Điểm: ${this.speedScore}</div>
                    <div class="game-timer">Thời gian: ${this.speedTimeLeft}s</div>
                    <div class="game-questions">Câu: ${this.speedQuestionCount + 1}</div>
                </div>
                <div class="game-question">
                    <h2>Nghĩa của "${vocab.vietnamese}" là gì?</h2>
                </div>
                <div class="game-options speed-layout" data-choices="${this.speedSettings.choices}">
                    ${options.map((option, index) => `
                        <button class="option-btn" onclick="learningHub.selectSpeedOption('${option}', '${vocab.english}')">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getSpeedOptions(correctWord) {
        const options = [correctWord.english];
        const allWords = this.speedWords.map(w => w.english);
        
        while (options.length < this.speedSettings.choices) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!options.includes(randomWord)) {
                options.push(randomWord);
            }
        }
        
        return vocabularyDB.shuffleArray(options);
    }
    
    selectSpeedOption(selected, correct) {
        this.speedQuestionCount++;
        
        if (selected === correct) {
            this.speedScore += 10;
        } else {
            this.speedScore = Math.max(0, this.speedScore - 2);
        }
        
        this.showSpeedQuestion(document.getElementById('gameContainer'));
    }
    
    endSpeedGame() {
        clearInterval(this.speedTimer);
        
        const container = document.getElementById('gameContainer');
        const title = this.getSpeedTitle(this.speedScore);
        
        container.innerHTML = `
            <div class="test-results">
                <h2>${title}</h2>
                <div class="final-score">
                    <h3>Điểm số: ${this.speedScore}</h3>
                    <p>Câu đã trả lời: ${this.speedQuestionCount}</p>
                    <p>Thời gian: ${this.speedSettings.time}s</p>
                </div>
                <div class="test-actions">
                    <button class="action-btn primary" onclick="learningHub.launchGame('speed', '${this.speedDifficulty}')">
                        Chơi lại
                    </button>
                    <button class="action-btn secondary" onclick="learningHub.closeGame()">
                        Đóng
                    </button>
                </div>
            </div>
        `;
        
        // Save score
        this.saveSpeedScore(this.speedScore);
    }
    
    getSpeedTitle(score) {
        if (score >= 40) {
            return "Try your best";
        } else if (score >= 150) {
            return "Continue your Streak !!!";
        } else if (score >= 300) {
            return "Bullet !?";
        } else {
            return "How?";
        }
    }
    
    saveSpeedScore(score) {
        this.gameData.gameStats.speed.plays++;
        if (score > this.gameData.gameStats.speed.highScore) {
            this.gameData.gameStats.speed.highScore = score;
        }
        this.gameData.totalScore += score;
        this.gameData.gamesPlayed++;
        this.saveGameData();
        this.saveGameHistory('speed', score, this.speedDifficulty);
        this.updateStats();
    }
    
    startShooterGame(container) {
        container.innerHTML = `
            <div class="game-header">
                <div class="game-score">Điểm: ${this.score}</div>
                <div class="game-timer">Thời gian: 60s</div>
            </div>
            <div class="game-question">
                <h2>Bắn từ tiếng Anh đang rơi xuống!</h2>
                <p>Gõ từ tiếng Anh để bắn từ tương ứng</p>
            </div>
            <div id="shooterCanvas" style="height: 400px; border: 2px solid var(--dol-orange); border-radius: 15px; position: relative; overflow: hidden; background: linear-gradient(180deg, #87CEEB, #98FB98);">
                <div id="fallingWords"></div>
            </div>
            <input type="text" class="game-input" id="shooterInput" placeholder="Gõ từ để bắn..." autocomplete="off">
            <div class="game-actions">
                <button class="action-btn secondary" onclick="learningHub.endGame()">Kết thúc</button>
            </div>
        `;
        
        this.startShooterLoop();
    }
    
    startShooterLoop() {
        this.shooterTimer = 60;
        this.fallingWords = [];
        
        // Start countdown
        this.shooterCountdown = setInterval(() => {
            this.shooterTimer--;
            document.querySelector('.game-timer').textContent = `Thời gian: ${this.shooterTimer}s`;
            
            if (this.shooterTimer <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Create falling words
        this.wordCreationInterval = setInterval(() => {
            this.createFallingWord();
        }, 2000);
        
        // Setup input handler
        document.getElementById('shooterInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.shootWord();
            }
        });
    }
    
    createFallingWord() {
        const vocab = this.getRandomVocabulary();
        const wordElement = document.createElement('div');
        wordElement.className = 'falling-word';
        wordElement.textContent = vocab.english;
        wordElement.style.cssText = `
            position: absolute;
            top: -50px;
            left: ${Math.random() * 80 + 10}%;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--dol-red);
            background: var(--dol-white);
            padding: 0.5rem 1rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fall 5s linear forwards;
        `;
        
        wordElement.dataset.word = vocab.english;
        wordElement.dataset.vietnamese = vocab.vietnamese;
        
        document.getElementById('fallingWords').appendChild(wordElement);
        this.fallingWords.push(wordElement);
        
        // Remove word after animation
        setTimeout(() => {
            if (wordElement.parentNode) {
                wordElement.parentNode.removeChild(wordElement);
                this.fallingWords = this.fallingWords.filter(w => w !== wordElement);
            }
        }, 5000);
    }
    
    shootWord() {
        const input = document.getElementById('shooterInput');
        const typedWord = input.value.toLowerCase().trim();
        
        if (!typedWord) return;
        
        // Find matching falling word
        const targetWord = this.fallingWords.find(word => 
            word.dataset.word.toLowerCase() === typedWord
        );
        
        if (targetWord) {
            this.score += 25;
            targetWord.style.animation = 'none';
            targetWord.style.transform = 'scale(1.5)';
            targetWord.style.color = 'var(--dol-green)';
            targetWord.style.background = 'var(--dol-yellow)';
            
            setTimeout(() => {
                if (targetWord.parentNode) {
                    targetWord.parentNode.removeChild(targetWord);
                    this.fallingWords = this.fallingWords.filter(w => w !== targetWord);
                }
            }, 500);
        } else {
            this.score = Math.max(0, this.score - 5);
        }
        
        input.value = '';
    }
    
    getRandomVocabulary(level = 'beginner') {
        const words = vocabularyDB.getVocabulary(level);
        return words[Math.floor(Math.random() * words.length)];
    }
    
    getRandomOptions(correctAnswer, level = 'beginner') {
        const options = [correctAnswer];
        const allWords = vocabularyDB.getVocabulary(level).map(v => v.english);
        
        while (options.length < 4) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!options.includes(randomWord)) {
                options.push(randomWord);
            }
        }
        
        return this.shuffleArray(options);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion >= 10) {
            this.endGame();
        } else {
            // Update question counter
            const timerElement = document.querySelector('.game-timer');
            if (timerElement) {
                timerElement.textContent = `Câu: ${this.currentQuestion + 1}/10`;
            }
            
            // Update score
            const scoreElement = document.querySelector('.game-score');
            if (scoreElement) {
                scoreElement.textContent = `Điểm: ${this.score}`;
            }
            
            // Show next question based on game type
            switch (this.currentGame) {
                case 'flashcard':
                    this.startFlashcardGame(document.getElementById('gameContainer'));
                    break;
                case 'multiple-choice':
                    this.startMultipleChoiceGame(document.getElementById('gameContainer'));
                    break;
                case 'typing':
                    this.startTypingGame(document.getElementById('gameContainer'));
                    break;
            }
        }
    }
    
    skipQuestion() {
        this.nextQuestion();
    }
    
    endGame() {
        // Clear any timers
        if (this.timer) clearInterval(this.timer);
        if (this.shooterCountdown) clearInterval(this.shooterCountdown);
        if (this.wordCreationInterval) clearInterval(this.wordCreationInterval);
        
        // Update game data
        this.gameData.totalScore += this.score;
        this.gameData.gamesPlayed++;
        this.gameData.gameStats[this.currentGame].plays++;
        
        if (this.score > this.gameData.gameStats[this.currentGame].highScore) {
            this.gameData.gameStats[this.currentGame].highScore = this.score;
        }
        
        // Update streak
        const today = new Date().toDateString();
        if (this.gameData.lastPlayDate !== today) {
            this.gameData.streak++;
            this.gameData.lastPlayDate = today;
        }
        
        this.saveGameData();
        this.updateStats();
        
        // Show game over screen
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="color: var(--dol-red); margin-bottom: 1rem;">🎉 Game Over!</h2>
                <div style="font-size: 1.5rem; margin-bottom: 1rem;">
                    <strong>Điểm số: ${this.score}</strong>
                </div>
                <div style="margin-bottom: 2rem;">
                    <p>Chúc mừng bạn đã hoàn thành minigame!</p>
                    <p>Tiếp tục luyện tập để cải thiện kỹ năng tiếng Anh nhé!</p>
                </div>
                <div class="game-actions">
                    <button class="action-btn primary" onclick="learningHub.startGame('${this.currentGame}')">
                        Chơi lại
                    </button>
                    <button class="action-btn secondary" onclick="learningHub.closeGame()">
                        Đóng
                    </button>
                </div>
            </div>
        `;
    }
    
    closeGame() {
        document.getElementById('gameModal').style.display = 'none';
        this.currentGame = null;
    }
    
    showVocabulary() {
        const modal = document.getElementById('vocabModal');
        const vocabList = document.getElementById('vocabList');
        
        // Get all vocabulary from database
        const allWords = [];
        Object.keys(vocabularyDB.vocabulary).forEach(level => {
            Object.keys(vocabularyDB.vocabulary[level]).forEach(topic => {
                vocabularyDB.vocabulary[level][topic].forEach(word => {
                    allWords.push(word);
                });
            });
        });
        
        vocabList.innerHTML = allWords.map(vocab => `
            <div class="vocab-item">
                <div class="vocab-english">${vocab.english}</div>
                <div class="vocab-vietnamese">${vocab.vietnamese}</div>
                <div class="vocab-pronunciation">${vocab.pronunciation}</div>
            </div>
        `).join('');
        
        modal.style.display = 'block';
    }
    
    closeVocabulary() {
        document.getElementById('vocabModal').style.display = 'none';
    }
    
    // Word Puzzle Game
    startPuzzleGame(container) {
        const vocab = this.getRandomVocabulary();
        const scrambledWord = this.scrambleWord(vocab.english);
        
        container.innerHTML = `
            <div class="game-header">
                <div class="game-score">Điểm: ${this.score}</div>
                <div class="game-timer">Câu: ${this.currentQuestion + 1}/10</div>
            </div>
            <div class="game-question">
                <h2>Ghép từ tiếng Anh có nghĩa là: "${vocab.vietnamese}"</h2>
                <div class="puzzle-letters" id="puzzleLetters">
                    ${scrambledWord.split('').map(letter => 
                        `<span class="puzzle-letter" onclick="learningHub.selectLetter('${letter}')">${letter}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="puzzle-answer" id="puzzleAnswer"></div>
            <div class="game-actions">
                <button class="action-btn primary" onclick="learningHub.checkPuzzleAnswer('${vocab.english}')">
                    Kiểm tra
                </button>
                <button class="action-btn secondary" onclick="learningHub.skipQuestion()">
                    Bỏ qua
                </button>
            </div>
        `;
        
        this.currentPuzzleAnswer = '';
    }
    
    selectLetter(letter) {
        this.currentPuzzleAnswer += letter;
        document.getElementById('puzzleAnswer').innerHTML = this.currentPuzzleAnswer;
    }
    
    checkPuzzleAnswer(correct) {
        if (this.currentPuzzleAnswer.toLowerCase() === correct.toLowerCase()) {
            this.score += 20;
            document.getElementById('puzzleAnswer').style.color = 'var(--dol-green)';
        } else {
            this.score = Math.max(0, this.score - 5);
            document.getElementById('puzzleAnswer').style.color = 'var(--dol-red)';
        }
        
        setTimeout(() => this.nextQuestion(), 1500);
    }
    
    scrambleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
    }
    
    // Memory Match Game
    startMemoryGame(container) {
        const words = this.getRandomVocabulary('beginner', null, 4);
        const cards = [];
        
        // Tạo cặp thẻ
        words.forEach(word => {
            cards.push({ type: 'english', content: word.english, pair: word.vietnamese });
            cards.push({ type: 'vietnamese', content: word.vietnamese, pair: word.english });
        });
        
        // Xáo trộn thẻ
        this.shuffleArray(cards);
        
        container.innerHTML = `
            <div class="game-header">
                <div class="game-score">Điểm: ${this.score}</div>
                <div class="game-timer">Thời gian: 60s</div>
            </div>
            <div class="game-question">
                <h2>Tìm cặp từ tiếng Anh và nghĩa tiếng Việt!</h2>
            </div>
            <div class="memory-grid" id="memoryGrid">
                ${cards.map((card, index) => `
                    <div class="memory-card" data-index="${index}" onclick="learningHub.flipCard(${index})">
                        <div class="card-content">?</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.memoryCards = cards;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.startMemoryTimer();
    }
    
    flipCard(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        const cardData = this.memoryCards[index];
        
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        card.querySelector('.card-content').textContent = cardData.content;
        
        this.flippedCards.push({ index, data: cardData });
        
        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMemoryMatch(), 1000);
        }
    }
    
    checkMemoryMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.data.pair === card2.data.content) {
            // Match found
            document.querySelector(`[data-index="${card1.index}"]`).classList.add('matched');
            document.querySelector(`[data-index="${card2.index}"]`).classList.add('matched');
            this.score += 25;
            this.matchedPairs++;
            
            if (this.matchedPairs === 4) {
                this.endMemoryGame();
            }
        } else {
            // No match
            document.querySelector(`[data-index="${card1.index}"]`).classList.remove('flipped');
            document.querySelector(`[data-index="${card2.index}"]`).classList.remove('flipped');
            document.querySelector(`[data-index="${card1.index}"] .card-content`).textContent = '?';
            document.querySelector(`[data-index="${card2.index}"] .card-content`).textContent = '?';
        }
        
        this.flippedCards = [];
    }
    
    startMemoryTimer() {
        this.memoryTimeLeft = 60;
        this.memoryTimer = setInterval(() => {
            this.memoryTimeLeft--;
            document.querySelector('.game-timer').textContent = `Thời gian: ${this.memoryTimeLeft}s`;
            
            if (this.memoryTimeLeft <= 0) {
                this.endMemoryGame();
            }
        }, 1000);
    }
    
    endMemoryGame() {
        clearInterval(this.memoryTimer);
        this.endGame();
    }
    
    startWordShooterLoop() {
        this.shooterTimeLeft = 45;
        this.cannonPosition = 50; // percentage
        this.flyingWords = [];
        
        // Start countdown
        this.shooterCountdown = setInterval(() => {
            this.shooterTimeLeft--;
            document.querySelector('.game-timer').textContent = `Thời gian: ${this.shooterTimeLeft}s`;
            
            if (this.shooterTimeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Create flying words
        this.shooterWordInterval = setInterval(() => {
            this.createFlyingShooterWord();
        }, 2500);
        
        // Setup keyboard controls
        document.addEventListener('keydown', this.handleShooterKeydown.bind(this));
    }
    
    handleShooterKeydown(e) {
        const cannon = document.getElementById('cannon');
        
        switch(e.key) {
            case 'ArrowLeft':
                this.cannonPosition = Math.max(10, this.cannonPosition - 10);
                cannon.style.left = this.cannonPosition + '%';
                break;
            case 'ArrowRight':
                this.cannonPosition = Math.min(90, this.cannonPosition + 10);
                cannon.style.left = this.cannonPosition + '%';
                break;
            case ' ':
                e.preventDefault();
                this.shootWord();
                break;
        }
    }
    
    createFlyingShooterWord() {
        const vocab = this.getRandomVocabulary();
        const wordElement = document.createElement('div');
        wordElement.className = 'flying-shooter-word';
        wordElement.textContent = vocab.english;
        wordElement.style.cssText = `
            position: absolute;
            top: -50px;
            left: ${Math.random() * 80 + 10}%;
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--dol-red);
            background: var(--dol-white);
            padding: 0.5rem 1rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: flyDown 4s linear forwards;
        `;
        
        wordElement.dataset.word = vocab.english;
        wordElement.dataset.vietnamese = vocab.vietnamese;
        
        document.getElementById('flyingWords').appendChild(wordElement);
        this.flyingWords.push(wordElement);
        
        // Remove word after animation
        setTimeout(() => {
            if (wordElement.parentNode) {
                wordElement.parentNode.removeChild(wordElement);
                this.flyingWords = this.flyingWords.filter(w => w !== wordElement);
            }
        }, 4000);
    }
    
    shootWord() {
        const cannon = document.getElementById('cannon');
        const cannonRect = cannon.getBoundingClientRect();
        const cannonCenter = cannonRect.left + cannonRect.width / 2;
        
        // Find word near cannon
        const nearbyWord = this.flyingWords.find(word => {
            const wordRect = word.getBoundingClientRect();
            const wordCenter = wordRect.left + wordRect.width / 2;
            return Math.abs(cannonCenter - wordCenter) < 100;
        });
        
        if (nearbyWord) {
            this.score += 30;
            nearbyWord.style.animation = 'none';
            nearbyWord.style.transform = 'scale(1.5)';
            nearbyWord.style.color = 'var(--dol-green)';
            nearbyWord.style.background = 'var(--dol-yellow)';
            
            setTimeout(() => {
                if (nearbyWord.parentNode) {
                    nearbyWord.parentNode.removeChild(nearbyWord);
                    this.flyingWords = this.flyingWords.filter(w => w !== nearbyWord);
                }
            }, 500);
        } else {
            this.score = Math.max(0, this.score - 3);
        }
    }
    
    showLeaderboard(type) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // For now, show the same leaderboard for all types
        // In a real app, you would filter by date range
        this.updateLeaderboard();
    }
    
    toggleFavorite(gameType) {
        const index = this.favorites.indexOf(gameType);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(gameType);
        }
        this.saveFavorites();
        this.updateStats();
        
        // Update button appearance
        const btn = document.querySelector(`[onclick="toggleFavorite('${gameType}')"]`);
        if (btn) {
            btn.classList.toggle('active');
        }
    }
    
    showGameHistory(gameType) {
        const modal = document.getElementById('gameModal');
        const gameContainer = document.getElementById('gameContainer');
        
        const history = this.getGameHistory(gameType);
        
        gameContainer.innerHTML = `
            <div class="game-history">
                <h2>Lịch sử chơi - ${this.getGameName(gameType)}</h2>
                <div class="history-stats">
                    <div class="stat-item">
                        <span class="stat-number">${history.plays}</span>
                        <span class="stat-label">Lượt chơi</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${history.highScore}</span>
                        <span class="stat-label">Điểm cao nhất</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${history.totalScore}</span>
                        <span class="stat-label">Tổng điểm</span>
                    </div>
                </div>
                <div class="history-list">
                    ${history.recentGames.map(game => `
                        <div class="history-item">
                            <div class="history-date">${game.date}</div>
                            <div class="history-score">${game.score} điểm</div>
                            <div class="history-difficulty">${game.difficulty}</div>
                        </div>
                    `).join('')}
                </div>
                <button class="action-btn secondary" onclick="learningHub.closeGame()">
                    Đóng
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }
    
    getGameHistory(gameType) {
        const stats = this.gameData.gameStats[gameType] || { highScore: 0, plays: 0 };
        const recentGames = JSON.parse(localStorage.getItem(`gameHistory_${gameType}`) || '[]');
        
        return {
            plays: stats.plays,
            highScore: stats.highScore,
            totalScore: recentGames.reduce((sum, game) => sum + game.score, 0),
            recentGames: recentGames.slice(0, 10)
        };
    }
    
    getGameName(gameType) {
        const names = {
            'flashcard': 'Flashcard Quiz',
            'multiple-choice': 'Multiple Choice',
            'speed': 'Speed Mode',
            'typing': 'Typing Challenge',
            'shooter': 'Word Shooter',
            'puzzle': 'Word Puzzle',
            'memory': 'Memory Match'
        };
        return names[gameType] || gameType;
    }
    
    getDifficultyName(difficulty) {
        const names = {
            'easy': 'Dễ (A1-A2)',
            'medium': 'Trung bình (B1-C1)',
            'hard': 'Khó (C1-C2)',
            'expert': 'Chuyên gia (C1-C2)'
        };
        return names[difficulty] || difficulty;
    }
    
    saveGameHistory(gameType, score, difficulty) {
        const history = JSON.parse(localStorage.getItem(`gameHistory_${gameType}`) || '[]');
        history.unshift({
            date: new Date().toLocaleDateString('vi-VN'),
            score: score,
            difficulty: difficulty
        });
        
        // Keep only last 50 games
        if (history.length > 50) {
            history.splice(50);
        }
        
        localStorage.setItem(`gameHistory_${gameType}`, JSON.stringify(history));
    }
}

// Add CSS for falling animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        from { transform: translateY(-50px); }
        to { transform: translateY(450px); }
    }
`;
document.head.appendChild(style);

// Initialize the learning hub
let learningHub;

document.addEventListener('DOMContentLoaded', function() {
    learningHub = new LearningHub();
    initializeModeButtons();
});

// Global functions for HTML onclick events
function startGame(gameType) {
    learningHub.startGame(gameType);
}

function showVocabulary() {
    learningHub.showVocabulary();
}

function showLeaderboard(type) {
    learningHub.showLeaderboard(type);
}

// Learning Mode Management
let currentMode = 'all';

// Initialize mode buttons
function initializeModeButtons() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            modeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the mode from data attribute
            currentMode = this.getAttribute('data-mode');
            
            // Filter games based on selected mode
            filterGamesByMode(currentMode);
        });
    });
}

// Filter games by mode
function filterGamesByMode(mode) {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const gameType = card.getAttribute('data-game');
        let shouldShow = false;
        
        switch(mode) {
            case 'all':
                shouldShow = true;
                break;
            case 'beginner':
                shouldShow = ['flashcard', 'multiple-choice', 'typing'].includes(gameType);
                break;
            case 'intermediate':
                shouldShow = ['word-shooter', 'puzzle', 'memory'].includes(gameType);
                break;
            case 'advanced':
                shouldShow = ['speed'].includes(gameType);
                break;
            case 'favorites':
                // Check if game is in favorites (you can implement this based on user preferences)
                shouldShow = checkIfGameIsFavorite(gameType);
                break;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update the games section title based on mode
    updateGamesSectionTitle(mode);
}

// Check if game is favorite (placeholder function)
function checkIfGameIsFavorite(gameType) {
    // You can implement this based on user preferences stored in localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteGames') || '[]');
    return favorites.includes(gameType);
}

// Update games section title
function updateGamesSectionTitle(mode) {
    const gamesSection = document.querySelector('.games-section h2');
    if (!gamesSection) return;
    
    const titles = {
        'all': '🎮 Tất Cả Minigames',
        'beginner': '🟢 Games Cơ Bản',
        'intermediate': '🟡 Games Trung Bình', 
        'advanced': '🔴 Games Nâng Cao',
        'favorites': '⭐ Games Yêu Thích'
    };
    
    gamesSection.textContent = titles[mode] || '🎮 Minigames';
}

function closeGame() {
    learningHub.closeGame();
}

function closeVocabulary() {
    learningHub.closeVocabulary();
}

// Global functions for new features
function toggleFavorite(gameType) {
    learningHub.toggleFavorite(gameType);
}

function showGameHistory(gameType) {
    learningHub.showGameHistory(gameType);
}
