const STORAGE_KEYS = {
  progress: "kaspiankoder-progress",
  customCharacter: "kaspiankoder-custom-character",
  latestGame: "kaspiankoder-latest-game",
  parentChecklist: "kaspiankoder-parent-checklist",
};

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuHomeButton = document.querySelector(".menu-home-button");
const views = document.querySelectorAll("[data-view]");

let audioContext;

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can be unavailable in private browsing. The app still works.
  }
}

const progress = readStorage(STORAGE_KEYS.progress, {
  visited: {},
  completed: {},
});

function saveProgress() {
  writeStorage(STORAGE_KEYS.progress, progress);
  renderProgressStars();
}

function markVisited(moduleId) {
  if (!moduleId.startsWith("module-")) {
    return;
  }

  progress.visited[moduleId] = true;
  saveProgress();
}

function markComplete(moduleId) {
  progress.visited[moduleId] = true;
  progress.completed[moduleId] = true;
  saveProgress();
}

function resetProgress() {
  progress.visited = {};
  progress.completed = {};
  saveProgress();
}

function renderProgressStars() {
  document.querySelectorAll("[data-progress-star]").forEach((star) => {
    star.textContent = progress.completed[star.dataset.progressStar] ? "⭐" : "";
  });
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function unlockAudio() {
  const context = getAudioContext();

  if (!context) {
    return null;
  }

  if (context.state === "suspended") {
    const resumeAudio = context.resume();

    if (resumeAudio && typeof resumeAudio.catch === "function") {
      resumeAudio.catch(() => {});
    }
  }

  return context;
}

function playTone({ frequency, duration, type = "sine", start = 0, volume = 0.16, endFrequency }) {
  const context = unlockAudio();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime + start;
  const end = now + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);

  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, end);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(end + 0.02);
}

function playRobotSound() {
  playTone({ frequency: 420, duration: 0.12, type: "square", volume: 0.1 });
  playTone({ frequency: 640, duration: 0.14, type: "square", start: 0.12, volume: 0.1 });
  playTone({ frequency: 520, duration: 0.12, type: "square", start: 0.27, volume: 0.1 });
}

function playCatSound() {
  playTone({ frequency: 760, endFrequency: 520, duration: 0.38, type: "triangle", volume: 0.13 });
}

function playCarSound() {
  playTone({ frequency: 230, duration: 0.16, type: "square", volume: 0.12 });
  playTone({ frequency: 230, duration: 0.18, type: "square", start: 0.22, volume: 0.12 });
}

function playDinoSound() {
  playTone({ frequency: 110, endFrequency: 64, duration: 0.52, type: "sawtooth", volume: 0.15 });
}

function playHappySound() {
  playTone({ frequency: 523, duration: 0.11, type: "triangle", volume: 0.12 });
  playTone({ frequency: 659, duration: 0.11, type: "triangle", start: 0.11, volume: 0.12 });
  playTone({ frequency: 784, duration: 0.18, type: "triangle", start: 0.22, volume: 0.12 });
}

function playAddCommandSound() {
  playTone({ frequency: 620, duration: 0.08, type: "triangle", volume: 0.1 });
  playTone({ frequency: 780, duration: 0.1, type: "triangle", start: 0.08, volume: 0.1 });
}

function playRunSound() {
  playTone({ frequency: 392, duration: 0.1, type: "square", volume: 0.09 });
  playTone({ frequency: 523, duration: 0.12, type: "square", start: 0.1, volume: 0.09 });
}

function playFinishSound() {
  playTone({ frequency: 523, duration: 0.1, type: "triangle", volume: 0.12 });
  playTone({ frequency: 659, duration: 0.1, type: "triangle", start: 0.1, volume: 0.12 });
  playTone({ frequency: 784, duration: 0.1, type: "triangle", start: 0.2, volume: 0.12 });
  playTone({ frequency: 1047, duration: 0.18, type: "triangle", start: 0.32, volume: 0.1 });
}

function playErrorSound() {
  playTone({ frequency: 196, duration: 0.1, type: "sawtooth", volume: 0.08 });
  playTone({ frequency: 164, duration: 0.14, type: "sawtooth", start: 0.1, volume: 0.07 });
}

function playFullSound() {
  playTone({ frequency: 170, duration: 0.09, type: "sawtooth", volume: 0.08 });
  playTone({ frequency: 140, duration: 0.12, type: "sawtooth", start: 0.1, volume: 0.07 });
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function moveDelay() {
  return reducedMotionQuery.matches ? 130 : 360;
}

function restartAnimation(element, className) {
  if (!element || reducedMotionQuery.matches) {
    return;
  }

  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (match) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[match];
  });
}

function samePosition(a, b) {
  return a.x === b.x && a.y === b.y;
}

function clampPosition(position, size) {
  return {
    x: Math.max(0, Math.min(size - 1, position.x)),
    y: Math.max(0, Math.min(size - 1, position.y)),
  };
}

const directions = {
  up: { icon: "⬆️", label: "Opp", dx: 0, dy: -1 },
  down: { icon: "⬇️", label: "Ned", dx: 0, dy: 1 },
  left: { icon: "⬅️", label: "Venstre", dx: -1, dy: 0 },
  right: { icon: "➡️", label: "Høyre", dx: 1, dy: 0 },
};

function moveByDirection(position, command, size) {
  const direction = directions[command];

  if (!direction) {
    return { ...position };
  }

  return clampPosition(
    {
      x: position.x + direction.dx,
      y: position.y + direction.dy,
    },
    size,
  );
}

function renderGrid({ size, actorPosition, goalPosition, actor = "🤖", goal = "⭐", obstaclePosition, obstacle = "🪨", tapMode }) {
  const cells = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const position = { x, y };
      const tag = tapMode ? "button" : "div";
      const tapAttributes = tapMode ? `type="button" data-grid-x="${x}" data-grid-y="${y}"` : "";
      const content = [
        samePosition(position, goalPosition) ? `<span class="grid-goal">${goal}</span>` : "",
        obstaclePosition && samePosition(position, obstaclePosition) ? `<span class="grid-obstacle">${obstacle}</span>` : "",
        samePosition(position, actorPosition) ? `<span class="grid-actor">${actor}</span>` : "",
      ].join("");

      cells.push(`
        <${tag}
          class="grid-cell"
          ${tapAttributes}
          aria-label="Rute ${x + 1}, ${y + 1}"
        >${content}</${tag}>
      `);
    }
  }

  return `<div class="grid-scene ${tapMode ? "is-tappable" : ""}" style="--grid-size: ${size}">${cells.join("")}</div>`;
}

