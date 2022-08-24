let nomeUsuario;
let caixaBatePapo;

let mensagens = [];


function entrarNaSala (){
    nomeUsuario = prompt("Para entrar na sala, digite o seu nome");

    const nome = {
        name: nomeUsuario 
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', nome);
    promessa.then(renderizarMensagens);

    //promessa.catch(pedirNomeNovamente);

}
entrarNaSala();


// function pedirNomeNovamente (){
//     nomeUsuario = prompt("Para entrar na sala, digite o seu nome");
// }

function carregarMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(mensagensChegaram);
}
carregarMensagens();


function mensagensChegaram(mensagem){
    mensagens = mensagem.data;
}



function atualizarChat(){
    mensagens = [];
    setInterval(carregarMensagens, 3000);
    setInterval(mensagensChegaram, 3000);
    setInterval(renderizarMensagens, 3000);
}

atualizarChat();



function renderizarMensagens(){

    caixaBatePapo = document.querySelector(".mensagens");

    for(i = 0; i < mensagens.length; i++){
       
        if(mensagens[i].type === "status"){
            caixaBatePapo.innerHTML += 
            `
            <div class="caixa-msg status">
                <p class="mensagem">
                <span class="hora">${mensagens[i].time}</span>
                <span class="nome-usuario">${mensagens[i].from}</span> 
                ${mensagens[i].text}</p>
            </div>
            `
        } 
        if (mensagens[i].type === "message"){
            caixaBatePapo.innerHTML += `
            <div class="caixa-msg normal">
                    <p class="mensagem">
                    <span class="hora">${mensagens[i].time}</span>
                    <span class="nome-usuario">${mensagens[i].from}</span> 
                    fala para 
                    <span class="destinatario">${mensagens[i].to}</span>
                    ${mensagens[i].text}
                    </p>
            </div>
            
            `
        }
         if (mensagens[i].type === "private_message"){
            caixaBatePapo.innerHTML += `
            <div class="caixa-msg reservada">
                <p class="mensagem">
                <span class="hora">${mensagens[i].time}</span>
                <span class="nome-usuario">${mensagens[i].from}</span> 
                reservadamente para 
                <span class="destinatario">${mensagens[i].to}</span>
                ${mensagens[i].text} 
                </p>
            </div>
            
            `
        }
    }
}

renderizarMensagens();



function atualizarStatus (){

    const nome = {
        name: nomeUsuario
    }

    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome)
}

setInterval(atualizarStatus, 5000);

function enviarMsg(){

    let msgDigitada = document.querySelector(".escrever-msg");

    const msg = {
        from: nomeUsuario,
	    to: "Todos",
	    text: msgDigitada.value,
	    type: "message"
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);
    promessa.then(carregarMensagens);

}