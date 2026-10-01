let colecaoMidia = [];

let categoriaAtual = "Todos";

async function carregarCatalogo() {

    const container = document.getElementById("catalogo-grid");

    container.innerHTML = "<p>Carregando itens, aguarde.</p>";

    try {

        const resposta = await fetch("dados.json");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados.");
        }

        colecaoMidia = await resposta.json();

        renderizarGrid(colecaoMidia);

    } catch (erro) {

        container.innerHTML = `
            <p class="info-erro">
                Erro ao carregar catálogo: ${erro.message}
            </p>
        `;
    }
}


function renderizarGrid(lista) {

    const container = document.getElementById("catalogo-grid");

    container.innerHTML = "";

    if (lista.length === 0) {

        container.innerHTML = `
            <p class="info-vazio">
                Nenhum item cadastrado nesta categoria.
            </p>
        `;

        return;
    }

    lista.forEach(item => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            ${
                item.capa
                    ? `
                        <img
                            src="${item.capa}"
                            alt="Capa de ${item.titulo}"
                            class="capa-midia"
                        >
                    `
                    : ""
            }

            <div>

                <span class="tag-categoria">
                    ${item.categoria}
                </span>

                <h3>
                    ${item.titulo}
                </h3>

                <p class="info">
                    Plataforma: ${item.plataforma}
                </p>

                <p class="info">
                    Nota:
                    <span class="nota">
                        ${Number(item.nota).toFixed(1)}
                    </span>
                </p>

                <p class="info">
                    Status:
                    <strong>${item.status}</strong>
                </p>

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

    const listaFiltrada = colecaoMidia.filter(item => {
        return item.categoria === categoria;
    });

    renderizarGrid(listaFiltrada);
}


function configurarFiltros() {

    const botoes = document.querySelectorAll(".filtros button");

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            botoes.forEach(item => {
                item.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            const categoria = botao.dataset.categoria;

            filtrarCategoria(categoria);
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

        const nota = Number(
            document.getElementById("nota").value
        );

        const novoItem = {

            id: String(Date.now()),

            titulo: titulo,

            categoria: categoria,

            plataforma: plataforma,

            nota: nota,

            status: "Não iniciado",

            capa: ""
        };

        colecaoMidia.push(novoItem);

        formulario.reset();

        filtrarCategoria(categoriaAtual);
    });
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarCatalogo();

        configurarFiltros();

        configurarFormulario();
    }
);