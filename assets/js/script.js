const coll = document.querySelector(".collapsible");
coll.addEventListener("click", function () {
  this.classList.toggle("active");
  const content = this.nextElementSibling;
  if (content.style.display === "block") {
    content.style.display = "none";
    this.innerText = "Show Quiz Instructions";
  } else {
    content.style.display = "block";
    this.innerText = "Hide Quiz Instructions";
  }
});

const questions = [{
    question: "What is the capital of Rwanda?",
    answers: ["Kigali", "Nairobi", "Dar es Salaam", "Kampala"],
    correct: 0
  },
  {
    question: "Which language is widely spoken in Rwanda?",
    answers: ["Swahili", "Kinyarwanda", "Amharic", "Zulu"],
    correct: 1
  },
  {
    question: "When did Rwanda gain independence?",
    answers: ["1962", "1975", "1980", "1990"],
    correct: 0
  },
  {
    question: "What is Rwanda known as?",
    answers: ["Land of Lakes", "Land of a Thousand Hills", "Land of Rivers", "Land of Gold"],
    correct: 1
  },
  {
    question: "What is the currency of Rwanda?",
    answers: ["Shilling", "Rwandan Franc", "Dollar", "Pound"],
    correct: 1
  },
  {
    question: "What is Rwanda's primary economic activity?",
    answers: ["Mining", "Agriculture", "Manufacturing", "Tourism"],
    correct: 1
  },
  {
    question: "Which famous mountain gorillas can be found in Rwanda?",
    answers: ["Silverback gorillas", "Western gorillas", "Golden gorillas", "Bamboo gorillas"],
    correct: 0
  },
  {
    question: "What is the official name of Rwanda?",
    answers: ["Kingdom of Rwanda", "People's Republic of Rwanda", "Republic of Rwanda", "United States of Rwanda"],
    correct: 2
  },
  {
    question: "Which national park is famous for gorilla trekking?",
    answers: ["Volcanoes National Park", "Serengeti National Park", "Kruger National Park", "Amboseli National Park"],
    correct: 0
  },
  {
    question: "What color is NOT in the Rwandan flag?",
    answers: ["Blue", "Red", "Yellow", "Green"],
    correct: 1
  },
  {
    question: "Who is the current president of Rwanda?",
    answers: ["Paul Kagame", "Pasteur Bizimungu", "Louise Mushikiwabo", "Juvenal Habyarimana", "Grégoire Kayibanda", "Dominique Mbonyumutwa", "Théodore Sindikubwabo"],
    correct: 0
  }
];

let shuffledQuestions;
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let hintUsed = false;
let username = "";
let results = [];
let selectedChoiceRecorded = false; // Track if  choice has been recorded
let timer; // Timer variable
let selectedChoiceIndex = -1; // Variable to track the last selected choice


function shuffleQuestions() {
  return questions
    .map(question => ({
      ...question,
      sort: Math.random() // Randomly assigns a number to each question
    }))
    .sort((a, b) => a.sort - b.sort) // Sort questions based on the random number
    .map(question => {
      delete question.sort;
      return question;
    });
}

function startQuiz() {
  const nameInput = document.getElementById("username").value;
  if (nameInput.trim() === "") {
    alert("Please enter your name.");
    return;
  }
  username = nameInput;
  shuffledQuestions = shuffleQuestions(); // Shuffle questions before starting the quiz

  // Hide login screen and show quiz
  document.getElementById("login").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");

  // Load the first question
  loadQuestion();
}

let hintUsedForCurrentQuestion = false;  // Track hint usage for each question

function loadQuestion() {
  // Reset previous states for each new question
  hintUsedForCurrentQuestion = false; // Reset hint for the current question

  // Reset answer selection and feedback
  document.querySelectorAll("input[name='answer']").forEach(radio => {
    radio.disabled = false; // Enable radio buttons
    radio.checked = false; // Reset checked state
  });

  // Reset feedback and timer for each new question
  document.getElementById("feed").innerText = "";
  document.getElementById("timer").innerText = "15"; // Reset timer display
  selectedChoiceRecorded = false; // Reset choice tracking for the new questio

  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const questionNumberElement = document.getElementById("question-number");
  const progressElement = document.getElementById("progress");

  questionNumberElement.innerText = currentQuestionIndex + 1;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  answersElement.innerHTML = "";



  // Create radio buttons for answers
  currentQuestion.answers.forEach((answer, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;

    // Listen for change events to track the last selection
    input.onchange = function () {
      selectedChoiceIndex = index; // Track the last selected answer
      enableNextButton(); // Enable the "Next" button when an answer is selected
    };

    label.appendChild(input);
    label.appendChild(document.createTextNode(answer));
    answersElement.appendChild(label);
    answersElement.appendChild(document.createElement("br"));
  });

  progressElement.style.width = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100 + "%";

  startTimer(); // Start the timer for this question

  // Reset "Next" button state
  document.getElementById("next").classList.add("hidden"); // Hide "Next" button initially
  document.getElementById("next").disabled = true; // Disable "Next" button initially

   // Enable the hint button for each question
   document.getElementById("hint").disabled = false; // Re-enable hint button
   document.getElementById("hint").classList.remove("hidden"); // Show hint button

  selectedChoiceRecorded = false; // Reset choice tracking
  //hintUsed = false; //to rest hint for every question
  // document.getElementById("timer").innerText = "15"; // Reset timer display
  // document.getElementById("hint").disabled = hintUsed;
    
}


