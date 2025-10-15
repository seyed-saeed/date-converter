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
(function(){
  const dhikr = {
    "شنبه": "یا رب العالمین",
    "یکشنبه": "یا ذاالجلال و الاکرام",
    "دوشنبه": "یا قاضی الحاجات",
    "سه‌شنبه": "یا ارحم الراحمین",
    "چهارشنبه": "یا حی یا قیوم",
    "پنج‌شنبه": "لا اله الا الله الملک الحق المبین",
    "جمعه": "اللهم صل علی محمد و آل محمد"
  };

  const allDays = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];

  const trigger = document.getElementById("weekly-dhikr-trigger");
  const card = document.getElementById("weekly-dhikr-card");
  const closeBtn = document.getElementById("close-dhikr-card");

  if(!trigger || !card || !closeBtn) return;

  // آماده‌سازی کارت برای انیمیشن
  card.style.position = "fixed";
  card.style.top = "20px"; // بالای صفحه
  card.style.left = "50%";
  card.style.transform = "translateX(-50%)";
  card.style.opacity = 0;
  card.style.transition = "opacity 0.5s ease-in-out";
  card.style.zIndex = 9999;

  trigger.addEventListener("click", function(e){
    const todayIndex = new Date().getDay();
    const dayName = allDays[todayIndex];

    document.getElementById("day-name").textContent = "ذکر " + dayName + ":";
    document.getElementById("dhikr-text").textContent = dhikr[dayName];

    // نمایش کارت
    card.style.display = "block";
    setTimeout(() => { card.style.opacity = 1; }, 10);

    // بعد از 6 ثانیه کارت محو شود
    setTimeout(() => {
      card.style.opacity = 0;
      setTimeout(() => { card.style.display = "none"; }, 500); // بعد از fade out کامل
    }, 6000);
  });

  closeBtn.addEventListener("click", function() {
    card.style.opacity = 0;
    setTimeout(() => { card.style.display = "none"; }, 500);
  });
})();
