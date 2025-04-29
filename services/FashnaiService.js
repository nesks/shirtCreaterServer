import fetch from 'node-fetch';

class FashnaiService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("❌ ERRO: FASHNAI_API_KEY não definida.");
        }
        this.apiKey = apiKey;
    }

    async getStatus(id) {
        if (!id) {
            throw new Error("O ID é obrigatório!");
        }

        const response = await fetch(`https://api.fashn.ai/v1/status/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
            },
        });

        const responseData = await response.json();
        if (!responseData) {
            throw new Error("Resposta inválida da API.");
        }

        return responseData;
    }

    async runModel(person, shirt, webhookUrl) {
        if (!person || !shirt) {
            throw new Error("As imagens de pessoa e camisa são obrigatórias!");
        }

        const response = await fetch(`https://api.fashn.ai/v1/run?webhook_url=${webhookUrl}`, {
            method: 'POST',
            body: JSON.stringify({
                model_image: person,
                garment_image: shirt,
                category: "tops",
            }),
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();
        if (!responseData || !responseData.id) {
            throw new Error("Falha ao gerar ID.");
        }

        return responseData.id;
    }
}

export default FashnaiService;