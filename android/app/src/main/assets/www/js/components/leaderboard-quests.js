/**
 * Leaderboard, Daily Quests & Achievements Component
 */

class LeaderboardQuests {
  constructor(containerId, appState) {
    this.container = document.getElementById(containerId);
    this.state = appState;
  }

  render() {
    if (!this.container) return;

    // Simulated competitive league with Kurdish & Iraqi language learners
    const simulatedUsers = [
      { name: 'ڕێبین ئەحمەد (Rebin)', xp: this.state.xp + 45, avatar: '🦁', rank: 1 },
      { name: 'تۆ (ئێستا)', xp: this.state.xp, avatar: '👑', isUser: true, rank: 2 },
      { name: 'سارا عومەر (Sara)', xp: Math.max(0, this.state.xp - 20), avatar: '🌸', rank: 3 },
      { name: 'کاروان هەولێری', xp: Math.max(0, this.state.xp - 50), avatar: '⚡', rank: 4 },
      { name: 'شایی کەلار', xp: Math.max(0, this.state.xp - 90), avatar: '🌟', rank: 5 },
      { name: 'ئالان سلێمانی', xp: Math.max(0, this.state.xp - 140), avatar: '🎯', rank: 6 }
    ];

    const quests = [
      { id: 'q1', title: 'تەواوکردنی ٢ وانەی نوێ', current: Math.min(2, this.state.completedLessons.length), target: 2, xpReward: 20, icon: '📖' },
      { id: 'q2', title: 'بەدەستهێنانی ٥٠ خاڵی XP', current: Math.min(50, this.state.xp), target: 50, xpReward: 30, icon: '⚡' },
      { id: 'q3', title: 'پێداچوونەوەی وشەکانی فەرهەنگ', current: 5, target: 5, xpReward: 15, icon: '📚' }
    ];

    const badges = [
      { id: 'b1', title: 'فەرهەنگدۆست', desc: 'فێربوونی ١٠ وشەی عێراقی', unlocked: true, icon: '🎖️' },
      { id: 'b2', title: 'شۆفێری بەغدا', desc: 'تەواوکردنی گفتوگۆی تاکسی', unlocked: true, icon: '🚕' },
      { id: 'b3', title: 'پادشای "شکو ماکو"', desc: 'بەدەستهێنانی ١٠٠ خاڵ لە ئاستی A1', unlocked: this.state.xp >= 100, icon: '👑' },
      { id: 'b4', title: 'شارەزای شێعر و مەقام', desc: 'گەیشتن بە ئاستی باڵای C2', unlocked: this.state.isLevelUnlocked('c2'), icon: '🎶' }
    ];

    this.container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <!-- Daily Quests Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>🎯</span>
              <span>ئەرکەکانی ئەمڕۆ (Daily Quests)</span>
            </h2>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              نوێبوونەوە لە ٢٤ کاتژمێردا
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${quests.map(q => {
              const progress = Math.round((q.current / q.target) * 100);
              const isDone = progress >= 100;
              return `
                <div class="bg-white dark:bg-slate-900 border-2 ${isDone ? 'border-emerald-400' : 'border-slate-200 dark:border-slate-800'} rounded-3xl p-4 shadow-sm flex flex-col justify-between">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-2xl">${q.icon}</span>
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">${q.title}</span>
                  </div>

                  <div>
                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                      <span>${q.current} / ${q.target}</span>
                      <span class="text-emerald-600 dark:text-emerald-400">+${q.xpReward} XP</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div class="bg-emerald-500 h-full rounded-full transition-all" style="width: ${progress}%;"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Weekly Leaderboard Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>🏆</span>
                <span>خولی کێبڕکێی هەفتانە (لیگی یاقووت)</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">٣ کەسی یەکەم سەردەکەون بۆ لیگی ئەڵماس (Diamond League)</p>
            </div>
            <div class="text-2xl">💎</div>
          </div>

          <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              ${simulatedUsers.map(u => `
                <div class="p-4 flex items-center justify-between gap-3 ${u.isUser ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-black' : ''}">
                  <div class="flex items-center gap-3">
                    <span class="w-6 text-center font-black text-sm ${u.rank === 1 ? 'text-amber-500 text-lg' : u.rank === 2 ? 'text-slate-400 text-base' : u.rank === 3 ? 'text-amber-700' : 'text-slate-400'}">
                      ${u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                    </span>
                    <span class="text-2xl">${u.avatar}</span>
                    <span class="text-sm text-slate-800 dark:text-slate-100">${u.name}</span>
                  </div>

                  <div class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    <span>⚡</span>
                    <span>${u.xp} XP</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Badges & Achievements Grid -->
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <span>🎖️</span>
            <span>میدالیا و دەستکەوتەکان</span>
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            ${badges.map(b => `
              <div class="bg-white dark:bg-slate-900 border-2 ${b.unlocked ? 'border-amber-300 dark:border-amber-500/40' : 'border-slate-200 dark:border-slate-800 opacity-50'} rounded-3xl p-4 text-center shadow-sm">
                <div class="text-3xl mb-2">${b.icon}</div>
                <div class="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">${b.title}</div>
                <div class="text-[10px] text-slate-400 leading-tight">${b.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

window.LeaderboardQuests = LeaderboardQuests;
