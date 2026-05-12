/* ============================================
   VIVEK RATHOD — PORTFOLIO MOTION LAYER
   Motion One (vanilla) via ESM CDN.
   Owns: hero-title per-word stagger, grid reveals,
   spring-damped card tilt, spring magnetic buttons.
   ============================================ */

import { animate, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion@12/+esm';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

document.addEventListener('DOMContentLoaded', () => {
    if (reduced) return;

    heroTitleStagger();

    // Timeline + cert categories use a simple translateY reveal (their CSS
    // transform is `translateY(var(--reveal-ty))`, so we animate the var).
    revealViaVar('.timeline', '.timeline-item', '--reveal-ty', '30px', '0px',
        { duration: 0.6, gap: 0.12, amount: 0.05 });
    revealViaVar('.certs-grid', '.cert-category', '--reveal-ty', '30px', '0px',
        { duration: 0.5, gap: 0.1, amount: 0.1 });

    // Expertise + AI cards use the unified tilt-ty var (same transform
    // pipeline as the hover tilt), so reveal and tilt never fight.
    revealViaVar('.expertise-grid', '.expertise-card', '--tilt-ty', '30px', '0px',
        { duration: 0.5, gap: 0.08, amount: 0.1 });
    revealViaVar('.ai-grid', '.ai-card', '--tilt-ty', '30px', '0px',
        { duration: 0.5, gap: 0.08, amount: 0.1 });

    springCardTilt('.expertise-card, .ai-card, .interest-card');
    springMagneticButton('.btn-primary');
});

/* Hero title — staggered per-word reveal.
   CSS keeps .title-word at opacity:0/y:40 until JS runs. */
function heroTitleStagger() {
    const words = document.querySelectorAll('.title-word');
    if (!words.length) return;
    animate(
        words,
        { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
        {
            duration: 0.7,
            delay: stagger(0.14, { start: 0.15 }),
            ease: EASE_OUT_EXPO,
        }
    );
}

/* Reveal pattern that animates a CSS custom property + opacity.
   Uses inView so it fires once when the container enters viewport. */
function revealViaVar(containerSel, childSel, varName, from, to, { duration, gap, amount }) {
    const container = document.querySelector(containerSel);
    if (!container) return;
    const children = container.querySelectorAll(childSel);
    if (!children.length) return;

    inView(
        container,
        () => {
            animate(
                children,
                { opacity: [0, 1], [varName]: [from, to] },
                { duration, delay: stagger(gap), ease: EASE_OUT_EXPO }
            );
        },
        { amount }
    );
}

/* Spring-damped 3D tilt via CSS variables.
   CSS owns the transform string; Motion only springs the angle values. */
function springCardTilt(selector) {
    document.querySelectorAll(selector).forEach((card) => {
        let raf = 0;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                animate(
                    card,
                    {
                        '--tilt-rx': `${(-ny * 6).toFixed(2)}deg`,
                        '--tilt-ry': `${(nx * 8).toFixed(2)}deg`,
                        '--tilt-ty': '-4px',
                    },
                    { type: 'spring', stiffness: 280, damping: 22, mass: 0.6 }
                );
            });
        });
        card.addEventListener('mouseleave', () => {
            cancelAnimationFrame(raf);
            animate(
                card,
                { '--tilt-rx': '0deg', '--tilt-ry': '0deg', '--tilt-ty': '0px' },
                { type: 'spring', stiffness: 180, damping: 22 }
            );
        });
    });
}

/* Spring magnetic button — pulls toward cursor, settles on leave.
   Uses `x`/`y` shorthand (confirmed supported by Motion's output pipeline). */
function springMagneticButton(selector) {
    document.querySelectorAll(selector).forEach((btn) => {
        let raf = 0;
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                animate(btn, { x, y }, { type: 'spring', stiffness: 320, damping: 20 });
            });
        });
        btn.addEventListener('mouseleave', () => {
            cancelAnimationFrame(raf);
            animate(btn, { x: 0, y: 0 }, { type: 'spring', stiffness: 220, damping: 24 });
        });
    });
}
