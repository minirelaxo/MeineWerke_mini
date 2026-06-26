const COLORS = {
  U: '#f7f7f2',
  R: '#c83232',
  F: '#2e9f58',
  D: '#ffd33d',
  L: '#e87d25',
  B: '#2f69bf',
};

const FACE_NAMES = ['U', 'R', 'F', 'D', 'L', 'B'];
const FACE_LABELS = { U: 'Oben', R: 'Rechts', F: 'Vorne', D: 'Unten', L: 'Links', B: 'Hinten' };

const NET_OFFSETS = {
  U: [3, 0],
  L: [0, 3],
  F: [3, 3],
  R: [6, 3],
  B: [9, 3],
  D: [3, 6],
};

const FACE_TRANSFORMS = {
  U: (half) => `translate(-50%, -50%) rotateX(90deg) translateZ(${half}px)`,
  D: (half) => `translate(-50%, -50%) rotateX(-90deg) translateZ(${half}px)`,
  F: (half) => `translate(-50%, -50%) translateZ(${half}px)`,
  B: (half) => `translate(-50%, -50%) rotateY(180deg) translateZ(${half}px)`,
  R: (half) => `translate(-50%, -50%) rotateY(90deg) translateZ(${half}px)`,
  L: (half) => `translate(-50%, -50%) rotateY(-90deg) translateZ(${half}px)`,
};

const state = {
  cube: createSolvedCube(),
  startCube: createSolvedCube(),
  moves: [],
  currentStep: 0,
  selectedColor: 'U',
  playTimer: null,
  viewAngle: { x: -30, y: -40 },
  viewScale: 1,
};

const els = {
  algorithmInput: document.querySelector('#algorithmInput'),
  applyAlgorithm: document.querySelector('#applyAlgorithm'),
  resetCube: document.querySelector('#resetCube'),
  parseHint: document.querySelector('#parseHint'),
  palette: document.querySelector('#palette'),
  net: document.querySelector('#net'),
  scene: document.querySelector('#scene'),
  statusText: document.querySelector('#statusText'),
  stepCounter: document.querySelector('#stepCounter'),
  moveList: document.querySelector('#moveList'),
  prevStep: document.querySelector('#prevStep'),
  nextStep: document.querySelector('#nextStep'),
  playPause: document.querySelector('#playPause'),
  viewBoth: document.querySelector('#viewBoth'),
  view3d: document.querySelector('#view3d'),
  view2d: document.querySelector('#view2d'),
  views: document.querySelector('#views'),
  algoCategory: document.querySelector('#algoCategory'),
  algoList: document.querySelector('#algoList'),
  insertAlgo: document.querySelector('#insertAlgo'),
};

function loadAlgorithmLibrary() {
  const lib = window.ALGORITHMS || {};
  const categories = Object.keys(lib);
  els.algoCategory.innerHTML = '';
  categories.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    els.algoCategory.append(opt);
  });
  const populate = () => {
    const cat = els.algoCategory.value;
    els.algoList.innerHTML = '';
    (lib[cat] || []).forEach((item, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = item.name;
      els.algoList.append(opt);
    });
  };
  els.algoCategory.addEventListener('change', populate);
  els.insertAlgo.addEventListener('click', () => {
    const cat = els.algoCategory.value;
    const idx = parseInt(els.algoList.value, 10);
    if (!Number.isFinite(idx) || !lib[cat] || !lib[cat][idx]) return;
    
    const item = lib[cat][idx];
    const fullAlg = item.setup ? `${item.setup} ${item.alg}` : item.alg;
    
    els.algorithmInput.value = fullAlg;
    setMessage(`${item.name} mit Setup geladen.`);
    applyAlgorithm();
  });
  if (categories.length) {
    els.algoCategory.value = categories[0];
    els.algoCategory.dispatchEvent(new Event('change'));
  }
}

function createSolvedCube() {
  return Object.fromEntries(FACE_NAMES.map((face) => [face, Array(9).fill(face)]));
}

