const renderPages = (pageName: string): void => {
  // Realiza uma requisição fetch para carregar o conteúdo da página HTML
  fetch(`pages/${pageName}.html`)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Erro ao carregar a página");
      }
      return resp.text();
    })
    .then((html) => {
      // Obtém o elemento raiz onde a página será exibida
      const rootElem = document.getElementById("root") as HTMLElement;
      if (rootElem) {
        // Substitui o conteúdo do elemento raiz pelo HTML carregado
        rootElem.innerHTML = html;

        // Obtém o formulário de início (se existir)
        const formStart = document.getElementById(
          "form-start"
        ) as HTMLFormElement;

        // Adiciona um ouvinte de evento para o formulário de início
        if (formStart) {
          formStart.addEventListener("submit", (event) => {
            event.preventDefault();
            // Chama a função armazenarNome ao enviar o formulário
            armazenarNome();
          });
        }
        if (pageName === "quiz") {
          carregarPergunta();
          console.log("A página quiz está pronta para ser usada!");
        } else if (pageName === "leaderboard") {
          console.log("A página leaderboard está pronta para ser usada!");
          const leaderboardContainer =
            document.querySelector(".container-podium");
          if (leaderboardContainer) {
            leaderboardContainer.innerHTML = "";
            const nomeUsuario = localStorage.getItem("usuario");

            if (nomeUsuario) {
              // Cria um elemento para o usuário no primeiro lugar do pódio
              const firstPlaceItem = document.createElement("div");
              firstPlaceItem.className = "podium-item";
              firstPlaceItem.innerHTML = `
                <div class="podium-rounded first-podium">${nomeUsuario
                  .charAt(0)
                  .toUpperCase()}${nomeUsuario.charAt(1).toUpperCase()}
                </div>
                <div>${nomeUsuario}</div>
                <div>1/1</div>
              `;

              // Adiciona o elemento ao contêiner do pódio
              leaderboardContainer.appendChild(firstPlaceItem);
            } else {
              console.error(
                "Nome de usuário não encontrado no histórico local."
              );
            }

            // Limpa a div "remaining-list"
            const remainingList = document.querySelector(".remaining-list");
            if (remainingList) {
              remainingList.innerHTML = "";
            } else {
              console.error(
                'Elemento com classe "remaining-list" não encontrado.'
              );
            }
          } else {
            console.error(
              'Elemento com classe "container-podium" não encontrado.'
            );
          }

          // Obtém o botão "Novo Jogo"
          const novoJogo = document.querySelector(".btn-gold");

          // Adiciona um ouvinte de evento ao botão "Novo Jogo"
          if (novoJogo) {
            novoJogo.addEventListener("click", () => {
              // Ao clicar no botão "Novo Jogo", retorna à página "start"
              renderPages("start");
            });
          }
        }
      }
    })
    .catch((error) => {
      // Trata erros durante a requisição fetch
      console.error("Erro durante a requisição fetch:", error);
    });
};
renderPages("start");

// Função para armazenar o nome do usuário no localStorage
function armazenarNome(): void {
  // Obtém o elemento de input para o nome do usuário
  const nomeUsuarioInput = document.getElementById(
    "input-name"
  ) as HTMLInputElement | null;

  // Verifica se o elemento de input existe e se o valor não está vazio após remover espaços em branco
  if (nomeUsuarioInput && nomeUsuarioInput.value.trim() !== "") {
    // Obtém o valor do nome do usuário
    const nomeUsuario = nomeUsuarioInput.value;

    // Armazena o nome do usuário no localStorage
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
      // Verifica se a resposta da requisição foi bem-sucedida
      if (!resp.ok) {
        throw new Error("Erro na requisição fetch.");
      }
      // Converte o conteúdo da resposta para formato JSON
      return resp.json();
    })
    .then((data) => {
      // Exibe no console os dados recebidos do JSON
      console.log("Dados do JSON recebidos:", data);

      // Atualiza o HTML com a primeira pergunta do conjunto de perguntas
      atualizarHTML(data.questions[0]);
    })
    .catch((error) => {
      // Trata erros durante a requisição fetch
      console.error("Erro durante a requisição fetch:", error);
    });
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

// Declaração do tipo Question
interface Question {
  question: string;
  options: string[];
  correct: number;
}

// Função para atualizar o conteúdo HTML.
function atualizarHTML(pergunta: Question): void {
  // Obtém elementos HTML relevantes
  const questionNumberElement = document.querySelector(".question-number");
  const questionContainerElement = document.querySelector(
    ".question-container"
  );
  const btnListElement = document.querySelector(".btn-list");
  const nextBtnElement = document.getElementById("next-btn");

  // Verifica se os elementos existem
  if (
    questionNumberElement &&
    questionContainerElement &&
    btnListElement &&
    nextBtnElement
  ) {
    // Define o número da pergunta atual
    questionNumberElement.textContent = "1/1";

    // Define o texto da pergunta
    questionContainerElement.textContent = pergunta.question;

    // Limpa a lista de botões de resposta
    btnListElement.innerHTML = "";

    // Adiciona botões de resposta com event listeners
    pergunta.options.forEach((option: string, index: number) => {
      const button = document.createElement("button");
      button.className = "btn-answer";
      button.textContent = option;
      btnListElement.appendChild(button);

      // Adiciona um event listener para verificar a resposta ao clicar em um botão
      button.addEventListener("click", () => {
        // Chama a função verificaR para atualizar a opção selecionada
        verificaR(index);

        // Remove a cor de todos os botões antes de destacar o botão selecionado
        btnListElement.querySelectorAll(".btn-answer").forEach((btn) => {
          const buttonElement = btn as HTMLElement;
          buttonElement.style.backgroundColor = "#D8DDEA";
        });

        // Destaca o botão selecionado com a cor desejada.
        button.style.backgroundColor = "#8D818C";
      });
    });

    // Torna o botão visível
    nextBtnElement.classList.remove("hide");

    // Adiciona um event listener ao botão para verificar a resposta ao clicar
    nextBtnElement.addEventListener("click", () => {
      // Verifica se uma opção foi selecionada antes de avançar
      if (selectedOptionIndex !== null) {
        const perguntaAtual = pergunta;

        // Chama a função verificarResposta para validar a resposta
        verificarResposta(selectedOptionIndex, perguntaAtual.correct);
      } else {
        // Exibe um alerta se nenhuma opção foi selecionada
        alert("Por favor, selecione uma opção antes de responder.");
      }
    });
  }
}

// Função para verificar a resposta selecionada
function verificaR(index: number): void {
  // Verifica se uma opção já estava selecionada
  if (selectedOptionIndex !== null) {
    // Obtém o botão anteriormente selecionado
    const prevSelectedOption = document.querySelector(
      `.btn-answer[data-index="${selectedOptionIndex}"]`
    ) as HTMLElement | null;

    // Remove a cor de destaque do botão anteriormente selecionado
    if (prevSelectedOption) {
      prevSelectedOption.style.backgroundColor = "";
    }
  }
  // Atualiza a opção selecionada
  selectedOptionIndex = index;
}
