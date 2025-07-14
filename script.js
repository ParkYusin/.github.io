// --- 학생 데이터: 여기서 쉽게 구성 가능 ---
// 'name'은 학생의 전체 이름이어야 합니다.
// 'image'는 학생 얼굴 이미지의 경로여야 합니다.
// 이미지가 'images' 폴더에 있는지 확인하거나 전체 URL을 제공하세요.
const students = [
    { name: "김민우", image: "images/김민우.jpg" },
    { name: "서주미", image: "images/서주미.jpeg" },
    { name: "박유신", image: "images/박유신.jpeg" },
    { name: "배용건", image: "images/배용건.jpeg" },
    { name: "김종환", image: "images/김종환.jpg" },
    { name: "김예향", image: "images/김예향.png" },
    { name: "김영훈", image: "images/김영훈.jpg" },
    { name: "김두진", image: "images/김두진.jpg" },
    { name: "김태영", image: "images/김태영.png" },
    { name: "문예찬", image: "images/문예찬.jpg" },
    { name: "조영진", image: "images/조영진.jpg" },
    { name: "신건하", image: "images/신건하.jpeg" },
    { name: "이현석", image: "images/이현석.jpeg" },
    { name: "신승호", image: "images/신승호.jpg" },
    { name: "송준서", image: "images/송준서.jpg" },
    { name: "이석호", image: "images/이석호.jpg" },
    { name: "심미진", image: "images/심미진.png" },
    // 이준영 학생은 파일 확장자가 다른 두 개의 이미지가 있어 구분을 위해 이름을 다르게 했습니다.
    // 만약 한 명의 이준영 학생이라면, 둘 중 하나를 선택하고 이름을 '이준영'으로 통일하세요.
    { name: "이준영 (png)", image: "images/이준영.png" },
    { name: "이준영 (jpg)", image: "images/이준영.jpg" },
    { name: "이도성", image: "images/이도성.jpg" },
    { name: "최성원", image: "images/최성원.png" },
    { name: "최희건", image: "images/최희건.png" },
];

// --- 게임 변수 ---
let currentQuizType = null; // 현재 퀴즈 유형 ('face-to-name' 또는 'name-to-face')
let currentQuestion = {}; // 현재 문제의 정보 (정답, 선택지 등)
let score = 0; // 현재 점수
let questionCount = 0; // 진행된 문제 수
const totalQuestionsPerQuiz = 22; // 총 문제 수 (학생 수에 맞춰 22로 설정)
let availableStudentsForQuiz = []; // 퀴즈에 아직 출제되지 않은 학생 목록

// --- DOM 요소 가져오기 ---
const quizOptionsDiv = document.getElementById('quiz-options');
const quizAreaDiv = document.getElementById('quiz-area');
const quizCompleteAreaDiv = document.getElementById('quiz-complete-area');
const faceToNameBtn = document.getElementById('face-to-name-btn');
const nameToFaceBtn = document.getElementById('name-to-face-btn');
const currentScoreSpan = document.getElementById('current-score');
const totalQuestionsSpan = document.getElementById('total-questions');
const feedbackMessage = document.getElementById('feedback-message');
const faceToNameQuizDiv = document.getElementById('face-to-name-quiz');
const nameToFaceQuizDiv = document.getElementById('name-to-face-quiz');
const quizFaceImage = document.getElementById('quiz-face-image');
const faceNameChoicesDiv = document.getElementById('face-name-choices');
const quizNameText = document.getElementById('quiz-name-text');
const nameFaceChoicesDiv = document.getElementById('name-face-choices');
const nextQuestionBtn = document.getElementById('next-question-btn');
const finalScoreSpan = document.getElementById('final-score');
const finalTotalSpan = document.getElementById('final-total');
const restartQuizBtn = document.getElementById('restart-quiz-btn');

// --- 이벤트 리스너 설정 ---
faceToNameBtn.addEventListener('click', () => startGame('face-to-name'));
nameToFaceBtn.addEventListener('click', () => startGame('name-to-face'));
nextQuestionBtn.addEventListener('click', loadNextQuestion);
restartQuizBtn.addEventListener('click', resetGame);

// --- 게임 함수 ---

/**
 * 퀴즈 게임을 시작합니다.
 * @param {string} type - 시작할 퀴즈 유형 ('face-to-name' 또는 'name-to-face').
 */
