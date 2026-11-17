/* Effetti di scorrimento: GSAP ScrollTrigger + Lenis. Caricato solo su dispositivi capaci e senza "riduci movimento". */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/** Divide un titolo in righe reali (come vanno a capo sullo schermo) per farle salire una alla volta. */
function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.textContent || '';
  el.setAttribute('aria-label', text.trim());
  el.innerHTML = text.trim().split(/\s+/).map((w) => `<span class="w" aria-hidden="true" style="display:inline-block">${w}</span>`).join(' ');
  const rows: HTMLElement[][] = [];
  let top = -1;
  el.querySelectorAll<HTMLElement>('.w').forEach((w) => {
    if (Math.abs(w.offsetTop - top) > 4) { rows.push([]); top = w.offsetTop; }
    rows[rows.length - 1].push(w);
  });
  el.innerHTML = rows.map((r) => `<span class="line" aria-hidden="true"><span>${r.map((w) => w.textContent).join(' ')}</span></span>`).join('');
  return Array.from(el.querySelectorAll<HTMLElement>('.line > span'));
}

export function init() {
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;
  root.classList.add('gsap');
  const desktop = matchMedia('(min-width: 900px)').matches;

  // Scorrimento fluido solo con mouse/trackpad (su touch resta quello nativo).
  if (matchMedia('(pointer: fine)').matches) {
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 3.4), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href')!;
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); lenis.scrollTo(t as HTMLElement, { offset: -70 }); }
      }),
    );
    document.querySelectorAll('dialog').forEach((d) => {
      new MutationObserver(() => (d.open ? lenis.stop() : lenis.start())).observe(d, { attributes: true, attributeFilter: ['open'] });
    });
  }

  // 1 · Titoli che salgono riga per riga
  const doLines = () => gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((h) => {
    if (h.dataset.done) return;
    h.dataset.done = '1';
    if (h.getBoundingClientRect().top < innerHeight * 0.9) return; // già visibile: non toccare
    const lines = splitLines(h);
    gsap.from(lines, { yPercent: 108, duration: 1.25, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  (document as any).fonts?.ready ? (document as any).fonts.ready.then(doLines) : doLines();

  // 2 · Parallasse leggera sulle foto
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const target = el.querySelector('img') ?? el;
    const amount = Number(el.dataset.parallax || 8);
    gsap.fromTo(target, { yPercent: -amount, scale: 1 + amount / 45 }, { yPercent: amount, scale: 1 + amount / 45, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  });
  // Elementi che scorrono a velocità diversa (griglia da rivista)
  gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
    if (!desktop) return;
    gsap.to(el, { y: () => -Number(el.dataset.speed) * 120, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  });

  // 3 · Hero: la foto si allontana, il testo sfuma
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    const media = hero.querySelector('[data-hero-media] img');
    const copy = hero.querySelector('[data-hero-copy]');
    if (media) gsap.to(media, { yPercent: 12, scale: 1.06, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } });
    if (copy) gsap.to(copy, { opacity: 0, yPercent: -10, ease: 'none', scrollTrigger: { trigger: hero, start: '40% top', end: 'bottom top', scrub: 0.8 } });
  }

  // 4 · Galleria orizzontale: la sezione resta ferma e le foto scorrono (solo desktop)
  if (desktop) {
    gsap.utils.toArray<HTMLElement>('[data-hscroll]').forEach((hs) => {
      const track = hs.querySelector<HTMLElement>('.hs-track')!;
      const pinEl = (hs.closest('[data-hscroll-pin]') as HTMLElement) || hs;
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: pinEl, start: 'center center', end: () => '+=' + dist(), pin: pinEl, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 } });
    });
  }

  // 5 · Passaggi di colore tra i capitoli della giornata
  const flows = gsap.utils.toArray<HTMLElement>('[data-bg]');
  if (flows.length) {
    root.classList.add('flow');
    const base = getComputedStyle(document.body).backgroundColor;
    flows.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 62%', end: 'bottom 62%',
        onToggle: (st) => { if (st.isActive) gsap.to(document.body, { backgroundColor: sec.dataset.bg!, duration: 0.9, ease: 'power2.out', overwrite: true }); },
        onLeaveBack: () => { if (sec === flows[0]) gsap.to(document.body, { backgroundColor: base, duration: 0.9, overwrite: true }); },
      });
    });
  }

  // 6 · Numeri giganti che scorrono di lato
  gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
    gsap.fromTo(el, { xPercent: Number(el.dataset.drift) }, { xPercent: -Number(el.dataset.drift), ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
  ScrollTrigger.refresh();
}
