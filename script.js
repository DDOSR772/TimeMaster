// global object
try{T = {};
T.timerDiv = document.getElementById('timer');
T.splits = []; // Array to store split times
T.timerStarted = false; // Track if the timer has started
T.timerStopped = true; // Track if the timer is stopped
T.timerInterval = null; // Store the interval reference
T.startTime = 0; // Start time
T.difference = 0; // Difference in time

// Elements for login
const loginContainer = document.getElementById('loginContainer');
const timerContainer = document.getElementById('timerContainer');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');


// Display timer
function displayTimer() {
  var hours = '00', minutes = '00', milliseconds = 0, seconds = '00', time = '';
  var timeNow = new Date().getTime(); // timestamp (milliseconds)

  T.difference = timeNow - T.startTime;

  // milliseconds
  milliseconds = Math.floor((T.difference % 1000) / 10);
  if (milliseconds < 10) {
    milliseconds = '0' + String(milliseconds);
  }

  // seconds
  seconds = Math.floor((T.difference / 1000) % 60);
  if (seconds < 10) {
    seconds = '0' + String(seconds);
  }

  // minutes
  minutes = Math.floor((T.difference / 60000) % 60);
  if (minutes < 10) {
    minutes = '0' + String(minutes);
  }

  // hours
  hours = Math.floor((T.difference / 3600000) % 24);
  if (hours < 10) {
    hours = '0' + String(hours);
  }

  time = hours + ':'
  time += minutes + ':'
  time += seconds + ':'
  time += milliseconds;

  T.timerDiv.innerHTML = time;
}

// Start timer
function startTimer() {
  if (!T.timerStarted || T.timerStopped) {
    T.startTime = new Date().getTime() - (T.difference || 0);

    // Update timer periodically
    T.timerInterval = setInterval(displayTimer, 10);

    // Show/hide the relevant buttons
    document.getElementById('go').style.display = "none";
    document.getElementById('stop').style.display = "inline";
    document.getElementById('clear').style.display = "none";

    T.timerStopped = false; // Reset the flag when starting
    T.timerStarted = true; // Set the flag when started
  }
}

// Stop timer
function stopTimer() {
  if (T.timerStarted && !T.timerStopped) {
    clearInterval(T.timerInterval); // Stop updating the timer
    addSplitTime(); // Add the split time to the leaderboard

    document.getElementById('stop').style.display = "none";
    document.getElementById('go').style.display = "inline";
    document.getElementById('clear').style.display = "inline";

    T.timerStopped = true; // Set the flag when stopping
  }
}

// Clear timer
function clearTimer() {
  clearInterval(T.timerInterval);
  T.timerDiv.innerHTML = "00:00:00:00"; // Reset timer to all zeros
  T.difference = 0;

  document.getElementById('stop').style.display = "none";
  document.getElementById('go').style.display = "inline";
  document.getElementById('clear').style.display = "none";

  T.timerStarted = false; // Reset the timerStarted variable
  T.timerStopped = true; // Ensure the timer is considered stopped
}

// Add split time to leaderboard
function addSplitTime() {
  if (T.difference > 0) {
    let formattedTime = formatTime(T.difference);
    T.splits.push({ time: formattedTime, timestamp: T.difference });

    // Sort the splits array by time in ascending order
    T.splits.sort((a, b) => a.timestamp - b.timestamp);

    // Update the leaderboard
    updateLeaderboard();
  }
}

// Format time for display
function formatTime(ms) {
  let hours = Math.floor(ms / 3600000);
  ms %= 3600000;
  let minutes = Math.floor(ms / 60000);
  ms %= 60000;
  let seconds = Math.floor(ms / 1000);
  let milliseconds = Math.floor(ms % 1000 / 10);

  return [hours, minutes, seconds, milliseconds]
    .map(num => num.toString().padStart(2, '0'))
    .join(':');
}

// Update leaderboard
function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = ''; // Clear existing leaderboard

  T.splits.forEach(split => {
    let li = document.createElement('li');
    li.textContent = split.time;
    leaderboardList.appendChild(li);
  });
}

// Handle spacebar key press
document.addEventListener('keydown', function (event) {
  if (event.code === 'Space') {
    event.preventDefault(); // Prevent the default spacebar action
    if (!T.timerStarted || T.timerStopped) {
      startTimer();
    } else if (T.timerStarted && !T.timerStopped) {
      stopTimer();
    }
  } else if (event.code === 'Backspace') {
    event.preventDefault(); // Prevent the default backspace action
    clearTimer();
  }
});

// Handle mouse clicks
document.getElementById('go').addEventListener('click', function () {
  if (!T.timerStarted || T.timerStopped) {
    startTimer();
  } else if (T.timerStarted && !T.timerStopped) {
    stopTimer();
  }
});
document.getElementById('stop').addEventListener('click', function () {
  if (T.timerStarted && !T.timerStopped) {
    stopTimer();
  }
});
document.getElementById('clear').addEventListener('click', clearTimer);

// User registration
registerBtn.addEventListener('click', function () {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username && password) {
    if (localStorage.getItem(username)) {
      alert('Username already exists. Please choose another one.');
    } else {
      localStorage.setItem(username, JSON.stringify({ password, splits: [] }));
      alert('Registration successful. Please log in.');
    }
  } else {
    alert('Please fill in both fields.');
  }
});

// User login
loginBtn.addEventListener('click', function () {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const user = JSON.parse(localStorage.getItem(username));

  if (user && user.password === password) {
    loginContainer.classList.add('hidden');
    timerContainer.classList.remove('hidden');

    T.username = username;
    T.splits = user.splits;
    updateLeaderboard();
  } else {
    alert('Invalid username or password.');
  }
});}
catch(error){
  console.error("error in script.js")
}
console.log("hello")