/**
 * Synthesised Himalayan singing-bowl tones.
 * No samples, no dependencies — just sine partials with a long decay.
 */

type BowlOptions = {
  size: number;
  y: number;
  viewportHeight: number;
};

const PENTATONIC = [0, 2, 4, 7, 9]; // major pentatonic semitones
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

let context: AudioContext | null = null;
let master: GainNode | null = null;
let lastNoteAt = 0;
let lastGongAt = 0;

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

export async function ensureAudio(): Promise<AudioContext | null> {
  if (typeof window === "undefined") return null;

  if (!context) {
    const Ctor = getAudioContextConstructor();
    if (!Ctor) return null;
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 0.2;
    master.connect(context.destination);
  }

  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      // Autoplay policies can still refuse; the next gesture will try again.
    }
  }

  return context;
}

export function isAudioUnlocked(): boolean {
  return context?.state === "running";
}

function frequencyForIndex(index: number): number {
  const octave = Math.floor(index / PENTATONIC.length);
  const degree = PENTATONIC[index % PENTATONIC.length];
  return 196 * Math.pow(2, (degree + octave * 12) / 12);
}

function strikeBowl(frequency: number, duration: number, level = 1) {
  if (!context || !master) return;

  const now = context.currentTime;
  const noteGain = context.createGain();
  noteGain.gain.value = level;
  noteGain.connect(master);

  const partials = [
    { ratio: 1, gain: 0.52, decay: 1, detune: 2.5 },
    { ratio: 2.003, gain: 0.16, decay: 0.82, detune: -2 },
    { ratio: 2.997, gain: 0.09, decay: 0.66, detune: 3.5 },
    { ratio: 4.21, gain: 0.045, decay: 0.5, detune: -4 },
    { ratio: 5.43, gain: 0.025, decay: 0.38, detune: 2 },
  ];

  for (const partial of partials) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency * partial.ratio, now);
    oscillator.detune.setValueAtTime(partial.detune, now);

    const attack = 0.012;
    const peak = partial.gain * level;
    const length = duration * partial.decay;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + length);

    oscillator.connect(gain);
    gain.connect(noteGain);
    oscillator.start(now);
    oscillator.stop(now + attack + length + 0.05);
  }

  // A soft filtered noise transient gives the strike its "air".
  const noiseLength = Math.max(1, Math.floor(context.sampleRate * 0.035));
  const buffer = context.createBuffer(1, noiseLength, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / noiseLength) ** 3;
  }
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = context.createGain();
  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = frequency * 3;
  noiseFilter.Q.value = 0.7;
  noiseGain.gain.setValueAtTime(0.018 * level, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(noteGain);
  noise.start(now);
}

/** Play a note derived from the dragged object's size and vertical position. */
export function playBowlNote({ size, y, viewportHeight }: BowlOptions): void {
  if (!context || context.state !== "running") return;
  const now = context.currentTime;
  if (now - lastNoteAt < 0.075) return;
  lastNoteAt = now;

  const sizeNorm = clamp((size - 32) / (220 - 32), 0, 1);
  const positionNorm = clamp(y / Math.max(viewportHeight, 1), 0, 1);
  const index = clamp(
    Math.round((1 - sizeNorm) * 5 + positionNorm * 4),
    0,
    9,
  );
  const frequency = frequencyForIndex(index);
  const duration = 2.6 + (1 - sizeNorm) * 1.9;

  strikeBowl(frequency, duration, 0.9);
}

/** Low, long bowl gong for the top of the hour. */
export function playGong(): void {
  if (!context || context.state !== "running") return;
  const now = context.currentTime;
  if (now - lastGongAt < 1) return;
  lastGongAt = now;
  strikeBowl(110, 6.5, 1.15);
}
