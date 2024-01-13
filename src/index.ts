interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface PlayerScore {
  name: string;
  isRight: boolean;
}

const callPage = (pageName: string): Promise<string> => {
  return fetch(`pages/${pageName}.html`).then((resp) => resp.text());
};

const startApp = (pageName: string) => {
  callPage(pageName).then((html) => {
    const rootElem = document.getElementById("root") as HTMLElement;
    rootElem.innerHTML = html;

    const form = document.getElementById("form-start") as HTMLFormElement;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputElem = document.getElementById(
        "input-name"
      ) as HTMLInputElement;

      const inputValue = inputElem.value;

      localStorage.setItem("name", inputValue);

      document.getElementsByTagName("body")[0].style.backgroundColor =
        "#eff0f3";
      callPage("quiz").then(async (html) => {
        rootElem.innerHTML = html;

        const questions: { questions: Question[] } = await fetch(
          "questions.json"
        ).then((resp) => resp.json());
        const firstQuestion = questions.questions[0];
        const rightIndex = firstQuestion.correct;

        const questionContainerElem = document.querySelector(
          ".container > .question-container"
        ) as HTMLElement;
        questionContainerElem.innerHTML = firstQuestion.question;

        const buttonList = document.getElementsByClassName(
          "btn-answer"
        ) as HTMLCollectionOf<HTMLButtonElement>;

        let selectedIndex: number = -1;

        for (let i = 0; i < 4; i++) {
          buttonList[i].innerHTML = firstQuestion.options[i];
          buttonList[i].setAttribute("index", i.toString());

          buttonList[i].addEventListener("click", () => {
            // Lógica para selecionar/deselecionar o botão
            buttonList[i].classList.add("btn-selected");
            selectedIndex = i;

            for (let i = 0; i < 4; i++) {
              if (i !== selectedIndex) {
                const btn = document.getElementsByClassName("btn-answer")[i];
                btn.classList.remove("btn-selected");
              }
            }
          });
        }

        const btnNextElem = document.getElementById(
          "next-btn"
        ) as HTMLButtonElement;

        btnNextElem.addEventListener("click", () => {
          if (selectedIndex === -1) {
            alert("Selecione uma opção!");
            return;
          }

          const isRight = selectedIndex === rightIndex;
          const alertMsg = isRight ? "Acertou!" : "Errou!";
          alert(alertMsg);
          const playerName = localStorage.getItem("name");
          const playerScore = {
            name: playerName,
            isRight: selectedIndex === rightIndex,
          };

          const resultsListLocalStorage = localStorage.getItem("results");
          const resultsListParsed = resultsListLocalStorage
            ? JSON.parse(resultsListLocalStorage)
            : [];

          // resultsListParsed.push(playerScore); -> Mesma coisa que a linha abaixo
          const resultsList = [...resultsListParsed, playerScore];
          localStorage.setItem("results", JSON.stringify(resultsList));

          callPage("leaderboard").then((html) => {
            rootElem.innerHTML = html;
            document.getElementsByTagName("body")[0].style.backgroundColor =
              "#004643";

            const firstPodium = document.getElementById(
              "first-podium-name"
            ) as HTMLElement;
            const secondPodium = document.getElementById(
              "second-podium-name"
            ) as HTMLElement;
            const thirdPodium = document.getElementById(
              "third-podium-name"
            ) as HTMLElement;

            const leaderboardListLocalStorage = localStorage.getItem(
              "results"
            ) as string;
            const leaderboardListParsed: PlayerScore[] = JSON.parse(
              leaderboardListLocalStorage
            );

            const sortedLeaderboardList = leaderboardListParsed.sort(
              (a, b) => Number(b.isRight) - Number(a.isRight)
            );

            firstPodium.innerHTML = sortedLeaderboardList[0].name;
            secondPodium.innerHTML = sortedLeaderboardList[1].name;
            thirdPodium.innerHTML = sortedLeaderboardList[2].name;

            const remainingPodiumsDiv = document.getElementById(
              "remaining-list"
            ) as HTMLElement;
            sortedLeaderboardList.slice(3).forEach((score) => {
              const liElem = document.createElement("li");
              liElem.classList.add("remaining-item");
              liElem.innerHTML = score.name;
              remainingPodiumsDiv.appendChild(liElem);
            });

            const btnRestart = document.getElementById(
              "new-game-button"
            ) as HTMLButtonElement;
            console.log(btnRestart);
            btnRestart.addEventListener("click", () => {
              localStorage.removeItem("name");
              startApp("start");
            });
          });
        });
      });
    });
  });
};

startApp("start");
