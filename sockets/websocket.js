import { WebSocketServer } from 'ws';
import { parse } from 'url';

// Armazena clientes conectados
const clients = new Map();

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
        const { query } = parse(req.url, true);
        const clientId = query.id; // Captura o ID do cliente na URL

        if (!clientId) {
            ws.close(1008, 'ID do cliente não fornecido');
            return;
        }

        // Armazena a conexão do cliente
        clients.set(clientId, ws);
        console.log(`Cliente ${clientId} conectado`);

        ws.on('message', (message) => {
            console.log(`Mensagem do cliente ${clientId}:`, message);
        });

        ws.on('close', () => {
            console.log(`Cliente ${clientId} desconectado`);
            clients.delete(clientId); // Remove da lista ao desconectar
        });
    });

    console.log("WebSocket iniciado!");

    return wss;
};

// Função para enviar mensagem para um cliente específico
const sendToClient = (clientId, message) => {
    const client = clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
    } else {
        console.log(`Cliente ${clientId} não encontrado ou desconectado`);
    }
};

const sendImageToClient = (id, imageUrl) => {
    const client = clients.get(id);
    if (client) {
        client.send(JSON.stringify({
            tipo: 'imagem',
            imagem: imageUrl
        }));
    } else {
        console.error(`Cliente com ID ${id} não encontrado`);
    }
};

// Exporta a função para iniciar o WebSocket e as funções utilitárias
export { setupWebSocket, sendToClient, sendImageToClient };
