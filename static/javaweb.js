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
(function(){
  const facts = [
    "قرآن 114 سوره دارد و هر سوره پیام خاصی دارد.",
    "نخستین سوره‌ای که نازل شد، سوره علق بود.",
    "امام علی (ع) نخستین مفسر قرآن بود.",
    "سوره یاسین به «قلب قرآن» معروف است.",
    "امام صادق (ع) فرمود: قرآن زنده است و همیشه کاربرد دارد.",
    "کلمه «رحمت» بیش از 70 بار در قرآن آمده است.",
    "امام حسین (ع) در عاشورا با آیات قرآن با دشمنان صحبت کرد.",
    "بعضی سوره‌ها مانند سوره الرحمن با آیات تکراری تاکید دارند.",
    "سوره نمل تنها سوره‌ای است که آیه «بسم‌الله» دو بار در آن آمده.",
    "امام سجاد (ع) در دعاهایش از آیات قرآن بهره می‌گرفت.",
    "در قرآن، نام 25 پیامبر به‌صورت مستقیم آمده است.",
    "سوره کوثر، کوتاه‌ترین سوره قرآن است.",
    "سوره بقره، طولانی‌ترین سوره قرآن است.",
    "واژه «قرآن» 70 بار در خود قرآن آمده است.",
    "قرآن از نظر ادبی، بالاترین سطح فصاحت را دارد.",
    "بیشترین قسم‌های قرآن در سوره شمس است.",
    "در سوره نور آیه‌ای درباره حجاب آمده است.",
    "نام حضرت مریم (س) 34 بار در قرآن آمده.",
    "هیچ زنی جز حضرت مریم (س) نامش در قرآن نیامده.",
    "پیامبر (ص) گفتند: بهترین شما کسی‌ست که قرآن بیاموزد و بیاموزاند.",
    "سوره حمد در هر نماز واجب خوانده می‌شود.",
    "امام علی (ع): با قرآن باشید که راه نجات است.",
    "امام زمان (عج) قرآن را با تأویل کامل اجرا می‌کند.",
    "سوره توبه تنها سوره‌ای است که بسم‌الله ندارد.",
    "سوره فلق و ناس، سوره‌های محافظت هستند.",
    "امام باقر (ع) فرمود: قرآن برای همه زمان‌هاست.",
    "هر سوره‌ای آغاز و پایانی حکیمانه دارد.",
    "کلمه «علم» بیش از 700 بار در قرآن تکرار شده.",
    "آیات بسیاری درباره علم، تفکر و تدبر است.",
    "امام رضا (ع) فرمود: هر مشکلی را با قرآن حل کن."
  ];

  const estekharehAyat = [
  {
    text: "فَإِنَّ مَعَ الْعُسْرِ یُسْرًا (سوره شرح ۵)",
    result: "خوب است، گشایش و آسانی در راه است.",
    advice: "صبور باشید و امید خود را از دست ندهید.",
    type: "good"
  },
  {
    text: "إِنَّ الإِنسَانَ لَفِی خُسْرٍ (سوره عصر ۲)",
    result: "بد است، احتمال ضرر یا زیان وجود دارد.",
    advice: "مراقب تصمیم‌ها و رفتار خود باشید.",
    type: "bad"
  },
  {
    text: "وَعَسَى أَنْ تَکْرَهُوا شَیْئًا وَهُوَ خَیْرٌ لَّکُمْ (سوره بقره ۲۱۶)",
    result: "خوب است، چیزی که فکر می‌کنید بد است، ممکن است خیر باشد.",
    advice: "صبور باشید و به حکمت خداوند اعتماد کنید.",
    type: "good"
  },
  {
    text: "کَذَّبَتْ قَبْلَهُمْ قَوْمُ نُوحٍ (سوره قمر ۹)",
    result: "بد است، هشدار به رد شدن یا مخالفت با تصمیم.",
    advice: "مواظب اطرافیان و دوستان باشید.",
    type: "bad"
  },
  {
    text: "إِنَّ اللَّهَ مَعَ الصَّابِرِینَ (سوره بقره ۱۵۳)",
    result: "خوب است، با صبر و بردباری پیروز خواهید شد.",
    advice: "صبوری و استقامت کلید موفقیت شماست.",
    type: "good"
  },
  {
    text: "وَیَدْعُ الْإِنسَانُ بِالشَّرِّ (سوره اسراء ۱۱)",
    result: "بد است، عجله نکنید و با فکر عمل کنید.",
    advice: "از تصمیمات سریع و بدون فکر پرهیز کنید.",
    type: "bad"
  },
  {
    text: "سَیَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ یُسْرًا (سوره طلاق ۷)",
    result: "خوب است، پس از سختی راحتی و آرامش خواهد آمد.",
    advice: "امید خود را از دست ندهید و توکل کنید.",
    type: "good"
  },
  {
    text: "وَلا تَهِنُوا وَلا تَحْزَنُوا (سوره آل عمران ۱۳۹)",
    result: "خوب است، قوی باشید و ناامید نشوید.",
    advice: "با قدرت و امید به جلو حرکت کنید.",
    type: "good"
  },
  {
    text: "یَا أَیُّهَا الَّذِینَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ (سوره بقره ۱۵۳)",
    result: "خوب است، با صبر و نماز کمک بگیرید.",
    advice: "به یاد خدا باشید و از او یاری طلبید.",
    type: "good"
  },
  {
    text: "إِنَّ مَعَ الْعُسْرِ یُسْرًا (سوره انشراح ۶)",
    result: "خوب است، نشانه‌ی گشایش و راحتی است.",
    advice: "دل‌تان را قوی نگه دارید و امیدوار باشید.",
    type: "good"
  },
  {
    text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ (سوره نصر ۱)",
    result: "خوب است، یاری خداوند نزدیک است.",
    advice: "شکرگزار باشید و به تلاش ادامه دهید.",
    type: "good"
  },
  {
    text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا (سوره طلاق ۲)",
    result: "خوب است، راه نجات و گشایش فراهم می‌شود.",
    advice: "تقوا پیشه کنید و اعتماد داشته باشید.",
    type: "good"
  },
  {
    text: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُوا مَا بِأَنفُسِهِمْ (سوره رعد ۱۱)",
    result: "خوب است، تغییر به دست خود شماست.",
    advice: "ابتدا در خود تغییر ایجاد کنید.",
    type: "good"
  },
  {
    text: "قُلْ إِنَّ صَلَاتِی وَنُسُكِی وَمَحْیَایَ وَمَمَاتِی لِلَّهِ رَبِّ الْعَالَمِينَ (سوره انعام 162)",
    result: "خوب است، هدف زندگی بندگی است.",
    advice: "بر مسیر بندگی و پاکی پایدار باشید.",
    type: "good"
  },
  {
    text: "إِنَّ رَبِّي عَلىٰ صِرَاطٍ مُسْتَقِيمٍ (سوره هود 56)",
    result: "خوب است، در مسیر درست هستید.",
    advice: "به راهتان ادامه دهید و صبر داشته باشید.",
    type: "good"
  },
  {
    text: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ (سوره یوسف 87)",
    result: "خوب است، ناامیدی ممنوع است.",
    advice: "امید خود را حفظ کنید و تسلیم نشوید.",
    type: "good"
  },
  {
    text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ (سوره بقره 153)",
    result: "خوب است، از صبر و نماز یاری بگیرید.",
    advice: "در سختی‌ها به خدا توکل کنید.",
    type: "good"
  },
  {
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ (سوره توحید ۱)",
    result: "خوب است، توحید پایه و اساس ایمان است.",
    advice: "ایمان خود را تقویت کنید.",
    type: "good"
  },
  {
    text: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ (سوره فیل ۱)",
    result: "خوب است، یاری الهی در راه است.",
    advice: "به قدرت خداوند ایمان داشته باشید.",
    type: "good"
  },
  {
    text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا (سوره احزاب ۷۰)",
    result: "خوب است، تقوا و صداقت راهگشا است.",
    advice: "سخنان خود را با دقت انتخاب کنید.",
    type: "good"
  },
  {
    text: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ (سوره غافر ۶۰)",
    result: "خوب است، دعا مستجاب است.",
    advice: "با ایمان دعا کنید و منتظر پاسخ باشید.",
    type: "good"
  },
  {
    text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَهُ مِنْ أَمْرِهِ يُسْرًا (سوره طلاق 4)",
    result: "خوب است، تقوا سبب آسانی امور است.",
    advice: "تقوای الهی را رعایت کنید.",
    type: "good"
  },
  {
    text: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ (سوره آل عمران 159)",
    result: "خوب است، توکل بر خدا راه موفقیت است.",
    advice: "به خدا توکل کنید و اعتماد داشته باشید.",
    type: "good"
  },
  {
    text: "يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ (سوره بقره 21)",
    result: "خوب است، عبادت راه رستگاری است.",
    advice: "به عبادت و بندگی اهتمام ورزید.",
    type: "good"
  },
  {
    text: "قَدْ أَفْلَحَ مَن تَزَكَّىٰ (سوره مؤمنون 1)",
    result: "خوب است، تزکیه و پاکی رمز موفقیت است.",
    advice: "در اصلاح نفس کوشا باشید.",
    type: "good"
  },
  {
    text: "وَمَن يُؤْمِن بِاللَّهِ وَالْيَوْمِ الْآخِرِ (سوره بقره 4)",
    result: "خوب است، ایمان ریشه‌ی هر موفقیتی است.",
    advice: "ایمان خود را حفظ کنید و تقویت نمایید.",
    type: "good"
  },
  {
    text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ (سوره توبه 119)",
    result: "خوب است، همراهی با صادقین مفید است.",
    advice: "دوستان صالح انتخاب کنید.",
    type: "good"
  },
  {
    text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا (سوره شرح 6)",
    result: "خوب است، بعد از سختی، آسانی می‌آید.",
    advice: "امیدوار باشید و ناامید نشوید.",
    type: "good"
  },
  {
    text: "إِنَّ اللَّهَ يُحِبُّ الْمُتَّقِينَ (سوره توبه 4)",
    result: "خوب است، خداوند پرهیزکاران را دوست دارد.",
    advice: "تقوا پیشه کنید و در راه خدا باشید.",
    type: "good"
  },
  {
    text: "يَا أَيُّهَا النَّبِيُّ قُل لِّأَزْوَاجِكَ وَبَنَاتِكَ وَنِسَاءِ الْمُؤْمِنِينَ (سوره احزاب 59)",
    result: "خوب است، حفاظت و مراقبت مهم است.",
    advice: "در زندگی مراقب باشید و حواس جمع.",
    type: "good"
  },
  {
    text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ (سوره بقره 186)",
    result: "خوب است، خداوند نزدیک است.",
    advice: "با توکل به خدا آرامش یابید.",
    type: "good"
  }
];
  function showCard(content, type = "neutral") {
    const card = document.getElementById("popup-card");
    card.innerHTML = content;
    card.style.position = "fixed";
    card.style.top = "20px";
    card.style.left = "50%";
    card.style.transform = "translateX(-50%)";
    card.style.background = "rgba(255, 255, 255, 0.95)";
    card.style.color = type === "bad" ? "#d8000c" : "#0077cc";
    card.style.border = type === "bad" ? "1px solid #d8000c" : "1px solid rgba(0, 119, 204, 0.3)";
    card.style.textAlign = "center";
    card.style.padding = "20px 24px";
    card.style.borderRadius = "12px";
    card.style.boxShadow = type === "bad" ? "0 8px 20px rgba(216, 0, 12, 0.4)" : "0 8px 20px rgba(0,119,204,0.25)";
    card.style.zIndex = 9999;
    card.style.display = "block";
    card.style.opacity = 0;
    card.style.transition = "opacity 0.5s ease-in-out";

    setTimeout(() => { card.style.opacity = 1; }, 10);
    setTimeout(() => {
      card.style.opacity = 0;
      setTimeout(() => { card.style.display = "none"; }, 500);
    }, 6000);
  }

  document.getElementById("quran-fact-trigger").addEventListener("click", () => {
    const rand = facts[Math.floor(Math.random() * facts.length)];
    showCard(`<strong>دانستنی قرآنی:</strong><br>${rand}`);
  });

  document.getElementById("estekhareh-trigger").addEventListener("click", () => {
    const rand = estekharehAyat[Math.floor(Math.random() * estekharehAyat.length)];
    const html = `
      <strong>استخاره:</strong><br>
      <blockquote style="font-size: 1.1rem; margin: 12px 0; direction: rtl;">${rand.text}</blockquote>
      <p style="font-weight: bold; margin: 8px 0; color: ${rand.type === "bad" ? "#d8000c" : "#0077cc"};">نتیجه: ${rand.result}</p>
      <p style="font-style: italic; font-size: 0.9rem; color: #555;">توصیه: ${rand.advice}</p>
    `;
    showCard(html, rand.type);
  });
})();
