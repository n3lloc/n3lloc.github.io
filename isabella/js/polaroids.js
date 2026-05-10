window.generatePolaroids = function() {
    const grid = document.getElementById('polaroid-grid');
    if (!grid) return;

    // PLACEHOLDERS: Basta adicionar novos objetos para criar mais fotos
    const memories = [
        {
            image: '', // URL da imagem futuramente
            caption: 'Nossa primeira foto?',
            backText: 'Aqui você pode colocar uma piada interna sobre o dia em que se conheceram no trabalho.',
            rotation: -3 // Rotação aleatória leve para dar um ar orgânico
        },
        {
            image: '',
            caption: 'Barreiras, BA',
            backText: 'Sob o sol da Bahia, no seu aniversário. Onde tudo ficou mais claro.',
            rotation: 2
        },
        {
            image: '',
            caption: '10/04',
            backText: 'O beijo que mudou as rotas dos nossos destinos. Desde então, nunca mais nos desgrudamos.',
            rotation: -2
        },
        {
            image: '',
            caption: 'Aquele dia...',
            backText: 'Apenas mais uma foto aleatória, mas que com você se torna uma memória perfeita.',
            rotation: 4
        }
    ];

    memories.forEach((mem, index) => {
        // Criação do elemento
        const wrapper = document.createElement('div');
        wrapper.className = 'polaroid-wrapper reveal-up';
        wrapper.style.transitionDelay = `${index * 0.1}s`;
        
        // Estrutura HTML da Polaroid
        wrapper.innerHTML = `
            <div class="polaroid" style="transform: rotate(${mem.rotation}deg)">
                <!-- Frente da Polaroid -->
                <div class="polaroid-front">
                    <div class="polaroid-img image-placeholder">
                        <span>[Foto ${index + 1}]</span>
                    </div>
                    <div class="polaroid-caption">${mem.caption}</div>
                </div>
                
                <!-- Verso da Polaroid -->
                <div class="polaroid-back">
                    <p>${mem.backText}</p>
                </div>
            </div>
        `;

        // Interação de Flip (Mobile & Desktop)
        wrapper.addEventListener('click', () => {
            wrapper.classList.toggle('flipped');
        });

        grid.appendChild(wrapper);
    });
    
    // Re-inicia o Observer para as novas polaroids adicionadas ao DOM
    if (window.initScrollObserver) {
        // Um pequeno timeout garante que elas foram renderizadas
        setTimeout(() => {
            const newElements = document.querySelectorAll('.polaroid-wrapper.reveal-up');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('active');
                });
            }, { threshold: 0.1 });
            
            newElements.forEach(el => observer.observe(el));
        }, 100);
    }
};