function cloneCube(cube) {
  return Object.fromEntries(FACE_NAMES.map((face) => [face, [...cube[face]]]));
}

function getSticker(cube, face, row, col) {
  return cube[face][row * 3 + col];
}

function setSticker(cube, face, row, col, value) {
  cube[face][row * 3 + col] = value;
}

function rotateFace(faceArray) {
  return [
    faceArray[6], faceArray[3], faceArray[0],
    faceArray[7], faceArray[4], faceArray[1],
    faceArray[8], faceArray[5], faceArray[2],
  ];
}

function rotateFaceCounter(faceArray) {
  return [
    faceArray[2], faceArray[5], faceArray[8],
    faceArray[1], faceArray[4], faceArray[7],
    faceArray[0], faceArray[3], faceArray[6],
  ];
}

function rotateLayer(cube, face, positions) {
  const values = positions.map(([f, i]) => cube[f][i]);
  positions.forEach(([f, i], idx) => {
    cube[f][i] = values[(idx + 3) % 12];
  });
}

function applyTurn(cube, move) {
  const dir = move.suffix === "'" ? -1 : 1;
  const times = move.amount === 2 ? 2 : 1;

  const applyRotation = (sym, d) => {
    // x: R layer rotation (around vertical axis)
    // y: U layer rotation (around front-back axis)
    // z: F layer rotation (around left-right axis)
    if (sym === 'x') {
      if (d === 1) {
        [cube.U, cube.F, cube.D, cube.B] = [cloneCube({U:cube.F,F:cube.D,D:cube.B,B:cube.U}).U, cube.D, cube.B, cube.U];
        cube.R = rotateFace(cube.R);
        cube.L = rotateFaceCounter(cube.L);
      } else {
        [cube.U, cube.F, cube.D, cube.B] = [cube.B, cube.U, cube.F, cube.D];
        cube.R = rotateFaceCounter(cube.R);
        cube.L = rotateFace(cube.L);
      }
    } else if (sym === 'y') {
      if (d === 1) {
        [cube.F, cube.L, cube.B, cube.R] = [cube.R, cube.F, cube.L, cube.B];
        cube.U = rotateFace(cube.U);
        cube.D = rotateFaceCounter(cube.D);
      } else {
        [cube.F, cube.L, cube.B, cube.R] = [cube.L, cube.B, cube.R, cube.F];
        cube.U = rotateFaceCounter(cube.U);
        cube.D = rotateFace(cube.D);
      }
    } else if (sym === 'z') {
      if (d === 1) {
        [cube.U, cube.R, cube.D, cube.L] = [cloneCube({U:cube.L,R:cube.U,D:cube.R,L:cube.D}).U, cube.D, cube.L, cube.U];
        cube.F = rotateFace(cube.F);
        cube.B = rotateFaceCounter(cube.B);
      } else {
        [cube.U, cube.R, cube.D, cube.L] = [cube.R, cube.D, cube.L, cube.U];
        cube.F = rotateFaceCounter(cube.F);
        cube.B = rotateFace(cube.B);
      }
    }
  };

  for (let step = 0; step < times; step++) {
    switch (move.symbol) {
      // Outer moves
      case 'U':
        cube.U = dir === 1 ? rotateFace(cube.U) : rotateFaceCounter(cube.U);
        rotateLayer(cube, 'U', [
          ['F', 0], ['F', 1], ['F', 2],
          ['R', 0], ['R', 1], ['R', 2],
          ['B', 0], ['B', 1], ['B', 2],
          ['L', 0], ['L', 1], ['L', 2],
        ]);
        break;
      case 'D':
        cube.D = dir === 1 ? rotateFace(cube.D) : rotateFaceCounter(cube.D);
        rotateLayer(cube, 'D', [
          ['F', 6], ['F', 7], ['F', 8],
          ['L', 6], ['L', 7], ['L', 8],
          ['B', 6], ['B', 7], ['B', 8],
          ['R', 6], ['R', 7], ['R', 8],
        ]);
        break;
      case 'R':
        cube.R = dir === 1 ? rotateFace(cube.R) : rotateFaceCounter(cube.R);
        if (dir === 1) {
          const temp = [cube.U[2], cube.U[5], cube.U[8]];
          [cube.U[2], cube.U[5], cube.U[8]] = [cube.F[2], cube.F[5], cube.F[8]];
          [cube.F[2], cube.F[5], cube.F[8]] = [cube.D[2], cube.D[5], cube.D[8]];
          [cube.D[2], cube.D[5], cube.D[8]] = [cube.B[6], cube.B[3], cube.B[0]];
          [cube.B[6], cube.B[3], cube.B[0]] = temp;
        } else {
          const temp = [cube.U[2], cube.U[5], cube.U[8]];
          [cube.U[2], cube.U[5], cube.U[8]] = [cube.B[6], cube.B[3], cube.B[0]];
          [cube.B[6], cube.B[3], cube.B[0]] = [cube.D[2], cube.D[5], cube.D[8]];
          [cube.D[2], cube.D[5], cube.D[8]] = [cube.F[2], cube.F[5], cube.F[8]];
          [cube.F[2], cube.F[5], cube.F[8]] = temp;
        }
        break;
      case 'L':
        cube.L = dir === 1 ? rotateFace(cube.L) : rotateFaceCounter(cube.L);
        if (dir === 1) {
          const temp = [cube.U[0], cube.U[3], cube.U[6]];
          [cube.U[0], cube.U[3], cube.U[6]] = [cube.B[8], cube.B[5], cube.B[2]];
          [cube.B[8], cube.B[5], cube.B[2]] = [cube.D[0], cube.D[3], cube.D[6]];
          [cube.D[0], cube.D[3], cube.D[6]] = [cube.F[0], cube.F[3], cube.F[6]];
          [cube.F[0], cube.F[3], cube.F[6]] = temp;
        } else {
          const temp = [cube.U[0], cube.U[3], cube.U[6]];
          [cube.U[0], cube.U[3], cube.U[6]] = [cube.F[0], cube.F[3], cube.F[6]];
          [cube.F[0], cube.F[3], cube.F[6]] = [cube.D[0], cube.D[3], cube.D[6]];
          [cube.D[0], cube.D[3], cube.D[6]] = [cube.B[8], cube.B[5], cube.B[2]];
          [cube.B[8], cube.B[5], cube.B[2]] = temp;
        }
        break;
      case 'F':
        cube.F = dir === 1 ? rotateFace(cube.F) : rotateFaceCounter(cube.F);
        if (dir === 1) {
          const temp = [cube.U[6], cube.U[7], cube.U[8]];
          [cube.U[6], cube.U[7], cube.U[8]] = [cube.L[8], cube.L[5], cube.L[2]];
          [cube.L[8], cube.L[5], cube.L[2]] = [cube.D[2], cube.D[1], cube.D[0]];
          [cube.D[2], cube.D[1], cube.D[0]] = [cube.R[0], cube.R[3], cube.R[6]];
          [cube.R[0], cube.R[3], cube.R[6]] = temp;
        } else {
          const temp = [cube.U[6], cube.U[7], cube.U[8]];
          [cube.U[6], cube.U[7], cube.U[8]] = [cube.R[0], cube.R[3], cube.R[6]];
          [cube.R[0], cube.R[3], cube.R[6]] = [cube.D[2], cube.D[1], cube.D[0]];
          [cube.D[2], cube.D[1], cube.D[0]] = [cube.L[8], cube.L[5], cube.L[2]];
          [cube.L[8], cube.L[5], cube.L[2]] = temp;
        }
        break;
      case 'B':
        cube.B = dir === 1 ? rotateFace(cube.B) : rotateFaceCounter(cube.B);
        if (dir === 1) {
          const temp = [cube.U[2], cube.U[1], cube.U[0]];
          [cube.U[2], cube.U[1], cube.U[0]] = [cube.R[2], cube.R[5], cube.R[8]];
          [cube.R[2], cube.R[5], cube.R[8]] = [cube.D[8], cube.D[7], cube.D[6]];
          [cube.D[8], cube.D[7], cube.D[6]] = [cube.L[6], cube.L[3], cube.L[0]];
          [cube.L[6], cube.L[3], cube.L[0]] = temp;
        } else {
          const temp = [cube.U[2], cube.U[1], cube.U[0]];
          [cube.U[2], cube.U[1], cube.U[0]] = [cube.L[6], cube.L[3], cube.L[0]];
          [cube.L[6], cube.L[3], cube.L[0]] = [cube.D[8], cube.D[7], cube.D[6]];
          [cube.D[8], cube.D[7], cube.D[6]] = [cube.R[2], cube.R[5], cube.R[8]];
          [cube.R[2], cube.R[5], cube.R[8]] = temp;
        }
        break;
      // Slice moves
      case 'M': // M rotates L-R middle layer (left to right)
        rotateLayer(cube, 'M', [
          ['U', 1], ['U', 4], ['U', 7],
          ['F', 1], ['F', 4], ['F', 7],
          ['D', 1], ['D', 4], ['D', 7],
          ['B', 1], ['B', 4], ['B', 7],
        ]);
        break;
      case 'E': // E rotates U-D middle layer (top to bottom)
        rotateLayer(cube, 'E', [
          ['F', 3], ['F', 4], ['F', 5],
          ['R', 3], ['R', 4], ['R', 5],
          ['B', 3], ['B', 4], ['B', 5],
          ['L', 3], ['L', 4], ['L', 5],
        ]);
        break;
      case 'S': // S rotates F-B middle layer
        rotateLayer(cube, 'S', [
          ['U', 3], ['U', 4], ['U', 5],
          ['L', 2], ['L', 5], ['L', 8],
          ['D', 3], ['D', 4], ['D', 5],
          ['R', 6], ['R', 3], ['R', 0],
        ]);
        break;
      // Wide/slice moves (lowercase)
      case 'r': // r = R + M (rightmost + middle)
        applyTurn(cube, { symbol: 'R', amount: 1, suffix: move.suffix });
        applyTurn(cube, { symbol: 'M', amount: 1, suffix: "'" });
        break;
      case 'l': // l = L + M'
        applyTurn(cube, { symbol: 'L', amount: 1, suffix: move.suffix });
        applyTurn(cube, { symbol: 'M', amount: 1, suffix: '' });
        break;
      case 'u': // u = U + E'
        applyTurn(cube, { symbol: 'U', amount: 1, suffix: move.suffix });
        applyTurn(cube, { symbol: 'E', amount: 1, suffix: "'" });
        break;
      case 'd': // d = D + E
        applyTurn(cube, { symbol: 'D', amount: 1, suffix: move.suffix });
        applyTurn(cube, { symbol: 'E', amount: 1, suffix: '' });
        break;
      case 'f': // f = F + S
        applyTurn(cube, { symbol: 'F', amount: 1, suffix: move.suffix });
        applyTurn(cube, { symbol: 'S', amount: 1, suffix: '' });
        break;
      case 'b': // b = B + S'
        applyTurn(cube, { symbol: 'B', amount: 1, suffix: move.suffix });
        applyTurn(cube, { symbol: 'S', amount: 1, suffix: "'" });
        break;
      // Rotations
      case 'x':
      case 'y':
      case 'z':
        applyRotation(move.symbol, dir);
        break;
      default:
        throw new Error(`Unbekannter Zug: ${move.symbol}`);
    }
  }
}

