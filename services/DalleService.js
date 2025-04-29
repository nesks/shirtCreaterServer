import OpenAI from "openai";

class DalleService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("❌ ERRO: OPENAI_API_KEY não definida.");
        }
        this.openai = new OpenAI({ apiKey });
    }

    async generateImage(prompt) {
        if (!prompt) {
            throw new Error("O prompt é obrigatório!");
        }

        const response = await this.openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });

        if (!response.data || response.data.length === 0) {
            throw new Error("Falha ao gerar imagem.");
        }

        return response.data[0].b64_json;
    }
}

export default DalleService;