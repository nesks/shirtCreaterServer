import express from 'express';
import * as dotenv from 'dotenv';

import { sendImageToClient } from '../sockets/websocket.js'; 

dotenv.config();

const router = express.Router();

// Verifica se a chave da API está definida
if (!process.env.FASHNAI_API_KEY) {
  console.error("❌ ERRO: OPENAI_API_KEY não definida no .env");
  process.exit(1); // Sai da aplicação se a chave estiver ausente
}


router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from FASHNAI" });
});

router.get("/status", async (req, res) => {
  try {
    const { id } = req.query  ;
    if (!id) {
      return res.status(400).json({ message: "O prompt é obrigatório!" });
    }

   const response = await fetch('https://api.fashn.ai/v1/status/'+id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+process.env.FASHNAI_API_KEY,
      }
    });


    const responseData = await response.json();


      // Verifica se a resposta contém a imagem esperada
      if (responseData && responseData.status == "processing") {
        console.error("❌ ERRO: Resposta em processamento pela API", responseData);
        return res.status(503).json({ message: "Resposta em processamento.", status:"processing" });
      }
      console.log(responseData);
    const output = responseData;

    res.status(200).json({ output: output });
  } catch (error) {
    console.error("❌ Erro ao gerar imagem:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Erro ao gerar imagem!",
      error: error?.response?.data || error.message,
    });
  }
});

router.post("/sendImage", async (req, res) => {
  try {
    const { id, status, output } = req.body;
    
    // Verifica se o status é "completed"
    if (status === 'completed' && output && output.length > 0) {
      const imageUrl = output[0]; // Pega a URL da imagem
      
      // Envia a imagem para o cliente via WebSocket
      sendImageToClient(id, imageUrl);
      
      console.log(`Imagem enviada para o cliente ${id}: ${imageUrl}`);
      return res.status(200).json({ message: "Imagem enviada com sucesso!" });
    } else {
      return res.status(400).json({ message: "Status não é 'completed' ou saída inválida!" });
    }
  } catch (error) {
    console.error("❌ Erro ao enviar imagem:", error?.message || error);
    res.status(500).json({
      message: "Erro ao enviar imagem!",
      error: error?.message || error,
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const { person, shirt } = req.body;
    if (!person || !shirt) {
      return res.status(400).json({ message: "A imagem é obrigatória!" });
    }

    const response = await fetch('https://api.fashn.ai/v1/run?webhook_url=https://shirtcreaterserver.onrender.com/api/v1/fashnai/sendImage', {
      method: 'POST',
      body: JSON.stringify({
               model_image: person,
               garment_image: shirt,
               category: "tops"
             }),
      headers: {
        'Authorization': 'Bearer '+process.env.FASHNAI_API_KEY,
        'Content-Type': 'application/json',
      }
    });

    const responseData = await response.json();

    // Verifica se a resposta contém a imagem esperada
    if (!responseData || !responseData.id || responseData.id.length === 0) {
      console.error("❌ ERRO: Resposta inválida da API", responseData);
      return res.status(500).json({ message: "Falha ao gerar imagem." });
    }

    console.log(responseData); // Exibe os dados para depuração
    const id = responseData.id; // Ajuste conforme a estrutura da resposta
    res.status(200).json({ id: id });
  } catch (error) {
    console.error("❌ Erro ao gerar id:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Erro ao gerar imagem!",
      error: error?.response?.data || error.message,
    });
  }
}); 

export default router;