function renderCommandRow(commands, commandMap, activeIndex = -1, removable = false) {
  if (commands.length === 0) {
    return `<div class="command-row empty-row"><span>Tom rekke</span></div>`;
  }

  return `
    <div class="command-row">
      ${commands
        .map((command, index) => {
          const item = commandMap[command];
          return `
            <button
              class="mini-command ${index === activeIndex ? "is-active" : ""}"
              type="button"
              data-remove-command="${removable ? index : ""}"
              aria-label="${removable ? "Fjern " : ""}${item.label}"
              ${removable ? "" : "tabindex=\"-1\""}
            >
              <span aria-hidden="true">${item.icon}</span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPalette(commandMap, prefix = "add-command", disabled = false) {
  return `
    <div class="visual-palette">
      ${Object.entries(commandMap)
        .map(([key, command]) => `
          <button
            class="visual-button"
            type="button"
            data-${prefix}="${key}"
            aria-label="${command.label}"
            ${disabled ? "disabled" : ""}
          >
            <span class="visual-icon" aria-hidden="true">${command.icon}</span>
            <span>${command.label}</span>
          </button>
        `)
        .join("")}
    </div>
  `;
}

function openView(viewName) {
  views.forEach((view) => {
    const isActive = view.dataset.view === viewName;
    view.hidden = !isActive;
    view.classList.toggle("is-active", isActive);
  });

  if (menuHomeButton) {
    menuHomeButton.hidden = viewName === "menu";
  }

  markVisited(viewName);
  window.scrollTo(0, 0);

  if (viewName === "module-1") {
    resetModuleOneScene();
  }
}

// Module 0
const characters = {
  robot: { message: "Hei! Jeg er roboten!", animationClass: "animate-robot", sound: playRobotSound },
  cat: { message: "Mjau!", animationClass: "animate-cat", sound: playCatSound },
  car: { message: "Tut tut!", animationClass: "animate-car", sound: playCarSound },
  dino: { message: "Brøl!", animationClass: "animate-dino", sound: playDinoSound },
};

const speechBubble = document.querySelector("#speechBubble");
const speechText = document.querySelector("#speechText");
const cards = document.querySelectorAll("[data-character]");
const resetButton = document.querySelector("#resetButton");
const adultToggle = document.querySelector("#adultToggle");
const adultInfo = document.querySelector("#adultInfo");

function showMessage(message) {
  speechText.textContent = message;
  restartAnimation(speechBubble, "pop");
}

function clearCharacterAnimations() {
  cards.forEach((card) => {
    Object.values(characters).forEach((character) => {
      card.classList.remove(character.animationClass);
    });
    card.classList.remove("wiggle");
  });
}

function handleCharacterPress(event) {
  const card = event.currentTarget;
  const character = characters[card.dataset.character];

  if (!character) {
    return;
  }

  clearCharacterAnimations();
  showMessage(character.message);
  restartAnimation(card, character.animationClass);
  character.sound();
  markComplete("module-0");
}

function resetModule() {
  speechText.textContent = "Velg en figur!";
  playHappySound();
  clearCharacterAnimations();
  cards.forEach((card) => restartAnimation(card, "wiggle"));
}

function toggleAdultInfo() {
  const shouldShow = adultInfo.hidden;
  adultInfo.hidden = !shouldShow;
  adultToggle.setAttribute("aria-expanded", String(shouldShow));
}

// Module 1
const commandSlots = document.querySelector("#commandSlots");
const commandButtons = document.querySelectorAll("[data-command]");
const runCommandsButton = document.querySelector("#runCommands");
const clearCommandsButton = document.querySelector("#clearCommands");
const stageTrack = document.querySelector(".stage-track");
const robotActor = document.querySelector("#robotActor");
const moduleOneSpeech = document.querySelector("#moduleOneSpeech");
const moduleOneSpeechText = document.querySelector("#moduleOneSpeechText");
const sparkles = document.querySelector("#sparkles");

let commandQueue = [];
let isProgramRunning = false;
let robotWalkSteps = 0;
const maxCommands = 3;

const moduleOneCommands = {
  walk: { icon: "➡️", label: "Gå", chipClass: "walk-chip", action: performWalk },
  jump: { icon: "🦘", label: "Hopp", chipClass: "jump-chip", action: performJump },
  hello: { icon: "💬", label: "Hei", chipClass: "hello-chip", action: performHello },
  sparkle: { icon: "⭐", label: "Glitre", chipClass: "sparkle-chip", action: performSparkle },
};

function renderCommandSlots(activeIndex = -1) {
  const slots = commandSlots.querySelectorAll("[data-slot]");

  slots.forEach((slot, index) => {
    const command = moduleOneCommands[commandQueue[index]];
    slot.classList.toggle("is-filled", Boolean(command));
    slot.classList.toggle("is-active", index === activeIndex);

    if (!command) {
      slot.setAttribute("aria-label", `Tom plass ${index + 1}`);
      slot.innerHTML = `<span class="slot-placeholder" aria-hidden="true">${index + 1}</span>`;
      return;
    }

    slot.setAttribute("aria-label", `Plass ${index + 1}: ${command.label}`);
    slot.innerHTML = `
      <span class="command-chip ${command.chipClass}" aria-hidden="true">
        <span class="command-chip-icon">${command.icon}</span>
        <span class="command-chip-label">${command.label}</span>
      </span>
    `;
  });

  runCommandsButton.disabled = isProgramRunning || commandQueue.length === 0;
  clearCommandsButton.disabled = isProgramRunning;
  commandButtons.forEach((button) => {
    button.disabled = isProgramRunning;
  });
}

function resetModuleOneScene() {
  robotWalkSteps = 0;
  robotActor.style.setProperty("--robot-x", "0px");
  sparkles.style.setProperty("--robot-x", "0px");
  robotActor.classList.remove("is-jumping", "is-waving");
  sparkles.classList.remove("is-visible");
  moduleOneSpeech.hidden = true;
  moduleOneSpeechText.textContent = "Hei!";
  renderCommandSlots();
}

function clearModuleOne() {
  commandQueue = [];
  resetModuleOneScene();
}

function showModuleOneSpeech(message) {
  moduleOneSpeechText.textContent = message;
  moduleOneSpeech.hidden = false;
}

function addCommand(commandKey) {
  if (isProgramRunning || !moduleOneCommands[commandKey]) {
    return;
  }

  if (commandQueue.length >= maxCommands) {
    playFullSound();
    restartAnimation(commandSlots, "is-full");
    return;
  }

  commandQueue.push(commandKey);
  playAddCommandSound();
  renderCommandSlots();
}

function getWalkDistance() {
  const availableWidth = stageTrack.clientWidth - robotActor.offsetWidth - 8;
  return Math.max(34, Math.min(70, Math.floor(availableWidth / maxCommands)));
}

async function performWalk() {
  robotWalkSteps += 1;
  const robotX = `${robotWalkSteps * getWalkDistance()}px`;
  robotActor.style.setProperty("--robot-x", robotX);
  sparkles.style.setProperty("--robot-x", robotX);
  await wait(reducedMotionQuery.matches ? 180 : 650);
}

async function performJump() {
  restartAnimation(robotActor, "is-jumping");
  await wait(reducedMotionQuery.matches ? 180 : 760);
  robotActor.classList.remove("is-jumping");
}

async function performHello() {
  showModuleOneSpeech("Hei!");
  restartAnimation(robotActor, "is-waving");
  await wait(reducedMotionQuery.matches ? 180 : 860);
  robotActor.classList.remove("is-waving");
}

async function performSparkle() {
  sparkles.classList.remove("is-visible");
  void sparkles.offsetWidth;
  sparkles.classList.add("is-visible");
  await wait(reducedMotionQuery.matches ? 180 : 820);
}

async function runModuleOneProgram() {
  if (isProgramRunning || commandQueue.length === 0) {
    return;
  }

  isProgramRunning = true;
  playRunSound();
  resetModuleOneScene();
  renderCommandSlots();
  await wait(reducedMotionQuery.matches ? 80 : 420);

  for (const [index, commandKey] of commandQueue.entries()) {
    renderCommandSlots(index);
    await moduleOneCommands[commandKey].action();
    await wait(reducedMotionQuery.matches ? 80 : 520);
  }

  renderCommandSlots();
  showModuleOneSpeech("Bra!");
  playFinishSound();
  markComplete("module-1");
  isProgramRunning = false;
  renderCommandSlots();
}

// Module 2
const moduleTwoRoot = document.querySelector("#moduleTwoRoot");
const moduleTwoLevels = [
  { start: { x: 0, y: 2 }, goal: { x: 2, y: 2 }, size: 5 },
  { start: { x: 0, y: 0 }, goal: { x: 1, y: 1 }, size: 5 },
  { start: { x: 1, y: 3 }, goal: { x: 3, y: 1 }, size: 5 },
];
const moduleTwoState = { level: 0, commands: [], position: { ...moduleTwoLevels[0].start }, running: false, message: "Lag vei med piler." };

function renderModuleTwo(activeIndex = -1) {
  const level = moduleTwoLevels[moduleTwoState.level];
  moduleTwoRoot.innerHTML = `
    <section class="game-panel">
      <p class="big-feedback">${moduleTwoState.message}</p>
      ${renderGrid({ size: level.size, actorPosition: moduleTwoState.position, goalPosition: level.goal })}
      ${renderCommandRow(moduleTwoState.commands, directions, activeIndex)}
      ${renderPalette(directions, "m2-add", moduleTwoState.running)}
      <div class="run-controls compact-controls">
        <button class="run-button" type="button" data-m2-run aria-label="Kjør piler" ${moduleTwoState.running || !moduleTwoState.commands.length ? "disabled" : ""}>▶ Kjør</button>
        <button class="clear-button" type="button" data-m2-clear aria-label="Tøm piler" ${moduleTwoState.running ? "disabled" : ""}>↩ Tøm</button>
        <button class="clear-button" type="button" data-m2-new aria-label="Ny bane" ${moduleTwoState.running ? "disabled" : ""}>🔄 Ny bane</button>
      </div>
    </section>
  `;
}

async function runModuleTwo() {
  if (moduleTwoState.running || moduleTwoState.commands.length === 0) {
    return;
  }

  const level = moduleTwoLevels[moduleTwoState.level];
  moduleTwoState.running = true;
  moduleTwoState.position = { ...level.start };
  moduleTwoState.message = "Roboten går!";
  playRunSound();
  renderModuleTwo();

  for (let index = 0; index < moduleTwoState.commands.length; index += 1) {
    renderModuleTwo(index);
    moduleTwoState.position = moveByDirection(moduleTwoState.position, moduleTwoState.commands[index], level.size);
    playAddCommandSound();
    await wait(moveDelay());
  }

  const foundStar = samePosition(moduleTwoState.position, level.goal);
  moduleTwoState.message = foundStar ? "Du fant stjerna!" : "Prøv en annen vei!";
  moduleTwoState.running = false;
  foundStar ? playFinishSound() : playErrorSound();

  if (foundStar) {
    markComplete("module-2");
  }

  renderModuleTwo();
}

moduleTwoRoot.onclick = (event) => {
  const addButton = event.target.closest("[data-m2-add]");

  if (addButton && !moduleTwoState.running && moduleTwoState.commands.length < 8) {
    moduleTwoState.commands.push(addButton.dataset.m2Add);
    moduleTwoState.message = "Trykk Kjør!";
    playAddCommandSound();
    renderModuleTwo();
    return;
  }

  if (event.target.closest("[data-m2-run]")) {
    runModuleTwo();
    return;
  }

  if (event.target.closest("[data-m2-clear]")) {
    moduleTwoState.commands = [];
    moduleTwoState.position = { ...moduleTwoLevels[moduleTwoState.level].start };
    moduleTwoState.message = "Lag vei med piler.";
    renderModuleTwo();
    return;
  }

  if (event.target.closest("[data-m2-new]")) {
    moduleTwoState.level = (moduleTwoState.level + 1) % moduleTwoLevels.length;
    moduleTwoState.commands = [];
    moduleTwoState.position = { ...moduleTwoLevels[moduleTwoState.level].start };
    moduleTwoState.message = "Ny stjerne!";
    playHappySound();
    renderModuleTwo();
  }
};

// Module 3
const moduleThreeRoot = document.querySelector("#moduleThreeRoot");
const bugLevels = [
  { start: { x: 0, y: 1 }, goal: { x: 2, y: 1 }, size: 4, commands: ["right"], hint: "Roboten stopper litt tidlig." },
  { start: { x: 0, y: 0 }, goal: { x: 1, y: 1 }, size: 4, commands: ["left", "down"], hint: "En pil peker feil vei." },
  { start: { x: 1, y: 3 }, goal: { x: 2, y: 1 }, size: 4, commands: ["right", "right", "up"], hint: "Det er nesten riktig." },
];
const bugState = { level: 0, commands: [...bugLevels[0].commands], position: { ...bugLevels[0].start }, running: false, message: "Trykk en feil pil bort." };

function renderModuleThree(activeIndex = -1, bugWiggle = false) {
  const level = bugLevels[bugState.level];
  moduleThreeRoot.innerHTML = `
    <section class="game-panel ${bugWiggle ? "bug-shake" : ""}">
      <p class="big-feedback"><span aria-hidden="true">🐞</span> ${bugState.message}</p>
      <p class="small-help">${level.hint}</p>
      ${renderGrid({ size: level.size, actorPosition: bugState.position, goalPosition: level.goal })}
      ${renderCommandRow(bugState.commands, directions, activeIndex, true)}
      ${renderPalette(directions, "m3-add", bugState.running)}
      <div class="run-controls compact-controls">
        <button class="run-button" type="button" data-m3-run aria-label="Kjør feilsøk" ${bugState.running || !bugState.commands.length ? "disabled" : ""}>▶ Kjør</button>
        <button class="clear-button" type="button" data-m3-new aria-label="Ny feil" ${bugState.running ? "disabled" : ""}>🐞 Ny feil</button>
      </div>
    </section>
  `;
}

async function runModuleThree() {
  if (bugState.running || bugState.commands.length === 0) {
    return;
  }

  const level = bugLevels[bugState.level];
  bugState.running = true;
  bugState.position = { ...level.start };
  bugState.message = "Tester feilen...";
  playRunSound();
  renderModuleThree();

  for (let index = 0; index < bugState.commands.length; index += 1) {
    renderModuleThree(index);
    bugState.position = moveByDirection(bugState.position, bugState.commands[index], level.size);
    await wait(moveDelay());
  }

  const fixed = samePosition(bugState.position, level.goal);
  bugState.message = fixed ? "Du fikset feilen!" : "Nesten! Prøv igjen!";
  bugState.running = false;
  fixed ? playFinishSound() : playErrorSound();

  if (fixed) {
    markComplete("module-3");
  }

  renderModuleThree(-1, !fixed);
};

moduleThreeRoot.onclick = (event) => {
  const removeButton = event.target.closest("[data-remove-command]");
  const addButton = event.target.closest("[data-m3-add]");

  if (removeButton && removeButton.dataset.removeCommand !== "" && !bugState.running) {
    bugState.commands.splice(Number(removeButton.dataset.removeCommand), 1);
    bugState.message = "Legg inn en ny pil.";
    playAddCommandSound();
    renderModuleThree();
    return;
  }

  if (addButton && !bugState.running && bugState.commands.length < 4) {
    bugState.commands.push(addButton.dataset.m3Add);
    bugState.message = "Test rekka!";
    playAddCommandSound();
    renderModuleThree();
    return;
  }

  if (event.target.closest("[data-m3-run]")) {
    runModuleThree();
    return;
  }

  if (event.target.closest("[data-m3-new]")) {
    bugState.level = (bugState.level + 1) % bugLevels.length;
    bugState.commands = [...bugLevels[bugState.level].commands];
    bugState.position = { ...bugLevels[bugState.level].start };
    bugState.message = "Finn feilen!";
    renderModuleThree();
  }
};

// Module 4
const moduleFourRoot = document.querySelector("#moduleFourRoot");
const loopActions = {
  walk: { icon: "➡️", label: "Gå" },
  jump: { icon: "🦘", label: "Hopp" },
  sparkle: { icon: "⭐", label: "Glitre" },
};
const loopTasks = [
  { action: "walk", count: 3, text: "Gå til stjerna.", target: "⭐" },
  { action: "jump", count: 2, text: "Hopp to ganger.", target: "🦘" },
  { action: "sparkle", count: 4, text: "Glitre fire ganger.", target: "✨" },
];
const loopState = { task: 0, action: "walk", count: 3, progress: 0, running: false, success: false, message: "Velg og kjør." };

function renderModuleFour() {
  const task = loopTasks[loopState.task];
  moduleFourRoot.innerHTML = `
    <section class="game-panel">
      <p class="big-feedback">${loopState.message}</p>
      <p class="small-help">${task.text}</p>
      <div class="loop-stage">
        <div class="loop-actor" style="--loop-x: ${loopState.action === "walk" ? loopState.progress * 42 : 0}px">🤖</div>
        <div class="loop-target">${task.target}</div>
      </div>
      <div class="loop-formula" aria-label="Gjenta kommando">
        <span aria-hidden="true">🔁</span>
        <span class="dot-row">${Array.from({ length: loopState.count }, (_, index) => `<span class="${index < loopState.progress ? "is-lit" : ""}"></span>`).join("")}</span>
        <span aria-hidden="true">×</span>
        <span aria-hidden="true">${loopActions[loopState.action].icon}</span>
      </div>
      ${renderPalette(loopActions, "m4-action", loopState.running)}
      <div class="count-buttons">
        ${[2, 3, 4].map((count) => `
          <button class="visual-button count-button ${loopState.count === count ? "is-selected" : ""}" type="button" data-m4-count="${count}" aria-label="Gjenta ${count}" ${loopState.running ? "disabled" : ""}>
            <span class="dot-row">${Array.from({ length: count }, () => "<span></span>").join("")}</span>
            <span>${count}</span>
          </button>
        `).join("")}
      </div>
      <div class="run-controls compact-controls">
        <button class="run-button" type="button" data-m4-run aria-label="Kjør gjenta" ${loopState.running ? "disabled" : ""}>▶ Kjør</button>
        <button class="clear-button" type="button" data-m4-next aria-label="Neste oppgave" ${loopState.running || !loopState.success ? "disabled" : ""}>➡ Neste</button>
      </div>
    </section>
  `;
}

async function runModuleFour() {
  if (loopState.running) {
    return;
  }

  const task = loopTasks[loopState.task];
  const isCorrect = loopState.action === task.action && loopState.count === task.count;

  if (!isCorrect) {
    loopState.message = "Prøv denne oppgaven!";
    playErrorSound();
    renderModuleFour();
    restartAnimation(moduleFourRoot.querySelector(".game-panel"), "bug-shake");
    return;
  }

  loopState.running = true;
  loopState.success = false;
  loopState.progress = 0;
  loopState.message = "Gjentar!";
  playRunSound();
  renderModuleFour();

  for (let index = 1; index <= loopState.count; index += 1) {
    loopState.progress = index;
    playAddCommandSound();
    renderModuleFour();
    await wait(moveDelay());
  }

  loopState.running = false;
  loopState.success = true;
  loopState.message = "Samme ting flere ganger!";
  playFinishSound();

  if (loopState.task === loopTasks.length - 1) {
    markComplete("module-4");
  }

  renderModuleFour();
}

moduleFourRoot.onclick = (event) => {
  const actionButton = event.target.closest("[data-m4-action]");
  const countButton = event.target.closest("[data-m4-count]");

  if (actionButton && !loopState.running) {
    loopState.action = actionButton.dataset.m4Action;
    loopState.success = false;
    loopState.message = "Velg hvor mange.";
    playAddCommandSound();
    renderModuleFour();
    return;
  }

  if (countButton && !loopState.running) {
    loopState.count = Number(countButton.dataset.m4Count);
    loopState.success = false;
    loopState.message = "Trykk Kjør.";
    playAddCommandSound();
    renderModuleFour();
    return;
  }

  if (event.target.closest("[data-m4-run]")) {
    runModuleFour();
    return;
  }

  if (event.target.closest("[data-m4-next]")) {
    loopState.task = (loopState.task + 1) % loopTasks.length;
    const task = loopTasks[loopState.task];
    loopState.action = task.action;
    loopState.count = task.count;
    loopState.progress = 0;
    loopState.success = false;
    loopState.message = "Ny gjenta-lek!";
    renderModuleFour();
  }
};

// Module 5
const moduleFiveRoot = document.querySelector("#moduleFiveRoot");
const ifScenes = [
  { actor: "🤖", object: "🪨", correct: "jump", choices: ["jump", "stop", "party"] },
  { actor: "🚗", object: "🔴", correct: "stop", choices: ["go", "stop", "party"] },
  { actor: "🦖", object: "🍕", correct: "eat", choices: ["jump", "eat", "stop"] },
];
const reactions = {
  jump: { icon: "🦘", label: "Hopp" },
  stop: { icon: "✋", label: "Stopp" },
  party: { icon: "🎉", label: "Hurra" },
  go: { icon: "➡️", label: "Gå" },
  eat: { icon: "😋", label: "Spis" },
};
const ifState = { scene: 0, message: "Hvis den ser..." };

function renderModuleFive(wrong = false) {
  const scene = ifScenes[ifState.scene];
  moduleFiveRoot.innerHTML = `
    <section class="game-panel ${wrong ? "bug-shake" : ""}">
      <p class="big-feedback">${ifState.message}</p>
      <div class="if-equation">
        <span aria-hidden="true">${scene.actor}</span>
        <span aria-hidden="true">👀</span>
        <span aria-hidden="true">${scene.object}</span>
        <span aria-hidden="true">=</span>
        <span aria-hidden="true">?</span>
      </div>
      <div class="visual-palette">
        ${scene.choices.map((choice) => `
          <button class="visual-button" type="button" data-m5-choice="${choice}" aria-label="${reactions[choice].label}">
            <span class="visual-icon" aria-hidden="true">${reactions[choice].icon}</span>
            <span>${reactions[choice].label}</span>
          </button>
        `).join("")}
      </div>
      <button class="clear-button wide-action" type="button" data-m5-next aria-label="Neste hvis">➡ Neste</button>
    </section>
  `;
}

moduleFiveRoot.onclick = (event) => {
  const choiceButton = event.target.closest("[data-m5-choice]");

  if (choiceButton) {
    const scene = ifScenes[ifState.scene];
    const isCorrect = choiceButton.dataset.m5Choice === scene.correct;
    ifState.message = isCorrect ? "Riktig! Den passet!" : "Prøv en annen!";
    isCorrect ? playFinishSound() : playErrorSound();

    if (isCorrect) {
      markComplete("module-5");
    }

    renderModuleFive(!isCorrect);
    if (isCorrect) {
      restartAnimation(moduleFiveRoot.querySelector(".if-equation"), "choice-pop");
    }
    return;
  }

  if (event.target.closest("[data-m5-next]")) {
    ifState.scene = (ifState.scene + 1) % ifScenes.length;
    ifState.message = "Hvis den ser...";
    playAddCommandSound();
    renderModuleFive();
  }
};

// Module 6
const moduleSixRoot = document.querySelector("#moduleSixRoot");
const choicePuzzles = [
  {
    scene: "🤖  🪨  ⭐",
    question: "Hva vil du gjøre først?",
    choices: [
      { icon: "🪨➡️", label: "Rundt", result: "Roboten går rundt steinen!" },
      { icon: "🦘", label: "Hopp", result: "Roboten hopper over!" },
    ],
  },
  {
    scene: "🐱  🍽️  🛏️",
    question: "Hvor går katten?",
    choices: [
      { icon: "🍽️", label: "Mat", result: "Katten fant mat først!" },
      { icon: "🛏️", label: "Seng", result: "Katten tok en hvil!" },
    ],
  },
  {
    scene: "⛵  🐟  💎",
    question: "Hva henter båten først?",
    choices: [
      { icon: "🐟", label: "Fisk", result: "Båten hentet fisk!" },
      { icon: "💎", label: "Skatt", result: "Båten hentet skatt!" },
    ],
  },
];
const chooseState = { puzzle: 0, message: "Hva vil du gjøre først?", chosen: null };

function renderModuleSix() {
  const puzzle = choicePuzzles[chooseState.puzzle];
  moduleSixRoot.innerHTML = `
    <section class="game-panel">
      <p class="big-feedback">${chooseState.chosen ? chooseState.message : puzzle.question}</p>
      <div class="choice-scene ${chooseState.chosen ? "choice-pop" : ""}" aria-hidden="true">${puzzle.scene}</div>
      <div class="visual-palette two-choice">
        ${puzzle.choices.map((choice, index) => `
          <button class="visual-button" type="button" data-m6-choice="${index}" aria-label="${choice.label}">
            <span class="visual-icon" aria-hidden="true">${choice.icon}</span>
            <span>${choice.label}</span>
          </button>
        `).join("")}
      </div>
      <div class="run-controls compact-controls">
        <button class="clear-button" type="button" data-m6-again aria-label="Prøv en annen løsning">🔄 Prøv en annen løsning</button>
        <button class="clear-button" type="button" data-m6-next aria-label="Neste valg">➡ Neste</button>
      </div>
    </section>
  `;
}

moduleSixRoot.onclick = (event) => {
  const choiceButton = event.target.closest("[data-m6-choice]");

  if (choiceButton) {
    const puzzle = choicePuzzles[chooseState.puzzle];
    const choice = puzzle.choices[Number(choiceButton.dataset.m6Choice)];
    chooseState.chosen = Number(choiceButton.dataset.m6Choice);
    chooseState.message = choice.result;
    playFinishSound();
    markComplete("module-6");
    renderModuleSix();
    return;
  }

  if (event.target.closest("[data-m6-again]")) {
    chooseState.chosen = null;
    chooseState.message = "Velg en annen vei.";
    playAddCommandSound();
    renderModuleSix();
    return;
  }

  if (event.target.closest("[data-m6-next]")) {
    chooseState.puzzle = (chooseState.puzzle + 1) % choicePuzzles.length;
    chooseState.chosen = null;
    chooseState.message = "Hva vil du gjøre først?";
    renderModuleSix();
  }
};

// Module 7
const moduleSevenRoot = document.querySelector("#moduleSevenRoot");
const patternLevels = [
  { row: ["🦘", "➡️", "🦘", "➡️"], answer: "🦘", choices: ["🦘", "⭐", "👏"] },
  { row: ["🔴", "🔵", "🔴", "🔵"], answer: "🔴", choices: ["🔴", "🟡", "🔵"] },
  { row: ["👏", "🦶", "👏", "🦶"], answer: "👏", choices: ["🦶", "👏", "⭐"] },
  { row: ["⭐", "⭐", "🦘", "⭐", "⭐", "🦘"], answer: "⭐", choices: ["🦘", "⭐", "➡️"] },
];
const patternState = { level: 0, message: "Hva kommer nå?", custom: [], running: false };

function renderModuleSeven(wrong = false) {
  const pattern = patternLevels[patternState.level];
  moduleSevenRoot.innerHTML = `
    <section class="game-panel ${wrong ? "bug-shake" : ""}">
      <p class="big-feedback">${patternState.message}</p>
      <div class="pattern-row" aria-label="Mønster">
        ${pattern.row.map((item) => `<span aria-hidden="true">${item}</span>`).join("")}
        <span class="pattern-question" aria-hidden="true">?</span>
      </div>
      <div class="visual-palette">
        ${pattern.choices.map((choice) => `
          <button class="visual-button" type="button" data-m7-answer="${choice}" aria-label="Velg ${choice}" ${patternState.running ? "disabled" : ""}>
            <span class="visual-icon" aria-hidden="true">${choice}</span>
          </button>
        `).join("")}
      </div>
      <section class="creator-panel" aria-label="Lag eget mønster">
        <p class="small-help">Lag eget mønster</p>
        <div class="pattern-row custom-pattern">${patternState.custom.map((item) => `<span aria-hidden="true">${item}</span>`).join("") || "<span>+</span>"}</div>
        <div class="visual-palette mini-palette">
          ${["🦘", "➡️", "👏", "⭐"].map((item) => `
            <button class="visual-button" type="button" data-m7-custom="${item}" aria-label="Legg til ${item}" ${patternState.running ? "disabled" : ""}>
              <span class="visual-icon" aria-hidden="true">${item}</span>
            </button>
          `).join("")}
        </div>
        <div class="run-controls compact-controls">
          <button class="run-button" type="button" data-m7-play aria-label="Spill mønster" ${patternState.running || patternState.custom.length === 0 ? "disabled" : ""}>▶ Spill</button>
          <button class="clear-button" type="button" data-m7-clear aria-label="Tøm mønster" ${patternState.running ? "disabled" : ""}>↩ Tøm</button>
        </div>
      </section>
    </section>
  `;
}

async function playCustomPattern() {
  if (patternState.running || patternState.custom.length === 0) {
    return;
  }

  patternState.running = true;
  patternState.message = "Se mønsteret!";
  renderModuleSeven();

  for (const item of patternState.custom) {
    item === "👏" ? playTone({ frequency: 420, duration: 0.08, type: "square", volume: 0.1 }) : playAddCommandSound();
    const actor = moduleSevenRoot.querySelector(".custom-pattern");
    restartAnimation(actor, "choice-pop");
    await wait(moveDelay());
  }

  markComplete("module-7");
  patternState.running = false;
  patternState.message = "Mønster spilte!";
  renderModuleSeven();
}

moduleSevenRoot.onclick = (event) => {
  const answerButton = event.target.closest("[data-m7-answer]");
  const customButton = event.target.closest("[data-m7-custom]");

  if (answerButton && !patternState.running) {
    const pattern = patternLevels[patternState.level];
    const correct = answerButton.dataset.m7Answer === pattern.answer;
    patternState.message = correct ? "Riktig mønster!" : "Prøv en annen!";
    correct ? playFinishSound() : playErrorSound();

    if (correct) {
      patternState.level = (patternState.level + 1) % patternLevels.length;
      markComplete("module-7");
    }

    renderModuleSeven(!correct);
    return;
  }

  if (customButton && !patternState.running && patternState.custom.length < 8) {
    patternState.custom.push(customButton.dataset.m7Custom);
    playAddCommandSound();
    renderModuleSeven();
    return;
  }

  if (event.target.closest("[data-m7-play]")) {
    playCustomPattern();
    return;
  }

  if (event.target.closest("[data-m7-clear]") && !patternState.running) {
    patternState.custom = [];
    renderModuleSeven();
  }
};

// Module 8
const moduleEightRoot = document.querySelector("#moduleEightRoot");
const creatorOptions = {
  type: [
    { key: "robot", icon: "🤖", label: "Robot" },
    { key: "cat", icon: "🐱", label: "Katt" },
    { key: "car", icon: "🚗", label: "Bil" },
    { key: "dino", icon: "🦖", label: "Dinosaur" },
  ],
  color: [
    { key: "red", icon: "🔴", label: "Rød", value: "#ff8a8a" },
    { key: "blue", icon: "🔵", label: "Blå", value: "#8ed8ff" },
    { key: "green", icon: "🟢", label: "Grønn", value: "#92efb4" },
    { key: "yellow", icon: "🟡", label: "Gul", value: "#ffe27a" },
  ],
  sound: [
    { key: "beep", icon: "🔊", label: "Beep", play: playRobotSound },
    { key: "meow", icon: "🐱", label: "Mjau", play: playCatSound },
    { key: "honk", icon: "📣", label: "Tut", play: playCarSound },
    { key: "roar", icon: "🦖", label: "Brøl", play: playDinoSound },
  ],
  background: [
    { key: "moon", icon: "🌕", label: "Måne" },
    { key: "forest", icon: "🌲", label: "Skog" },
    { key: "city", icon: "🏙️", label: "By" },
    { key: "jungle", icon: "🌴", label: "Jungel" },
  ],
};
const creatorState = readStorage(STORAGE_KEYS.customCharacter, {
  type: "robot",
  color: "blue",
  sound: "beep",
  background: "moon",
});
creatorState.type = creatorState.type || "robot";
creatorState.color = creatorState.color || "blue";
creatorState.sound = creatorState.sound || "beep";
creatorState.background = creatorState.background || "moon";

function optionByKey(group, key) {
  return creatorOptions[group].find((option) => option.key === key) || creatorOptions[group][0];
}

function renderChoiceGroup(title, group, selectedKey) {
  return `
    <section class="choice-group" aria-label="${title}">
      <p class="small-help">${title}</p>
      <div class="visual-palette">
        ${creatorOptions[group].map((option) => `
          <button
            class="visual-button ${selectedKey === option.key ? "is-selected" : ""}"
            type="button"
            data-m8-group="${group}"
            data-m8-value="${option.key}"
            aria-label="${option.label}"
          >
            <span class="visual-icon" aria-hidden="true">${option.icon}</span>
            <span>${option.label}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderModuleEight(message = "Velg figur.") {
  const type = optionByKey("type", creatorState.type);
  const color = optionByKey("color", creatorState.color);
  const background = optionByKey("background", creatorState.background);
  moduleEightRoot.innerHTML = `
    <section class="game-panel">
      <p class="big-feedback">${message}</p>
      <div class="character-preview bg-${background.key}" style="--preview-color: ${color.value}">
        <span class="preview-bg" aria-hidden="true">${background.icon}</span>
        <span class="preview-character" aria-hidden="true">${type.icon}</span>
      </div>
      ${renderChoiceGroup("Figur", "type", creatorState.type)}
      ${renderChoiceGroup("Farge", "color", creatorState.color)}
      ${renderChoiceGroup("Lyd", "sound", creatorState.sound)}
      ${renderChoiceGroup("Bakgrunn", "background", creatorState.background)}
      <button class="run-button wide-action" type="button" data-m8-save aria-label="Lagre figur">💾 Lagre figur</button>
    </section>
  `;
}

moduleEightRoot.onclick = (event) => {
  const optionButton = event.target.closest("[data-m8-group]");

  if (optionButton) {
    creatorState[optionButton.dataset.m8Group] = optionButton.dataset.m8Value;
    if (optionButton.dataset.m8Group === "sound") {
      optionByKey("sound", creatorState.sound).play();
    } else {
      playAddCommandSound();
    }
    renderModuleEight("Fin!");
    return;
  }

  if (event.target.closest("[data-m8-save]")) {
    writeStorage(STORAGE_KEYS.customCharacter, creatorState);
    playFinishSound();
    markComplete("module-8");
    renderModuleEight("Figuren er klar!");
  }
};

function getSavedCharacterIcon() {
  const saved = readStorage(STORAGE_KEYS.customCharacter, null);
  return saved ? optionByKey("type", saved.type).icon : null;
}

// Module 9
const moduleNineRoot = document.querySelector("#moduleNineRoot");
const gameOptions = {
  character: [
    { key: "robot", icon: "🤖", label: "Robot" },
    { key: "cat", icon: "🐱", label: "Katt" },
    { key: "car", icon: "🚗", label: "Bil" },
    { key: "dino", icon: "🦖", label: "Dinosaur" },
  ],
  goal: [
    { key: "star", icon: "⭐", label: "Stjerne" },
    { key: "fish", icon: "🐟", label: "Fisk" },
    { key: "house", icon: "🏠", label: "Hus" },
    { key: "treasure", icon: "💎", label: "Skatt" },
  ],
  obstacle: [
    { key: "stone", icon: "🪨", label: "Stein" },
    { key: "tree", icon: "🌳", label: "Tre" },
    { key: "light", icon: "🔴", label: "Rødt lys" },
    { key: "hole", icon: "🕳️", label: "Hull" },
  ],
  background: creatorOptions.background,
};
const gameCommands = {
  ...directions,
  jump: { icon: "🦘", label: "Hopp" },
  hello: { icon: "💬", label: "Hei" },
  sparkle: { icon: "⭐", label: "Glitre" },
};
const GAME_GRID_SIZE = 4;
const gameState = readStorage(STORAGE_KEYS.latestGame, {
  character: "robot",
  goal: "star",
  obstacle: "stone",
  background: "forest",
  actor: { x: 0, y: 2 },
  goalPosition: { x: 3, y: 2 },
  obstaclePosition: { x: 1, y: 2 },
  commands: [],
});
gameState.actor = clampPosition(gameState.actor || { x: 0, y: 2 }, GAME_GRID_SIZE);
gameState.goalPosition = clampPosition(gameState.goalPosition || { x: 3, y: 2 }, GAME_GRID_SIZE);
gameState.obstaclePosition = clampPosition(gameState.obstaclePosition || { x: 1, y: 2 }, GAME_GRID_SIZE);
gameState.character = gameState.character || "robot";
gameState.goal = gameState.goal || "star";
gameState.obstacle = gameState.obstacle || "stone";
gameState.background = gameState.background || "forest";
gameState.commands = Array.isArray(gameState.commands) ? gameState.commands : [];
gameState.position = { ...gameState.actor };
gameState.message = "Lag et lite spill.";
gameState.running = false;
gameState.placeMode = null;

function gameOption(group, key) {
  return gameOptions[group].find((option) => option.key === key) || gameOptions[group][0];
}

function renderGameChoices(group, selectedKey) {
  let options = gameOptions[group];
  if (group === "character") {
    const customIcon = getSavedCharacterIcon();
    options = customIcon ? [...options, { key: "custom", icon: customIcon, label: "Min figur" }] : options;
  }

  return `
    <div class="visual-palette mini-palette">
      ${options.map((option) => `
        <button class="visual-button ${selectedKey === option.key ? "is-selected" : ""}" type="button" data-m9-group="${group}" data-m9-value="${option.key}" aria-label="${option.label}">
          <span class="visual-icon" aria-hidden="true">${option.icon}</span>
          <span>${option.label}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function getGameCharacterIcon() {
  if (gameState.character === "custom") {
    return getSavedCharacterIcon() || "🤖";
  }
  return gameOption("character", gameState.character).icon;
}

function renderModuleNine(activeIndex = -1) {
  moduleNineRoot.innerHTML = `
    <section class="game-panel bg-${gameState.background}">
      <p class="big-feedback">${gameState.message}</p>
      ${renderGrid({
        size: GAME_GRID_SIZE,
        actorPosition: gameState.position,
        goalPosition: gameState.goalPosition,
        actor: getGameCharacterIcon(),
        goal: gameOption("goal", gameState.goal).icon,
        obstaclePosition: gameState.obstaclePosition,
        obstacle: gameOption("obstacle", gameState.obstacle).icon,
        tapMode: true,
      })}
      <div class="run-controls compact-controls">
        <button class="clear-button ${gameState.placeMode === "goal" ? "is-selected" : ""}" type="button" data-m9-place="goal" aria-label="Plasser mål">⭐ Plasser mål</button>
        <button class="clear-button ${gameState.placeMode === "obstacle" ? "is-selected" : ""}" type="button" data-m9-place="obstacle" aria-label="Plasser hinder">🪨 Plasser hinder</button>
      </div>
      ${renderCommandRow(gameState.commands, gameCommands, activeIndex, true)}
      ${renderPalette(gameCommands, "m9-add", gameState.running)}
      <details class="builder-details" open>
        <summary>Velg ting</summary>
        <p class="small-help">Figur</p>
        ${renderGameChoices("character", gameState.character)}
        <p class="small-help">Mål</p>
        ${renderGameChoices("goal", gameState.goal)}
        <p class="small-help">Hinder</p>
        ${renderGameChoices("obstacle", gameState.obstacle)}
        <p class="small-help">Bakgrunn</p>
        ${renderGameChoices("background", gameState.background)}
      </details>
      <div class="run-controls compact-controls">
        <button class="run-button" type="button" data-m9-run aria-label="Spill" ${gameState.running || !gameState.commands.length ? "disabled" : ""}>▶ Spill</button>
        <button class="clear-button" type="button" data-m9-again aria-label="Spill igjen">🔄 Spill igjen</button>
        <button class="clear-button" type="button" data-m9-new aria-label="Lag nytt spill">✨ Lag nytt spill</button>
      </div>
    </section>
  `;
}

function saveLatestGame() {
  const { message, running, placeMode, position, ...saveableGame } = gameState;
  writeStorage(STORAGE_KEYS.latestGame, saveableGame);
}

async function runModuleNine() {
  if (gameState.running || gameState.commands.length === 0) {
    return;
  }

  gameState.running = true;
  gameState.position = { ...gameState.actor };
  gameState.message = "Spillet går!";
  playRunSound();
  renderModuleNine();

  for (let index = 0; index < gameState.commands.length; index += 1) {
    const command = gameState.commands[index];
    renderModuleNine(index);

    if (directions[command]) {
      const next = moveByDirection(gameState.position, command, GAME_GRID_SIZE);
      if (!samePosition(next, gameState.obstaclePosition)) {
        gameState.position = next;
      }
    } else if (command === "jump") {
      if (gameState.position.y === gameState.obstaclePosition.y && gameState.position.x + 1 === gameState.obstaclePosition.x) {
        gameState.position = clampPosition({ x: gameState.position.x + 2, y: gameState.position.y }, GAME_GRID_SIZE);
      }
      playHappySound();
    } else if (command === "hello") {
      playRobotSound();
    } else {
      playFinishSound();
    }

    await wait(moveDelay());
  }

  const won = samePosition(gameState.position, gameState.goalPosition);
  gameState.message = won ? "Du lagde et spill!" : "Prøv spillet igjen!";
  gameState.running = false;
  won ? playFinishSound() : playErrorSound();
  saveLatestGame();

  if (won) {
    markComplete("module-9");
  }

  renderModuleNine();
}

moduleNineRoot.onclick = (event) => {
  const groupButton = event.target.closest("[data-m9-group]");
  const addButton = event.target.closest("[data-m9-add]");
  const removeButton = event.target.closest("[data-remove-command]");
  const placeButton = event.target.closest("[data-m9-place]");
  const cellButton = event.target.closest("[data-grid-x]");

  if (groupButton && !gameState.running) {
    gameState[groupButton.dataset.m9Group] = groupButton.dataset.m9Value;
    gameState.message = "Fint valg!";
    playAddCommandSound();
    saveLatestGame();
    renderModuleNine();
    return;
  }

  if (placeButton && !gameState.running) {
    gameState.placeMode = placeButton.dataset.m9Place;
    gameState.message = gameState.placeMode === "goal" ? "Trykk hvor målet skal være." : "Trykk hvor hinderet skal være.";
    renderModuleNine();
    return;
  }

  if (cellButton && gameState.placeMode && !gameState.running) {
    const position = { x: Number(cellButton.dataset.gridX), y: Number(cellButton.dataset.gridY) };
    if (samePosition(position, gameState.actor)) {
      playErrorSound();
      return;
    }
    if (gameState.placeMode === "goal") {
      gameState.goalPosition = position;
    } else {
      gameState.obstaclePosition = position;
    }
    gameState.placeMode = null;
    gameState.message = "Plassert!";
    playAddCommandSound();
    saveLatestGame();
    renderModuleNine();
    return;
  }

  if (addButton && !gameState.running && gameState.commands.length < 8) {
    gameState.commands.push(addButton.dataset.m9Add);
    gameState.message = "Kommando lagt til.";
    playAddCommandSound();
    saveLatestGame();
    renderModuleNine();
    return;
  }

  if (removeButton && removeButton.dataset.removeCommand !== "" && !gameState.running) {
    gameState.commands.splice(Number(removeButton.dataset.removeCommand), 1);
    saveLatestGame();
    renderModuleNine();
    return;
  }

  if (event.target.closest("[data-m9-run]")) {
    runModuleNine();
    return;
  }

  if (event.target.closest("[data-m9-again]")) {
    gameState.position = { ...gameState.actor };
    gameState.message = "Spill igjen!";
    renderModuleNine();
    return;
  }

  if (event.target.closest("[data-m9-new]")) {
    Object.assign(gameState, {
      character: "robot",
      goal: "star",
      obstacle: "stone",
      background: "forest",
      actor: { x: 0, y: 2 },
      position: { x: 0, y: 2 },
      goalPosition: { x: 3, y: 2 },
      obstaclePosition: { x: 1, y: 2 },
      commands: [],
      message: "Lag et lite spill.",
      placeMode: null,
    });
    saveLatestGame();
    renderModuleNine();
  }
};

// Module 10
const moduleTenRoot = document.querySelector("#moduleTenRoot");
const parentGuides = [
  ["La barnet bestemme", "Spør: Hva skal figuren gjøre først?"],
  ["Tenk høyt", "Si: Først går den hit. Så hopper den."],
  ["Feil er bra", "Si: Oi, hva skjedde? Skal vi fikse det?"],
  ["Ikke ta over", "La barnet prøve, selv om det går sakte."],
  ["Stopp mens det er gøy", "5-10 minutter er nok i starten."],
];
const checklistItems = [
  "Barnet trykket selv",
  "Barnet valgte kommando",
  "Barnet testet",
  "Barnet fant en feil",
  "Barnet lo",
];
let parentChecklist = readStorage(STORAGE_KEYS.parentChecklist, {});

function renderModuleTen(message = "Små økter. Mye lek.") {
  moduleTenRoot.innerHTML = `
    <section class="game-panel parent-panel">
      <p class="big-feedback">${message}</p>
      <div class="guide-grid">
        ${parentGuides.map(([title, text]) => `
          <article class="guide-card">
            <h2>${title}</h2>
            <p>${text}</p>
          </article>
        `).join("")}
      </div>
      <section class="creator-panel" aria-label="Sjekkliste">
        <p class="small-help">Sjekkliste</p>
        <div class="checklist">
          ${checklistItems.map((item, index) => `
            <button class="check-button ${parentChecklist[index] ? "is-checked" : ""}" type="button" data-parent-check="${index}" aria-label="${item}">
              <span aria-hidden="true">${parentChecklist[index] ? "✅" : "⬜"}</span>
              <span>${item}</span>
            </button>
          `).join("")}
        </div>
        <div class="run-controls compact-controls">
          <button class="clear-button" type="button" data-parent-reset-list aria-label="Nullstill sjekkliste">↩ Nullstill liste</button>
          <button class="clear-button" type="button" data-parent-reset-progress aria-label="Nullstill stjerner">⭐ Nullstill stjerner</button>
        </div>
      </section>
    </section>
  `;
}

moduleTenRoot.onclick = (event) => {
  const checkButton = event.target.closest("[data-parent-check]");

  if (checkButton) {
    const index = checkButton.dataset.parentCheck;
    parentChecklist[index] = !parentChecklist[index];
    writeStorage(STORAGE_KEYS.parentChecklist, parentChecklist);
    playAddCommandSound();

    if (checklistItems.every((_, itemIndex) => parentChecklist[itemIndex])) {
      markComplete("module-10");
      renderModuleTen("Fin økt!");
      return;
    }

    renderModuleTen();
    return;
  }

  if (event.target.closest("[data-parent-reset-list]")) {
    parentChecklist = {};
    writeStorage(STORAGE_KEYS.parentChecklist, parentChecklist);
    renderModuleTen("Listen er tom.");
    return;
  }

  if (event.target.closest("[data-parent-reset-progress]")) {
    resetProgress();
    renderModuleTen("Stjerner er nullstilt.");
  }
};

cards.forEach((card) => card.addEventListener("click", handleCharacterPress));
document.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
document.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
resetButton.addEventListener("click", resetModule);
adultToggle.addEventListener("click", toggleAdultInfo);
document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-open-view]");

  if (viewButton) {
    openView(viewButton.dataset.openView);
  }
});
commandButtons.forEach((button) => button.addEventListener("click", () => addCommand(button.dataset.command)));
runCommandsButton.addEventListener("click", runModuleOneProgram);
clearCommandsButton.addEventListener("click", clearModuleOne);

renderProgressStars();
renderCommandSlots();
renderModuleTwo();
renderModuleThree();
renderModuleFour();
renderModuleFive();
renderModuleSix();
renderModuleSeven();
renderModuleEight();
renderModuleNine();
renderModuleTen();
markVisited("module-0");