// Function to enable the "Next" button once an answer is selected
function enableNextButton() {
  const isAnswerSelected = selectedChoiceIndex !== -1;
  if (isAnswerSelected) { // If an answer is selected
    document.getElementById("next").disabled = false; // Enable "Next"
    document.getElementById("next").classList.remove("hidden"); // Show "Next" button
  }
}

function startTimer() {
  let timeLeft = 15; // Set timer for 15 seconds
  document.getElementById("timer").innerText = timeLeft; // Display initial time

  // Clear any existing timer before starting a new one
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft; // Update timer display

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Moving to the next question.");
      nextQuestion(); // Automatically go to next question when time's up
    }
  }, 1000); // Update every second
}


function selectAnswer(index) {
  if (selectedChoiceRecorded) return;

  // Ensure only the last selected answer is recorded
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isCorrect = index === currentQuestion.correct;

  results.push({
    question: currentQuestion.question,
    selectedChoice: currentQuestion.answers[index],
    correctAnswer: currentQuestion.answers[currentQuestion.correct],
    isCorrect
  });

  if (isCorrect) {
    score++;
  }

  showFeedback(isCorrect);
  selectedChoiceRecorded = true; // Mark the choice as recorded
  clearInterval(timer); // Stop the timer when an answer is selected

  // Disable radio buttons after selection
  document.querySelectorAll("input[name='answer']").forEach(radio => {
    radio.disabled = true;
  });

  enableNextButton(); // Ensure "Next" button is enabled after answering

}


function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    loadQuestion();
    document.getElementById("next").classList.add("hidden"); // Hide Next button initially
  } else {
    showResults(); // This should be called at the end of the quiz
  }
  // Reset selection state
  selectedChoiceIndex = -1;
  selectedChoiceRecorded = false;
  
}


function checkAnswer() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const selectedRadio = document.querySelector("input[name='answer']:checked");


  if (!selectedRadio) {
    alert("Please select an answer before checking.");
    return;
  }

  // Record the selected answer only if the user clicks "Check Answer"
  const selectedIndex = parseInt(selectedRadio.value);
  const isCorrect = selectedIndex === currentQuestion.correct;

  showFeedback(isCorrect);

  // Lock the questions 
  document.querySelectorAll("input[name='answer']").forEach(radio => {
    radio.disabled = true;
  });

  // Prompt the user to click the next question button 
  document.getElementById("next").classList.remove("hidden");
  document.getElementById("feed").innerText += " Please click the 'Next Question' button to continue.";
}


function showFeedback(isCorrect) {
  const feedbackElement = document.getElementById("feed");
  if (isCorrect) {
    feedbackElement.innerText = `Correct! Great job, ${username}!`;
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.innerText = "Incorrect. Try again to see the right question or move to the next question!";
    feedbackElement.style.color = "red";
  }
}


// function useHint() {
//   if (!hintUsed) {
//     hintUsed = true;
//     alert(`Hint: The correct answer starts with "${shuffledQuestions[currentQuestionIndex].answers[shuffledQuestions[currentQuestionIndex].correct][0]}"`);
//     document.getElementById("hint").disabled = true; // Disable hint button after use
//   }
// }


// Function to use the hint
function useHint() {
  if (!hintUsedForCurrentQuestion) {
    hintUsedForCurrentQuestion = true; // Mark hint as used for the current question
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const hint = currentQuestion.answers[currentQuestion.correct][0];  // Hint based on the first letter of the correct answer
    alert(`Hint: The correct answer starts with "${hint}"`);

    document.getElementById("hint").disabled = true; // Disable the hint button after it's used
  }
}


function showResults() {

  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("hint").classList.add("hidden");
  document.getElementById("timer").classList.add("hidden");
  document.getElementById("timer").disabled = true;


  // Display score
  document.getElementById("score").innerText = `${username}, all ${shuffledQuestions.length} questions answered!`;

  // Calculate the percentage score
  const percentage = (score / shuffledQuestions.length) * 100;

  let feedback = "";
  if (percentage >= 80) {
    feedback = "Excellent! You did an amazing job!";
  } else if (percentage >= 50) {
    feedback = "Good Job! Keep practicing to improve.";
  } else {
    feedback = "Needs Improvement. Try again!";
  }


  // Display the feedback based on score
  document.getElementById("feedback").innerText = feedback;

  // Populate comparison between answers and correct answers
  const resultsElement = document.getElementById("comparison");
  resultsElement.innerHTML = "";

  results.forEach((result, index) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");

    // Create a string with the question, user's answer, and the correct answer
    resultItem.innerHTML = `
      <p><strong>Question ${index + 1}:</strong> ${result.question}</p>
      <p>Your Answer: 
        <span style="color: ${result.isCorrect ? 'green' : 'red'}">${result.selectedChoice}</span>
      </p>
      <p>Correct Answer: <span style="color: green">${result.correctAnswer}</span></p>
    `;
    resultsElement.appendChild(resultItem);
  });

}


function restartQuiz() {
  //location.reload();
  currentQuestionIndex = 0;
  score = 0;
  streak = 0;
  hintUsed = false;
  results = [];
  shuffledQuestions = shuffleQuestions(); //Reload questions
  document.getElementById("result").classList.add("hidden");
  document.getElementById("feed").innerText = "";
  document.getElementById("login").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  loadQuestion();

}