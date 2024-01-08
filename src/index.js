var renderPages = function (pageName) {
    fetch("pages/".concat(pageName, ".html"))
        .then(function (resp) {
        if (!resp.ok) {
            throw new Error("Erro ao carregar a página");
        }
        return resp.text();
    })
        .then(function (html) {
        var rootElem = document.getElementById("root");
        if (rootElem) {
            rootElem.innerHTML = html;
            var formStart = document.getElementById("form-start");
            if (formStart) {
                formStart.addEventListener("submit", function (event) {
                    event.preventDefault();
                    armazenarNome();
                });
            }
            if (pageName === "quiz") {
                carregarPergunta();
                console.log("A página quiz está pronta para ser usada!");
            }
            else if (pageName === "leaderboard") {
                console.log("A página leaderboard está pronta para ser usada!");
                var novoJogo = document.querySelector(".btn-gold");
                // Adicionando um ouvinte de evento ao botão "Novo Jogo"
                if (novoJogo) {
                    novoJogo.addEventListener("click", function () {
                        // Ao clicar no botão "Novo Jogo", retorna à página "start"
                        renderPages("start");
                    });
                }
            }
        }
        else {
            console.error('Elemento com ID "root" não encontrado.');
        }
    })
        .catch(function (error) {
        console.error("Erro durante a requisição fetch:", error);
    });
};
// Função para exibir mensagens
renderPages("start");
function armazenarNome() {
    var nomeUsuarioInput = document.getElementById("input-name");
    if (nomeUsuarioInput && nomeUsuarioInput.value.trim() !== "") {
        var nomeUsuario = nomeUsuarioInput.value;
        localStorage.setItem("usuario", nomeUsuario);
        console.log("Nome armazenado com sucesso!");
        renderPages("quiz");
    }
    else {
        alert("Por favor, digite seu nome antes de começar.");
    }
}
function criarMensagem(texto) {
    var mensagem = document.createElement("div");
    mensagem.textContent = texto;
    mensagem.classList.add("alert-message");
    return mensagem;
}
function carregarPergunta() {
    fetch("questions.json")
        .then(function (resp) {
        if (!resp.ok) {
            throw new Error("Erro na requisição fetch.");
        }
        return resp.json();
    })
        .then(function (data) {
        console.log("Dados do JSON recebidos:", data);
        atualizarHTML(data.questions[0]);
    })
        .catch(function (error) {
        console.error("Erro durante a requisição fetch:", error);
    });
}
function atualizarHTML(pergunta) {
    var questionNumberElement = document.querySelector(".question-number");
    var questionContainerElement = document.querySelector(".question-container");
    var btnListElement = document.querySelector(".btn-list");
    var nextBtnElement = document.getElementById("next-btn");
    if (questionNumberElement && questionContainerElement && btnListElement && nextBtnElement) {
        questionNumberElement.textContent = "1/10";
        questionContainerElement.textContent = pergunta.question;
        btnListElement.innerHTML = "";
        pergunta.options.forEach(function (option, index) {
            var button = document.createElement("button");
            button.className = "btn-answer";
            button.textContent = option;
            btnListElement.appendChild(button);
            button.addEventListener("click", function () {
                checkAnswer(index);
                // Remove a cor verde de todos os botões
                btnListElement.querySelectorAll(".btn-answer").forEach(function (btn) {
                    var buttonElement = btn;
                    buttonElement.style.backgroundColor = "";
                });
                button.style.backgroundColor = "#B4B7FA";
            });
        });
        nextBtnElement.classList.remove("hide");
        nextBtnElement.addEventListener("click", function () {
            if (selectedOptionIndex !== null) {
                var perguntaAtual = pergunta;
                verificarResposta(selectedOptionIndex, perguntaAtual.correct);
            }
            else {
                alert("Por favor, selecione uma opção antes de responder.");
            }
        });
    }
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
function checkAnswer(index) {
    if (selectedOptionIndex !== null) {
        var prevSelectedOption = document.querySelector(".btn-answer[data-index=\"".concat(selectedOptionIndex, "\"]"));
        if (prevSelectedOption) {
            prevSelectedOption.style.backgroundColor = "";
        }
    }
    var selectedOption = document.querySelector(".btn-answer[data-index=\"".concat(index, "\"]"));
    if (selectedOption) {
        selectedOption.style.backgroundColor = "black";
    }
    selectedOptionIndex = index;
}
