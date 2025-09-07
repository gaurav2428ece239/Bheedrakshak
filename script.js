// Simple SPA navigation
function showPage(pageId) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }
  var target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

// Auth: store simple username in localStorage
function login() {
  var input = document.getElementById('username');
  if (!input) return;
  var name = (input.value || '').trim();
  if (!name) {
    alert('Please enter your name');
    return;
  }
  try {
    localStorage.setItem('br_user_name', name);
  } catch (e) {}
  var userDisplay = document.getElementById('userDisplay');
  if (userDisplay) userDisplay.textContent = name;
  var profileName = document.getElementById('profileName');
  if (profileName) profileName.textContent = name;
  showPage('dashboard');
  updateQR();
}

// On load: hydrate user
(function initUser() {
  try {
    var saved = localStorage.getItem('br_user_name');
    if (saved) {
      var userDisplay = document.getElementById('userDisplay');
      if (userDisplay) userDisplay.textContent = saved;
      var profileName = document.getElementById('profileName');
      if (profileName) profileName.textContent = saved;
    }
  } catch (e) {}
})();

// SOS
function triggerSOS() {
  var confirmed = confirm('Send an SOS alert to temple authorities?');
  if (!confirmed) return;
  alert('SOS sent! Authorities have been notified. Stay where you are.');
}

// Darshan booking (mock)
function bookDarshan() {
  var dateEl = document.getElementById('darshanDate');
  var timeEl = document.getElementById('darshanTime');
  var msgEl = document.getElementById('bookingMessage');
  var date = dateEl && dateEl.value;
  var time = timeEl && timeEl.value;
  if (!date || !time) {
    if (msgEl) msgEl.textContent = 'Please select both date and time.';
    return;
  }
  if (msgEl) msgEl.textContent = 'Slot booked for ' + date + ' at ' + time + '. Check email for confirmation.';
}

// Crowd status (mock)
function updateCrowdStatus() {
  var statusEl = document.getElementById('crowdStatus');
  if (!statusEl) return;
  var states = [
    'Low crowd. Ideal time to visit.',
    'Moderate crowd. Expect short queues.',
    'High crowd. Expect longer waiting time.',
    'Very high crowd. Consider postponing.'
  ];
  var idx = Math.floor(Math.random() * states.length);
  statusEl.textContent = states[idx];
}

// Feedback
function submitFeedback() {
  var area = document.getElementById('feedback');
  var msg = document.getElementById('feedbackMsg');
  var text = (area && area.value || '').trim();
  if (!text) {
    if (msg) msg.textContent = 'Please write your feedback first.';
    return;
  }
  if (msg) msg.textContent = 'Thank you for your feedback!';
  if (area) area.value = '';
}

// Donations
function donate() {
  alert('Redirecting to secure donation gateway...');
}

// Profile photo upload (mock validation)
(function setupProfilePicUpload() {
  var input = document.getElementById('profilePic');
  if (!input) return;
  input.addEventListener('change', function () {
    var status = document.getElementById('picStatus');
    if (!input.files || !input.files[0]) {
      if (status) status.textContent = 'No file selected';
      return;
    }
    var file = input.files[0];
    if (!/^image\//.test(file.type)) {
      if (status) status.textContent = 'Please upload an image file.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      if (status) status.textContent = 'File too large. Max 2MB.';
      return;
    }
    if (status) status.textContent = 'Image selected: ' + file.name;
  });
})();

// Chatbot (very simple echo with canned intents)
function sendChat() {
  var input = document.getElementById('chatInput');
  var box = document.getElementById('chatBox');
  if (!input || !box) return;
  var text = (input.value || '').trim();
  if (!text) return;
  appendChat('user', text);
  input.value = '';
  setTimeout(function () {
    var reply = botReply(text);
    appendChat('bot', reply);
  }, 300);
}

function appendChat(sender, text) {
  var box = document.getElementById('chatBox');
  if (!box) return;
  var div = document.createElement('div');
  div.className = 'chat-message ' + (sender === 'user' ? 'user' : 'bot');
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function botReply(text) {
  var lower = text.toLowerCase();
  if (lower.indexOf('aarti') >= 0 || lower.indexOf('arti') >= 0) return 'Next Aarti at 6:30 PM near the main sanctum.';
  if (lower.indexOf('crowd') >= 0) return 'Crowd is moderate right now. Entry through Gate 2 is faster.';
  if (lower.indexOf('darshan') >= 0 || lower.indexOf('book') >= 0) return 'Use the Darshan Slot Booking card in Dashboard to book a slot.';
  if (lower.indexOf('lost') >= 0) return 'Please report lost items at the Lost & Found counter near Exit Gate.';
  return 'I did not understand that. Try asking about Aarti, crowd, or booking.';
}

// QR Code generation (lightweight, canvas-only, no libs)
// This is NOT a full QR spec implementation, but a simple visual identifier
function updateQR() {
  var canvas = document.getElementById('qrCanvas');
  var msg = document.getElementById('qrMsg');
  if (!canvas || !msg) return;
  var ctx = canvas.getContext('2d');
  var size = 180;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  var name = '';
  try { name = localStorage.getItem('br_user_name') || ''; } catch (e) {}
  if (!name) {
    msg.textContent = 'Login to generate your unique QR Code.';
    return;
  }
  msg.textContent = 'Show this QR at entry.';

  // Create a pseudo-random pattern seeded by name
  var seed = 0;
  for (var i = 0; i < name.length; i++) seed = (seed * 31 + name.charCodeAt(i)) >>> 0;
  var cells = 29; // like QR v3 feel
  var cellSize = Math.floor(size / cells);
  var margin = Math.floor((size - cells * cellSize) / 2);
  ctx.fillStyle = '#0f172a';

  for (var y = 0; y < cells; y++) {
    for (var x = 0; x < cells; x++) {
      // Keep finder-like corners always dark for aesthetics
      var inTL = x < 7 && y < 7;
      var inTR = x > cells - 8 && y < 7;
      var inBL = x < 7 && y > cells - 8;
      var on = inTL || inTR || inBL;
      if (!on) {
        // xorshift-ish
        seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
        on = (seed & 1) === 1;
      }
      if (on) {
        ctx.fillRect(margin + x * cellSize, margin + y * cellSize, cellSize, cellSize);
      }
    }
  }
}

// Keep QR updated when navigating to QR page
document.addEventListener('click', function (e) {
  var t = e.target;
  if (t && t.tagName === 'BUTTON' && typeof t.getAttribute === 'function') {
    var onclick = t.getAttribute('onclick') || '';
    if (onclick.indexOf("showPage('qrcode')") >= 0) {
      setTimeout(updateQR, 50);
    }
  }
});

// Init some defaults
document.addEventListener('DOMContentLoaded', function () {
  updateCrowdStatus();
  updateQR();
});


