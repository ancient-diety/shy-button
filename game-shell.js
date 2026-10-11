(() => {
    const slug = location.pathname.split('/').pop().replace('.html', '');
    if (window === window.top) {
        // Old bookmarks and links use the same cabinet as the home page.
        location.replace(`../index.html#play/${slug}`);
        return;
    }
    document.documentElement.classList.add('in-cabinet');
    document.documentElement.dataset.game = slug;
    document.addEventListener('DOMContentLoaded', () => {
        const help = {
            'alien-attack': 'A / D or arrows: move. SPACE: fire.',
            'sunset-speedway': 'A / D: steer. W / up: go. S / down: brake.',
            'potion-panic': '1 / 2 / 3 or tap a bottle at the dashed line.',
            'moon-mart': '1 / 2 / 3 or tap the matching crate.',
            'haunted-hayride': 'A / D, arrows or hold the buttons to steer.',
            'homework-blaze': 'Click or tap a sheet. Three misses end the round.'
        };
        const hint = document.querySelector('.space-help, .race-help, .potion-help, .mart-help, .hayride-help, .game-help');
        if (hint && help[slug]) hint.textContent = help[slug];
        const instructions = {
            'potion-panic': 'Catch ingredients in the matching bottle at the glowing line (1 / 2 / 3). Five matches brew a potion; three spills end the round.',
            'moon-mart': 'CHILL: milk / cheese. CRUNCH: nuggets / crackers. WIGGLE: pickles / eggs. Three complaints end your shift.',
            'haunted-hayride': 'Dodge pumpkins, hay bales and logs; collect candy. Three scares end the ride!'
        };
        const intro = document.querySelector('#overlay-copy');
        if (intro && instructions[slug]) intro.textContent = instructions[slug];
        if (slug === 'moon-mart') {
            const labels = ['BUCKS', 'ALIENS', 'STREAK', 'MISSES'];
            document.querySelectorAll('.mart-hud > div').forEach((cell, index) => {
                cell.firstChild.textContent = labels[index];
            });
        }
        const firstAction = document.querySelector('#shy-button, #water-button, #start-button, #start-game, #start-race, #start-hayride');
        window.focus();
        firstAction?.focus({ preventScroll: true });
    });
    window.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        parent.postMessage({ type: 'arcade:exit' }, location.protocol === 'file:' ? '*' : location.origin);
    });
})();
