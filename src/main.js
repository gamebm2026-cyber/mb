import { openWindow } from './windows.js';
import { mountFiles } from './apps/files.js';
import { mountTerminal } from './apps/terminal.js';
import { mountEditor } from './apps/editor.js';
import { mountMonitor } from './apps/monitor.js';

const ICONS = {
  home: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 11l9-7 9 7v9h-6v-6H9v6H3z"/></svg>',
  terminal: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v16H3z M5 8v10h14V8z"/><path fill="currentColor" d="M7 11l3 2.5L7 16l-1-1 1.5-1.5L6 12z"/></svg>',
  editor: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h9l5 5v13H5z M7 5v14h10V9h-4V5z"/></svg>',
  monitor: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v12H3z M5 6v8h14V6z M8 19h8v2H8z"/></svg>',
};

const APPS = {
  files: { title: 'Files', icon: 'home', width: 560, height: 380, mount: mountFiles },
  terminal: { title: 'Terminal', icon: 'terminal', width: 620, height: 400, mount: mountTerminal },
  editor: { title: 'Text Editor', icon: 'editor', width: 520, height: 380, mount: mountEditor },
  monitor: { title: 'System Monitor', icon: 'monitor', width: 420, height: 320, mount: mountMonitor },
};

const DESKTOP_ICONS = ['files', 'terminal', 'editor', 'monitor'];

function createAppButton(appId, className) {
  const app = APPS[appId];
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.innerHTML = `<span class="app-icon">${ICONS[app.icon]}</span>`;
  const label = document.createElement('span');
  label.className = 'app-label';
  label.textContent = app.title;
  button.append(label);
  button.addEventListener('click', () => openApp(appId));
  return button;
}

function openApp(appId) {
  const app = APPS[appId];
  openWindow({ id: appId, title: app.title, width: app.width, height: app.height, mount: app.mount });
  closeMenu();
}

const menuButton = document.getElementById('app-menu-button');
const menu = document.getElementById('app-menu');

function closeMenu() {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  const willOpen = menu.hidden;
  menu.hidden = !willOpen;
  menuButton.setAttribute('aria-expanded', String(willOpen));
}

menuButton.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMenu();
});

document.addEventListener('click', (event) => {
  if (!menu.contains(event.target)) closeMenu();
});

for (const appId of Object.keys(APPS)) {
  menu.append(createAppButton(appId, 'menu-item'));
  document.getElementById('panel-launchers').append(createAppButton(appId, 'panel-launcher'));
}

const iconContainer = document.getElementById('desktop-icons');
for (const appId of DESKTOP_ICONS) {
  iconContainer.append(createAppButton(appId, 'desktop-icon'));
}

const clock = document.getElementById('clock');
const updateClock = () => {
  clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
updateClock();
setInterval(updateClock, 1000);

openApp('terminal');