function startGame(type) {
    currentQuizType = type;
    score = 0;
    questionCount = 0;
    
    // 퀴즈 선택지가 최소 4개는 필요하므로 학생 수가 4명 미만이면 경고
    if (students.length < 4) {
        alert("퀴즈를 시작하려면 최소 4명의 학생 데이터가 필요합니다!");
        resetGame(); // 퀴즈 선택 화면으로 돌아가기
        return;
    }
    // 퀴즈를 위한 학생 풀을 리셋하고 섞습니다. (원본 배열을 복사하여 사용)
    availableStudentsForQuiz = shuffleArray([...students]); 

    // UI 상태 업데이트: 퀴즈 선택 화면 숨기고 퀴즈 영역 표시
    quizOptionsDiv.classList.add('hidden');
    quizAreaDiv.classList.remove('hidden');
    quizCompleteAreaDiv.classList.add('hidden'); // 완료 화면 숨김
    feedbackMessage.classList.add('hidden'); // 피드백 메시지 숨김
    nextQuestionBtn.classList.add('hidden'); // 다음 문제 버튼 숨김

    updateScoreDisplay(); // 점수 표시 업데이트
    loadNextQuestion(); // 첫 문제 로드
}

/**
 * 다음 퀴즈 문제를 로드합니다.
 */
function loadNextQuestion() {
    feedbackMessage.classList.add('hidden'); // 피드백 메시지 숨김
    feedbackMessage.textContent = ''; // 이전 피드백 텍스트 지우기
    nextQuestionBtn.classList.add('hidden'); // 다음 문제 버튼 숨김

    // 모든 문제를 풀었거나 더 이상 출제할 학생이 없으면 게임 종료
    if (questionCount >= totalQuestionsPerQuiz || availableStudentsForQuiz.length === 0) {
        endGame();
        return;
    }

    questionCount++; // 문제 수 증가
    updateScoreDisplay(); // 점수 표시 업데이트

    // 현재 문제의 정답이 될 학생을 availableStudentsForQuiz에서 하나 뽑습니다.
    const correctAnswerStudent = availableStudentsForQuiz.pop();
    currentQuestion.correctAnswer = correctAnswerStudent;

    // 선택지 생성 (정답과 무작위 오답 포함)
    let allChoices = [currentQuestion.correctAnswer]; // 정답을 먼저 선택지에 추가
    // 정답 학생을 제외한 나머지 학생들 중에서 오답 선택지를 고릅니다.
    const incorrectStudents = students.filter(s => s.name !== currentQuestion.correctAnswer.name);
    const shuffledIncorrect = shuffleArray(incorrectStudents); // 오답 후보들을 섞습니다.

    // 3개까지의 고유한 오답 선택지를 가져옵니다.
    // 이미 선택지에 추가된 학생과 중복되지 않도록 확인합니다.
    while (allChoices.length < 4 && shuffledIncorrect.length > 0) {
        const randomIncorrect = shuffledIncorrect.pop();
        // 현재 allChoices 배열에 이 학생의 이름이 이미 포함되어 있지 않은 경우에만 추가
        if (!allChoices.some(s => s.name === randomIncorrect.name)) {
            allChoices.push(randomIncorrect);
        }
    }
    currentQuestion.choices = shuffleArray(allChoices); // 최종 선택지들을 섞습니다.

    // 퀴즈 유형에 따라 문제 표시 함수 호출
    if (currentQuizType === 'face-to-name') {
        faceToNameQuizDiv.classList.remove('hidden');
        nameToFaceQuizDiv.classList.add('hidden');
        displayFaceToNameQuestion();
    } else { // name-to-face
        nameToFaceQuizDiv.classList.remove('hidden');
        faceToNameQuizDiv.classList.add('hidden');
        displayNameToFaceQuestion();
    }
}

/**
 * '얼굴로 이름 맞추기' 퀴즈 문제를 화면에 표시합니다.
 */
function displayFaceToNameQuestion() {
    quizFaceImage.src = currentQuestion.correctAnswer.image; // 질문 이미지 설정
    quizFaceImage.alt = currentQuestion.correctAnswer.name; // 이미지 대체 텍스트 설정

    faceNameChoicesDiv.innerHTML = ''; // 이전 선택 버튼들 지우기
    currentQuestion.choices.forEach(student => {
        const button = document.createElement('button');
        button.textContent = student.name; // 버튼 텍스트를 학생 이름으로 설정
        button.classList.add('choice-btn'); // CSS 클래스 추가
        button.dataset.name = student.name; // 데이터 속성에 학생 이름 저장 (정답 확인용)
        // 버튼 클릭 시 checkAnswer 함수 호출
        button.addEventListener('click', () => checkAnswer(student.name, 'face-to-name'));
        faceNameChoicesDiv.appendChild(button); // 선택지 영역에 버튼 추가
    });
}

/**
 * '이름으로 얼굴 맞추기' 퀴즈 문제를 화면에 표시합니다.
 */
