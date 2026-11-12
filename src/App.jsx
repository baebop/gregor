import { useState } from 'react'
import './App.css'
import ElectricLogo from './components/ElectricLogo'
import GlowCursor from './components/GlowCursor';


function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <GlowCursor
      className="page-glow-cursor"
      color="#dbcb98"
      intensity={0.8}
      trailWidth={1}
      linger={0.8}
      glow={0.2}
      clickBurst
      theme="dark"
    >
      <div className="site-shell">
        <header className="site-header">
          <a className="site-wordmark" href="#logo" onClick={() => setMenuOpen(false)}>
            Gregor in der Kuppel
          </a>
          <p>Est. 2023</p>
          <button
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            type="button"
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
            <span />
          </button>
          {menuOpen && (
            <nav className="site-menu" id="site-menu" aria-label="Hauptnavigation">
              <a href="#logo" onClick={() => setMenuOpen(false)}>Logo</a>
              <a href="#video" onClick={() => setMenuOpen(false)}>Video</a>
              <a href="#biografie" onClick={() => setMenuOpen(false)}>Biografie</a>
              <a href="#termine" onClick={() => setMenuOpen(false)}>Termine</a>
              <a
                href="https://www.instagram.com/sternstundenfestival/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                Instagram <span aria-hidden="true">↗</span>
              </a>
            </nav>
          )}
        </header>

        <section id="logo" className="hero" aria-label="Gregor in der Kuppel – Logo">
          <ElectricLogo
            src="/logo.svg"
            color="#f97316"
            glowColor="#eab308"
            scale={0.65}
            strands={1}
            bend={0.6}
            crackle={0.9}
            arcs={1.15}
            speed={1.45}
            interactive
            intensity={1.25}
            glow={0.6}
            thickness={1.6}
            flicker={0.35}
            fill={0}
            cursorIntensity={0.7}
            cursorRadius={100}
          />
        </section>

        <section id="video" className="content-section video-section" aria-labelledby="video-title">
          <div className="section-inner">
            <h2 className="section-title" id="video-title">Video</h2>
            <div className="video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/XGiNFSrd4oA?si=NTvr_Y7HMB3X5IxF"
                title="Gregor in der Kuppel – Sternstunden Festival Aftermovie 2025"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section id="biografie" className="content-section biography-section" aria-labelledby="biography-title">
          <div className="section-inner">
            <h2 className="section-title" id="biography-title">Biografie</h2>
            <div className="biography-copy">
              <p>
                Die Gregors sind ein Männergesangsensemble, das sich 2023 anlässlich des Sternstunden Festivals in Hamburg zusammenfand. Sechs Sänger,
                die eigentlich aus ganz unterschiedlichen musikalischen Welten kommen – vom Chorleiter über den Jazzvokalisten bis zum Liedgestalter –,
                verbindet die Lust daran, mit männlichen Stimmen Räume zu erobern, die ihnen traditionell verschlossen scheinen: die Höhe, die Farben,
                das Zwielicht zwischen den Stimmlagen.
              </p>
              <p>
                Ihr Repertoire reicht von der Renaissance bis zur Romantik, von Gesualdo über Schuberts Liedertafel-Kultur bis zu zeitgenössischen Sätzen
                und eigenen Aussetzungen. Immer geht es darum, die sechsstimmigen Texturen nicht als Verdopplung zu begreifen, sondern als
                feingesponnenes Gewebe, in dem jeder Mann seinen Platz findet – gleich ob im strahlenden Falsett, im dunklen Bassfundament oder
                dazwischen.
              </p>
              <p>
                Für „Gregor in der Kuppel“ machen sich die sechs die einzigartige Akustik des Kuppelraums zunutze: keine schallabsorbierende Bestuhlung,
                keine Bühne zwischen Sängern und Zuhörern, sondern Stimmen, die sich unter dem Gewölbe sammeln, verteilen und gleichzeitig nah und
                raumgreifend wirken. Das Programm folgt dem Bogen vom Abendlied über Mysterium bis zum augenzwinkernden Ausklang – geschrieben und
                erkoren für einen Abend, an dem man sich in Klang hüllen kann.
              </p>
              <p className="biography-signoff">Kein Verstärker. Kein Instrument. Nur sechs Männerstimmen und eine Kuppel.</p>
            </div>
          </div>
        </section>

        <section id="termine" className="content-section dates-section" aria-labelledby="dates-title">
          <div className="section-inner">
            <h2 className="section-title" id="dates-title">Termine</h2>
            <article className="date-card">
              <time className="date-time" dateTime="2027-07-16">16. Juli 2027</time>
              <h3>Sternstunden Festival</h3>
            </article>
          </div>
        </section>
      </div>
    </GlowCursor>
  )
}

export default App