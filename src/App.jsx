import './App.css'
import ElectricLogo from './components/ElectricLogo'
import GlowCursor from './components/GlowCursor';

const legalPages = {
  '/impressum': {
    title: 'Impressum',
    sections: [
      {
        title: 'Angaben zum Anbieter',
        text: 'Mustername / Gregor in der Kuppel, Musterstraße 1, 20095 Hamburg. Dies ist ein Platzhalter und muss vor einer Veröffentlichung durch die vollständigen Angaben des verantwortlichen Anbieters ersetzt werden.',
      },
      {
        title: 'Kontakt',
        text: 'E-Mail: beispiel@example.com. Auch diese Kontaktdaten sind Platzhalter.',
      },
      {
        title: 'Inhaltlich verantwortlich',
        text: 'Mustername, Musterstraße 1, 20095 Hamburg. Bitte hier die tatsächlich verantwortliche Person und Anschrift eintragen.',
      },
    ],
  },
  '/datenschutz': {
    title: 'Datenschutz',
    sections: [
      {
        title: 'Allgemeine Hinweise',
        text: 'Der Schutz personenbezogener Daten ist wichtig. Dieser Beispieltext dient nur als Platzhalter und beschreibt keine tatsächlich geprüfte Datenverarbeitung.',
      },
      {
        title: 'Verantwortliche Stelle',
        text: 'Mustername, Musterstraße 1, 20095 Hamburg, beispiel@example.com. Bitte durch die vollständigen Kontaktdaten der verantwortlichen Stelle ersetzen.',
      },
      {
        title: 'Verarbeitung und Rechte',
        text: 'Beim Besuch einer Website können technische Daten verarbeitet werden. Welche Daten dies betrifft, zu welchem Zweck und welche Rechte betroffene Personen haben, muss für den tatsächlichen Betrieb dieser Website individuell ergänzt und rechtlich geprüft werden.',
      },
    ],
  },
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const legalPage = legalPages[path]

  return (
    <GlowCursor
      className="page-glow-cursor"
      color="#dbcb98"
      intensity={0.2}
      trailWidth={0.2}
      linger={0.3}
      glow={0.2}
      clickBurst
      theme="dark"
    >
      <div className="site-shell" id="top">
        <header className="site-header">
          <a className="site-wordmark" href="/#top">
            Gregor in der Kuppel
          </a>
          <p>Est. 2023</p>
          <nav className="site-menu" aria-label="Hauptnavigation">
            <a href="/#video">Video</a>
            <a href="/#biografie">Biografie</a>
            <a href="/#termine">Termine</a>
            <a
              href="https://www.instagram.com/gregorinderkuppel/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </header>

        {legalPage ? (
          <main className="content-section legal-page">
            <div className="section-inner">
              <h1 className="section-title">{legalPage.title}</h1>
              {legalPage.sections.map(section => (
                <section className="legal-copy" key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </section>
              ))}
            </div>
          </main>
        ) : (
          <main>
            <section className="hero" aria-label="Gregor in der Kuppel – Logo">
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
          </main>
        )}

        <footer className="site-footer">
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </footer>
      </div>
    </GlowCursor>
  )
}

export default App