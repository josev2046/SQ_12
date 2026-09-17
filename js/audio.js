/*
    audio.js — everything that touches the Web Audio API.

    Owns: AudioContext lifecycle, the oscillator -> filter -> VCA -> analyser
    signal chain, the oscilloscope draw loop, and the two ways a note gets
    played (previewSynth for knob/keyboard interaction, triggerSynth for the
    sequencer clock).
*/

import { state } from './state.js';

export async function initAudio() {
    if (!state.audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        state.audioCtx = new AudioCtxClass();

        state.synthOsc = state.audioCtx.createOscillator();
        state.synthVcf = state.audioCtx.createBiquadFilter();
        state.synthVca = state.audioCtx.createGain();
        state.analyser = state.audioCtx.createAnalyser();

        state.synthOsc.type = state.activeWaveform;
        state.synthVcf.type = 'lowpass';
        state.synthVcf.Q.value = 12;
        state.synthVca.gain.value = 0;

        state.analyser.fftSize = 256;

        state.synthOsc.connect(state.synthVcf);
        state.synthVcf.connect(state.synthVca);
        state.synthVca.connect(state.analyser);
        state.analyser.connect(state.audioCtx.destination);

        state.synthOsc.start();
        drawScope();
    }
    if (state.audioCtx.state === 'suspended') {
        await state.audioCtx.resume();
    }
}

function drawToCanvas(canvas, dataArray, bufferLength) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#041004';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

export function drawScope() {
    requestAnimationFrame(drawScope);
    if (!state.analyser) return;

    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    state.analyser.getByteTimeDomainData(dataArray);

    const canvas = document.getElementById('scopeCanvas');
    if (canvas) drawToCanvas(canvas, dataArray, bufferLength);

    const mCanvas = document.getElementById('scopeCanvasMobile');
    if (mCanvas && window.innerWidth < 768) drawToCanvas(mCanvas, dataArray, bufferLength);
}

export function previewSynth(pitchVal, cVal, retrigger = false) {
    if (!state.audioCtx) return;
    const semitone = (pitchVal * 12) + state.transposeSemitones + state.octaveOffsetSemitones + state.finePitchTuneSemitones;
    const freq = 65.41 * Math.pow(2, semitone / 12);

    state.synthOsc.type = state.activeWaveform;
    state.synthOsc.frequency.setTargetAtTime(freq, state.audioCtx.currentTime, state.portamentoTime);

    let baseCutoff = 400;
    let peakVolume = 0.8;
    const normalizedC = cVal / 5;

    if (state.activeChCDest === 'filter') {
        baseCutoff = 100 + (normalizedC * 3000);
    } else if (state.activeChCDest === 'volume') {
        peakVolume = 0.1 + (normalizedC * 0.9);
    }

    const now = state.audioCtx.currentTime;

    if (retrigger || !state.isPreviewing) {
        state.synthVcf.frequency.cancelScheduledValues(now);
        state.synthVcf.frequency.setValueAtTime(baseCutoff, now);
        state.synthVcf.frequency.linearRampToValueAtTime(baseCutoff + 5000, now + state.attackTime);
        state.synthVcf.frequency.exponentialRampToValueAtTime(Math.max(100, baseCutoff + (5000 * state.sustainLevel)), now + state.attackTime + state.decayTime);

        state.synthVca.gain.cancelScheduledValues(now);
        state.synthVca.gain.setValueAtTime(state.synthVca.gain.value || 0, now);
        state.synthVca.gain.linearRampToValueAtTime(peakVolume, now + state.attackTime);
        state.synthVca.gain.linearRampToValueAtTime(peakVolume * state.sustainLevel, now + state.attackTime + state.decayTime);

        state.isPreviewing = true;
    } else {
        state.synthVcf.frequency.setTargetAtTime(baseCutoff + (5000 * state.sustainLevel), now, 0.05);
        state.synthVca.gain.setTargetAtTime(peakVolume * state.sustainLevel, now, 0.05);
    }
}

export function stopPreview() {
    if (state.isPreviewing && state.audioCtx) {
        const now = state.audioCtx.currentTime;
        state.synthVca.gain.cancelScheduledValues(now);
        const currentGain = Math.max(0.001, state.synthVca.gain.value);
        state.synthVca.gain.setValueAtTime(currentGain, now);
        state.synthVca.gain.exponentialRampToValueAtTime(0.0001, now + state.releaseTime);
        state.isPreviewing = false;
    }
}

export function triggerSynth(pitchVal, cVal, time) {
    if (!state.audioCtx) return;
    const semitone = (pitchVal * 12) + state.transposeSemitones + state.octaveOffsetSemitones + state.finePitchTuneSemitones;
    const freq = 65.41 * Math.pow(2, semitone / 12);

    state.synthOsc.type = state.activeWaveform;
    state.synthOsc.frequency.setTargetAtTime(freq, time, state.portamentoTime);

    let baseCutoff = 400;
    let peakVolume = 0.8;
    const normalizedC = cVal / 5;

    if (state.activeChCDest === 'filter') {
        baseCutoff = 100 + (normalizedC * 3000);
    } else if (state.activeChCDest === 'volume') {
        peakVolume = 0.1 + (normalizedC * 0.9);
    }

    state.synthVcf.frequency.cancelScheduledValues(time);
    state.synthVcf.frequency.setValueAtTime(baseCutoff, time);
    state.synthVcf.frequency.linearRampToValueAtTime(baseCutoff + 5000, time + state.attackTime);
    state.synthVcf.frequency.exponentialRampToValueAtTime(Math.max(100, baseCutoff + (5000 * state.sustainLevel)), time + state.attackTime + state.decayTime);

    const stepGateTime = Math.max(0.05, ((60.0 / state.bpm) * 0.25) - 0.02);
    state.synthVca.gain.cancelScheduledValues(time);
    state.synthVca.gain.setValueAtTime(0, time);

    state.synthVca.gain.linearRampToValueAtTime(peakVolume, time + state.attackTime);
    state.synthVca.gain.linearRampToValueAtTime(peakVolume * state.sustainLevel, time + state.attackTime + state.decayTime);
    const noteEndTime = time + stepGateTime;
    state.synthVca.gain.setValueAtTime(peakVolume * state.sustainLevel, noteEndTime);
    state.synthVca.gain.exponentialRampToValueAtTime(0.001, noteEndTime + state.releaseTime);
}