function parseAlgorithm(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  if (cleaned.includes('"')) {
    throw new Error('Bitte verwende ein Apostroph für R\' statt R".');
  }
  const parts = cleaned.split(' ').filter(Boolean);
  // Support: URFDLB (outer), rluMES (slices), xyz (rotations)
  const tokenRe = /^([URFDLBrluMESxyz])(2?)('?)$/;
  return parts.map((raw) => {
    const match = raw.match(tokenRe);
    if (!match) {
      throw new Error(`"${raw}" ist kein Zug. Beispiele: R, r', M2, x (Rotation).`);
    }
    return { raw, symbol: match[1], amount: match[2] === '2' ? 2 : 1, suffix: match[3] || '' };
  });
}

function applyMoves(cube, moves, count = moves.length) {
  for (let i = 0; i < count; i += 1) {
    applyTurn(cube, moves[i]);
  }
}

function setMessage(message, type = 'ok') {
  els.parseHint.textContent = message;
  els.parseHint.classList.toggle('error', type === 'error');
  els.statusText.textContent = type === 'error' ? 'Fehler' : 'Bereit';
  els.statusText.classList.toggle('status-error', type === 'error');
  els.statusText.classList.toggle('status-ok', type === 'ok');
}

function animateSceneFeedback() {
  els.scene.classList.add('scene-feedback');
  window.setTimeout(() => els.scene.classList.remove('scene-feedback'), 920);
}

function rebuildFromStep() {
  state.cube = cloneCube(state.startCube);
  applyMoves(state.cube, state.moves, state.currentStep);
  renderAll();
}

function applyAlgorithm() {
  try {
    state.moves = parseAlgorithm(els.algorithmInput.value);
    state.startCube = cloneCube(state.cube);
    state.currentStep = 0;
    stopPlayback();
    setMessage(`${state.moves.length} Züge erkannt.`);
    animateSceneFeedback();
    renderAll();
  } catch (error) {
    stopPlayback();
    setMessage(error.message, 'error');
  }
}

function resetCube() {
  stopPlayback();
  state.cube = createSolvedCube();
  state.startCube = createSolvedCube();
  state.currentStep = 0;
  try {
    state.moves = parseAlgorithm(els.algorithmInput.value);
  } catch {
    state.moves = [];
  }
  renderAll();
  setMessage('Würfel zurückgesetzt.');
  animateSceneFeedback();
}

function stepTo(index) {
  const clampedIndex = Math.max(0, Math.min(index, state.moves.length));
  if (clampedIndex === state.currentStep) return;
  state.currentStep = clampedIndex;
  rebuildFromStep();
  animateSceneFeedback();
}

function stopPlayback() {
  if (state.playTimer) clearInterval(state.playTimer);
  state.playTimer = null;
  els.playPause.textContent = 'Play';
}

function togglePlayback() {
  if (state.playTimer) {
    stopPlayback();
    return;
  }
  els.playPause.textContent = 'Pause';
  state.playTimer = setInterval(() => {
    if (state.currentStep >= state.moves.length) {
      stopPlayback();
      return;
    }
    stepTo(state.currentStep + 1);
  }, 650);
}

function renderPalette() {
  els.palette.innerHTML = '';
  FACE_NAMES.forEach((face) => {
    const button = document.createElement('button');
    button.className = `swatch ${face === state.selectedColor ? 'active' : ''}`;
    button.style.background = COLORS[face];
    button.title = FACE_LABELS[face];
    button.addEventListener('click', () => {
      state.selectedColor = face;
      renderPalette();
    });
    els.palette.append(button);
  });
}

function renderNet() {
  els.net.innerHTML = '';
  FACE_NAMES.forEach((face) => {
    const [colOffset, rowOffset] = NET_OFFSETS[face];
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const sticker = document.createElement('button');
        sticker.className = `sticker ${row === 1 && col === 1 ? 'center' : ''}`;
        sticker.style.gridColumn = `${colOffset + col + 1}`;
        sticker.style.gridRow = `${rowOffset + row + 1}`;
        sticker.style.background = COLORS[getSticker(state.cube, face, row, col)];
        sticker.title = `${FACE_LABELS[face]} ${row + 1}/${col + 1}`;
        sticker.addEventListener('click', () => {
          setSticker(state.cube, face, row, col, state.selectedColor);
          state.startCube = cloneCube(state.cube);
          state.currentStep = 0;
          renderAll();
        });
        els.net.append(sticker);
      }
    }
  });
}

