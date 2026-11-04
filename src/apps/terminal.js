import { HOME_ENTRIES } from './files.js';

const PROMPT = 'user@cloud-desktop:~$';
const CLEAR = Symbol('clear');

const COMMANDS = {
  help: () => 'Available commands: help, ls, pwd, whoami, date, echo, uname, clear',
  ls: () => HOME_ENTRIES.map((entry) => entry.name).join('  '),
  pwd: () => '/home/user',
  whoami: () => 'user',
  date: () => new Date().toString(),
  uname: () => 'Linux cloud-desktop 6.8.0 x86_64 GNU/Linux',
  echo: (args) => args.join(' '),
  clear: () => CLEAR,
};

function runCommand(line) {
  const [name, ...args] = line.split(/\s+/);
  const command = COMMANDS[name];
  if (!command) return `${name}: command not found`;
  return command(args);
}

export function mountTerminal(body) {
  body.classList.add('terminal-body');

  const output = document.createElement('div');
  output.className = 'term-output';
  output.setAttribute('aria-live', 'polite');

  const form = document.createElement('form');
  form.className = 'term-input-row';
  const promptText = document.createElement('span');
  promptText.className = 'term-prompt';
  promptText.textContent = PROMPT;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'term-input';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('aria-label', 'Terminal command');
  form.append(promptText, input);
  body.append(output, form);

  const print = (text) => {
    const line = document.createElement('div');
    line.textContent = text;
    output.append(line);
    output.scrollTop = output.scrollHeight;
  };

  print('Welcome to the Cloud Desktop terminal. Type "help" to see commands.');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const line = input.value.trim();
    input.value = '';
    if (!line) return;
    print(`${PROMPT} ${line}`);
    const result = runCommand(line);
    if (result === CLEAR) output.replaceChildren();
    else if (result) print(result);
  });

  body.addEventListener('click', () => input.focus());
  input.focus();
}
