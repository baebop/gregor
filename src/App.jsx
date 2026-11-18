import { createElement, useEffect, useState } from 'react'
import './App.css'
import ElectricLogo from './components/ElectricLogo'
import GlowCursor from './components/GlowCursor';
import Masonry from './components/Masonry'
import privacyPolicyMarkup from './privacy-policy.html?raw'

const privacyPolicyTags = new Set(['a', 'br', 'h2', 'h3', 'li', 'p', 'strong', 'ul'])

const hidriveShareId = '4e7o7ti.47'
const hidriveApiUrl = 'https://my.hidrive.com/api'

async function fetchHiDriveImages(accessToken) {
  const files = []
  const pageSize = 500
  const fields = [
    'id',
    'members.category',
    'members.id',
    'members.image.height',
    'members.image.width',
    'members.mime_type',
    'members.mtime',
    'members.type',
  ].join(',')

  for (let offset = 0; ; ) {
    const params = new URLSearchParams({
      path: '/',
      fields,
      members: 'all',
      limit: `${offset},${pageSize}`,
      sort: 'none',
      access_token: accessToken,
    })
    const response = await fetch(`${hidriveApiUrl}/dir?${params}`)
    if (!response.ok) {
      throw new Error(`HiDrive directory request failed: ${response.status}`)
    }

    const data = await response.json()
    if (!Array.isArray(data.members)) {
      throw new Error('HiDrive returned an invalid directory listing')
    }

    if (data.members.length === 0) break
    files.push(...data.members)
    offset += data.members.length
  }

  return files
    .filter(file =>
      file.type === 'file'
      && (file.category === 'image' || file.mime_type?.startsWith('image/')),
    )
    .map(file => {
      const width = Number(file.image?.width) || 1000
      const height = Number(file.image?.height) || 1000
      const params = new URLSearchParams({
        pid: file.id,
        height: String(height),
        access_token: accessToken,
      })
      if (file.mtime) params.set('refresh_time', String(file.mtime))

      return {
        id: file.id,
        img: `${hidriveApiUrl}/file/thumbnail?${params}`,
        width,
        height,
      }
    })
}

function HiDriveGallery() {
  const [items, setItems] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isActive = true
    let refreshTimeout

    const refreshAccessToken = async () => {
      try {
        const response = await fetch('https://my.hidrive.com/api/share/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ id: hidriveShareId }),
        })
        if (!response.ok) {
          throw new Error(`HiDrive token request failed: ${response.status}`)
        }

        const tokenData = await response.json()
        if (
          typeof tokenData.access_token !== 'string'
          || !Number.isFinite(tokenData.expires_in)
          || tokenData.expires_in <= 0
        ) {
          throw new Error('HiDrive returned an invalid access token')
        }
        if (!isActive) return

        const nextItems = await fetchHiDriveImages(tokenData.access_token)
        if (!isActive) return

        setItems(nextItems)
        setHasError(false)
        refreshTimeout = window.setTimeout(
          refreshAccessToken,
          Math.max((tokenData.expires_in - 60) * 1000, 60_000),
        )
      } catch (error) {
        if (!isActive) return
        console.error('HiDrive gallery could not refresh its access token:', error)
        setHasError(true)
        refreshTimeout = window.setTimeout(refreshAccessToken, 60_000)
      }
    }

    refreshAccessToken()
    return () => {
      isActive = false
      window.clearTimeout(refreshTimeout)
    }
  }, [])

  if (!items) {
    return (
      <p role={hasError ? 'alert' : 'status'}>
        {hasError ? 'Die Galerie konnte nicht von HiDrive geladen werden.' : 'Galerie wird geladen …'}
      </p>
    )
  }

  if (items.length === 0) {
    return <p role="status">In diesem HiDrive-Ordner wurden keine Bilder gefunden.</p>
  }

  return (
    <>
      {hasError && <p role="alert">Die Verbindung zu HiDrive wurde unterbrochen.</p>}
      <Masonry
        items={items}
        columnWidth={240}
        gap={12}
        radius={12}
        columns="auto"
        hoverEffect="zoom"
        captions={false}
        lightbox
      />
    </>
  )
}

