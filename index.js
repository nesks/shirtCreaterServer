import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';

import dalleRoutes from './routes/dalle.routes.js';
import fashnaiRoutes from './routes/fashnai.routes.js';
import bodyParser from "body-parser"; 
import { parse } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;  // Render permite apenas uma porta

// Criar servidor HTTP para Express e WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Rotas
app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/fashnai', fashnaiRoutes);

app.get('/', (req, res) => {
    res.status(200).json({message: "hello world"});
});

// Armazena clientes conectados
const clients = new Map();


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

// Iniciar o servidor HTTP + WebSocket
server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
