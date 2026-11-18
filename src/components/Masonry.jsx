import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './Masonry.css'

function calculateLayout(items, containerWidth, columnWidth, gap, columns) {
  if (containerWidth <= 0 || items.length === 0) {
    return { height: 0, positions: [] }
  }

  const maxColumns = Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)))
  const requestedColumns = columns === 'auto' ? maxColumns : Number(columns)
  const columnCount = Math.min(
    items.length,
    maxColumns,
    Math.max(1, Number.isFinite(requestedColumns) ? Math.floor(requestedColumns) : 1),
  )
  const itemWidth = (containerWidth - gap * (columnCount - 1)) / columnCount
  const columnHeights = Array(columnCount).fill(0)
  const positions = items.map(item => {
    const column = columnHeights.indexOf(Math.min(...columnHeights))
    const ratio = Number(item.width) > 0 && Number(item.height) > 0
      ? Number(item.width) / Number(item.height)
      : 1
    const itemHeight = itemWidth / ratio
    const position = {
      x: column * (itemWidth + gap),
      y: columnHeights[column],
      width: itemWidth,
      height: itemHeight,
    }

    columnHeights[column] += itemHeight + gap
    return position
  })

  return {
    height: Math.max(...columnHeights) - gap,
    positions,
  }
}

function Lightbox({ item, items, index, close, changeIndex, closeButtonRef }) {
  const stopPropagation = event => event.stopPropagation()

  return (
    <div
      className="masonry-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Bildansicht'}
      onClick={close}
      onKeyDown={event => {
        if (event.key === 'Escape') close()
      }}
    >
      <div className="masonry-lightbox__backdrop" />
      <button
        ref={closeButtonRef}
        className="masonry-lightbox__button masonry-lightbox__close"
        type="button"
        aria-label="Bildansicht schließen"
        onClick={event => {
          stopPropagation(event)
          close()
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      {items.length > 1 && (
        <>
          <button
            className="masonry-lightbox__button masonry-lightbox__prev"
            type="button"
            aria-label="Vorheriges Bild"
            onClick={event => {
              stopPropagation(event)
              changeIndex(-1)
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            className="masonry-lightbox__button masonry-lightbox__next"
            type="button"
            aria-label="Nächstes Bild"
            onClick={event => {
              stopPropagation(event)
              changeIndex(1)
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}
      <img
        className="masonry-lightbox__image"
        src={item.img}
        alt={item.title || ''}
        draggable="false"
        style={{
          top: '50%',
          left: '50%',
          width: 'min(90vw, 1100px)',
          height: 'min(76vh, 760px)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {(item.title || item.url) && (
        <div
          className="masonry-lightbox__caption"
          style={{ bottom: 24 }}
          onClick={stopPropagation}
        >
          {item.title && <span>{item.title}</span>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer">
              Quelle <span aria-hidden="true">↗</span>
            </a>
          )}
          <span className="masonry-lightbox__muted">
            {index + 1} / {items.length}
          </span>
        </div>
      )}
    </div>
  )
}

export default function Masonry({
  items = [],
  columnWidth = 240,
  gap = 12,
  radius = 12,
  columns = 'auto',
  hoverEffect = 'zoom',
  captions = 'hover',
  lightbox = false,
}) {
  const containerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [loadedImages, setLoadedImages] = useState({})
  const [activeIndex, setActiveIndex] = useState(-1)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.round(entry.contentRect.width))
    })
    resizeObserver.observe(container)
    setContainerWidth(Math.round(container.getBoundingClientRect().width))

    return () => resizeObserver.disconnect()
  }, [])

  const layout = useMemo(
    () => calculateLayout(items, containerWidth, columnWidth, gap, columns),
    [items, containerWidth, columnWidth, gap, columns],
  )
  const isLightboxOpen = activeIndex >= 0

  useEffect(() => {
    if (!lightbox || !isLightboxOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setActiveIndex(-1)
      } else if (event.key === 'ArrowLeft' && items.length > 1) {
        setActiveIndex(index => (index - 1 + items.length) % items.length)
      } else if (event.key === 'ArrowRight' && items.length > 1) {
        setActiveIndex(index => (index + 1) % items.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen, items.length, lightbox])

  useEffect(() => {
    if (!isLightboxOpen) triggerRef.current?.focus()
  }, [isLightboxOpen])

  const activeItem = activeIndex >= 0 ? items[activeIndex] : null
  const changeIndex = direction => {
    setActiveIndex(index => (index + direction + items.length) % items.length)
  }

  return (
    <>
      <div
        ref={containerRef}
        className="masonry"
        data-hover={hoverEffect}
        style={{ height: layout.height, '--masonry-radius': `${radius}px` }}
      >
        {items.map((item, index) => {
          const position = layout.positions[index]
          const style = position
            ? {
                width: position.width,
                height: position.height,
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              }
            : undefined

          return (
            <div
              className="masonry__item"
              key={item.id}
              style={style}
              data-hidden={!position ? '' : undefined}
            >
              <button
                className="masonry__card"
                type="button"
                aria-label={item.title ? `Bild öffnen: ${item.title}` : 'Bild öffnen'}
                onClick={event => {
                  if (!lightbox) return
                  triggerRef.current = event.currentTarget
                  setActiveIndex(index)
                }}
              >
                <span className="masonry__media">
                  <span className="masonry__parallax">
                    <img
                      className="masonry__image"
                      src={item.img}
                      alt={item.title || ''}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      data-loaded={loadedImages[item.id] ? '' : undefined}
                      onLoad={() => {
                        setLoadedImages(previous => ({ ...previous, [item.id]: true }))
                      }}
                    />
                  </span>
                  {captions && (
                    <span
                      className="masonry__caption"
                      data-mode={captions === 'hover' ? 'hover' : undefined}
                    >
                      {item.title && <span className="masonry__title">{item.title}</span>}
                      {item.text && <span className="masonry__text">{item.text}</span>}
                    </span>
                  )}
                </span>
              </button>
            </div>
          )
        })}
      </div>
      {lightbox && activeItem && (
        <Lightbox
          item={activeItem}
          items={items}
          index={activeIndex}
          close={() => setActiveIndex(-1)}
          changeIndex={changeIndex}
          closeButtonRef={closeButtonRef}
        />
      )}
    </>
  )
}
