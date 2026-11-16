/* Interazioni di base: leggere, senza dipendenze. Gli effetti GSAP/Lenis sono caricati a parte (motion.ts). */
(window as any).__reveal = true;
const root = document.documentElement;
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
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
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
if (!lite && document.querySelector('[data-parallax], [data-daylight]')) {
  const start = () => import('./motion').then((m) => m.init());
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 600);
}
