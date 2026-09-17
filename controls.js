/*
    controls.js — the panel's button banks (not knobs, not transport).

    setWaveform / setOctave are exported because grid.js and demos.js need to
    call them directly (grid.js sets the default state on first render,
    demos.js resets them when loading a preset).
*/

import { state, waveforms } from './state.js';
import { updateActiveMode } from './state.js';
import { initAudio } from './audio.js';

export function setWaveform(idx) {
    state.activeWaveform = waveforms[idx];
    if (state.synthOsc) state.synthOsc.type = state.activeWaveform;
    document.querySelectorAll('#waveBtnBank .wave-btn').forEach(btn => {
        btn.classList.toggle('wave-active', parseInt(btn.dataset.wave) === idx);
    });
}

document.querySelectorAll('#waveBtnBank .wave-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        await initAudio();
        setWaveform(parseInt(e.currentTarget.dataset.wave));
    });
});

export function setOctave(octIdx) {
    state.octaveOffsetSemitones = (octIdx - 1) * 12;
    document.querySelectorAll('#octaveBtnBank .oct-btn').forEach(btn => {
        btn.classList.toggle('oct-active', parseInt(btn.dataset.oct) === octIdx);
    });
}

document.querySelectorAll('#octaveBtnBank .oct-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        await initAudio();
        setOctave(parseInt(e.target.dataset.oct));
    });
});

document.getElementById('lengthRockerBtn').addEventListener('click', async (e) => {
    await initAudio();
    const btn = e.currentTarget;
    if (btn.classList.contains('volt-toggle-top')) {
        btn.classList.replace('volt-toggle-top', 'volt-toggle-bottom');
        state.currentLength = '24';
    } else {
        btn.classList.replace('volt-toggle-bottom', 'volt-toggle-top');
        state.currentLength = '12';
    }
    updateActiveMode();
});

document.querySelectorAll('#playModeBank .mode-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        await initAudio();
        state.currentPlayMode = e.target.dataset.play;
        document.querySelectorAll('#playModeBank .mode-btn').forEach(b => {
            b.classList.toggle('mode-active', b.dataset.play === state.currentPlayMode);
        });
        updateActiveMode();
    });
});

document.getElementById('voltRockerBtn').addEventListener('click', async (e) => {
    await initAudio();
    const btn = e.currentTarget;
    if (btn.classList.contains('volt-toggle-top')) {
        btn.classList.replace('volt-toggle-top', 'volt-toggle-bottom');
        state.voltageRangeMultiplier = 0.2;
    } else {
        btn.classList.replace('volt-toggle-bottom', 'volt-toggle-top');
        state.voltageRangeMultiplier = 1;
    }
});

document.querySelectorAll('#chCDestBank .dest-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        await initAudio();
        state.activeChCDest = e.target.dataset.dest;
        document.querySelectorAll('#chCDestBank .dest-btn').forEach(b => {
            b.classList.toggle('dest-active', b.dataset.dest === state.activeChCDest);
        });
    });
});
