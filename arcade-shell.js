(() => {
    const cabinet = document.querySelector('.arcade-cabinet');
    const carousel = document.querySelector('#game-carousel');
    const slides = Array.from(carousel.querySelectorAll('.game-slide'));
    const games = slides.map(slide => ({
        title: slide.querySelector('h2').textContent,
        path: slide.querySelector('.start-link').getAttribute('href'),
        slug: slide.querySelector('.start-link').getAttribute('href').split('/').pop().replace('.html', '')
    }));
    const previousButton = document.querySelector('#previous-game');
    const nextButton = document.querySelector('#next-game');
    const pageCount = document.querySelector('#page-count');
    const dots = document.querySelector('#page-dots');
    const pager = document.querySelector('.screen-pager');
    const player = document.querySelector('#game-player');
    const slot = document.querySelector('#game-frame-slot');
    const title = document.querySelector('#playing-title');
    const label = document.querySelector('#screen-label');
    const status = document.querySelector('#screen-status-text');
    let activeIndex = 0;
    let currentFrame = null;
    let scrollFrame = 0;
    let scrollTarget = null;

    function setActive(index, scroll = true, smooth = true) {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            const active = slideIndex === activeIndex;
            slide.setAttribute('aria-hidden', String(!active));
            slide.inert = !active;
            dots.children[slideIndex].setAttribute('aria-current', String(active));
        });
        pageCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        if (scroll) {
            scrollTarget = activeIndex;
            carousel.scrollTo({
                left: activeIndex * carousel.clientWidth,
                behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant'
            });
        }
    }

    function selectGame(index, scroll = true) {
        if (currentFrame) return;
        setActive(index, scroll);
        history.replaceState(null, '', `#select/${games[activeIndex].slug}`);
    }

    function unloadGame() {
        // Destroy the browsing context, including its animation frames, timers,
        // held controls and event listeners. Never keep hidden games running.
        if (currentFrame) currentFrame.remove();
        currentFrame = null;
    }

    function loadGame(index) {
        unloadGame();
        const game = games[index];
        const frame = document.createElement('iframe');
        frame.className = 'game-frame';
        frame.title = `${game.title} game`;
        frame.src = `${game.path}?embed=1`;
        currentFrame = frame;
        slot.append(frame);
    }

    function showRoute() {
        const route = /^#(play|select)\/([a-z-]+)$/.exec(location.hash);
        const found = route ? games.findIndex(game => game.slug === route[2]) : -1;
        const index = found < 0 ? 0 : found;
        const playing = found >= 0 && route[1] === 'play';
        const wasPlaying = Boolean(currentFrame);
        const sameGame = wasPlaying && index === activeIndex;
        cabinet.classList.toggle('is-playing', playing);
        player.hidden = !playing;
        carousel.hidden = playing;
        pager.hidden = playing;
        previousButton.hidden = playing;
        nextButton.hidden = playing;
        label.textContent = playing ? 'NOW PLAYING' : 'SELECT YOUR GAME';
        status.textContent = playing ? 'ESC TO GAMES / FREE PLAY' : 'INSERT COIN? JUST KIDDING \u00b7 FREE!';
        document.title = playing ? `${games[index].title} \u00b7 Sunset Arcade` : 'Sunset Arcade';
        if (playing) {
            setActive(index, false);
            title.textContent = games[index].title;
            if (!sameGame) loadGame(index);
        } else {
            unloadGame();
            setActive(index, true, false);
            if (wasPlaying) slides[index].querySelector('.start-link').focus({ preventScroll: true });
        }
    }

    function exitGame() {
        if (currentFrame) location.hash = `select/${games[activeIndex].slug}`;
    }

    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'page-dot';
        dot.setAttribute('aria-label', `Go to game ${index + 1}: ${games[index].title}`);
        dot.addEventListener('click', () => selectGame(index));
        dots.append(dot);
        slide.querySelector('.start-link').addEventListener('click', event => {
            // Modified clicks retain the original, shareable game-page URL.
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
            event.preventDefault();
            history.replaceState(null, '', `#select/${games[index].slug}`);
            location.hash = `play/${games[index].slug}`;
        });
    });
    previousButton.addEventListener('click', () => selectGame(activeIndex - 1));
    nextButton.addEventListener('click', () => selectGame(activeIndex + 1));
    document.querySelector('#exit-game').addEventListener('click', exitGame);
    document.querySelector('#restart-game').addEventListener('click', () => loadGame(activeIndex));
    carousel.addEventListener('scroll', () => {
        if (currentFrame || scrollFrame || !carousel.clientWidth) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = 0;
            if (currentFrame || !carousel.clientWidth) return;
            if (scrollTarget !== null) {
                if (Math.abs(carousel.scrollLeft - scrollTarget * carousel.clientWidth) > 2) return;
                scrollTarget = null;
            }
            const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
            if (index !== activeIndex && index >= 0 && index < slides.length) selectGame(index, false);
        });
    }, { passive: true });
    carousel.addEventListener('pointerdown', () => { scrollTarget = null; });
    carousel.addEventListener('wheel', () => { scrollTarget = null; }, { passive: true });
    carousel.addEventListener('keydown', event => {
        if (event.target !== carousel) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            selectGame(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    window.addEventListener('keydown', event => {
        if (event.key === 'Escape' && currentFrame) {
            event.preventDefault();
            exitGame();
        }
    });
    window.addEventListener('message', event => {
        if (!currentFrame || event.source !== currentFrame.contentWindow) return;
        const origin = location.protocol === 'file:' ? 'null' : location.origin;
        if (event.origin !== origin) return;
        if (event.data?.type === 'arcade:exit') exitGame();
    });
    window.addEventListener('hashchange', showRoute);
    window.addEventListener('resize', () => {
        if (!currentFrame) setActive(activeIndex, true, false);
    });
    showRoute();
})();
