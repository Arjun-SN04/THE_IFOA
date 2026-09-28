import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiAddLine, RiSubtractLine, RiArrowDownSLine, RiArrowRightSLine, RiCheckLine, RiUser3Line } from 'react-icons/ri'

// Data-driven course overview. When a course has `overview` set (see
// backend/scripts/courseOverviews.js), CourseDetailView renders these blocks
// in order instead of its fixed section template, so each course page can
// follow its own approved copy section-for-section.

const CARD = 'rounded-[2rem] bg-white border border-slate-200/90 p-7 sm:p-8 lg:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
const H2 = 'text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-950 tracking-tight'
const MUTED = 'text-xs sm:text-sm text-slate-500 leading-relaxed'

// Course the overview belongs to, so its /contact links pre-select the topic.
const CourseSlugContext = createContext('')

// Smart link: internal paths use the router, everything else a plain anchor.
function SmartLink({ href: rawHref, className, children }) {
  const courseSlug = useContext(CourseSlugContext)
  const href = rawHref === '/contact' && courseSlug ? `/contact?course=${courseSlug}` : rawHref
  if (href && href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    )
  }
  const external = /^https?:/.test(href || '')
  return (
    <a
      href={href}
      className={className}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

// Minimal inline formatting for copy: **bold** and [label](href).
function Rich({ text }) {
  if (!text) return null
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={i} className="font-bold text-slate-900">{bold[1]}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      return (
        <SmartLink key={i} href={link[2]} className="font-semibold text-slate-950 underline underline-offset-4 hover:text-[#16a952]">
          {link[1]}
        </SmartLink>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

function Heading({ title, intro, compact }) {
  if (!title && !intro) return null
  return (
    <div className="space-y-1.5">
      {title && (
        <h2 className={compact ? 'text-lg sm:text-xl font-bold text-slate-950 tracking-tight' : H2}>{title}</h2>
      )}
      {intro && (
        <p className={MUTED}>
          <Rich text={intro} />
        </p>
      )}
    </div>
  )
}

// ---- Hero pieces -----------------------------------------------------------

function Track({ block }) {
  const cols = block.items.length
  return (
    <div className="space-y-3">
      <div
        className="grid grid-cols-2 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))] rounded-2xl border border-slate-300 overflow-hidden bg-white"
        style={{ '--n': cols }}
      >
        {block.items.map((item, i) => {
          const on = item.tone === 'on'
          const prep = item.tone === 'prep'
          return (
            <div
              key={i}
              className={`p-3.5 sm:p-4 min-h-[92px] flex flex-col justify-between gap-2 border-slate-200 ${
                i < cols - 1 ? 'sm:border-r' : ''
              } ${i % 2 === 0 ? 'border-r sm:border-r' : ''} ${i < cols - 2 ? 'border-b sm:border-b-0' : ''} ${
                on ? 'bg-slate-950 text-white' : prep ? 'bg-slate-100 text-slate-950' : 'bg-white text-slate-950'
              }`}
            >
              {item.label && (
                <span className={`text-[11px] font-mono uppercase tracking-wider ${on ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              )}
              <strong className="text-sm sm:text-base font-bold leading-snug">{item.title}</strong>
              {item.sub && <small className={`text-[11px] leading-snug ${on ? 'text-slate-300' : 'text-slate-500'}`}>{item.sub}</small>}
            </div>
          )
        })}
      </div>
      {block.key?.length > 0 && (
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          {block.key.map((k, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-sm border ${
                  k.tone === 'on'
                    ? 'bg-slate-950 border-slate-950'
                    : k.tone === 'prep'
                      ? 'bg-slate-100 border-slate-300'
                      : 'bg-white border-slate-300'
                }`}
              />
              {k.label}
            </span>
          ))}
        </div>
      )}
      {block.note && <p className={MUTED}>{block.note}</p>}
    </div>
  )
}

function Split({ block }) {
  return (
    <div className="space-y-3">
      <div
        className="grid rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs"
        style={{ gridTemplateColumns: block.items.map((i) => `${i.weight || 1}fr`).join(' ') }}
      >
        {block.items.map((item, i) => (
          <div
            key={i}
            className={`p-4 sm:p-5 min-h-[110px] flex flex-col justify-between text-white ${
              i === 0 ? 'bg-slate-950' : 'bg-slate-900 border-l border-slate-800'
            }`}
          >
            <b className="text-3xl sm:text-4xl font-extrabold leading-none tracking-tight">{item.value}</b>
            <span className="text-xs sm:text-sm text-slate-300 font-medium opacity-90">{item.label}</span>
          </div>
        ))}
      </div>
      {block.note && <p className={MUTED}>{block.note}</p>}
    </div>
  )
}

export function OverviewHero({ hero, fallbackTitle, fallbackLead }) {
  return (
    <div className="space-y-5">
      <div className="space-y-3.5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-slate-950 tracking-tight leading-[1.14] [text-wrap:balance]">
          {hero.title || fallbackTitle}
        </h1>
        {hero.slogan && <p className="text-lg sm:text-xl font-bold text-[#16a952] leading-snug">{hero.slogan}</p>}
        {(hero.lead || fallbackLead) && (
          <p className="text-sm sm:text-base md:text-[16px] text-slate-600 font-normal leading-relaxed max-w-3xl">
            <Rich text={hero.lead || fallbackLead} />
          </p>
        )}
      </div>
      {(hero.blocks || []).map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}

// ---- Body blocks -------------------------------------------------------------

// Hover opens on devices with a real pointer; tap/click pins an item open
// everywhere (and is the only trigger on touch screens).
const canHover = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches

// One-open-at-a-time state for a cluster of expandable rows.
function useCluster(initial = -1) {
  const [active, setActive] = useState(initial)
  return {
    active,
    rowProps: (i) => ({
      // Hovering a row opens it and it stays open until another row is
      // hovered - moving the mouse away doesn't close it.
      onMouseEnter: () => canHover() && setActive(i),
      // Tap/click toggles (the only trigger on touch screens).
      onClick: () => setActive((a) => (a === i && !canHover() ? -1 : i))
    }),
    clusterProps: {},
    setPinned: setActive
  }
}

// Smooth height reveal (grid-rows 0fr -> 1fr) without measuring content.
function Reveal({ open, children, className = '' }) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className={`overflow-hidden ${className}`}>{children}</div>
    </div>
  )
}

function PlusMinus({ open }) {
  return (
    <span
      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
        open ? 'bg-emerald-50 text-[#16a952]' : 'bg-slate-100 text-slate-400'
      }`}
    >
      {open ? <RiSubtractLine className="w-3.5 h-3.5" /> : <RiAddLine className="w-3.5 h-3.5" />}
    </span>
  )
}

function AccordionItem({ item, index, isStatic, open, rowProps }) {
  const hasBody = !isStatic && (item.bullets?.length || item.text || item.competency)
  const num = item.num || String(index + 1).padStart(2, '0')
  return (
    <li
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? 'bg-white border-slate-200 shadow-[0_6px_24px_rgba(15,23,42,0.06)]'
          : 'bg-slate-50/60 border-slate-200/70 hover:bg-white hover:border-slate-300'
      }`}
    >
      <button
        type="button"
        {...(hasBody ? rowProps : {})}
        aria-expanded={hasBody ? open : undefined}
        className={`w-full flex items-center gap-3.5 text-left px-4 sm:px-5 py-3.5 ${hasBody ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span
          className={`inline-flex items-center justify-center min-w-[2.5rem] h-8 px-2 rounded-lg font-mono text-xs font-bold tracking-wide shrink-0 transition-colors duration-300 ${
            open ? 'bg-slate-950 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {num}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug">{item.title}</span>
          {isStatic && item.text && <span className="block mt-1 text-xs text-slate-600 leading-relaxed">{item.text}</span>}
          {hasBody && !open && item.bullets?.length > 0 && (
            <span className="block mt-0.5 text-[11px] text-slate-400">
              {item.bullets.length} {item.bullets.length === 1 ? 'topic' : 'topics'}
            </span>
          )}
        </span>

        {item.tag ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
              item.tagTone === 'accent' ? 'bg-red-50 text-red-700 border border-red-100' : 'text-slate-500 bg-slate-100 border border-slate-200'
            }`}
          >
            {item.tag}
          </span>
        ) : hasBody ? (
          <RiArrowDownSLine
            className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-slate-900' : 'text-slate-400'}`}
          />
        ) : null}
      </button>

      {hasBody && (
        <Reveal open={open}>
          <div className="px-4 sm:px-5 pb-4 sm:pl-[4.6rem] space-y-3">
            <div className="h-px bg-slate-100" />
            {item.text && <p className="text-[13px] text-slate-600 leading-relaxed">{item.text}</p>}
            {item.bullets?.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {item.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] text-slate-700 leading-snug">
                    <RiCheckLine className="w-3.5 h-3.5 text-[#16a952] shrink-0 mt-[3px]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {item.competency && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                <RiCheckLine className="w-3.5 h-3.5 text-[#16a952] shrink-0" />
                {item.competency}
              </span>
            )}
          </div>
        </Reveal>
      )}
    </li>
  )
}

// A vertical cluster of expandable rows (one open at a time).
function ItemList({ items, startIndex = 0, isStatic }) {
  const cluster = useCluster(-1)
  return (
    <ol className="space-y-2.5" {...cluster.clusterProps}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          index={startIndex + i}
          isStatic={isStatic}
          open={cluster.active === i}
          rowProps={cluster.rowProps(i)}
        />
      ))}
    </ol>
  )
}

