const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración CORS
app.use(cors({
    origin: '*', // En producción, cambiar por 'https://profcr.com'
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// --- 1. CONFIGURACIÓN OPENAI ---
// Leemos la llave desde las variables de entorno de Heroku
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.error("⚠️ ERROR CRÍTICO: No se encontró OPENAI_API_KEY en las variables de entorno.");
}

const openai = new OpenAI({
    apiKey: API_KEY,
});

// --- 2. PERSONALIDAD Y CONOCIMIENTO DEL BOT (SYSTEM PROMPT) ---
const SYSTEM_PROMPT = `
Eres el Asistente Virtual Oficial de ProfCR.com, una empresa de Infiniti IA by W Studio.
Tu objetivo es ayudar a los profesionales en Costa Rica a obtener su sitio web profesional.

NUESTROS PLANES:
1. Plan Esencial ($29/mes): CV Digital, sitio web de 1 página, diseño profesional.
2. Plan Crecimiento ($49/mes): Hasta 5 páginas, galería, formulario de contacto. (EL MÁS POPULAR)
3. Plan Impacto ($79/mes): Todo lo anterior + Blog + SEO Inicial.
* TODOS los planes incluyen un dominio (ej: minegocio.profcr.com) y correo profesional de Gmail Workspace (ej: minegocio@profcr.com).

PROCESO DE COMPRA:
El usuario debe elegir un plan en la web, pagar mediante el botón de PayPal. Una vez aprobado el pago, nuestro sistema en el backend verificará la factura, y mediante nuestra integración con GitHub, clonará y creará su sitio web automáticamente en minutos. 
Luego, deben enviar su contenido al correo: planes@profcr.com.

TONO:
Profesional, amable, conciso y tecnológico. Respuestas cortas.
Si preguntan por facturas o pagos de PayPal, diles que el sistema procesa el pago de forma segura y automática, y que si ya pagaron, su sitio se está generando.
`;

// --- 3. RUTA RAÍZ ---
app.get('/', (req, res) => {
    res.send(`
        <h1>ProfCR AI Backend Online</h1>
        <p>Estado: <strong>Activo</strong></p>
        <p>Motor: <strong>OpenAI (GPT-4o-mini)</strong></p>
        <p>Este servidor procesa las solicitudes de inteligencia artificial para ProfCR.com</p>
    `);
});

// --- 4. ENDPOINT DE CHAT ---
app.post('/api/chat', async (req, res) => {
    try {
        if (!API_KEY) {
            throw new Error("API Key de OpenAI no configurada en el servidor.");
        }

        const { message, history } = req.body;
        
        // Mapeamos el historial enviado por el frontend para asegurar compatibilidad con OpenAI
        const formattedHistory = history ? history.map(h => ({
            role: h.role === 'ai' || h.role === 'assistant' || h.role === 'model' ? 'assistant' : 'user',
            content: h.content || (h.parts && h.parts[0] ? h.parts[0].text : '')
        })) : [];

        // Construimos la lista de mensajes (System + Historial + Mensaje actual)
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...formattedHistory,
            { role: "user", content: message }
        ];

        // Llamada a OpenAI usando el modelo más eficiente en costo/beneficio
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: messages,
            max_tokens: 800,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        res.json({ response: reply });

    } catch (error) {
        console.error("Error en chat OpenAI:", error);
        res.status(500).json({ 
            error: "Error interno del servidor de IA", 
            details: error.message 
        });
    }
});

// --- 5. INICIAR SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor ProfCR escuchando en el puerto ${port}`);
    console.log(`Verificación de OPENAI_API_KEY: ${API_KEY ? 'Cargada ✅' : 'Faltante ❌'}`);
});
