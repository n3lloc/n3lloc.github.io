// Global initialization after lockscreen
window.initExperience = function() {
    initScrollObserver();
    initStarsParallax();

    // Inicia os módulos específicos (se existirem)
    if (window.startTypewriter) window.startTypewriter();
    if (window.initTimeline)    window.initTimeline();
    if (window.generatePolaroids) window.generatePolaroids();
};

// Animações staggered da seção "Escrito nas Estrelas"
function initStarsParallax() {   // mantém o nome para não quebrar nada
    const anims = document.querySelectorAll('.stars-anim');
    if (!anims.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('stars-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    anims.forEach(el => obs.observe(el));
}


function initScrollObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    const elementsToReveal = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    elementsToReveal.forEach(el => observer.observe(el));
}
