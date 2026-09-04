/**
 * Exercise Engine: Interactive Duolingo-style Exercise Runner with Dual-Speed Audio,
 * Pedagogical Scaffolding, Concept Briefings & Deep Explanations
 */

class ExerciseEngine {
  constructor(containerId, appState, onFinish) {
    this.container = document.getElementById(containerId);
    this.state = appState;
    this.onFinish = onFinish;

    this.currentLesson = null;
    this.exercises = [];
    this.currentIndex = 0;
    this.selectedSentenceTokens = [];
    this.selectedOptionIndex = null;
    this.selectedOptionWord = null;
    this.matchedPairs = new Set();
    this.selectedPairArabic = null;
    this.selectedPairKurdish = null;
    this.isAnswerChecked = false;
    this.isAnswerCorrect = false;
    this.speakingResult = null;
    this.isListening = false;
  }

  start(lesson) {
    this.currentLesson = lesson;
    this.exercises = this.enrichLessonExercises(lesson);
    this.currentIndex = 0;
    this.renderCurrentExercise();
  }

  enrichLessonExercises(lesson) {
    const exercises = [...(lesson.exercises || [])];
    if (exercises.length >= 6) return exercises;

    const unitId = lesson.id.split('_')[0];
    const guidebook = (window.UNIT_GUIDEBOOKS && window.UNIT_GUIDEBOOKS[unitId]) || 
                      (window.MEDICAL_GUIDEBOOKS && window.MEDICAL_GUIDEBOOKS[unitId]);
    const vocabList = window.VOCABULARY_DATABASE || [];

    const hasType = (t) => exercises.some(e => e.type === t);

    // 1. Ensure Listening comprehension drill exists
    if (!hasType('listening') && guidebook && guidebook.keyTable && guidebook.keyTable.length > 0) {
      const item = guidebook.keyTable[0];
      const cleanAr = item.ar.replace(/\s*\(.*?\)/g, '').split('➔')[0].trim();
      const otherItem = guidebook.keyTable[1] || { ku: 'کاتژمێر چەندە بۆ بازاڕ؟' };
      const otherItem2 = guidebook.keyTable[2] || { ku: 'دوێنێ چوومە ماڵەوە' };

      exercises.push({
        id: `${lesson.id}_gen_listen`,
        type: 'listening',
        instruction_ku: 'گوێ لە دەنگی عێراقی بگرە و ماناکەی بە کوردی سۆرانی هەڵبژێرە:',
        target_ar: cleanAr,
        options: [
          { text: item.ku.split('➔')[0].trim(), isCorrect: true, ku: 'مانای دروست' },
          { text: otherItem.ku.split('➔')[0].trim(), isCorrect: false, ku: 'هەڵەیە' },
          { text: otherItem2.ku.split('➔')[0].trim(), isCorrect: false, ku: 'هەڵەیە' }
        ],
        explanation_ku: `دەستەواژەی "${cleanAr}" لە عێراقدا واتە: ${item.ku}. ${item.note || ''}`
      });
    }

    // 2. Ensure Matching Pairs exists
    if (!hasType('matching_pairs') && guidebook && guidebook.keyTable && guidebook.keyTable.length >= 3) {
      const pairs = guidebook.keyTable.slice(0, 4).map(k => ({
        ar: k.ar.replace(/\s*\(.*?\)/g, '').split('➔')[0].trim(),
        ku: k.ku.split('➔')[0].trim()
      }));

      exercises.push({
        id: `${lesson.id}_gen_pairs`,
        type: 'matching_pairs',
        instruction_ku: 'دەستەواژە و وشە عێراقییەکان لەگەڵ هاوتا کوردییەکانیان ببەستەرەوە:',
        pairs: pairs,
        explanation_ku: 'ئافەرم! ئەم جووتە وشانە دەستەواژەی سەرەکی ئەم بەشەن.'
      });
    }

    // 3. Ensure Pattern Cloze Drill exists
    if (!hasType('pattern_drill') && guidebook && guidebook.keyTable && guidebook.keyTable.length > 1) {
      const targetItem = guidebook.keyTable[1];
      const cleanPhrase = targetItem.ar.replace(/\s*\(.*?\)/g, '').split('➔')[0].trim();
      const words = cleanPhrase.split(' ').filter(w => w.trim().length > 0);
      if (words.length >= 2) {
        const blankWord = words[words.length - 1];
        const sentenceWithBlank = words.slice(0, -1).join(' ') + ' ______';
        exercises.push({
          id: `${lesson.id}_gen_drill`,
          type: 'pattern_drill',
          instruction_ku: `بۆشاییەکە پڕبکەرەوە بۆ تەواوکردنی ڕستەکە: "${targetItem.ku}"`,
          sentence_with_blank: sentenceWithBlank,
          correct_word: blankWord,
          options: [blankWord, 'ماكو', 'زين', 'كلش'].sort(() => Math.random() - 0.5),
          explanation_ku: `شێوازی دروستی ڕستەکە بریتییە لە: "${cleanPhrase}". ${targetItem.note || ''}`
        });
      }
    }

    // 4. Ensure Speaking practice exists
    if (!hasType('speaking') && guidebook && guidebook.keyTable && guidebook.keyTable.length > 0) {
      const spkItem = guidebook.keyTable[guidebook.keyTable.length - 1];
      const cleanAr = spkItem.ar.replace(/\s*\(.*?\)/g, '').split('➔')[0].trim();
      exercises.push({
        id: `${lesson.id}_gen_spk`,
        type: 'speaking',
        instruction_ku: 'بە دەنگی بەرز بیخوێنەوە (کلیک لە مایکرۆفۆنەکە بکە):',
        target_ar: cleanAr,
        phonetic_ku: cleanAr,
        translation_ku: spkItem.ku.split('➔')[0].trim(),
        explanation_ku: `گۆکردنی عێراقی: "${cleanAr}" = ${spkItem.ku}.`
      });
    }

    // 5. If still fewer than 6, add sentence builder or pragmatic multiple choice
    let fallbackCounter = 0;
    while (exercises.length < 6 && guidebook && guidebook.keyTable && guidebook.keyTable.length > 0) {
      const item = guidebook.keyTable[fallbackCounter % guidebook.keyTable.length];
      fallbackCounter++;
      const cleanAr = item.ar.replace(/\s*\(.*?\)/g, '').split('➔')[0].trim();
      const words = cleanAr.split(' ').filter(w => w.trim().length > 0);

      if (words.length >= 2 && !exercises.some(e => e.target_ar === cleanAr && e.type === 'sentence_builder')) {
        exercises.push({
          id: `${lesson.id}_gen_sb_${exercises.length}`,
          type: 'sentence_builder',
          instruction_ku: `ڕستەکە ڕێکبخە بۆ دەربڕینی: "${item.ku}"`,
          target_ar: cleanAr,
          phonetic_ku: cleanAr,
          tokens: [...words, 'هلو', 'هسه', 'زين'].sort(() => Math.random() - 0.5),
          correct: words,
          explanation_ku: `ڕستەی ڕاست: "${cleanAr}" (${item.ku}).`
        });
      } else {
        const other1 = guidebook.keyTable[(fallbackCounter + 1) % guidebook.keyTable.length];
        const other2 = guidebook.keyTable[(fallbackCounter + 2) % guidebook.keyTable.length];
        exercises.push({
          id: `${lesson.id}_gen_mc_${exercises.length}`,
          type: 'multiple_choice',
          instruction_ku: `لە زمانی عێراقیدا، مانای ئەم دەستەواژەیە چییە؟`,
          target_ar: cleanAr,
          options: [
            { text: item.ku.split('➔')[0].trim(), isCorrect: true, ku: 'مانای دروست' },
            { text: other1 ? other1.ku.split('➔')[0].trim() : 'سبەی کاتژمێر نۆ دێم', isCorrect: false, ku: 'هەڵەیە' },
            { text: other2 ? other2.ku.split('➔')[0].trim() : 'لە بازاڕ خەریکی کڕینم', isCorrect: false, ku: 'هەڵەیە' }
          ],
          explanation_ku: `واتای دروست: "${cleanAr}" = ${item.ku}.`
        });
      }
    }

    return exercises;
  }

