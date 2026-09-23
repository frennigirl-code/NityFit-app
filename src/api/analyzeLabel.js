// Invia la foto dell'etichetta alla funzione serverless /api/analyze-label
// e restituisce i valori nutrizionali strutturati letti da Claude.

export async function analyzeLabelPhoto(file) {
  const { base64, mediaType } = await fileToBase64(file)

  const res = await fetch('/api/analyze-label', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64, mediaType }),
  })

  if (!res.ok) {
    throw new Error('Analisi della foto non riuscita')
  }

  return res.json()
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result // "data:image/jpeg;base64,...."
      const [header, base64] = result.split(',')
      const mediaType = header.match(/data:(.*);base64/)?.[1] || file.type || 'image/jpeg'
      resolve({ base64, mediaType })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
