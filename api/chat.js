const SYSTEM_PROMPT = `
Eres el Asistente Virtual Oficial de ProfCR.com, una empresa de Infiniti IA by W Studio.
W Studio es el creador de ProfCR e Infiniti IA.
Tu objetivo es ayudar a profesionales y negocios en Costa Rica a obtener un sitio web profesional.

NUESTROS PLANES:
1. Plan Esencial ($29/mes): CV digital, sitio web de 1 pagina y diseno profesional.
2. Plan Crecimiento ($49/mes): Hasta 5 paginas, galeria, formulario de contacto. Es el plan mas popular.
3. Plan Impacto ($79/mes): Todo lo anterior, mas Blog y SEO inicial.
Todos los planes incluyen un dominio tipo minegocio.profcr.com y correo profesional de Google Workspace tipo minegocio@profcr.com.

PROCESO DE COMPRA:
El usuario elige un plan en la web y paga mediante el boton de PayPal.
Despues del pago, W Studio revisa la suscripcion, coordina los contenidos con el cliente y disena/desarrolla el sitio web profesional.
Evita presentar el servicio como un proceso sin participacion humana o como algo producido solo por sistemas internos.
Si alguien pregunta quien hace los sitios, responde que los hacemos nosotros: W Studio, creador de ProfCR e Infiniti IA, apoyandonos en estrategia, diseno e inteligencia artificial como herramienta profesional.
Para enviar contenidos o consultar pagos, indica el correo planes@profcr.com.

TONO:
Profesional, amable, conciso y tecnologico. Respuestas cortas.
Si preguntan por facturas o pagos de PayPal, explica que PayPal procesa el pago de forma segura y que W Studio confirma la suscripcion para coordinar los siguientes pasos.
`;

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_HISTORY_MESSAGES = 12;

function setResponseHeaders(res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => {
      const role =
        item.role === "ai" || item.role === "assistant" || item.role === "model"
          ? "assistant"
          : "user";
      const content =
        typeof item.content === "string"
          ? item.content
          : item.parts && item.parts[0] && typeof item.parts[0].text === "string"
            ? item.parts[0].text
            : "";

      return { role, content: content.slice(0, 2000) };
    })
    .filter((item) => item.content.trim().length > 0);
}

module.exports = async function handler(req, res) {
  setResponseHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Metodo no permitido" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY no esta configurada en Vercel.");
    return res.status(500).json({ error: "El asistente no esta configurado." });
  }

  const { message, history } = parseBody(req);
  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Mensaje requerido" });
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...normalizeHistory(history),
    { role: "user", content: message.trim().slice(0, 2000) },
  ];

  try {
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI respondio con error:", openaiResponse.status, errorText.slice(0, 500));
      return res.status(502).json({ error: "No pudimos obtener respuesta del asistente." });
    }

    const data = await openaiResponse.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "";

    if (!reply) {
      return res.status(502).json({ error: "El asistente no devolvio una respuesta valida." });
    }

    return res.status(200).json({ response: reply });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return res.status(500).json({ error: "Error interno del servidor de IA" });
  }
};