  renderCurrentExercise() {
    if (!this.container) return;

    if (this.currentIndex >= this.exercises.length) {
      this.renderCompletionScreen();
      return;
    }

    const ex = this.exercises[this.currentIndex];
    this.isAnswerChecked = false;
    this.isAnswerCorrect = false;
    this.selectedSentenceTokens = [];
    this.selectedOptionIndex = null;
    this.selectedOptionWord = null;
    this.selectedPairArabic = null;
    this.selectedPairKurdish = null;
    this.matchedPairs = new Set();
    this.speakingResult = null;

    const progressPercent = Math.round((this.currentIndex / this.exercises.length) * 100);

    // Pedagogical Briefing Card (at start of every lesson)
    let conceptBriefingHtml = '';
    if (this.currentIndex === 0) {
      if (this.currentLesson && this.currentLesson.concept_card) {
        const c = this.currentLesson.concept_card;
        conceptBriefingHtml = `
          <div class="mb-5 bg-gradient-to-l from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/30 border-2 border-emerald-400 dark:border-emerald-700 p-4 sm:p-5 rounded-3xl animate-fade-in">
            <div class="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider">
              <span class="text-base">💡</span>
              <span>ڕێنمایی و بنەمای وانە: ${c.title_ku}</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-3">
              ${c.explanation_ku}
            </p>
            ${c.formula ? `
              <div class="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <span>یاسای ڕێزمانی:</span>
                <span dir="ltr">${c.formula}</span>
              </div>
            ` : ''}
          </div>
        `;
      } else if (this.currentLesson) {
        const unitId = this.currentLesson.id.split('_')[0];
        const g = window.UNIT_GUIDEBOOKS && window.UNIT_GUIDEBOOKS[unitId];
        if (g) {
          conceptBriefingHtml = `
            <div class="mb-5 bg-gradient-to-l from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/30 border-2 border-emerald-400 dark:border-emerald-700 p-4 sm:p-5 rounded-3xl animate-fade-in">
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider">
                  <span class="text-base">💡</span>
                  <span>ڕێنمایی سەرەتایی: ${g.subtitle || g.title}</span>
                </div>
                <button onclick="window.learningPath.openGuidebook('${unitId}')" class="text-[11px] text-emerald-600 font-bold hover:underline">
                  کتێبی ڕێنمایی 📖
                </button>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-3">
                ${g.summary_ku}
              </p>
              ${g.keyTable && g.keyTable.length > 0 ? `
                <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <button onclick="window.audioEngine.speakIraqi('${g.keyTable[0].ar}')" class="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
                      <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    </button>
                    <span class="text-xs font-black text-slate-800 dark:text-slate-100" dir="rtl">${g.keyTable[0].ar}</span>
                  </div>
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">${g.keyTable[0].ku}</span>
                </div>
              ` : ''}
            </div>
          `;
        }
      }
    } else if (ex.concept_tip) {
      conceptBriefingHtml = `
        <div class="mb-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5">
          <span class="text-lg flex-shrink-0">🎯</span>
          <span class="font-medium">${ex.concept_tip}</span>
        </div>
      `;
    }

    let exerciseBodyHtml = '';

    switch (ex.type) {
      case 'sentence_builder':
        exerciseBodyHtml = this.renderSentenceBuilder(ex);
        break;
      case 'speaking':
        exerciseBodyHtml = this.renderSpeaking(ex);
        break;
      case 'pattern_drill':
        exerciseBodyHtml = this.renderPatternDrill(ex);
        break;
      case 'multiple_choice':
        exerciseBodyHtml = this.renderMultipleChoice(ex);
        break;
      case 'matching_pairs':
        exerciseBodyHtml = this.renderMatchingPairs(ex);
        break;
      case 'listening':
        exerciseBodyHtml = this.renderListening(ex);
        break;
      default:
        exerciseBodyHtml = `<p>جۆری پرسیار نەزانراوە.</p>`;
    }

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-4 min-h-[92vh] flex flex-col justify-between">
        <!-- Top Bar: Exit button, Progress bar, Hearts count -->
        <div>
          <div class="flex items-center justify-between gap-4 mb-6">
            <button onclick="window.app.exitLesson()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl transition-colors" title="دەرچوون">
              <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <div class="flex-1 bg-slate-200 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
            </div>
            <div class="flex items-center gap-1.5 text-rose-500 font-black text-base">
              <i data-lucide="heart" class="w-5 h-5 fill-rose-500 text-rose-500"></i>
              <span>${this.state.hearts}</span>
            </div>
          </div>

          <!-- Concept Briefing Card (if available) -->
          ${conceptBriefingHtml}

          <!-- Exercise Content Card -->
          <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div class="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <span>${this.getExerciseTypeLabel(ex.type)}</span>
              <span class="text-slate-400 text-[10px]">(${this.currentIndex + 1} / ${this.exercises.length})</span>
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
              ${ex.instruction_ku}
            </h2>

            <!-- Exercise Body -->
            ${exerciseBodyHtml}
          </div>
        </div>

        <!-- Sticky Bottom Bar for Check/Continue -->
        <div id="exercise-bottom-bar" class="mt-6">
          ${this.renderBottomBarInitial()}
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  getExerciseTypeLabel(type) {
    switch (type) {
      case 'sentence_builder': return '🧩 ڕستەسازی (دروستکردنی ڕستە)';
      case 'speaking': return '🎤 تەحەدای دەنگ و قسەکردن';
      case 'pattern_drill': return '⚡ قاڵبی ڕێزمانی عێراقی';
      case 'multiple_choice': return '🎯 تێگەیشتن و هەڵبژاردن';
      case 'matching_pairs': return '🔄 بەستنەوەی هاوتاکان';
      case 'listening': return '🎧 گوێگرتن و تێگەیشتن لە دەنگ';
      default: return 'ڕاهێنان';
    }
  }

  // --- Sentence Builder with Dual Speed Audio ---
  renderSentenceBuilder(ex) {
    return `
      <div>
        <!-- Dual Speed Audio buttons for pronunciation guidance -->
        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl mb-5 border border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <!-- Normal Speed Button -->
            <button 
              onclick="window.audioEngine.speakIraqi('${ex.target_ar}')"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 shadow-sm transition-transform active:scale-95"
              title="گوێگرتن بە خێرایی ئاسایی">
              <i data-lucide="volume-2" class="w-4 h-4"></i>
              <span>🐰 ئاسایی</span>
            </button>

            <!-- Slow Speed Button -->
            <button 
              onclick="window.audioEngine.speakIraqiSlow('${ex.target_ar}')"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-transform active:scale-95"
              title="گوێگرتن بە خێرایی خاو بۆ فێربوون">
              <span>🐢 خاو</span>
            </button>
          </div>

          <div class="text-left">
            <div class="text-[11px] font-bold text-slate-400">بێژەکردن بە کوردی:</div>
            <div class="text-xs font-black text-emerald-700 dark:text-emerald-400">${ex.phonetic_ku}</div>
          </div>
        </div>

        <!-- Target Construction Zone -->
        <div id="sentence-target-zone" class="sentence-zone min-h-[75px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5 flex flex-wrap items-center gap-2 mb-6 border-2 border-dashed border-slate-200 dark:border-slate-700">
          <span id="placeholder-text" class="text-slate-400 text-sm italic mr-2">وشەکان لە خوارەوە بە ڕێکوپێکی هەڵبژێرە...</span>
        </div>

        <!-- Word Tokens Pool -->
        <div id="sentence-tokens-pool" class="flex flex-wrap items-center justify-center gap-2 p-2">
          ${ex.tokens.map((token, idx) => `
            <button 
              id="token-${idx}"
              onclick="window.exerciseEngine.handleTokenClick('${token}', ${idx})" 
              class="word-tile bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 border-b-4 border-b-slate-300 dark:border-b-slate-900 px-4 py-2.5 rounded-2xl font-black text-sm text-slate-800 dark:text-slate-100 shadow-sm hover:border-emerald-400 active:scale-95 transition-all">
              ${token}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Listening Comprehension Exercise ---
  renderListening(ex) {
    return `
      <div class="text-center py-2">
        <div class="flex flex-col items-center justify-center gap-3 mb-6">
          <button 
            onclick="window.audioEngine.speakIraqi('${ex.target_ar}')"
            class="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-transform"
            title="کلیک بکە بۆ گوێگرتن لە دەنگ">
            <i data-lucide="volume-2" class="w-10 h-10"></i>
          </button>
          <span class="text-xs font-bold text-slate-400">کلیک بکە بۆ گوێگرتن لە دەنگی عەرەبی عێراقی</span>

          <button 
            onclick="window.audioEngine.speakIraqiSlow('${ex.target_ar}')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors">
            <span>🐢 گوێگرتنی خاو</span>
          </button>
        </div>

        <div class="space-y-3 max-w-md mx-auto">
          ${ex.options.map((opt, idx) => `
            <button 
              id="mc-opt-${idx}"
              onclick="window.exerciseEngine.handleMultipleChoiceSelect(${idx})" 
              class="w-full text-right p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 border-b-4 border-b-slate-300 dark:border-b-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100 hover:border-emerald-400 transition-all flex items-center justify-between">
              <span>${opt.text}</span>
              <span class="text-xs text-slate-400">(${opt.ku})</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Speaking Exercise ---
  renderSpeaking(ex) {
    return `
      <div class="text-center py-2">
        <!-- Target Iraqi Phrase with Audio buttons -->
        <div class="bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 p-6 rounded-3xl mb-6">
          <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2" dir="rtl">
            "${ex.target_ar}"
          </div>
          <div class="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            خوێندنەوەی بە کوردی: <span class="font-black">${ex.phonetic_ku}</span>
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
            واتا: ${ex.translation_ku}
          </div>

          <div class="flex items-center justify-center gap-2 mt-4">
            <button 
              onclick="window.audioEngine.speakIraqi('${ex.target_ar}')"
              class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 shadow-sm transition-transform active:scale-95">
              <i data-lucide="volume-2" class="w-4 h-4"></i>
              <span>🐰 نموونەی دەنگ</span>
            </button>
            <button 
              onclick="window.audioEngine.speakIraqiSlow('${ex.target_ar}')"
              class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs hover:bg-slate-300">
              <span>🐢 خاو</span>
            </button>
          </div>
        </div>

        <!-- Microphone Trigger Button -->
        <div class="flex flex-col items-center justify-center gap-3">
          <button 
            id="mic-btn"
            onclick="window.exerciseEngine.handleSpeakingRecord('${ex.target_ar}')" 
            class="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-transform"
            title="کلیک بکە و بە دەنگ بیخوێنەوە">
            <i data-lucide="mic" class="w-8 h-8"></i>
          </button>
          
          <div id="speaking-status" class="text-xs font-bold text-slate-500">
            کلیک لە مایکرۆفۆنەکە بکە و بە دەنگ بیخوێنەوە
          </div>
        </div>
      </div>
    `;
  }

  // --- Pattern Drill (Cloze / Fill in the blank) ---
  renderPatternDrill(ex) {
    const sentenceParts = ex.sentence_with_blank.split('______');

    return `
      <div>
        <div class="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl text-center mb-6 border border-slate-200 dark:border-slate-700">
          <div class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2 flex-wrap" dir="rtl">
            <span>${sentenceParts[0]}</span>
            <span id="drill-blank" class="inline-block min-w-[90px] border-b-4 border-emerald-500 text-emerald-600 font-black px-2 pb-0.5">
              (؟)
            </span>
            <span>${sentenceParts[1] || ''}</span>
          </div>
        </div>

        <div class="text-xs font-bold text-slate-400 mb-3 text-center">وشەی گونجاو هەڵبژێرە:</div>

        <div class="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          ${ex.options.map((opt, idx) => `
            <button 
              id="drill-opt-${idx}"
              onclick="window.exerciseEngine.handleDrillOptionSelect('${opt}', ${idx})" 
              class="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 border-b-4 border-b-slate-300 dark:border-b-slate-800 font-black text-sm text-slate-800 dark:text-slate-100 hover:border-emerald-400 active:scale-95 transition-all text-center">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Multiple Choice ---
  renderMultipleChoice(ex) {
    return `
      <div>
        <div class="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl mb-6 text-center border border-slate-200 dark:border-slate-700">
          <div class="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <span>${ex.target_ar}</span>
            <button onclick="window.audioEngine.speakIraqi('${ex.target_ar}')" class="text-emerald-500 hover:scale-110">
              <i data-lucide="volume-2" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <div class="space-y-3 max-w-md mx-auto">
          ${ex.options.map((opt, idx) => `
            <button 
              id="mc-opt-${idx}"
              onclick="window.exerciseEngine.handleMultipleChoiceSelect(${idx})" 
              class="w-full text-right p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 border-b-4 border-b-slate-300 dark:border-b-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100 hover:border-emerald-400 transition-all flex items-center justify-between">
              <span>${opt.text}</span>
              ${opt.ku ? `<span class="text-xs text-slate-400">(${opt.ku})</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Matching Pairs ---
  renderMatchingPairs(ex) {
    const arabicWords = ex.pairs.map(p => p.ar);
    const kurdishWords = [...ex.pairs.map(p => p.ku)].sort(() => Math.random() - 0.5);

    return `
      <div>
        <div class="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
          <!-- Arabic column -->
          <div class="space-y-2.5">
            ${arabicWords.map((ar, idx) => `
              <button 
                id="pair-ar-${idx}"
                onclick="window.exerciseEngine.handleArabicPairClick('${ar}', ${idx})" 
                class="w-full p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 border-b-4 border-b-slate-300 dark:border-b-slate-800 font-black text-sm text-slate-800 dark:text-slate-100 hover:border-emerald-400 transition-all text-right flex items-center justify-between">
                <span>${ar}</span>
                <span class="text-slate-300 dark:text-slate-600 text-xs">🇮🇶</span>
              </button>
            `).join('')}
          </div>

          <!-- Kurdish column -->
          <div class="space-y-2.5">
            ${kurdishWords.map((ku, idx) => `
              <button 
                id="pair-ku-${idx}"
                onclick="window.exerciseEngine.handleKurdishPairClick('${ku}', ${idx})" 
                class="w-full p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 border-b-4 border-b-slate-300 dark:border-b-slate-800 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 hover:border-emerald-400 transition-all text-right flex items-center justify-between">
                <span>${ku}</span>
                <span class="text-slate-300 dark:text-slate-600 text-xs">☀️</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- Interactions ---
  handleTokenClick(token, idx) {
    window.audioEngine.playClickSound();
    const tokenBtn = document.getElementById(`token-${idx}`);
    if (!tokenBtn) return;

    if (tokenBtn.classList.contains('opacity-20')) return;

    tokenBtn.classList.add('opacity-20', 'pointer-events-none');
    this.selectedSentenceTokens.push({ token, originIdx: idx });
    this.updateSentenceTargetZone();
  }

  handleRemoveToken(arrayIdx) {
    window.audioEngine.playClickSound();
    const removed = this.selectedSentenceTokens.splice(arrayIdx, 1)[0];
    if (removed) {
      const originBtn = document.getElementById(`token-${removed.originIdx}`);
      if (originBtn) {
        originBtn.classList.remove('opacity-20', 'pointer-events-none');
      }
    }
    this.updateSentenceTargetZone();
  }

  updateSentenceTargetZone() {
    const zone = document.getElementById('sentence-target-zone');
    if (!zone) return;

    if (this.selectedSentenceTokens.length === 0) {
      zone.innerHTML = `<span id="placeholder-text" class="text-slate-400 text-sm italic mr-2">وشەکان لە خوارەوە بە ڕێکوپێکی هەڵبژێرە...</span>`;
      return;
    }

    zone.innerHTML = this.selectedSentenceTokens.map((item, idx) => `
      <button 
        onclick="window.exerciseEngine.handleRemoveToken(${idx})"
        class="bg-emerald-500 text-white font-black text-sm px-3.5 py-2 rounded-xl shadow-sm border-b-2 border-emerald-700 hover:bg-emerald-600 animate-fade-in flex items-center gap-1.5">
        <span>${item.token}</span>
        <span class="text-[10px] opacity-75">✕</span>
      </button>
    `).join('');
  }

  handleDrillOptionSelect(word, idx) {
    window.audioEngine.playClickSound();
    this.selectedOptionWord = word;
    this.selectedOptionIndex = idx;

    const blank = document.getElementById('drill-blank');
    if (blank) {
      blank.textContent = word;
      blank.classList.add('bg-emerald-50', 'dark:bg-emerald-950/40', 'px-3');
    }

    const ex = this.exercises[this.currentIndex];
    ex.options.forEach((_, i) => {
      const btn = document.getElementById(`drill-opt-${i}`);
      if (btn) {
        if (i === idx) {
          btn.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40');
        } else {
          btn.classList.remove('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40');
        }
      }
    });
  }

  handleMultipleChoiceSelect(idx) {
    window.audioEngine.playClickSound();
    this.selectedOptionIndex = idx;

    const ex = this.exercises[this.currentIndex];
    ex.options.forEach((_, i) => {
      const btn = document.getElementById(`mc-opt-${i}`);
      if (btn) {
        if (i === idx) {
          btn.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40', 'ring-2', 'ring-emerald-400');
        } else {
          btn.classList.remove('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40', 'ring-2', 'ring-emerald-400');
        }
      }
    });
  }

  handleArabicPairClick(ar, idx) {
    window.audioEngine.playClickSound();
    window.audioEngine.speakIraqi(ar);
    this.selectedPairArabic = { ar, idx };
    this.checkPairMatch();
  }

  handleKurdishPairClick(ku, idx) {
    window.audioEngine.playClickSound();
    this.selectedPairKurdish = { ku, idx };
    this.checkPairMatch();
  }

  checkPairMatch() {
    if (!this.selectedPairArabic || !this.selectedPairKurdish) return;

    const ex = this.exercises[this.currentIndex];
    const match = ex.pairs.find(p => p.ar === this.selectedPairArabic.ar && p.ku === this.selectedPairKurdish.ku);

    const arBtn = document.getElementById(`pair-ar-${this.selectedPairArabic.idx}`);
    const kuBtn = document.getElementById(`pair-ku-${this.selectedPairKurdish.idx}`);

    if (match) {
      window.audioEngine.playCorrectSound();
      if (arBtn) {
        arBtn.classList.add('bg-emerald-100', 'dark:bg-emerald-900/60', 'border-emerald-500', 'pointer-events-none', 'opacity-60');
      }
      if (kuBtn) {
        kuBtn.classList.add('bg-emerald-100', 'dark:bg-emerald-900/60', 'border-emerald-500', 'pointer-events-none', 'opacity-60');
      }
      this.matchedPairs.add(match.ar);

      if (this.matchedPairs.size === ex.pairs.length) {
        this.checkAnswer();
      }
    } else {
      window.audioEngine.playWrongSound();
      if (arBtn) arBtn.classList.add('shake', 'border-rose-500');
      if (kuBtn) kuBtn.classList.add('shake', 'border-rose-500');
      setTimeout(() => {
        if (arBtn) arBtn.classList.remove('shake', 'border-rose-500');
        if (kuBtn) kuBtn.classList.remove('shake', 'border-rose-500');
      }, 500);
    }

    this.selectedPairArabic = null;
    this.selectedPairKurdish = null;
  }

  handleSpeakingRecord(targetPhrase) {
    const statusEl = document.getElementById('speaking-status');
    const micBtn = document.getElementById('mic-btn');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (statusEl) {
        statusEl.innerHTML = `<span class="text-rose-500 font-bold">وێبگەڕەکەت پشتگیری دەنگ ناکات، کلیک لە وەڵامی دروست بکە.</span>`;
      }
      this.speakingResult = { score: 95, heard: targetPhrase };
      this.checkAnswer();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-IQ';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (micBtn) {
      micBtn.classList.add('animate-ping', 'bg-emerald-500');
    }
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-emerald-600 font-black animate-pulse">گوێ دەگرم... بە عەرەبی قسە بکە!</span>`;
    }

    recognition.onresult = (event) => {
      const heard = event.results[0][0].transcript;
      const score = Math.min(100, Math.round(event.results[0][0].confidence * 100) + 15);

      this.speakingResult = { score, heard };
      if (statusEl) {
        statusEl.innerHTML = `<span class="text-emerald-600 font-bold">بیستم: "${heard}" (${score}%)</span>`;
      }
      if (micBtn) {
        micBtn.classList.remove('animate-ping', 'bg-emerald-500');
      }
      this.checkAnswer();
    };

    recognition.onerror = () => {
      if (statusEl) {
        statusEl.innerHTML = `<span class="text-amber-500 font-bold">دەنگ نەبیسترا. خۆکارانە نمرەت پێدەدرێت بە لێبوردەیی.</span>`;
      }
      if (micBtn) {
        micBtn.classList.remove('animate-ping', 'bg-emerald-500');
      }
      this.speakingResult = { score: 90, heard: targetPhrase };
      this.checkAnswer();
    };

    recognition.start();
  }

  // --- Bottom Action Bars ---
  renderBottomBarInitial() {
    return `
      <div class="flex items-center justify-between">
        <button 
          onclick="window.exerciseEngine.skipExercise()" 
          class="px-5 py-3 rounded-2xl font-bold text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          تێپەڕاندن
        </button>

        <button 
          onclick="window.exerciseEngine.checkAnswer()" 
          class="btn-duo-3d btn-green-3d px-8 py-3.5 rounded-2xl font-black text-sm shadow-md">
          پشکنین و دڵنیابوونەوە
        </button>
      </div>
    `;
  }

  checkAnswer() {
    if (this.isAnswerChecked) {
      this.nextExercise();
      return;
    }

    const ex = this.exercises[this.currentIndex];
    let isCorrect = false;

    switch (ex.type) {
      case 'sentence_builder':
        const userJoined = this.selectedSentenceTokens.map(t => t.token).join(' ');
        const correctJoined = ex.correct.join(' ');
        isCorrect = (userJoined.trim() === correctJoined.trim());
        break;

      case 'speaking':
        isCorrect = true; // Encouraging speech practice
        break;

      case 'pattern_drill':
        isCorrect = (this.selectedOptionWord === ex.correct_word);
        break;

      case 'multiple_choice':
      case 'listening':
        if (this.selectedOptionIndex !== null && ex.options[this.selectedOptionIndex]) {
          isCorrect = !!ex.options[this.selectedOptionIndex].isCorrect;
        }
        break;

      case 'matching_pairs':
        isCorrect = (this.matchedPairs.size === ex.pairs.length);
        break;
    }

    this.isAnswerChecked = true;
    this.isAnswerCorrect = isCorrect;

    const bottomBar = document.getElementById('exercise-bottom-bar');
    if (!bottomBar) return;

    if (isCorrect) {
      window.audioEngine.playCorrectSound();
      bottomBar.innerHTML = `
        <div class="bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-400 rounded-3xl p-5 shadow-lg animate-fade-in">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black text-base">
              <span class="text-xl">🎉</span>
              <span>ئافەرم! وەڵامەکەت تەواو و دروستە!</span>
            </div>
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl shadow-sm border border-emerald-200">
              +10 XP
            </span>
          </div>

          <!-- Deep Pedagogical Explanation -->
          <div class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-4 bg-white/70 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900">
            <strong class="text-emerald-800 dark:text-emerald-300 block mb-1">💡 شیکاری زمانەوانی:</strong>
            ${ex.explanation_ku || 'دەستخۆش! بەم شێوازە لە زمانی عێراقیدا ڕستەکان بە دروستی پێکدەهێنرێن.'}
          </div>

          <button 
            id="btn-next-exercise-continue"
            onclick="window.exerciseEngine.nextExercise()" 
            class="btn-duo-3d btn-green-3d w-full py-3.5 rounded-2xl font-black text-sm shadow-md">
            ${this.currentIndex === this.exercises.length - 1 ? 'تەواوکردنی وانە ➔' : 'بەردەوام بە ➔'}
          </button>
        </div>
      `;
    } else {
      try {
        window.audioEngine.playWrongSound();
      } catch (e) {
        try { window.audioEngine.playErrorSound(); } catch (err) {}
      }
      this.state.loseHeart();

      let solutionText = '';
      if (ex.correct) solutionText = ex.correct.join(' ');
      else if (ex.correct_word) solutionText = ex.correct_word;
      else if (ex.options) {
        const cOpt = ex.options.find(o => o.isCorrect);
        if (cOpt) solutionText = cOpt.text;
      }

      bottomBar.innerHTML = `
        <div class="bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-400 rounded-3xl p-5 shadow-lg animate-fade-in">
          <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-base mb-2">
            <span class="text-xl">❌</span>
            <span>وەڵامەکەت هەڵەیە! دڵێکت لەدەستدا (-١ ❤️)</span>
          </div>

          ${solutionText ? `
            <div class="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
              وەڵامی ڕاست: <span class="font-black text-emerald-700 dark:text-emerald-400">${solutionText}</span>
            </div>
          ` : ''}

          <!-- Pedagogical Note -->
          <div class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl">
            ${ex.explanation_ku || 'تێبینی: هەمیشە ئاگاداری گۆڕانی پیت و قاڵبە عێراقییەکان بە.'}
          </div>

          <button 
            id="btn-next-exercise-wrong"
            onclick="window.exerciseEngine.nextExercise()" 
            class="btn-duo-3d bg-rose-500 text-white border-b-4 border-rose-700 w-full py-3.5 rounded-2xl font-black text-sm shadow-md">
            ${this.currentIndex === this.exercises.length - 1 ? 'تێگەیشتم و تەواوکردنی وانە ➔' : 'تێگەیشتم و بەردەوام بە ➔'}
          </button>
        </div>
      `;
    }
  }

  skipExercise() {
    window.audioEngine.playClickSound();
    this.nextExercise();
  }

  nextExercise() {
    this.currentIndex++;
    this.renderCurrentExercise();
  }

  renderCompletionScreen() {
    try {
      window.audioEngine.playLessonComplete();
    } catch (e) {
      console.warn('playLessonComplete error', e);
    }

    const earnedXP = this.currentLesson ? (this.currentLesson.xp || 25) : 25;
    try {
      if (this.currentLesson && this.currentLesson.id) {
        this.state.completeLesson(this.currentLesson.id, earnedXP);
      }
    } catch (e) {
      console.warn('completeLesson error', e);
    }

    const isMedical = (this.currentLesson && this.currentLesson.id && this.currentLesson.id.startsWith('m')) ||
                      (window.app && window.app.currentViewSource === 'medical');
    const returnText = isMedical ? 'گەڕانەوە بۆ کۆرسی پزیشکی 🩺' : 'گەڕانەوە بۆ نەخشەی فێربوون';

    this.container.innerHTML = `
      <div class="max-w-md mx-auto px-4 py-8 min-h-[85vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div class="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/20 mb-6 mascot-bobbing">
          🏆
        </div>

        <h1 class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">
          وانەکەت بە سەرکەوتوویی تەواو کرد!
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
          هەنگاوێکی تر بەرەو قسەکردنی پاراو بە زمانی عێراقی نزیك بوویتەوە.
        </p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3 w-full mb-8">
          <div class="bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl">
            <div class="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">کۆی خاڵەکان</div>
            <div class="text-2xl font-black text-amber-600 dark:text-amber-400">+${earnedXP} XP ⚡</div>
          </div>

          <div class="bg-rose-50 dark:bg-slate-800/80 border border-rose-200 dark:border-rose-800/40 p-4 rounded-2xl">
            <div class="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">ئاستی بەردەوامی</div>
            <div class="text-2xl font-black text-rose-600 dark:text-rose-400">${this.state.streak || 1} ڕۆژ 🔥</div>
          </div>
        </div>

        <button 
          id="btn-lesson-finish-action"
          onclick="window.exerciseEngine.finishLesson()" 
          class="btn-duo-3d btn-green-3d w-full py-4 rounded-2xl font-black text-base shadow-lg shadow-emerald-500/30">
          ${returnText}
        </button>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  finishLesson() {
    try { window.audioEngine.playClickSound(); } catch (e) {}
    if (this.onFinish) {
      this.onFinish();
    } else if (window.app && typeof window.app.finishLesson === 'function') {
      window.app.finishLesson();
    }
  }
}

window.ExerciseEngine = ExerciseEngine;
