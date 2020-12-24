export class AudioManager {
    static clips = [];

    static createAudio(path, volume = 1) {
        return this.clips.push(new AudioRef(path, volume)) - 1;
    }

    static play(index) {
        this.playAudio(index);
    }

    static playAudio(index) {
        this.clips[index].play();
    }

    static playLoop(index) {
        this.clips[index].playLoop();
    }

    static playBurst(index) {
        this.clips[index].playBurst();
    }

    static stop(index) {
        this.clips[index].stop();
    }

    static setVolume(index, volume) {
        this.clips[index].volume = volume;
    }

    static getAudio(index) {
        return this.clips[index].audio;
    }
}

class AudioRef {
    pool = [];
    audio;
    volume;
    stopped = false;

    constructor(path, volume) {
        this.path = path;
        this.volume = volume;
        this.audio = new Audio(path);
        this.audio.volume = volume;
        this.pool.push(this.audio);
    }

    stop() {
        this.stopped = true;
        this.audio.pause();
        this.audio.volume = 0;
        this.audio.currentTime = 0;
    }

    play() {
        this.audio.volume = this.volume;
        this.audio.play();
    }

    playLoop() {
        this.stopped = false;
        this.audio.volume = this.volume;

        this.audio.play();

        this.audio.onended = () => {
            if(this.stopped) return;

            this.audio.volume = this.volume;
            this.audio.play();
        }
    }

    playBurst() {
        this.stopped = false;

        // Searches for inactive audio in pool and plays if an empty one is found
        for(let i = 0; i < this.pool.length; i++) {
            if(this.path[i].isPlaying) continue;

            //let audio = new Audio(this.path);
            let audio = this.audio.cloneNode(true);
            audio.volume = this.volume;
            audio.play();
            this.pool.push(audio);
            return;
        }

        // If all audio in pool is playing, create a new audio and add that to the pool

        //let audio = new Audio(this.path);
        let audio = this.audio.cloneNode(true);
        audio.volume = this.volume;
        audio.play();
        this.pool.push(audio);
    }

    static isPlaying(audio) {
        return !audio.paused && audio.currentTime;
    }
}

/*
export class AudioManager {
    static clips = [];

    static createAudio(path) {

        return this.clips.push(new AudioRef(path)) - 1;
    }

    static playAudio(index) {
        this.clips[index].audio.play();
    }

    static playBurst(index) {
        let audio = new Audio(this.clips[index].path);
        audio.play();
    }

    static getAudio(index) {
        return this.clips[index].audio;
    }
}

class AudioRef {
    pool = [];

    constructor(path) {
        this.path = path
        this.audio = pool.push(new Audio(path));
    }

    getNew() {
        
    }
}
*/