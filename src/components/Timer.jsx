import React from "react";
import { formatTime, getPhaseText } from "../utils/timerUtils";

function Timer({ time, isSpeakerTime, currentSpeaker }) {
  return (
    <div className="timer">
      <div className="time">{formatTime(time)}</div>
      <div className="phase">
        {getPhaseText(isSpeakerTime, currentSpeaker)}
        {!isSpeakerTime && (
          <img
            src="https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fmedia1.tenor.com%2Fm%2FD12KYBUCOBAAAAAd%2Fgit-merge.gif"
            alt="Vite"
            width="500"
            height="500"
            // style="position: relative"
            // style="z-index:10"
            // style="position: relative; z-index: 10;"
          />
        )}
      </div>
    </div>
  );
}

export default Timer;
