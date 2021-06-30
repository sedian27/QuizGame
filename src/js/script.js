document.addEventListener("DOMContentLoaded", () => {
  // global variables
  let user = "",
    categoryName = "",
    score = 0,
    arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  async function getData() {
    const data = await fetch("src/game.json");
    return data.json();
  }

  // main and sections html
  const main = $("#main"),
    sectionLogin = `
  <section
        class="section-login bg-white mx-5 rounded-3xl justify-center px-5"
      >
        <div class="text-center">
          <h1 class="text-3xl py-8 font-bold text-yellow-500">
            Quiz <span class="text-blue-600">Game</span>
          </h1>
          <p class="py-6">Pleases insert your username</p>
          <form action="#" id="user-form" class="flex flex-col">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              maxlength="10"
              required
              class="bg-gray-200 rounded-2xl pl-4 m-1 p-2 font-bold"
            />
            <input
              type="submit"
              value="Start"
              class="
                my-12
                mx-16
                py-2
                rounded-3xl
                bg-blue-500
                text-white
                hover:bg-yellow-500
                cursor-pointer
              "
            />
          </form>
        </div>
      </section>
  `,
    sectionCategory = `
    <section
        class="section-categories bg-white mx-5 rounded-3xl justify-center px-5"
      >
        <h2 class="text-center mb-2">Select category</h2>
        <div class="text-center grid grid-cols-2" id="buttons">
          <button
            class="bg-yellow-500 py-8 m-2 rounded-xl hover:bg-red-400"
            id="games"
          >
            Games
          </button>
          <button
            class="bg-yellow-800 py-8 m-2 rounded-xl hover:bg-red-400"
            id="geography"
          >
            Geography
          </button>
          <button
            class="bg-blue-500 py-8 m-2 rounded-xl hover:bg-red-400"
            id="mathematics"
          >
            Mathematics
          </button>
          <button
            class="bg-indigo-700 py-8 m-2 rounded-xl hover:bg-red-400"
            id="history"
          >
            History
          </button>
        </div>
      </section>
      `,
    sectionQuestion = `
      <section class="section-questions">
        <div class="m-2">
          <h1
            class="uppercase text-2xl text-white font-bold md:text-4xl"
            id="category"
          ></h1>
          <div class="bg-white rounded-2xl text-lg md:text-2xl p-3 pt-16 w-29 h-35">
            <h2 id="question" class="text-blue-900 font-bold"></h2>
            <div id="answers" class="flex flex-col"></div>
          </div>
        </div>
      </section>
      `,
    sectionResult = `
      <section class="section-result flex justify-center items-stretch">
        <div
          class="
            bg-white
            rounded-2xl
            text-lg
            md:text-2xl
            text-blue-900
            flex flex-col
            text-center
            w-29 
            h-35
          "
        >
          <img src="src/img/undraw_winners_ao2o 2.svg" alt="win" class="p-8" />
          <h2 class="font-bold text-5xl">Results</h2>
          <p class="text-base p-8" id="end-message">
            
          </p>
          <a
            href="./"
            class="
              border-2 border-blue-800
              rounded-2xl
              text-lg
              m-8
              py-3
              hover:bg-yellow-500 hover:text-white hover:border-yellow-500
            "
          >
            Try again
          </a>
        </div>
        <div class="bg-white rounded-2xl mx-5 w-29 h-35 text-center">
          <h2 class="text-yellow-500 text-4xl p-4 font-bold">Leaderboard</h2>
          <table class="w-full">
            <thead>
              <tr>
                <th class="w-1/2 text-3xl text-black">Users</th>
                <th class="w-1/2 text-3xl text-black">Score</th>
              </tr>
            </thead>
            <tbody class="text-2xl text-blue-500" id="leaderboard">
            </tbody>
          </table>
        </div>
      </section>
      `;

  main.html(sectionLogin);

  // Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBvZoDdmEnze79430mvrhrSOAz1Yi0RXuE",
    authDomain: "quiz-game-2e376.firebaseapp.com",
    projectId: "quiz-game-2e376",
    storageBucket: "quiz-game-2e376.appspot.com",
    messagingSenderId: "831277040023",
    appId: "1:831277040023:web:7d11d8998fc43159b404d2",
  };

  firebase.initializeApp(firebaseConfig);
  let db = firebase.firestore();

  // Randomize questions
  arr = arr.sort(() => {
    return Math.random() - 0.5;
  });

  // Save username and show section category
  const userForm = $("#user-form");
  userForm.on("change", () => {
    user = $("#username").val();
  });

  userForm.on("submit", (e) => {
    e.preventDefault();
    showSection(sectionCategory);
    setTimeout(() => {
      // Buttons of the section-category
      const buttons = $("#buttons");
      // Send button clicked.
      buttons.on("click", (e) => {
        getButtonClicked(e);
      });
    }, 500);
  });

  function showSection(section) {
    main.fadeOut();
    setTimeout(() => {
      main.html(section).fadeIn();
    }, 500);
  }

  // Get the category and load the questions.
  function getButtonClicked(e) {
    if (e.target.nodeName === "BUTTON") {
      showSection(sectionQuestion);
      setTimeout(() => {
        categoryName = e.target.getAttribute("id");
        $("#category").text(categoryName);
        loadQuiz();
      }, 500);
    }
  }

  // select and remove random questions one by one
  function loadQuiz() {
    if (arr.length > 0) {
      quiz(categoryName, arr.shift());
    } else {
      toFirebase();
      showSection(sectionResult);
      readFirebase();
    }
    console.clear();
  }

  // Load the Questions and answers.
  function quiz(category, quizNumber) {
    getData().then((data) => {
      const question = data.categories[category][quizNumber];
      $("#question").text(question);
      const answers = data.answers[category][quizNumber];
      let answersHtml = "";

      for (let index in answers) {
        let letters = ["A", "B", "C", "D"];
        answersHtml += `<button
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
            id="${answers[index]}"
          >
            <span class="pl-3 text-2xl">${letters[index]}</span>
            <span class="pl-12">${answers[index]}</span>
          </button>`;
      }

      // remove all event listeners
      $("#answers").unbind("click");
      // Inject the answers
      $("#answers").html(answersHtml);
      // Make a event listeners
      $("#answers").on("click", (e) => {
        let selected = "";
        if (e.target.nodeName === "SPAN") {
          selected = e.target.parentNode.getAttribute("id");
          // Send data to verify
          verify(selected, data.correctAnswers[category][quizNumber]);
        } else if (e.target.nodeName === "BUTTON") {
          selected = e.target.getAttribute("id");
          // Send data to verify
          verify(selected, data.correctAnswers[category][quizNumber]);
        }
      });
    });
  }
  // Function to verify the answers if correct score++ else nothing
  function verify(selected, correct) {
    const answer = document.getElementById(selected);
    if (selected === correct) {
      answer.classList.remove("text-indigo-400");
      answer.classList.remove("border-indigo-300");
      answer.classList.remove("hover:bg-yellow-400");
      answer.classList.remove("hover:text-white");
      answer.classList.remove("hover:border-yellow-400");
      answer.className += " bg-green-300 text-white";
      setTimeout(() => {
        score++;
        loadQuiz();
      }, 500);
    } else {
      answer.classList.remove("text-indigo-400");
      answer.classList.remove("border-indigo-300");
      answer.classList.remove("hover:bg-yellow-400");
      answer.classList.remove("hover:text-white");
      answer.classList.remove("hover:border-yellow-400");
      answer.className += " bg-red-600 text-white";
      setTimeout(() => {
        loadQuiz();
      }, 500);
    }
  }

  // Send to Firebase
  function toFirebase() {
    db.collection(categoryName).doc().set({
      user,
      score,
    });
  }

  // Get data of the Firebase
  async function readFirebase() {
    let html = "";
    const querySnapshot = await db
      .collection(categoryName)
      .orderBy("score", "desc")
      .limit(10)
      .get();
    querySnapshot.forEach((doc) => {
      html += `
      <tr>
        <td class="py-1">${doc.data().user}</td>
        <td class="text-red-500">${doc.data().score}</td>
      </tr>
      `;
    });
    $("#leaderboard").html(html);
    $("#end-message").html(`
    ${user} You got <span class="text-green-400 text-4xl">${score}</span>
            correct answers`);
  }
});
