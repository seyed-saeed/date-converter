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

  // اوقات شرعی با لیست شهرها
  let cities = [];

  fetch("static/cities.json")
    .then(res => res.json())
    .then(data => cities = data);

  window.addEventListener("load", function () {
    updateFields();

    {% if result and result.action == "convert" %}
      typeTitle("تبدیل تاریخ");
    {% elif result and result.action == "today" %}
      typeTitle("تاریخ امروز");
    {% elif result and result.action == "prayer" %}
      typeTitle("اوقات شرعی");
    {% else %}
      typeTitle("تاریخ‌یار");
    {% endif %}
  });

