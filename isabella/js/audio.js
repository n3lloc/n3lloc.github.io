window.initAudio = function() {
    const bgMusic = document.getElementById('bg-music');
    const cardMusic = document.getElementById('card-music');
    const globalPlayer = document.getElementById('global-player');
    const spotifyCards = document.querySelectorAll('.spotify-card');
    
    if (!bgMusic || !globalPlayer) return;

    // Playlist e Estado
    const playlist = [
        { file: "Coisas De Quem Ama - Jorge & Mateus.mp3", title: "Coisas de Quem Ama", artist: "Jorge & Mateus" },
        { file: "Velha Infância - Tribalistas.mp3", title: "Velha Infância", artist: "Tribalistas" },
        { file: "Oceano - Djavan.mp3", title: "Oceano", artist: "Djavan" },
        { file: "Pra Sempre Com Você - Jorge & Mateus.mp3", title: "Pra Sempre Com Você", artist: "Jorge & Mateus" },
        { file: "Apaguei Pra Todos - Ferrugem part. Sorriso Maroto.mp3", title: "Apaguei Pra Todos", artist: "Ferrugem, Sorriso Maroto" }
    ];
    let currentTrackIdx = 0;
    let isBgPlaying = false;
    let fadeInterval = null;

    // Controles do Player
    const trackTitle   = document.getElementById('track-title');
    const trackArtist  = document.getElementById('track-artist');
    const coverArt     = document.querySelector('.player-cover');
    const btnPlayPause = document.getElementById('btn-playpause');
    const btnPrev      = document.getElementById('btn-prev');
    const btnNext      = document.getElementById('btn-next');
    const volumeSlider = document.getElementById('volume-slider');

    function applyMarquee(el) {
        // 1. Remove a classe e o transform em linha para resetar o estado
        el.classList.remove('marquee');
        el.style.transform = '';

        // 2. Duplo rAF: garante que o browser redesenhou antes de medir
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const wrap = el.parentElement;
                if (!wrap) return;
                const overflow = el.scrollWidth - wrap.offsetWidth;
                if (overflow > 2) {
                    el.style.setProperty('--marquee-dist', `-${overflow + 4}px`);
                    el.classList.add('marquee');
                }
            });
        });
    }

    function loadTrack(index) {
        currentTrackIdx = index;
        const track = playlist[index];
        bgMusic.src = `assets/audio/${track.file}`;
        trackTitle.textContent  = track.title;
        trackArtist.textContent = track.artist;
        applyMarquee(trackTitle);
        applyMarquee(trackArtist);
        updatePlayPauseUI();
    }

    function playTrack() {
        bgMusic.play().then(() => {
            isBgPlaying = true;
            updatePlayPauseUI();
            if (coverArt) coverArt.classList.remove('paused');
        }).catch(e => console.log(e));
    }

    function pauseTrack() {
        bgMusic.pause();
        isBgPlaying = false;
        updatePlayPauseUI();
        if (coverArt) coverArt.classList.add('paused');
    }

    function updatePlayPauseUI() {
        if (isBgPlaying) {
            btnPlayPause.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
        } else {
            btnPlayPause.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        }
    }

    // Inicializa a primeira música
    loadTrack(currentTrackIdx);
    if (coverArt) coverArt.classList.add('paused'); // Inicia pausado visualmente

    // Eventos de Navegação
    btnPrev.addEventListener('click', () => {
        currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIdx);
        if (isBgPlaying) playTrack();
    });

    btnNext.addEventListener('click', () => {
        currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
        loadTrack(currentTrackIdx);
        if (isBgPlaying) playTrack();
    });

    btnPlayPause.addEventListener('click', () => {
        if (isBgPlaying) pauseTrack();
        else playTrack();
    });

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });

    bgMusic.addEventListener('ended', () => {
        btnNext.click(); // Avança e entra em loop naturalmente
    });

    // Função global chamada pelo Lockscreen.js ao desbloquear
    window.playBackgroundMusic = function() {
        const targetVol = 0.5;
        volumeSlider.value = targetVol; // Sincroniza o slider visualmente
        bgMusic.volume = 0;
        globalPlayer.classList.remove('hidden');
        bgMusic.play().then(() => {
            isBgPlaying = true;
            if (coverArt) coverArt.classList.remove('paused');
            updatePlayPauseUI();
            fadeAudio(bgMusic, targetVol, 2000);
        }).catch(err => console.log("Áudio bloqueado:", err));
    };

    // Lógica dos Spotify Cards (Audio Ducking)
    spotifyCards.forEach(card => {
        card.addEventListener('click', () => {
            const audioSrc = card.getAttribute('data-audio-src');
            if (!audioSrc) return;

            const isCurrentlyPlayingThisCard = card.classList.contains('playing');

            // Pausa música do card atual
            cardMusic.pause();
            spotifyCards.forEach(c => c.classList.remove('playing'));

            if (isCurrentlyPlayingThisCard) {
                resumeBackgroundMusic();
            } else {
                card.classList.add('playing');
                cardMusic.src = audioSrc;
                cardMusic.volume = 1;
                
                if (isBgPlaying) {
                    fadeAudio(bgMusic, 0.05, 500); // Ducking para 5%
                }
                cardMusic.play().catch(e => console.log(e));
            }
        });
    });

    cardMusic.addEventListener('ended', () => {
        spotifyCards.forEach(c => c.classList.remove('playing'));
        resumeBackgroundMusic();
    });

    function resumeBackgroundMusic() {
        if (isBgPlaying) {
            fadeAudio(bgMusic, parseFloat(volumeSlider.value), 1000);
        }
    }

    // Utilitário de Fade In/Out
    function fadeAudio(audio, targetVolume, duration, callback) {
        clearInterval(fadeInterval);
        const startVolume = audio.volume;
        const distance = targetVolume - startVolume;
        const steps = 20;
        const stepTime = duration / steps;
        let currentStep = 0;

        fadeInterval = setInterval(() => {
            currentStep++;
            const newVol = startVolume + (distance * (currentStep / steps));
            audio.volume = Math.max(0, Math.min(1, newVol));

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.volume = targetVolume;
                if (callback) callback();
            }
        }, stepTime);
    }
};

// Inicializar o áudio assim que o script carregar (prepara as funções)
document.addEventListener('DOMContentLoaded', window.initAudio);
