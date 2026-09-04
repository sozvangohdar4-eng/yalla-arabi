/**
 * Medical Course Component (کۆرسی پزیشکی بۆ کارمەندانی تەندروستی)
 * Dedicated Clinical Curriculum & Medical Phrasebook for Kurdish Sorani Healthcare Workers
 */

class MedicalCourse {
  constructor(containerId, appState, onStartLesson) {
    this.container = document.getElementById(containerId);
    this.state = appState;
    this.onStartLesson = onStartLesson;

    this.activeLevel = 'm_a1';
    this.activeTab = 'curriculum'; // 'curriculum' | 'glossary'
    this.glossaryFilter = 'ALL';
    this.glossarySearch = '';
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-6">
        <!-- Medical Section Banner -->
        <div class="bg-gradient-to-l from-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
              <span>🩺</span>
              <span>بەشی تایبەتمەندی پزیشکی (Medical Track)</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-black mb-2">
              کۆرسی عەرەبی پزیشکی عێراقی
            </h1>
            <p class="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed font-medium">
              تایبەت دیزاینکراو بۆ پزیشکان، پەرستاران، دەرمانسازان، کارمەندانی تاقیگە و خوێندکارانی پزیشکی کورد بۆ پەیوەندی پاراو لەگەڵ نەخۆش و خێزانەکانیان لە سەرتاسەری عێراقدا (A1 تاوەکو C2).
            </p>

            <!-- Mode Switcher: Curriculum vs Glossary -->
            <div class="flex items-center gap-2 mt-6">
              <button 
                onclick="window.medicalCourse.switchTab('curriculum')"
                class="px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center gap-2 ${this.activeTab === 'curriculum' ? 'bg-white text-sky-700 shadow-md scale-105' : 'bg-white/20 text-white hover:bg-white/30'}">
                <span>📋</span>
                <span>مەنهەجی وانە کلینیکییەکان</span>
              </button>

              <button 
                onclick="window.medicalCourse.switchTab('glossary')"
                class="px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center gap-2 ${this.activeTab === 'glossary' ? 'bg-white text-sky-700 shadow-md scale-105' : 'bg-white/20 text-white hover:bg-white/30'}">
                <span>📚</span>
                <span>فەرهەنگی خێرای پزیشکی بە دەنگ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Body Content -->
        ${this.activeTab === 'curriculum' ? this.renderCurriculumView() : this.renderGlossaryView()}
      </div>

      <!-- Medical Guidebook Modal Container -->
      <div id="modal-medical-guidebook" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div id="modal-medical-guidebook-content" class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl animate-fade-in text-right">
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  switchTab(tabName) {
    window.audioEngine.playClickSound();
    this.activeTab = tabName;
    this.render();
  }

  setLevel(levelId) {
    window.audioEngine.playClickSound();
    this.activeLevel = levelId;
    this.render();
  }

  renderCurriculumView() {
    const medicalCurriculum = window.MEDICAL_CURRICULUM || [];
    const currentLvl = medicalCurriculum.find(l => l.levelId === this.activeLevel) || medicalCurriculum[0];

    return `
      <div>
        <!-- 6 Medical Levels Selector Grid -->
        <div class="mb-8">
          <div class="text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
            ئاستە پزیشکییەکان (CEFR Medical Levels):
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            ${medicalCurriculum.map(lvl => {
              const isSelected = (lvl.levelId === this.activeLevel);
              return `
                <button 
                  onclick="window.medicalCourse.setLevel('${lvl.levelId}')" 
                  class="p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                    isSelected 
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 shadow-md ring-2 ring-sky-400' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300'
                  }">
                  <span class="text-xs font-black ${isSelected ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-200'}">
                    ${lvl.levelTitle.split(':')[0]}
                  </span>
                  <span class="text-[10px] text-slate-400 line-clamp-1">
                    ${lvl.levelTitle.split(':')[1] || ''}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Active Level Header -->
        ${currentLvl ? `
          <div class="mb-8 bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span class="w-3.5 h-3.5 rounded-full bg-sky-500 inline-block"></span>
                <span>${currentLvl.levelTitle}</span>
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                ${currentLvl.levelSubtitle}
              </p>
            </div>
            <span class="text-xs font-black text-sky-600 bg-sky-50 dark:bg-sky-950 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 self-start sm:self-auto">
              ${currentLvl.units.length} بەشی کلینیکی
            </span>
          </div>

          <!-- Units and Lessons Path -->
          <div class="space-y-8">
            ${currentLvl.units.map(unit => this.renderUnitCard(unit)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderUnitCard(unit) {
    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <!-- Unit Header Banner -->
        <div class="bg-gradient-to-l from-sky-500/10 to-teal-500/10 border-b-2 border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              ${unit.icon}
            </span>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                ${unit.title}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ${unit.description}
              </p>
            </div>
          </div>

          <!-- Guidebook Button -->
          <button 
            onclick="window.medicalCourse.openGuidebook('${unit.id}')"
            class="px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-black text-xs hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-sm">
            <span>ڕێنمایی پزیشکی</span>
            <span>🩺</span>
          </button>
        </div>

        <!-- Lessons List -->
        <div class="p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
          ${unit.lessons.map(lesson => {
            const isCompleted = this.state.isLessonCompleted(lesson.id);
            return `
              <div class="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }">
                    ${isCompleted ? '✓' : '🩺'}
                  </div>

                  <div>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      ${lesson.title}
                    </h4>
                    <span class="text-[11px] font-bold text-amber-500">
                      +${lesson.xp || 25} XP
                    </span>
                  </div>
                </div>

                <button 
                  onclick="window.medicalCourse.startLesson('${lesson.id}')"
                  class="btn-duo-3d ${isCompleted ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b-slate-300' : 'btn-green-3d'} px-5 py-2 rounded-xl font-black text-xs whitespace-nowrap shadow-sm">
                  ${isCompleted ? 'دووبارەکردنەوە' : 'دەستپێبکە'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  startLesson(lessonId) {
    const medicalCurriculum = window.MEDICAL_CURRICULUM || [];
    let foundLesson = null;

    for (const lvl of medicalCurriculum) {
      for (const u of lvl.units) {
        for (const l of u.lessons) {
          if (l.id === lessonId) {
            foundLesson = l;
            break;
          }
        }
        if (foundLesson) break;
      }
      if (foundLesson) break;
    }

    if (foundLesson && this.onStartLesson) {
      window.app.currentViewSource = 'medical';
      this.onStartLesson(foundLesson);
    }
  }

  openGuidebook(unitId) {
    window.audioEngine.playClickSound();
    const g = (window.MEDICAL_GUIDEBOOKS && window.MEDICAL_GUIDEBOOKS[unitId]) || null;
    const modal = document.getElementById('modal-medical-guidebook');
    const content = document.getElementById('modal-medical-guidebook-content');

    if (!g || !modal || !content) return;

    content.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <span class="text-xs font-black text-sky-600 uppercase tracking-wider">ڕێنمایی پزیشکی کلینیکی</span>
          <h2 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">${g.title}</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">${g.subtitle}</p>
        </div>
        <button onclick="window.medicalCourse.closeGuidebook()" class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Summary Card -->
        <div class="bg-sky-50 dark:bg-sky-950/40 p-4 rounded-2xl border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          ${g.summary_ku}
        </div>

        <!-- Comparative Clinical Table -->
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span>🩺</span>
            <span>خشتەی دەستەواژە پزیشکییەکان (عێراقی و سۆرانی):</span>
          </h3>

          <div class="space-y-2.5">
            ${g.keyTable.map(item => `
              <div class="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <button 
                    onclick="window.audioEngine.speakIraqi('${item.ar.replace(/\s*\(.*?\)/g, '').split('➔')[0].trim()}')"
                    class="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    title="گوێگرتن لە دەنگ">
                    <i data-lucide="volume-2" class="w-4 h-4"></i>
                  </button>
                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-slate-100" dir="rtl">${item.ar}</div>
                    ${item.note ? `<div class="text-[11px] text-slate-400 font-medium">${item.note}</div>` : ''}
                  </div>
                </div>

                <div class="text-xs font-bold text-sky-700 dark:text-sky-400 sm:text-left">
                  ${item.ku}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cultural & Bedside Notes -->
        ${g.culturalNotes_ku && g.culturalNotes_ku.length > 0 ? `
          <div class="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
            <h4 class="text-xs font-black text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
              <span>💡</span>
              <span>ئەتەکێتی نەخۆشخانەکانی عێراق و پەیوەندی لەگەڵ نەخۆش:</span>
            </h4>
            <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed font-medium">
              ${g.culturalNotes_ku.map(note => `<li>${note}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Phonetics tip -->
        ${g.phonetics_ku ? `
          <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <span>🗣️</span>
            <span><strong>دەنگسازی:</strong> ${g.phonetics_ku}</span>
          </div>
        ` : ''}
      </div>

      <button 
        onclick="window.medicalCourse.closeGuidebook()" 
        class="w-full mt-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
        داخستن
      </button>
    `;

    modal.classList.remove('hidden');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  closeGuidebook() {
    window.audioEngine.playClickSound();
    const modal = document.getElementById('modal-medical-guidebook');
    if (modal) modal.classList.add('hidden');
  }

  // --- Glossary Mode ---
  renderGlossaryView() {
    const allGlossary = window.MEDICAL_GLOSSARY || [];
    const filtered = allGlossary.filter(item => {
      const matchesCat = (this.glossaryFilter === 'ALL' || item.category === this.glossaryFilter);
      const searchLower = (this.glossarySearch || '').trim().toLowerCase();
      const matchesSearch = !searchLower || 
        (item.ar || '').toLowerCase().includes(searchLower) || 
        (item.ku || '').toLowerCase().includes(searchLower) || 
        (item.phonetic || '').toLowerCase().includes(searchLower);
      return matchesCat && matchesSearch;
    });

    const categories = [
      { id: 'ALL', label: 'هەموو' },
      { id: 'triage', label: 'پێشوازی و نیشانەکان' },
      { id: 'anatomy', label: 'ئەندامەکانی لەش' },
      { id: 'symptoms', label: 'ئازار و نیشانە' },
      { id: 'exam', label: 'پشکنینی جەستەیی' },
      { id: 'pharmacy', label: 'دەرمانخانە' },
      { id: 'emergency', label: 'فریاکەوتن' },
      { id: 'labs', label: 'تاقیگە و تیشک' },
      { id: 'surgery', label: 'نەشتەرگەری' },
      { id: 'oncology', label: 'شێرپەنجە' },
      { id: 'chronic', label: 'نەخۆشی درێژخایەن' },
      { id: 'icu', label: 'چاودێری چڕ' },
      { id: 'forensic', label: 'دادپزیشکی' }
    ];

    return `
      <div>
        <!-- Search & Filter Controls -->
        <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-6">
          <div class="relative mb-4">
            <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute right-4 top-3.5"></i>
            <input 
              type="text" 
              placeholder="گەڕان بەدوای نیشانە، دەرمان یان دەستەواژەی پزیشکی (عێراقی یان کوردی)..." 
              value="${this.glossarySearch}"
              oninput="window.medicalCourse.handleSearch(this.value)"
              class="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-500 transition-colors" />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            ${categories.map(c => `
              <button 
                onclick="window.medicalCourse.setGlossaryCategory('${c.id}')"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  this.glossaryFilter === c.id 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }">
                ${c.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Glossary Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${filtered.length > 0 ? filtered.map(item => `
            <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-sky-400 transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div class="text-lg font-black text-slate-800 dark:text-slate-100" dir="rtl">
                    ${item.ar}
                  </div>
                  <button 
                    onclick="window.audioEngine.speakIraqi('${(item.ar || '').replace(/'/g, "\\'")}')"
                    class="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    title="گوێگرتن لە دەنگ">
                    <i data-lucide="volume-2" class="w-4 h-4"></i>
                  </button>
                </div>

                ${item.phonetic ? `
                  <div class="text-xs font-black text-sky-600 dark:text-sky-400 mb-2">
                    خوێندنەوە: <span class="font-bold">${item.phonetic}</span>
                  </div>
                ` : ''}

                <div class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                  واتا: ${item.ku}
                </div>
              </div>

              ${item.example_ar ? `
                <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div class="flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold mb-1" dir="rtl">
                    <span>${item.example_ar}</span>
                    <button onclick="window.audioEngine.speakIraqi('${(item.example_ar || '').replace(/'/g, "\\'")}')" class="text-sky-500 hover:scale-110">
                      <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">${item.example_ku}</div>
                </div>
              ` : ''}
            </div>
          `).join('') : `
            <div class="col-span-full py-12 text-center text-slate-400 font-bold text-sm">
              هیچ دەستەواژەیەک نەدۆزرایەوە بەپێی ئەم گەڕانە.
            </div>
          `}
        </div>
      </div>
    `;
  }

  handleSearch(query) {
    this.glossarySearch = query;
    this.render();
  }

  setGlossaryCategory(catId) {
    window.audioEngine.playClickSound();
    this.glossaryFilter = catId;
    this.render();
  }
}

window.MedicalCourse = MedicalCourse;
