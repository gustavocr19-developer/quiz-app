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
renderPages("start");
function armazenarNome() {
    var nomeUsuarioInput = document.getElementById("input-name");
    if (nomeUsuarioInput && nomeUsuarioInput.value.trim() !== "") {
        var nomeUsuario = nomeUsuarioInput.value;
        localStorage.setItem("usuario", nomeUsuario);
        var mensagem_1 = criarMensagem("Nome armazenado com sucesso!");
        document.body.appendChild(mensagem_1);
        mensagem_1.addEventListener("click", function () {
            mensagem_1.remove();
        });
        renderPages("quiz");
    }
    else {
        var mensagem_2 = criarMensagem("Por favor, digite seu nome antes de começar.");
        document.body.appendChild(mensagem_2);
        mensagem_2.addEventListener("click", function () {
            mensagem_2.remove();
        });
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
            button.addEventListener("click", function () { return checkAnswer(index); });
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
        renderPages("leaderboard");
    }
    else {
        alert("Resposta incorreta");
        renderPages("leaderboard");
    }
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
