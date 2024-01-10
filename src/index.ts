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
          const novoJogo = document.querySelector(".btn-gold");

// Adicionando um ouvinte de evento ao botão "Novo Jogo"
if (novoJogo) {
  novoJogo.addEventListener("click", () => {
    // Ao clicar no botão "Novo Jogo", retorna à página "start"
    renderPages("start");
  });
}
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


function criarMensagem(texto: string): HTMLDivElement {
  const mensagem = document.createElement("div");

  mensagem.textContent = texto;
  mensagem.classList.add("alert-message");

  return mensagem;
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


function verificarResposta(selectedIndex: number, correctIndex: number): void {
 
  if (selectedIndex === correctIndex) {
    alert("Resposta correta!");
   
  } else {
    alert("Resposta incorreta");
    
  }

  renderPages("leaderboard");
}

let selectedOptionIndex: number | null = null;


function checkAnswer(index: number): void {
  if (selectedOptionIndex !== null) {
    const prevSelectedOption = document.querySelector(
      `.btn-answer[data-index="${selectedOptionIndex}"]`
    ) as HTMLElement | null;

    if (prevSelectedOption) {
      prevSelectedOption.style.backgroundColor = ""; 
    }
  }
   
const selectedOption = document.querySelector(
  `.btn-answer[data-index="${index}"]`
) as HTMLElement | null;

if (selectedOption) {
  selectedOption.style.backgroundColor = "black";
}
  selectedOptionIndex = index;


  
}


