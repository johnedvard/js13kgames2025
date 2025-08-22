// let audioContext: AudioContext | null = null;

// // Initialize the audio context
// function getAudioContext(): AudioContext {
//   if (!audioContext) {
//     audioContext = new (window.AudioContext ||
//       (window as any).webkitAudioContext)();
//   }
//   return audioContext;
// }

// // Resume audio context if suspended (required for some browsers)
// function resumeAudioContext() {
//   const ctx = getAudioContext();
//   if (ctx.state === "suspended") {
//     ctx.resume();
//   }
// }

// // Create a basic oscillator-based sound
// function createSound(
//   frequency: number,
//   duration: number,
//   type: OscillatorType = "sine",
//   volume: number = 0.15, // Reduced from 0.3 to 0.15
//   fadeOut: boolean = true
// ) {
//   resumeAudioContext();
//   const ctx = getAudioContext();

//   const oscillator = ctx.createOscillator();
//   const gainNode = ctx.createGain();

//   oscillator.connect(gainNode);
//   gainNode.connect(ctx.destination);

//   oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
//   oscillator.type = type;

//   gainNode.gain.setValueAtTime(volume, ctx.currentTime);

//   if (fadeOut) {
//     gainNode.gain.exponentialRampToValueAtTime(
//       0.01,
//       ctx.currentTime + duration
//     );
//   } else {
//     gainNode.gain.setValueAtTime(volume, ctx.currentTime + duration);
//     gainNode.gain.exponentialRampToValueAtTime(
//       0.01,
//       ctx.currentTime + duration + 0.01
//     );
//   }

//   oscillator.start(ctx.currentTime);
//   oscillator.stop(ctx.currentTime + duration + 0.01);
// }

// // Create a more complex sound with multiple frequencies
// function createComplexSound(
//   frequencies: number[],
//   duration: number,
//   type: OscillatorType = "sine",
//   volume: number = 0.1 // Reduced from 0.2 to 0.1
// ) {
//   resumeAudioContext();
//   const ctx = getAudioContext();

//   frequencies.forEach((freq) => {
//     const oscillator = ctx.createOscillator();
//     const gainNode = ctx.createGain();

//     oscillator.connect(gainNode);
//     gainNode.connect(ctx.destination);

//     oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
//     oscillator.type = type;

//     const adjustedVolume = volume / frequencies.length; // Reduce volume to prevent clipping
//     gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(
//       0.01,
//       ctx.currentTime + duration
//     );

//     oscillator.start(ctx.currentTime);
//     oscillator.stop(ctx.currentTime + duration + 0.01);
//   });
// }

// // Create noise-based sound
// function createNoiseSound(duration: number, volume: number = 0.05) {
//   // Reduced from 0.1 to 0.05
//   resumeAudioContext();
//   const ctx = getAudioContext();

//   const bufferSize = ctx.sampleRate * duration;
//   const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
//   const data = buffer.getChannelData(0);

//   // Generate white noise
//   for (let i = 0; i < bufferSize; i++) {
//     data[i] = Math.random() * 2 - 1;
//   }

//   const source = ctx.createBufferSource();
//   const gainNode = ctx.createGain();
//   const filter = ctx.createBiquadFilter();

//   source.buffer = buffer;
//   source.connect(filter);
//   filter.connect(gainNode);
//   gainNode.connect(ctx.destination);

//   filter.type = "highpass";
//   filter.frequency.setValueAtTime(1000, ctx.currentTime);

//   gainNode.gain.setValueAtTime(volume, ctx.currentTime);
//   gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

//   source.start(ctx.currentTime);
// }

// // Sound effects
// export function playKillSound() {
//   // Dark, ominous sound - low frequency with distortion (reduced volume and made smoother)
//   createSound(80, 0.5, "triangle", 0.2); // Changed from sawtooth to triangle, reduced volume from 0.4 to 0.2
//   setTimeout(() => createSound(60, 0.3, "triangle", 0.15), 100); // Changed from square to triangle, reduced volume from 0.3 to 0.15
// }

