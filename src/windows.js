const windows = new Map();
let zCounter = 10;
let cascade = 0;
let activeId = null;

const layer = () => document.getElementById('window-layer');
const taskItems = () => document.getElementById('task-items');

function createControlButton(className, label, ariaLabel) {
  const button = document.createElement('button');
  button.className = `win-btn ${className}`;
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-label', ariaLabel);
  return button;
}

function raise(id) {
  const entry = windows.get(id);
  if (!entry) return;
  entry.minimized = false;
  entry.el.hidden = false;
  entry.el.style.zIndex = ++zCounter;
  activeId = id;
  for (const [otherId, other] of windows) {
    other.taskButton.classList.toggle('active', otherId === id && !other.minimized);
  }
}

function setMinimized(id, minimized) {
  const entry = windows.get(id);
  if (!entry) return;
  entry.minimized = minimized;
  entry.el.hidden = minimized;
  if (minimized && activeId === id) activeId = null;
  entry.taskButton.classList.toggle('active', !minimized && activeId === id);
}

function startDrag(event, el) {
  if (event.target.closest('button')) return;
  const offsetX = event.clientX - el.offsetLeft;
  const offsetY = event.clientY - el.offsetTop;

  const move = (moveEvent) => {
    el.style.left = `${Math.max(0, moveEvent.clientX - offsetX)}px`;
    el.style.top = `${Math.max(0, moveEvent.clientY - offsetY)}px`;
  };
  const stop = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', stop);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', stop);
}

export function closeWindow(id) {
  const entry = windows.get(id);
  if (!entry) return;
  entry.cleanup?.();
  entry.el.remove();
  entry.taskButton.remove();
  windows.delete(id);
  if (activeId === id) activeId = null;
}

export function openWindow({ id, title, width, height, mount }) {
  const existing = windows.get(id);
  if (existing) {
    if (existing.minimized || activeId !== id) raise(id);
    else setMinimized(id, true);
    return;
  }

  const el = document.createElement('section');
  el.className = 'window';
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  cascade = (cascade + 1) % 6;
  el.style.left = `${90 + cascade * 28}px`;
  el.style.top = `${40 + cascade * 28}px`;

  const titlebar = document.createElement('header');
  titlebar.className = 'window-titlebar';
  const titleText = document.createElement('span');
  titleText.className = 'window-title';
  titleText.textContent = title;
  const controls = document.createElement('div');
  controls.className = 'window-controls';
  const minButton = createControlButton('win-min', '\u2013', 'Minimize');
  const closeButton = createControlButton('win-close', '\u00d7', 'Close');
  controls.append(minButton, closeButton);
  titlebar.append(titleText, controls);

  const body = document.createElement('div');
  body.className = 'window-body';
  el.append(titlebar, body);
  layer().append(el);

  const taskButton = document.createElement('button');
  taskButton.className = 'task-button';
  taskButton.type = 'button';
  taskButton.textContent = title;
  taskItems().append(taskButton);

  const cleanup = mount(body);
  windows.set(id, { el, taskButton, minimized: false, cleanup });

  el.addEventListener('pointerdown', () => raise(id));
  titlebar.addEventListener('pointerdown', (event) => startDrag(event, el));
  minButton.addEventListener('click', () => setMinimized(id, true));
  closeButton.addEventListener('click', () => closeWindow(id));
  taskButton.addEventListener('click', () => {
    const entry = windows.get(id);
    if (!entry.minimized && activeId === id) setMinimized(id, true);
    else raise(id);
  });

  raise(id);
}
