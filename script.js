let nomeUsuario;
let caixaBatePapo;
let ultimaMsg;
let elementoUltimaMsg;
let tempoUltimaMsg;

let mensagens = [];


function entrarNaSala (){
    nomeUsuario = prompt("Para entrar na sala, digite o seu nome");

    const nome = {
        name: nomeUsuario 
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', nome);
    promessa.then(renderizarMensagens);
    promessa.catch(pedirNomeNovamente);

}
entrarNaSala();


function pedirNomeNovamente (erro){
    if(erro.response.status === 409){
        alert("Esse nome já está sendo usado, por favor, escolha outro nome!");
        nomeUsuario = prompt("Para entrar na sala, digite o seu nome");
    }
 }

function carregarMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(mensagensChegaram);
}
carregarMensagens();


function mensagensChegaram(mensagem){
    mensagens = mensagem.data;
    renderizarMensagens();
    
}

function atualizarChat(){
    setInterval(carregarMensagens, 3000);
   
}

atualizarChat();

function renderizarMensagens(){

    caixaBatePapo = document.querySelector(".mensagens");
   

    caixaBatePapo.innerHTML = "";

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
         if (mensagens[i].type === "private_message" && mensagens[i].to === nomeUsuario){
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

    let ultimaFilha = document.querySelector(".mensagens").lastElementChild;
    ultimaFilha.scrollIntoView();
}

function atualizarStatus (){

    const nome = {
        name: nomeUsuario
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
    promessa.catch(tratarErro);

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
    promessa.catch(tratarErro);
   
}

function tratarErro(erro){
    if(erro.response.status === 400){
        window.location.reload();
    }
}