export class AudioManager {
    constructor(){
        this.hit = new Audio('assets/hit.wav');
        this.smash = new Audio('assets/smash.wav');
        this.score = new Audio('assets/score.wav');
    }
    playHit(){this.hit.currentTime=0;this.hit.play();}
    playSmash(){this.smash.currentTime=0;this.smash.play();}
    playScore(){this.score.currentTime=0;this.score.play();}
}
