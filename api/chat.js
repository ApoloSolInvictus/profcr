const SYSTEM_PROMPT = `
Eres el Asistente Virtual Oficial de ProfCR.com, una empresa de Infiniti IA by W Studio.
W Studio es el creador de ProfCR e Infiniti IA.
Tu objetivo es ayudar a profesionales y negocios en Costa Rica a obtener un sitio web profesional.

NUESTROS PLANES:
1. Plan Esencial ($29/mes): CV digital, sitio web de 1 pagina y diseno profesional.
2. Plan Crecimiento ($49/mes): Hasta 5 paginas, galeria, formulario de contacto. Es el plan mas popular.
3. Plan Impacto ($79/mes): Todo lo anterior, mas Blog y SEO inicial.
Todos los planes incluyen un dominio tipo minegocio.profcr.com y correo profesional de Google Workspace tipo minegocio@profcr.com.

DIRECTORIO PROFCR:
Incluir un sitio web propio en el directorio de ProfCR es totalmente gratis.
Los clientes pueden agregar su perfil con direccion a su sitio web sin costo.
Para solicitarlo, deben enviar su informacion a planes@profcr.com; W Studio les dira como avanzar y se agregara el perfil lo antes posible.

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
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
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

function getConfiguredModel() {
  const model = (process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL).trim();
  return model.replace(/^["']|["']$/g, "") || DEFAULT_OPENAI_MODEL;
}

function getOpenAIError(status) {
  if (status === 401) {
    return {
      code: "openai_auth_error",
      ownerMessage: "La API key de OpenAI configurada en Vercel no es valida.",
    };
  }

  if (status === 403) {
    return {
      code: "openai_permission_error",
      ownerMessage: "La API key de OpenAI no tiene permiso para usar este modelo o proyecto.",
    };
  }

  if (status === 429) {
    return {
      code: "openai_quota_or_rate_limit",
      ownerMessage: "La cuenta de OpenAI no tiene cuota disponible o esta limitada temporalmente.",
    };
  }

  if (status === 400) {
    return {
      code: "openai_bad_request",
      ownerMessage: "OpenAI rechazo la solicitud. Revisa OPENAI_MODEL y los parametros enviados.",
    };
  }

  return {
    code: "openai_upstream_error",
    ownerMessage: "OpenAI no devolvio una respuesta correcta.",
  };
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
        model: getConfiguredModel(),
        messages,
        max_completion_tokens: 800,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      const diagnostic = getOpenAIError(openaiResponse.status);
      console.error("OpenAI respondio con error:", openaiResponse.status, diagnostic.code, errorText.slice(0, 500));
      return res.status(502).json({
        error: "No pudimos obtener respuesta del asistente.",
        code: diagnostic.code,
        ownerMessage: diagnostic.ownerMessage,
      });
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
