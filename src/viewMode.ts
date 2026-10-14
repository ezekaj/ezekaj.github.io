import { useCallback, useEffect, useState } from 'react';

export type ViewMode = '3d' | 'static';

const STORAGE_KEY = 'ez-view';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function canRun3D(): boolean {
  const mq = (q: string) => window.matchMedia?.(q).matches ?? false;
  if (mq('(prefers-reduced-motion: reduce)')) return false;
  if (window.innerWidth < 900 || window.innerHeight < 560) return false;
  if (!mq('(pointer: fine)')) return false;
  if (typeof CSS === 'undefined' || !CSS.supports('transform-style', 'preserve-3d')) return false;
  if (!hasWebGL()) return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  return true;
}

function readOverride(): ViewMode | null {
  const param = new URLSearchParams(window.location.search).get('view');
  if (param === '3d' || param === 'static') return param;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '3d' || stored === 'static') return stored;
  } catch {
    /* storage unavailable */
  }
  return null;
}

export function useViewMode() {
  const [mode, setModeState] = useState<ViewMode>(() => readOverride() ?? (canRun3D() ? '3d' : 'static'));

  useEffect(() => {
    if (readOverride()) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (!readOverride()) setModeState(canRun3D() ? '3d' : 'static');
    };
    reduce.addEventListener?.('change', onChange);
    window.addEventListener('resize', onChange);
    return () => {
      reduce.removeEventListener?.('change', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.view = mode;
  }, [mode]);

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    window.scrollTo(0, 0);
  }, []);

  return { mode, setMode };
}