function renderScene() {
  els.scene.innerHTML = '';
  const faceSize = Math.min(280, Math.max(220, els.scene.clientWidth * 0.6));
  const halfDepth = faceSize / 2;

  FACE_NAMES.forEach((face) => {
    const cubeFace = document.createElement('div');
    cubeFace.className = 'face-3d';
    cubeFace.style.width = `${faceSize}px`;
    cubeFace.style.height = `${faceSize}px`;
    cubeFace.style.transform = FACE_TRANSFORMS[face](halfDepth);

    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const sticker = document.createElement('div');
        sticker.className = 'face-sticker';
        sticker.style.background = COLORS[getSticker(state.cube, face, row, col)];
        sticker.title = `${FACE_LABELS[face]} ${row + 1}/${col + 1}`;
        cubeFace.append(sticker);
      }
    }

    els.scene.append(cubeFace);
  });

  els.scene.style.transform = `rotateX(${state.viewAngle.x}deg) rotateY(${state.viewAngle.y}deg) scale(${state.viewScale})`;
}

function renderMoves() {
  els.moveList.innerHTML = '';
  state.moves.forEach((move, index) => {
    const li = document.createElement('li');
    li.className = index + 1 === state.currentStep ? 'active' : '';
    li.innerHTML = `<span>${move.raw}</span><span class="move-index">${index + 1}</span>`;
    li.addEventListener('click', () => stepTo(index + 1));
    els.moveList.append(li);
  });
  els.stepCounter.textContent = state.currentStep === 0
    ? 'Startposition'
    : `${state.currentStep} / ${state.moves.length}: ${state.moves[state.currentStep - 1].raw}`;
}

