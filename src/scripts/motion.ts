/* Effetti di scorrimento: GSAP ScrollTrigger + Lenis. Caricato solo su dispositivi capaci e senza "riduci movimento". */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function init() {
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;
  root.classList.add('gsap');

  // Scorrimento fluido solo con mouse/trackpad (su touch resta quello nativo, più naturale).
  if (matchMedia('(pointer: fine)').matches) {
    const lenis = new Lenis({ duration: 1.15, easing: (t: number) => 1 - Math.pow(1 - t, 3.2), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    // Le ancore interne usano Lenis
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href')!;
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); lenis.scrollTo(t as HTMLElement, { offset: -80 }); }
      }),
    );
    document.querySelectorAll('dialog').forEach((d) => {
      new MutationObserver(() => (d.open ? lenis.stop() : lenis.start())).observe(d, { attributes: true, attributeFilter: ['open'] });
    });
  }

  // Parallasse leggera sulle foto (montagne, sezioni della giornata).
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const target = el.querySelector('img') ?? el;
    const amount = Number(el.dataset.parallax || 8);
    gsap.set(target, { scale: 1 + amount / 50 });
    gsap.fromTo(target, { yPercent: -amount }, {
      yPercent: amount, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });

  // Hero: la foto si allontana e il testo sfuma con calma mentre si scorre.
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    const media = hero.querySelector('img');
    const copy = hero.querySelector('[data-hero-copy]');
    if (media) gsap.fromTo(media, { scale: 1.08 }, { scale: 1, yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } });
    if (copy) gsap.to(copy, { opacity: 0, yPercent: -12, ease: 'none', scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: 0.8 } });
  }

  // La giornata: il sole segue lo scorrimento dall'alba al tramonto, l'ora cambia a ogni momento.
  const day = document.querySelector<HTMLElement>('[data-daylight]');
  const dial = document.querySelector<HTMLElement>('[data-sundial]');
  if (day && dial) {
    const clock = dial.querySelector<HTMLElement>('[data-sundial-time]');
    const label = dial.querySelector<HTMLElement>('[data-sundial-label]');
    ScrollTrigger.create({
      trigger: day, start: 'top 60%', end: 'bottom 40%',
      onUpdate: (st) => dial.style.setProperty('--p', st.progress.toFixed(4)),
      onToggle: (st) => dial.classList.toggle('on', st.isActive),
    });
    gsap.utils.toArray<HTMLElement>('[data-moment]').forEach((m) => {
      ScrollTrigger.create({
        trigger: m, start: 'top 55%', end: 'bottom 55%',
        onToggle: (st) => {
          if (!st.isActive) return;
          if (clock) clock.textContent = m.dataset.time || '';
          if (label) label.textContent = m.dataset.label || '';
          dial.dataset.sky = m.dataset.sky || '';
        },
      });
    });
  }

  // Titoli delle sezioni: compaiono parola per parola, con calma.
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((h) => {
    if (h.dataset.splitDone) return;
    h.dataset.splitDone = '1';
    const words = h.innerHTML.split(/(\s+|<br\s*\/?>)/).map((w) =>
      /^\s+$|^<br/.test(w) || w === '' ? w : `<span class="w"><span>${w}</span></span>`,
    );
    h.innerHTML = words.join('');
    gsap.from(h.querySelectorAll('.w > span'), {
      yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: h, start: 'top 88%' },
    });
  });

  ScrollTrigger.refresh();
}
