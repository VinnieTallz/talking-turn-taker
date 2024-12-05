import React from 'react';
import { formatTime, getPhaseText } from '../utils/timerUtils';

function Timer({ time, isSpeakerTime, currentSpeaker }) {
  return (
    <div className="timer">
      <div className="time">{formatTime(time)}</div>
      <div className="phase">
        {getPhaseText(isSpeakerTime, currentSpeaker)}
      </div>
    </div>
  );
}

export default Timer;