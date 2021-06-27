document.addEventListener("DOMContentLoaded", () => {
  const login = $(".section-login"),
    categories = $(".section-categories"),
    questions = $(".section-questions"),
    result = $(".section-result"),
    category = $("#category"),
    question = $("#question"),
    answers = document.getElementById("answers"),
    gameJson = "src/game.json";

  // Randomize the arr
  let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  arr = arr.sort(() => {
    return Math.random() - 0.5;
  });

  categories.hide();
  questions.hide();
  result.hide();

  const userForm = $("#user-form");

  userForm.on("change", () => {
    user = $("#username").val();
  });
  userForm.on("submit", showCategories);

  function showCategories(e) {
    e.preventDefault();
    login.fadeOut();
    categories.fadeIn();
    $("#game-category").on("click", loadGameQuestions);
    $("#geography-category").on("click", loadGeographyQuestions);
    $("#mathematics-category").on("click", loadMathematicsQuestions);
    $("#history-category").on("click", loadHistoryQuestions);
  }

  function loadGameQuestions() {}
  function loadGeographyQuestions() {
    let questionNumber;
    if (arr.length > 0) {
      questionNumber = arr.shift();
    } else {
      totalScore.innerText = score;
    }
    fetch(gameJson)
      .then((res) => res.json())
      .then((data) =>
        loadQuestion(
          data.geography[questionNumber],
          data.geographyAnswers[questionNumber]
        )
      );
    categories.fadeOut();
    questions.fadeIn();
  }

  function loadQuestion(questionData, answersData) {
    category.text("Geografía");
    question.text(questionData);

    for (let r in answersData) {
      let letter = ["A", "B", "C", "D"];
      answers.innerHTML += `<button
            class="
              border
              mt-6
              buttons-width
              border-indigo-300
              rounded-xl
              text-left text-lg
              p-3.5
              text-indigo-400
              hover:bg-yellow-400
              hover:text-white
              hover:border-yellow-400
            "
            id="${r}"
          >
            <span class="pl-3 text-2xl">${letter[r]}</span>
            <span class="pl-12">${answersData[r]}</span>
          </button>`;
    }
  }

  function loadMathematicsQuestions() {}
  function loadHistoryQuestions() {}

  answers.addEventListener("click", (e) => {
    let id = "";
    if (e.target.nodeName === "SPAN") {
      id = e.target.parentNode.getAttribute("id");
      verify(id, question.innerText);
    }
    if (e.target.nodeName === "BUTTON") {
      id = e.target.getAttribute("id");
      verify(id, question.innerText);
    }
  });
});
