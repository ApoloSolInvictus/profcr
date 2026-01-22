const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración CORS para permitir que profcr.com hable con este servidor
app.use(cors({
    origin: '*', // En producción, idealmente cambiar esto por 'https://profcr.com'
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// --- 1. CONFIGURACIÓN GEMINI ---
// Leemos la llave desde las variables de entorno de Heroku
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("⚠️ ERROR CRÍTICO: No se encontró GEMINI_API_KEY en las variables de entorno.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Función para obtener el modelo (con fallback)
function getModel() {
    // Intentamos usar Flash por velocidad, o Pro si se prefiere
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// --- 2. RUTA RAÍZ (Solución al "Cannot GET /") ---
app.get('/', (req, res) => {
    res.send(`
        <h1>ProfCR AI Backend Online</h1>
        <p>Estado: <strong>Activo</strong></p>
        <p>Modelo: Gemini 1.5 Flash</p>
        <p>Este servidor procesa las solicitudes de inteligencia artificial para ProfCR.com</p>
    `);
});

// --- 3. ENDPOINT DE CHAT ---
app.post('/api/chat', async (req, res) => {
    try {
        if (!API_KEY) {
            throw new Error("API Key no configurada en el servidor.");
        }

        const { message, history } = req.body;
        
        // Configuración del modelo
        const model = getModel();
        
        const chat = model.startChat({
            history: history ? history.map(h => ({
                role: h.role === 'ai' ? 'model' : 'user',
                parts: [{ text: h.content }]
            })) : [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("Error en chat:", error);
        res.status(500).json({ 
            error: "Error interno del servidor de IA", 
            details: error.message 
        });
    }
});

// --- 4. INICIAR SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor ProfCR escuchando en el puerto ${port}`);
    console.log(`Verificación de API Key: ${API_KEY ? 'Cargada ✅' : 'Faltante ❌'}`);
});
