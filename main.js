/*
    main.js — entry point, loaded via <script type="module" src="js/main.js">.

    Importing audio.js / display.js / knobs.js / controls.js / sequencer.js /
    demos.js runs their top-level code once (event listener registration).
    Import order doesn't matter here: every listener either uses event
    delegation on `document` or targets static elements already present in
    index.html. grid.js's render functions are called explicitly last,
    exactly like the original script's final two lines.
*/

import './audio.js';
import './display.js';
import './knobs.js';
import './controls.js';
import './sequencer.js';
import './demos.js';
import { renderGrid, renderKeyboard } from './grid.js';

renderGrid();
renderKeyboard();
