function addOccupancyBarToDom(item, containerId) {
  let block = item.block;
  let room = item.room;
  let full_occupancy = item.full_occupancy;
  let actual_occupancy = item.payload === undefined ? 0 : JSON.parse(item.payload).actual_occupancy;
  let threshold = item.threshold;
  let ratio_occupancy = ratioOccupancy(actual_occupancy, full_occupancy, threshold);
  let color = barColor(ratio_occupancy);

  var container = document.getElementById(containerId);
  let progressbar = document.createElement('div');
  let progress = document.createElement('div');
  let text = document.createElement('p');
  let br = document.createElement('br');

  progressbar.classList.add('progress-bar');
  progressbar.classList.add(`bg-${color}`);
  progressbar.style.width = `${ratio_occupancy * 100}%`;
  progressbar.ariaValueNow = ratio_occupancy * 100;
  progressbar.ariaValueMin = 0;
  progressbar.ariaValueMax = 100
  progressbar.innerHTML = (ratio_occupancy * 100).toFixed(1) + '%';

  progress.classList.add('progress');

  text.innerText = `B:${block} R:${room} Hay actualmente ${actual_occupancy} personas, de las ${Math.ceil(threshold * full_occupancy)} permitidas.
  (Capacidad max. ${full_occupancy} / Trabajando al ${threshold * 100}%)`;

  progress.appendChild(progressbar);
  container.appendChild(progress);
  container.appendChild(text);
  container.appendChild(br);
}

function sortRoomsByOccupancy(a, b) {
  actual_occupancy_a = a.payload === undefined ? 0 : JSON.parse(a.payload).actual_occupancy;
  ratio_occupancy_a = ratioOccupancy(actual_occupancy_a, a.full_occupancy, a.threshold);

  actual_occupancy_b = b.payload === undefined ? 0 : JSON.parse(b.payload).actual_occupancy;
  ratio_occupancy_b = ratioOccupancy(actual_occupancy_b, b.full_occupancy, b.threshold);

  if (ratio_occupancy_a <= ratio_occupancy_b) return 1;
  else return -1;
}

function barColor(ratio_occupancy) {
  if (ratio_occupancy < (0.5)) {
    color = 'success'
  } else if (ratio_occupancy < (0.8)) {
    color = 'warning';
  } else {
    color = 'danger';
  }
  return color;
}

function ratioOccupancy(actual_occupancy, full_occupancy, threshold) {
  return actual_occupancy / (full_occupancy * threshold);
}