(function () {
  "use strict";

  const data = window.IPA_DATA;
  if (!data) {
    throw new Error("IPA data failed to load.");
  }

  const refs = {
    modeButtons: [...document.querySelectorAll(".mode-button")],
    pageEyebrow: document.querySelector("#mode-eyebrow"),
    pageTitle: document.querySelector("#page-title"),
    pageSubtitle: document.querySelector("#page-subtitle"),
    promptKicker: document.querySelector("#prompt-kicker"),
    roundLabel: document.querySelector("#round-label"),
    ipaGlyph: document.querySelector("#ipa-glyph"),
    pronunciationButton: document.querySelector("#pronunciation-button"),
    pronunciationLabel: document.querySelector("#pronunciation-label"),
    pronunciationStatus: document.querySelector("#pronunciation-status"),
    sourceCell: document.querySelector("#source-cell"),
    questionProgress: document.querySelector("#question-progress"),
    answerTitle: document.querySelector("#answer-title"),
    answerProgress: document.querySelector("#answer-progress"),
    answerNote: document.querySelector("#answer-note"),
    form: document.querySelector("#choice-form"),
    sectionPosition: document.querySelector("#section-position"),
    sectionLipShape: document.querySelector("#section-lipShape"),
    sectionHeight: document.querySelector("#section-height"),
    optionsPosition: document.querySelector("#options-position"),
    optionsLipShape: document.querySelector("#options-lipShape"),
    optionsHeight: document.querySelector("#options-height"),
    titlePosition: document.querySelector("#field-position-title"),
    hintPosition: document.querySelector("#field-position-hint"),
    titleLipShape: document.querySelector("#field-lipShape-title"),
    hintLipShape: document.querySelector("#field-lipShape-hint"),
    titleHeight: document.querySelector("#field-height-title"),
    hintHeight: document.querySelector("#field-height-hint"),
    statusPosition: document.querySelector("#status-position"),
    statusLipShape: document.querySelector("#status-lipShape"),
    statusHeight: document.querySelector("#status-height"),
    sessionStats: document.querySelector("#session-stats"),
    statAnswered: document.querySelector("#stat-answered"),
    exitTest: document.querySelector("#exit-test"),
    feedback: document.querySelector("#feedback"),
    feedbackIcon: document.querySelector("#feedback-icon"),
    feedbackKicker: document.querySelector("#feedback-kicker"),
    feedbackTitle: document.querySelector("#feedback-title"),
    feedbackSummary: document.querySelector("#feedback-summary"),
    feedbackDetails: document.querySelector("#feedback-details"),
    shuffle: document.querySelector("#shuffle-question"),
    next: document.querySelector("#next-question"),
    testActions: document.querySelector("#test-actions"),
    testActionCopy: document.querySelector(".test-action-copy"),
    testNext: document.querySelector("#test-next"),
    workspace: document.querySelector("#workspace"),
    testResult: document.querySelector("#test-result"),
    testResultKicker: document.querySelector("#test-result-kicker"),
    testResultAccuracy: document.querySelector("#test-result-accuracy"),
    testResultCorrect: document.querySelector("#test-result-correct"),
    testResultWrong: document.querySelector("#test-result-wrong"),
    testResultTotal: document.querySelector("#test-result-total"),
    retryTest: document.querySelector("#retry-test"),
    backToTraining: document.querySelector("#back-to-training"),
    selfTestToggle: document.querySelector("#self-test-toggle"),
    selfTestToggleLabel: document.querySelector("#self-test-toggle-label"),
    starCurrent: document.querySelector("#star-current"),
    starCurrentLabel: document.querySelector("#star-current-label"),
    starResult: document.querySelector("#star-result"),
    starResultLabel: document.querySelector("#star-result-label"),
    openStarred: document.querySelector("#open-starred"),
    closeStarred: document.querySelector("#close-starred"),
    starDialog: document.querySelector("#star-dialog"),
    starredContent: document.querySelector("#starred-content"),
    starCount: document.querySelector("#star-count"),
    starDialogMeta: document.querySelector("#star-dialog-meta"),
    starFilterButtons: [...document.querySelectorAll("[data-star-filter]")],
    openTables: document.querySelector("#open-tables"),
    closeTables: document.querySelector("#close-tables"),
    tableDialog: document.querySelector("#table-dialog"),
    tableTabs: [...document.querySelectorAll(".table-tab")],
    tableMeta: document.querySelector("#table-meta"),
    tableContent: document.querySelector("#table-content"),
    tableAudioStatus: document.querySelector("#table-audio-status"),
    openSettings: document.querySelector("#open-settings"),
    closeSettings: document.querySelector("#close-settings"),
    settingsPanel: document.querySelector("#settings-panel"),
    cacheToggle: document.querySelector("#ipa-cache-toggle")
  };

  const fieldConfig = {
    vowels: {
      fields: ["position", "lipShape", "height"],
      position: {
        title: "發音位置",
        hint: "前 / 央 / 後",
        options: data.vowels.positions
      },
      lipShape: {
        title: "圓展脣",
        hint: "展脣 / 圓脣",
        options: data.vowels.lipShapes
      },
      height: {
        title: "音調高低",
        hint: "高 / 半高 / 中 / 半低 / 低",
        options: data.vowels.heights
      }
    },
    consonants: {
      fields: ["place", "manner"],
      place: {
        title: "發音部位",
        hint: "11 個發音部位",
        options: data.consonants.places
      },
      manner: {
        title: "發音方法",
        hint: "14 種發音方法",
        options: data.consonants.manners
      }
    }
  };

  const modeCopy = {
    vowels: {
      eyebrow: "VOWEL COORDINATES · 元音座標",
      title: "元音座標訓練",
      subtitle: "從元音表中隨機抽取，判斷它的發音位置、圓展脣與音調高低。",
      promptKicker: "元音表 · 隨機取樣",
      answerTitle: "選擇發音座標",
      testEyebrow: "VOWEL SELF TEST · 元音自測",
      testTitle: "元音自測模式",
      testSubtitle: "默認 10 題，答題過程中不顯示對錯，完成後統一計算正確率。",
      testPromptKicker: "元音表 · 自測題",
      starEyebrow: "STAR PRACTICE · 元音星標",
      starTitle: "元音星標練習",
      starPromptKicker: "星標集 · 單音複習"
    },
    consonants: {
      eyebrow: "CONSONANT COORDINATES · 輔音座標",
      title: "輔音座標訓練",
      subtitle: "從輔音表中隨機抽取，判斷它的發音部位與發音方法。",
      promptKicker: "輔音表 · 隨機取樣",
      answerTitle: "選擇輔音座標",
      testEyebrow: "CONSONANT SELF TEST · 輔音自測",
      testTitle: "輔音自測模式",
      testSubtitle: "默認 10 題，答題過程中不顯示對錯，完成後統一計算正確率。",
      testPromptKicker: "輔音表 · 自測題",
      starEyebrow: "STAR PRACTICE · 輔音星標",
      starTitle: "輔音星標練習",
      starPromptKicker: "星標集 · 單音複習"
    }
  };

  const domFieldMap = {
    position: "position",
    place: "position",
    lipShape: "lipShape",
    manner: "lipShape",
    height: "height"
  };

  const TEST_LENGTH = 10;
  const STAR_STORAGE_KEY = "ipa-trainer-stars-v1";
  const IPA_CACHE_ENABLED_KEY = "ipa_cache_enabled_v1";
  const IPA_CACHE_SEEN_KEY = "ipa_cache_seen_v1";
  const IPA_AUDIO_CACHE_NAME = "ipa-audio-cache-v1";
  const audioManifest = window.IPA_AUDIO || { vowels: {}, consonants: {} };

  // 表格沿用舊式/簡寫音標；這裏映射到數據集中的標準文件名。
  const TABLE_AUDIO_ALIASES = {
    consonants: {
      "g/g": "ɡ",
      "tʃ": "t̠ʃ",
      "dʒ": "d̠ʒ",
      "ȶ": "c",
      "ȡ": "ɟ",
      "ȵ": "ɲ",
      "pf": "p̪f",
      "bv": "b̪v"
    }
  };

  let currentAudio = null;
  let currentAudioPath = "";
  let currentTableAudio = null;
  let currentTableButton = null;

  const state = {
    mode: "vowels",
    phase: "answering",
    question: null,
    selection: {},
    wrongFields: [],
    focusedPractice: false,
    stars: [],
    starFilter: "all",
    cacheEnabled: false,
    checkTimer: null,
    lastCell: { vowels: null, consonants: null },
    rounds: { vowels: 0, consonants: 0 },
    selfTests: {
      vowels: createTestState(),
      consonants: createTestState()
    },
    activeTable: "vowels"
  };

  function createTestState() {
    return {
      active: false,
      total: TEST_LENGTH,
      answered: 0,
      correct: 0,
      records: [],
      completed: false
    };
  }

  function currentTest() {
    return state.selfTests[state.mode];
  }

  function starKey(mode, sourceCell) {
    return `${mode}:${sourceCell}`;
  }

  function findEntry(mode, sourceCell) {
    if (!data[mode]) return null;
    return data[mode].entries.find((entry) => entry.sourceCell === sourceCell) || null;
  }

  function loadStars() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STAR_STORAGE_KEY) || "[]");
      if (!Array.isArray(stored)) return [];

      const unique = new Map();
      stored.forEach((item) => {
        if (!item || !item.mode || !item.sourceCell) return;
        if (!findEntry(item.mode, item.sourceCell)) return;
        unique.set(starKey(item.mode, item.sourceCell), {
          mode: item.mode,
          sourceCell: item.sourceCell
        });
      });
      return [...unique.values()];
    } catch (error) {
      return [];
    }
  }

  function saveStars() {
    try {
      window.localStorage.setItem(STAR_STORAGE_KEY, JSON.stringify(state.stars));
    } catch (error) {
      // The current session still works when browser storage is unavailable.
    }
  }

  function showToast(message) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2600);
  }

  function clearIpaAudioCache() {
    if (!window.caches || typeof window.caches.delete !== "function") return;
    window.caches.delete(IPA_AUDIO_CACHE_NAME).catch(() => {
      // Cache Storage may be unavailable in private browsing contexts.
    });
  }

  function initIpaCacheControl() {
    const toggle = refs.cacheToggle;
    if (!toggle) return;

    let stored = null;
    try {
      stored = window.localStorage.getItem(IPA_CACHE_ENABLED_KEY);
    } catch (error) {
      stored = null;
    }
    state.cacheEnabled = stored === "1";
    toggle.checked = state.cacheEnabled;

    toggle.addEventListener("change", () => {
      state.cacheEnabled = toggle.checked;
      try {
        window.localStorage.setItem(IPA_CACHE_ENABLED_KEY, state.cacheEnabled ? "1" : "0");
        window.localStorage.setItem(IPA_CACHE_SEEN_KEY, "1");
      } catch (error) {
        // Keep the setting for the current session when storage is unavailable.
      }
      if (!state.cacheEnabled) clearIpaAudioCache();
      showToast(state.cacheEnabled ? "已開啓 IPA 數據緩存" : "已關閉 IPA 數據緩存");
    });
  }

  function initIpaSettings() {
    const openButton = refs.openSettings;
    const closeButton = refs.closeSettings;
    const panel = refs.settingsPanel;
    if (!openButton || !panel) return;

    openButton.addEventListener("click", () => {
      panel.classList.add("open");
      if (refs.cacheToggle) refs.cacheToggle.checked = state.cacheEnabled;
    });
    if (closeButton) {
      closeButton.addEventListener("click", () => panel.classList.remove("open"));
    }
  }

  function isCurrentStarred() {
    if (!state.question) return false;
    const key = starKey(state.mode, state.question.sourceCell);
    return state.stars.some((star) => starKey(star.mode, star.sourceCell) === key);
  }

  function syncStarUi() {
    const starred = isCurrentStarred();
    refs.starCurrent.classList.toggle("is-starred", starred);
    refs.starCurrent.setAttribute("aria-pressed", String(starred));
    refs.starCurrent.setAttribute(
      "aria-label",
      starred ? "取消當前音標的星標" : "將當前音標加入星標"
    );
    refs.starCurrent.setAttribute(
      "title",
      starred ? "取消當前音標的星標" : "將當前音標加入星標"
    );
    refs.starCurrentLabel.textContent = starred ? "已星標" : "星標";
    refs.starResult.classList.toggle("is-starred", starred);
    refs.starResult.setAttribute("aria-pressed", String(starred));
    refs.starResult.setAttribute(
      "aria-label",
      starred ? "取消本題音標的星標" : "將本題音標加入星標"
    );
    refs.starResultLabel.textContent = starred ? "已星標" : "星標本題";
    refs.starCount.textContent = String(state.stars.length);
    refs.openStarred.classList.toggle("has-stars", state.stars.length > 0);

    if (refs.starDialog.open) {
      renderStarredContent();
    }
  }

  function toggleCurrentStar() {
    if (!state.question) return;
    const key = starKey(state.mode, state.question.sourceCell);
    const existingIndex = state.stars.findIndex(
      (star) => starKey(star.mode, star.sourceCell) === key
    );

    if (existingIndex >= 0) {
      state.stars.splice(existingIndex, 1);
    } else {
      state.stars.push({
        mode: state.mode,
        sourceCell: state.question.sourceCell
      });
    }

    saveStars();
    syncStarUi();
  }

  function starDescription(entry, mode) {
    if (mode === "consonants") {
      return `${entry.place} · ${entry.manner}`;
    }
    const parts = [entry.position];
    if (entry.lipShape) parts.push(entry.lipShape);
    parts.push(entry.height);
    return parts.join(" · ");
  }

  function renderStarredContent() {
    const filtered = state.stars
      .map((star) => ({ star, entry: findEntry(star.mode, star.sourceCell) }))
      .filter(({ star, entry }) => entry && (state.starFilter === "all" || star.mode === state.starFilter));

    refs.starCount.textContent = String(state.stars.length);
    refs.starDialogMeta.textContent = `${filtered.length} 個星標`;
    refs.starFilterButtons.forEach((button) => {
      const active = button.dataset.starFilter === state.starFilter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });

    if (!filtered.length) {
      const filteredEmpty = state.stars.length > 0;
      refs.starredContent.innerHTML = `
        <div class="star-empty">
          <div class="star-empty-icon"><i data-lucide="star" aria-hidden="true"></i></div>
          <h3>${filteredEmpty ? "這個分類還沒有星標" : "還沒有星標音標"}</h3>
          <p>${filteredEmpty ? "切換到其他分類查看。" : "在練習中點擊“星標”即可加入這裏。"}</p>
        </div>
      `;
    } else {
      refs.starredContent.innerHTML = `
        <div class="starred-list">
          ${filtered.map(({ star, entry }) => `
            <article class="starred-item">
              <div class="starred-ipa">${entry.ipa}</div>
              <div class="starred-copy">
                <span class="starred-mode">${star.mode === "vowels" ? "元音" : "輔音"} · ${entry.sourceCell}</span>
                <strong>${starDescription(entry, star.mode)}</strong>
              </div>
              <div class="starred-actions">
                <button
                  class="button button-primary"
                  type="button"
                  data-star-action="practice"
                  data-mode="${star.mode}"
                  data-cell="${entry.sourceCell}"
                >
                  練習
                </button>
                <button
                  class="star-remove-button"
                  type="button"
                  data-star-action="remove"
                  data-mode="${star.mode}"
                  data-cell="${entry.sourceCell}"
                  aria-label="移除 ${entry.ipa} 的星標"
                  title="移除星標"
                >
                  <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
              </div>
            </article>
          `).join("")}
        </div>
      `;
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function openStarredDialog() {
    state.starFilter = "all";
    renderStarredContent();
    document.body.classList.add("modal-open");
    if (typeof refs.starDialog.showModal === "function") {
      refs.starDialog.showModal();
    } else {
      refs.starDialog.setAttribute("open", "");
    }
    refs.closeStarred.focus();
  }

  function closeStarredDialog() {
    if (typeof refs.starDialog.close === "function") {
      refs.starDialog.close();
    } else {
      refs.starDialog.removeAttribute("open");
    }
    if (!refs.tableDialog.open) {
      document.body.classList.remove("modal-open");
    }
  }

  function removeStar(mode, sourceCell) {
    const key = starKey(mode, sourceCell);
    state.stars = state.stars.filter(
      (star) => starKey(star.mode, star.sourceCell) !== key
    );
    saveStars();
    syncStarUi();
  }

  function practiceStar(mode, sourceCell) {
    const entry = findEntry(mode, sourceCell);
    if (!entry) return;

    if (state.selfTests[mode].active) {
      state.selfTests[mode] = createTestState();
    }

    state.mode = mode;
    state.question = null;
    state.selection = {};
    state.wrongFields = [];
    state.phase = "answering";
    closeStarredDialog();
    configureMode();
    startQuestion({ entry });
  }

  function randomIndex(length) {
    if (window.crypto && window.crypto.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] % length;
    }
    return Math.floor(Math.random() * length);
  }

  function pickQuestion() {
    const test = currentTest();
    let pool = data[state.mode].entries;

    if (test.active) {
      const askedCells = new Set(test.records.map((record) => record.sourceCell));
      const unasked = pool.filter((entry) => !askedCells.has(entry.sourceCell));
      if (unasked.length) pool = unasked;
    }

    const lastCell = state.lastCell[state.mode];
    const candidatePool = pool.length > 1
      ? pool.filter((entry) => entry.sourceCell !== lastCell)
      : pool;
    const question = candidatePool[randomIndex(candidatePool.length)];
    state.lastCell[state.mode] = question.sourceCell;
    return question;
  }

  function getModeFields() {
    return fieldConfig[state.mode].fields;
  }

  function getRequiredFields() {
    if (isCentralSelection()) {
      return ["position", "height"];
    }
    return getModeFields();
  }

  function getEvaluationFields() {
    if (isCentralSelection() || isCentralAnswer()) {
      return ["position", "height"];
    }
    return getModeFields();
  }

  function isCentralSelection() {
    return state.mode === "vowels"
      && data.toSimplified(state.selection.position) === "央";
  }

  function isCentralAnswer() {
    return state.mode === "vowels"
      && state.question
      && data.toSimplified(state.question.position) === "央";
  }

  function isFieldEnabled(field) {
    if (state.phase !== "answering" || !state.question) return false;

    if (state.mode === "vowels") {
      if (field === "position") return true;
      if (field === "lipShape") {
        const position = data.toSimplified(state.selection.position);
        return position === "前" || position === "后";
      }
      if (field === "height") {
        return Boolean(data.toSimplified(state.selection.position));
      }
    }

    if (state.mode === "consonants") {
      if (field === "place") return true;
      if (field === "manner") return Boolean(state.selection.place);
    }

    return false;
  }

  function getSelectedCount() {
    return getRequiredFields().filter((field) => Boolean(state.selection[field])).length;
  }

  function getAudioPath(entry, mode = state.mode) {
    const manifestKey = mode === "vowels" ? "vowels" : "consonants";
    const alias = TABLE_AUDIO_ALIASES[manifestKey]?.[entry.ipa];
    const symbol = alias || entry.ipa;
    return audioManifest[manifestKey]?.[symbol] || "";
  }

  function stopPronunciation() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.removeAttribute("src");
      currentAudio.load();
    }
    currentAudio = null;
    currentAudioPath = "";
    refs.pronunciationButton.classList.remove("is-playing");
    refs.pronunciationButton.removeAttribute("aria-busy");
    if (!refs.pronunciationButton.disabled) {
      refs.pronunciationLabel.textContent = "播放發音";
    }
    refs.pronunciationStatus.textContent = "";
  }

  function startQuestion(options = {}) {
    if (state.checkTimer) {
      window.clearTimeout(state.checkTimer);
      state.checkTimer = null;
    }

    stopPronunciation();
    const entry = options.entry || null;
    state.focusedPractice = Boolean(entry);
    state.question = entry || pickQuestion();
    state.selection = {};
    state.wrongFields = [];
    state.phase = "answering";
    state.rounds[state.mode] += 1;
    refs.feedback.hidden = true;
    refs.feedback.classList.remove("is-wrong");
    refs.testActions.hidden = true;
    render();
  }

  function startSelfTest() {
    if (state.checkTimer) {
      window.clearTimeout(state.checkTimer);
      state.checkTimer = null;
    }

    state.selfTests[state.mode] = {
      ...createTestState(),
      active: true
    };
    state.question = null;
    state.selection = {};
    state.wrongFields = [];
    state.phase = "answering";
    refs.testResult.hidden = true;
    refs.workspace.hidden = false;
    refs.feedback.hidden = true;
    configureMode();
    startQuestion();
  }

  function exitSelfTest() {
    if (state.checkTimer) {
      window.clearTimeout(state.checkTimer);
      state.checkTimer = null;
    }

    state.selfTests[state.mode] = createTestState();
    state.question = null;
    state.selection = {};
    state.wrongFields = [];
    state.phase = "answering";
    refs.testResult.hidden = true;
    refs.workspace.hidden = false;
    refs.feedback.hidden = true;
    configureMode();
    startQuestion();
  }

  function showTestResult() {
    const test = currentTest();
    if (!test.active || !test.completed) return;

    state.phase = "test-complete";
    const modeLabel = state.mode === "vowels" ? "元音" : "輔音";
    const accuracy = Math.round((test.correct / test.total) * 100);

    refs.testResultKicker.textContent = `SELF TEST · ${modeLabel}自測`;
    refs.testResultAccuracy.textContent = `${accuracy}%`;
    refs.testResultCorrect.textContent = String(test.correct);
    refs.testResultWrong.textContent = String(test.total - test.correct);
    refs.testResultTotal.textContent = String(test.total);
    syncTestUi();
    refs.testResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function syncTestUi() {
    const test = currentTest();
    const active = test.active;
    const showingResult = active && test.completed;
    const focused = !active && state.focusedPractice && state.question;

    refs.sessionStats.hidden = !active;
    refs.statAnswered.textContent = `${test.answered} / ${test.total}`;
    refs.selfTestToggle.classList.toggle("is-exit", active);
    refs.selfTestToggleLabel.textContent = active ? "退出自測" : "開始自測";
    refs.selfTestToggle.setAttribute("aria-label", active ? "退出自測" : "開始自測");
    refs.selfTestToggle.setAttribute("title", active ? "退出自測" : "開始自測");
    refs.shuffle.hidden = active;
    refs.workspace.hidden = showingResult;
    refs.testResult.hidden = !showingResult;
    refs.testActions.hidden = !(active && state.phase === "recorded");

    if (active) {
      refs.feedback.hidden = true;
    }

    const copy = modeCopy[state.mode];
    refs.pageEyebrow.textContent = active
      ? copy.testEyebrow
      : focused
        ? copy.starEyebrow
        : copy.eyebrow;
    refs.pageTitle.textContent = active
      ? copy.testTitle
      : focused
        ? copy.starTitle
        : copy.title;
    refs.pageSubtitle.textContent = active
      ? copy.testSubtitle
      : focused
        ? `從星標集進入，正在重複練習「${state.question.ipa}」。`
        : copy.subtitle;
    refs.promptKicker.textContent = active
      ? copy.testPromptKicker
      : focused
        ? copy.starPromptKicker
        : copy.promptKicker;

    if (state.phase === "recorded") {
      const remaining = test.total - test.answered;
      refs.testActionCopy.textContent = remaining > 0
        ? `本題已記錄，完成後統一顯示結果。`
        : "全部題目已完成。";
    }
  }

  function setMode(mode) {
    if (!fieldConfig[mode] || state.mode === mode) return;
    if (state.checkTimer) {
      window.clearTimeout(state.checkTimer);
      state.checkTimer = null;
    }
    state.mode = mode;
    state.question = null;
    state.selection = {};
    state.phase = "answering";
    refs.feedback.hidden = true;
    refs.feedback.classList.remove("is-wrong");
    configureMode();
    const test = currentTest();
    if (test.active && test.completed) {
      showTestResult();
    } else {
      startQuestion();
    }
  }

  function configureMode() {
    const copy = modeCopy[state.mode];
    refs.pageEyebrow.textContent = copy.eyebrow;
    refs.pageTitle.textContent = copy.title;
    refs.pageSubtitle.textContent = copy.subtitle;
    refs.promptKicker.textContent = copy.promptKicker;
    refs.answerTitle.textContent = copy.answerTitle;

    refs.modeButtons.forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });

    const modeFields = getModeFields();
    refs.sectionPosition.hidden = false;
    refs.sectionLipShape.hidden = false;
    refs.sectionHeight.hidden = state.mode !== "vowels";

    const [firstField, secondField, thirdField] = modeFields;
    refs.sectionPosition.dataset.field = firstField;
    refs.sectionLipShape.dataset.field = secondField;
    refs.sectionHeight.dataset.field = thirdField || "";
    refs.titlePosition.textContent = fieldConfig[state.mode][firstField].title;
    refs.hintPosition.textContent = fieldConfig[state.mode][firstField].hint;
    refs.titleLipShape.textContent = fieldConfig[state.mode][secondField].title;
    refs.hintLipShape.textContent = fieldConfig[state.mode][secondField].hint;

    if (thirdField) {
      refs.titleHeight.textContent = fieldConfig[state.mode][thirdField].title;
      refs.hintHeight.textContent = fieldConfig[state.mode][thirdField].hint;
    } else {
      refs.optionsHeight.innerHTML = "";
      setSectionStatus(refs.statusHeight, null, "尚未判斷");
    }
  }

  function selectionFor(field) {
    return state.selection[field] || "";
  }

  function fieldOptionState(field, value) {
    const selected = selectionFor(field) === value;
    let className = "";
    let mark = "";

    if (selected) className += " is-selected";

    if (state.phase === "resolved") {
      const required = getEvaluationFields().includes(field);
      const correctValue = state.question[field];
      if (required && correctValue === value) {
        className += " is-correct";
        mark = "✓";
      } else if (required && selected) {
        className += " is-wrong";
        mark = "×";
      }
    }

    return { selected, className, mark };
  }

  function renderOptions(field, container) {
    const config = fieldConfig[state.mode][field];
    const enabled = isFieldEnabled(field);
    const centralLip = field === "lipShape" && isCentralSelection();

    container.innerHTML = config.options.map((option) => {
      const optionState = fieldOptionState(field, option);
      const mark = optionState.mark
        ? `<span class="option-mark" aria-hidden="true">${optionState.mark}</span>`
        : "";
      return `
        <button
          class="option-button${optionState.className}"
          type="button"
          data-field="${field}"
          data-value="${option}"
          aria-pressed="${optionState.selected}"
          ${enabled ? "" : "disabled"}
        >
          <span>${option}</span>
          ${mark}
        </button>
      `;
    }).join("");

    if (field === "manner") {
      container.classList.add("option-grid-manner");
    } else {
      container.classList.remove("option-grid-manner");
    }

    if (centralLip) {
      container.setAttribute("aria-label", "央元音不區分圓展脣");
    } else {
      container.setAttribute("aria-label", config.title);
    }
  }

  function setSectionStatus(element, status, label) {
    element.className = "section-status";
    element.textContent = "";
    element.setAttribute("aria-label", label || "尚未判斷");
    if (!status) return;
    element.classList.add(`is-${status}`);
    element.textContent = status === "correct" ? "✓" : status === "wrong" ? "×" : "–";
  }

  function renderSectionStatuses() {
    const fields = getModeFields();
    const statusMap = {
      position: refs.statusPosition,
      lipShape: refs.statusLipShape,
      height: refs.statusHeight
    };

    fields.forEach((field) => {
      const element = statusMap[domFieldMap[field]];
      if (!element) return;

      if (
        state.mode === "vowels"
        && field === "lipShape"
        && (isCentralSelection() || isCentralAnswer())
      ) {
        setSectionStatus(element, "neutral", "央元音無需選擇圓展脣");
        return;
      }

      if (state.phase === "resolved") {
        if (state.wrongFields.includes(field)) {
          setSectionStatus(element, "wrong", "這一項選擇錯誤");
        } else {
          setSectionStatus(element, "correct", "這一項選擇正確");
        }
        return;
      }

      setSectionStatus(element, null, "尚未判斷");
    });
  }

  function renderSectionAvailability() {
    const fields = getModeFields();
    const sectionMap = {
      position: refs.sectionPosition,
      lipShape: refs.sectionLipShape,
      height: refs.sectionHeight
    };

    fields.forEach((field) => {
      const section = sectionMap[domFieldMap[field]];
      if (!section) return;
      const enabled = isFieldEnabled(field);
      const centralLip = field === "lipShape" && isCentralSelection();
      section.classList.toggle("is-locked", !enabled && !centralLip);
    });

    refs.sectionLipShape.classList.toggle("is-central-lip", isCentralSelection());
    const secondField = getModeFields()[1];
    refs.hintLipShape.textContent = isCentralSelection()
      ? "央元音不區分圓展脣"
      : fieldConfig[state.mode][secondField].hint;
  }

  function noteForState() {
    if (currentTest().active) {
      if (state.phase === "checking") {
        return { text: "正在記錄本題答案…", className: "is-checking" };
      }
      if (state.phase === "recorded") {
        return {
          text: "本題已記錄，正確答案將在全部題目完成後統一顯示。",
          className: "is-recorded"
        };
      }
    }

    if (state.phase === "checking") {
      return { text: "正在覈對表格座標…", className: "is-checking" };
    }

    if (state.phase === "resolved") {
      const correct = state.wrongFields.length === 0;
      return {
        text: correct
          ? "選擇與表格座標一致，繼續下一題。"
          : `正確答案：${getAnswerText()}。`,
        className: correct ? "is-correct" : "is-wrong"
      };
    }

    if (state.mode === "vowels") {
      if (!state.selection.position) {
        return { text: "先選擇發音位置。", className: "" };
      }
      if (isCentralSelection()) {
        return {
          text: "央元音不區分圓展脣，請繼續選擇音調高低。",
          className: ""
        };
      }
      if (!state.selection.lipShape) {
        return { text: "發音位置已記錄，繼續選擇圓展脣。", className: "" };
      }
      return { text: "最後選擇音調高低。", className: "" };
    }

    if (!state.selection.place) {
      return { text: "先選擇發音部位。", className: "" };
    }
    return { text: "發音部位已記錄，繼續選擇發音方法。", className: "" };
  }

  function getAnswerText() {
    if (state.mode === "vowels") {
      const parts = [state.question.position];
      if (state.question.lipShape) parts.push(state.question.lipShape);
      parts.push(state.question.height);
      return parts.join(" · ");
    }
    return `${state.question.place} · ${state.question.manner}`;
  }

  function renderPrompt() {
    const question = state.question;
    const test = currentTest();
    const audioPath = getAudioPath(question);
    const hasAudio = Boolean(audioPath);
    const isPlaying = hasAudio
      && currentAudio
      && currentAudioPath === audioPath
      && !currentAudio.paused
      && !currentAudio.ended;

    refs.ipaGlyph.textContent = question.ipa;
    refs.ipaGlyph.classList.toggle("is-long", question.ipa.length > 2);
    refs.pronunciationButton.disabled = !hasAudio;
    refs.pronunciationButton.classList.toggle("is-playing", Boolean(isPlaying));
    refs.pronunciationButton.dataset.audioPath = audioPath;
    if (isPlaying) {
      refs.pronunciationButton.setAttribute("aria-busy", "true");
    } else {
      refs.pronunciationButton.removeAttribute("aria-busy");
    }
    refs.pronunciationLabel.textContent = hasAudio
      ? (isPlaying ? "播放中" : "播放發音")
      : "暫無發音";
    refs.pronunciationButton.setAttribute(
      "aria-label",
      hasAudio ? `${isPlaying ? "正在播放" : "播放"} ${question.ipa} 的發音` : `${question.ipa} 暫無發音`
    );
    refs.pronunciationButton.setAttribute(
      "title",
      hasAudio ? `播放 ${question.ipa} 的發音` : "暫無發音"
    );
    if (!isPlaying) {
      refs.pronunciationStatus.textContent = "";
    }
    refs.sourceCell.textContent = `${state.mode === "vowels" ? "元音表" : "輔音表"} · ${question.sourceCell}`;

    if (test.active) {
      const currentNumber = Math.min(test.answered + 1, test.total);
      refs.roundLabel.textContent = String(currentNumber).padStart(2, "0");
      refs.questionProgress.textContent = `自測 · 第 ${currentNumber} / ${test.total} 題`;
    } else if (state.focusedPractice) {
      refs.roundLabel.textContent = "★";
      refs.questionProgress.textContent = `星標練習 · ${question.ipa}`;
    } else {
      refs.roundLabel.textContent = String(state.rounds[state.mode]).padStart(2, "0");
      refs.questionProgress.textContent = `第 ${state.rounds[state.mode]} 題`;
    }
  }

  function render() {
    if (!state.question) return;
    renderPrompt();

    if (state.mode === "vowels") {
      renderOptions("position", refs.optionsPosition);
      renderOptions("lipShape", refs.optionsLipShape);
      renderOptions("height", refs.optionsHeight);
    } else {
      renderOptions("place", refs.optionsPosition);
      renderOptions("manner", refs.optionsLipShape);
    }

    renderSectionAvailability();
    renderSectionStatuses();
    syncTestUi();
    syncStarUi();

    const required = getRequiredFields();
    refs.answerProgress.textContent = `${getSelectedCount()} / ${required.length}`;

    const note = noteForState();
    refs.answerNote.textContent = note.text;
    refs.answerNote.className = `answer-note${note.className ? ` ${note.className}` : ""}`;
  }

  function handleOptionClick(event) {
    const button = event.target.closest(".option-button");
    if (!button || button.disabled || state.phase !== "answering") return;

    const field = button.dataset.field;
    const value = button.dataset.value;

    if (field === "position") {
      const changed = state.selection.position !== value;
      state.selection.position = value;
      if (data.toSimplified(value) === "央" || changed) {
        state.selection.lipShape = null;
        state.selection.height = null;
      }
    } else if (field === "lipShape") {
      state.selection.lipShape = value;
      state.selection.height = null;
    } else if (field === "height") {
      state.selection.height = value;
    } else if (field === "place") {
      state.selection.place = value;
      state.selection.manner = null;
    } else if (field === "manner") {
      state.selection.manner = value;
    }

    render();
    if (isSelectionComplete()) {
      state.phase = "checking";
      render();
      state.checkTimer = window.setTimeout(resolveAnswer, 240);
    }
  }

  function isSelectionComplete() {
    return getRequiredFields().every((field) => Boolean(state.selection[field]));
  }

  function resolveAnswer() {
    state.checkTimer = null;
    if (!state.question) return;

    const required = getEvaluationFields();
    state.wrongFields = required.filter(
      (field) => state.selection[field] !== state.question[field]
    );

    const test = currentTest();
    if (test.active) {
      const correct = state.wrongFields.length === 0;
      test.answered += 1;
      if (correct) test.correct += 1;
      test.records.push({
        sourceCell: state.question.sourceCell,
        correct,
        wrongFields: [...state.wrongFields]
      });

      if (test.answered >= test.total) {
        test.completed = true;
        state.phase = "test-complete";
        render();
        showTestResult();
      } else {
        state.phase = "recorded";
        render();
      }
      return;
    }

    state.phase = "resolved";
    render();
    renderFeedback();
  }

  function fieldDisplayName(field) {
    return fieldConfig[state.mode][field].title;
  }

  function renderFeedback() {
    const correct = state.wrongFields.length === 0;
    refs.feedback.hidden = false;
    refs.feedback.classList.toggle("is-wrong", !correct);
    refs.feedbackIcon.textContent = correct ? "✓" : "×";
    refs.feedbackKicker.textContent = correct ? "ALL MATCHED · 座標一致" : "COORDINATE CHECK · 座標覈對";
    refs.feedbackTitle.textContent = correct
      ? "回答正確"
      : `有 ${state.wrongFields.length} 項需要調整`;
    refs.feedbackSummary.textContent = correct
      ? `正確座標：${getAnswerText()}。`
      : `正確答案：${getAnswerText()}。紅色項目是本次判斷錯誤的維度。`;

    const details = getEvaluationFields().map((field) => {
      const wrong = state.wrongFields.includes(field);
      const correctValue = state.question[field];
      const selectedValue = state.selection[field];
      const text = wrong
        ? `${fieldDisplayName(field)}應爲「${correctValue}」，你選了「${selectedValue}」`
        : `${fieldDisplayName(field)}「${correctValue}」`;
      return `
        <span class="detail-chip${wrong ? " is-wrong" : ""}">
          <span class="detail-symbol" aria-hidden="true">${wrong ? "×" : "✓"}</span>
          <span>${text}</span>
        </span>
      `;
    });

    if (isCentralAnswer()) {
      details.push(
        '<span class="detail-chip is-neutral"><span class="detail-symbol" aria-hidden="true">–</span><span>圓展脣：央元音無需選擇</span></span>'
      );
    } else if (isCentralSelection()) {
      details.push(
        `<span class="detail-chip is-neutral"><span class="detail-symbol" aria-hidden="true">–</span><span>圓展脣正確答案「${state.question.lipShape}」，本次按央元音流程跳過</span></span>`
      );
    }

    refs.feedbackDetails.innerHTML = details.join("");
    refs.next.focus({ preventScroll: true });
    refs.feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function tableIpaCellMarkup(mode, sourceCell, value, ariaLabel) {
    if (!value) {
      return `<td class="ipa-cell is-empty" aria-label="${ariaLabel}"></td>`;
    }

    const entry = findEntry(mode, sourceCell);
    const audioPath = entry ? getAudioPath(entry, mode) : "";

    if (!audioPath) {
      return `
        <td class="ipa-cell">
          <span class="table-ipa-unavailable" aria-label="${ariaLabel}，暫無發音" title="暫無發音">
            <span>${value}</span>
            <i class="table-audio-icon" data-lucide="volume-x" aria-hidden="true"></i>
          </span>
        </td>
      `;
    }

    return `
      <td class="ipa-cell">
        <button
          class="table-ipa-button"
          type="button"
          data-audio-path="${audioPath}"
          data-symbol="${value}"
          aria-label="播放 ${value} 的發音"
          title="點擊播放 ${value}"
        >
          <span>${value}</span>
          <i class="table-audio-icon" data-lucide="volume-2" aria-hidden="true"></i>
        </button>
      </td>
    `;
  }

  function tableLegendMarkup() {
    return `
      <span><i class="legend-dot"></i>IPA 音標</span>
      <span class="legend-volume"><i data-lucide="volume-2" aria-hidden="true"></i>點擊發音</span>
      <span class="legend-muted"><i data-lucide="volume-x" aria-hidden="true"></i>無發音</span>
      <span><i class="legend-dot is-empty"></i>原表空白</span>
    `;
  }

  function stopTableAudio() {
    if (currentTableAudio) {
      currentTableAudio.pause();
      currentTableAudio.currentTime = 0;
      currentTableAudio.removeAttribute("src");
      currentTableAudio.load();
    }
    currentTableAudio = null;
    if (currentTableButton) {
      currentTableButton.classList.remove("is-playing");
      currentTableButton.removeAttribute("aria-busy");
    }
    currentTableButton = null;
  }

  function playTableAudio(button, audioPath, symbol) {
    stopPronunciation();
    stopTableAudio();

    const audio = new Audio(audioPath);
    currentTableAudio = audio;
    currentTableButton = button;
    audio.preload = state.cacheEnabled ? "auto" : "none";

    button.classList.add("is-playing");
    button.setAttribute("aria-busy", "true");
    refs.tableAudioStatus.textContent = `正在播放 ${symbol} 的發音。`;

    const finishPlayback = () => {
      if (currentTableAudio !== audio) return;
      currentTableAudio = null;
      button.classList.remove("is-playing");
      button.removeAttribute("aria-busy");
      if (currentTableButton === button) currentTableButton = null;
      refs.tableAudioStatus.textContent = `${symbol} 的發音播放完成。`;
    };

    const failPlayback = () => {
      if (currentTableAudio !== audio) return;
      currentTableAudio = null;
      button.classList.remove("is-playing");
      button.removeAttribute("aria-busy");
      button.disabled = true;
      if (currentTableButton === button) currentTableButton = null;
      refs.tableAudioStatus.textContent = `${symbol} 的音頻無法播放。`;
    };

    audio.addEventListener("ended", finishPlayback, { once: true });
    audio.addEventListener("error", failPlayback, { once: true });
    audio.play().catch(failPlayback);
  }

  function handleTableAudioClick(event) {
    const button = event.target.closest(".table-ipa-button");
    if (!button || button.disabled) return;
    playTableAudio(button, button.dataset.audioPath, button.dataset.symbol);
  }

  function renderVowelTable() {
    const mode = "vowels";
    const headings = data.vowels.positions.map(data.toTraditional);
    const rowLabels = data.vowels.body.map((row) => data.toTraditional(row[0]));
    const body = data.vowels.body.map((row, rowIndex) => {
      const height = data.toTraditional(row[0]);
      const labels = [
        ["前", "展脣"],
        ["前", "圓脣"],
        ["央", ""],
        ["後", "展脣"],
        ["後", "圓脣"]
      ];

      return `
        <tr>
          <th scope="row">${height}</th>
          ${row.slice(1).map((cell, index) => {
            const value = cell === null ? "" : String(cell).trim();
            const aria = value
              ? `${labels[index][0]}${labels[index][1] ? ` ${labels[index][1]}` : ""}，${height}，${value}`
              : `${labels[index][0]}${labels[index][1] ? ` ${labels[index][1]}` : ""}，${height}，空白`;
            const sourceCell = `${String.fromCharCode(66 + index)}${rowIndex + 3}`;
            return tableIpaCellMarkup(mode, sourceCell, value, aria);
          }).join("")}
        </tr>
      `;
    }).join("");

    refs.tableContent.innerHTML = `
      <div class="table-caption">
        <div>
          <h3>元音表</h3>
          <p>${data.vowels.sheetName} · ${rowLabels.length} 個音調高度</p>
        </div>
        <div class="table-legend">
          ${tableLegendMarkup()}
        </div>
      </div>
      <div class="ipa-table-wrap">
        <table class="ipa-table vowel-table">
          <caption class="visually-hidden">元音表</caption>
          <thead>
            <tr>
              <th class="table-corner" rowspan="2" scope="col">音調高低</th>
              <th colspan="2" scope="colgroup">${headings[0]}</th>
              <th rowspan="2" scope="col">${headings[1]}</th>
              <th colspan="2" scope="colgroup">${headings[2]}</th>
            </tr>
            <tr>
              <th scope="col">展脣</th>
              <th scope="col">圓脣</th>
              <th scope="col">展脣</th>
              <th scope="col">圓脣</th>
            </tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
    refs.tableMeta.textContent = `${data.vowels.entries.length} 個音標 · 5 個音調高度`;
  }

  function renderConsonantTable() {
    const mode = "consonants";
    const places = data.consonants.places.map(data.toTraditional);
    const body = data.consonants.body.map((row, rowIndex) => {
      const manner = data.toTraditional(row[0]);
      return `
        <tr>
          <th scope="row">${manner}</th>
          ${row.slice(1).map((cell, index) => {
            const value = cell === null ? "" : String(cell).trim();
            const aria = value ? `${places[index]}，${manner}，${value}` : `${places[index]}，${manner}，空白`;
            const sourceCell = `${String.fromCharCode(66 + index)}${rowIndex + 2}`;
            return tableIpaCellMarkup(mode, sourceCell, value, aria);
          }).join("")}
        </tr>
      `;
    }).join("");

    refs.tableContent.innerHTML = `
      <div class="table-caption">
        <div>
          <h3>輔音表</h3>
          <p>${data.consonants.sheetName} · ${places.length} 個發音部位</p>
        </div>
        <div class="table-legend">
          ${tableLegendMarkup()}
        </div>
      </div>
      <div class="ipa-table-wrap">
        <table class="ipa-table consonant-table">
          <caption class="visually-hidden">輔音表</caption>
          <thead>
            <tr>
              <th class="table-corner" scope="col">${data.consonants.cornerLabel}</th>
              ${places.map((place) => `<th scope="col">${place}</th>`).join("")}
            </tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
    refs.tableMeta.textContent = `${data.consonants.entries.length} 個音標 · ${places.length} 個發音部位`;
  }

  function renderActiveTable() {
    stopTableAudio();
    if (state.activeTable === "vowels") {
      renderVowelTable();
    } else {
      renderConsonantTable();
    }

    refs.tableTabs.forEach((tab) => {
      const active = tab.dataset.table === state.activeTable;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function openTableDialog() {
    stopPronunciation();
    stopTableAudio();
    state.activeTable = "vowels";
    renderActiveTable();
    document.body.classList.add("modal-open");
    if (typeof refs.tableDialog.showModal === "function") {
      refs.tableDialog.showModal();
    } else {
      refs.tableDialog.setAttribute("open", "");
    }
    refs.closeTables.focus();
  }

  function closeTableDialog() {
    stopTableAudio();
    if (typeof refs.tableDialog.close === "function") {
      refs.tableDialog.close();
    } else {
      refs.tableDialog.removeAttribute("open");
    }
    document.body.classList.remove("modal-open");
  }

  function goToNextTestQuestion() {
    const test = currentTest();
    if (!test.active || test.completed || state.phase !== "recorded") return;
    if (test.answered >= test.total) return;
    startQuestion();
  }

  function handlePronunciationClick() {
    const audioPath = refs.pronunciationButton.dataset.audioPath;
    if (refs.pronunciationButton.disabled || !audioPath) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    const symbol = state.question.ipa;
    const audio = new Audio(audioPath);
    currentAudio = audio;
    currentAudioPath = audioPath;
    audio.preload = state.cacheEnabled ? "auto" : "none";

    refs.pronunciationButton.classList.add("is-playing");
    refs.pronunciationButton.setAttribute("aria-busy", "true");
    refs.pronunciationLabel.textContent = "播放中";
    refs.pronunciationButton.setAttribute("aria-label", `正在播放 ${symbol} 的發音`);
    refs.pronunciationStatus.textContent = `正在播放 ${symbol} 的發音。`;

    const finishPlayback = () => {
      if (currentAudio !== audio) return;
      currentAudio = null;
      currentAudioPath = "";
      refs.pronunciationButton.classList.remove("is-playing");
      refs.pronunciationButton.setAttribute("aria-busy", "false");
      refs.pronunciationLabel.textContent = "播放發音";
      refs.pronunciationButton.setAttribute("aria-label", `播放 ${symbol} 的發音`);
      refs.pronunciationStatus.textContent = `${symbol} 的發音播放完成。`;
    };

    const failPlayback = () => {
      if (currentAudio !== audio) return;
      currentAudio = null;
      currentAudioPath = "";
      refs.pronunciationButton.classList.remove("is-playing");
      refs.pronunciationButton.removeAttribute("aria-busy");
      refs.pronunciationButton.disabled = true;
      refs.pronunciationLabel.textContent = "暫不可用";
      refs.pronunciationButton.setAttribute("aria-label", `${symbol} 的音頻無法播放`);
      refs.pronunciationStatus.textContent = `${symbol} 的音頻無法播放，請檢查音頻文件。`;
    };

    audio.addEventListener("ended", finishPlayback, { once: true });
    audio.addEventListener("error", failPlayback, { once: true });
    audio.play().catch(failPlayback);
  }

  function bindEvents() {
    refs.modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    refs.form.addEventListener("click", handleOptionClick);
    refs.shuffle.addEventListener("click", () => {
      if (!currentTest().active) startQuestion();
    });
    refs.next.addEventListener("click", () => startQuestion());
    refs.testNext.addEventListener("click", goToNextTestQuestion);
    refs.selfTestToggle.addEventListener("click", () => {
      if (currentTest().active) {
        exitSelfTest();
      } else {
        startSelfTest();
      }
    });
    refs.exitTest.addEventListener("click", exitSelfTest);
    refs.retryTest.addEventListener("click", startSelfTest);
    refs.backToTraining.addEventListener("click", exitSelfTest);
    refs.starCurrent.addEventListener("click", toggleCurrentStar);
    refs.starResult.addEventListener("click", toggleCurrentStar);
    refs.pronunciationButton.addEventListener("click", handlePronunciationClick);
    refs.openStarred.addEventListener("click", openStarredDialog);
    refs.closeStarred.addEventListener("click", closeStarredDialog);
    refs.starDialog.addEventListener("close", () => {
      if (!refs.tableDialog.open) {
        document.body.classList.remove("modal-open");
      }
    });
    refs.starDialog.addEventListener("click", (event) => {
      if (event.target === refs.starDialog) closeStarredDialog();
    });
    refs.starFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.starFilter = button.dataset.starFilter;
        renderStarredContent();
      });
    });
    refs.starredContent.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-star-action]");
      if (!actionButton) return;
      const { mode, cell } = actionButton.dataset;
      if (actionButton.dataset.starAction === "practice") {
        practiceStar(mode, cell);
      } else if (actionButton.dataset.starAction === "remove") {
        removeStar(mode, cell);
      }
    });

    refs.openTables.addEventListener("click", openTableDialog);
    refs.closeTables.addEventListener("click", closeTableDialog);
    refs.tableDialog.addEventListener("close", () => {
      stopTableAudio();
      document.body.classList.remove("modal-open");
    });
    refs.tableDialog.addEventListener("click", (event) => {
      if (event.target === refs.tableDialog) closeTableDialog();
    });
    refs.tableContent.addEventListener("click", handleTableAudioClick);

    refs.tableTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        state.activeTable = tab.dataset.table;
        renderActiveTable();
      });
    });
  }

  function init() {
    if (!document.querySelector("#ipa-glyph")) return;
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
    state.stars = loadStars();
    initIpaCacheControl();
    initIpaSettings();
    configureMode();
    bindEvents();
    startQuestion();
  }

  init();
})();