// export function playPickupSound() {
//   // Bright, cheerful pickup sound - ascending notes (reduced volume)
//   const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
//   notes.forEach((freq, index) => {
//     setTimeout(() => createSound(freq, 0.2, "sine", 0.15, true), index * 50); // Reduced volume from 0.3 to 0.15
//   });
// }

// export function playGoalSound() {
//   // Victory fanfare - major chord progression (reduced volume)
//   const chord1 = [261.63, 329.63, 392.0]; // C4, E4, G4
//   const chord2 = [349.23, 440.0, 523.25]; // F4, A4, C5
//   const chord3 = [392.0, 493.88, 587.33]; // G4, B4, D5

//   createComplexSound(chord1, 0.3, "sine", 0.2); // Reduced volume from 0.4 to 0.2
//   setTimeout(() => createComplexSound(chord2, 0.3, "sine", 0.2), 200); // Reduced volume from 0.4 to 0.2
//   setTimeout(() => createComplexSound(chord3, 0.5, "sine", 0.2), 400); // Reduced volume from 0.4 to 0.2
// }

// export function playDisableBtnClickSound() {
//   // Short, muted click sound indicating disabled state (reduced volume and softer)
//   createSound(200, 0.1, "triangle", 0.1, false); // Changed from square to triangle, reduced volume from 0.2 to 0.1
//   setTimeout(() => createNoiseSound(0.05, 0.05), 50); // Volume automatically reduced by function change
// }

// export function playRopeExtendSound() {
//   // Rope extending sound - stretchy mechanical effect (smoother and quieter)
//   // Start with a low frequency and sweep upward to simulate rope tension
//   resumeAudioContext();
//   const ctx = getAudioContext();

//   const oscillator = ctx.createOscillator();
//   const gainNode = ctx.createGain();
//   const filter = ctx.createBiquadFilter();

//   oscillator.connect(filter);
//   filter.connect(gainNode);
//   gainNode.connect(ctx.destination);

//   // Start at low frequency and sweep up (gentler sweep)
//   oscillator.frequency.setValueAtTime(120, ctx.currentTime); // Lowered from 150
//   oscillator.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.3); // Lowered from 300
//   oscillator.type = "triangle"; // Changed from sawtooth to triangle for smoother sound

//   // Add low-pass filter for more organic sound (gentler filtering)
//   filter.type = "lowpass";
//   filter.frequency.setValueAtTime(600, ctx.currentTime); // Lowered from 800
//   filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.3); // Lowered from 400

//   // Volume envelope - much quieter and smoother
//   gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
//   gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05); // Reduced from 0.15 to 0.08, changed to linear
//   gainNode.gain.setValueAtTime(0.08, ctx.currentTime + 0.2);
//   gainNode.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.3); // Changed to linear ramp for smoother fade

//   oscillator.start(ctx.currentTime);
//   oscillator.stop(ctx.currentTime + 0.3);
// }

// // Background music for casual platformer
// let currentMusicInterval: number | null = null;
// let isMusicPlaying = false;

// export function playBackgroundMusic() {
//   if (isMusicPlaying) return; // Don't start if already playing

//   isMusicPlaying = true;
//   resumeAudioContext();

//   // Define a simple upbeat melody in C major pentatonic (cheerful, no harsh intervals)
//   const melody = [
//     // Main melody phrase (C major pentatonic: C, D, E, G, A)
//     { freq: 523.25, duration: 0.5 }, // C5
//     { freq: 587.33, duration: 0.5 }, // D5
//     { freq: 659.25, duration: 0.5 }, // E5
//     { freq: 783.99, duration: 0.5 }, // G5
//     { freq: 880.0, duration: 1.0 }, // A5 (longer)

//     { freq: 783.99, duration: 0.5 }, // G5
//     { freq: 659.25, duration: 0.5 }, // E5
//     { freq: 587.33, duration: 0.5 }, // D5
//     { freq: 523.25, duration: 1.0 }, // C5 (longer)

