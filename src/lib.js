export const TIPOS = ['Elevador Eletromecânico', 'Elevador Hidráulico', 'Elevador Tesoura']
export const TURNOS = ['Manhã', 'Tarde', 'Noite']
export const NM = ['normal', 'atenção', 'crítico']
export const BC = ['success', 'warning', 'danger']
export const CICLO = 90
export const LIM = {
  temp: { n: 'Temperatura', u: '°C', w: 75, c: 90 },
  vib: { n: 'Vibração', u: 'mm/s', w: 3.5, c: 4.5 },
  rot: { n: 'Rotação', u: 'rpm', w: 1700, c: 1780 },
  cor: { n: 'Corrente elétrica', u: 'A', w: 18, c: 21 },
}
// [rótulo, janela em segundos, tamanho do bucket do gráfico em segundos]
export const PER = {
  dia: ['Últimas 24h', 86400, 900],
  sem: ['7 dias', 604800, 3600],
  tudo: ['Todo o período', 1e12, 86400],
}

export const pad = (n) => String(n).padStart(2, '0')
export const f = (v, d = 1) => v.toFixed(d).replace('.', ',')
export const cap = (s) => s[0].toUpperCase() + s.slice(1)
export const num = (n) => n.toLocaleString('pt-BR')
export const avg = (a, k) => (a.length ? a.reduce((s, r) => s + r[k], 0) / a.length : 0)
export const dt = (ts) => { const d = new Date(ts * 1000); return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}` }
export const hm = (ts) => { const d = new Date(ts * 1000); return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}` }
export const lvl = (m, v) => (v >= LIM[m].c ? 2 : v >= LIM[m].w ? 1 : 0)
