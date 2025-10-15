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

  if(!trigger || !card) return;

  // تنظیمات ظاهری کارت (پس‌زمینه سفید و متن آبی)
  card.style.position = "fixed";
  card.style.top = "20px";
  card.style.left = "50%";
  card.style.transform = "translateX(-50%)";
  card.style.opacity = 0;
  card.style.transition = "opacity 0.5s ease-in-out";
  card.style.zIndex = 9999;
  card.style.background = "rgba(255, 255, 255, 0.9)";
  card.style.color = "#0077cc"; // آبی برای متن
  card.style.border = "1px solid rgba(0, 119, 204, 0.3)";
  card.style.textAlign = "center";
  card.style.padding = "14px 18px";
  card.style.borderRadius = "10px";
  card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
  card.innerHTML = `<div id="day-name" style="font-weight:bold;font-size:16px;margin-bottom:6px;"></div>
                    <div id="dhikr-text" style="font-size:15px;line-height:1.6;font-weight:500;"></div>`;

  trigger.addEventListener("click", function(){
    const todayIndex = new Date().getDay();
    const dayName = allDays[todayIndex];

    document.getElementById("day-name").textContent = "ذکر " + dayName + ":";
    document.getElementById("dhikr-text").textContent = dhikr[dayName];

    // نمایش کارت از بالا
    card.style.display = "block";
    setTimeout(() => { card.style.opacity = 1; }, 10);

    // محو شدن بعد از ۶ ثانیه
    setTimeout(() => {
      card.style.opacity = 0;
      setTimeout(() => { card.style.display = "none"; }, 500);
    }, 6000);
  });
})();
// ✨ اسماء الهی ✨
(function() {
  const asma = [
    "اللّه (خداوند یکتا)",
    "الرّحمن (بسیار بخشنده)",
    "الرّحیم (بسیار مهربان)",
    "الملک (پادشاه هستی)",
    "القدّوس (منزّه از هر عیب)",
    "السلام (بخشنده آرامش)",
    "المؤمن (ایجادکننده ایمنی)",
    "المهیمن (نگهبان و مراقب)",
    "العزیز (توانای شکست‌ناپذیر)",
    "الجبار (اصلاح‌کننده و قاهر)",
    "الخالق (آفریننده)",
    "البارئ (پدیدآورنده)",
    "المصوّر (صورت‌بخشنده)",
    "الغفّار (بسیار آمرزنده)",
    "القهّار (چیره و پیروز)",
    "الوهّاب (بخشنده بزرگ)",
    "الرّزّاق (روزی‌دهنده)",
    "الفتّاح (گشاینده رحمت و روزی)",
    "العلیم (دانا و آگاه)",
    "الحلیم (بردبار)"
  ];

  const asmaBtn = document.getElementById("asma-trigger");
  if (!asmaBtn) return;

  asmaBtn.addEventListener("click", () => {
    const rand = Math.floor(Math.random() * asma.length);
    const name = asma[rand];

    // اگر قبلاً وجود دارد، حذفش کن
    const oldMsg = document.getElementById("asma-popup");
    if (oldMsg) oldMsg.remove();

    // ایجاد المان جدید برای پیام بالا
    const msg = document.createElement("div");
    msg.id = "asma-popup";
    msg.textContent = name;
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.background = "rgba(255, 255, 255, 0.9)";
    msg.style.padding = "14px 22px";
    msg.style.borderRadius = "12px";
    msg.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    msg.style.fontFamily = "Vazir, sans-serif";
    msg.style.fontSize = "1rem";
    msg.style.color = "#0077cc";
    msg.style.textAlign = "center";
    msg.style.zIndex = "99999";
    msg.style.opacity = "0";
    msg.style.transition = "opacity 0.5s ease, top 0.5s ease";
    document.body.appendChild(msg);

    // افکت ظاهر شدن
    setTimeout(() => {
      msg.style.opacity = "1";
      msg.style.top = "40px";
    }, 100);

    // بعد از ۶ ثانیه ناپدید شود
    setTimeout(() => {
      msg.style.opacity = "0";
      msg.style.top = "20px";
      setTimeout(() => msg.remove(), 500);
    }, 6000);
  });
})();
