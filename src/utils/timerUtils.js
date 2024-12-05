export const TIMER_DURATION = 30;
export const formatTime = (seconds) => `${seconds} seconds`;

export const getPhaseText = (isSpeakerTime, currentSpeaker) => {
  if (isSpeakerTime) {
    return currentSpeaker ? `Speaker Time (${currentSpeaker}'s turn)` : 'Speaker Time';
  }
  return 'Open Discussion Time';
};