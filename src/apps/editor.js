export function mountEditor(body) {
  body.classList.add('editor-body');

  const textarea = document.createElement('textarea');
  textarea.className = 'editor-area';
  textarea.placeholder = 'Start typing your notes...';
  textarea.spellcheck = false;
  textarea.setAttribute('aria-label', 'Text editor');

  const status = document.createElement('div');
  status.className = 'editor-status';
  const updateStatus = () => {
    const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
    status.textContent = `${words} words, ${textarea.value.length} characters`;
  };
  textarea.addEventListener('input', updateStatus);
  updateStatus();

  body.append(textarea, status);
  textarea.focus();
}
