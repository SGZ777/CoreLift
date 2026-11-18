import { useMemo, useState } from 'react'
import { TIPOS, dt, hm } from '../lib'

function Manutencoes({ dados, servicos, onSolicitar, onConsertado }) {
  const elevadores = useMemo(() => TIPOS.map((nome, tipo) => {
    const ultimo = dados.reduce((maisRecente, item) => item.tipo === tipo && (!maisRecente || item.ts > maisRecente.ts) ? item : maisRecente, null)
    const servico = servicos[tipo] || {}
    const alertaAtual = ultimo?.status === 2 && ultimo.ts * 1000 > (servico.resolvidoEm || 0)
    return alertaAtual ? { tipo, nome, registro: ultimo, solicitado: (servico.solicitadoEm || 0) > (servico.resolvidoEm || 0) } : null
  }).filter(Boolean), [dados, servicos])

  return (
    <>
      <header className="mb-4"><h1 className="h3 fw-bold mb-1">Manutenções</h1><p className="text-secondary mb-0">Elevadores com alerta crítico que precisam de manutenção.</p></header>
      <section className="card shadow-sm"><div className="card-body">
        <h2 className="h6 fw-bold mb-3">Alertas críticos ativos</h2>
        {!elevadores.length ? <div className="text-center py-5"><div className="ic bg-success mx-auto mb-3"><i className="bi bi-check2" /></div><h3 className="h6 fw-bold">Nenhuma manutenção pendente</h3><p className="text-secondary small mb-0">Elevadores com alerta crítico aparecerão aqui.</p></div> : <div className="table-responsive"><table className="table align-middle mb-0">
          <thead><tr><th>Elevador</th><th>Alerta detectado</th><th>Solicitação</th><th className="text-end">Ação</th></tr></thead>
          <tbody>{elevadores.map(item => <tr key={item.tipo}>
            <td className="fw-semibold">{item.nome}</td>
            <td><span className="badge text-bg-danger">Crítico</span><div className="small text-secondary mt-1">{dt(item.registro.ts)} às {hm(item.registro.ts)}</div></td>
            <td>{item.solicitado ? <span className="badge text-bg-warning">Manutenção solicitada</span> : <span className="text-secondary">Não solicitada</span>}</td>
            <td className="text-end">{item.solicitado ? <button className="btn btn-sm btn-success text-nowrap" type="button" onClick={() => onConsertado(item.tipo)}><i className="bi bi-check2 me-1" />Marcar como consertado</button> : <button className="btn btn-sm btn-outline-primary text-nowrap" type="button" onClick={() => onSolicitar(item.tipo)}><i className="bi bi-wrench-adjustable me-1" />Solicitar manutenção</button>}</td>
          </tr>)}</tbody>
        </table></div>}
      </div></section>
    </>
  )
}

function Usuario() {
  const [perfil, setPerfil] = useState(() => {
    try { return { nome: 'Usuário CoreLift', email: '', ...(JSON.parse(localStorage.getItem('corelift-perfil') || '{}')) } } catch { return { nome: 'Usuário CoreLift', email: '' } }
  })
  const [salvo, setSalvo] = useState(false)
  const salvar = event => {
    event.preventDefault()
    localStorage.setItem('corelift-perfil', JSON.stringify(perfil))
    setSalvo(true)
    window.setTimeout(() => setSalvo(false), 2500)
  }

  return (
    <>
      <header className="mb-4"><h1 className="h3 fw-bold mb-1">Usuário</h1><p className="text-secondary mb-0">Gerencie as informações do seu perfil.</p></header>
      <div className="row g-3">
        <div className="col-12 col-xl-4"><section className="card shadow-sm h-100"><div className="card-body text-center py-4">
          <div className="profile-avatar mx-auto mb-3"><i className="bi bi-person-fill" /></div><h2 className="h5 fw-bold mb-1">{perfil.nome || 'Seu nome'}</h2><p className="text-secondary mb-3">{perfil.email || 'E-mail não informado'}</p><span className="badge text-bg-primary">Perfil de acesso</span>
        </div></section></div>
        <div className="col-12 col-xl-8"><section className="card shadow-sm"><div className="card-body p-4">
          <h2 className="h6 fw-bold mb-1">Informações pessoais</h2><p className="small text-secondary mb-4">Atualize os dados exibidos no seu perfil.</p>
          <form onSubmit={salvar}>
            <div className="mb-3"><label className="form-label" htmlFor="nomeUsuario">Nome</label><input className="form-control" id="nomeUsuario" value={perfil.nome} onChange={e => setPerfil({ ...perfil, nome: e.target.value })} required /></div>
            <div className="mb-4"><label className="form-label" htmlFor="emailUsuario">E-mail</label><input className="form-control" id="emailUsuario" type="email" placeholder="voce@exemplo.com" value={perfil.email} onChange={e => setPerfil({ ...perfil, email: e.target.value })} /></div>
            <div className="d-flex align-items-center gap-3"><button className="btn btn-primary" type="submit">Salvar alterações</button>{salvo && <span className="small text-success"><i className="bi bi-check-circle me-1" />Perfil salvo</span>}</div>
          </form>
          <p className="small text-secondary border-top pt-3 mt-4 mb-0">As alterações ficam salvas somente neste navegador.</p>
        </div></section></div>
      </div>
    </>
  )
}

export default function Pages({ pagina, dados, servicos, onSolicitar, onConsertado }) {
  if (pagina === 'Manutenções') return <Manutencoes dados={dados} servicos={servicos} onSolicitar={onSolicitar} onConsertado={onConsertado} />
  if (pagina === 'Usuário') return <Usuario />
  return null
}
