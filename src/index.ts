const renderPages = (pageName: string): void => {
  fetch(`pages/${pageName}.html`)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Erro ao carregar a página");
      }
      return resp.text();
    })
    .then((html) => {
      const rootElem = document.getElementById("root") as HTMLElement;

      if (rootElem) {
        rootElem.innerHTML = html;

        const formStart = document.getElementById(
          "form-start"
        ) as HTMLFormElement;

        if (formStart) {
          formStart.addEventListener("submit", (event) => {
            event.preventDefault();
            armazenarNome();
          });
        }

        if (pageName === "quiz") {
          carregarPergunta();
          console.log("A página quiz está pronta para ser usada!");
        } else if (pageName === "leaderboard") {
          console.log("A página leaderboard está pronta para ser usada!");
          const leaderboardContainer = document.querySelector(".container-podium");

  if (leaderboardContainer) {
    // Limpar o conteúdo atual
    leaderboardContainer.innerHTML = "";

    // Obter o nome do usuário do histórico local
    const nomeUsuario = localStorage.getItem("usuario");

    // Verificar se há um nome de usuário
    if (nomeUsuario) {
      // Criar um elemento para o usuário no primeiro lugar
      const firstPlaceItem = document.createElement("div");
      firstPlaceItem.className = "podium-item";
      firstPlaceItem.innerHTML = `
        <div class="podium-rounded first-podium">${nomeUsuario.charAt(0).toUpperCase()}</div>
        <div>${nomeUsuario}</div>
        <div>1/1</div>
      `;

      // Adicionar o elemento ao container-podium
      leaderboardContainer.appendChild(firstPlaceItem);
    } else {
      console.error("Nome de usuário não encontrado no histórico local.");
    }
  } else {
    console.error('Elemento com classe "container-podium" não encontrado.');
  }
}
const novoJogo = document.querySelector(".btn-gold");
        
          // Adicionando um ouvinte de evento ao botão "Novo Jogo"
          if (novoJogo) {
            novoJogo.addEventListener("click", () => {
              // Ao clicar no botão "Novo Jogo", retorna à página "start"
              renderPages("start");
            });
          
   
        }
      } else {
        console.error('Elemento com ID "root" não encontrado.');
      }
    })
    .catch((error) => {
      console.error("Erro durante a requisição fetch:", error);
    });
};

// Função para exibir mensagens
renderPages("start");

 
function armazenarNome(): void {
  const nomeUsuarioInput = document.getElementById("input-name") as HTMLInputElement | null;

  if (nomeUsuarioInput && nomeUsuarioInput.value.trim() !== "") {
    const nomeUsuario = nomeUsuarioInput.value;
    localStorage.setItem("usuario", nomeUsuario);
    console.log("Nome armazenado com sucesso!");
    renderPages("quiz");
  } else {
    alert("Por favor, digite seu nome antes de começar.");
    }
  }


function carregarPergunta(): void {
  fetch("questions.json")
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Erro na requisição fetch.");
      }
      return resp.json();
    })
    .then((data) => {
      console.log("Dados do JSON recebidos:", data);
      atualizarHTML(data.questions[0]);
    })
    .catch((error) => {
      console.error("Erro durante a requisição fetch:", error);
    });
}
function verificarResposta(selectedIndex: number, correctIndex: number): void {
  const pontosPorRespostaCorreta = 1; // Defina a quantidade de pontos por resposta correta

  if (selectedIndex === correctIndex) {
    alert("Resposta correta!");

    // Adiciona pontos ao usuário
    adicionarPontos(pontosPorRespostaCorreta);
  } else {
    alert("Resposta incorreta");
  }

  renderPages("leaderboard");
}

function adicionarPontos(pontos: number): void {
  // Obtém a pontuação atual do usuário do localStorage ou inicializa com 0 se não existir
  const pontuacaoAtual = parseInt(localStorage.getItem("pontuacao") || "0", 10);

  // Adiciona os pontos
  const novaPontuacao = pontuacaoAtual + pontos;

  // Armazena a nova pontuação no localStorage
  localStorage.setItem("pontuacao", novaPontuacao.toString());
}

let selectedOptionIndex: number | null = null;

interface Question {
  question: string;
  options: string[];
  correct: number;
}
function atualizarHTML(pergunta: Question): void {
  const questionNumberElement = document.querySelector(".question-number");
  const questionContainerElement = document.querySelector(".question-container");
  const btnListElement = document.querySelector(".btn-list");
  const nextBtnElement = document.getElementById("next-btn");

  if (questionNumberElement && questionContainerElement && btnListElement && nextBtnElement) {
    questionNumberElement.textContent = "1/10";
    questionContainerElement.textContent = pergunta.question;
    btnListElement.innerHTML = "";

    pergunta.options.forEach((option: string, index: number) => {
      const button = document.createElement("button");
      button.className = "btn-answer";
      button.textContent = option;
      btnListElement.appendChild(button);

      button.addEventListener("click", () => {
        checkAnswer(index);

        // Remove a cor verde de todos os botões
        btnListElement.querySelectorAll(".btn-answer").forEach((btn) => {
          const buttonElement = btn as HTMLElement;
          buttonElement.style.backgroundColor = "";
        });
        button.style.backgroundColor = "#B4B7FA";
        
      });  
    });

    nextBtnElement.classList.remove("hide");
    nextBtnElement.addEventListener("click", () => {
      if (selectedOptionIndex !== null) {
        const perguntaAtual = pergunta;
        verificarResposta(selectedOptionIndex, perguntaAtual.correct);
      } else {
        alert("Por favor, selecione uma opção antes de responder.");
      }
    });
  }
}
function checkAnswer(index: number): void {
  if (selectedOptionIndex !== null) {
    const prevSelectedOption = document.querySelector(
      `.btn-answer[data-index="${selectedOptionIndex}"]`
    ) as HTMLElement | null;

    if (prevSelectedOption) {
      prevSelectedOption.style.backgroundColor = ""; 
    }
  }
   selectedOptionIndex = index;
}



