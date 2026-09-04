/**
 * Learning Path Component: Interactive Duolingo Tree with Always-Visible Level Grid,
 * Unit Guidebooks (دەفتەری ڕێنمایی) & Milestone Chests
 */

class LearningPath {
  constructor(containerId, appState, onStartLesson) {
    this.container = document.getElementById(containerId);
    this.state = appState;
    this.onStartLesson = onStartLesson;
  }

  render(activeLevelId = 'a1') {
    if (!this.container) return;

    // Default to a1 if invalid
    if (!activeLevelId || !['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(activeLevelId)) {
      activeLevelId = 'a1';
    }

    // Combine all curriculum levels
    const allCurriculum = [
      ...window.CURRICULUM_A1_A2,
      ...window.CURRICULUM_B1_B2,
      ...window.CURRICULUM_C1_C2
    ];

    const currentLevel = allCurriculum.find(l => l.levelId === activeLevelId) || allCurriculum[0];

    // Colors & descriptions for each level
    const levelMeta = {
      a1: { tag: 'A1', label: 'سەرەتایی ١', desc: 'دەستپێک و بنەماکان', color: 'from-emerald-500 to-green-600', border: 'border-emerald-400' },
      a2: { tag: 'A2', label: 'سەرەتایی ٢', desc: 'هاتوچۆ، تاکسی و بازاڕ', color: 'from-blue-500 to-sky-600', border: 'border-blue-400' },
      b1: { tag: 'B1', label: 'ناوەندی ١', desc: 'ڕستەسازی و قاڵبەکان', color: 'from-amber-500 to-yellow-600', border: 'border-amber-400' },
      b2: { tag: 'B2', label: 'ناوەندی ٢', desc: 'دەستەواژە و پەندەکان', color: 'from-purple-500 to-violet-600', border: 'border-purple-400' },
      c1: { tag: 'C1', label: 'پێشکەوتوو', desc: 'سڵانگ و زمانی کۆڵان', color: 'from-pink-500 to-rose-600', border: 'border-pink-400' },
      c2: { tag: 'C2', label: 'شارەزایی باڵا', desc: 'شێعر و کەلەپوور', color: 'from-indigo-600 to-cyan-600', border: 'border-indigo-400' }
    };

    // ALWAYS-VISIBLE 6-Level Grid
    let levelGridHtml = `
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3 px-1">
          <h2 class="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="layers" class="w-4 h-4 text-emerald-500"></i>
            <span>هەڵبژاردنی ئاستی فێربوون (A1 تا C2)</span>
          </h2>
          <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            کلیک بکە بۆ گۆڕینی ئاست
          </span>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          ${allCurriculum.map(lvl => {
            const isActive = lvl.levelId === activeLevelId;
            const meta = levelMeta[lvl.levelId] || levelMeta.a1;

            return `
              <button 
                onclick="window.app.switchLevel('${lvl.levelId}')"
                class="btn-duo-3d relative p-2.5 sm:p-3 rounded-2xl text-center transition-all flex flex-col items-center justify-between ${
                  isActive 
                    ? 'bg-gradient-to-b ' + meta.color + ' text-white border-b-4 border-slate-900/30 scale-105 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400' 
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
                }">
                
                ${isActive ? `
                  <div class="absolute -top-2.5 bg-white text-emerald-700 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow border border-emerald-300">
                    چالاک ✓
                  </div>
                ` : ''}

                <div class="text-base sm:text-lg font-black tracking-tight mb-0.5">
                  ${meta.tag}
                </div>
                <div class="text-[10px] sm:text-[11px] font-bold leading-tight">
                  ${meta.label}
                </div>
                <div class="text-[8px] sm:text-[9px] ${isActive ? 'text-white/80' : 'text-slate-400'} mt-0.5 line-clamp-1">
                  ${meta.desc}
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Active Level Notification Banner
    const activeMeta = levelMeta[activeLevelId] || levelMeta.a1;
    let activeLevelBannerHtml = `
      <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 mb-6 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr ${activeMeta.color} text-white font-black text-sm flex items-center justify-center shadow-md">
            ${activeMeta.tag}
          </div>
          <div>
            <div class="text-xs text-slate-400 font-bold">ئێستا لەم ئاستەدایت:</div>
            <div class="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">${currentLevel.levelTitle}</div>
          </div>
        </div>

        <div class="text-left">
          <span class="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-xl">
            ${currentLevel.units.length} بەش
          </span>
        </div>
      </div>
    `;

    // Mascot Advice Widget Card
    let mascotWidgetHtml = `
      <div class="bg-gradient-to-l from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800/80 border-2 border-emerald-200 dark:border-emerald-800/50 rounded-3xl p-4 sm:p-5 mb-8 shadow-sm flex items-center gap-4">
        <div class="text-4xl sm:text-5xl mascot-bobbing flex-shrink-0 select-none">
          🌴
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              نەخیلۆکە (مامۆستای زمانەکەت)
            </span>
            <button 
              onclick="window.app.startPracticeMode()" 
              class="btn-duo-3d bg-white dark:bg-slate-800 text-rose-500 border border-rose-200 dark:border-rose-900/50 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-rose-50">
              <i data-lucide="heart" class="w-3.5 h-3.5 fill-rose-500"></i>
              <span>ڕاهێنانی دڵەکان (+١ ❤️)</span>
            </button>
          </div>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
            "شلونك حبيبي! پێش ئەوەی دەست بە وانەکانی هەر بەشێک بکەیت، کلیک لە دوگمەی <strong>دەفتەری ڕێنمایی 📖</strong> بکە بۆ خوێندنەوەی یاساکان و خشتەی بەراوردی وشەکان!"
          </p>
        </div>
      </div>
    `;

    // Render units and nodes
    let unitsHtml = currentLevel.units.map((unit, unitIdx) => {
      let nodeOffsets = [0, -45, 0, 45, 0];

      let lessonsNodesHtml = unit.lessons.map((lesson, lessonIdx) => {
        const isCompleted = this.state.isLessonCompleted(lesson.id);
        const isUnlocked = this.state.isLessonUnlocked(lesson.id, unitIdx, lessonIdx);
        const offset = nodeOffsets[lessonIdx % nodeOffsets.length];

        return `
          <div class="flex flex-col items-center my-6 relative transition-transform z-10" style="transform: translateX(${offset}px);">
            <button 
              onclick="window.app.startLesson('${lesson.id}', '${unit.id}', '${currentLevel.levelId}')"
              ${!isUnlocked ? 'disabled' : ''}
              class="path-node-btn ${isCompleted ? 'btn-gold-3d bg-amber-400 text-white' : isUnlocked ? 'btn-green-3d bg-emerald-500 text-white' : 'locked'} group"
              title="${lesson.title}">
              
              <div class="text-2xl mb-0.5">
                ${isCompleted ? '⭐' : isUnlocked ? '📖' : '🔒'}
              </div>
              
              ${isUnlocked && !isCompleted ? `
                <div class="absolute -top-3 -right-2 bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm animate-bounce">
                  دەستپێبکە
                </div>
              ` : ''}
            </button>

            <div class="mt-2 text-center max-w-[160px]">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2 leading-tight">
                ${lesson.title}
              </span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                +${lesson.xp} XP
              </span>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="mb-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <!-- Unit Header Banner with Guidebook Button -->
          <div class="bg-gradient-to-l from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md mb-8">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3">
                <span class="text-3xl sm:text-4xl bg-white/20 p-3 rounded-2xl backdrop-blur-sm">${unit.icon}</span>
                <div>
                  <div class="text-xs font-black tracking-wider text-emerald-100 uppercase">${currentLevel.levelTitle}</div>
                  <h3 class="text-lg sm:text-xl font-black">${unit.title}</h3>
                  <p class="text-xs sm:text-sm text-emerald-50 mt-0.5 line-clamp-1">${unit.description}</p>
                </div>
              </div>

              <!-- Unit Guidebook Button -->
              <button 
                onclick="window.learningPath.openGuidebook('${unit.id}')"
                class="btn-duo-3d bg-white text-emerald-800 border-b-4 border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:bg-emerald-50 flex-shrink-0 transition-transform active:scale-95"
                title="خوێندنەوەی یاساکان و خشتەی وشەکانی ئەم بەشە">
                <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i>
                <span>ڕێنمایی 📖</span>
              </button>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-emerald-400/30 text-xs text-emerald-100 font-bold">
              <span>${unit.lessons.length} وانەی ڕاهێنان</span>
              <span>تەواوکراو: ${unit.lessons.filter(l => this.state.isLessonCompleted(l.id)).length} / ${unit.lessons.length}</span>
            </div>
          </div>

          <!-- Staggered Path Tree with SVG connecting curves -->
          <div class="flex flex-col items-center py-4 relative">
            <div class="absolute top-4 bottom-4 w-2.5 bg-slate-100 dark:bg-slate-800 rounded-full z-0"></div>
            
            <div class="relative z-10 w-full flex flex-col items-center">
              ${lessonsNodesHtml}

              <!-- Unit Completion Milestone Chest -->
              <div class="mt-4 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" onclick="window.learningPath.claimMilestoneReward('${unit.id}')">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-b-4 border-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20" title="سندوقی پاداشتی بەش">
                  🏆
                </div>
                <span class="text-xs font-black text-amber-600 dark:text-amber-400 mt-2">پاداشتی کۆتایی بەش</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="max-w-xl mx-auto px-3 sm:px-4 py-4">
        <!-- Always-Visible 6-Level Grid -->
        ${levelGridHtml}

        <!-- Active Level Banner -->
        ${activeLevelBannerHtml}

        <!-- Mascot Advice Widget -->
        ${mascotWidgetHtml}

        <!-- Units List -->
        ${unitsHtml}
      </div>

      <!-- Unit Guidebook Modal Container -->
      <div id="unit-guidebook-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"></div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  openGuidebook(unitId) {
    const modal = document.getElementById('unit-guidebook-modal');
    if (!modal) return;

    window.audioEngine.playClickSound();

    const guidebook = (window.UNIT_GUIDEBOOKS && window.UNIT_GUIDEBOOKS[unitId]) || {
      title: `دەفتەری ڕێنمایی: ${unitId.toUpperCase()}`,
      subtitle: 'یاساکانی زمان و ڕێنمایی وتووێژ',
      summary_ku: 'لە عەرەبی عێراقیدا وشە و دەستەواژەکان زۆر زیندوون و پەیوەستن بە کلتووری کۆمەڵایەتی و ڕێزگرتنی هاوبەش.',
      keyTable: [
        { ar: 'هلو عيني', ku: 'سڵاو چاوم', note: 'دەستەواژەی باوی شەقام' },
        { ar: 'على راسي', ku: 'سەر سەرم و سەر چاوم', note: 'ڕێزگرتنی باڵا' }
      ],
      culturalNotes_ku: [
        'هەمیشە دەستەواژەی "فدوه" و "بلا زحمة" لە داواکارییەکاندا بەکاربێنە.'
      ],
      phonetics_ku: 'پیتی (ق) زۆرجار دەبێتە (گ) و پیتی (ك) لەگەڵ مێینە دەبێتە (چ).'
    };

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div class="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              دەفتەری ڕێنمایی (Unit Guidebook)
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
              ${guidebook.title}
            </h3>
          </div>
          <button 
            onclick="window.learningPath.closeGuidebook()" 
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>

        <!-- Summary -->
        <div class="bg-emerald-50 dark:bg-slate-800/80 p-4 rounded-2xl mb-5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          ${guidebook.summary_ku}
        </div>

        <!-- Key Vocabulary & Grammar Table -->
        <div class="mb-5">
          <h4 class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <i data-lucide="table" class="w-4 h-4 text-emerald-500"></i>
            <span>خشتەی دەستەواژە و یاساکان</span>
          </h4>
          <div class="space-y-2">
            ${guidebook.keyTable.map(item => `
              <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <button 
                    onclick="window.audioEngine.speakIraqi('${item.ar}')"
                    class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
                    title="گوێگرتن بە عێراقی">
                    <i data-lucide="volume-2" class="w-4 h-4"></i>
                  </button>
                  <div>
                    <div class="text-sm font-black text-slate-800 dark:text-slate-100" dir="rtl">${item.ar}</div>
                    <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400">${item.ku}</div>
                  </div>
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 text-left max-w-[140px] leading-tight">
                  ${item.note}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cultural Etiquette -->
        <div class="mb-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl">
          <h4 class="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span>💡</span>
            <span>نەریت و ئەتەکێتی عێراقی</span>
          </h4>
          <ul class="text-xs text-amber-900 dark:text-amber-200 space-y-1 font-medium list-disc list-inside">
            ${guidebook.culturalNotes_ku.map(note => `<li>${note}</li>`).join('')}
          </ul>
        </div>

        <!-- Phonetics Tip -->
        <div class="mb-6 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 p-3.5 rounded-2xl text-xs text-purple-900 dark:text-purple-200">
          <strong class="font-black text-purple-700 dark:text-purple-300">تێبینی دەنگسازی:</strong>
          <span class="mr-1">${guidebook.phonetics_ku}</span>
        </div>

        <!-- Close Button -->
        <button 
          onclick="window.learningPath.closeGuidebook()" 
          class="btn-duo-3d btn-green-3d w-full py-3.5 rounded-2xl font-black text-sm shadow-md">
          تێگەیشتم و دەگەڕێمەوە بۆ وانەکان
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  closeGuidebook() {
    window.audioEngine.playClickSound();
    const modal = document.getElementById('unit-guidebook-modal');
    if (modal) modal.classList.add('hidden');
  }

  claimMilestoneReward(unitId) {
    window.audioEngine.playLevelUpFanfare();
    this.state.addXP(50);
    this.state.gems += 20;
    this.state.saveState();
    this.state.updateTopBar();
    alert(`🎉 پیرۆزە! پاداشتی کۆتایی بەشی ${unitId.toUpperCase()}ت وەرگرت (+50 XP و +20 ئەڵماس 💎)!`);
  }
}

window.LearningPath = LearningPath;
