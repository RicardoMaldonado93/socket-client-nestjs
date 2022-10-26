import { Manager, Socket } from "socket.io-client"

let socket: Socket;

export const connectToServer = ( token: string )=>{
    const manager = new Manager(`http://127.0.0.1:3000/socket.io/socket.io.js`, { extraHeaders: {
        authorization: token
    } });

    socket?.removeAllListeners()
    socket = manager.socket('/');

    addListener();
}


const addListener = ()=>{
    const serverStatusLabel = document.querySelector("#server-status")!;
    const clientsUl = document.querySelector("#clients-ul")!;
    
    const messageForm= document.querySelector<HTMLFormElement>("#message-form")!;
    const messageInput= document.querySelector<HTMLInputElement>("#message-input")!;
    const messageUl= document.querySelector<HTMLUListElement>("#messages-ul")!;

    socket.on('connect', ()=>{
        serverStatusLabel.innerHTML = 'connected'
        console.log('connected')
    })
    
    socket.on('disconnect', ()=>{
        serverStatusLabel.innerHTML = 'disconnected'
        console.log('disconnected')
    })

    socket.on('clients-updated', (clients:string[])=>{
        let clientsHTML = ''

        clients.forEach( clientId => clientsHTML += `<li>${clientId}</li>`)

        clientsUl.innerHTML = clientsHTML
    })

    messageForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        if(messageInput.value.trim().length <= 0 ) return;

        socket.emit('message-from-client', {
            id: "me",
            message: messageInput.value
        })

        messageInput.value = ''
    })

    socket.on('message-from-server', (payload: {fullName:string, message:string})=>{
        const newMessage = `
            <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
            </li>
        `

        const li = document.createElement('li')
        li.innerHTML = newMessage
        messageUl.append( li )
    })
  }
  