function Practice({ practice }) {
  return (
    <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-slate-700 space-y-1">
      <strong className="block font-bold text-slate-950">{practice.title}</strong>
      <p className="text-slate-600 leading-relaxed font-normal">{practice.text}</p>
    </div>
  )
}

// Module card shown inside an open day/part panel: everything visible, no
// nested expand, so the only thing that moves on hover is the panel width.
function ModuleCard({ item, index }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 space-y-1.5">
      <div className="flex items-start gap-2">
        <span className="font-mono text-[11px] font-bold text-[#16a952] bg-emerald-50 border border-emerald-100/80 px-1.5 py-0.5 rounded shrink-0">
          {item.num || String(index + 1).padStart(2, '0')}
        </span>
        <strong className="text-xs sm:text-[13px] font-bold text-slate-950 leading-snug">{item.title}</strong>
      </div>
      {item.text && <p className="text-[11.5px] text-slate-600 leading-relaxed">{item.text}</p>}
      {item.bullets?.length > 0 && (
        <ul className="space-y-1 text-[11.5px] text-slate-600 leading-relaxed">
          {item.bullets.map((b, j) => (
            <li key={j} className="flex items-start gap-1.5">
              <RiCheckLine className="w-3.5 h-3.5 text-[#16a952] shrink-0 mt-[3px]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {item.competency && (
        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
          {item.competency}
        </span>
      )}
    </div>
  )
}

function GroupContent({ group, start, cols }) {
  return (
    <div className="space-y-3">
      <div className={`grid gap-2.5 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {group.items.map((item, i) => (
          <ModuleCard key={i} item={item} index={start + i} />
        ))}
      </div>
      {group.practice && <Practice practice={group.practice} />}
    </div>
  )
}

const ACTIVE_GROW = 3.2
const GAP = 16

// Titled groups (days, programme parts) as a horizontal accordion on large
// screens: hovering a panel widens it, the others shrink to a summary. The
// open panel's content is laid out at a fixed width (the width an open panel
// gets), so switching panels changes width only - the row height stays put.
// Below lg the panels stack and open in height instead.
function GroupAccordion({ groups }) {
  const [pinned, setPinned] = useState(0)
  const [hovered, setHovered] = useState(null)
  const active = hovered ?? pinned
  const rowRef = useRef(null)
  const [openWidth, setOpenWidth] = useState(0)
  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0))
  const unit = groups.every((g) => g.items.every((it) => /^M\d+/.test(it.num || ''))) ? 'modules' : 'topics'

  useEffect(() => {
    const el = rowRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const measure = () => {
      const total = el.clientWidth - GAP * (groups.length - 1)
      setOpenWidth((total * ACTIVE_GROW) / (ACTIVE_GROW + groups.length - 1))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [groups.length])

  // Panel padding is 24px each side; content keeps the open panel's inner width.
  const contentWidth = Math.max(openWidth - 48, 0)
  const cols = contentWidth >= 480 ? 2 : 1

  return (
    <>
      {/* lg+: horizontal, width-only accordion */}
      <div ref={rowRef} className="hidden lg:flex items-stretch w-full overflow-hidden" style={{ gap: GAP }} onMouseLeave={() => setHovered(null)}>
        {groups.map((group, gi) => {
          const open = active === gi
          return (
            <div
              key={gi}
              onMouseEnter={() => canHover() && setHovered(gi)}
              onClick={() => setPinned(gi)}
              className={`relative overflow-hidden rounded-2xl border p-6 cursor-pointer transition-[flex-grow,background-color,border-color,box-shadow] duration-500 ease-out min-w-0 ${
                open
                  ? 'bg-slate-50/40 border-emerald-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                  : 'bg-slate-50/70 border-slate-200/90 hover:border-slate-300'
              }`}
              style={{ flexGrow: open ? ACTIVE_GROW : 1, flexBasis: 0 }}
              aria-expanded={open}
            >
              {/* Full content, fixed width so its height never depends on the panel width */}
              <div
                className={`transition-opacity duration-300 ${open ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none'}`}
                style={{ width: contentWidth || undefined }}
                aria-hidden={!open}
              >
                <div className="flex items-baseline justify-between gap-3 pb-2.5 mb-3.5 border-b border-slate-200/70">
                  <h3 className="text-lg font-bold text-slate-950 tracking-tight">{group.title}</h3>
                  {group.subtitle && <span className="text-xs font-medium text-slate-500">{group.subtitle}</span>}
                </div>
                <GroupContent group={group} start={starts[gi]} cols={cols} />
              </div>

              {/* Collapsed summary */}
              <div
                className={`absolute inset-0 p-6 flex flex-col transition-opacity duration-300 ${
                  open ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-150'
                }`}
                aria-hidden={open}
              >
                <h3 className="text-base font-bold text-slate-900 tracking-tight">{group.title}</h3>
                {group.subtitle && <span className="mt-1 text-xs font-medium text-slate-500 leading-snug">{group.subtitle}</span>}
                <span className="mt-3 inline-flex w-fit items-center text-[11px] font-mono font-bold text-[#16a952] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                  {group.items.length} {group.items.length === 1 ? unit.replace(/s$/, '') : unit}
                </span>
                <ul className="mt-4 space-y-2 text-[11.5px] text-slate-500 leading-snug">
                  {group.items.map((item, i) => (
                    <li key={i} className="line-clamp-2">
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {/* Below lg: vertical, height-only accordion */}
      <div className="lg:hidden space-y-3">
        {groups.map((group, gi) => {
          const open = pinned === gi
          return (
            <div
              key={gi}
              className={`rounded-2xl border p-5 transition-colors ${open ? 'bg-slate-50/40 border-emerald-200' : 'bg-slate-50/70 border-slate-200/90'}`}
            >
              <button
                type="button"
                onClick={() => setPinned(open ? -1 : gi)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <span>
                  <span className="block text-base font-bold text-slate-950">{group.title}</span>
                  {group.subtitle && <span className="block text-xs text-slate-500 mt-0.5">{group.subtitle}</span>}
                </span>
                <PlusMinus open={open} />
              </button>
              <Reveal open={open}>
                <div className="pt-4">
                  <GroupContent group={group} start={starts[gi]} cols={1} />
                </div>
              </Reveal>
            </div>
          )
        })}
      </div>
    </>
  )
}

function Accordion({ block }) {
  const groups = block.groups || [{ items: block.items || [] }]
  const titled = groups.length > 1 && groups.every((g) => g.title)
  return (
    <section id={block.anchor || undefined} className={`${CARD} space-y-6 scroll-mt-28`}>
      <Heading title={block.title} intro={block.intro} />
      {titled && block.layout === 'vertical' ? (
        // Long parts stack vertically: a heading per part, then its topics
        // as a vertical accordion (height-only).
        <div className="space-y-7">
          {groups.map((group, gi) => (
            <div key={gi} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-2.5 border-b border-slate-200/70">
                <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">{group.title}</h3>
                {group.subtitle && <span className="text-xs font-medium text-slate-500 sm:text-right">{group.subtitle}</span>}
              </div>
              <ItemList items={group.items} isStatic={block.static} />
              {group.practice && <Practice practice={group.practice} />}
            </div>
          ))}
        </div>
      ) : titled ? (
        <GroupAccordion groups={groups} />
      ) : (
        // Untitled lists run as one vertical column: rows open downward, so
        // side-by-side columns would jump unevenly when one expands.
        <div>
          <ItemList items={groups.flatMap((g) => g.items)} isStatic={block.static} />
          {groups.map((group, gi) => group.practice && <Practice key={gi} practice={group.practice} />)}
        </div>
      )}
    </section>
  )
}

function Checks({ block, bare, fill }) {
  const body = (
    <div className={`space-y-4 ${fill ? 'flex-1 flex flex-col' : ''}`}>
      <Heading title={block.title} intro={block.intro} compact={bare} />
      <ul
        className={`rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 ${fill ? 'flex-1 flex flex-col' : ''}`}
      >
        {block.items.map((item, i) => (
          <li
            key={i}
            className={`flex items-center gap-3 px-4 py-3.5 text-[13px] sm:text-sm text-slate-700 leading-snug ${fill ? 'flex-1' : ''}`}
          >
            <span className="w-5 h-5 rounded-full bg-[#34E06E]/15 text-[#16a952] flex items-center justify-center shrink-0">
<RiCheckLine className="w-3.5 h-3.5" />
</span>
            <span className="flex-1">
              <Rich text={item} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
  return bare ? body : <section className={`${CARD} space-y-4`}>{body}</section>
}

function Facts({ block, bare, fill }) {
  const body = (
    <>
      <Heading title={block.title} intro={block.intro} compact={bare} />
      {block.text && (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <Rich text={block.text} />
        </p>
      )}
      {block.boxes?.length > 0 && (
        <div className="grid sm:grid-cols-3 rounded-2xl border border-slate-300 overflow-hidden">
          {block.boxes.map((box, i) => (
            <div
              key={i}
              className={`p-4 ${i < block.boxes.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-slate-200' : 'bg-red-50'}`}
            >
              <strong className="block text-sm font-bold text-slate-950">{box.title}</strong>
              <span className="text-xs text-slate-600">{box.text}</span>
            </div>
          ))}
        </div>
      )}
      {block.items?.length > 0 && (
        <div
          className={`rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 ${
            fill && !block.standards?.length ? 'flex-1 flex flex-col' : ''
          }`}
        >
          {block.items.map((fact, i) => (
            <div key={i} className={`flex gap-3.5 px-4 py-3.5 ${fill && !block.standards?.length ? 'flex-1' : ''}`}>
              <span className="w-7 h-7 rounded-md bg-slate-950 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <strong className="block text-sm font-bold text-slate-950">{fact.title}</strong>
                <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
                  <Rich text={fact.text} />
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {block.standards?.length > 0 && (
        <div className="space-y-2">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Standards referenced</span>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 divide-y divide-slate-200/60">
            {block.standards.map((s, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 px-4 py-2.5 items-baseline">
                <strong className="text-[13px] font-bold text-slate-900">{s.title}</strong>
                <span className="text-xs text-slate-500 leading-snug">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
  return bare ? (
    <div className={`space-y-4 ${fill ? 'flex-1 flex flex-col' : ''}`}>{body}</div>
  ) : (
    <section className={`${CARD} space-y-4`}>{body}</section>
  )
}

function Pills({ block, bare }) {
  const body = (
    <div className="space-y-3.5">
      <Heading title={block.title} intro={block.intro} compact={bare} />
      <ul className="space-y-2.5">
        {block.items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800 leading-snug hover:bg-white hover:border-slate-300 transition-colors shadow-2xs"
          >
            <span className="w-6 h-6 rounded-full bg-[#34E06E]/15 text-[#16a952] flex items-center justify-center shrink-0">
<RiUser3Line className="w-3.5 h-3.5" />
</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
  return bare ? body : <section className={`${CARD} space-y-4`}>{body}</section>
}

// Standards as a horizontal row of tiles (code + what it covers).
function Standards({ block, bare }) {
  const body = (
    <>
      <Heading title={block.title} intro={block.intro} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {block.items.map((s, i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-3.5 hover:bg-white hover:border-slate-300 transition-colors">
            <strong className="block text-sm font-bold text-slate-950">{s.title}</strong>
            <span className="block mt-0.5 text-xs text-slate-500 leading-snug">{s.text}</span>
          </div>
        ))}
      </div>
    </>
  )
  return bare ? <div className="space-y-4">{body}</div> : <section className={`${CARD} space-y-5`}>{body}</section>
}

function Proof({ block, bare }) {
  const body = (
    <div className="text-center space-y-5">
      {block.title && (
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight text-center">
          {block.title}
        </h2>
      )}
      {block.intro && (
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto text-center">
          <Rich text={block.intro} />
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 pt-1">
        {block.items.map((p, i) => (
          <div key={i} className="text-center">
            <b className="block text-3xl sm:text-4xl font-extrabold text-slate-950 leading-none tracking-tight">{p.value}</b>
            <span className="text-xs sm:text-sm text-slate-500 block mt-1.5 font-medium">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
  return bare ? <div className="space-y-4">{body}</div> : <section className={`${CARD} py-8 sm:py-9`}>{body}</section>
}

// Master/detail view for text-heavy card sets: a numbered list of titles on
// the left, the selected item's description and bullets on the right.
// Hover (or tap) switches the selection; it stays until another is chosen.
function TabCards({ block }) {
  const [active, setActive] = useState(0)
  const item = block.items[active]
  return (
    <section id={block.anchor || undefined} className={`${CARD} space-y-6 scroll-mt-28`}>
      <Heading title={block.title} intro={block.intro} />

      {/* md+: list + detail panel */}
      <div className="hidden md:grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5">
        <ol className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 overflow-hidden">
          {block.items.map((it, i) => {
            const on = i === active
            return (
              <li key={i}>
                <button
                  type="button"
                  onMouseEnter={() => canHover() && setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer transition-colors ${
                    on ? 'bg-slate-950 text-white' : 'hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-md font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      on ? 'bg-[#34E06E] text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-sm font-semibold leading-snug">{it.title}</span>
                  <RiArrowDownSLine className={`w-4 h-4 -rotate-90 shrink-0 ${on ? 'text-[#34E06E]' : 'text-slate-300'}`} />
                </button>
              </li>
            )
          })}
        </ol>

        <div key={active} className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 flex flex-col animate-overview-fade animate-[overviewFadeIn_.25s_ease-out]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
            {String(active + 1).padStart(2, '0')} / {String(block.items.length).padStart(2, '0')}
          </span>
          <h3 className="mt-2 text-lg sm:text-xl font-bold text-slate-950 tracking-tight">{item.title}</h3>
          {item.text && <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.text}</p>}
          {item.bullets?.length > 0 && (
            <ul className="mt-5 pt-4 border-t border-slate-200/70 space-y-2.5">
              {item.bullets.map((b, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-slate-800">
                  <RiCheckLine className="w-3.5 h-3.5 text-[#16a952] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {item.who && <span className="mt-auto pt-4 text-xs font-bold text-slate-900">{item.who}</span>}
        </div>
      </div>

      {/* Mobile: stacked accordion */}
      <div className="md:hidden">
        <ItemList items={block.items.map((it) => ({ title: it.title, text: it.text, bullets: it.bullets }))} />
      </div>
    </section>
  )
}

function Cards({ block }) {
  if (block.layout === 'tabs') return <TabCards block={block} />
  const n = block.items.length
  return (
    <section id={block.anchor || undefined} className={`${CARD} space-y-5 scroll-mt-28`}>
      <Heading title={block.title} intro={block.intro} />
      <div className={`grid gap-4 ${n % 3 === 0 ? 'md:grid-cols-3' : n === 2 || n === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {block.items.map((item, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col gap-2">
            <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
            {item.text && <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.text}</p>}
            {item.bullets?.length > 0 && (
              <ul className="mt-auto pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-700">
                {item.bullets.map((b, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="w-2.5 h-[3px] bg-[#34E06E] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {item.who && <span className="mt-auto pt-1 text-xs font-bold text-slate-900">{item.who}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

function Notice({ block }) {
  return (
    <section
      id={block.anchor || undefined}
      className={`${CARD} grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:gap-6 items-start scroll-mt-28`}
    >
      <div
        className="w-12 h-12 rounded-2xl bg-slate-950 text-[#34E06E] flex items-center justify-center font-bold text-2xl shadow-xs shrink-0 select-none"
        aria-hidden="true"
      >
        !
      </div>
      <div className="space-y-3">
        <h2 className={H2}>{block.title}</h2>
        {block.paragraphs.map((p, i) => (
          <p key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <Rich text={p} />
          </p>
        ))}
      </div>
    </section>
  )
}

function Table({ block }) {
  // "Flight Dispatcher Initial (this course)" -> name + a separate "This course" marker.
  const head = block.head.map((h) => String(h).replace(/\s*\(this course\)\s*$/i, ''))
  const cols = head.length - 1
  return (
    <section id={block.anchor || undefined} className={`${CARD} space-y-6 scroll-mt-28`}>
      <Heading title={block.title} intro={block.intro} />

      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed text-left border-collapse">
            <colgroup>
              <col className="w-[24%]" />
              {Array.from({ length: cols }, (_, i) => (
                <col key={i} style={{ width: `${76 / cols}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {head.map((h, i) => {
                  const hl = i === block.highlight
                  return (
                    <th
                      key={i}
                      scope="col"
                      className={`px-5 pt-5 pb-4 align-bottom border-b border-slate-200 ${
                        hl ? 'bg-emerald-50/60 border-t-2 border-t-[#34E06E]' : ''
                      }`}
                    >
                      {hl && (
                        <span className="block mb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#16a952]">
                          This course
                        </span>
                      )}
                      <span className="block text-sm sm:text-[15px] font-bold text-slate-950 leading-snug">{h}</span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i < block.rows.length - 1 ? 'border-b border-slate-100' : ''}>
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-5 py-4 align-top text-[13px] font-medium text-slate-500">
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={j}
                        className={`px-5 py-4 align-top text-[13px] sm:text-sm leading-relaxed ${
                          j === block.highlight ? 'bg-emerald-50/60 text-slate-950 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {block.links?.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {block.links.map((l, i) => (
            <SmartLink
              key={i}
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-[#16a952] transition-colors"
            >
              {l.label}
              <RiArrowRightSLine className="w-4 h-4 text-slate-400 group-hover:text-[#16a952] group-hover:translate-x-0.5 transition-transform" />
            </SmartLink>
          ))}
        </div>
      )}
    </section>
  )
}

function Faq({ block }) {
  const [open, setOpen] = useState(-1)
  return (
    <section id="faq" className={`${CARD} space-y-4 scroll-mt-28`}>
      <Heading title={block.title || 'Questions'} />
      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {block.items.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer"
            >
              <span className="text-sm sm:text-base font-bold text-slate-950">{item.q}</span>
              {open === i ? <RiSubtractLine className="w-5 h-5 text-[#16a952] shrink-0" /> : <RiAddLine className="w-5 h-5 text-[#16a952] shrink-0" />}
            </button>
            {open === i && (
              <p className="pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <Rich text={item.a} />
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function Related({ block }) {
  return (
    <section className="rounded-2xl bg-emerald-50 border border-emerald-100 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
      <p className="text-xs sm:text-sm text-slate-800">{block.text}</p>
      <SmartLink href={block.href} className="text-xs sm:text-sm font-bold text-slate-950 underline underline-offset-4 hover:text-[#16a952]">
        {block.label}
      </SmartLink>
    </section>
  )
}

function Band({ block }) {
  return (
    <section id={block.anchor || undefined} className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-[#0a1120] to-[#040814] text-white p-8 sm:p-9 grid md:grid-cols-2 gap-6 scroll-mt-28">
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{block.title}</h2>
        {block.intro && <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{block.intro}</p>}
        {block.ctaLabel && (
          <SmartLink
            href={block.href || '/contact'}
            className="inline-flex mt-2 items-center justify-center bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold py-3 px-6 rounded-full text-xs uppercase tracking-wider"
          >
            {block.ctaLabel}
          </SmartLink>
        )}
      </div>
      <ul className="divide-y divide-white/10 border-t border-white/10">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 py-3 text-xs sm:text-sm text-slate-200">
            <span className="w-5 h-5 rounded-full bg-[#34E06E]/15 text-[#16a952] flex items-center justify-center shrink-0 mt-px">
<RiCheckLine className="w-3.5 h-3.5" />
</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Text({ block, bare }) {
  const body = (
    <>
      <Heading title={block.title} />
      {block.paragraphs.map((p, i) => (
        <p key={i} className={`text-xs sm:text-sm leading-relaxed ${block.mutedLast && i === block.paragraphs.length - 1 ? 'text-slate-500' : 'text-slate-700'}`}>
          <Rich text={p} />
        </p>
      ))}
    </>
  )
  return bare ? (
    <div className="space-y-3">{body}</div>
  ) : (
    <section id={block.anchor || undefined} className={`${CARD} space-y-3 scroll-mt-28`}>
      {body}
    </section>
  )
}

const BARE = { checks: Checks, facts: Facts, pills: Pills, standards: Standards, proof: Proof, text: Text }

function Cols({ block }) {
  return (
    <section id={block.anchor || undefined} className={`${CARD} grid md:grid-cols-2 gap-8 md:gap-10 scroll-mt-28`}>
      {block.columns.map((col, i) => (
        <div key={i} className="flex flex-col gap-6 h-full">
          {col.map((b, j) => {
            const C = BARE[b.type]
            // A lone list stretches to the height of the other column.
            return C ? <C key={j} block={b} bare fill={col.length === 1} /> : <Block key={j} block={b} />
          })}
        </div>
      ))}
    </section>
  )
}

// ---- Dangerous Goods role/operation picker --------------------------------------

// Role / operation / course-type choice, shared between the picker in the page
// body and the sidebar course card (DgSidebar) when a DgProvider wraps both.
const DgContext = createContext(null)

function useDgState(block) {
  const roleKeys = Object.keys(block?.roles || {})
  const opKeys = Object.keys(block?.ops || {})
  const [role, setRole] = useState(roleKeys[0])
  const [op, setOp] = useState(opKeys[0])
  const [type, setType] = useState('initial')
  return { role, setRole, op, setOp, type, setType }
}

export function DgProvider({ block, children }) {
  const state = useDgState(block)
  if (!block) return children
  return <DgContext.Provider value={state}>{children}</DgContext.Provider>
}

function useDg(block) {
  const shared = useContext(DgContext)
  const local = useDgState(block)
  const s = shared || local
  const opDef = block.ops[s.op]
  // Cargo carries no cabin crew: fall back to the first role.
  const role = opDef.noCabin && s.role === 'cabin' ? Object.keys(block.roles)[0] : s.role
  return { ...s, role, opDef, roleLabel: block.roles[role].label }
}

// Sidebar course card for Dangerous Goods: reflects the chosen role and
// operation, with an Initial / Recurrent switch.
export function DgSidebar({ block, contactHref = '/contact' }) {
  const { role, type, setType, opDef, roleLabel } = useDg(block)
  const rows = [
    ['Duration', block.duration || '4 hours'],
    ['Format', 'Self-paced online'],
    ['Assessment', block.assessShort?.[role]],
    ['Certificate', 'Valid 24 months'],
    ['Start', 'Scheduled with your group']
  ]
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          {roleLabel}, {type}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">{opDef.label}</p>
      </div>
      <div className="inline-flex rounded-lg border border-slate-200 p-0.5" role="group" aria-label="Course type">
        {['initial', 'recurrent'].map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={type === k}
            onClick={() => setType(k)}
            className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold capitalize transition-colors cursor-pointer ${
              type === k ? 'bg-[#C8102E] text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <p className="text-3xl font-extrabold text-slate-950 tracking-tight leading-none">
        Price per group <small className="text-sm font-medium text-slate-500">on request</small>
      </p>
      <dl className="border-t border-slate-100 text-xs sm:text-[13px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2.5 border-b border-slate-100">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-bold text-slate-950 text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="space-y-2.5">
        <Link
          to={contactHref}
          className="block w-full text-center bg-slate-950 hover:bg-[#C8102E] text-white font-extrabold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors"
        >
          Request a proposal
        </Link>
        <a
          href="#operators"
          className="block w-full text-center border border-slate-300 hover:border-slate-950 text-slate-900 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
        >
          What operators get
        </a>
      </div>
    </div>
  )
}

function Seg({ items, value, onChange, disabled = () => false }) {
  return (
  <div className="flex flex-wrap gap-2">
    {Object.entries(items).map(([k, v]) => (
      <button
        key={k}
        type="button"
        disabled={disabled(k)}
        aria-pressed={value === k}
        onClick={() => onChange(k)}
        className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
          value === k ? 'bg-slate-950 border-slate-950 text-white' : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'
        } disabled:opacity-40 disabled:line-through disabled:cursor-not-allowed cursor-pointer`}
      >
        {v.label}
      </button>
    ))}
  </div>
)
}

function DgExplorer({ block }) {
  const { role: activeRole, setRole, op, setOp, opDef, roleLabel } = useDg(block)

  const forWhom = `For ${roleLabel.toLowerCase()}s in ${opDef.label.toLowerCase()}.`
  const pick = (d) => d.all || d[op] || (opDef.carry ? d.carry : d.nocarry)
  const o = block.outcomes[activeRole]
  let outcomes = [...o.all]
  if (!opDef.carry && o.nocarry) outcomes = outcomes.concat(o.nocarry)
  if (opDef.carry && o.carry) outcomes = outcomes.concat(o.carry)
  if (op === 'cargo' && o.cargo) outcomes = outcomes.concat(o.cargo)

  return (
    <>
      <section className={`${CARD} space-y-5`}>
        <div className="space-y-2">
          <strong className="block text-sm font-bold text-slate-950">{block.roleLegend || 'Your role'}</strong>
          <Seg items={block.roles} value={activeRole} onChange={setRole} disabled={(k) => k === 'cabin' && opDef.noCabin} />
        </div>
        <div className="space-y-2">
          <strong className="block text-sm font-bold text-slate-950">{block.opLegend || 'Your operation'}</strong>
          <Seg items={block.ops} value={op} onChange={setOp} />
          <p className="text-xs text-slate-500 min-h-[1.2em]">{opDef.noCabin ? block.noCabinNote : ''}</p>
        </div>
      </section>

      <section id="modules" className={`${CARD} space-y-5 scroll-mt-28`}>
        <Heading
          title={block.modulesTitle}
          intro={`Seven modules for ${roleLabel.toLowerCase()}s in ${opDef.label.toLowerCase()}. Modules marked adapted change with your operation.`}
        />
        <ol className="border-t border-slate-100">
          {block.modules.map((m, i) => (
            <li key={i} className="grid grid-cols-[44px_1fr_auto] gap-3 items-baseline py-4 border-b border-slate-100">
              <b className="font-mono text-sm font-bold text-slate-400">{String(i + 1).padStart(2, '0')}</b>
              <div>
                <h3 className="text-sm sm:text-[15px] font-bold text-slate-950">{m.t}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{pick(m.d)}</p>
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                  m.adapt ? 'bg-red-50 text-red-700 border border-red-100' : 'text-slate-500 border border-slate-200'
                }`}
              >
                {m.adapt ? 'Adapted' : 'All operations'}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${CARD} grid md:grid-cols-2 gap-8 md:gap-10`}>
        {/* Same heading + one-line intro on both sides, cards stretch to equal height */}
        <div className="flex flex-col h-full">
          <Checks bare fill block={{ title: block.outcomesTitle, intro: forWhom, items: outcomes }} />
        </div>
        <div className="flex flex-col h-full">
          <Facts
            bare
            fill
            block={{
              title: block.assessTitle,
              intro: forWhom,
              items: [{ title: 'Scenarios', text: block.assess[activeRole].replace(/^Scenarios:\s*/, '') }, ...(block.assessFacts || [])]
            }}
          />
        </div>
      </section>
    </>
  )
}

const BLOCKS = {
  track: Track,
  split: Split,
  notice: Notice,
  accordion: Accordion,
  checks: Checks,
  facts: Facts,
  pills: Pills,
  standards: Standards,
  proof: Proof,
  cards: Cards,
  table: Table,
  faq: Faq,
  related: Related,
  band: Band,
  text: Text,
  cols: Cols,
  dgExplorer: DgExplorer
}

function Block({ block }) {
  const C = BLOCKS[block.type]
  return C ? <C block={block} /> : null
}

export function OverviewBlocks({ blocks, courseSlug = '' }) {
  return (
    <CourseSlugContext.Provider value={courseSlug}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </CourseSlugContext.Provider>
  )
}
