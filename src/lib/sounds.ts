const isBrowser = typeof window !== 'undefined';
const AudioContextClass = isBrowser ? (window.AudioContext || (window as any).webkitAudioContext) : undefined;
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playTone(frequency: number, duration = 0.12, type: OscillatorType = 'sine', volume = 0.12) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {
      // ignore resume failures on unsupported browsers
    });
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);

  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}

function playSequence(notes: Array<{ frequency: number; duration?: number; type?: OscillatorType; volume?: number }>, spacing = 0.05) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  let offset = ctx.currentTime;

  for (const note of notes) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = note.type ?? 'sine';
    oscillator.frequency.value = note.frequency;
    gain.gain.value = note.volume ?? 0.12;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(offset);
    oscillator.stop(offset + (note.duration ?? 0.12));

    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };

    offset += (note.duration ?? 0.12) + spacing;
  }
}

export function playNotificationSound() {
  playSequence([
    { frequency: 880, duration: 0.06, type: 'triangle' },
    { frequency: 660, duration: 0.1, type: 'triangle' },
  ], 0.03);
}

export function playGameLaunchSound() {
  playSequence([
    { frequency: 740, duration: 0.06, type: 'triangle', volume: 0.1 },
    { frequency: 980, duration: 0.08, type: 'triangle', volume: 0.1 },
    { frequency: 1240, duration: 0.1, type: 'triangle', volume: 0.1 },
  ], 0.02);
}

export function playCorrectSound() {
  playSequence([
    { frequency: 880, duration: 0.08, type: 'triangle', volume: 0.12 },
    { frequency: 1100, duration: 0.08, type: 'triangle', volume: 0.12 },
  ], 0.02);
}

export function playIncorrectSound() {
  playSequence([
    { frequency: 220, duration: 0.12, type: 'square', volume: 0.12 },
  ]);
}

export function playGameCompleteSound() {
  playSequence([
    { frequency: 660, duration: 0.08, type: 'triangle', volume: 0.12 },
    { frequency: 880, duration: 0.08, type: 'triangle', volume: 0.12 },
    { frequency: 1040, duration: 0.12, type: 'triangle', volume: 0.12 },
  ], 0.03);
}
