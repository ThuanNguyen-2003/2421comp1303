// Âm thanh trong game
let MainThemePlay = new Audio("audio/main theme.mp3");
let StartPlay = new Audio("audio/lets play.mp3");
let wrongPlay = new Audio("audio/wrong.mp3");
let correctPlay = new Audio("audio/correct.mp3");
let callPlay = new Audio("audio/call.mp3");
let callPlay1 = new Audio("audio/Goidien_LaiVanSam.mp3");
let fifty50Play = new Audio("audio/5050.mp3");
let fifty50Play1 = new Audio("audio/5050_LaiVanSam.mp3");
let audiencePlay = new Audio("audio/audience.mp3");
let audiencePlay1 = new Audio("audio/YKienKhanGia_LaiVanSam.mp3");
let inGamePlay = new Audio("audio/Question5-10.mp3");
let Win = new Audio("audio/Win.mp3");
let OutTime = new Audio("audio/Het_thoi_luong.ogg");
// ------ Các thành phần trong game --------//
// Màn hình bắt đầu
let startBox = document.querySelector(".start-box");
let startBtn = document.querySelector(".start-game-btn");
let userInput = document.querySelector(".username");
// Màn hình chính 
let gameBox = document.querySelector(".game-box");
let timer = document.querySelector(".timer");
let currQuestionAmount = document.querySelector(".current-question-amount");
let lifelineBox = document.querySelector(".life-line-display-box");
let callView = document.querySelector(".call");
let callAnswer = document.querySelector(".call-answer");
let auCover = document.querySelector(".au-cover");
let auBox = document.querySelectorAll(".au-box");
let bx = document.querySelector(".bx");
let questionBox = document.querySelector(".question");
let questionText = document.querySelector(".question-text");
let questionNumber = document.querySelector(".question-number");
let option = document.querySelectorAll(".option");
let optionText = document.querySelectorAll(".opt");
let nextQuestionBtn = document.querySelector(".next-question-btn");
let playAgainBtn = document.querySelector(".playAgain-btn");
let fify50Btn = document.querySelector(".fify50");
let addCancel = document.querySelectorAll(".cancel");
let CallBtn = document.querySelector(".callAFriend");
let askBtn = document.querySelector(".askTheAudience");
let prices = document.querySelector(".prices");
let amountWon = document.querySelector(".amount-won");
// ------ Các biến tùy chỉnh ------//
let questionIndex = 0;
let questionIndexStart = 0;
let interval;
let timeLimit;
let quiz = [];
// Khởi tạo âm thanh game khi màn hình được mở
window.addEventListener("load", () => {
    MainThemePlay.play();
})
// Hiển thị câu hỏi và đáp án
function generateQuestion() {
    questionText.innerHTML = quiz[questionIndex].question;
    optionText[0].textContent = quiz[questionIndex].options[0];
    optionText[1].textContent = quiz[questionIndex].options[1];
    optionText[2].textContent = quiz[questionIndex].options[2];
    optionText[3].textContent = quiz[questionIndex].options[3];
}
// Lấy câu hỏi từ file question.json
fetch("questions.json")
    .then(res => {
        return res.json();
    })
    .then(data => {
        getQuestions(data);
    })
    .catch(error => {
        console.log(error);
    });