function renderPrivacyPolicyNode(node, key) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const element = node
  if (element.classList.contains('dsg-license-content-blurred')) {
    return null
  }

  const tagName = element.tagName.toLowerCase()
  if (tagName === 'br') {
    return createElement('br', { key })
  }

  const children = Array.from(element.childNodes).map((child, index) =>
    renderPrivacyPolicyNode(child, index),
  )

  if (tagName === 'h1') {
    return null
  }

  if (!privacyPolicyTags.has(tagName)) {
    return children
  }

  const props = {}
  if (tagName === 'h2' && /^[\w-]+$/.test(element.id)) {
    props.id = element.id
  }

  if (tagName === 'a') {
    const href = element.getAttribute('href')
    if (!href || !/^(https?:\/\/|mailto:|#[\w-]+)$/i.test(href)) {
      return children
    }

    props.href = href
    if (/^https?:\/\//i.test(href)) {
      props.target = '_blank'
      props.rel = 'noreferrer'
    }
  }

  return createElement(tagName, { ...props, key }, children)
}

function PrivacyPolicy() {
  const document = new DOMParser().parseFromString(privacyPolicyMarkup, 'text/html')
  const content = Array.from(document.body.childNodes).map((node, index) =>
    renderPrivacyPolicyNode(node, index),
  )

  return <div className="legal-copy privacy-policy">{content}</div>
}

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 240)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  if (!isVisible) {
    return null
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      className="back-to-top"
      type="button"
      aria-label="Zum Seitenanfang"
      onClick={scrollToTop}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5m-6 6 6-6 6 6" />
      </svg>
    </button>
  )
}

