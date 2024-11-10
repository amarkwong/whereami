// app/components/Countdown.tsx
import React, { useEffect, useState } from 'react';

interface CountdownProps {
  seconds: number;
  onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(seconds);


  useEffect(() => {
    // If timeLeft is zero, call onComplete if provided
    if (timeLeft === 0) {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    // Set up a timer to decrease timeLeft every second
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clean up the timer when the component unmounts or timeLeft changes
    return () => clearTimeout(timerId);
  }, [timeLeft, onComplete]);

  let textColor: string;
  if (timeLeft > 30) {
    textColor = 'white';
  } else if (timeLeft > 10) {
    textColor = 'yellow';
  } else {
    textColor = 'red';
  }

  const styles = {
    container: {
      position: 'absolute' as 'absolute',
      top: '20px',
      right: '20px',
      padding: '5px 10px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '5px',
      zIndex: 2,
    },
    text: {
      color: textColor,
      fontSize: '18px',
      fontWeight: 'bold' as 'bold',
    },
  };

  
  // Format time as mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const secondsRemaining = timeLeft % 60;
  const formattedTime = `${minutes}:${secondsRemaining
    .toString()
    .padStart(2, '0')}`;

  return (
    <div style={styles.container}>
      <span style={styles.text}>{formattedTime  }</span>
    </div>
  );
};



export default Countdown;