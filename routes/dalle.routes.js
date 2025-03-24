import express from 'express';
import * as dotenv from 'dotenv';


import OpenAI from "openai";


dotenv.config();

const router = express.Router();

// Verifica se a chave da API está definida
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERRO: OPENAI_API_KEY não definida no .env");
  process.exit(1); // Sai da aplicação se a chave estiver ausente
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from DALL·E" });
});

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "O prompt é obrigatório!" });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    // Verifica se a resposta contém a imagem esperada
    if (!response.data || response.data.length === 0) {
      console.error("❌ ERRO: Resposta inválida da API", response.data);
      return res.status(500).json({ message: "Falha ao gerar imagem." });
    }

    const image = response.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error("❌ Erro ao gerar imagem:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Erro ao gerar imagem!",
      error: error?.response?.data || error.message,
    });
  }
});

export default router;
