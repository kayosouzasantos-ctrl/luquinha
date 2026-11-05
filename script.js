let colecaoMidia = [];
let categoriaAtual = "Todos";

async function carregarDados() {
    try {
        const resposta = await fetch('dados.json');
        if (!resposta.ok) {
            throw new Error('Não foi possível carregar o arquivo JSON');
        }
        colecaoMidia = await resposta.json();
        renderizarGrid(colecaoMidia);
    } catch (erro) {
        const container = document.getElementById("catalogo-grid");
        container.innerHTML = `<p class="info-erro">Erro ao carregar dados: ${erro.message}</p>`;
    }
}

function renderizarGrid(lista) {
    const container = document.getElementById("catalogo-grid");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = `<p class="info-vazio">Nenhum item cadastrado nesta categoria.</p>`;
        return;
    }

    lista.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        const placeholderSeguro = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgMzAwIDQwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxZTI5M2IiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NGEzYjgiPkNhcGEgT2ZmbGluZTwvdGV4dD48L3N2Zz4=";

        card.innerHTML = `
            <img
                src="${item.capa}"
                alt="Capa de ${item.titulo}"
                class="capa-midia"
                onerror="this.onerror=null; this.src='${placeholderSeguro}';"
            >
            <div>
                <span class="tag-categoria">${item.categoria}</span>
                <h3>${item.titulo}</h3>
                <p class="info">Plataforma: ${item.plataforma}</p>
                <p class="info">Nota: <span class="nota">⭐ ${Number(item.nota).toFixed(1)}</span></p>
                <p class="info">Status: <strong>${item.status}</strong></p>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrarCategoria(categoria) {
    categoriaAtual = categoria;
    if (categoria === "Todos") {
        renderizarGrid(colecaoMidia);
        return;
    }
    const listaFiltrada = colecaoMidia.filter(item => item.categoria === categoria);
    renderizarGrid(listaFiltrada);
}

function configurarFiltros() {
    const botoes = document.querySelectorAll(".filtros button");
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            botoes.forEach(item => item.classList.remove("ativo"));
            botao.classList.add("ativo");
            filtrarCategoria(botao.dataset.categoria);
        });
    });
}

function configurarFormulario() {
    const formulario = document.getElementById("form_midia");
    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        const titulo = document.getElementById("titulo").value.trim();
        const categoria = document.getElementById("categoria").value;
        const plataforma = document.getElementById("plataforma").value.trim();
        const nota = Number(document.getElementById("nota").value);

        const novoItem = {
            id: String(Date.now()),
            titulo: titulo,
            categoria: categoria,
            plataforma: plataforma,
            nota: nota,
            status: "Não iniciado",
            capa: "https://placeholder.com"
        };

        colecaoMidia.push(novoItem);
        formulario.reset();
        filtrarCategoria(categoriaAtual);
    });
}

async function alterarStatus(id) {
    const item = colecaoMidia.find(m => m.id === id);
    if(!item) return;

    const statusOpcoes = ["Jogar","Jogando","Jogado","Assistir","Assistido"];
    const proximoStatus = statusOpcoes[(statusOpcoes.indexOf(item.status)+1) %statusOpcoes.length];

    try{
        item.status = proximoStatus;
        renderizarGrid(colecaoMidia);
    }catch (erro){
        alert("Erro ao atualizar status");
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    configurarFiltros();
    configurarFormulario();
});