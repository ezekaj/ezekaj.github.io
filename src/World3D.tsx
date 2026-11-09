import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { SectionDef } from './sections';
import { useI18n } from './i18n';

const Z_GAP = 750;
const SECTION_GAP = 1100;
const CAM_SPEED = 2.5;
const STAR_COUNT = 140;
// Empty space after Contact before the world loops back to the hero.
const LOOP_GAP = SECTION_GAP * 3;
// Items further behind the camera than this wrap around to the far end of the loop.
const WRAP_BEHIND = 900;
// Scroll runway in loops; the position is folded back to the first loop when scrolling pauses.
const RUNWAY_LOOPS = 4;

type Item =
  | { kind: 'text'; key: string; z: number; x: number; y: number; textKey: string; hero: boolean }
  | { kind: 'card'; key: string; z: number; x: number; y: number; rot: number; sectionIdx: number; cardIdx: number }
  | { kind: 'star'; key: string; z: number; x: number; y: number };

interface Layout {
  items: Item[];
  sectionTargets: number[];
  sectionStarts: number[];
  endZ: number;
  loopZ: number;
}

// Folds a camera-relative depth into the loop so the world repeats endlessly.
function wrapZ(v: number, loopZ: number) {
  let w = ((v % loopZ) + loopZ) % loopZ;
  if (w > WRAP_BEHIND) w -= loopZ;
  return w;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildLayout(sections: SectionDef[], spread: number, narrow: boolean): Layout {
  const rand = seeded(42);
  const items: Item[] = [];
  const sectionTargets: number[] = [];
  const sectionStarts: number[] = [];
  let z = 0;

  sections.forEach((section, sIdx) => {
    sectionStarts.push(z);
    if (sIdx === 0) {
      // Hero: the card sits on the screen plane, the name floats behind it.
      sectionTargets.push(0);
      items.push({ kind: 'card', key: `${section.id}-0`, z: 0, x: 0, y: 0, rot: 0, sectionIdx: sIdx, cardIdx: 0 });
      items.push({ kind: 'text', key: `${section.id}-text`, z: 600, x: 0, y: 0, textKey: section.bigKey, hero: true });
      z += Z_GAP + SECTION_GAP;
      return;
    }
    items.push({ kind: 'text', key: `${section.id}-text`, z, x: 0, y: 0, textKey: section.bigKey, hero: false });
    z += Z_GAP;
    sectionTargets.push(z);
    const single = narrow || section.cards.length === 1;
    section.cards.forEach((_, cIdx) => {
      const side = cIdx % 2 === 0 ? -1 : 1;
      items.push({
        kind: 'card',
        key: `${section.id}-${cIdx}`,
        z,
        x: single ? 0 : side * spread,
        y: single ? 0 : side * 24,
        rot: single ? 0 : (rand() - 0.5) * 4,
        sectionIdx: sIdx,
        cardIdx: cIdx,
      });
      z += Z_GAP;
    });
    z += SECTION_GAP;
  });

  const endZ = z - Z_GAP - SECTION_GAP;
  const loopZ = endZ + LOOP_GAP;
  for (let i = 0; i < STAR_COUNT; i++) {
    items.push({
      kind: 'star',
      key: `star-${i}`,
      z: rand() * loopZ,
      x: (rand() - 0.5) * 3200,
      y: (rand() - 0.5) * 2200,
    });
  }
  return { items, sectionTargets, sectionStarts, endZ, loopZ };
}

export interface World3DHandle {
  goTo: (sectionIdx: number) => void;
}

interface Props {
  sections: SectionDef[];
  onSectionChange: (idx: number) => void;
}

const World3D = forwardRef<World3DHandle, Props>(function World3D({ sections, onSectionChange }, ref) {
  const { t } = useI18n();
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);
  const [hintVisible, setHintVisible] = useState(true);

  // Below this width the cards are stacked down the centre instead of alternating sides.
  const narrow = vw < 760;
  const spread = Math.min(300, Math.max(180, vw * 0.21));
  const layout = useMemo(() => buildLayout(sections, spread, narrow), [sections, spread, narrow]);
  const narrowRef = useRef(narrow);
  narrowRef.current = narrow;
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;

  useImperativeHandle(ref, () => ({
    goTo: (idx: number) => {
      const target = layoutRef.current.sectionTargets[idx];
      if (target !== undefined) window.scrollTo({ top: target / CAM_SPEED, behavior: 'smooth' });
    },
  }));

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const hide = () => {
      if (window.scrollY > 40) setHintVisible(false);
    };
    window.addEventListener('scroll', hide, { passive: true });
    return () => window.removeEventListener('scroll', hide);
  }, []);

  useEffect(() => {
    let raf = 0;
    let cam = window.scrollY * CAM_SPEED;
    let velocity = 0;
    let mouseX = 0;
    let mouseY = 0;
    let currentSection = -1;
    let lastScrollY = window.scrollY;
    let lastScrollAt = performance.now();

    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const frame = () => {
      const { items, sectionStarts, loopZ } = layoutRef.current;
      const now = performance.now();
      if (window.scrollY !== lastScrollY) {
        lastScrollY = window.scrollY;
        lastScrollAt = now;
      }
      // Fold the scroll position back into the first loop once the user pauses (or nears the
      // end of the runway). The view is identical one loop apart, so the jump is invisible.
      const loopPx = loopZ / CAM_SPEED;
      const nearEnd = window.scrollY + window.innerHeight * 2 > document.documentElement.scrollHeight;
      if (window.scrollY >= loopPx && (now - lastScrollAt > 150 || nearEnd)) {
        const loops = Math.floor(window.scrollY / loopPx);
        window.scrollTo({ top: window.scrollY - loops * loopPx, behavior: 'instant' });
        cam -= loops * loopZ;
        lastScrollY = window.scrollY;
      }
      const target = window.scrollY * CAM_SPEED;
      const prev = cam;
      cam += (target - cam) * 0.12;
      if (Math.abs(target - cam) < 0.05) cam = target;
      velocity += (cam - prev - velocity) * 0.2;

      if (worldRef.current) {
        const tiltX = Math.max(-6, Math.min(6, mouseY * 3 - velocity * 0.05));
        const tiltY = Math.max(-6, Math.min(6, mouseX * 3));
        worldRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
      if (viewportRef.current) {
        const fov = 1000 - Math.min(Math.abs(velocity) * 6, 350);
        viewportRef.current.style.perspective = `${fov}px`;
      }

      const camInLoop = ((cam % loopZ) + loopZ) % loopZ;
      let section = 0;
      for (let s = sectionStarts.length - 1; s >= 0; s--) {
        if (camInLoop >= sectionStarts[s] - Z_GAP * 0.5) {
          section = s;
          break;
        }
      }
      if (section !== currentSection) {
        currentSection = section;
        onSectionChangeRef.current(section);
      }

      items.forEach((item, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const vizZ = wrapZ(cam - item.z, loopZ);
        let alpha = 1;
        if (item.kind === 'card') {
          // Only the current card and the next one (on the other side) are visible,
          // so a card never shows through the one in front of it.
          // Centre-stacked cards (narrow screens) would sit right behind each other, so the
          // next one only appears once the current one starts moving past the camera.
          const [hideAt, fullAt] = narrowRef.current ? [-760, -420] : [-1400, -900];
          if (vizZ < hideAt) alpha = 0;
          else if (vizZ < fullAt) alpha = (vizZ - hideAt) / (fullAt - hideAt);
        } else if (vizZ < -2600) alpha = 0;
        else if (vizZ < -1600) alpha = (vizZ + 2600) / 1000;
        if (item.kind !== 'star' && vizZ > 150) alpha = Math.max(0, 1 - (vizZ - 150) / 450);
        if (item.kind === 'star' && vizZ > 900) alpha = 0;

        el.style.opacity = alpha.toFixed(3);
        el.style.visibility = alpha <= 0.01 ? 'hidden' : 'visible';
        if (item.kind === 'card') {
          el.style.pointerEvents = alpha > 0.6 && vizZ > (narrowRef.current ? -420 : -900) ? 'auto' : 'none';
        }
        if (alpha <= 0.01) return;

        let transform = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;
        if (item.kind === 'star') {
          const stretch = Math.max(1, Math.min(1 + Math.abs(velocity) * 0.08, 5));
          transform += ` scale3d(1, 1, ${stretch})`;
        } else if (item.kind === 'text') {
          const shift = Math.max(-8, Math.min(8, velocity * 0.4));
          el.style.textShadow = item.hero || Math.abs(shift) > 0.5 ? `${item.hero ? 3 + shift : shift}px 0 #ff003c, ${item.hero ? -3 - shift : -shift}px 0 #00f3ff` : 'none';
        } else {
          const proximity = Math.min(1, Math.abs(vizZ) / 1500);
          const sway = Math.sin(performance.now() * 0.001 + item.x) * 4 * proximity;
          transform += ` rotateZ(${item.rot * (0.3 + 0.7 * proximity)}deg) rotateY(${sway}deg)`;
        }
        el.style.transform = transform;
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const focusCard = (z: number) => {
    const top = z / CAM_SPEED;
    if (Math.abs(window.scrollY - top) > 4) window.scrollTo({ top, behavior: 'smooth' });
  };

  const bigFont = (text: string) => `min(12vw, ${Math.floor(118 / Math.max(text.length, 1))}vw)`;

  return (
    <>
      <div className="viewport" ref={viewportRef}>
        <div className="world" ref={worldRef}>
          {layout.items.map((item, i) => {
            const setRef = (el: HTMLDivElement | null) => {
              itemRefs.current[i] = el;
            };
            if (item.kind === 'star') return <div key={item.key} ref={setRef} className="item"><div className="star" /></div>;
            if (item.kind === 'text') {
              const text = t(item.textKey);
              return (
                <div key={item.key} ref={setRef} className="item" aria-hidden="true" style={{ opacity: 0 }}>
                  <div className={`big-text${item.hero ? ' big-text-hero' : ''}`} style={{ fontSize: bigFont(text) }}>
                    {text}
                  </div>
                </div>
              );
            }
            const section = sections[item.sectionIdx];
            return (
              <div key={item.key} ref={setRef} className="item" style={{ opacity: 0 }} onFocusCapture={() => focusCard(item.z)} id={item.cardIdx === 0 ? section.id : undefined}>
                <div className="item-inner">{section.cards[item.cardIdx].node}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="scroll-proxy" style={{ height: (layout.loopZ * RUNWAY_LOOPS) / CAM_SPEED + vh }} aria-hidden="true" />
      <div className={`scroll-cue${hintVisible ? '' : ' is-hidden'}`} aria-hidden="true">
        <span className="scroll-cue-label">{t('scroll.hint')}</span>
        <span className="scroll-cue-line" />
      </div>
    </>
  );
});

export default World3D;
