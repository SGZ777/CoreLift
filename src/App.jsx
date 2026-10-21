import { useEffect, useMemo, useState } from 'react'
import { useRegistros } from './hooks/useRegistros'
import { LIM, PER, TIPOS, avg, dt, f, hm } from './lib'
import Sidebar from './components/Sidebar'
import Chart from './components/Chart'
import { Alertas, Indicadores, Kpis, TiposLista } from './components/Panels'

const Card = ({ titulo, children, className = '' }) => (
  <div className={`card h-100 shadow-sm ${className}`}><div className="card-body"><h2 className="h6 fw-bold mb-3">{titulo}</h2>{children}</div></div>
)

export default function App() {
  const { dados, carregando, erro } = useRegistros()
  const [per, setPer] = useState('tudo')
  const [tur, setTur] = useState(-1)
  const [tipo, setTipo] = useState(-1)
  const [met, setMet] = useState('temp')
  const [tema, setTema] = useState(() => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  useEffect(() => { document.documentElement.dataset.bsTheme = tema }, [tema])
  const alternaTema = () => setTema(t => (t === 'dark' ? 'light' : 'dark'))

  const end = dados.length ? dados[dados.length - 1].ts : 0
  const base = useMemo(() => dados.filter(r => r.ts > end - PER[per][1] && (tur < 0 || r.turno === tur)), [dados, end, per, tur])
  const R = useMemo(() => (tipo < 0 ? base : base.filter(r => r.tipo === tipo)), [base, tipo])
  const bs = PER[per][2]

  return (
    <>
      <nav className="navbar bg-dark sticky-top d-lg-none px-3" data-bs-theme="dark">
        <button className="btn btn-outline-light btn-sm" data-bs-toggle="offcanvas" data-bs-target="#side" aria-controls="side" aria-label="Abrir menu"><i className="bi bi-list fs-5" /></button>
        <img src="/CoreLift.png" alt="CoreLift" className="img-fluid" style={{ maxHeight: 32 }} />
        <button className="btn btn-outline-light btn-sm" onClick={alternaTema} aria-label="Alternar tema"><i className="bi bi-circle-half" /></button>
      </nav>

      <div className="d-lg-flex">
        <Sidebar />
        <main className="flex-grow-1 min-w-0 p-3 p-lg-4">
          <header className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
              <h1 className="h3 fw-bold mb-0">Dashboard</h1>
              <p className="text-secondary mb-0">Visão geral da oficina{end > 0 && ` · último registro em ${dt(end)} às ${hm(end)}`}</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {end > 0 && <span className="badge text-bg-light border fw-medium py-2 px-3">Dados de {dt(dados[0].ts)} a {dt(end)}/{new Date(end * 1000).getUTCFullYear()}</span>}
              <button className="btn btn-outline-secondary btn-sm d-none d-lg-inline-flex" onClick={alternaTema} aria-label="Alternar tema"><i className="bi bi-circle-half" /></button>
            </div>
          </header>

          {carregando && <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando…</span></div></div>}
          {erro && <div className="alert alert-danger">Não foi possível carregar os registros ({erro}).</div>}
          {!carregando && !erro && !dados.length && <div className="alert alert-warning">Nenhum registro encontrado.</div>}

          {dados.length > 0 && (
            <>
              <div className="row g-2 mb-3">
                <div className="col-12 col-md-auto">
                  <div className="btn-group w-100" role="group" aria-label="Período">
                    {Object.keys(PER).map(k => (
                      <button key={k} type="button" className={`btn btn-sm ${k === per ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setPer(k)}>{PER[k][0]}</button>
                    ))}
                  </div>
                </div>
                <div className="col-12 col-md-auto">
                  <div className="btn-group w-100" role="group" aria-label="Turno">
                    {['Todos', 'Manhã', 'Tarde', 'Noite'].map((t, i) => (
                      <button key={t} type="button" className={`btn btn-sm ${i - 1 === tur ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTur(i - 1)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="col-12 col-md-auto">
                  <select className="form-select" value={tipo} onChange={e => setTipo(+e.target.value)} aria-label="Tipo de equipamento">
                    <option value={-1}>Todos os tipos</option>
                    {TIPOS.map((t, i) => <option key={t} value={i}>{t}</option>)}
                  </select>
                </div>
              </div>

              <Kpis R={R} />

              <section className="row g-3 mb-3">
                <div className="col-12 col-xl-8">
                  <div className="card h-100 shadow-sm"><div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-1 mb-2">
                      <h2 className="h6 fw-bold mb-0">Monitoramento operacional</h2>
                      <small className="text-secondary">{bs === 900 ? 'Leituras a cada 15 min' : bs === 3600 ? 'Média por hora' : 'Média por dia'}</small>
                    </div>
                    <div className="d-flex gap-2 mb-2 metric-tabs pb-1">
                      {Object.keys(LIM).map(k => (
                        <button key={k} type="button" className={`btn btn-sm rounded-pill ${k === met ? 'btn-outline-primary active fw-semibold' : 'btn-outline-secondary'}`} onClick={() => setMet(k)}>{LIM[k].n} ({LIM[k].u})</button>
                      ))}
                    </div>
                    <Chart R={R} met={met} per={per} />
                    <div className="d-flex flex-wrap column-gap-4 row-gap-1 small text-secondary mt-2">
                      {Object.keys(LIM).map(k => <span key={k}>{LIM[k].n} média: <b className="text-body">{f(avg(R, k), k === 'rot' ? 0 : 1)} {LIM[k].u}</b></span>)}
                    </div>
                  </div></div>
                </div>
                <div className="col-12 col-xl-4"><Card titulo="Status por tipo de elevador"><TiposLista base={base} tipo={tipo} onSelect={t => setTipo(tipo === t ? -1 : t)} /></Card></div>
              </section>

              <section className="row g-3">
                <div className="col-12 col-xl-7"><Card titulo="Alertas ativos"><Alertas R={R} /></Card></div>
                <div className="col-12 col-xl-5"><Card titulo="Indicadores e manutenção"><Indicadores R={R} /></Card></div>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  )
}
