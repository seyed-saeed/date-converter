  function showPrayerForm() {
  document.getElementById("prayer-wrapper").classList.remove("hidden");
}

function updateFields() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  document.getElementById("shamsi-fields").classList.add("hidden");
  document.getElementById("miladi-fields").classList.add("hidden");
  document.getElementById("hijri-fields").classList.add("hidden");

  if (mode === "shamsi") {
    document.getElementById("shamsi-fields").classList.remove("hidden");
  } else if (mode === "miladi") {
    document.getElementById("miladi-fields").classList.remove("hidden");
  } else if (mode === "hijri") {
    document.getElementById("hijri-fields").classList.remove("hidden");
  }
}

function typeTitle(text) {
  const titleEl = document.getElementById("type-title");
  titleEl.innerHTML = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      titleEl.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }
  type();
}

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const clock = document.getElementById("clock");
  if (clock) {
    clock.innerHTML = `🕒 ساعت فعلی: ${time}`;
  }
}

setInterval(updateClock, 1000);
updateClock();

// دریافت لیست شهرها (اگر cities.json هست)
let cities = [];

fetch("static/cities.json")
  .then(res => res.json())
  .then(data => cities = data);

window.addEventListener("load", function () {
  updateFields();
});
<p style="margin-top: 15px;">
  <a href="#" id="qiblaToggle" onclick="toggleQibla(event)">قبله نما</a>
</p>

<div id="qiblaBox" style="display:none; max-width:700px; margin:auto; border-radius:12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); overflow:hidden;">
  <iframe src="https://www.qiblafinder.org/IR" width="100%" height="600" style="border:none; border-radius:12px 12px 0 0;"></iframe>
  <div style="background:#f5f5f5; padding:10px; text-align:center; font-family: Vazir, sans-serif; border-radius: 0 0 12px 12px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100" style="margin:auto; display:block;">
      <circle cx="50" cy="50" r="45" stroke="#0077cc" stroke-width="4" fill="#e0f0ff" />
      <polygon points="50,10 57,50 50,45 43,50" fill="#0077cc"/>
      <text x="50" y="90" font-size="12" font-family="Vazir,sans-serif" fill="#0077cc" text-anchor="middle">شمال</text>
    </svg>
  </div>
</div>
function toggleQibla(event) {
  event.preventDefault();
  const box = document.getElementById('qiblaBox');
  const toggleLink = document.getElementById('qiblaToggle');
  
  if (box.style.display === 'block') {
    box.style.display = 'none';
    toggleLink.textContent = '🧭قبله نما';
  } else {
    box.style.display = 'block';
    toggleLink.textContent = '🧭بستن قبله نما';
  }
}
