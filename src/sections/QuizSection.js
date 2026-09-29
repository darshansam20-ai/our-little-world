import { QUIZ_QUESTIONS, QUIZ_OUTCOMES } from "../data/quiz.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst, triggerCelebrationConfetti } from "../utils/particles.js";

export class QuizSectionComponent {
  constructor({ onQuizCompleted, onNextSection, onUnlockAchievement }) {
    this.onQuizCompleted = onQuizCompleted;
    this.onNextSection = onNextSection;
    this.onUnlockAchievement = onUnlockAchievement;
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.isCompleted = false;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-quiz";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    const renderCurrentState = () => {
      if (this.isCompleted) {
        return `
          <!-- Quiz Result / Certificate Screen -->
          <div class="glass-panel p-6 sm:p-8 border border-pink-400/40 shadow-2xl text-center bg-gradient-to-b from-purple-950/80 to-pink-950/80 animate-fadeIn">
            <div class="w-16 h-16 mx-auto rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center text-3xl mb-3 animate-pulse-slow">
              🎉
            </div>

            <span class="text-xs font-mono uppercase tracking-widest text-pink-300">Score: ${this.score} / ${QUIZ_QUESTIONS.length} Correct</span>
            <h2 class="text-2xl sm:text-3xl font-heading font-bold text-gradient-rose mt-1 mb-3">
              ${QUIZ_OUTCOMES.certificate}
            </h2>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 my-5">
              <p class="text-sm sm:text-base font-handwritten text-pink-100 font-bold italic leading-relaxed">
                ${QUIZ_OUTCOMES.quote}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button id="quiz-continue-btn" class="btn-romantic w-full sm:w-auto text-xs sm:text-sm py-3 px-8 shadow-xl">
                <span>Walk Down Memory Lane</span>
                <span>📸</span>
              </button>
            </div>
          </div>
        `;
      }

      const q = QUIZ_QUESTIONS[this.currentIndex];

      return `
        <!-- Active Question Card -->
        <div class="glass-panel p-6 sm:p-8 border border-purple-400/30 shadow-2xl text-left relative overflow-hidden">
          <!-- Question Header & Progress -->
          <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              Question ${this.currentIndex + 1} of ${QUIZ_QUESTIONS.length}
            </span>
            <span class="text-xs text-pink-300/80 font-script text-base">Modak × Coco Quiz</span>
          </div>

          <!-- Question Title -->
          <h3 class="text-lg sm:text-xl font-heading font-bold text-purple-100 mb-5">
            ${q.question}
          </h3>

          <!-- Options List -->
          <div class="space-y-2.5 mb-5">
            ${q.options.map((opt, optIdx) => `
              <button data-opt-index="${optIdx}" class="quiz-option-btn w-full p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-left text-xs sm:text-sm text-purple-100 font-medium transition-all flex items-center justify-between group cursor-pointer">
                <span>${opt}</span>
                <span class="text-purple-400/40 group-hover:text-pink-300 transition-colors">➔</span>
              </button>
            `).join("")}
          </div>

          <!-- Feedback Box (Hidden initially) -->
          <div id="quiz-feedback-box" class="hidden p-3.5 rounded-xl text-xs font-semibold mb-4 transition-all"></div>

          <!-- Next Button (Enabled after answering) -->
          <div id="quiz-next-wrapper" class="hidden flex justify-end">
            <button id="quiz-next-btn" class="btn-romantic text-xs px-6 py-2.5">
              <span>${this.currentIndex === QUIZ_QUESTIONS.length - 1 ? 'See Results 🎉' : 'Next Question →'}</span>
            </button>
          </div>
        </div>
      `;
    };

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto">
        <div class="text-center mb-5">
          <span class="text-3xl inline-block mb-1 animate-float">🥰</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">Love Quiz</h1>
          <p class="text-xs text-purple-200/80 mt-1">How Well Do You Know Your Modak?</p>
        </div>

        <div id="quiz-container">
          ${renderCurrentState()}
        </div>
      </div>
    `;

    const attachQuizEvents = () => {
      const container = document.getElementById("quiz-container");

      if (this.isCompleted) {
        const contBtn = document.getElementById("quiz-continue-btn");
        if (contBtn) {
          contBtn.addEventListener("click", () => {
            audioManager.playRomanticTone(523.25, 0.4);
            if (this.onNextSection) {
              this.onNextSection("memories");
            }
          });
        }
        return;
      }

      const q = QUIZ_QUESTIONS[this.currentIndex];
      const optBtns = section.querySelectorAll(".quiz-option-btn");
      const feedbackBox = document.getElementById("quiz-feedback-box");
      const nextWrapper = document.getElementById("quiz-next-wrapper");
      const nextBtn = document.getElementById("quiz-next-btn");

      optBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
          if (this.answered) return;
          this.answered = true;

          const chosenIdx = parseInt(btn.getAttribute("data-opt-index") || "0", 10);
          const isCorrect = chosenIdx === q.correctAnswer;

          if (isCorrect) {
            this.score++;
            audioManager.playSparkle();
            spawnHeartBurst(e.clientX, e.clientY, 10, ["✅", "❤️", "✨", "🥰"]);
            btn.className = "quiz-option-btn w-full p-3.5 rounded-xl border border-emerald-400 bg-emerald-500/20 text-left text-xs sm:text-sm text-emerald-100 font-bold transition-all flex items-center justify-between";
            
            if (feedbackBox) {
              feedbackBox.className = "p-3.5 rounded-xl text-xs font-semibold mb-4 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200";
              feedbackBox.innerText = q.correctFeedback;
              feedbackBox.classList.remove("hidden");
            }
          } else {
            audioManager.playKissSound();
            spawnHeartBurst(e.clientX, e.clientY, 6, ["❤️", "🥺", "🌸"]);
            btn.className = "quiz-option-btn w-full p-3.5 rounded-xl border border-pink-400 bg-pink-500/20 text-left text-xs sm:text-sm text-pink-100 font-bold transition-all flex items-center justify-between";
            
            // Highlight correct one
            optBtns[q.correctAnswer].className = "quiz-option-btn w-full p-3.5 rounded-xl border border-emerald-400/60 bg-emerald-500/10 text-left text-xs sm:text-sm text-emerald-200 font-semibold flex items-center justify-between";

            if (feedbackBox) {
              feedbackBox.className = "p-3.5 rounded-xl text-xs font-semibold mb-4 bg-pink-500/20 border border-pink-400/40 text-pink-200";
              feedbackBox.innerText = q.wrongFeedback;
              feedbackBox.classList.remove("hidden");
            }
          }

          if (nextWrapper) nextWrapper.classList.remove("hidden");
        });
      });

      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          this.answered = false;
          if (this.currentIndex < QUIZ_QUESTIONS.length - 1) {
            this.currentIndex++;
            audioManager.playRomanticTone(440, 0.3);
            if (container) {
              container.innerHTML = renderCurrentState();
              attachQuizEvents();
            }
          } else {
            this.isCompleted = true;
            audioManager.playCelebrationChord();
            triggerCelebrationConfetti();
            if (this.onUnlockAchievement) {
              this.onUnlockAchievement("coco-knows-modak");
            }
            if (this.onQuizCompleted) {
              this.onQuizCompleted(this.score);
            }
            if (container) {
              container.innerHTML = renderCurrentState();
              attachQuizEvents();
            }
          }
        });
      }
    };

    setTimeout(attachQuizEvents, 50);

    return section;
  }
}
