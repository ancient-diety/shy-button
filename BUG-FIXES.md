# Game bugs found and fixed

Findings from the code review, fixed in `face2d9`. The games keep their existing layout, colours and artwork.

## Catch the Shy Button

The button could be caught too early or end up partly outside its play area.

- A click could trigger the greeting before all five hops were finished. On a touchscreen, the same tap could make the button hop and catch it. The game now checks that the hops are complete and stops an escape tap from also counting as a catch.
- Using the keyboard could skip the chase entirely. Keyboard presses now go through the five hops before showing the greeting.
- Shrinking the window or changing the button's text could leave it partly cut off. Its position is now adjusted to keep it inside the play area.

## A Tiny Garden

Watering quickly could interrupt the plant's growing animation.

- Each drink started a separate countdown to end the animation. An earlier drink's countdown could finish while a newer drink was still making the plant grow. Only the latest drink now controls when the animation ends.
- Starting another plant immediately after blooming could carry the old animation into the new seedling. Growing another plant now clears that animation straight away.

## Homework Blaze

Sheets could appear in the wrong place, and missed pages were counted too late.

- The game worked out a sheet's size while it was hidden, which made it seem to have no width or height. That could place new sheets partly outside the scene. It now measures their actual size and leaves space at both sides.
- A new sheet could briefly appear where the previous one had been. Each sheet now gets its starting position before it begins falling.
- The game watched the top of the sheet to decide when it had reached the desk. This allowed most of the page to disappear behind the desk before counting a miss. It now counts the miss when the bottom reaches the desk.

## Alien Attack

Hits, wave changes and restarts could produce inconsistent results.

- More than one shot could claim points for the same small alien if they hit almost together. A defeated alien is now immediately excluded from further hits.
- Defeating the mothership did not end the game immediately. Another attack could still hit the player before the win was recognised. The final hit now awards the victory and bonus straight away.
- The game could continue checking attacks after the player had already lost. It now stops those checks as soon as the game ends.
- Players could fire during the break between waves, and attacks could still be processed as a new wave was announced. Wave breaks now pause that action consistently.
- Restarts could briefly show old explosion effects or leave the ship faded or in its previous position. A new mission now clears those leftovers and resets the ship immediately.
- Switching tabs could use up firing delays or temporary protection while the player was away. Those countdowns now pause with the game. Leaving the game or restarting also clears held controls, including buttons that still looked pressed.
- Releasing Shift before releasing A or D could leave movement stuck on. Uppercase and lowercase letters now count as the same key.

## Sunset Speedway

Driving controls could stay active or look pressed after the player stopped using them.

- Releasing Shift before a driving key could leave the game thinking that key was still held. Uppercase and lowercase letters are now handled together so releasing the key stops the action.
- Leaving the game, finishing a race or restarting could leave a control looking pressed. Those actions now clear the controls and their pressed appearance together.
- Switching tabs now explicitly pauses the race and resumes it from the point where the player left. Driving buttons only activate during a race.

## Potion Panic

Ingredients and splash effects had timing glitches.

- A new ingredient could briefly appear in the corner before moving to its chute. Its starting position is now set as soon as it appears.
- At the exact point an ingredient became too late to catch, its bottle could still be marked ready. The ready signal now follows the same deadline as the catch.
- The final spill stopped every animation immediately, leaving splash pieces frozen behind the game-over message. The round now ends while the remaining splash finishes and disappears.

## Moon Mart Night Shift

Scanner flashes and mistake effects could interfere with newer actions or a fresh shift.

- An earlier scanner flash could turn off a newer flash before it had finished. Starting a flash now cancels the previous countdown, giving the latest flash its full duration.
- Restarting quickly could carry shaking, button highlights or an old flash countdown into the next shift. A new shift now clears those leftovers before groceries start arriving.

## Haunted Hayride

Steering could stop unexpectedly, and returning to the game could leave controls in the wrong state.

- Holding both A and the left arrow, then releasing either one, stopped left steering even though the other was still held. The game now remembers each key separately. The same fix applies to right steering.
- Switching away or starting another ride now clears held steering controls and their pressed appearance.
- Repeated notices that the page was hidden could make the game forget it should resume. It now remembers that an active ride was paused until the player returns, and clears that reminder for a new ride.

## Saved scores and race times

Invalid saved records could display strange values or become impossible to beat.

- The six games that save records accepted some impossible values, such as negative scores or an endless best score. Those values could spoil the display or prevent a new record from being saved.
- Saved records are now checked before use. Invalid scores start at zero, and an invalid race time is treated as having no previous record. Valid records are kept.
