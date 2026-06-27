let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

export const playBeep = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.value = 0.3;

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    osc.start(now);
    osc.stop(now + 0.15);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 600;
    gain2.gain.value = 0.3;

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.2);
    osc2.stop(now + 0.35);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.value = 400;
    gain3.gain.value = 0.3;

    osc3.connect(gain3);
    gain3.connect(ctx.destination);

    osc3.start(now + 0.4);
    osc3.stop(now + 0.55);
  } catch {
    // Audio not available
  }
};
