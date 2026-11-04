const METERS = ['CPU', 'Memory', 'Disk', 'Network'];

function createMeter(label) {
  const row = document.createElement('div');
  row.className = 'meter';
  const name = document.createElement('span');
  name.className = 'meter-label';
  name.textContent = label;
  const track = document.createElement('div');
  track.className = 'meter-track';
  const fill = document.createElement('div');
  fill.className = 'meter-fill';
  track.append(fill);
  const value = document.createElement('span');
  value.className = 'meter-value';
  row.append(name, track, value);
  return { row, fill, value };
}

export function mountMonitor(body) {
  body.classList.add('monitor-body');

  const meters = METERS.map((label) => {
    const meter = createMeter(label);
    body.append(meter.row);
    return meter;
  });

  const refresh = () => {
    meters.forEach((meter) => {
      const percent = Math.round(10 + Math.random() * 70);
      meter.fill.style.width = `${percent}%`;
      meter.value.textContent = `${percent}%`;
    });
  };

  refresh();
  const timer = setInterval(refresh, 1500);
  return () => clearInterval(timer);
}
