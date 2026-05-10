// ═══════════════════════════════════════════════════════
// TIMELINE — Motor de Animação (CSS Line Edition)
// Sem SVG getTotalLength(). Linha CSS height% + dot top%.
// ═══════════════════════════════════════════════════════

window.initTimeline = function () {
    applyPolaroidTilts();
    initPolaroidFlip();
    initTimelineLine();
};

// ── Tilts artesanais ────────────────────────────────────
function applyPolaroidTilts() {
    const tilts = [-3, 2, -1.5, 3.5, -2, 1, -3.5, 2.5, -1, 3, -2.5, 1.5];
    document.querySelectorAll('.polaroid').forEach((p, i) => {
        p.style.setProperty('--tilt', `${tilts[i % tilts.length]}deg`);
    });
}

// ── Linha CSS + revelação de cards ─────────────────────
function initTimelineLine() {
    const lineFill = document.getElementById('tl-line-fill');
    const dotCss   = document.getElementById('tl-dot-css');
    const section  = document.getElementById('section-timeline');
    if (!lineFill || !section) return;

    const items      = Array.from(section.querySelectorAll('.tl-entry'));
    let thresholds   = [];
    let lastProgress = -1;

    // Threshold de cada card = posição vertical do centro / altura da seção
    // Dispara o card quando a linha já chegou ali (- 0.01 para aparecer junto)
    function calcThresholds() {
        const sectionH = section.offsetHeight;
        if (sectionH === 0) return;
        thresholds = items.map(item => {
            const mid = item.offsetTop + item.offsetHeight / 2;
            return Math.max(0, mid / sectionH - 0.01);
        });
    }

    function updateLine() {
        const rect     = section.getBoundingClientRect();
        const sectionH = section.offsetHeight;
        const viewH    = window.innerHeight;

        if (sectionH === 0) return;

        // Progresso: 0 quando o topo da timeline cruza o meio da tela
        // 1 quando o fundo da timeline cruza o meio da tela
        // Isso sincroniza exatamente com o `calcThresholds` que usa o centro de cada card.
        const startY   = viewH / 2;
        const raw      = (startY - rect.top) / sectionH;
        const progress = Math.min(1, Math.max(0, raw));

        if (Math.abs(progress - lastProgress) < 0.0003) return;
        lastProgress = progress;

        // Cresce a linha (height em %)
        const pct = (progress * 100).toFixed(2);
        lineFill.style.height = pct + '%';


        // Desloca o dot para a ponta da linha
        if (dotCss) {
            if (progress > 0.005) {
                dotCss.style.top     = pct + '%';
                dotCss.style.opacity = '1';
            } else {
                dotCss.style.opacity = '0';
            }
        }

        // Revela cards conforme a linha chega
        if (!thresholds.length) calcThresholds();
        items.forEach((item, i) => {
            const threshold = thresholds[i] ?? (i / Math.max(items.length, 1));
            if (progress >= threshold && !item.classList.contains('tl-visible')) {
                item.classList.add('tl-visible');
            }
        });
    }

    // Scroll handler com rAF
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { updateLine(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });

    // Inicializações escalonadas para garantir que o layout assentou
    [100, 500, 1000, 2000].forEach(ms =>
        setTimeout(() => { calcThresholds(); updateLine(); }, ms)
    );
}

// ── Flip das Polaroids ──────────────────────────────────
function initPolaroidFlip() {
    const polaroids = document.querySelectorAll('.polaroid');
    const isTouch   = window.matchMedia('(hover: none)').matches;

    polaroids.forEach(p => {
        if (isTouch) {
            p.addEventListener('click', () => p.classList.toggle('flipped'));
        } else {
            p.addEventListener('mouseenter', () => p.classList.add('flipped'));
            p.addEventListener('mouseleave', () => p.classList.remove('flipped'));
        }
    });

    if (isTouch) showTouchHint();
}

function showTouchHint() {
    const first = document.querySelector('.polaroid');
    if (!first?.parentElement) return;
    const hint = document.createElement('p');
    hint.className = 'tl-touch-hint';
    hint.textContent = 'toque para ver o verso';
    first.parentElement.appendChild(hint);
    setTimeout(() => {
        hint.style.opacity = '0';
        setTimeout(() => hint.remove(), 1100);
    }, 4500);
}
