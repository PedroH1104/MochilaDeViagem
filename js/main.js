const form = document.getElementById("novoItem")
const lista = document.getElementById("lista")  
// const itens = []
// const itens = localStorage.getItem("itens") || []      -> cria uma variavel itens que vai pegar no local storage, caso seja falso, ele cria uma array
// mas quando usamos o JSON.stringify transformamos em string, e precisamos transformar novamente em uma array, para poder aplicar algumas funções (forEach, etc)
const itens = JSON.parse(localStorage.getItem("itens")) || []

// console.log(itens)

itens.forEach( (elemento) => {                               // elemento, no caso é o item que está sendo visto naquele momento
    criaElemento(elemento)
})

form.addEventListener("submit", (evento) => {
    evento.preventDefault()
    
    // console.log(evento.target.elements['nome'].value)
    // console.log(evento.target.elements['quantidade'].value)

    const nome = evento.target.elements['nome']
    const quantidade = evento.target.elements['quantidade']

    const existe = itens.find(elemento => elemento.nome === nome.value)  // procurar um elemento atraves do nome, e comparando se é igual ao nome.value que é o que eu digitei 

    // console.log(existe)                                               se existir, retorna o proprio elemento, se não retorna undefined

    const itemAtual = {                                                  // tranformando em um objeto
        "nome": nome.value,
        "quantidade": quantidade.value
    }

    if (existe) {
        itemAtual.id = existe.id                                             // se existir, vai receber o id do elemento existente (que foi definido quando criado)

        atualizaElemento(itemAtual)                                          // chama a função que sobreescreve a quantidade com a nova

        itens[itens.findIndex(elemento => elemento.id === existe.id)] = itemAtual  // atualizar o localStorage junto, para que quando atualize, não volte ao primeiro valor, garantir que está buscando o elemento correto


    } else {
        itemAtual.id = itens[itens.length -1] ? (itens[itens.length-1]).id + 1 : 0

        criaElemento(itemAtual)                                              // cria o objeto
        itens.push(itemAtual)                                                // insere o objeto na nossa array através do push
    }  

    

    localStorage.setItem("itens", JSON.stringify(itens))                 // transformando o nosso objeto em texto (string), porque o localstorage só lê string

    nome.value = ""
    quantidade.value = ""                                                // após enviar os dados, limpa os campos

})

function criaElemento(item) {    

    const novoItem = document.createElement('li')           // criou um novo item de uma lista
    novoItem.classList.add("item")                          // e atribuiu a classe "item" a ele
    
    const numeroItem = document.createElement('strong')     // criou um elemento (strong) e atribuiu o variavel "quantidade" ao conteudo HTML dele
    numeroItem.innerHTML = item.quantidade                  // acessa o objeto item na posição quantidade e atribuiu ao conteudo HTML da strong 
    numeroItem.dataset.id = item.id                         // atribuimos uma id quando criar o elemento para fazer a verificação de existencia depois

    novoItem.appendChild(numeroItem)                        // atribuiu a "strong" como filho da li       
    novoItem.innerHTML += item.nome                         // acessa o objeto item na posição nome e atribuiu ao conteudo HTML da li

    novoItem.appendChild(botaoDeleta(item.id))

    lista.appendChild(novoItem)                             // adicionou a li como filho da ul (lista)   
    
}

function atualizaElemento(item){
    document.querySelector("[data-id='"+item.id+"']").innerHTML = item.quantidade
    /* Então para selecionarmos um elemento no HTML que tenha essa propriedade, nós precisamos escrever isso dentro dos parênteses do querySelector. (data-id="0")
    Porém, para que o querySelector entenda que é uma propriedade (e não um ID, classse, etc) o seletor deve vir entre colchetes, ficando: ([data-id="0"])
    Mas ainda está faltando um detalhe, o querySelector precisa receber uma string, então precisamos colocar as coisas entre aspas: ("[data-id="0"]")
    E é ai que vem o problema, como tem mais de duas aspas, o JS não sabe onde começa e onde termina cada uma delas. Pra resolver isso, utilizamos 
    as aspas simples, para fazer com que ele não tente ler aquelas aspas duplas que são da propriedade do data-attribute: ("[data-id='"0"']")
    Agora só falta uma última coisa. Para deixar o código dinâmico, ao invés de passar o valor do ID ali, vamos passar a variável item.id que tem o 
    valor do ID que estamos procurando armazenada. Para isso precisaremos utilizar o sinal de + para concaternar as strings: ("[data-id='"+item.id+"']")   */
}

function botaoDeleta(id){
    const elementoBotao = document.createElement("button")
    elementoBotao.innerHTML = "X"

    elementoBotao.addEventListener("click", function(){         // quando criamos um botao dinamicamente no JS, ele não possui um evento de escuta natural, a arrow n possui o this
        deletaElemento(this.parentNode, id)
    })         
                                

    return elementoBotao
}

function deletaElemento(elemento, id) {
    elemento.remove()
    
    itens.splice(itens.findIndex(elemento => elemento.id === id), 1)      // itens é a constante que usamos para mexer no localStorage, o splice apaga através da posição no array
    localStorage.setItem("itens", JSON.stringify(itens))                  // reescrever o localStorage para que quando atualize, o elemento retirado não volte                                                  
}