export const motion = { sheetOpen: 340, sheetClose: 220, morph: 360, jump: 110, heroStable: 3500 };
export const easing = {
  in: (t) => t ** 3,
  out: (t) => 1 - (1 - t) ** 3,
  inOut: (t) => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
};

export function timingFrames(frame, curve, steps = 60) {
  return Array.from({ length: steps + 1 }, (_, i) => ({ ...frame(curve(i / steps)), offset: i / steps }));
}

export function keepTransitionDuration(element, duration) {
  // CSS acorta las transiciones invertidas; Animated.timing conserva la duración completa.
  for (const animation of element.getAnimations({ subtree: true })) {
    if ('transitionProperty' in animation) animation.effect.updateTiming({ duration });
  }
}

// El mismo resorte de Animated.spring: stiffness 220, damping 14, mass 0.5, velocidad inicial 0.
export function springFrames(from) {
  const decay = 14;
  const frequency = Math.sqrt(220 / 0.5 - decay ** 2);
  const frames = [];
  for (let time = 0; time <= 1500; time += 1000 / 120) {
    const t = time / 1000;
    const y = from * Math.exp(-decay * t) * (Math.cos(frequency * t) + decay / frequency * Math.sin(frequency * t));
    const velocity = -from * (220 / 0.5) / frequency * Math.exp(-decay * t) * Math.sin(frequency * t);
    frames.push({ time, y });
    if (time > 0 && Math.abs(y) < 0.001 && Math.abs(velocity) < 0.001) break;
  }
  frames.at(-1).y = 0;
  return frames;
}

export const heroEase = `linear(${Array.from({ length: 61 }, (_, i) => easing.inOut(i / 60).toFixed(6)).join(',')})`;