function renderAll() {
  renderPalette();
  renderNet();
  renderScene();
  renderMoves();
}

function setView(mode) {
  els.views.className = `views ${mode}`;
  [els.viewBoth, els.view3d, els.view2d].forEach((button) => button.classList.remove('active'));
  if (mode === 'both') els.viewBoth.classList.add('active');
  if (mode === 'only-3d') els.view3d.classList.add('active');
  if (mode === 'only-2d') els.view2d.classList.add('active');
}

function bindEvents() {
  els.applyAlgorithm.addEventListener('click', applyAlgorithm);
  els.resetCube.addEventListener('click', resetCube);
  els.prevStep.addEventListener('click', () => stepTo(state.currentStep - 1));
  els.nextStep.addEventListener('click', () => stepTo(state.currentStep + 1));
  els.playPause.addEventListener('click', togglePlayback);
  els.viewBoth.addEventListener('click', () => setView('both'));
  els.view3d.addEventListener('click', () => setView('only-3d'));
  els.view2d.addEventListener('click', () => setView('only-2d'));
  if (window.feather) {
    window.feather.replace();
  }

  // load algorithm library if present
  setTimeout(() => {
    try { loadAlgorithmLibrary(); } catch (e) { /* ignore */ }
  }, 40);

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  els.scene.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    els.scene.setPointerCapture(event.pointerId);
  });

  els.scene.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    state.viewAngle.y += dx * 0.35;
    state.viewAngle.x -= dy * 0.35;
    state.viewAngle.x = Math.max(-80, Math.min(80, state.viewAngle.x));
    renderScene();
  });

  const stopDragging = () => { dragging = false; };
  els.scene.addEventListener('pointerup', stopDragging);
  els.scene.addEventListener('pointercancel', stopDragging);
  document.addEventListener('pointerup', stopDragging);
  document.addEventListener('pointercancel', stopDragging);

  els.scene.addEventListener('wheel', (event) => {
    event.preventDefault();
    state.viewScale = Math.max(0.7, Math.min(1.4, state.viewScale - event.deltaY * 0.0015));
    renderScene();
  }, { passive: false });
}

bindEvents();
try {
  state.moves = parseAlgorithm(els.algorithmInput.value);
} catch {
  state.moves = [];
}
renderAll();
