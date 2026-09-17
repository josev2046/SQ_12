/*
    state.js — single source of truth for the sequencer's mutable state.

    Everything that used to be a top-level `let` in the monolithic file lives
    on the `state` object here. Other modules import `state` and read/write
    its properties directly (ES module bindings are read-only for imported
    primitives, so a shared object is the simplest way to keep this mutable
    across files without a bigger state-management layer).
*/

export const NUM_STEPS = 12;

export const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const waveforms = ['sawtooth', 'square', 'triangle', 'sine'];

export const tracks = {
    A: new Array(NUM_STEPS).fill(0),
    B: new Array(NUM_STEPS).fill(0),
    C: new Array(NUM_STEPS).fill(2.5)
};

export const state = {
    // Transport
    currentStep: -1,
    isPlaying: false,
    nextNoteTime: 0,
    timerId: null,

    // Web Audio nodes (created in audio.js on first user interaction)
    audioCtx: null,
    synthOsc: null,
    synthVcf: null,
    synthVca: null,
    analyser: null,

    // Global performance params
    bpm: 120,
    portamentoTime: 0.01,
    resetStep: null,
    isPreviewing: false,
    transposeSemitones: 0,

    // Sequencer length / play mode
    currentLength: '12',
    currentPlayMode: 'cont',
    activeSeqMode: '12-cont',

    // Routing
    voltageRangeMultiplier: 1,
    activeChCDest: 'filter',

    // Oscillator
    activeWaveform: 'sawtooth',
    octaveOffsetSemitones: 0,
    finePitchTuneSemitones: 0,

    // ADSR envelope
    attackTime: 0.01,
    decayTime: 0.15,
    sustainLevel: 0.2,
    releaseTime: 0.2
};

export function updateActiveMode() {
    state.activeSeqMode = `${state.currentLength}-${state.currentPlayMode}`;
}