//     // Variation phrase
//     { freq: 659.25, duration: 0.5 }, // E5
//     { freq: 783.99, duration: 0.5 }, // G5
//     { freq: 880.0, duration: 0.5 }, // A5
//     { freq: 1046.5, duration: 0.5 }, // C6
//     { freq: 880.0, duration: 1.0 }, // A5 (longer)

//     { freq: 783.99, duration: 0.5 }, // G5
//     { freq: 659.25, duration: 0.5 }, // E5
//     { freq: 523.25, duration: 1.5 }, // C5 (longest, phrase end)
//   ];

//   // Bass line (simple root progression)
//   const bassline = [
//     { freq: 130.81, duration: 2.0 }, // C3
//     { freq: 146.83, duration: 2.0 }, // D3
//     { freq: 164.81, duration: 2.0 }, // E3
//     { freq: 130.81, duration: 2.0 }, // C3
//     { freq: 196.0, duration: 2.0 }, // G3
//     { freq: 174.61, duration: 2.0 }, // F3
//     { freq: 130.81, duration: 4.0 }, // C3 (longer)
//   ];

//   let melodyIndex = 0;
//   let bassIndex = 0;
//   let startTime = Date.now();
//   let melodyTime = 0;
//   let bassTime = 0;

//   const playMusicLoop = () => {
//     if (!isMusicPlaying) return;

//     const currentTime = (Date.now() - startTime) / 1000;

//     // Play melody notes
//     if (currentTime >= melodyTime && melodyIndex < melody.length) {
//       const note = melody[melodyIndex];
//       createMusicNote(note.freq, note.duration, 0.06, "triangle"); // Very quiet, smooth triangle wave
//       melodyTime += note.duration;
//       melodyIndex++;

//       // Loop melody when finished
//       if (melodyIndex >= melody.length) {
//         melodyIndex = 0;
//         melodyTime = currentTime;
//       }
//     }

//     // Play bass notes
//     if (currentTime >= bassTime && bassIndex < bassline.length) {
//       const note = bassline[bassIndex];
//       createMusicNote(note.freq, note.duration, 0.04, "sine"); // Even quieter bass
//       bassTime += note.duration;
//       bassIndex++;

//       // Loop bassline when finished
//       if (bassIndex >= bassline.length) {
//         bassIndex = 0;
//         bassTime = currentTime;
//       }
//     }
//   };

//   // Start the music loop
//   currentMusicInterval = setInterval(playMusicLoop, 100) as any; // Check every 100ms
// }

// export function stopBackgroundMusic() {
//   isMusicPlaying = false;
//   if (currentMusicInterval) {
//     clearInterval(currentMusicInterval);
//     currentMusicInterval = null;
//   }
// }

// // Helper function to create music notes with smoother envelopes
// function createMusicNote(
//   frequency: number,
//   duration: number,
//   volume: number,
//   type: OscillatorType
// ) {
//   resumeAudioContext();
//   const ctx = getAudioContext();

//   const oscillator = ctx.createOscillator();
//   const gainNode = ctx.createGain();

//   oscillator.connect(gainNode);
//   gainNode.connect(ctx.destination);

//   oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
//   oscillator.type = type;

//   // Smooth ADSR envelope for musical notes
//   const attackTime = 0.05;
//   const decayTime = 0.1;
//   const sustainLevel = volume * 0.7;
//   const releaseTime = 0.2;

//   gainNode.gain.setValueAtTime(0, ctx.currentTime);
//   gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attackTime); // Attack
//   gainNode.gain.linearRampToValueAtTime(
//     sustainLevel,
//     ctx.currentTime + attackTime + decayTime
//   ); // Decay
//   gainNode.gain.setValueAtTime(
//     sustainLevel,
//     ctx.currentTime + duration - releaseTime
//   ); // Sustain
//   gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration); // Release

//   oscillator.start(ctx.currentTime);
//   oscillator.stop(ctx.currentTime + duration);
// }

// // Initialize audio context on first user interaction
// export function initAudio() {
//   resumeAudioContext();
// }