// Chọn câu hỏi ngẫu nghiên
function getQuestions(data) {
    let rand;
    let count = 0;
    let countMed = 0;
    let countHard = 0;
    while (count < 5) {                                        // lặp cho đến khi chọn được 5 câu hỏi dễ
        rand = Math.floor(Math.random() * data.easy.length);   
        if (!quiz.includes(data.easy[rand])) {
            quiz.push(data.easy[rand]);
            count++;
        }  
    }
    while (countMed < 5) {                                     // lặp cho đến khi chọn được 5 câu hỏi trung bình
        rand = Math.floor(Math.random() * data.medium.length);
        if (!quiz.includes(data.medium[rand])) {
            quiz.push(data.medium[rand]);
            countMed++;
        }  
    }
    while (countHard < 5) {                                    // lặp cho đến khi chọn được 5 câu hỏi khó
        rand = Math.floor(Math.random() * data.hard.length);
        if (!quiz.includes(data.hard[rand])) {
            quiz.push(data.hard[rand]);
            countHard++;
        }
    }
    generateQuestion();
}
// Kiểm tra đáp án
function check(ele) {
    let answerCorrect = true;
    let id = parseInt(ele.id);
    if (id == quiz[questionIndex].answer) {
        ele.classList.add("correct");
        correctPlay.play();
        inGamePlay.pause();
        inGamePlay.currentTime = 0;
        answerCorrect = true;
        if (questionIndex === 14) {
            result();
            correctPlay.pause();
            Win.play();
        }
    }
    else {
        answerCorrect = false;
        result();
        ele.classList.add("wrong");
        wrongPlay.play();
        inGamePlay.pause();
        inGamePlay.currentTime = 0;
        option.forEach(op => {
            if (op.id == quiz[questionIndex].answer) {
                op.classList.add("show-correct");
            }
        })
        disableAllLifeLines();
        playAgain();
    }
    disableOptions();
    if (questionIndex < 14 && answerCorrect) {
        showNextBtn();
    }
    else {
        disableAllLifeLines();
        playAgain();
    }
    stopTimer();
}
// Thời gian kết thúc
function timeIsUp() {
    option.forEach(ele => {
        if (parseInt(ele.id) == parseInt(quiz[questionIndex].answer)) {
            ele.classList.add("show-correct");
        }
    })
    result();
    disableOptions();
    disableAllLifeLines();
    OutTime.play();
    inGamePlay.pause();
}
// Thời gian bắt đầu
function StartTimer(){
    timeLimit = 60;
    timer.innerHTML = timeLimit;
    timer.classList.remove("less-time");
    interval = setInterval(() => {  
        timeLimit--; 
        if (timeLimit < 10) {
            timeLimit = "0" + timeLimit;
        }
        if (timeLimit < 11) {
            timer.classList.add("less-time");
        }
        timer.innerHTML = timeLimit;
        if (timeLimit == 0) {
            clearInterval(interval);
            timeIsUp();
            playAgain();
        }
    },1000)
   
}
// Dừng thời gian
function stopTimer() {
    clearInterval(interval);
}
// Tạm dừng thời gian 
function pauseTimer(remainingTime) {
    parseInt(remainingTime);
    interval = setInterval(() => {  
        remainingTime--; 
        if (remainingTime < 10) {
            remainingTime = "0" + remainingTime;
        }
        if (remainingTime < 11) {
            timer.classList.add("less-time");
        }
        timer.innerHTML = remainingTime;
        if (remainingTime == 0) {
            clearInterval(interval);
            timeIsUp();
            playAgain();
        }
    },1000)

}
// Tắt chọn đáp án sau khi đã lựa chọn
function disableOptions() {
    option.forEach(ele => {
        ele.classList.add("already-answered");
    });
}
function enableOptions() {
    option.forEach(ele => {
        ele.classList.remove("already-answered");
    });
}
// Tắt các quyền trợ giúp
function disableAllLifeLines() {
    askBtn.style.pointerEvents = "none";
    CallBtn.style.pointerEvents = "none";
    fify50Btn.style.pointerEvents = "none";
}
// Hiển thị nút bấm câu hỏi tiếp theo
function showNextBtn() {  
    nextQuestionBtn.classList.add("show");
}
// Hiển thị nút bấm chơi lại
function playAgain() {
    playAgainBtn.classList.add("show");
}
// Ẩn nút bấm câu hỏi tiếp theo
function hideNextBtn() {  
    nextQuestionBtn.classList.remove("show");
}
// Cài đặt nút bấm câu hỏi tiếp theo
nextQuestionBtn.addEventListener("click", nextQuestion);
// Tạo câu hỏi tiếp theo
function nextQuestion() {
    if (questionIndexStart > 0) {
        questionIndex++;
    }
    currentAmount();
    if (questionIndex > 0) {
        removePrevious();
    }
    questionNumber.textContent = `${questionIndex + 1} / ${quiz.length}`;
    currQuestionAmount.textContent = prices.children[14 - questionIndex].childNodes[1].nodeValue;
    questionBox.classList.remove("show");
    option[0].classList.remove("show-1");
    option[1].classList.remove("show-1");
    option[2].classList.remove("show-2");
    option[3].classList.remove("show-2");
    option.forEach(ele => {
        void ele.offsetWidth;
    });
    void questionBox.offsetWidth;
    questionBox.classList.add("show");
    option[0].classList.add("show-1");
    option[1].classList.add("show-1");
    option[2].classList.add("show-2");
    option[3].classList.add("show-2");
    option.forEach(ele => {
        void ele.offsetWidth;
    });
    generateQuestion();
    StartTimer();
    removeStyles();
    hideNextBtn();
    MainThemePlay.pause();
    MainThemePlay.currentTime = 0;
    correctPlay.pause();
    correctPlay.currentTime = 0;
    wrongPlay.pause();
    wrongPlay.currentTime = 0;
    inGamePlay.currentTime = 0;
    inGamePlay.play();
}
// Xóa định dạng
function removeStyles() { 
    option.forEach(ele => {
        ele.classList.remove("correct");
        ele.classList.remove("wrong");
        ele.classList.remove("show-correct");
        ele.classList.remove("already-answered");
        ele.style.visibility = "visible";
        lifelineBox.classList.remove("show");
        auCover.classList.remove("show");
        callView.classList.remove("show");
        callAnswer.classList.remove("show");
        playAgainBtn.classList.remove("show");
    })
}
function removeOption() {
    option.forEach(ele => {
        ele.classList.remove("correct");
        ele.classList.remove("wrong");
        ele.classList.remove("show-correct");
        ele.classList.remove("already-answered");
        ele.style.visibility = "hidden";
    })
}
// Cài đặt lại chương trình
function reset() {
    if (questionIndexStart > 0) {
        questionIndex++;
    }
    if (questionIndex > 0) {
        removePrevious();
    }
    removeStyles();
    MainThemePlay.play();
    lifelineBox.classList.remove("show");
    auCover.classList.remove("show");
    callView.classList.remove("show");
    addCancel[0].classList.remove("show");
    addCancel[1].classList.remove("show");
    addCancel[2].classList.remove("show");
    fify50Btn.style.pointerEvents = "visible";
    CallBtn.style.pointerEvents = "visible";
    askBtn.style.pointerEvents = "visible";
    amountWon.classList.remove("show");
}
// Cài đặt nút bấm sẵn sàng
startBtn.addEventListener("click", () => {
    if (questionIndex > 0) {
        removePrevious();
    }
    questionIndexStart = 0;
    questionIndex = 0;
    startBox.classList.add("show");
    gameBox.classList.add("show");
    currentAmount();
    nextQuestion();
    MainThemePlay.pause();
    MainThemePlay.currentTime = 0;
    StartPlay.play();
    questionIndexStart++;   
});
// Cài đặt nút bấm chơi lại
playAgainBtn.addEventListener("click", () => {
    startBox.classList.remove("show");
    gameBox.classList.remove("show");
    reset();
})
// Tắt các quyền trợ giúp sau khi đã sử dụng
function disableFifty50() {
    addCancel[0].classList.add("show");
    fify50Btn.style.pointerEvents = "none";
}
function disableCall() {
    addCancel[1].classList.add("show");
    CallBtn.style.pointerEvents = "none";
}
function disableAudience() {
    addCancel[2].classList.add("show");
    askBtn.style.pointerEvents = "none";
}
// Cài đặt quyền trợ giúp 50:50
fify50Btn.addEventListener("click", function () {
    let currentTime = timer.innerHTML;
    timer.innerHTML = currentTime;
    stopTimer();
    fifty50Play1.currentTime = 0;
    fifty50Play1.play();
    setTimeout(() => {
        fifty50Play1.addEventListener('ended', () => {
            var rand, second, temp = 0;
            fifty50Play.play();
            while (temp < 1) {
            rand = Math.floor(Math.random() * 4);
            if (parseInt(rand) !== parseInt(quiz[questionIndex].answer)) {
                second = rand;
                temp++;
            }
            }
            option.forEach(ele => {
            if ((parseInt(ele.id) !== parseInt(quiz[questionIndex].answer) && parseInt(ele.id) !== parseInt(option[second].id))){
                ele.style.visibility = "hidden";
            }
            })
        
        }); 
        inGamePlay.play();
        pauseTimer(currentTime);
        enableOptions();
      }, 2000);
      disableFifty50();
})
// Cài đặt quyền trợ giúp hỏi ý kiến khán giả
function askTheAudience() {
    let currentTime = timer.innerHTML;
    timer.innerHTML = currentTime;
    stopTimer();
    audiencePlay1.curentTime = 0;
    audiencePlay1.play();
    disableAudience();
    setTimeout(() => {
        audiencePlay1.addEventListener('ended', () => {
            lifelineBox.classList.add("show");
            auCover.classList.add("show");
            let rand;
            disableOptions();
            let options = {
                "one": [
                    {"opt": [0, 20, 10, 70]},
                    { "opt": [6, 25, 75, 4]},
                    {"opt": [0, 10, 90, 0]}
                ],
                "two": [
                    {"opt": [48, 40, 8, 4]},
                    { "opt": [2, 52, 43, 2] },
                    { "opt": [50, 50, 0, 0]}
                ]
            };
            inGamePlay.pause();
            audiencePlay.play();
            setTimeout(function (){
            if(questionIndex < 8){
                rand = Math.floor(Math.random() * options.one.length);
                options.one[rand].opt.sort((a, b) => b - a);
                var increase = 1;
                auBox.forEach(ele =>{
                    if(parseInt(ele.id) === parseInt(quiz[questionIndex].answer)){
                        ele.firstChild.textContent = options.one[rand].opt[0] + "%";
                        ele.lastChild.style.height = options.one[rand].opt[0] + "%";
                    }
                    else if(parseInt(ele.id) !== parseInt(quiz[questionIndex].answer)){
                        ele.firstChild.textContent = options.one[rand].opt[increase] + "%";
                        ele.lastChild.style.height = options.one[rand].opt[increase] + "%";
                        increase++;
                    }
                })
                }
            else if (questionIndex > 7) {
                rand = Math.floor(Math.random() * options.two.length);
                options.two[rand].opt.sort((a, b) => b - a);
                var increase2 = 1;
                auBox.forEach(ele =>{
                    if(parseInt(ele.id) === parseInt(quiz[questionIndex].answer)){
                        ele.firstChild.textContent = options.two[rand].opt[0] + "%";
                        ele.lastChild.style.height = options.two[rand].opt[0] + "%";
                    }
                    else if(parseInt(ele.id) !== parseInt(quiz[questionIndex].answer)){
                        ele.firstChild.textContent = options.two[rand].opt[increase2] + "%";
                        ele.lastChild.style.height = options.two[rand].opt[increase2] + "%";
                        increase2++;
                    }
                })
            }
                inGamePlay.play();
                pauseTimer(currentTime);
                enableOptions();
            }, 6000);
        });
      }, 300);
    
}
askBtn.addEventListener("click", askTheAudience);
// Cài đặt quyền trợ giúp gọi điện cho người thân
function callFriend() {
    let currentTime = parseInt(timer.innerHTML);
    timer.innerHTML = currentTime;
    stopTimer();
    callPlay1.curentTime = 0;
    callPlay1.play();
    disableCall();
    setTimeout(() => {
        callPlay1.addEventListener('ended', () => {
            let rand;
            let res = quiz[questionIndex].answer;
            lifelineBox.classList.add("show");
            callView.classList.add("show");
            let ansCall = {
                "one": ["Theo tôi đáp án là", "Tôi chắc chắn 100% đáp án là"],
                "two": ["Tôi nghĩ đáp án là","Tôi không chắc lắm, đáp án là" ]
            }
            inGamePlay.pause();
            callPlay.play();
            disableOptions();
            setTimeout(function () {
                if (questionIndex < 8) {
                    rand = Math.floor(Math.random() * ansCall.one.length);
                    callAnswer.textContent = ansCall.one[rand] + " " + quiz[questionIndex].options[res];
                }
                else if (questionIndex > 7) {
                    rand = Math.floor(Math.random() * ansCall.two.length);
                    callAnswer.textContent = ansCall.two[rand] + " " + quiz[questionIndex].options[res];
                }
                callAnswer.classList.add("show");
                inGamePlay.play();
                pauseTimer(currentTime);
                enableOptions();
            }, 9000);
        });
      }, 200);
   
}
CallBtn.addEventListener("click", callFriend);
// Định dạng hiển thị giải thưởng
function currentAmount() {
    let count = 14 - questionIndex;
    let child = prices.children[count];
    if (count === 0 || count === 5 || count === 10) {
        child.style.backgroundColor = "gold";
        child.style.color = "#fff";
    }
    else {
        child.style.backgroundColor = "gold";
        child.style.color = "#000";
    }
}
// Màu các mốc giải thưởng
function removePrevious() {
    let countPrev = 14 - questionIndex + 1;
    let child = prices.children[countPrev];
    if (countPrev === 0 || countPrev === 5 || countPrev === 10) {
        child.style.backgroundColor = "#000";
        child.style.color = "#fff";
    }
    else {
        child.style.backgroundColor = "#000";
        child.style.color = "gold";
    }   
}
// Cài đặt hiển thị giải thưởng đạt được
function result() {
    auCover.classList.remove("show");
    callView.classList.remove("show");
    if (questionIndex < 4) {
         lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "Rất tiếc, cảm ơn bạn đã tham gia chương trình của chúng tôi!";
    }
    else if (questionIndex >= 4 && questionIndex < 9) {
        lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "Bạn đã chiến thắng được thưởng 2.000.000 VND";
        
    }
    else if (questionIndex >= 9 && questionIndex < 14) {
        lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "Bạn đã chiến thắng được giải thưởng 22.000.000 VND";

    }
    else if (questionIndex >= 14) {
       // removeOption();
       // questionBox.classList.remove("show");
        lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "Xin chúc mừng bạn đã chiến thắng được giải thưởng đặc biệt 250.000.000 VND";

    }
}
