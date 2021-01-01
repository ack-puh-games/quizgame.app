import * as React from 'react';

export const useKeyPress = (targetKey: string) => {
  const [pressed, setPressed] = React.useState(false);

  const downHandler = (event: KeyboardEvent) => {
    if (event.code === targetKey) {
      setPressed(true);
    }
  };

  const upHandler = (event: KeyboardEvent) => {
    if (event.code === targetKey) {
      setPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return pressed;
};
