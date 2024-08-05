let startTime;
let updatedTime;
let difference;
let timerInterval;
let savedTimes = JSON.parse(localStorage.getItem('savedTimes')) || [];

const timerElement = document.getElementById('timer');
const startStopBtn = document.getElementById('startStopBtn');
const leaderboardList = document.getElementById('leaderboardList');

function updateTimer() {
  updatedTime = new Date().getTime();
  difference = updatedTime - startTime;
  let hours = Math.floor(difference / (1000 * 60 * 60));
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((difference % (1000 * 60)) / 1000);
  let milliseconds = Math.floor((difference % 1000) / 10);

  timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 10);
  startStopBtn.textContent = 'Stop';
}

function stopTimer() {
  clearInterval(timerInterval);
  savedTimes.push(timerElement.textContent);
  savedTimes.sort();
  if (savedTimes.length > 10) {
    savedTimes.pop();
  }
  localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
  displayLeaderboard();
  timerElement.textContent = '00:00:00:00';
  startStopBtn.textContent = 'Start';
}

function displayLeaderboard() {
  leaderboardList.innerHTML = '';
  savedTimes.forEach(time => {
    const li = document.createElement('li');
    li.textContent = time;
    leaderboardList.appendChild(li);
  });
}

startStopBtn.addEventListener('click', () => {
  if (startStopBtn.textContent === 'Start') {
    startTimer();
  } else {
    stopTimer();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    startStopBtn.click();
  }
});

displayLeaderboard();
