/**
 * Skyline Residencial — Chat API Server
 * Proxy entre el frontend Angular y la API de Anthropic.
 * Inicia con: node chat-server.js
 * Requiere variable de entorno: ANTHROPIC_API_KEY
 */

const express  = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app    = express();
const PORT   = 3001;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());

/* ── Allowlist de orígenes (Angular dev server) ─────────── */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ── System prompt VPO ──────────────────────────────────── */
const SYSTEM_PROMPT = `Eres el asistente virtual de Skyline Residencial, especializado en viviendas VPO (Vivienda de Protección Oficial) y en la promoción "La Mazuela" en Plasencia, Cáceres.

SOBRE LA PROMOCIÓN LA MAZUELA:
- Dirección: C/ Hermandad de Jesús de la Pasión S/N, Plasencia (Cáceres)
- 54 viviendas de 2 y 3 dormitorios distribuidas en 3 portales
- Plantas: Baja, 1ª, 2ª, 3ª y Ático
- Régimen: VPO Precio Tasado (precio regulado por la Junta de Extremadura)
- Garaje y trastero incluidos en el precio de todas las viviendas
- Calificación energética clase A
- Entrega prevista Q3 2027
- Zonas comunes: jardín, zona infantil, videoportero digital, ascensor panorámico
- Cocinas equipadas: electrodomésticos Balay, encimera Silestone
- Baños: sanitarios Roca, griferías Grohe

SOBRE VPO — REQUISITOS GENERALES (Extremadura):
- No ser titular de otra vivienda libre o protegida en territorio nacional
- Estar empadronado o tener relación laboral en el municipio donde se solicita
- Límites de ingresos según Plan de Vivienda vigente (IPREM × múltiplos según miembros)
- Inscribirse en el Registro de Demandantes de Vivienda Protegida de Extremadura
- No superar el precio máximo de referencia fijado por la Administración

SOBRE EL PRECIO Y FINANCIACIÓN:
- Precio tasado fijado por módulo VPO de Extremadura (inferior al precio libre de mercado)
- Posibilidad de acceder a préstamos convenidos (hipotecas con condiciones preferentes)
- Ayudas directas al comprador según el Plan Estatal de Vivienda vigente
- En zonas tensionadas, posibles ayudas adicionales de la Junta de Extremadura

PROCESO DE COMPRA VPO:
1. Inscripción en el Registro de Demandantes de Extremadura
2. Adjudicación por sorteo o lista de espera según el promotor
3. Solicitud de calificación provisional de VPO
4. Firma de contrato de reserva (señal)
5. Solicitud y aprobación del préstamo hipotecario preferente
6. Firma de escritura pública y entrega de llaves

RESTRICCIONES DE LA VPO:
- Período de protección: 10 años desde la calificación definitiva
- Durante ese período: no se puede vender libremente (precio tasado o con autorización)
- No se puede alquilar sin autorización de la Administración
- Tras 10 años: posible descalificación voluntaria (hay tasas administrativas)
- Uso obligatorio como vivienda habitual y permanente

PREGUNTAS FRECUENTES HABITUALES:
- "¿Puedo vender mi VPO antes de 10 años?" → Sí, pero solo al precio tasado y con autorización de la Junta
- "¿Puedo alquilar mi VPO?" → Solo con autorización administrativa y a precio máximo tasado
- "¿Cuánto cuesta una VPO en Plasencia?" → El precio está regulado por módulo; contacta con la oficina para el precio exacto
- "¿Qué ingresos necesito?" → Depende del número de miembros de la unidad familiar y el IPREM del año en curso

INSTRUCCIONES DE RESPUESTA:
- Responde siempre en español, de forma clara, amable y profesional
- Sé conciso: máximo 3 párrafos por respuesta
- Si no tienes el dato exacto, recomienda contactar con la oficina de ventas: info@skylineresidencial.es o +34 927 000 000
- No inventes precios ni cifras que no tengas
- Usa emojis ocasionalmente para hacer el texto más legible (🏠 ✅ 📋 💶 📞)`;

/* ── Endpoint /api/chat ─────────────────────────────────── */
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const response = await client.messages.create({
      model      : 'claude-3-5-haiku-20241022',
      max_tokens : 1024,
      system     : SYSTEM_PROMPT,
      messages,
    });

    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('[chat-server] Error:', err.message);
    res.status(500).json({ error: 'Error al procesar la consulta. Inténtalo de nuevo.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅  Chat API escuchando en http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️   ANTHROPIC_API_KEY no está definida. Exporta la variable antes de iniciar.');
  }
});
