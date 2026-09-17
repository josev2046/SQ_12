/*
    grid.js — builds the dynamic parts of the UI: the per-step knob grid
    (CH-A / CH-B / CH-C + LEDs + patch points) and the transpose keyboard.
*/

import { state, tracks, NUM_STEPS, noteNames } from './state.js';
import { initAudio, previewSynth, stopPreview } from './audio.js';
import { updateKnobVisual } from './knobs.js';
import { setOctave, setWaveform } from './controls.js';

async function handlePatchClick(e) {
    await initAudio();
    const step = parseInt(e.target.dataset.step);
    const statusTextDesktop = document.getElementById('resetStatus');
    const statusTextMobile = document.getElementById('resetStatusMobile');
    const is24 = state.activeSeqMode.startsWith('24');

    let txt = "PATCH: NONE";

    if (state.resetStep === step) {
        if (is24) {
            state.resetStep = step + 12;
            e.target.classList.remove('patched');
            e.target.classList.add('patched-b');
            txt = `EXT: STEP ${state.resetStep + 1}`;
        } else {
            state.resetStep = null;
            e.target.classList.remove('patched', 'patched-b');
        }
    } else if (state.resetStep === step + 12) {
        state.resetStep = null;
        e.target.classList.remove('patched-b');
    } else {
        document.querySelectorAll('.patch-point').forEach(el => el.classList.remove('patched', 'patched-b'));
        state.resetStep = step;
        e.target.classList.add('patched');
        txt = `RESET: STEP ${step + 1}`;
    }

    if (statusTextDesktop) statusTextDesktop.innerText = txt;
    if (statusTextMobile) statusTextMobile.innerText = txt;
}

export function renderGrid() {
    ['ledRow', 'rowA', 'rowB', 'rowC', 'trigRow'].forEach(id => document.getElementById(id).innerHTML = '');
    for (let i = 0; i < NUM_STEPS; i++) {
        document.getElementById('ledRow').innerHTML += `<div class="w-[56px] flex justify-center step-indicator" data-step="${i}"><div class="led"></div></div>`;

        ['A', 'B', 'C'].forEach(ch => {
            const isBipolar = (ch === 'A' || ch === 'B');
            const defaultVal = isBipolar ? 0 : 2.5;
            const labelsHTML = isBipolar ?
                `<span class="tick-label label-left">-5</span><span class="tick-label label-top">0</span><span class="tick-label label-right">+5</span>` :
                `<span class="tick-label label-left">0</span><span class="tick-label label-right">+5</span>`;

            document.getElementById(`row${ch}`).innerHTML += `
                <div class="knob-wrapper">
                    <div class="tick-container">
                        <div class="tick-ring"></div>
                        ${labelsHTML}
                        <div class="knob" data-ch="${ch}" data-step="${i}" data-val="${defaultVal}"></div>
                    </div>
                </div>`;
        });

        const patchPoint = document.createElement('div');
        patchPoint.className = 'patch-point';
        patchPoint.dataset.step = i;
        patchPoint.addEventListener('click', handlePatchClick);

        const patchContainer = document.createElement('div');
        patchContainer.className = 'w-[56px] flex justify-center';
        patchContainer.appendChild(patchPoint);
        document.getElementById('trigRow').appendChild(patchContainer);
    }

    document.querySelectorAll('.knob[data-ch]').forEach(k => {
        const ch = k.dataset.ch;
        const val = (ch === 'C') ? 2.5 : 0;
        updateKnobVisual(k, val);
    });
    updateKnobVisual(document.getElementById('clockSpeed'), 50);
    updateKnobVisual(document.getElementById('portamento'), 0);
    updateKnobVisual(document.getElementById('pitchTuneKnob'), 50);
    updateKnobVisual(document.getElementById('envAttack'), 5);
    updateKnobVisual(document.getElementById('envDecay'), 30);
    updateKnobVisual(document.getElementById('envSustain'), 20);
    updateKnobVisual(document.getElementById('envRelease'), 25);

    setOctave(1);
    setWaveform(0);
}

export function renderKeyboard() {
    const container = document.getElementById('keyboardContainer');
    container.innerHTML = '';

    const keys = [
        { note: 'C', isBlack: false, offset: 0 },
        { note: 'C#', isBlack: true, offset: 1 },
        { note: 'D', isBlack: false, offset: 2 },
        { note: 'D#', isBlack: true, offset: 3 },
        { note: 'E', isBlack: false, offset: 4 },
        { note: 'F', isBlack: false, offset: 5 },
        { note: 'F#', isBlack: true, offset: 6 },
        { note: 'G', isBlack: false, offset: 7 },
        { note: 'G#', isBlack: true, offset: 8 },
        { note: 'A', isBlack: false, offset: 9 },
        { note: 'A#', isBlack: true, offset: 10 },
        { note: 'B', isBlack: false, offset: 11 },
        { note: 'C', isBlack: false, offset: 12 }
    ];

    let whiteIndex = 0;
    keys.forEach(k => {
        const btn = document.createElement('button');
        btn.dataset.offset = k.offset;

        if (k.isBlack) {
            btn.className = `key-black absolute w-5 h-10 text-[8px] font-bold flex items-end justify-center pb-1 ${k.offset === state.transposeSemitones ? 'active-key' : ''}`;
            btn.style.left = `${(whiteIndex * 24) - 10}px`;
        } else {
            btn.className = `key-white w-6 h-16 text-[9px] font-bold flex items-end justify-center pb-1 ${k.offset === state.transposeSemitones ? 'active-key' : ''}`;
            whiteIndex++;
        }

        btn.innerText = k.note;
        btn.addEventListener('pointerdown', async (e) => {
            await initAudio();
            state.transposeSemitones = parseInt(e.target.dataset.offset);

            document.querySelectorAll('#keyboardContainer button').forEach(el => el.classList.remove('active-key'));
            e.target.classList.add('active-key');

            let pVal = tracks.A[0] * state.voltageRangeMultiplier;

            const totalSemitone = Math.round(pVal * 12) + state.transposeSemitones + state.octaveOffsetSemitones + Math.round(state.finePitchTuneSemitones);
            const totalNote = 24 + totalSemitone;
            const noteIndex = ((totalNote % 12) + 12) % 12;
            const octave = Math.floor(totalNote / 12);
            const noteStr = `NOTE: ${noteNames[noteIndex]}${octave}`;

            document.getElementById('dispStep').innerText = 'STEP: KB';
            document.getElementById('dispVolt').innerText = `VOLT: ${pVal >= 0 ? '+' : ''}${pVal.toFixed(2)}`;
            document.getElementById('dispNote').innerText = noteStr;

            if (document.getElementById('dispStepMobile')) {
                document.getElementById('dispStepMobile').innerText = 'STEP: KB';
                document.getElementById('dispVoltMobile').innerText = `VOLT: ${pVal >= 0 ? '+' : ''}${pVal.toFixed(2)}`;
                document.getElementById('dispNoteMobile').innerText = noteStr;
            }

            if (!state.isPlaying) {
                let fVal = tracks.C[0];
                previewSynth(pVal, fVal, true);
            }
        });

        btn.addEventListener('pointerup', () => stopPreview());
        btn.addEventListener('pointercancel', () => stopPreview());

        container.appendChild(btn);
    });
}