const legalPages = {
  '/impressum': {
    title: 'Impressum',
    sections: [
      {
        title: 'Angaben gemäß § 5 DDG',
        text: 'Jakob Timm / Gregor in der Kuppel, Heinrich-Barth-Str 10, 20146 Hamburg.',
      },
    
      {
        title: 'Kontakt',
        text: 'E-Mail: webmaster@gregorinderkuppel.de',
      },

      {
        title: 'Information gemäß § 36 VSBG',
        text: 'Gemäß § 36 VSBG (Verbraucherstreitbeilegungsgesetz - Gesetz über die alternative Streitbeilegung in Verbrauchersachen) erklärt der Betreiber dieser Website: Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Hinweis Die Plattform der EU zur außergerichtlichen Streitbeilegung finden Sie online unter https://ec.europa.eu/consumers/odr/',
      },
      {
        title: 'Wichtiger Hinweis',
        text: 'Wir sind stets bemüht, Ihnen auf dieser Website richtige und vollständige Informationen zur Verfügung zu stellen. Wir übernehmen keine Haftung oder Garantie für die Aktualität oder Vollständigkeit der bereitgestellten Informationen und sind nicht verantwortlich für die Inhalte der Seiten im Internet, auf die wir verweisen oder die mit einem Link von unserer Website erreichbar sind. Wir distanzieren uns von allen Inhalten außerhalb unseres eigenen Angebote',
      },
    ],
  },
  '/datenschutz': {
    title: 'Datenschutz',
    content: 'privacy-policy',
  },
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const legalPage = legalPages[path]

  return (
    <GlowCursor
      className="page-glow-cursor"
      color="#dbcb98"
      intensity={0.2}
      trailWidth={0.8}
      linger={0.8}
      glow={0.8}
      clickBurst
      theme="dark"
    >
      <div className="site-shell" id="top">
        <header className="site-header">
          <div className="site-brand">
            <a className="site-wordmark" href="/#top">
              Gregor in der Kuppel
            </a>
            <p>Est. 2023</p>
          </div>
          <button
            className={`menu-toggle${isMenuOpen ? ' is-open' : ''}`}
            type="button"
            aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen(open => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            className={`site-menu${isMenuOpen ? ' is-open' : ''}`}
            id="primary-navigation"
            aria-label="Hauptnavigation"
          >
            <a href="/#video" onClick={() => setIsMenuOpen(false)}>Video</a>
            <a href="/#biografie" onClick={() => setIsMenuOpen(false)}>Biografie</a>
            <a href="/#termine" onClick={() => setIsMenuOpen(false)}>Termine</a>
            <a href="/#repertoire" onClick={() => setIsMenuOpen(false)}>Repertoire</a>
            <a href="/#gallerie" onClick={() => setIsMenuOpen(false)}>Gallerie</a>
            <a
              href="https://www.instagram.com/gregorinderkuppel/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              Instagram <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </header>

        {legalPage ? (
          <main className="content-section legal-page">
            <div className="section-inner">
              <h1 className="section-title">{legalPage.title}</h1>
              {legalPage.content === 'privacy-policy' ? (
                <PrivacyPolicy />
              ) : (
                legalPage.sections.map(section => (
                  <section className="legal-copy" key={section.title}>
                    <h2>{section.title}</h2>
                    <p>{section.text}</p>
                  </section>
                ))
              )}
            </div>
          </main>
        ) : path !== '/' ? (
          <main className="content-section not-found-page">
            <div className="section-inner">
              <p className="not-found-code" aria-hidden="true">404</p>
              <h1 className="section-title">Seite nicht gefunden</h1>
              <p className="not-found-message">
                Diese Seite gibt es leider nicht oder sie wurde verschoben.
              </p>
              <a className="not-found-link" href="/">
                Zur Startseite
              </a>
            </div>
          </main>
        ) : (
          <main>
            <section className="hero" aria-label="Gregor in der Kuppel – Logo">
              <ElectricLogo
                src="/logo.svg"
       color="#f97316"
    glowColor="#dbcb98"
    scale={0.6}
    strands={1}
    bend={0.6}
    crackle={0}
    arcs={0}
    speed={1.45}
    interactive
    intensity={1.25}
    glow={0.35}
    thickness={1.6}
    flicker={0.1}
    fill={0}
    cursorIntensity={0.8}
    cursorRadius={125}
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
                  <time className="date-time" dateTime="2027-07-16">16./17. Juli 2027</time>
                  <a href="https://sternstundenfestival.de" target="_blank" rel="noreferrer">
                    <h3>Sternstunden Festival</h3>
                  </a>
                </article>
              </div>
            </section>

            <section id="repertoire" className="content-section repertoire-section" aria-labelledby="repertoire-title">
              <div className="section-inner">
                <h2 className="section-title" id="repertoire-title">Repertoire</h2>
                <ul className="repertoire-list">
                  <li>Josquin - Absalon</li>
                  <li>Pentatonix - Run to you</li>
                  <li>Tu solus</li>
                  <li>Billy Joel - Lullabye</li>
                </ul>
              </div>
            </section>

            <section id="gallerie" className="content-section gallerie-section" aria-labelledby="gallerie-title">
              <div className="section-inner">
                <h2 className="section-title" id="gallerie-title">Gallerie</h2>
                <HiDriveGallery />
              </div>
            </section>
          </main>
        )}

        <footer className="site-footer">
          <a className="footer-logo" href="/#top" aria-label="Zur Startseite">
            <img src="/logo.svg" alt="" />
          </a>
          <div className="footer-column">
            <h2>Social</h2>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
              Youtube
            </a>
            <a href="https://www.instagram.com/gregorinderkuppel/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
          <div className="footer-column">
            <h2>Kontakt</h2>
            <a href="mailto:gregor@test.de">Schreib uns</a>
          </div>
          <div className="footer-column">
            <h2>Legal</h2>
            <a href="/datenschutz">Datenschutz</a>
            <a href="/impressum">Impressum</a>
          </div>
        </footer>
        <BackToTopButton />
      </div>
    </GlowCursor>
  )
}

export default App