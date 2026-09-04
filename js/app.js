/**
 * Main Application Orchestrator: State, Router, Practice Mode & Gamification
 */

class AppState {
  constructor() {
    this.storageKey = 'iraqi_sorani_duo_state_v1';
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.xp = parsed.xp || 0;
        this.streak = parsed.streak || 1;
        this.hearts = (parsed.hearts !== undefined) ? parsed.hearts : 5;
        this.gems = parsed.gems || 150;
        this.currentLevel = (parsed.currentLevel && ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(parsed.currentLevel)) ? parsed.currentLevel : 'a1';
        this.completedLessons = parsed.completedLessons || ['u1_l1'];
        this.unlockedLevels = parsed.unlockedLevels || ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
        this.theme = parsed.theme || 'light';
        return;
      } catch (e) {
        console.warn('Failed to parse saved state', e);
      }
    }

    // Default Initial State
    this.xp = 45;
    this.streak = 3;
    this.hearts = 5;
    this.gems = 150;
    this.currentLevel = 'a1';
    this.completedLessons = ['u1_l1'];
    this.unlockedLevels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
    this.theme = 'light';
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        xp: this.xp,
        streak: this.streak,
        hearts: this.hearts,
        gems: this.gems,
        currentLevel: this.currentLevel,
        completedLessons: this.completedLessons,
        unlockedLevels: this.unlockedLevels,
        theme: this.theme
      }));
    } catch (e) {
      console.warn('Failed to save state', e);
    }
  }

  addXP(amount) {
    this.xp += amount;
    this.saveState();
    this.updateTopBar();
  }

  deductHeart() {
    if (this.hearts > 0) {
      this.hearts--;
      this.saveState();
      this.updateTopBar();
    }
  }

  loseHeart() {
    this.deductHeart();
  }

  refillHearts() {
    this.hearts = 5;
    this.saveState();
    this.updateTopBar();
    window.audioEngine.playCorrectSound();
  }

  addHeart() {
    if (this.hearts < 5) {
      this.hearts++;
      this.saveState();
      this.updateTopBar();
      window.audioEngine.playCorrectSound();
    }
  }

  completeLesson(lessonId, earnedXP) {
    if (!this.completedLessons.includes(lessonId)) {
      this.completedLessons.push(lessonId);
    }
    this.addXP(earnedXP);
    this.saveState();
  }

  isLessonCompleted(lessonId) {
    return this.completedLessons.includes(lessonId);
  }

  isLessonUnlocked(lessonId, unitIdx, lessonIdx) {
    if (unitIdx === 0 && lessonIdx === 0) return true;
    return true; // Flexible exploration across curriculum
  }

  isLevelUnlocked(levelId) {
    return this.unlockedLevels.includes(levelId);
  }

  updateTopBar() {
    const xpEl = document.getElementById('top-xp-val');
    const streakEl = document.getElementById('top-streak-val');
    const heartsEl = document.getElementById('top-hearts-val');
    const gemsEl = document.getElementById('top-gems-val');
    const levelBadgeEl = document.getElementById('top-level-badge');

    if (xpEl) xpEl.textContent = this.xp;
    if (streakEl) streakEl.textContent = this.streak;
    if (heartsEl) heartsEl.textContent = this.hearts;
    if (gemsEl) gemsEl.textContent = this.gems;
    if (levelBadgeEl) levelBadgeEl.textContent = (this.currentLevel || 'a1').toUpperCase();
  }
}

class App {
  constructor() {
    this.state = new AppState();
    this.currentView = 'path';
    
    // Components
    this.learningPath = null;
    this.exerciseEngine = null;
    this.srsVocab = null;
    this.dialoguePlayer = null;
    this.grammarGuide = null;
    this.leaderboardQuests = null;

    this.init();
  }

