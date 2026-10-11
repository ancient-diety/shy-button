# Sunset Arcade

A tiny retro game corner with sunset colors and pixel-inspired details. Pick a game from the home page:

- **Catch the Shy Button** — catch it after five little hops.
- **A Tiny Garden** — water a plant until it blooms, then grow another.
- **Homework Blaze** — click the falling math sheets to burn them before they hit the desk.
- **Alien Attack** — fly a pixel ship, clear alien waves, and take on the boss.
- **Sunset Speedway** — choose a pixel car, race three laps, and avoid the other drivers.
- **Potion Panic** — catch falling ingredients in their matching bottles and brew potions.
- **Moon Mart Night Shift** — sort strange alien groceries into the right crate before checkout.
- **Haunted Hayride** — steer a tractor down a straight moonlit farm road, dodge spooky obstacles, and collect candy.

Open [the arcade](https://ancient-diety.github.io/shy-button/) to play.

## Play locally

Open `index.html` in a browser, or serve this folder with any static file server. No build step or JavaScript packages are required. The pixel font loads from Google Fonts when online; Courier New is used as a fallback.

All eight games play inside the home page's arcade screen. Pick a game with the arrows, dots, or a swipe, then choose **Start Game**. The carousel also supports left/right arrow keys when focused. Each game keeps its own keyboard and touch controls.

- **Games** or **Escape** returns to that game's preview and restores keyboard focus.
- **Restart** reloads the current game from its ready screen. Saved records stay on the device.
- Browser Back/Forward works between selection and play. A URL such as `index.html#play/moon-mart` opens a game directly, and existing `games/*.html` links redirect to the same cabinet.
- On short viewports the cabinet scrolls vertically to keep the screen and controls usable.

## Page structure

`index.html` contains the cabinet and previews. `arcade-shell.js` manages selection, game URLs, and a single game iframe; `arcade-shell.css` styles its toolbar and responsive shell. Returning to the menu, switching games, or restarting removes the old iframe, destroying that game's timers and event handlers.

The files in `games/` still own their artwork and gameplay. Shared `game-shell.js` and `game-shell.css` adapt them to the small screen, focus the first action, and handle Escape. The SVG viewBoxes, game coordinates, rules, and saved-record keys are unchanged.

## Checking changes

There is no package-based build or test suite. Check JavaScript syntax, then use a local browser to exercise all eight previews and games, direct links, Back/Forward, Restart, Escape, keyboard and pointer controls, and repeated game switching. Check both desktop and narrow/short viewports, including that the current game is the only iframe and removed games stop executing. Let live-reload servers finish reloading after edits before testing a round.

## Favicon

The pages use the uploaded pixel star image, `Pixel Star Gamer Icon.png`, as their favicon.
