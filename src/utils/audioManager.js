/**
 * 🎵 AUDIO MANAGER & PROCEDURAL ROMANTIC SYNTHESIZER
 * Plays real audio files when available or procedural romantic harp/piano tones.
 */

class RomanticAudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.sfxMuted = false;
    this.currentTrack = null;
    this.volume = 0.8;
    this.audioElement = typeof Audio !== "undefined" ? new Audio() : null;
    this.isPlayingMusic = false;
    this.ambientInterval = null;

    if (this.audioElement) {
      this.audioElement.volume = this.volume;
      this.audioElement.loop = false;
      this.audioElement.addEventListener("play", () => {
        this.isPlayingMusic = true;
      });
      this.audioElement.addEventListener("pause", () => {
        this.isPlayingMusic = false;
      });
      this.audioElement.addEventListener("ended", () => {
        this.isPlayingMusic = false;
      });
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Romantic Note Frequency Map
  getNoteFreq(note) {
    const notes = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, "C#4": 277.18, D4: 293.66, "Eb4": 311.13, E4: 329.63, F4: 349.23, "F#4": 369.99,
      G4: 392.00, "G#4": 415.30, A4: 440.00, "Bb4": 466.16, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77, C6: 1046.50
    };
    return notes[note] || 440.0;
  }

  playRomanticTone(freq = 440, duration = 1.2, type = "sine", gainVal = 0.15) {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.1);
    } catch (e) {
      // Audio context might be restricted
    }
  }

  // Chime / Sparkle Sound Effect
  playSparkle() {
    if (this.sfxMuted) return;
    this.init();
    const notes = ["C5", "E5", "G5", "C6"];
    notes.forEach((n, i) => {
      setTimeout(() => {
        this.playRomanticTone(this.getNoteFreq(n), 0.6, "sine", 0.08);
      }, i * 90);
    });
  }

  // Kiss Sound Effect (Cute smooch + soft heart pop)
  playKissSound() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";

      // Pitch sweep mimicking a soft kiss
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.28);

      // Follow up with high soft chime
      setTimeout(() => {
        this.playRomanticTone(this.getNoteFreq("E5"), 0.5, "sine", 0.05);
      }, 120);
    } catch (e) {}
  }

  // Bloom sound for flower picker
  playBloom() {
    if (this.sfxMuted) return;
    this.init();
    const chord = ["F4", "A4", "C5", "E5"];
    chord.forEach((n, i) => {
      setTimeout(() => {
        this.playRomanticTone(this.getNoteFreq(n), 1.0, "sine", 0.07);
      }, i * 60);
    });
  }

  // Heart Catch sound
  playHeartCatch() {
    if (this.sfxMuted) return;
    this.init();
    this.playRomanticTone(this.getNoteFreq("G5"), 0.4, "sine", 0.12);
  }

  // Romantic Chord / Celebration Fanfare
  playCelebrationChord() {
    if (this.sfxMuted) return;
    this.init();
    const chord = ["C4", "E4", "G4", "B4", "D5", "G5"];
    chord.forEach((n, i) => {
      setTimeout(() => {
        this.playRomanticTone(this.getNoteFreq(n), 2.2, "sine", 0.09);
      }, i * 110);
    });
  }

  // Play a song track directly from user interaction
  async playSong(song, forceRestart = false) {
    this.init();
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.volume = this.volume !== undefined ? this.volume : 0.8;
      this.audioElement.loop = false;
      this.audioElement.addEventListener("play", () => {
        this.isPlayingMusic = true;
      });
      this.audioElement.addEventListener("pause", () => {
        this.isPlayingMusic = false;
      });
      this.audioElement.addEventListener("ended", () => {
        this.isPlayingMusic = false;
      });
    }

    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }

    if (!song) return;

    const audioUrl = song.file || song.audio;
    const isSameTrack = this.currentTrack && (this.currentTrack.id === song.id);

    // If same song is already loaded and not force-restarting, resume from current position
    if (isSameTrack && !forceRestart && this.audioElement.src) {
      try {
        await this.audioElement.play();
        this.isPlayingMusic = true;
      } catch (error) {
        console.error("Audio resume failed:", error);
        this.isPlayingMusic = false;
      }
      return;
    }

    // Different song or forced restart -> switch source, reset currentTime, load and play
    this.currentTrack = song;
    this.isMuted = false;
    this.audioElement.muted = false;

    if (audioUrl) {
      this.audioElement.src = audioUrl;
      this.audioElement.currentTime = 0;
      this.audioElement.load();

      try {
        await this.audioElement.play();
        this.isPlayingMusic = true;
      } catch (error) {
        console.error("Audio playback failed:", error);
        this.isPlayingMusic = false;
      }
    }
  }

  // Ambient Procedural Romance Music Engine
  startProceduralSongAmbient(song) {
    this.isPlayingMusic = true;
    const notes = (song && song.keyNotes) || ["C4", "E4", "G4", "B4", "C5", "G4", "E4"];
    let noteIdx = 0;

    if (this.ambientInterval) clearInterval(this.ambientInterval);

    this.ambientInterval = setInterval(() => {
      if (this.isMuted || !this.isPlayingMusic) return;
      const noteName = notes[noteIdx % notes.length];
      this.playRomanticTone(this.getNoteFreq(noteName), 1.8, "sine", 0.05);
      noteIdx++;
    }, 750);
  }

  pauseMusic() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.isPlayingMusic = false;
  }

  async resumeMusic() {
    if (this.audioElement && this.currentTrack && this.audioElement.src) {
      try {
        await this.audioElement.play();
        this.isPlayingMusic = true;
      } catch (error) {
        console.error("Audio resume failed:", error);
      }
    } else if (this.currentTrack) {
      await this.playSong(this.currentTrack);
    }
  }

  toggleMusic() {
    if (this.audioElement && this.audioElement.src) {
      if (this.audioElement.paused) {
        this.resumeMusic();
        return true;
      } else {
        this.pauseMusic();
        return false;
      }
    } else if (this.currentTrack) {
      this.playSong(this.currentTrack);
      return true;
    }
    return false;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
      if (this.volume > 0 && this.audioElement.muted) {
        this.audioElement.muted = false;
        this.isMuted = false;
      }
    }
  }

  toggleMute() {
    if (this.audioElement) {
      this.audioElement.muted = !this.audioElement.muted;
      this.isMuted = this.audioElement.muted;
      return this.isMuted;
    }
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  seek(seconds) {
    if (this.audioElement && Number.isFinite(seconds)) {
      this.audioElement.currentTime = seconds;
    }
  }

  toggleSFX() {
    this.sfxMuted = !this.sfxMuted;
    return !this.sfxMuted;
  }
}

export const audioManager = new RomanticAudioManager();
