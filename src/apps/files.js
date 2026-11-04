export const HOME_ENTRIES = [
  { name: 'Documents', kind: 'Folder', size: '--' },
  { name: 'Downloads', kind: 'Folder', size: '--' },
  { name: 'Pictures', kind: 'Folder', size: '--' },
  { name: 'Music', kind: 'Folder', size: '--' },
  { name: 'mb.ipynb', kind: 'Notebook', size: '269 KB' },
  { name: 'download.py', kind: 'Python script', size: '266 B' },
  { name: 'package-lock.json', kind: 'JSON file', size: '31 KB' },
  { name: '.gitignore', kind: 'Text file', size: '411 B' },
];

export function mountFiles(body) {
  body.classList.add('files-body');

  const table = document.createElement('table');
  table.className = 'files-table';
  table.innerHTML = '<thead><tr><th>Name</th><th>Type</th><th>Size</th></tr></thead>';
  const tbody = document.createElement('tbody');

  for (const entry of HOME_ENTRIES) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.className = `file-name ${entry.kind === 'Folder' ? 'is-folder' : ''}`;
    nameCell.textContent = entry.name;
    const kindCell = document.createElement('td');
    kindCell.textContent = entry.kind;
    const sizeCell = document.createElement('td');
    sizeCell.textContent = entry.size;
    row.append(nameCell, kindCell, sizeCell);
    row.addEventListener('click', () => {
      tbody.querySelectorAll('tr.selected').forEach((selected) => selected.classList.remove('selected'));
      row.classList.add('selected');
    });
    tbody.append(row);
  }

  table.append(tbody);
  body.append(table);
}
