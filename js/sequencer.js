/*
    sequencer.js — transport controls and the look-ahead scheduler that
    walks the step counter and fires triggerSynth() on each beat.
*/

import { state, tracks } from './state.js';
import { initAudio, triggerSynth } from './audio.js';
import { updateDisplay } from './display.js';

export function stopSequencer() {
    state.isPlaying = false;
    clearTimeout(state.timerId);
    state.currentStep = -1;
    document.querySelectorAll('.step-indicator').forEach(el => el.classList.remove('active'));
    document.getElementById('pilotA').classList.remove('pilot-active');
    document.getElementById('pilotB').classList.remove('pilot-active');

    const startBtn = document.getElementById('startStop');
    startBtn.classList.remove('is-active');
    document.getElementById('rockerLed').classList.replace('bg-red-200', 'bg-red-400');
    document.getElementById('rockerLed').classList.replace('opacity-100', 'opacity-60');

    updateDisplay(-1, 0);
}

function updateUIForStep(is24) {
    const uiStep = state.currentStep % 12;

    document.querySelectorAll('.step-indicator').forEach(el => el.classList.remove('active'));
    document.querySelector(`.step-indicator[data-step="${uiStep}"]`).classList.add('active');

    document.getElementById('pilotA').classList.remove('pilot-active');
    document.getElementById('pilotB').classList.remove('pilot-active');

    if (is24) {
        if (state.currentStep < 12) document.getElementById('pilotA').classList.add('pilot-active');
        else document.getElementById('pilotB').classList.add('pilot-active');
    } else {
        document.getElementById('pilotA').classList.add('pilot-active');
        document.getElementById('pilotB').classList.add('pilot-active');
    }

    let pVal = is24 ? (state.currentStep < 12 ? tracks.A[uiStep] : tracks.B[uiStep]) : tracks.A[uiStep];
    pVal *= state.voltageRangeMultiplier;
    updateDisplay(state.currentStep, pVal);
}

export function scheduleNextStep(manual = false, direction = 1) {
    const is24 = state.activeSeqMode.startsWith('24');
    const maxSteps = is24 ? 24 : 12;

    if (direction === 1) {
        state.currentStep++;

        if (state.currentStep >= maxSteps) {
            if (state.activeSeqMode.endsWith('one') && !manual) {
                stopSequencer();
                return;
            }
            state.currentStep = 0;
        }

        if (state.resetStep !== null) {
            const hardwareMatch = (state.resetStep < 12) && ((state.currentStep % 12) === state.resetStep);
            const absoluteMatch = (state.resetStep >= 12) && (state.currentStep === state.resetStep);

            if (hardwareMatch || absoluteMatch) {
                if (state.activeSeqMode.endsWith('one') && !manual) {
                    stopSequencer();
                    return;
                }
                state.currentStep = 0;
            }
        }
    } else {
        state.currentStep--;

        if (state.currentStep < 0) {
            if (state.resetStep !== null) {
                state.currentStep = state.resetStep - 1;
            } else {
                state.currentStep = maxSteps - 1;
            }
        }
    }

    updateUIForStep(is24);

    const uiStep = state.currentStep % 12;
    let pVal = is24 ? (state.currentStep < 12 ? tracks.A[uiStep] : tracks.B[uiStep]) : tracks.A[uiStep];
    pVal *= state.voltageRangeMultiplier;

    let fVal = tracks.C[uiStep];

    triggerSynth(pVal, fVal, manual ? state.audioCtx.currentTime : state.nextNoteTime);
}

async function scheduler() {
    if (!state.isPlaying || state.activeSeqMode.endsWith('step')) return;

    if (state.audioCtx && state.audioCtx.state === 'suspended') {
        await state.audioCtx.resume();
    }

    while (state.nextNoteTime < state.audioCtx.currentTime + 0.1) {
        scheduleNextStep(false, 1);

        let currentStepDuration = (60.0 / state.bpm) * 0.25;

        if (state.activeChCDest === 'clock') {
            const uiStep = state.currentStep === -1 ? 0 : state.currentStep % 12;
            const cMod = tracks.C[uiStep] / 2.5;
            currentStepDuration = currentStepDuration * Math.max(0.1, (2.1 - cMod));
        }

        state.nextNoteTime += currentStepDuration;
    }
    state.timerId = setTimeout(scheduler, 25);
}

document.getElementById('startStop').addEventListener('click', async (e) => {
    await initAudio();
    const btn = e.currentTarget;
    const led = document.getElementById('rockerLed');

    if (state.isPlaying) {
        stopSequencer();
    } else if (!state.activeSeqMode.endsWith('step')) {
        state.isPlaying = true;
        btn.classList.add('is-active');
        led.classList.replace('bg-red-400', 'bg-red-200');
        led.classList.replace('opacity-60', 'opacity-100');
        state.nextNoteTime = state.audioCtx.currentTime + 0.05;
        scheduler();
    }
});

document.getElementById('stepAdv').addEventListener('click', async () => {
    await initAudio();
    scheduleNextStep(true, 1);
});

document.getElementById('stepRev').addEventListener('click', async () => {
    await initAudio();
    scheduleNextStep(true, -1);
});
