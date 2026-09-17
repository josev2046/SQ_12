/*
    demos.js — the two "load a preset" buttons. Kept separate from the rest
    of the UI logic so new demo patches can be added here without touching
    the transport, grid, or knob code.
*/

import { state, tracks, updateActiveMode } from './state.js';
import { initAudio } from './audio.js';
import { updateKnobVisual } from './knobs.js';
import { setOctave, setWaveform } from './controls.js';

document.getElementById('demo1Btn').addEventListener('click', async () => {
    await initAudio();
    state.voltageRangeMultiplier = 1;
    const voltRocker = document.getElementById('voltRockerBtn');
    voltRocker.className = "volt-rocker volt-toggle-top";

    state.currentLength = '24';
    state.currentPlayMode = 'cont';
    updateActiveMode();
    document.getElementById('lengthRockerBtn').className = "volt-rocker volt-toggle-bottom";
    document.querySelectorAll('#playModeBank .mode-btn').forEach(b => {
        b.classList.toggle('mode-active', b.dataset.play === 'cont');
    });

    state.activeChCDest = 'filter';
    document.querySelectorAll('#chCDestBank .dest-btn').forEach(b => {
        b.classList.toggle('dest-active', b.dataset.dest === 'filter');
    });

    setOctave(1);
    setWaveform(0);
    state.finePitchTuneSemitones = 0;

    state.attackTime = 0.01; state.decayTime = 0.15; state.sustainLevel = 0.2; state.releaseTime = 0.2;

    const dafA = [-0.58, -1.00, 0.25, -1.00, 0.00, -1.00, -1.00, 0.00, -1.00, 0.00, -1.00, 0.00];
    const dafB = [-0.17, -1.00, 0.00, -1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];

    for (let i = 0; i < 12; i++) {
        tracks.A[i] = dafA[i];
        tracks.B[i] = dafB[i];
        tracks.C[i] = 2.5;

        let knobA = document.querySelector(`.knob[data-ch="A"][data-step="${i}"]`);
        let knobB = document.querySelector(`.knob[data-ch="B"][data-step="${i}"]`);
        let knobC = document.querySelector(`.knob[data-ch="C"][data-step="${i}"]`);

        knobA.dataset.val = dafA[i];
        knobB.dataset.val = dafB[i];
        knobC.dataset.val = 2.5;

        updateKnobVisual(knobA, dafA[i]);
        updateKnobVisual(knobB, dafB[i]);
        updateKnobVisual(knobC, 2.5);
    }

    const speedKnob = document.getElementById('clockSpeed');
    speedKnob.dataset.val = 35;
    state.bpm = 40 + (35 / 100) * 200;
    updateKnobVisual(speedKnob, 35);

    const portaKnob = document.getElementById('portamento');
    portaKnob.dataset.val = 0;
    state.portamentoTime = 0.01;
    updateKnobVisual(portaKnob, 0);

    updateKnobVisual(document.getElementById('pitchTuneKnob'), 50);
    updateKnobVisual(document.getElementById('envAttack'), 5);
    updateKnobVisual(document.getElementById('envDecay'), 30);
    updateKnobVisual(document.getElementById('envSustain'), 20);
    updateKnobVisual(document.getElementById('envRelease'), 25);

    state.resetStep = 16;
    document.querySelectorAll('.patch-point').forEach(el => el.classList.remove('patched', 'patched-b'));

    const targetPatch = document.querySelector('.patch-point[data-step="4"]');
    if (targetPatch) targetPatch.classList.add('patched-b');

    const statusTextDesktop = document.getElementById('resetStatus');
    const statusTextMobile = document.getElementById('resetStatusMobile');
    if (statusTextDesktop) statusTextDesktop.innerText = "EXT: STEP 17";
    if (statusTextMobile) statusTextMobile.innerText = "EXT: STEP 17";
});

document.getElementById('demo2Btn').addEventListener('click', async () => {
    await initAudio();
    state.voltageRangeMultiplier = 1;
    const voltRocker = document.getElementById('voltRockerBtn');
    voltRocker.className = "volt-rocker volt-toggle-top";

    state.currentLength = '12';
    state.currentPlayMode = 'cont';
    updateActiveMode();
    document.getElementById('lengthRockerBtn').className = "volt-rocker volt-toggle-top";
    document.querySelectorAll('#playModeBank .mode-btn').forEach(b => {
        b.classList.toggle('mode-active', b.dataset.play === 'cont');
    });

    state.activeChCDest = 'filter';
    document.querySelectorAll('#chCDestBank .dest-btn').forEach(b => {
        b.classList.toggle('dest-active', b.dataset.dest === 'filter');
    });

    setOctave(1);
    setWaveform(0);
    state.finePitchTuneSemitones = 0;

    state.attackTime = 0.005; state.decayTime = 0.12; state.sustainLevel = 0.1; state.releaseTime = 0.08;

    const acidA = [-1.00, 0.00, 0.25, -1.00, 0.58, 0.00, -0.17, -1.00, 0.83, 1.00, 0.00, -1.00];
    const acidC = [4.00, 1.00, 2.50, 4.50, 0.50, 2.50, 3.50, 2.00, 5.00, 0.20, 2.50, 3.00];

    for (let i = 0; i < 12; i++) {
        tracks.A[i] = acidA[i];
        tracks.B[i] = 0;
        tracks.C[i] = acidC[i];

        let knobA = document.querySelector(`.knob[data-ch="A"][data-step="${i}"]`);
        let knobB = document.querySelector(`.knob[data-ch="B"][data-step="${i}"]`);
        let knobC = document.querySelector(`.knob[data-ch="C"][data-step="${i}"]`);

        knobA.dataset.val = acidA[i];
        knobB.dataset.val = 0;
        knobC.dataset.val = acidC[i];

        updateKnobVisual(knobA, acidA[i]);
        updateKnobVisual(knobB, 0);
        updateKnobVisual(knobC, acidC[i]);
    }

    const speedKnob = document.getElementById('clockSpeed');
    speedKnob.dataset.val = 50;
    state.bpm = 40 + (50 / 100) * 200;
    updateKnobVisual(speedKnob, 50);

    const portaKnob = document.getElementById('portamento');
    portaKnob.dataset.val = 0;
    state.portamentoTime = 0.01;
    updateKnobVisual(portaKnob, 0);

    updateKnobVisual(document.getElementById('pitchTuneKnob'), 50);
    updateKnobVisual(document.getElementById('envAttack'), 2);
    updateKnobVisual(document.getElementById('envDecay'), 20);
    updateKnobVisual(document.getElementById('envSustain'), 10);
    updateKnobVisual(document.getElementById('envRelease'), 10);

    state.resetStep = null;
    document.querySelectorAll('.patch-point').forEach(el => el.classList.remove('patched', 'patched-b'));

    const statusTextDesktop = document.getElementById('resetStatus');
    const statusTextMobile = document.getElementById('resetStatusMobile');
    if (statusTextDesktop) statusTextDesktop.innerText = "PATCH: NONE";
    if (statusTextMobile) statusTextMobile.innerText = "PATCH: NONE";
});
