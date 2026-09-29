import { SONGS } from "../data/songs.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";

function formatTime(seconds) {
  if (isNaN(seconds) || !Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export class MusicRoomSectionComponent {
  constructor({ onNextSection }) {
    this.onNextSection = onNextSection;
    this.currentTrackId = audioManager.currentTrack ? audioManager.currentTrack.id : SONGS[0].id;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-music";
    section.className = "min-h-screen py-10 px-4 md:px-6 relative z-10 animate-fadeIn";

    const currentTrack = SONGS.find(s => s.id === this.currentTrackId) || SONGS[0];
    const isPlaying = audioManager.isPlayingMusic;
    const isMuted = audioManager.isMuted || (audioManager.audioElement && audioManager.audioElement.muted);
    const volumeVal = audioManager.volume !== undefined ? audioManager.volume : 0.8;

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto">
        <!-- Header -->
        <div class="text-center mb-6">
          <span class="text-3xl inline-block mb-1 animate-float">🎵</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-lavender">Our Soundtrack</h1>
          <p class="text-xs text-purple-200/80 mt-1">“Songs That Feel Like You”</p>
        </div>

        <!-- Featured Vinyl Player Stage -->
        <div class="glass-panel p-6 sm:p-8 mb-6 border border-pink-400/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-purple-950/80 to-pink-950/80 text-center">
          
          <div class="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-4 flex items-center justify-center">
            <!-- Vinyl Record -->
            <div id="vinyl-disc" class="w-full h-full rounded-full bg-neutral-900 border-4 border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center relative animate-vinyl" style="animation-play-state: ${isPlaying ? 'running' : 'paused'};">
              <!-- Grooves -->
              <div class="absolute inset-4 rounded-full border border-neutral-700/50"></div>
              <div class="absolute inset-8 rounded-full border border-neutral-700/40"></div>
              <div class="absolute inset-12 rounded-full border border-neutral-700/30"></div>
              
              <!-- Center Label -->
              <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-inner">
                ❤️
              </div>
            </div>
          </div>

          <!-- Active Song Meta -->
          <div class="mb-4">
            <span id="active-song-badge" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 uppercase tracking-widest inline-block mb-1.5">
              ${currentTrack.badge || currentTrack.tag}
            </span>
            <h2 id="active-song-title" class="text-xl sm:text-2xl font-heading font-bold text-pink-100">
              ${currentTrack.title}
            </h2>
            <p id="active-song-artist" class="text-xs text-purple-300/80 font-medium mt-0.5">
              ${currentTrack.artist}
            </p>
          </div>

          <!-- Why / Interpretation Card -->
          <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-5 text-left">
            <span class="text-[10px] font-bold text-pink-300 uppercase tracking-wider block mb-1">Why this feels like you:</span>
            <p id="active-song-interpretation" class="text-xs text-purple-100 font-serif italic leading-relaxed">
              ${currentTrack.interpretation}
            </p>
          </div>

          <!-- Progress / Seek Bar & Timestamps -->
          <div class="mb-5 px-1">
            <div class="relative w-full flex items-center">
              <input type="range" id="song-progress-bar" class="romantic-slider w-full" min="0" max="100" value="0" step="0.1" aria-label="Song progress">
            </div>
            <div class="flex justify-between items-center text-[11px] text-purple-300/80 font-mono mt-1.5 px-0.5">
              <span id="current-time-display">0:00</span>
              <span id="duration-display">0:00</span>
            </div>
          </div>

          <!-- Main Playback Controls (Previous, Play/Pause, Next) -->
          <div class="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            <!-- Previous Track Button -->
            <button id="prev-track-btn" class="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-pink-200 hover:text-white transition-all shadow-md cursor-pointer" title="Previous Track">
              <span class="text-base sm:text-lg">⏮️</span>
            </button>

            <!-- Play / Pause Action Button -->
            <button id="song-toggle-play-btn" class="btn-romantic py-3 px-7 sm:px-9 shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer" title="Play / Pause">
              <span id="play-btn-icon" class="text-base sm:text-lg">${isPlaying ? '⏸️' : '▶️'}</span>
              <span id="play-btn-label" class="text-xs sm:text-sm font-bold">${isPlaying ? 'Pause Song' : 'Play This Song'}</span>
            </button>

            <!-- Next Track Button -->
            <button id="next-track-btn" class="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-pink-200 hover:text-white transition-all shadow-md cursor-pointer" title="Next Track">
              <span class="text-base sm:text-lg">⏭️</span>
            </button>
          </div>

          <!-- Volume & Mute Control -->
          <div class="flex items-center justify-center gap-2.5 max-w-xs mx-auto px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <button id="mute-toggle-btn" class="text-pink-300 hover:text-pink-100 text-sm flex-shrink-0 transition-all cursor-pointer" title="Mute / Unmute">
              <span id="mute-btn-icon">${isMuted ? '🔇' : '🔊'}</span>
            </button>
            <input type="range" id="volume-slider" class="romantic-slider flex-1" min="0" max="1" step="0.01" value="${isMuted ? 0 : volumeVal}" aria-label="Volume control">
            <span id="volume-percent-label" class="text-[10px] text-purple-300/80 font-mono w-8 text-right">${isMuted ? '0%' : `${Math.round(volumeVal * 100)}%`}</span>
          </div>
        </div>

        <!-- Song List Playlist -->
        <div class="glass-panel-subtle p-4 rounded-2xl mb-6 border border-white/10">
          <span class="text-xs font-bold text-pink-300 uppercase tracking-wider block mb-3">
            Tracklist (${SONGS.length} Melodies)
          </span>

          <div class="space-y-2">
            ${SONGS.map(s => {
              const isCurrent = s.id === this.currentTrackId;
              return `
                <div data-song-id="${s.id}" class="song-list-item p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${isCurrent ? 'bg-gradient-to-r from-pink-500/25 to-purple-600/25 border-pink-400/50 shadow-md' : 'bg-white/5 border-white/5 hover:bg-white/10'}">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="item-play-icon w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      ${isCurrent && isPlaying ? '🎶' : '▶'}
                    </span>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <h4 class="text-xs font-bold text-pink-200 truncate">${s.title}</h4>
                        ${s.badge ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/30 text-pink-300 font-bold">${s.badge}</span>` : ''}
                      </div>
                      <p class="text-[11px] text-purple-300/70 truncate">${s.artist}</p>
                    </div>
                  </div>

                  <span class="text-[10px] text-pink-400 font-medium flex-shrink-0">${s.tag.split(' ')[0]}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Continue Button -->
        <div class="flex items-center justify-center gap-3">
          <button id="music-continue-btn" class="btn-secondary-romantic text-xs sm:text-sm py-3 px-8 cursor-pointer">
            <span>Play Heart Catcher</span>
            <span>🎯</span>
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const vinyl = document.getElementById("vinyl-disc");
      const togglePlayBtn = document.getElementById("song-toggle-play-btn");
      const playBtnIcon = document.getElementById("play-btn-icon");
      const playBtnLabel = document.getElementById("play-btn-label");
      const prevTrackBtn = document.getElementById("prev-track-btn");
      const nextTrackBtn = document.getElementById("next-track-btn");
      const songBadge = document.getElementById("active-song-badge");
      const songTitle = document.getElementById("active-song-title");
      const songArtist = document.getElementById("active-song-artist");
      const songInterp = document.getElementById("active-song-interpretation");
      const continueBtn = document.getElementById("music-continue-btn");
      const progressBar = document.getElementById("song-progress-bar");
      const currentTimeDisplay = document.getElementById("current-time-display");
      const durationDisplay = document.getElementById("duration-display");
      const volumeSlider = document.getElementById("volume-slider");
      const muteToggleBtn = document.getElementById("mute-toggle-btn");
      const muteBtnIcon = document.getElementById("mute-btn-icon");
      const volumePercentLabel = document.getElementById("volume-percent-label");

      let isDraggingProgress = false;
      const audio = audioManager.audioElement;

      const updateActiveUI = (track) => {
        if (songBadge) songBadge.innerText = track.badge || track.tag;
        if (songTitle) songTitle.innerText = track.title;
        if (songArtist) songArtist.innerText = track.artist;
        if (songInterp) songInterp.innerText = track.interpretation;

        section.querySelectorAll(".song-list-item").forEach(item => {
          const id = item.getAttribute("data-song-id");
          const sel = id === track.id;
          item.className = `song-list-item p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${sel ? 'bg-gradient-to-r from-pink-500/25 to-purple-600/25 border-pink-400/50 shadow-md' : 'bg-white/5 border-white/5 hover:bg-white/10'}`;
          const iconSpan = item.querySelector(".item-play-icon");
          if (iconSpan) {
            iconSpan.innerText = sel && audioManager.isPlayingMusic ? '🎶' : '▶';
          }
        });
      };

      const syncPlayStateUI = () => {
        const playing = audioManager.isPlayingMusic;
        if (playBtnIcon) playBtnIcon.innerText = playing ? '⏸️' : '▶️';
        if (playBtnLabel) playBtnLabel.innerText = playing ? 'Pause Song' : 'Play This Song';
        if (vinyl) vinyl.style.animationPlayState = playing ? 'running' : 'paused';

        section.querySelectorAll(".song-list-item").forEach(item => {
          const id = item.getAttribute("data-song-id");
          const sel = id === this.currentTrackId;
          const iconSpan = item.querySelector(".item-play-icon");
          if (iconSpan) {
            iconSpan.innerText = sel && playing ? '🎶' : '▶';
          }
        });
      };

      const syncVolumeUI = () => {
        const muted = audioManager.isMuted || (audio && audio.muted);
        const vol = audioManager.volume !== undefined ? audioManager.volume : 0.8;
        if (muteBtnIcon) muteBtnIcon.innerText = muted ? '🔇' : '🔊';
        if (volumeSlider) volumeSlider.value = muted ? 0 : vol;
        if (volumePercentLabel) volumePercentLabel.innerText = muted ? '0%' : `${Math.round(vol * 100)}%`;
      };

      const playTrackByIndex = (index) => {
        const validIndex = (index + SONGS.length) % SONGS.length;
        const track = SONGS[validIndex];
        if (track) {
          this.currentTrackId = track.id;
          updateActiveUI(track);
          audioManager.playSong(track, true);
          syncPlayStateUI();
        }
      };

      // Initial progress sync if audio is already active
      if (audio) {
        if (audio.duration && Number.isFinite(audio.duration)) {
          if (durationDisplay) durationDisplay.innerText = formatTime(audio.duration);
          if (currentTimeDisplay) currentTimeDisplay.innerText = formatTime(audio.currentTime);
          if (progressBar && !isDraggingProgress) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
          }
        }
      }

      // Audio element event listeners
      const onTimeUpdate = () => {
        if (!section.isConnected) {
          cleanupAudioListeners();
          return;
        }
        if (!audio) return;
        if (!isDraggingProgress) {
          const cur = audio.currentTime;
          const dur = audio.duration;
          if (currentTimeDisplay) currentTimeDisplay.innerText = formatTime(cur);
          if (dur && Number.isFinite(dur)) {
            if (durationDisplay) durationDisplay.innerText = formatTime(dur);
            if (progressBar) progressBar.value = (cur / dur) * 100;
          }
        }
      };

      const onLoadedMetadata = () => {
        if (!section.isConnected) {
          cleanupAudioListeners();
          return;
        }
        if (!audio) return;
        if (durationDisplay && audio.duration && Number.isFinite(audio.duration)) {
          durationDisplay.innerText = formatTime(audio.duration);
        }
      };

      const onPlayStateEvent = () => {
        if (!section.isConnected) {
          cleanupAudioListeners();
          return;
        }
        syncPlayStateUI();
      };

      const onSongEnded = () => {
        if (!section.isConnected) {
          cleanupAudioListeners();
          return;
        }
        const curIdx = SONGS.findIndex(s => s.id === this.currentTrackId);
        playTrackByIndex(curIdx + 1);
      };

      const onVolumeChange = () => {
        if (!section.isConnected) {
          cleanupAudioListeners();
          return;
        }
        syncVolumeUI();
      };

      const cleanupAudioListeners = () => {
        if (audio) {
          audio.removeEventListener("timeupdate", onTimeUpdate);
          audio.removeEventListener("loadedmetadata", onLoadedMetadata);
          audio.removeEventListener("play", onPlayStateEvent);
          audio.removeEventListener("pause", onPlayStateEvent);
          audio.removeEventListener("ended", onSongEnded);
          audio.removeEventListener("volumechange", onVolumeChange);
        }
      };

      if (audio) {
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("play", onPlayStateEvent);
        audio.addEventListener("pause", onPlayStateEvent);
        audio.addEventListener("ended", onSongEnded);
        audio.addEventListener("volumechange", onVolumeChange);
      }

      // Seeking / Progress Bar Events
      if (progressBar) {
        progressBar.addEventListener("input", (e) => {
          isDraggingProgress = true;
          if (audio && audio.duration && Number.isFinite(audio.duration)) {
            const pct = parseFloat(e.target.value);
            const targetSec = (pct / 100) * audio.duration;
            if (currentTimeDisplay) currentTimeDisplay.innerText = formatTime(targetSec);
          }
        });

        progressBar.addEventListener("change", (e) => {
          if (audio && audio.duration && Number.isFinite(audio.duration)) {
            const pct = parseFloat(e.target.value);
            const targetSec = (pct / 100) * audio.duration;
            audioManager.seek(targetSec);
          }
          isDraggingProgress = false;
        });
      }

      // Play / Pause Toggle Button
      if (togglePlayBtn) {
        togglePlayBtn.addEventListener("click", () => {
          if (audioManager.isPlayingMusic) {
            audioManager.pauseMusic();
            syncPlayStateUI();
          } else {
            const track = SONGS.find(s => s.id === this.currentTrackId) || SONGS[0];
            if (audioManager.currentTrack && audioManager.currentTrack.id === track.id && audio && audio.src) {
              audioManager.resumeMusic();
            } else {
              audioManager.playSong(track);
            }
            syncPlayStateUI();
          }
        });
      }

      // Previous Song Button
      if (prevTrackBtn) {
        prevTrackBtn.addEventListener("click", (e) => {
          const curIdx = SONGS.findIndex(s => s.id === this.currentTrackId);
          playTrackByIndex(curIdx - 1);
          spawnHeartBurst(e.clientX, e.clientY, 6, ["⏮️", "🎶", "❤️"]);
        });
      }

      // Next Song Button
      if (nextTrackBtn) {
        nextTrackBtn.addEventListener("click", (e) => {
          const curIdx = SONGS.findIndex(s => s.id === this.currentTrackId);
          playTrackByIndex(curIdx + 1);
          spawnHeartBurst(e.clientX, e.clientY, 6, ["⏭️", "🎶", "❤️"]);
        });
      }

      // Volume & Mute Controls
      if (volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
          const vol = parseFloat(e.target.value);
          audioManager.setVolume(vol);
          syncVolumeUI();
        });
      }

      if (muteToggleBtn) {
        muteToggleBtn.addEventListener("click", () => {
          audioManager.toggleMute();
          syncVolumeUI();
        });
      }

      // Playlist Item Clicking
      section.querySelectorAll(".song-list-item").forEach(item => {
        item.addEventListener("click", (e) => {
          const sid = item.getAttribute("data-song-id");
          const track = SONGS.find(s => s.id === sid);
          if (track) {
            if (this.currentTrackId === track.id && audioManager.isPlayingMusic) {
              audioManager.pauseMusic();
              syncPlayStateUI();
            } else if (this.currentTrackId === track.id && audio && audio.src) {
              audioManager.resumeMusic();
              syncPlayStateUI();
            } else {
              this.currentTrackId = track.id;
              updateActiveUI(track);
              audioManager.playSong(track, true);
              syncPlayStateUI();
            }
            spawnHeartBurst(e.clientX, e.clientY, 8, ["🎵", "🎶", "❤️"]);
          }
        });
      });

      // Continue Button
      if (continueBtn) {
        continueBtn.addEventListener("click", () => {
          audioManager.playRomanticTone(523.25, 0.4);
          if (this.onNextSection) {
            this.onNextSection("heart-catcher");
          }
        });
      }
    }, 50);

    return section;
  }
}

