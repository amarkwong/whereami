// src/app/components/CountdownTimer.tsx
'use client';

import React, { FC, useEffect, useState } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
}

const CountdownTimer: FC<CountdownTimerProps> = ({ seconds, onComplete }) => {
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

  // Determine text color based on timeLeft
  let textColorClass: string;
  if (timeLeft > 30) {
    textColorClass = 'text-white';
  } else if (timeLeft > 10) {
    textColorClass = 'text-yellow-500';
  } else {
    textColorClass = 'text-red-500';
  }

  // Format time as mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const secondsRemaining = timeLeft % 60;
  const formattedTime = `${minutes}:${secondsRemaining
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="absolute top-5 right-5 p-2 bg-black bg-opacity-50 rounded z-20">
      <span className={`text-lg font-bold ${textColorClass}`}>
        {formattedTime}
      </span>
    </div>
  );
};

export default CountdownTimer;