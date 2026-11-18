const ITENS = [
  ['bi-grid-1x2', 'Dashboard'],
  ['bi-wrench-adjustable', 'Manutenções'],
  ['bi-person-circle', 'Usuário'],
]

export default function Sidebar({ pagina, onNavigate }) {
  return (
    <aside id="side" className="sidebar offcanvas-lg offcanvas-start text-bg-dark" tabIndex={-1} data-bs-theme="dark" aria-label="Menu principal">
      <div className="offcanvas-header d-lg-none">
        <img src="/CoreLift.png" alt="CoreLift" style={{ maxHeight: "80%" }} className="img-fluid" />
        <button className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#side" aria-label="Fechar" />
      </div>
      <div className="offcanvas-body flex-column p-3">
        <div className="text-center mb-4 d-none d-lg-block">
          <img src="/CoreLift.png" alt="CoreLift" className="img-fluid" />
        </div>
        <ul className="nav nav-pills flex-column gap-1 list-unstyled">
          {ITENS.map(([ic, titulo]) => (
            <li key={titulo}><button type="button" className={'nav-link w-100 text-start' + (pagina === titulo ? ' active' : '')} onClick={() => onNavigate(titulo)}><i className={`bi ${ic} me-2`} />{titulo}</button></li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
