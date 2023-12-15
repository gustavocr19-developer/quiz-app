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
        localStorage.setItem("Player", nomeUsuario);
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
document.addEventListener("DOMContentLoaded", function () {
    fetch("questions.json")
        .then(function (response) { return response.json(); })
        .then(function (data) { });
});
