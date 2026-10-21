import { BC, CICLO, LIM, NM, TIPOS, TURNOS, avg, cap, dt, f, hm, lvl, num } from '../lib'

export const Badge = ({ l }) => (
  <span className={`badge rounded-pill bg-${BC[l]}-subtle text-${BC[l]}-emphasis border border-${BC[l]}-subtle`}>{cap(NM[l])}</span>
)

export function Kpis({ R }) {
  const c = [0, 1, 2].map(l => R.filter(r => r.status === l).length), n = R.length || 1
  const K = [
    ['Registros no período', R.length, 'Leituras analisadas', 'primary', 'bi-clipboard-data'],
    ['Normais', c[0], Math.round((c[0] / n) * 100) + '% do total', 'success', 'bi-check-lg'],
    ['Em atenção', c[1], Math.round((c[1] / n) * 100) + '% · requerem atenção', 'warning', 'bi-exclamation-lg'],
    ['Críticos', c[2], Math.round((c[2] / n) * 100) + '% · ação imediata', 'danger', 'bi-x-octagon'],
  ]
  return (
    <section className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-3">
      {K.map(k => (
        <div className="col" key={k[0]}>
          <div className="card h-100 shadow-sm"><div className="card-body d-flex align-items-center gap-3">
            <div className="ic" style={{ background: `var(--bs-${k[3]})` }}><i className={`bi ${k[4]}`} /></div>
            <div className="min-w-0">
              <div className="small text-secondary">{k[0]}</div>
              <div className="fs-2 fw-bold lh-1">{num(k[1])}</div>
              <div className="small text-secondary">{k[2]}</div>
            </div>
          </div></div>
        </div>
      ))}
    </section>
  )
}

export function TiposLista({ base, tipo, onSelect }) {
  return (
    <div className="list">
      {TIPOS.map((tp, i) => {
        const a = base.filter(r => r.tipo === i), n = a.length || 1
        const c = [0, 1, 2].map(l => a.filter(r => r.status === l).length)
        const worst = c[2] / n > 0.12 ? 2 : c[1] / n > 0.25 ? 1 : 0
        return (
          <div key={tp} className={'tp-item p-2 mb-1' + (i === tipo ? ' sel' : '')} role="button" tabIndex={0} aria-pressed={i === tipo}
            onClick={() => onSelect(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(i) } }}>
            <div className="d-flex justify-content-between align-items-start gap-2">
              <div className="min-w-0">
                <div className="fw-semibold">{tp}</div>
                <small className="text-secondary">{num(a.length)} registros · eficiência {f(avg(a, 'efic'))}%</small>
              </div>
              <Badge l={worst} />
            </div>
            <div className="stk mt-2">{c.map((x, l) => <i key={l} style={{ width: `${(x / n) * 100}%`, background: `var(--bs-${BC[l]})` }} />)}</div>
          </div>
        )
      })}
      <p className="small text-secondary mt-3 mb-0">Barra: normal, atenção e crítico. Clique para filtrar o tipo.</p>
    </div>
  )
}

export function Alertas({ R }) {
  const A = R.filter(r => r.status > 0).sort((a, b) => b.status - a.status || b.ts - a.ts).slice(0, 6)
  if (!A.length) return <div className="text-secondary py-3">Nenhum alerta neste filtro.</div>
  return (
    <>
      {A.map(r => {
        const [m, nv] = Object.keys(LIM).map(k => [k, lvl(k, r[k])]).sort((a, b) => b[1] - a[1])[0]
        const tx = nv
          ? `${LIM[m].n} ${nv === 2 ? 'acima do limite' : 'próxima do limite'} (${f(r[m], m === 'rot' ? 0 : 1)} ${LIM[m].u})`
          : `Status ${NM[r.status]} registrado no turno da ${TURNOS[r.turno].toLowerCase()}`
        return (
          <div key={`${r.ts}-${r.tipo}`} className="d-flex align-items-center gap-2 gap-sm-3 py-2 border-bottom">
            <div className="ic sm" style={{ background: `var(--bs-${BC[r.status]})` }}><i className="bi bi-exclamation-lg" /></div>
            <div className="flex-grow-1 min-w-0"><div><b>{TIPOS[r.tipo]}</b></div><div className="small text-secondary">{tx}</div></div>
            <div className="text-end flex-shrink-0"><div className="small text-secondary mb-1">{dt(r.ts)} {hm(r.ts)}</div><Badge l={r.status} /></div>
          </div>
        )
      })}
    </>
  )
}

const Barra = ({ t, v, w, c }) => (
  <>
    <div className="d-flex justify-content-between gap-3"><b>{t}</b><span className="text-secondary">{v}</span></div>
    <div className="progress mt-1 mb-3" style={{ height: 7 }}><div className={`progress-bar bg-${c}`} style={{ width: `${w}%` }} /></div>
  </>
)

export function Indicadores({ R }) {
  const ef = avg(R, 'efic'), cf = avg(R, 'conf'), old = R.length ? (R.filter(r => r.diasManut > CICLO).length / R.length) * 100 : 0
  return (
    <>
      <Barra t="Eficiência operacional média" v={f(ef) + '%'} w={ef} c="primary" />
      <Barra t="Conformidade média" v={f(cf) + '%'} w={cf} c="success" />
      <Barra t={`Registros com manutenção vencida (>${CICLO} dias)`} v={f(old, 0) + '%'} w={old} c={old > 50 ? 'danger' : 'warning'} />
      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0">
          <thead><tr><th>Tipo</th><th className="text-end">Dias s/ manutenção</th><th className="text-end">Horas de operação</th></tr></thead>
          <tbody>
            {TIPOS.map((tp, i) => {
              const a = R.filter(r => r.tipo === i)
              return <tr key={tp}><td>{tp}</td><td className="text-end">{f(avg(a, 'diasManut'), 0)}</td><td className="text-end">{num(Math.round(avg(a, 'horas')))} h</td></tr>
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
