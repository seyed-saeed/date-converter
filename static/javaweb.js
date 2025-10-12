// نمایش فرم اوقات شرعی
function showPrayerForm() {
  document.getElementById("prayer-wrapper").classList.remove("hidden");
}

// بروزرسانی فیلدهای تبدیل تاریخ
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

// تایپ انیمیشن عنوان
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

// بروزرسانی ساعت زنده
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const clock = document.getElementById("clock");
  if (clock) clock.innerHTML = `🕒 ساعت فعلی: ${time}`;
}

setInterval(updateClock, 1000);
updateClock();

// دریافت لیست شهرها (اگر cities.json موجود باشد)
let cities = [];
fetch("static/cities.json")
  .then(res => res.json())
  .then(data => cities = data);

window.addEventListener("load", function () {
  updateFields();
});

// تابع toggle قبله‌نما
function toggleQibla(event) {
  event.preventDefault();
  const box = document.getElementById('qiblaBox');
  const toggleLink = document.getElementById('qiblaToggle');

  if (box.style.display === 'block') {
    box.style.opacity = 0;
    toggleLink.textContent = "🕋 قبله‌نما";
    setTimeout(() => { box.style.display = 'none'; }, 400);
  } else {
    box.style.display = 'block';
    setTimeout(() => { box.style.opacity = 1; }, 10);
    toggleLink.textContent = "🕋 بستن قبله‌نما";
    // اگر قرآن بازه، ببندش
    const quranBox = document.getElementById('quranBox');
    const quranToggle = document.getElementById('quranToggle');
    if (quranBox.style.display === 'block') {
      quranBox.style.opacity = 0;
      setTimeout(() => { quranBox.style.display = 'none'; }, 400);
      quranToggle.textContent = "📖 قرآن صوتی";
    }
  }
}

// تابع toggle قرآن صوتی
function toggleQuran(event) {
  event.preventDefault();
  const box = document.getElementById('quranBox');
  const toggleLink = document.getElementById('quranToggle');

  if (box.style.display === 'block') {
    box.style.opacity = 0;
    toggleLink.textContent = "📖 قرآن صوتی";
    setTimeout(() => { box.style.display = 'none'; }, 400);
  } else {
    box.style.display = 'block';
    setTimeout(() => { box.style.opacity = 1; }, 10);
    toggleLink.textContent = "📖 بستن قرآن صوتی";
    // اگر قبله نما بازه، ببندش
    const qiblaBox = document.getElementById('qiblaBox');
    const qiblaToggle = document.getElementById('qiblaToggle');
    if (qiblaBox.style.display === 'block') {
      qiblaBox.style.opacity = 0;
      setTimeout(() => { qiblaBox.style.display = 'none'; }, 400);
      qiblaToggle.textContent = "🕋 قبله‌نما";
    }
  }
}
