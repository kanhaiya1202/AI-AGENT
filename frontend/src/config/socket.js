import socket from 'socket.io-client'

let socketInstance = null;

export const initializeSocket =() =>{
    socketInstance = socket(import.meta.env.VITE_API_URL,{
        auth :{
            token : localStorage.getItem('token')
        }
    })
    return socketInstance
}

export const receiveMessage = () =>{

}

export const sendMessage = () =>{

}

