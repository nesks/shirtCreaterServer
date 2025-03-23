import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import dalleRoutes from './routes/dalle.routes.js'
import fashnaiRoutes from './routes/fashnai.routes.js'
import bodyParser from "body-parser"; 
import './sockets/websocket.js';


dotenv.config();

const app = express();

// Configuração de CORS
app.use(cors({
    origin: (origin, callback) => {
      if (process.env.cors.includes(origin) || !origin) { // !origin é para permitir requisições de ferramentas como Postman
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  }));
app.use(bodyParser.json({ limit: "10mb" }));  // JSON até 10MB
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use('/api/v1/dalle', dalleRoutes);


app.use('/api/v1/fashnai', fashnaiRoutes);

app.get('/', (req, res) => {
    res.status(200).json({message: "hello world"})
})

app.listen(8080, () => console.log("server has started on port 8080"))