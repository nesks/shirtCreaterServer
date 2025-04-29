class ClientManager {
    constructor() {
        this.clients = new Map();
    }

    addClient(clientId, ws) {
        this.clients.set(clientId, ws);
        console.log(`Cliente ${clientId} conectado`);
    }

    removeClient(clientId) {
        this.clients.delete(clientId);
        console.log(`Cliente ${clientId} desconectado`);
    }

    getClient(clientId) {
        return this.clients.get(clientId);
    }

    sendToClient(clientId, message) {
        const client = this.getClient(clientId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        } else {
            console.log(`Cliente ${clientId} não encontrado ou desconectado`);
        }
    }

     sendImageToClient(clientId, imageUrl) {
        const client = clients.get(clientId);
        if (client) {
            client.send(JSON.stringify({
                tipo: 'imagem',
                imagem: imageUrl
            }));
        } else {
            console.error(`Cliente com clientId ${clientId} não encontrado`);
        }
    };
}

export default ClientManager;