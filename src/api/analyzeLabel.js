// Invia la foto dell'etichetta alla funzione serverless /api/analyze-label
// e restituisce i valori nutrizionali strutturati letti da Claude.
//
// La foto viene prima ridimensionata/compressa nel browser: le foto scattate
// con la fotocamera del telefono sono spesso troppo pesanti (3-5 MB) e in
// base64 superano il limite di payload delle funzioni serverless Vercel.

export async function analyzeLabelPhoto(file) {
  const { base64, mediaType } = await resizeAndEncode(file)

  const res = await fetch('/api/analyze-label', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64, mediaType }),
  })

  if (!res.ok) {
    let messaggio = `Errore ${res.status} dal server`
    try {
      const corpo = await res.json()
      const parti = [corpo.error, corpo.dettagli].filter(Boolean)
      if (parti.length > 0) messaggio = parti.join(' — ')
    } catch {
      // risposta non in formato JSON, ignora
    }
    throw new Error(messaggio)
  }

  return res.json()
}

function resizeAndEncode(file, maxDim = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)

      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      const [header, base64] = dataUrl.split(',')
      const mediaType = header.match(/data:(.*);base64/)?.[1] || 'image/jpeg'
      resolve({ base64, mediaType })
    }

    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }

    img.src = url
  })
}
