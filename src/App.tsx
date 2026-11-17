// Página principal: identidad, formulario y seguimiento independiente.
import FormularioIncidencia from './components/FormularioIncidencia'
import ListadoIncidencias from './components/ListadoIncidencias'
import logo from './assets/biometria-aplicada.png'
import './App.css'
function App() {
  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <header className="cabecera">
        <div className="cabecera-interior">
          <img className="logo" src={logo} alt="Biometría Aplicada" width="800" height="452" />
          <nav aria-label="Navegación principal"><a href="#nueva-incidencia">Nueva solicitud</a><a href="#solicitudes">Ver solicitudes <span aria-hidden="true">↗</span></a></nav>
        </div>
      </header>
      <main id="contenido">
        <section className="presentacion" aria-labelledby="titulo-principal">
          <div><p className="eyebrow">CENTRO DE SOPORTE · BIOMETRÍA APLICADA</p>
            <h1>Tu acceso importa.<br /><span>Te ayudamos a seguir.</span></h1>
            <p className="bajada">Reporta problemas de acceso, asistencia o equipos de tu empresa desde un solo lugar.</p>
          </div>
          <aside className="guia" aria-label="Cómo funciona el soporte">
            <p className="eyebrow">EN TRES PASOS</p>
            <ol><li><span>01</span> Describe el problema</li><li><span>02</span> Envía tu solicitud</li><li><span>03</span> Consulta el registro</li></ol>
          </aside>
        </section>
        <p className="nota-demo"><strong>Demostración académica.</strong> Usa datos ficticios. Este listado es compartido y no corresponde al soporte oficial.</p>
        <div className="contenido-grid"><FormularioIncidencia /><ListadoIncidencias /></div>
      </main>
      <footer><span>Biometría Aplicada · Prototipo de soporte</span><span>PWIC · M4 Full Contact Forms</span></footer>
    </>
  )
}
export default App