  init() {
    // Apply theme
    if (this.state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Instantiate components
    this.learningPath = new window.LearningPath('view-path', this.state, this.startLesson.bind(this));
    this.medicalCourse = new window.MedicalCourse('view-medical', this.state, this.startLesson.bind(this));
    this.exerciseEngine = new window.ExerciseEngine('view-exercise', this.state, this.finishLesson.bind(this));
    this.srsVocab = new window.SrsVocab('view-vocab', this.state);
    this.dialoguePlayer = new window.DialoguePlayer('view-dialogues', this.state);
    this.grammarGuide = new window.GrammarGuide('view-grammar');
    this.leaderboardQuests = new window.LeaderboardQuests('view-leaderboard', this.state);

    // Global exports for inline HTML event handlers
    window.app = this;
    window.learningPath = this.learningPath;
    window.medicalCourse = this.medicalCourse;
    window.exerciseEngine = this.exerciseEngine;
    window.srsVocab = this.srsVocab;
    window.dialoguePlayer = this.dialoguePlayer;
    window.grammarGuide = this.grammarGuide;
    window.leaderboardQuests = this.leaderboardQuests;

    this.state.updateTopBar();
    this.switchView('path');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    window.audioEngine.playClickSound();

    const views = ['path', 'medical', 'exercise', 'vocab', 'dialogues', 'grammar', 'leaderboard'];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.classList.add('hidden');
    });

    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) targetEl.classList.remove('hidden');

    const topBar = document.getElementById('app-top-bar');
    const bottomNav = document.getElementById('app-bottom-nav');
    const sideNav = document.getElementById('app-side-nav');

    if (viewName === 'exercise') {
      if (topBar) topBar.classList.add('hidden');
      if (bottomNav) bottomNav.classList.add('hidden');
      if (sideNav) sideNav.classList.add('hidden');
    } else {
      if (topBar) topBar.classList.remove('hidden');
      if (bottomNav) bottomNav.classList.remove('hidden');
      if (sideNav) sideNav.classList.remove('hidden');
    }

    document.querySelectorAll('[data-nav-view]').forEach(btn => {
      const btnView = btn.getAttribute('data-nav-view');
      if (btnView === viewName) {
        btn.classList.add('text-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40', 'font-black');
        btn.classList.remove('text-slate-500', 'dark:text-slate-400');
      } else {
        btn.classList.remove('text-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40', 'font-black');
        btn.classList.add('text-slate-500', 'dark:text-slate-400');
      }
    });

    switch (viewName) {
      case 'path':
        this.learningPath.render(this.state.currentLevel);
        break;
      case 'medical':
        this.medicalCourse.render();
        break;
      case 'vocab':
        this.srsVocab.render();
        break;
      case 'dialogues':
        this.dialoguePlayer.render();
        break;
      case 'grammar':
        this.grammarGuide.render();
        break;
      case 'leaderboard':
        this.leaderboardQuests.render();
        break;
    }

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  switchLevel(levelId) {
    this.state.currentLevel = levelId;
    this.state.saveState();
    this.state.updateTopBar();
    if (this.currentView !== 'path') {
      this.switchView('path');
    } else {
      this.learningPath.render(levelId);
    }
  }

  startLesson(lessonOrId, unitId, levelId) {
    window.audioEngine.playClickSound();

    if (this.state.hearts <= 0) {
      this.showHeartsDepletedModal();
      return;
    }

    let targetLesson = null;
    if (typeof lessonOrId === 'object' && lessonOrId !== null) {
      targetLesson = lessonOrId;
    } else {
      const allCurriculum = [
        ...window.CURRICULUM_A1_A2,
        ...window.CURRICULUM_B1_B2,
        ...window.CURRICULUM_C1_C2,
        ...(window.MEDICAL_CURRICULUM || [])
      ];

      for (const lvl of allCurriculum) {
        for (const unit of lvl.units) {
          const l = unit.lessons.find(x => x.id === lessonOrId);
          if (l) {
            targetLesson = l;
            break;
          }
        }
        if (targetLesson) break;
      }
    }

    if (targetLesson) {
      if (targetLesson.id.startsWith('m')) {
        this.currentViewSource = 'medical';
      } else {
        this.currentViewSource = 'path';
      }
      this.switchView('exercise');
      this.exerciseEngine.start(targetLesson);
    }
  }

  // Practice Mode: restores 1 heart on completion
  startPracticeMode() {
    window.audioEngine.playClickSound();
    
    // Build a quick review practice lesson from A1
    const practiceLesson = {
      id: 'practice_quick',
      title: 'ڕاهێنانی پڕکردنەوەی دڵ (+١ ❤️)',
      xp: 10,
      exercises: [
        {
          id: 'pr_1',
          type: 'sentence_builder',
          instruction_ku: 'ڕستەکە ڕێکبخە بۆ: "چۆنیت برام؟"',
          target_ar: 'شلونك خويه؟',
          phonetic_ku: 'شلۆنک خۆیە؟',
          tokens: ['شلونك', 'خويه؟', 'ماکو', 'وين'],
          correct: ['شلونك', 'خويه؟'],
          explanation_ku: '"شلونك خويه" = چۆنیت برام.'
        },
        {
          id: 'pr_2',
          type: 'speaking',
          instruction_ku: 'بە دەنگ بڵێ بۆ سڵاوکردن:',
          target_ar: 'هلو، شكو ماكو؟',
          phonetic_ku: 'هەلۆ، شکۆ ماکۆ؟',
          translation_ku: 'سڵاو، چ باس و چی هەیە؟',
          explanation_ku: 'باوترین سڵاوی عێراق.'
        },
        {
          id: 'pr_3',
          type: 'pattern_drill',
          instruction_ku: 'بۆشاییەکە پڕبکەرەوە بۆ کاری بەردەوام:',
          sentence_with_blank: 'اني هسه ______ اشرب چاي.',
          correct_word: 'دا',
          options: ['دا', 'راح', 'چان', 'ما'],
          explanation_ku: '"دا اشرب" = خەریکم دەخۆمەوە.'
        }
      ]
    };

    this.switchView('exercise');
    this.exerciseEngine.start(practiceLesson);
  }

  exitLesson() {
    window.audioEngine.playClickSound();
    if (this.currentViewSource === 'medical') {
      this.switchView('medical');
    } else {
      this.switchView('path');
    }
  }

  skipExercise() {
    window.audioEngine.playClickSound();
    this.exerciseEngine.currentIndex++;
    this.exerciseEngine.renderCurrentExercise();
  }

  finishLesson() {
    try { window.audioEngine.playClickSound(); } catch (e) {}
    try { this.state.addHeart(); } catch (e) {} // Practice rewards heart

    const isMedical = (this.currentViewSource === 'medical') ||
                      (this.currentLesson && this.currentLesson.id && this.currentLesson.id.startsWith('m')) ||
                      (this.exerciseEngine && this.exerciseEngine.currentLesson && this.exerciseEngine.currentLesson.id && this.exerciseEngine.currentLesson.id.startsWith('m'));

    if (isMedical) {
      this.switchView('medical');
    } else {
      this.switchView('path');
    }
  }

  showHeartsDepletedModal() {
    const modal = document.getElementById('modal-hearts-depleted');
    if (modal) modal.classList.remove('hidden');
  }

  closeHeartsModal() {
    const modal = document.getElementById('modal-hearts-depleted');
    if (modal) modal.classList.add('hidden');
  }

  showServerModal() {
    const modal = document.getElementById('modal-server-settings');
    const input = document.getElementById('input-server-url');
    if (input) {
      if (window.Android && typeof window.Android.getServerUrl === 'function') {
        input.value = window.Android.getServerUrl();
      } else {
        input.value = localStorage.getItem('yalla_server_url') || window.location.origin;
      }
    }
    if (modal) modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeServerModal() {
    const modal = document.getElementById('modal-server-settings');
    if (modal) modal.classList.add('hidden');
  }

  saveServerUrl() {
    const input = document.getElementById('input-server-url');
    if (!input || !input.value.trim()) return;
    const url = input.value.trim();

    if (window.Android && typeof window.Android.setServerUrl === 'function') {
      window.Android.setServerUrl(url);
    } else {
      localStorage.setItem('yalla_server_url', url);
      if (url !== window.location.origin) {
        window.location.href = url;
      }
    }
    this.closeServerModal();
  }

  refillHeartsWithGems() {
    if (this.state.gems >= 50) {
      this.state.gems -= 50;
      this.state.refillHearts();
      this.closeHeartsModal();
    } else {
      this.state.refillHearts();
      this.closeHeartsModal();
    }
  }

  toggleSound() {
    const enabled = window.audioEngine.toggleSound();
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
      soundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
      if (window.lucide) window.lucide.createIcons();
    }
    return enabled;
  }

  toggleTheme() {
    window.audioEngine.playClickSound();
    if (this.state.theme === 'light') {
      this.state.theme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      this.state.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
    this.state.saveState();
  }
}

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
