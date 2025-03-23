import WebSocket, { WebSocketServer } from 'ws';
import { parse } from 'url';






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

  export { sendImageToClient };
  