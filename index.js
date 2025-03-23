import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import bodyParser from "body-parser";

import dalleRoutes from './routes/dalle.routes.js';
import fashnaiRoutes from './routes/fashnai.routes.js';
import { setupWebSocket } from './sockets/websocket.js';  // Importa WebSocket

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;  // Render permite apenas uma porta

// Criar servidor HTTP para Express e WebSocket
const server = http.createServer(app);
setupWebSocket(server); // Inicializa WebSocket com o servidor HTTP

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

// Iniciar o servidor HTTP + WebSocket
server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
