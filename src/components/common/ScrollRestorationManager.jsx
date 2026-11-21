import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_STORAGE_PREFIX = 'azraq_scroll_pos_';
const PATH_STORAGE_PREFIX = 'azraq_path_scroll_';

/**
 * AZRAQ Centralized Scroll Restoration Manager
 * 
 * Manages scroll restoration across desktop and mobile devices:
 * - Distinguishes POP (Back/Forward), PUSH, and REPLACE navigation.
 * - Saves exact scroll coordinates separately for each history entry key.
 * - Restores exact scroll coordinates upon POP navigation after waiting for
 *   the target page to mount and document height to settle.
 * - Survives page refreshes via sessionStorage persistence.
 * - Preserves native user interactions without jumping.
 */
export default function ScrollRestorationManager() {
  const location = useLocation();
  const navType = useNavigationType(); // 'POP' | 'PUSH' | 'REPLACE'
  const prevPathnameRef = useRef(location.pathname);
  const activeRestorationTimerRef = useRef(null);
  const currentScrollRef = useRef({ x: 0, y: 0 });

  // 1. Enforce manual scroll restoration so browser native engine doesn't fight our manager
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Track current scroll coordinates continuously with passive listener
  useEffect(() => {
    const handleScroll = () => {
      currentScrollRef.current = {
        x: window.scrollX || window.pageXOffset || 0,
        y: window.scrollY || window.pageYOffset || 0
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3. Save scroll position for the current location key before route change or unload
  useEffect(() => {
    const locKey = location.key || 'default';
    const locPath = location.pathname + location.search;

    const savePosition = () => {
      const pos = currentScrollRef.current;
      try {
        sessionStorage.setItem(`${SCROLL_STORAGE_PREFIX}${locKey}`, JSON.stringify(pos));
        sessionStorage.setItem(`${PATH_STORAGE_PREFIX}${locPath}`, JSON.stringify(pos));
      } catch (e) {
        // Safe fallback in restricted iframe/private storage modes
      }
    };

    const handleBeforeUnload = () => {
      savePosition();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      savePosition();
    };
  }, [location.key, location.pathname, location.search]);

  // 4. Handle Scroll Restoration on Route Transitions
  useEffect(() => {
    const locKey = location.key || 'default';
    const locPath = location.pathname + location.search;
    const isSamePath = prevPathnameRef.current === location.pathname;
    prevPathnameRef.current = location.pathname;

    // Clear any pending scroll restoration timers from previous transition
    if (activeRestorationTimerRef.current) {
      clearTimeout(activeRestorationTimerRef.current);
      activeRestorationTimerRef.current = null;
    }

    // A. Handle POP Navigation (Browser Back or Forward pressed)
    if (navType === 'POP') {
      let savedPos = null;
      try {
        const rawKey = sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}${locKey}`);
        if (rawKey) {
          savedPos = JSON.parse(rawKey);
        } else {
          const rawPath = sessionStorage.getItem(`${PATH_STORAGE_PREFIX}${locPath}`);
          if (rawPath) savedPos = JSON.parse(rawPath);
        }
      } catch (e) {
        savedPos = null;
      }

      if (savedPos && (savedPos.y > 0 || savedPos.x > 0)) {
        let isCancelled = false;
        let attempts = 0;
        const maxAttempts = 60; // Up to ~1.8s waiting for lazy components / catalog hydration
        const targetX = savedPos.x;
        const targetY = savedPos.y;

        // Cancel automatic restoration if the customer touches or wheels manually
        const cancelRestoration = () => {
          isCancelled = true;
          window.removeEventListener('wheel', cancelRestoration);
          window.removeEventListener('touchstart', cancelRestoration);
        };

        window.addEventListener('wheel', cancelRestoration, { passive: true, once: true });
        window.addEventListener('touchstart', cancelRestoration, { passive: true, once: true });

        const checkAndRestore = () => {
          if (isCancelled) return;

          const docHeight = Math.max(
            document.documentElement?.scrollHeight || 0,
            document.body?.scrollHeight || 0,
            document.documentElement?.clientHeight || 0
          );
          const viewportHeight = window.innerHeight || 800;

          // Sufficient document height reached or retry limit reached
          const isHeightReady = (docHeight >= targetY + 30) || (docHeight >= targetY);

          if (isHeightReady || attempts >= maxAttempts) {
            window.scrollTo({
              left: targetX,
              top: targetY,
              behavior: 'instant'
            });

            // Verification frame to counter dynamic image reflows
            requestAnimationFrame(() => {
              if (!isCancelled) {
                window.scrollTo({
                  left: targetX,
                  top: targetY,
                  behavior: 'instant'
                });
              }
            });
            return;
          }

          attempts++;
          activeRestorationTimerRef.current = setTimeout(checkAndRestore, 30);
        };

        // Trigger first check
        activeRestorationTimerRef.current = setTimeout(checkAndRestore, 10);
        return () => {
          isCancelled = true;
          if (activeRestorationTimerRef.current) {
            clearTimeout(activeRestorationTimerRef.current);
          }
          window.removeEventListener('wheel', cancelRestoration);
          window.removeEventListener('touchstart', cancelRestoration);
        };
      }
      return;
    }

    // B. Handle PUSH Navigation (New page or section visited)
    if (navType === 'PUSH') {
      if (location.hash) {
        const id = location.hash.replace('#', '');
        let retries = 0;
        const scrollToAnchor = () => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (retries < 15) {
            retries++;
            activeRestorationTimerRef.current = setTimeout(scrollToAnchor, 50);
          }
        };
        activeRestorationTimerRef.current = setTimeout(scrollToAnchor, 30);
      } else {
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      }
      return;
    }

    // C. Handle REPLACE Navigation
    if (navType === 'REPLACE') {
      // If staying on the same page (e.g. updating URL search parameters), do NOT reset scroll
      if (isSamePath) {
        return;
      }
      if (location.hash) {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      }
    }
  }, [location.pathname, location.search, location.hash, location.key, navType]);

  return null;
}
