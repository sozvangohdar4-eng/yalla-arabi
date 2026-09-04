/**
 * Grammar Guide Component: Comparative Kurdish-Iraqi Patterns & Rules
 */

class GrammarGuide {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;

    const patterns = window.GRAMMAR_PATTERNS || [];

    this.container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-6">
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📐</span>
            <span>ڕێزمانی بەراوردکاری عێراقی و کوردی</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            شیکردنەوەی قاڵبەکانی ڕستەسازی و چۆنیەتی گۆڕینی بیرکردنەوە لە کوردی سۆرانییەوە بۆ عەرەبی عێراقی
          </p>
        </div>

        <div class="space-y-6">
          ${patterns.map(p => `
            <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ${p.category}
                </span>
              </div>

              <h2 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 mb-2">
                ${p.title}
              </h2>

              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                ${p.description_ku}
              </p>

              <!-- Formula Box -->
              <div class="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 mb-4 flex items-center justify-between">
                <div class="text-xs font-bold text-slate-400">قاڵبی بنەڕەتی:</div>
                <div class="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono" dir="ltr">
                  ${p.formula}
                </div>
              </div>

              <!-- Examples List -->
              <div class="space-y-2">
                <div class="text-xs font-bold text-slate-400 mb-1">نموونە لە ژیانی ڕۆژانەدا:</div>
                ${p.examples.map(ex => `
                  <div class="bg-emerald-50/50 dark:bg-slate-800/40 p-3 rounded-xl flex items-center justify-between gap-3 border border-emerald-100 dark:border-slate-700/60">
                    <div>
                      <div class="text-base font-bold text-slate-800 dark:text-slate-100" dir="rtl">
                        ${ex.ar}
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        ${ex.ku}
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-slate-700">
                        ${ex.note}
                      </span>
                      <button 
                        onclick="window.audioEngine.speakIraqi('${ex.ar}')"
                        class="text-emerald-500 hover:scale-110 p-1 transition-transform">
                        <i data-lucide="volume-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

window.GrammarGuide = GrammarGuide;
