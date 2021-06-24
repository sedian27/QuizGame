document.addEventListener("DOMContentLoaded", () => {
  const question = document.getElementById("question");
  const answers = document.getElementById("answers");
  const totalScore = document.getElementById("score");
  const json = "src/questions.json";
  let score = 0;
  let i = 0;

  // Randomize the arr
  let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  arr = arr.sort(() => {
    return Math.random() - 0.5;
  });

  showQuestion();

  function showQuestion() {
    if (arr.length > 0) {
      let questionNumber = arr.shift();
      searchQuestion(questionNumber);
      console.log(questionNumber, i++);
    } else {
      totalScore.innerText = score;
    }
  }

  function searchQuestion(questionNumber) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", json);
    xhr.send();
    xhr.onload = () => {
      const banco = JSON.parse(xhr.responseText);
      let pregunta = banco["preguntas"][questionNumber];
      let respuestas = banco["respuestas"][pregunta];

      question.innerText = pregunta;
      answers.innerText = "";

      for (let r in respuestas) {
        let letras = ["A", "B", "C", "D"];
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
            <span class="pl-3 text-2xl">${letras[r]}</span>
            <span class="pl-12">${respuestas[r]}</span>
          </button>`;
      }
    };
  }

  // Verification if the answer is correct
  function verify(id, question) {
    const answer = document.getElementById(id);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", json);
    xhr.send();
    xhr.onload = () => {
      let json = JSON.parse(xhr.responseText);
      if (json["respuestas"][question][id] === json["correcto"][question]) {
        answer.classList.remove("text-indigo-400");
        answer.classList.remove("border-indigo-300");
        answer.classList.remove("hover:bg-yellow-400");
        answer.classList.remove("hover:text-white");
        answer.classList.remove("hover:border-yellow-400");
        answer.className += " bg-green-300 text-white";
        setTimeout(() => {
          score++;
          showQuestion();
        }, 500);
      } else {
        answer.classList.remove("text-indigo-400");
        answer.classList.remove("border-indigo-300");
        answer.classList.remove("hover:bg-yellow-400");
        answer.classList.remove("hover:text-white");
        answer.classList.remove("hover:border-yellow-400");
        answer.className += " bg-red-600 text-white";
        setTimeout(() => {
          showQuestion();
        }, 500);
      }
    };
  }

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
