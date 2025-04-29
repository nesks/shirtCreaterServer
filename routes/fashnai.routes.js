import express from 'express';
import * as dotenv from 'dotenv';
import { sendImageToClient } from '../sockets/websocket.js';

dotenv.config();

export default (fashnaiService) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.status(200).json({ message: "Hello from FASHNAI" });
    });

    router.get("/status", async (req, res) => {
        try {
            const { id } = req.query;
            const status = await fashnaiService.getStatus(id);

            if (status.status === "processing") {
                return res.status(503).json({ output: { message: "Resposta em processamento.", status: "processing" } });
            }

            res.status(200).json({ output: status });
        } catch (error) {
            console.error("❌ Erro ao obter status:", error.message);
            res.status(500).json({ message: "Erro ao obter status!", error: error.message });
        }
    });

    router.post("/sendImage", async (req, res) => {
        try {
            const { id, status, output } = req.body;

            if (status === 'completed' && output && output.length > 0) {
                const imageUrl = output[0];
                sendImageToClient(id, imageUrl);

                console.log(`Imagem enviada para o cliente ${id}: ${imageUrl}`);
                return res.status(200).json({ message: "Imagem enviada com sucesso!" });
            } else {
                return res.status(400).json({ message: "Status não é 'completed' ou saída inválida!" });
            }
        } catch (error) {
            console.error("❌ Erro ao enviar imagem:", error.message);
            res.status(500).json({ message: "Erro ao enviar imagem!", error: error.message });
        }
    });

    router.post("/", async (req, res) => {
        try {
            const { person, shirt } = req.body;
            const webhookUrl = "https://shirtcreaterserver.onrender.com/api/v1/fashnai/sendImage";
            const id = await fashnaiService.runModel(person, shirt, webhookUrl);

            res.status(200).json({ id });
        } catch (error) {
            console.error("❌ Erro ao gerar ID:", error.message);
            res.status(500).json({ message: "Erro ao gerar imagem!", error: error.message });
        }
    });

    return router;
};