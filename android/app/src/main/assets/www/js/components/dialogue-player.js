/**
 * Dialogue Player Component: Interactive Real-World Roleplay Simulator
 */

class DialoguePlayer {
  constructor(containerId, appState) {
    this.container = document.getElementById(containerId);
    this.state = appState;
    this.activeDialogue = null;
    this.currentTurnIndex = 0;
  }

  render() {
    if (!this.container) return;

    if (this.activeDialogue) {
      this.renderActiveDialogue();
    } else {
      this.renderDialoguesList();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderDialoguesList() {
    const dialogues = window.DIALOGUES_DATA || [];

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-6">
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>💬</span>
            <span>گفتوگۆی ڕاستەقینە (محادثات)</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            هاوشێوەکردنی گفتوگۆ لە ژیانی ڕاستەقینەی عێراقدا: تاکسی، بازاڕ، چایخانە و مامەڵە
          </p>
        </div>

        <div class="space-y-4">
          ${dialogues.map(d => `
            <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-emerald-400 transition-all flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="text-4xl p-2.5 rounded-2xl bg-emerald-50 dark:bg-slate-800">${d.characterAvatar}</span>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">${d.level}</span>
                    <span class="text-xs text-slate-400 font-semibold">${d.category}</span>
                  </div>
                  <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">${d.title}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">${d.description}</p>
                </div>
              </div>

              <button 
                onclick="window.dialoguePlayer.startDialogue('${d.id}')"
                class="btn-duo-3d btn-green-3d px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap">
                دەستپێبکە
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  startDialogue(dialogueId) {
    const dialogues = window.DIALOGUES_DATA || [];
    this.activeDialogue = dialogues.find(d => d.id === dialogueId);
    this.currentTurnIndex = 0;
    this.render();

    // Automatically speak the first line if it's the other character
    if (this.activeDialogue && this.activeDialogue.turns[0].speaker === 'other') {
      setTimeout(() => {
        window.audioEngine.speakIraqi(this.activeDialogue.turns[0].text_ar);
      }, 300);
    }
  }

  renderActiveDialogue() {
    const d = this.activeDialogue;
    const turnsShown = d.turns.slice(0, this.currentTurnIndex + 1);
    const currentTurn = d.turns[this.currentTurnIndex];

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-4 flex flex-col justify-between min-h-[85vh]">
        <!-- Dialogue Header -->
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div class="flex items-center gap-3">
            <button onclick="window.dialoguePlayer.exitDialogue()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl">
              <i data-lucide="arrow-right" class="w-6 h-6"></i>
            </button>
            <div>
              <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>${d.characterAvatar}</span>
                <span>${d.title}</span>
              </h2>
              <span class="text-xs text-slate-400 font-semibold">${d.characterName}</span>
            </div>
          </div>
        </div>

        <!-- Chat Conversation Messages -->
        <div class="flex-1 overflow-y-auto space-y-4 py-2 scrollbar-none">
          ${turnsShown.map((t, idx) => {
            if (t.speaker === 'other') {
              return `
                <div class="flex items-start gap-3 justify-start">
                  <div class="text-3xl">${d.characterAvatar}</div>
                  <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl rounded-tr-none p-4 max-w-[85%] shadow-sm">
                    <div class="flex items-center justify-between gap-3 mb-1">
                      <span class="text-xs font-bold text-slate-400">${t.name}</span>
                      <button 
                        onclick="window.audioEngine.speakIraqi('${t.text_ar}')"
                        class="text-emerald-500 hover:scale-110 transition-transform">
                        <i data-lucide="volume-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                    <div class="text-lg font-black text-slate-800 dark:text-slate-100 mb-1" dir="rtl">
                      ${t.text_ar}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                      ${t.text_ku}
                    </div>
                  </div>
                </div>
              `;
            } else {
              const isTurnActive = (idx === this.currentTurnIndex);
              return `
                <div class="flex items-start gap-3 justify-end">
                  <div class="bg-emerald-500 text-white rounded-3xl rounded-tl-none p-4 max-w-[85%] shadow-md">
                    <div class="text-xs font-bold text-emerald-100 mb-1">وەڵامی تۆ</div>
                    <div class="text-lg font-black" dir="rtl">
                      ${t.target_ar}
                    </div>
                    <div class="text-xs text-emerald-100 mt-1">
                      خوێندنەوە: ${t.phonetic_ku}
                    </div>
                  </div>
                  <div class="text-3xl">🧑</div>
                </div>
              `;
            }
          }).join('')}
        </div>

        <!-- Current User Interaction Controls -->
        ${currentTurn && currentTurn.speaker === 'user' ? `
          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-3xl">
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              💡 ${currentTurn.prompt_ku}
            </div>

            <div class="space-y-2">
              ${currentTurn.options.map((opt, optIdx) => `
                <button 
                  onclick="window.dialoguePlayer.selectResponse(${opt.correct})"
                  class="btn-duo-3d btn-gray-3d w-full p-3.5 rounded-2xl text-right font-bold text-sm text-slate-800 dark:text-slate-100 flex flex-col items-start transition-all">
                  <span class="text-base" dir="rtl">${opt.ar}</span>
                  <span class="text-xs text-slate-400 font-normal mt-0.5">${opt.ku}</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : currentTurn && this.currentTurnIndex < d.turns.length - 1 ? `
          <div class="mt-4 pt-4 flex justify-end">
            <button 
              onclick="window.dialoguePlayer.nextTurn()" 
              class="btn-duo-3d btn-green-3d px-8 py-3 rounded-2xl font-black text-base">
              بەردەوام بە
            </button>
          </div>
        ` : `
          <div class="mt-6 p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 text-center">
            <div class="text-xl font-black text-emerald-800 dark:text-emerald-200 mb-1">
              🎉 گفتوگۆکە بە سەرکەوتوویی تەواو بوو!
            </div>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
              عاشت ايدك! ١٥ خاڵی XP وەردەگریت.
            </p>
            <button 
              onclick="window.dialoguePlayer.finishDialogue()"
              class="btn-duo-3d btn-green-3d px-6 py-2.5 rounded-2xl font-bold text-sm">
              گەڕانەوە بۆ لیستی گفتوگۆکان
            </button>
          </div>
        `}
      </div>
    `;
  }

  selectResponse(isCorrect) {
    if (isCorrect) {
      window.audioEngine.playCorrectSound();
      this.state.addXP(5);
      this.currentTurnIndex++;
      this.render();

      const nextTurn = this.activeDialogue.turns[this.currentTurnIndex];
      if (nextTurn && nextTurn.speaker === 'other') {
        setTimeout(() => {
          window.audioEngine.speakIraqi(nextTurn.text_ar);
        }, 300);
      }
    } else {
      window.audioEngine.playErrorSound();
    }
  }

  nextTurn() {
    window.audioEngine.playClickSound();
    this.currentTurnIndex++;
    this.render();

    const nextTurn = this.activeDialogue.turns[this.currentTurnIndex];
    if (nextTurn && nextTurn.speaker === 'other') {
      setTimeout(() => {
        window.audioEngine.speakIraqi(nextTurn.text_ar);
      }, 300);
    }
  }

  exitDialogue() {
    this.activeDialogue = null;
    this.render();
  }

  finishDialogue() {
    window.audioEngine.playLevelUpFanfare();
    this.state.addXP(15);
    this.activeDialogue = null;
    this.render();
  }
}

window.DialoguePlayer = DialoguePlayer;