function displayNameToFaceQuestion() {
    quizNameText.textContent = currentQuestion.correctAnswer.name; // 질문 텍스트를 학생 이름으로 설정

    nameFaceChoicesDiv.innerHTML = ''; // 이전 이미지 버튼들 지우기
    currentQuestion.choices.forEach(student => {
        const button = document.createElement('button');
        button.classList.add('choice-image-btn'); // CSS 클래스 추가
        button.dataset.name = student.name; // 데이터 속성에 학생 이름 저장

        const img = document.createElement('img');
        img.src = student.image; // 이미지 소스 설정
        img.alt = student.name; // 이미지 대체 텍스트 설정
        img.classList.add('choice-image'); // CSS 클래스 추가

        button.appendChild(img); // 버튼에 이미지 추가
        // 버튼 클릭 시 checkAnswer 함수 호출
        button.addEventListener('click', () => checkAnswer(student.name, 'name-to-face'));
        nameFaceChoicesDiv.appendChild(button); // 선택지 영역에 버튼 추가
    });
}

/**
 * 사용자의 답변을 확인하고 피드백을 표시합니다.
 * @param {string} selectedAnswer - 사용자가 선택한 답변 (학생 이름).
 * @param {string} quizType - 현재 퀴즈 유형.
 */
function checkAnswer(selectedAnswer, quizType) {
    const isCorrect = (selectedAnswer === currentQuestion.correctAnswer.name); // 정답 여부 확인
    feedbackMessage.classList.remove('hidden', 'correct', 'incorrect'); // 기존 피드백 클래스 제거

    if (isCorrect) {
        feedbackMessage.textContent = '정답입니다!';
        feedbackMessage.classList.add('correct'); // 정답 CSS 클래스 추가
        score++; // 점수 증가
    } else {
        feedbackMessage.textContent = `오답입니다! 정답은 ${currentQuestion.correctAnswer.name}이었습니다.`;
        feedbackMessage.classList.add('incorrect'); // 오답 CSS 클래스 추가
    }

    updateScoreDisplay(); // 점수 표시 업데이트
    disableChoices(quizType); // 모든 선택지 비활성화
    nextQuestionBtn.classList.remove('hidden'); // 다음 문제 버튼 표시

    // 선택지들의 정답/오답 상태를 시각적으로 강조
    const choicesContainer = quizType === 'face-to-name' ? faceNameChoicesDiv : nameFaceChoicesDiv;
    Array.from(choicesContainer.children).forEach(choiceElem => {
        // 사용자가 선택한 버튼에 정답/오답 클래스 추가
        if (choiceElem.dataset.name === selectedAnswer) {
            choiceElem.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        // 사용자가 오답을 선택했을 경우, 정답 버튼도 강조
        if (choiceElem.dataset.name === currentQuestion.correctAnswer.name && !isCorrect) {
            choiceElem.classList.add('correct');
        }
    });
}

/**
 * 현재 퀴즈의 모든 선택지 버튼을 비활성화합니다.
 * @param {string} quizType - 현재 퀴즈 유형.
 */
function disableChoices(quizType) {
    const choicesContainer = quizType === 'face-to-name' ? faceNameChoicesDiv : nameFaceChoicesDiv;
    Array.from(choicesContainer.children).forEach(button => {
        button.disabled = true; // 버튼 비활성화
    });
}

/**
 * 현재 점수와 총 문제 수를 화면에 업데이트합니다.
 */
function updateScoreDisplay() {
    currentScoreSpan.textContent = score;
    totalQuestionsSpan.textContent = totalQuestionsPerQuiz;
}

/**
 * 퀴즈 게임을 종료하고 최종 점수 화면을 표시합니다.
 */
function endGame() {
    quizAreaDiv.classList.add('hidden'); // 퀴즈 영역 숨김
    quizCompleteAreaDiv.classList.remove('hidden'); // 퀴즈 완료 영역 표시
    finalScoreSpan.textContent = score; // 최종 점수 설정
    finalTotalSpan.textContent = totalQuestionsPerQuiz; // 최종 총 문제 수 설정
}

/**
 * 게임을 초기화하고 퀴즈 선택 화면으로 돌아갑니다.
 */
function resetGame() {
    quizCompleteAreaDiv.classList.add('hidden'); // 완료 화면 숨김
    quizOptionsDiv.classList.remove('hidden'); // 퀴즈 선택 화면 표시
    currentQuizType = null;
    score = 0;
    questionCount = 0;
    availableStudentsForQuiz = []; // 학생 풀 초기화
}

// --- 유틸리티 함수 ---

/**
 * 배열의 요소를 무작위로 섞습니다 (Fisher-Yates 셔플 알고리즘).
 * @param {Array} array - 섞을 배열.
 * @returns {Array} - 섞인 배열.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 배열 비구조화 할당을 이용한 요소 교환
    }
    return array;
}

// 페이지 로드 시 초기 상태 설정: 퀴즈 영역과 완료 영역을 숨깁니다.
document.addEventListener('DOMContentLoaded', () => {
    quizAreaDiv.classList.add('hidden');
    quizCompleteAreaDiv.classList.add('hidden');
});
