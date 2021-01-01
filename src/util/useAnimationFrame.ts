import * as React from 'react';

interface UseAnimationFrameProps {
  time: number;
  delta: number;
}

// Reusable component that also takes dependencies
export const useAnimationFrame = (
  cb: (props: UseAnimationFrameProps) => void,
  deps: React.DependencyList,
) => {
  const frame = React.useRef<number>(-1);
  const last = React.useRef(performance.now());
  const init = React.useRef(performance.now());

  const animate = () => {
    const now = performance.now();
    const time = (now - init.current) / 1000;
    const delta = (now - last.current) / 1000;
    // In seconds ~> you can do ms or anything in userland
    cb({ time, delta });
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, deps); // Make sure to change it if the deps change
};

export default useAnimationFrame;
