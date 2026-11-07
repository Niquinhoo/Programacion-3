import test from 'node:test';
import assert from 'node:assert/strict';
import { motion, easing, springFrames } from '../src/utils/motion.js';

test('los tiempos y las curvas coinciden con STP1', () => {
  assert.deepEqual(motion, { sheetOpen: 340, sheetClose: 220, morph: 360, jump: 110, heroStable: 3500 });
  assert.equal(easing.inOut(0.25), 0.0625);
  assert.equal(easing.inOut(0.75), 0.9375);
  assert.equal(easing.out(0.5), 0.875);
  assert.equal(easing.in(0.5), 0.125);
});

test('el salto vuelve a cero con el resorte del STP1 y conserva el rebote', () => {
  const frames = springFrames(-14);
  assert.equal(frames[0].y, -14);
  assert.equal(frames.at(-1).y, 0);
  assert.ok(frames.some((frame) => frame.y > 0));
  assert.ok(frames.at(-1).time < 1500);
});
