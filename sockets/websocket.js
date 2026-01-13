import { WebSocketServer } from 'ws';
import { parse } from 'url';
import ClientManager from './clientManager.js';

const setupWebSocket = (server) => {
    const clientManager = new ClientManager();
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
        const { query } = parse(req.url, true);
        const clientId = query.id;
        if (!clientId) {
            ws.close(1008, 'ID do cliente não fornecido');
            return;
        }

        clientManager.addClient(clientId, ws);

        ws.on('message', (message) => {
            console.log(`Mensagem do cliente ${clientId}:`, message);
        });

        ws.on('close', () => {
            clientManager.removeClient(clientId);
        });
    });

    console.log("WebSocket iniciado!");

    return { wss, clientManager };
};

export default setupWebSocket;