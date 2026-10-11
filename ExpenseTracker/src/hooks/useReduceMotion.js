import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export default function useReduceMotion(initialValue = true) {
  const [reduceMotion, setReduceMotion] = useState(initialValue);

  useEffect(() => {
    let active = true;
    const update = (value) => {
      if (active) setReduceMotion(value);
    };

    AccessibilityInfo.isReduceMotionEnabled().then(update).catch(() => update(true));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', update);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
