import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CustomCursor from './CustomCursor';
import StaticView from './StaticView';
import World3D, { type World3DHandle } from './World3D';
import { LINKS } from './content';
import { useI18n } from './i18n';
import { buildSections } from './sections';
import { useViewMode } from './viewMode';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function App() {
  const { t, lang, setLang } = useI18n();
  const { mode, setMode } = useViewMode();
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const worldRef = useRef<World3DHandle>(null);

  const sectionsRef = useRef<{ id: string }[]>([]);

  const goTo = useCallback(
    (idx: number) => {
      setMenuOpen(false);
      const id = sectionsRef.current[idx]?.id;
      if (id) history.replaceState(null, '', idx === 0 ? window.location.pathname + window.location.search : `#${id}`);
      if (mode === '3d') {
        worldRef.current?.goTo(idx);
        return;
      }
      const el = id ? document.getElementById(id) : null;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    },
    [mode],
  );

  const contactIdx = 5;
  const sections = useMemo(() => buildSections(() => goTo(contactIdx)), [goTo]);
  sectionsRef.current = sections;

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const idx = sections.findIndex((s) => s.id === hash);
    if (idx > 0) {
      const timer = window.setTimeout(() => goTo(idx), 150);
      return () => window.clearTimeout(timer);
    }
    return undefined;
    // Only on first mount and when the view mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (mode !== 'static') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [mode, sections]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const langToggle = (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(['en', 'sq'] as const).map((code) => (
        <button key={code} type="button" className={lang === code ? 'is-active' : ''} aria-pressed={lang === code} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const viewToggle = (
    <button type="button" className="view-toggle" onClick={() => setMode(mode === '3d' ? 'static' : '3d')}>
      {mode === '3d' ? t('view.static') : t('view.3d')}
    </button>
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="topbar">
        <button type="button" className="brand" onClick={() => goTo(0)} aria-label="Elvi Zekaj, home">
          <span className="brand-mark" aria-hidden="true">
            EZ
          </span>
          <span className="brand-name">Elvi Zekaj</span>
        </button>

        <nav className="topnav" aria-label="Sections">
          {sections.map((s, i) => (
            <button key={s.id} type="button" className={active === i ? 'is-active' : ''} aria-current={active === i ? 'true' : undefined} onClick={() => goTo(i)}>
              {t(s.navKey)}
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          <a className="pill pill-company" href={LINKS.company} {...ext}>
            Z.E Digital Tech &#8599;
          </a>
          <a className="pill hide-sm" href={LINKS.cv} {...ext}>
            {t('nav.cv')}
          </a>
          {langToggle}
          <span className="hide-sm">{viewToggle}</span>
          <button type="button" className="menu-btn" aria-expanded={menuOpen} aria-controls="menu-sheet" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? t('nav.close') : t('nav.menu')}
          </button>
        </div>
      </header>

      <div id="menu-sheet" className={`menu-sheet${menuOpen ? ' open' : ''}`} hidden={!menuOpen}>
        {sections.map((s, i) => (
          <button key={s.id} type="button" className="menu-item" onClick={() => goTo(i)}>
            <span>{t(s.navKey)}</span>
            <span className="menu-index">{String(i + 1).padStart(2, '0')}</span>
          </button>
        ))}
        <a className="menu-item" href={LINKS.company} {...ext}>
          <span>Z.E Digital Tech &#8599;</span>
          <span className="menu-index">zedigital.tech</span>
        </a>
        <a className="menu-item" href={LINKS.cv} {...ext}>
          <span>{t('hero.cv')}</span>
          <span className="menu-index">PDF</span>
        </a>
        <div className="menu-row">{viewToggle}</div>
      </div>

      {mode === '3d' && (
        <nav className="dot-nav" aria-label="Section progress">
          {sections.map((s, i) => (
            <button key={s.id} type="button" className={`dot${active === i ? ' is-active' : ''}`} onClick={() => goTo(i)} aria-label={t(s.navKey)}>
              <span className="dot-label">{t(s.navKey)}</span>
            </button>
          ))}
        </nav>
      )}

      <main id="main">{mode === '3d' ? <World3D ref={worldRef} sections={sections} onSectionChange={setActive} /> : <StaticView sections={sections} />}</main>

      {mode === 'static' && (
        <footer className="site-footer">
          <span>{t('footer.built')}</span>
          <a href={LINKS.company} {...ext}>
            {t('footer.company')}: zedigital.tech
          </a>
          <a href={LINKS.github} {...ext}>
            GitHub
          </a>
          <a href={LINKS.linkedin} {...ext}>
            LinkedIn
          </a>
          <a href={LINKS.cv} {...ext}>
            CV (PDF)
          </a>
        </footer>
      )}

      {mode === '3d' && (
        <>
          <div className="vignette" aria-hidden="true" />
          <div className="noise" aria-hidden="true" />
          <CustomCursor />
        </>
      )}
    </>
  );
}
