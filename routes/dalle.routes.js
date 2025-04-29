import express from 'express';

export default (dalleService) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.status(200).json({ message: "Hello from DALL·E" });
    });

    router.post("/", async (req, res) => {
        try {
            const { prompt } = req.body;
            const image = await dalleService.generateImage(prompt);
            res.status(200).json({ photo: image });
        } catch (error) {
            console.error("❌ Erro ao gerar imagem:", error.message);
            res.status(500).json({ message: "Erro ao gerar imagem!", error: error.message });
        }
    });

    return router;
};