import { useEffect, useState } from 'react'

const URL = import.meta.env.VITE_API_URL || '/registros.json'

// Aceita tanto objetos {ts, tipo, ...} (ideal para a API) quanto o formato compacto em array
const normaliza = (r) =>
  Array.isArray(r)
    ? { ts: r[0], tipo: r[1], turno: r[2], status: r[3], temp: r[4], vib: r[5], rot: r[6], cor: r[7], horas: r[8], diasManut: r[9], efic: r[10], conf: r[11] }
    : r

export function useRegistros() {
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    fetch(URL, { signal: ac.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then((rows) => setDados(rows.map(normaliza).sort((a, b) => a.ts - b.ts)))
      .catch((e) => { if (e.name !== 'AbortError') setErro(e.message) })
      .finally(() => setCarregando(false))
    return () => ac.abort()
  }, [])

  return { dados, carregando, erro }
}
