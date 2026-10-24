const ITENS = [
  ['bi-grid-1x2', 'Dashboard'], ['bi-wrench-adjustable', 'Manutenções'] , ['bi bi-person-circle me-2', 'Usuário'],
]

export default function Sidebar() {
  return (
    <aside id="side" className="sidebar offcanvas-lg offcanvas-start text-bg-dark" tabIndex={-1} data-bs-theme="dark" aria-label="Menu principal">
      <div className="offcanvas-header d-lg-none">
        <span className="fw-bold fs-5">Core<span className="text-primary">Lift</span></span>
        <button className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#side" aria-label="Fechar" />
      </div>
      <div className="offcanvas-body flex-column p-3">
        <div className="text-center mb-4 d-none d-lg-block">
           <img src="/CoreLift.png" alt="CoreLift" className="img-fluid" />
        </div>
        <ul className="nav nav-pills flex-column gap-1 list-unstyled">
          {ITENS.map(([ic, t], i) => (
            <li key={t}><a className={'nav-link' + (i === 0 ? ' active' : '')} href="#"><i className={`bi ${ic} me-2`} />{t}</a></li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
