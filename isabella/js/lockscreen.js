document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const lockscreen    = document.getElementById('lockscreen');
    const experience    = document.getElementById('experience');
    const errorMsg      = document.getElementById('error-msg');

    // Máscara automática: converte dígitos em DD/MM/AAAA enquanto digita
    passwordInput.addEventListener('input', (e) => {
        let digits = e.target.value.replace(/\D/g, '');
        if (digits.length > 8) digits = digits.slice(0, 8);

        let formatted = '';
        if (digits.length <= 2) {
            formatted = digits;
        } else if (digits.length <= 4) {
            formatted = digits.slice(0, 2) + '/' + digits.slice(2);
        } else {
            formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
        }

        e.target.value = formatted;
        hideError();

        if (digits === '10042026') {
            unlockExperience();
        }
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const digits = passwordInput.value.replace(/\D/g, '');
            if (digits !== '10042026') showError();
        }
    });

    function showError() {
        const inputGroup = document.querySelector('.input-group');
        inputGroup.classList.remove('shake');
        void inputGroup.offsetWidth;
        inputGroup.classList.add('shake');
        errorMsg.classList.add('show');
        setTimeout(() => inputGroup.classList.remove('shake'), 600);
        passwordInput.value = '';
    }

    function hideError() {
        errorMsg.classList.remove('show');
    }

    function unlockExperience() {
        passwordInput.blur();

        // 1. Inicia música ANTES da transição visual
        if (window.playBackgroundMusic) {
            window.playBackgroundMusic();
        }

        // 2. Prepara o experience invisível mas já no DOM (para o player aparecer)
        experience.classList.remove('hidden');
        experience.style.opacity = '0';
        experience.style.transition = 'none';

        // 3. Faz o lockscreen desaparecer suavemente
        lockscreen.classList.add('fade-out');
        document.body.style.overflow = 'hidden';

        // 4. Após a transição do lockscreen completar, remove-o e faz experience aparecer
        //    O lockscreen tem transition: 2s (definido no CSS via .fade-out)
        setTimeout(() => {
            lockscreen.style.display = 'none';

            // Fade-in suave do experience
            experience.style.transition = 'opacity 1.2s ease';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    experience.style.opacity = '1';
                });
            });

            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';

            if (window.initExperience) {
                window.initExperience();
            }
        }, 2100); // aguarda a transição de 2s do lockscreen + margem
    }

    passwordInput.focus();
});
