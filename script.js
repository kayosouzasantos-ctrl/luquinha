let colecaoMidia = []

async function carregarCatalogo() {
    //Acessa a tag que exibirá os cards
    //Emite mensagem de espera
    const conteiner_card = document.getElementById('catalogo-grid');
    conteiner_card.innerHTML = "<p>Carregando itens, aguarde.</p>";

    try{
        //metodo GET.fetch() já possui get como padrão
        const resposta = await fetch('dados.json');
        if (!resposta.ok) throw new Error('Erro ao buscar dados');
        //transforma os dados no formato json()
        colecaoMidia = await resposta.json();
    }catch(erro){
        conteiner_card.innerHTML = `<p style = "color:#ef4444;">
              Erro ao carregar catálogo: ${erro.message}</p>`;
    }
}
function renderizarGrid(lista){
    const container = document.getElementById('catalogo-grid');
    container.innerHTML = "";

    if(lista.lenght ===0){
        container.innerHTML = `<p class="info">Nenhum item cadastrado nessa categoria<p/>`;
        return;
    }
}
//executa a funcao de carregarCatalogo quando inicia a pagina 
document.addEventListener('DOMContentLoaded', carregarCatalogo);