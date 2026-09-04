/**
 * Audio Engine: Web Audio API sound effects synthesizer + Web Speech API TTS & Recognition
 * Features dual-speed Iraqi Arabic pronunciation (Normal 🐰 / Slow 🐢) & Kurdish Sorani audio cues.
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.soundEnabled = true;
    this.speechRateNormal = 0.9;
    this.speechRateSlow = 0.6; // For dialect ear training
    this.speechPitch = 1.0;
    this.voices = [];
    this.currentAudio = null;
    this.activeUtterance = null;
    
    if (this.synth) {
      try {
        this.voices = this.synth.getVoices() || [];
        if (typeof this.synth.addEventListener === 'function') {
          this.synth.addEventListener('voiceschanged', () => {
            this.voices = this.synth.getVoices() || [];
          });
        } else if ('onvoiceschanged' in this.synth) {
          this.synth.onvoiceschanged = () => {
            this.voices = this.synth.getVoices() || [];
          };
        }
      } catch (e) {}
    }

    this.initAudioContext();
    this.initSpeechRecognition();

    // User interaction audio unlock
    if (typeof document !== 'undefined') {
      const unlock = () => {
        this.ensureAudioContext();
        if (this.audioCtx && this.audioCtx.state === 'running') {
          document.removeEventListener('click', unlock);
          document.removeEventListener('touchstart', unlock);
        }
      };
      document.addEventListener('click', unlock, { once: true });
      document.addEventListener('touchstart', unlock, { once: true });
    }
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  // Samsung Galaxy / Android Linear Haptic Motor Feedback
  triggerHaptic(type = 'light') {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      if (type === 'light') {
        navigator.vibrate(10); // subtle tap for buttons
      } else if (type === 'success') {
        navigator.vibrate([15, 40, 20]); // double celebratory pulse
      } else if (type === 'error') {
        navigator.vibrate([35, 50, 35]); // warning rumble
      } else if (type === 'celebration') {
        navigator.vibrate([20, 30, 20, 30, 40]);
      }
    } catch (e) {}
  }

  // --- Web Audio Sound Effects Synthesizer ---
  
  playCorrectSound() {
    this.triggerHaptic('success');
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Cheerful chime: C5 -> E5 -> G5 -> C6
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.08);
      osc1.frequency.setValueAtTime(783.99, now + 0.16);
      osc1.frequency.setValueAtTime(1046.50, now + 0.24);

      osc2.frequency.setValueAtTime(261.63, now);
      osc2.frequency.setValueAtTime(523.25, now + 0.24);

      gainNode.gain.setValueAtTime(0.01, now);
      gainNode.gain.linearRampToValueAtTime(0.32, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio FX error', e);
    }
  }

  playErrorSound() {
    this.triggerHaptic('error');
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      // Descending buzzer thud
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(75, now + 0.35);

      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio FX error', e);
    }
  }

  // Aliases for compatibility
  playWrongSound() {
    this.playErrorSound();
  }

  playLessonComplete() {
    this.playLevelUpFanfare();
  }

  playClickSound() {
    this.triggerHaptic('light');
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio FX error', e);
    }
  }

  playLevelUpFanfare() {
    this.triggerHaptic('celebration');
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 783.99, 880, 1108.73];
      const durations = [0.1, 0.1, 0.1, 0.25, 0.12, 0.12, 0.5];
      let offset = 0;
      const now = this.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + offset);

        gain.gain.setValueAtTime(0.01, now + offset);
        gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + durations[idx]);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + durations[idx]);
        offset += durations[idx] * 0.85;
      });
    } catch (e) {
      console.warn('Fanfare error', e);
    }
  }

  playStreakSound() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Streak audio error', e);
    }
  }

  // --- Iraqi Arabic Speech Synthesis (TTS) ---
  speakIraqi(text, rate = null, onEndCallback = null) {
    if (!text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (!this.soundEnabled) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.triggerHaptic('light');
    this.ensureAudioContext();

    // Strip parenthesized Kurdish glosses, annotations, arrows, and emojis for pure Arabic pronunciation
    const cleanText = String(text)
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/➔.*/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[،؟!.،]/g, ' ')
      .trim() || String(text);

    if (!cleanText) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Attempt primary high-fidelity Server TTS endpoint
    this.speakWithServerTTS(cleanText, rate, (success) => {
      if (!success) {
        // Fallback to client-side SpeechSynthesis if server or network unavailable
        this.speakWithSpeechSynthesis(cleanText, rate, onEndCallback);
      } else {
        if (onEndCallback) onEndCallback();
      }
    });
  }

  // Primary High-Fidelity Audio Stream via /api/tts
  speakWithServerTTS(cleanText, rate = null, callback = null) {
    try {
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (e) {}
        this.currentAudio = null;
      }

      const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
      const audio = new Audio(ttsUrl);
      audio.playbackRate = (rate && rate < 0.85) ? 0.72 : 1.0;
      this.currentAudio = audio;

      let hasCallbacked = false;
      const notify = (status) => {
        if (!hasCallbacked) {
          hasCallbacked = true;
          this.currentAudio = null;
          if (callback) callback(status);
        }
      };

      audio.onended = () => notify(true);
      audio.onerror = (e) => {
        console.warn('Server TTS failed, switching to local speech synthesis:', e);
        notify(false);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((playErr) => {
          console.warn('Audio play() error:', playErr);
          notify(false);
        });
      }
    } catch (err) {
      console.warn('speakWithServerTTS exception:', err);
      if (callback) callback(false);
    }
  }

  // Fallback: Synchronous Web Speech API
  speakWithSpeechSynthesis(cleanText, rate = null, onEndCallback = null) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();

      const voices = (this.voices && this.voices.length > 0) ? this.voices : (this.synth.getVoices ? this.synth.getVoices() : []);
      let arabicVoice = voices.find(v => v.lang === 'ar-IQ' || v.lang.startsWith('ar-IQ')) ||
                        voices.find(v => v.lang.startsWith('ar-') || v.lang === 'ar') ||
                        voices.find(v => (v.name && (v.name.toLowerCase().includes('arabic') || 
                                                     v.name.toLowerCase().includes('tarik') || 
                                                     v.name.toLowerCase().includes('layla') || 
                                                     v.name.toLowerCase().includes('maged'))));

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate || this.speechRateNormal;
      utterance.pitch = this.speechPitch;

      if (arabicVoice) {
        utterance.voice = arabicVoice;
        utterance.lang = arabicVoice.lang;
      } else {
        utterance.lang = 'ar-SA';
      }

      this.activeUtterance = utterance;

      let finished = false;
      const done = () => {
        if (!finished) {
          finished = true;
          this.activeUtterance = null;
          if (onEndCallback) onEndCallback();
        }
      };

      utterance.onend = done;
      utterance.onerror = () => done();

      // Synchronous execution avoids gesture loss in mobile browsers
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis fallback error:', err);
      if (onEndCallback) onEndCallback();
    }
  }

  // High-reliability audio fallback when system lacks Arabic TTS
  speakWithFallbackAudio(text, rate = null, onEndCallback = null) {
    this.speakIraqi(text, rate, onEndCallback);
  }

  // Slow pronunciation for ear training
  speakIraqiSlow(text, onEndCallback = null) {
    this.speakIraqi(text, this.speechRateSlow, onEndCallback);
  }

  // --- Voice Recognition (Speech-to-Text for Speaking Challenges) ---
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'ar-IQ';
      this.recognition.maxAlternatives = 3;
    }
  }

  startListening({ onResult, onEnd, onError }) {
    if (!this.recognition) {
      if (onError) onError('ڕێپێدانی دەنگ لەم وێبگەڕەدا کار ناکات. لە Google Chrome یان MS Edge ئەتوانن بەکاری بهێنن.');
      return false;
    }

    if (this.isListening) {
      try { this.recognition.stop(); } catch(e){}
    }

    this.isListening = true;
    let finalTranscript = '';

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (onResult) {
        onResult({
          final: finalTranscript.trim(),
          interim: interim.trim(),
          raw: event.results
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd(finalTranscript.trim());
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      this.isListening = false;
      if (onError) onError(e.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }

  // --- Speech Similarity Evaluator ---
  evaluatePronunciation(spokenText, expectedText) {
    if (!spokenText) return { score: 0, matched: false };
    
    const normalize = (str) => {
      return str
        .replace(/[،,?!.؛]/g, '')
        .replace(/[\u064B-\u065F\u0670]/g, '') // strip tashkeel
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/گ/g, 'ك')
        .replace(/چ/g, 'ج')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    };

    const sNorm = normalize(spokenText);
    const eNorm = normalize(expectedText);

    if (sNorm === eNorm) {
      return { score: 100, matched: true };
    }

    const dist = this.levenshtein(sNorm, eNorm);
    const maxLen = Math.max(sNorm.length, eNorm.length);
    const similarity = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));

    const sTokens = sNorm.split(' ');
    const eTokens = eNorm.split(' ');
    let overlapCount = 0;
    eTokens.forEach(t => {
      if (sTokens.includes(t)) overlapCount++;
    });
    const tokenScore = Math.round((overlapCount / eTokens.length) * 100);

    const finalScore = Math.round((similarity * 0.6) + (tokenScore * 0.4));
    return {
      score: finalScore,
      matched: finalScore >= 60
    };
  }

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}

window.audioEngine = new AudioEngine();
