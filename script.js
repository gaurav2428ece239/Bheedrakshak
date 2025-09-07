function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---------------- Login ----------------
function login() {
  const name = document.getElementById("username").value;
  if (name.trim() === "") { alert("Enter your name!"); return; }
  localStorage.setItem("user", name);
  document.getElementById("userDisplay").textContent = name;
  document.getElementById("profileName").textContent = name;
  showPage("dashboard");
}

// ---------------- SOS ----------------
function triggerSOS() {
  alert("🚨 SOS Alert Sent to Temple Authorities!");
}

// ---------------- Darshan Booking ----------------
function bookDarshan() {
  const date = document.getElementById("darshanDate").value;
  const time = document.getElementById("darshanTime").value;
  const msg = document.getElementById("bookingMessage");
  if (!date) { msg.textContent = "⚠️ Please select a date."; msg.style.color = "red"; return; }
  msg.textContent = `✅ Slot booked for ${date} at ${time}`;
  msg.style.color = "green";
}

// ---------------- Crowd Density ----------------
function updateCrowdStatus() {
  const levels = ["🟢 Low (Safe)", "🟡 Medium (Manageable)", "🔴 High (Avoid)"];
  const randomStatus = levels[Math.floor(Math.random() * levels.length)];
  document.getElementById("crowdStatus").textContent = `Current Crowd: ${randomStatus}`;
}
setInterval(updateCrowdStatus, 5000);

// ---------------- Profile Pic ----------------
document.getElementById("profilePic").addEventListener("change", () => {
  document.getElementById("picStatus").textContent = "✅ Profile picture uploaded!";
});

// ---------------- Chatbot ----------------
function sendChat() {
  const input = document.getElementById("chatInput").value;
  if (!input) return;
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
  let reply = "🙏 Jai Shree Ram! Please contact temple help desk.";
  if (input.toLowerCase().includes("timing")) reply = "⏰ Temple opens at 5:00 AM and closes at 9:00 PM.";
  if (input.toLowerCase().includes("crowd")) reply = "👥 Current crowd status is shown in Dashboard.";
  if (input.toLowerCase().includes("aarti")) reply = "🕔 Aarti Timings: 6 AM, 12:30 PM, 6:30 PM, 8:30 PM.";
  chatBox.innerHTML += `<p><strong>Bot:</strong> ${reply}</p>`;
  document.getElementById("chatInput").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------------- Feedback ----------------
function submitFeedback() {
  const feedback = document.getElementById("feedback").value;
  if (!feedback.trim()) {
    document.getElementById("feedbackMsg").textContent = "⚠️ Please write something.";
    document.getElementById("feedbackMsg").style.color = "red";
    return;
  }
  document.getElementById("feedbackMsg").textContent = "✅ Thanks for your feedback!";
  document.getElementById("feedbackMsg").style.color = "green";
  document.getElementById("feedback").value = "";
}

// ---------------- Donation ----------------
function donate() {
  alert("🙏 Thank you for supporting temple services and crowd safety!");
}
// ---------------- QR Code ----------------
let qr;

// function generateQRCode(name) {
//   if (!qr) {
//     qr = new QRious({
//       element: document.getElementById("qrCanvas"),
//       size: 200,
//       value: name
//     });
//   } else {
//     qr.value = name;
//   }
//   document.getElementById("qrMsg").textContent = `📱 QR Code generated for ${name}`;
// }

// Generate QR after login
function login() {
  const name = document.getElementById("username").value;
  if (name.trim() === "") { alert("Enter your name!"); return; }
  localStorage.setItem("user", name);
  document.getElementById("userDisplay").textContent = name;
  document.getElementById("profileName").textContent = name;
  generateQRCode(name);  // QR code created here
  showPage("dashboard");
}

