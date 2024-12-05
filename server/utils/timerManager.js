export class TimerManager {
  constructor(io, users) {
    this.io = io;
    this.users = users;
    this.currentSpeaker = null;
    this.isSpeakerTime = true;
    this.timer = 30;
    this.timerInterval = null;
  }

  resetTimer() {
    this.timer = 30;
    this.broadcastTimer();
  }

  broadcastTimer() {
    console.log('Broadcasting timer:', { time: this.timer, isSpeakerTime: this.isSpeakerTime });
    this.io.emit('timer', { 
      time: this.timer, 
      isSpeakerTime: this.isSpeakerTime 
    });
  }

  broadcastCurrentSpeaker() {
    const speakerNickname = this.currentSpeaker ? this.users.get(this.currentSpeaker) : null;
    console.log('Broadcasting current speaker:', speakerNickname);
    this.io.emit('currentSpeaker', { speaker: speakerNickname });
  }

  nextSpeaker() {
    const userArray = Array.from(this.users.keys());
    if (userArray.length === 0) return null;
    
    if (!this.currentSpeaker) {
      return userArray[0];
    }
    
    const currentIndex = userArray.indexOf(this.currentSpeaker);
    const nextIndex = (currentIndex + 1) % userArray.length;
    return userArray[nextIndex];
  }

  startTimer() {
    console.log('Starting timer');
    this.stopTimer(); // Clear any existing interval
    
    this.resetTimer();
    this.broadcastCurrentSpeaker();
    
    this.timerInterval = setInterval(() => {
      this.timer--;
      this.broadcastTimer();
      
      if (this.timer <= 0) {
        this.isSpeakerTime = !this.isSpeakerTime;
        
        if (this.isSpeakerTime) {
          this.currentSpeaker = this.nextSpeaker();
          this.broadcastCurrentSpeaker();
        }
        
        this.resetTimer();
      }
    }, 1000);

    // Initial broadcast
    this.broadcastTimer();
    this.broadcastCurrentSpeaker();
  }

  stopTimer() {
    if (this.timerInterval) {
      console.log('Stopping timer');
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}