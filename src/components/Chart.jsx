import { useEffect, useMemo, useRef, useState } from 'react'
import { LIM, PER, avg, dt, f, hm, pad } from '../lib'

export default function Chart({ R, met, per }) {
  const ref = useRef(null)
  const [W, setW] = useState(600)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.floor(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const L = LIM[met], bs = PER[per][2]
  const P = useMemo(() => {
    const B = new Map()
    R.forEach(r => { const k = Math.floor(r.ts / bs); (B.get(k) ?? B.set(k, []).get(k)).push(r) })
    return [...B.entries()].sort((a, b) => a[0] - b[0]).map(([k, a]) => ({ ts: k * bs, v: avg(a, met) }))
  }, [R, met, bs])

  const sm = W < 480, H = sm ? 210 : 270, l = sm ? 40 : 46, r = 12, t = 12, b = 26
  const v = P.map(p => p.v)
  const lo = Math.min(...v, L.w) * 0.9, hi = Math.max(...v, L.c) * 1.04
  const X = (i) => l + (i * (W - l - r)) / Math.max(P.length - 1, 1)
  const Y = (y) => t + ((hi - y) * (H - t - b)) / (hi - lo)
  const step = Math.ceil(P.length / (sm ? 4 : 7))
  const pts = v.map((y, i) => `${X(i)},${Y(y)}`).join(' ')
  const rotulo = (ts) => (bs === 86400 ? dt(ts) : bs === 3600 ? `${dt(ts)} ${pad(new Date(ts * 1000).getUTCHours())}h` : hm(ts))
  const limite = (y, c, tx) => (
    <>
      <line x1={l} x2={W - r} y1={Y(y)} y2={Y(y)} stroke={c} strokeDasharray="5 4" />
      <text x={W - r} y={Y(y) - 4} textAnchor="end" fontSize="11" fill={c}>{tx}</text>
    </>
  )

  return (
    <div ref={ref}>
      {!P.length ? <div className="text-secondary py-3">Sem registros para este filtro.</div> : (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="d-block" role="img" aria-label={`${L.n} ao longo do tempo`}>
          {[0, 1, 2, 3, 4].map(i => {
            const y = lo + ((hi - lo) * i) / 4
            return (
              <g key={i}>
                <line x1={l} x2={W - r} y1={Y(y)} y2={Y(y)} stroke="var(--bs-border-color)" />
                <text x={l - 6} y={Y(y) + 4} textAnchor="end" fontSize="11" fill="var(--bs-secondary-color)">{f(y, met === 'rot' ? 0 : 1)}</text>
              </g>
            )
          })}
          {P.map((p, i) => i % step === 0 && (
            <text key={p.ts} x={X(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--bs-secondary-color)">{rotulo(p.ts)}</text>
          ))}
          {limite(L.w, 'var(--bs-warning)', 'atenção ' + L.w)}
          {limite(L.c, 'var(--bs-danger)', 'crítico ' + L.c)}
          <polygon points={`${l},${H - b} ${pts} ${X(v.length - 1)},${H - b}`} fill="var(--bs-primary)" opacity=".1" />
          <polyline points={pts} fill="none" stroke="var(--bs-primary)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}
