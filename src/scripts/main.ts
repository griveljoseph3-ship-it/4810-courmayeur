/* Interazioni di base: leggere, senza dipendenze. Gli effetti GSAP/Lenis sono caricati a parte (motion.ts). */
(window as any).__reveal = true;
const root = document.documentElement;
(document as any).fonts?.ready?.then(() => root.classList.add('fonts-ready'));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header: trasparente sull'hero, solido dopo lo scroll; si nasconde scendendo ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  if (header) {
    header.classList.toggle('scrolled', y > 40);
    const goingDown = y > lastY && y > 400;
    header.classList.toggle('hide', goingDown && !document.querySelector('dialog[open]'));
  }
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Dialog: menu e "oggi" ---------- */
function wireDialog(openSel: string, closeSel: string, dialogId: string) {
  const dlg = document.getElementById(dialogId) as HTMLDialogElement | null;
  if (!dlg) return;
  document.querySelectorAll(openSel).forEach((b) =>
    b.addEventListener('click', () => {
      dlg.showModal();
      root.style.overflow = 'hidden';
      b.setAttribute('aria-expanded', 'true');
    }),
  );
  dlg.querySelectorAll(closeSel).forEach((b) => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => {
    root.style.overflow = '';
    document.querySelectorAll(openSel).forEach((b) => b.setAttribute('aria-expanded', 'false'));
  });
  dlg.querySelectorAll('a[href^="#"], a[href*="#"]').forEach((a) => a.addEventListener('click', () => dlg.close()));
}
wireDialog('[data-menu-open]', '[data-menu-close]', 'site-menu');
wireDialog('[data-sheet-open]', '[data-sheet-close]', 'today-sheet');

/* ---------- Spazio per la barra in basso (mobile) ---------- */
const dock = document.querySelector<HTMLElement>('[data-dock]');
const setDock = () => {
  const h = dock && window.innerWidth < 900 ? dock.offsetHeight : 0;
  root.style.setProperty('--dock-h', `${h}px`);
};
setDock();
window.addEventListener('resize', setDock, { passive: true });

/* ---------- Comparsa morbida dei blocchi ---------- */
if (root.classList.contains('motion')) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  document.querySelectorAll('[data-reveal], [data-mask]').forEach((el) => io.observe(el));
}

/* ---------- Metà fissa: l'immagine cambia quando arriva il pannello di testo ---------- */
const panels = document.querySelectorAll<HTMLElement>('[data-swap-trigger]');
if (panels.length && 'IntersectionObserver' in window) {
  const sw = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const k = (e.target as HTMLElement).dataset.swapTrigger;
    const scope = (e.target as HTMLElement).closest('[data-swap-scope]') || document;
    scope.querySelectorAll<HTMLElement>('[data-swap]').forEach((im) => im.classList.toggle('on', im.dataset.swap === k));
  }), { rootMargin: '-45% 0px -45% 0px' });
  panels.forEach((p) => sw.observe(p));
}

/* ---------- Indice dei capitoli (home) ---------- */
const chapLinks = document.querySelectorAll<HTMLAnchorElement>('[data-chap-link]');
if (chapLinks.length && 'IntersectionObserver' in window) {
  const nav = document.querySelector<HTMLElement>('[data-chap-nav]');
  const co = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    chapLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-50% 0px -50% 0px' });
  document.querySelectorAll('[data-chapter]').forEach((c) => co.observe(c));
  const day = document.querySelector('[data-day]');
  if (day && nav) new IntersectionObserver((es) => es.forEach((e) => nav.classList.toggle('show', e.isIntersecting)), { rootMargin: '-50% 0px -50% 0px' }).observe(day);
}

/* ---------- Moduli che preparano una email (niente server, niente dati salvati) ---------- */
document.querySelectorAll<HTMLFormElement>('form[data-mailto]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const to = (data.get('_to') as string) || form.dataset.mailto!;
    const subject = form.dataset.subject || '';
    const lines: string[] = [];
    form.querySelectorAll<HTMLInputElement>('[name]:not([name^="_"])').forEach((f) => {
      const label = form.querySelector(`label[for="${f.id}"]`)?.textContent?.trim() || f.name;
      const v = data.get(f.name);
      if (v) lines.push(`${label}: ${v}`);
    });
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
});

/* ---------- Filtro zone hotel ---------- */
const chips = document.querySelectorAll<HTMLButtonElement>('[data-zone-filter]');
chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    const z = chip.dataset.zoneFilter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll<HTMLElement>('[data-zone]').forEach((g) => {
      g.hidden = !(z === 'all' || g.dataset.zone === z);
    });
  }),
);

/* ---------- Effetti avanzati solo dove servono e dove il dispositivo regge ---------- */
const nav = navigator as any;
const lite =
  reduced ||
  nav.connection?.saveData ||
  /(^|-)2g|3g/.test(nav.connection?.effectiveType || '') ||
  (nav.deviceMemory && nav.deviceMemory <= 2) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
root.classList.toggle('lite', !!lite);
if (!lite && document.querySelector('[data-parallax], [data-lines], [data-hscroll], [data-bg], [data-hero]')) {
  let started = false;
  const start = () => { if (started) return; started = true; import('./motion').then((m) => m.init()); };
  // Sul telefono gli effetti partono al primo gesto (o dopo 3 s): l'apertura della pagina resta leggera.
  const touch = !matchMedia('(pointer: fine)').matches;
  if (touch) {
    ['scroll', 'touchstart', 'pointerdown'].forEach((e) => addEventListener(e, start, { once: true, passive: true }));
    setTimeout(start, 3000);
  } else if ('requestIdleCallback' in window) (window as any).requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 600);
}
