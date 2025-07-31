import { io } from 'socket.io-client'

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (socketInstance) {
        socketInstance.disconnect();
    }
    
    const serverUrl = import.meta.env.VITE_API_URL
    
    socketInstance = io(serverUrl, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        },
        transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
        timeout: 20000,
        forceNew: true
    });

    socketInstance.on('connect', () => {
        console.log('Connected to server');
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    socketInstance.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
    });

    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    }
}

export const sendMessage = (eventName, data) => {
    if (socketInstance && socketInstance.connected) {
        socketInstance.emit(eventName, data);
    } else {
        console.error('Socket not connected');
    }
}

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
}