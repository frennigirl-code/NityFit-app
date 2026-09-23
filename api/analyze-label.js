// Funzione serverless Vercel — riceve una foto di un'etichetta nutrizionale
// e usa Claude (vision) per estrarre kcal/macro in formato strutturato.
// Richiede la variabile d'ambiente ANTHROPIC_API_KEY su Vercel.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' })
    return
  }

  const { imageBase64, mediaType } = req.body || {}
  if (!imageBase64) {
    res.status(400).json({ error: 'Immagine mancante' })
    return
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: [
                  'Guarda la tabella nutrizionale in questa immagine.',
                  'Rispondi SOLO con un oggetto JSON valido, senza testo aggiuntivo né backtick, con questa struttura esatta:',
                  '{"nome": "nome del prodotto se visibile, altrimenti null", "kcal": numero, "proteine": numero, "carboidrati": numero, "grassi": numero}',
                  'I valori numerici devono essere quelli "per 100 g" o "per 100 ml" della tabella, non per porzione.',
                  'Se un valore non è leggibile usa 0. Non aggiungere commenti o spiegazioni.',
                ].join(' '),
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const dettagli = await response.text()
      res.status(502).json({ error: 'Errore dal servizio AI', dettagli })
      return
    }

    const data = await response.json()
    const testo = (data.content || [])
      .filter((blocco) => blocco.type === 'text')
      .map((blocco) => blocco.text)
      .join('')
      .trim()

    const pulito = testo.replace(/```json|```/g, '').trim()
    const risultato = JSON.parse(pulito)

    res.status(200).json(risultato)
  } catch (err) {
    res.status(500).json({ error: "Errore nell'analisi dell'immagine", dettagli: String(err) })
  }
}
