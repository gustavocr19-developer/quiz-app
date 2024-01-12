var renderPages = function (pageName) {
    // Realiza uma requisição fetch para carregar o conteúdo da página HTML
    fetch("pages/".concat(pageName, ".html"))
        .then(function (resp) {
        if (!resp.ok) {
            throw new Error("Erro ao carregar a página");
        }
        return resp.text();
    })
        .then(function (html) {
        // Obtém o elemento raiz onde a página será exibida
        var rootElem = document.getElementById("root");
        if (rootElem) {
            // Substitui o conteúdo do elemento raiz pelo HTML carregado
            rootElem.innerHTML = html;
            // Obtém o formulário de início (se existir)
            var formStart = document.getElementById("form-start");
            // Adiciona um ouvinte de evento para o formulário de início
            if (formStart) {
                formStart.addEventListener("submit", function (event) {
                    event.preventDefault();
                    // Chama a função armazenarNome ao enviar o formulário
                    armazenarNome();
                });
            }
            if (pageName === "quiz") {
                carregarPergunta();
                console.log("A página quiz está pronta para ser usada!");
            }
            else if (pageName === "leaderboard") {
                console.log("A página leaderboard está pronta para ser usada!");
                var leaderboardContainer = document.querySelector(".container-podium");
                if (leaderboardContainer) {
                    leaderboardContainer.innerHTML = "";
                    var nomeUsuario = localStorage.getItem("usuario");
                    if (nomeUsuario) {
                        // Cria um elemento para o usuário no primeiro lugar do pódio
                        var firstPlaceItem = document.createElement("div");
                        firstPlaceItem.className = "podium-item";
                        firstPlaceItem.innerHTML = "\n                <div class=\"podium-rounded first-podium\">".concat(nomeUsuario
                            .charAt(0)
                            .toUpperCase()).concat(nomeUsuario.charAt(1).toUpperCase(), "\n                </div>\n                <div>").concat(nomeUsuario, "</div>\n                <div>1/1</div>\n              ");
                        // Adiciona o elemento ao contêiner do pódio
                        leaderboardContainer.appendChild(firstPlaceItem);
                    }
                    else {
                        console.error("Nome de usuário não encontrado no histórico local.");
                    }
                    // Limpa a div "remaining-list"
                    var remainingList = document.querySelector(".remaining-list");
                    if (remainingList) {
                        remainingList.innerHTML = "";
                    }
                    else {
                        console.error('Elemento com classe "remaining-list" não encontrado.');
                    }
                }
                else {
                    console.error('Elemento com classe "container-podium" não encontrado.');
                }
                // Obtém o botão "Novo Jogo"
                var novoJogo = document.querySelector(".btn-gold");
                // Adiciona um ouvinte de evento ao botão "Novo Jogo"
                if (novoJogo) {
                    novoJogo.addEventListener("click", function () {
                        // Ao clicar no botão "Novo Jogo", retorna à página "start"
                        renderPages("start");
                    });
                }
            }
        }
    })
        .catch(function (error) {
        // Trata erros durante a requisição fetch
        console.error("Erro durante a requisição fetch:", error);
    });
};
renderPages("start");
// Função para armazenar o nome do usuário no localStorage
function armazenarNome() {
    // Obtém o elemento de input para o nome do usuário
    var nomeUsuarioInput = document.getElementById("input-name");
    // Verifica se o elemento de input existe e se o valor não está vazio após remover espaços em branco
    if (nomeUsuarioInput && nomeUsuarioInput.value.trim() !== "") {
        // Obtém o valor do nome do usuário
        var nomeUsuario = nomeUsuarioInput.value;
        // Armazena o nome do usuário no localStorage
        localStorage.setItem("usuario", nomeUsuario);
        console.log("Nome armazenado com sucesso!");
        renderPages("quiz");
    }
    else {
        alert("Por favor, digite seu nome antes de começar.");
    }
}
function carregarPergunta() {
    fetch("questions.json")
        .then(function (resp) {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (!resp.ok) {
            throw new Error("Erro na requisição fetch.");
        }
        // Converte o conteúdo da resposta para formato JSON
        return resp.json();
    })
        .then(function (data) {
        // Exibe no console os dados recebidos do JSON
        console.log("Dados do JSON recebidos:", data);
        // Atualiza o HTML com a primeira pergunta do conjunto de perguntas
        atualizarHTML(data.questions[0]);
    })
        .catch(function (error) {
        // Trata erros durante a requisição fetch
        console.error("Erro durante a requisição fetch:", error);
    });
}
function verificarResposta(selectedIndex, correctIndex) {
    if (selectedIndex === correctIndex) {
        alert("Resposta correta!");
    }
    else {
        alert("Resposta incorreta");
    }
    renderPages("leaderboard");
}
var selectedOptionIndex = null;
// Função para atualizar o conteúdo HTML.
function atualizarHTML(pergunta) {
    // Obtém elementos HTML relevantes
    var questionNumberElement = document.querySelector(".question-number");
    var questionContainerElement = document.querySelector(".question-container");
    var btnListElement = document.querySelector(".btn-list");
    var nextBtnElement = document.getElementById("next-btn");
    // Verifica se os elementos existem
    if (questionNumberElement &&
        questionContainerElement &&
        btnListElement &&
        nextBtnElement) {
        // Define o número da pergunta atual
        questionNumberElement.textContent = "1/1";
        // Define o texto da pergunta
        questionContainerElement.textContent = pergunta.question;
        // Limpa a lista de botões de resposta
        btnListElement.innerHTML = "";
        // Adiciona botões de resposta com event listeners
        pergunta.options.forEach(function (option, index) {
            var button = document.createElement("button");
            button.className = "btn-answer";
            button.textContent = option;
            btnListElement.appendChild(button);
            // Adiciona um event listener para verificar a resposta ao clicar em um botão
            button.addEventListener("click", function () {
                // Chama a função verificaR para atualizar a opção selecionada
                verificaR(index);
                // Remove a cor de todos os botões antes de destacar o botão selecionado
                btnListElement.querySelectorAll(".btn-answer").forEach(function (btn) {
                    var buttonElement = btn;
                    buttonElement.style.backgroundColor = "#D8DDEA";
                });
                // Destaca o botão selecionado com a cor desejada.
                button.style.backgroundColor = "#8D818C";
            });
        });
        // Torna o botão visível
        nextBtnElement.classList.remove("hide");
        // Adiciona um event listener ao botão para verificar a resposta ao clicar
        nextBtnElement.addEventListener("click", function () {
            // Verifica se uma opção foi selecionada antes de avançar
            if (selectedOptionIndex !== null) {
                var perguntaAtual = pergunta;
                // Chama a função verificarResposta para validar a resposta
                verificarResposta(selectedOptionIndex, perguntaAtual.correct);
            }
            else {
                // Exibe um alerta se nenhuma opção foi selecionada
                alert("Por favor, selecione uma opção antes de responder.");
            }
        });
    }
}
// Função para verificar a resposta selecionada
function verificaR(index) {
    // Verifica se uma opção já estava selecionada
    if (selectedOptionIndex !== null) {
        // Obtém o botão anteriormente selecionado
        var prevSelectedOption = document.querySelector(".btn-answer[data-index=\"".concat(selectedOptionIndex, "\"]"));
        // Remove a cor de destaque do botão anteriormente selecionado
        if (prevSelectedOption) {
            prevSelectedOption.style.backgroundColor = "";
        }
    }
    // Atualiza a opção selecionada
    selectedOptionIndex = index;
}
