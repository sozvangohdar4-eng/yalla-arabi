/**
 * SRS Vocabulary Component: Spaced Repetition Flashcards & Dictionary
 */

class SrsVocab {
  constructor(containerId, appState) {
    this.container = document.getElementById(containerId);
    this.state = appState;
    this.activeFilter = 'ALL';
    this.searchQuery = '';
    this.activeMode = 'flashcards'; // 'flashcards' | 'dictionary'
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
  }

  render() {
    if (!this.container) return;

    const allVocab = window.VOCABULARY_DATABASE || [];
    const q = (this.searchQuery || '').trim().toLowerCase();
    const filtered = allVocab.filter(item => {
      const itemLevel = item.level || 'A1';
      const matchesLevel = (this.activeFilter === 'ALL' || itemLevel === this.activeFilter);
      const phoneticText = (item.phonetic_ku || item.phonetic || '').toLowerCase();
      const arText = (item.ar || '').toLowerCase();
      const kuText = (item.ku || '').toLowerCase();
      const matchesSearch = !q || 
        arText.includes(q) || 
        kuText.includes(q) ||
        phoneticText.includes(q);
      return matchesLevel && matchesSearch;
    });

    const currentWord = filtered[this.currentCardIndex] || filtered[0];

    this.container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>📚</span>
              <span>فەرهەنگ و وشەسازی عێراقی</span>
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              فێربوونی وشە و دەستەواژە عێراقییەکان بە بێژەکردن و نموونەی ڕستەیی بۆ کوردانی سۆرانی
            </p>
          </div>

          <!-- Mode Switcher -->
          <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button 
              onclick="window.srsVocab.setMode('flashcards')"
              class="px-4 py-2 rounded-xl text-xs font-black transition-all ${this.activeMode === 'flashcards' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}">
              🗂️ فلاش کارد
            </button>
            <button 
              onclick="window.srsVocab.setMode('dictionary')"
              class="px-4 py-2 rounded-xl text-xs font-black transition-all ${this.activeMode === 'dictionary' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}">
              📖 فەرهەنگی گشتی
            </button>
          </div>
        </div>

        <!-- Level Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          ${['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => `
            <button 
              onclick="window.srsVocab.setFilter('${lvl}')"
              class="px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${this.activeFilter === lvl ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
              ${lvl === 'ALL' ? 'هەموو ئاستەکان' : lvl}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
          <input 
            type="text" 
            placeholder="گەڕان بۆ وشە بە عێراقی یان کوردی..."
            value="${this.searchQuery}"
            oninput="window.srsVocab.handleSearch(this.value)"
            class="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl py-3 pr-11 pl-4 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm">
          <div class="absolute right-4 top-3.5 text-slate-400 pointer-events-none">
            <i data-lucide="search" class="w-4 h-4"></i>
          </div>
        </div>

        ${this.activeMode === 'flashcards' 
          ? this.renderFlashcardsMode(currentWord, filtered.length)
          : this.renderDictionaryMode(filtered)
        }
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderFlashcardsMode(word, totalWords) {
    if (!word) {
      return `<div class="text-center py-12 text-slate-400">هیچ وشەیەک نەدۆزرایەوە بەم فلتەرە.</div>`;
    }

    const wordLevel = word.level || 'A1';
    const categoryLabel = (word.category_name_ku || word.category || 'گشتی') + (word.pos ? ` • ${word.pos}` : '');
    const phoneticLabel = word.phonetic_ku || word.phonetic || '';
    const safeAr = (word.ar || '').replace(/'/g, "\\'");

    return `
      <div class="max-w-md mx-auto">
        <!-- Progress Info -->
        <div class="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span>کارت ${this.currentCardIndex + 1} لە ${totalWords}</span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-sans font-bold">${wordLevel}</span>
        </div>

        <!-- Interactive 3D Flip Card -->
        <div 
          onclick="window.srsVocab.toggleCardFlip()" 
          class="flip-card w-full h-80 cursor-pointer mb-6 ${this.isCardFlipped ? 'flipped' : ''}">
          
          <div class="flip-card-inner w-full h-full relative">
            <!-- Front of Card (Iraqi Arabic) -->
            <div class="flip-card-front absolute inset-0 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between shadow-lg">
              <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                ${categoryLabel}
              </div>

              <div class="text-center">
                <div class="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mb-3" dir="rtl">
                  ${word.ar}
                </div>
                ${phoneticLabel ? `
                  <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    خوێندنەوە: ${phoneticLabel}
                  </div>
                ` : ''}
              </div>

              <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                <i data-lucide="rotate-cw" class="w-4 h-4"></i>
                <span>کلیک بکە بۆ بینینی مانا بە کوردی سۆرانی</span>
              </div>
            </div>

            <!-- Back of Card (Kurdish Meaning & Examples) -->
            <div class="flip-card-back absolute inset-0 bg-emerald-50 dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600/40 rounded-3xl p-6 flex flex-col items-center justify-between shadow-lg">
              <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                مانا بە کوردی سۆرانی
              </div>

              <div class="text-center w-full">
                <div class="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-200 mb-4">
                  ${word.ku || ''}
                </div>

                ${(word.example_ar || word.example_ku) ? `
                  <div class="bg-white dark:bg-slate-800/80 p-3 rounded-2xl text-right border border-emerald-200 dark:border-slate-700 text-xs sm:text-sm">
                    ${word.example_ar ? `<div class="font-bold text-slate-800 dark:text-slate-100 mb-1" dir="rtl">💬 "${word.example_ar}"</div>` : ''}
                    ${word.example_ku ? `<div class="text-slate-500 dark:text-slate-400">"${word.example_ku}"</div>` : ''}
                  </div>
                ` : ''}
              </div>

              <button 
                onclick="event.stopPropagation(); window.audioEngine.speakIraqi('${safeAr}')"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
                <span>گوێگرتن لە دەنگ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- SRS Action Buttons (Hard, Good, Easy) -->
        <div class="grid grid-cols-3 gap-3">
          <button 
            onclick="window.srsVocab.rateWord('hard')" 
            class="btn-duo-3d bg-rose-500 text-white border-b-4 border-rose-700 py-3 rounded-2xl font-bold text-xs sm:text-sm">
            دووبارە (سەخت)
          </button>
          <button 
            onclick="window.srsVocab.rateWord('good')" 
            class="btn-duo-3d bg-blue-500 text-white border-b-4 border-blue-700 py-3 rounded-2xl font-bold text-xs sm:text-sm">
            باش بوو
          </button>
          <button 
            onclick="window.srsVocab.rateWord('easy')" 
            class="btn-duo-3d btn-green-3d py-3 rounded-2xl font-bold text-xs sm:text-sm">
            ئاسانە (فێربووم)
          </button>
        </div>
      </div>
    `;
  }

  renderDictionaryMode(wordsList) {
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${wordsList.map(item => {
          const itemLvl = item.level || 'A1';
          const phoneticStr = item.phonetic_ku || item.phonetic || '';
          const safeAr = (item.ar || '').replace(/'/g, "\\'");
          return `
            <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans">${itemLvl}</span>
                  <button 
                    onclick="window.audioEngine.speakIraqi('${safeAr}')"
                    class="text-emerald-500 hover:scale-110 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                    title="گوێگرتن لە دەنگ">
                    <i data-lucide="volume-2" class="w-5 h-5"></i>
                  </button>
                </div>

                <div class="text-xl font-black text-slate-800 dark:text-slate-100 mb-0.5" dir="rtl">
                  ${item.ar || ''}
                </div>
                ${phoneticStr ? `
                  <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    ${phoneticStr}
                  </div>
                ` : ''}

                <div class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  ${item.ku || ''}
                </div>
              </div>

              ${(item.example_ar || item.example_ku) ? `
                <div class="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-xs">
                  ${item.example_ar ? `<div class="font-bold text-slate-700 dark:text-slate-200 mb-0.5" dir="rtl">"${item.example_ar}"</div>` : ''}
                  ${item.example_ku ? `<div class="text-slate-500 dark:text-slate-400">"${item.example_ku}"</div>` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  setFilter(lvl) {
    this.activeFilter = lvl;
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
    this.render();
  }

  setMode(mode) {
    this.activeMode = mode;
    this.isCardFlipped = false;
    this.render();
  }

  handleSearch(val) {
    this.searchQuery = val;
    this.currentCardIndex = 0;
    this.render();
  }

  toggleCardFlip() {
    window.audioEngine.playClickSound();
    this.isCardFlipped = !this.isCardFlipped;
    this.render();
  }

  rateWord(rating) {
    if (rating === 'easy') {
      window.audioEngine.playCorrectSound();
      this.state.addXP(2);
    } else {
      window.audioEngine.playClickSound();
    }

    const allVocab = window.VOCABULARY_DATABASE || [];
    const filtered = allVocab.filter(item => this.activeFilter === 'ALL' || item.level === this.activeFilter);

    if (this.currentCardIndex < filtered.length - 1) {
      this.currentCardIndex++;
    } else {
      this.currentCardIndex = 0;
    }
    this.isCardFlipped = false;
    this.render();
  }
}

window.SrsVocab = SrsVocab;
