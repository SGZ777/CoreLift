import { useEffect, useState } from 'react'
import { TIPOS, NM } from '../lib'

const BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')
const URL_REGISTROS = import.meta.env.VITE_API_URL === '' ? '/registros.json' : `${BASE}/registros`

const semAcento = (s = '') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const TURNO = { manha: 0, tarde: 1, noite: 2 }
const TIPO_IDX = Object.fromEntries(TIPOS.map((t, i) => [semAcento(t), i]))

// regDataHora (LocalDateTime sem fuso) -> segundos "UTC", que é o que o dashboard espera (usa getUTC*)
const paraTs = (v) => {
  if (Array.isArray(v)) { const [y, mo, d, h = 0, mi = 0, s = 0] = v; return Date.UTC(y, mo - 1, d, h, mi, s) / 1000 }
  if (typeof v === 'number') return v
  return Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(v) ? v : v + 'Z') / 1000
}

const idxStatus = (s) => {
  const nome = semAcento(s?.stSeveridade)
  const i = NM.findIndex(n => semAcento(n) === nome)
  if (i >= 0) return i
  if (nome.startsWith('crit')) return 2
  if (nome.startsWith('aten')) return 1
  if (nome.startsWith('norm')) return 0
  return Math.min(Math.max((s?.idStatus ?? 1) - 1, 0), 2) // fallback: id 1,2,3 -> 0,1,2
}

const idxTipo = (t) => {
  const i = TIPO_IDX[semAcento(t?.nomeTipo)]
  return i ?? Math.min(Math.max((t?.idTipo ?? 1) - 1, 0), TIPOS.length - 1)
}

// Aceita: array compacto (JSON local), objeto já normalizado ({ts,...}) ou a entidade Registro da API (reg*)
export const normaliza = (r) => {
  if (Array.isArray(r)) {
    return { ts: r[0], tipo: r[1], turno: r[2], status: r[3], temp: r[4], vib: r[5], rot: r[6], cor: r[7], horas: r[8], diasManut: r[9], efic: r[10], conf: r[11] }
  }
  if (r.regId === undefined) return r
  return {
    id: r.regId,
    ts: paraTs(r.regDataHora),
    tipo: idxTipo(r.regTipo),
    turno: TURNO[semAcento(r.regTurno)] ?? 0,
    status: idxStatus(r.regStatus),
    temp: Number(r.regTemperatura),
    vib: Number(r.regVibracao),
    rot: Number(r.regRotacao),
    cor: Number(r.regCorrente),
    horas: Number(r.regHorasOperacao),
    diasManut: Number(r.regDiasUltimaManutencao),
    efic: Number(r.regEficiencia),
    conf: Number(r.regConformidade),
  }
}

export function useRegistros() {
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    fetch(URL_REGISTROS, { signal: ac.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(rows => setDados(rows.map(normaliza).filter(r => Number.isFinite(r.ts)).sort((a, b) => a.ts - b.ts)))
      .catch(e => { if (e.name !== 'AbortError') setErro(e.message) })
      .finally(() => setCarregando(false))
    return () => ac.abort()
  }, [])

  return { dados, carregando, erro }
}