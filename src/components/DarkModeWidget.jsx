import { useEffect } from 'react';
import Darkmode from 'darkmode-js';


export default function DarkModeWidget() {
  useEffect(() => {
    const options = {
      bottom: '80px',
      left: '20px',
      right: 'unset',
      label: '🌓',
    };
    const darkmode = new Darkmode(options);
    darkmode.showWidget();
  }, []);

  return null;
}
