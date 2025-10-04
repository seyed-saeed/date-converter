from flask import Flask, render_template, request
import jdatetime
from hijri_converter import convert
import datetime
from dateutil.relativedelta import relativedelta
import requests

app = Flask(__name__)

# ماه‌های شمسی
shamsi_months = {
    1: "فروردین", 2: "اردیبهشت", 3: "خرداد", 4: "تیر",
    5: "مرداد", 6: "شهریور", 7: "مهر", 8: "آبان",
    9: "آذر", 10: "دی", 11: "بهمن", 12: "اسفند"
}

# نماد ماه شمسی
persian_zodiac = {
    1: "♈ قوچ (فروردین)", 2: "♉ گاو (اردیبهشت)", 3: "♊ دوپیکر (خرداد)",
    4: "♋ خرچنگ (تیر)", 5: "♌ شیر (مرداد)", 6: "♍ خوشه گندم (شهریور)",
    7: "♎ ترازو (مهر)", 8: "♏ عقرب (آبان)", 9: "♐ کمان‌دار (آذر)",
    10: "♑ بز (دی)", 11: "♒ دلو (بهمن)", 12: "♓ ماهی (اسفند)"
}

# نماد ماه قمری
hijri_symbols = {
    1: "🗡️ الشجاعة", 2: "🧭 الرحلة", 3: "🌸 النمو", 4: "🪴 السلام",
    5: "🧱 الثبات", 6: "🧤 العناية", 7: "🕊️ الروحانية", 8: "🎁 الكرم",
    9: "🔥 التطهير", 10: "🎉 التجديد", 11: "🧘 الهدوء", 12: "🕋 العبادة"
}
# نماد طالع‌بینی میلادی
zodiac_signs = [
    {"name": "Capricorn", "symbol": "♑", "start": (12, 22), "end": (1, 19)},
    {"name": "Aquarius", "symbol": "♒", "start": (1, 20), "end": (2, 18)},
    {"name": "Pisces", "symbol": "♓", "start": (2, 19), "end": (3, 20)},
    {"name": "Aries", "symbol": "♈", "start": (3, 21), "end": (4, 19)},
    {"name": "Taurus", "symbol": "♉", "start": (4, 20), "end": (5, 20)},
    {"name": "Gemini", "symbol": "♊", "start": (5, 21), "end": (6, 20)},
    {"name": "Cancer", "symbol": "♋", "start": (6, 21), "end": (7, 22)},
    {"name": "Leo", "symbol": "♌", "start": (7, 23), "end": (8, 22)},
    {"name": "Virgo", "symbol": "♍", "start": (8, 23), "end": (9, 22)},
    {"name": "Libra", "symbol": "♎", "start": (9, 23), "end": (10, 22)},
    {"name": "Scorpio", "symbol": "♏", "start": (10, 23), "end": (11, 21)},
    {"name": "Sagittarius", "symbol": "♐", "start": (11, 22), "end": (12, 21)},
]

# روزهای هفته
weekday_fa = {
    'Saturday': 'شنبه', 'Sunday': 'یک‌شنبه', 'Monday': 'دوشنبه',
    'Tuesday': 'سه‌شنبه', 'Wednesday': 'چهارشنبه',
    'Thursday': 'پنج‌شنبه', 'Friday': 'جمعه'
}
weekday_ar = {
    'Saturday': 'السبت', 'Sunday': 'الأحد', 'Monday': 'الاثنين',
    'Tuesday': 'الثلاثاء', 'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس', 'Friday': 'الجمعة'
}

# ماه‌های قمری
hijri_months = {
    1: "محرم", 2: "صفر", 3: "ربيع الأول", 4: "ربيع الآخر",
    5: "جمادى الأولى", 6: "جمادى الآخرة", 7: "رجب", 8: "شعبان",
    9: "رمضان", 10: "شوال", 11: "ذو القعدة", 12: "ذو الحجة"
}

def get_miladi_zodiac(month, day):
    for sign in zodiac_signs:
        sm, sd = sign["start"]
        em, ed = sign["end"]
        if (month == sm and day >= sd) or (month == em and day <= ed):
            return f"{sign['symbol']} {sign['name']}"
    return "Unknown"

def get_today_info():
    today_miladi = datetime.date.today()
    today_shamsi = jdatetime.date.fromgregorian(date=today_miladi)
    weekday_en = today_miladi.strftime('%A')
    weekday_farsi = weekday_fa.get(weekday_en, "نامشخص")
    return f"امروز {weekday_farsi} {today_miladi.strftime('%d %B %Y')} میلادیه، مطابق با تقویم شمسی {today_shamsi.day} {shamsi_months[today_shamsi.month]} {today_shamsi.year}"

def get_prayer_times(city="Mashhad"):
    try:
        response = requests.get(f"https://api.aladhan.com/v1/timingsByCity?city={city}&country=Iran&method=8")
        data = response.json()
        return data["data"]["timings"]
    except:
        return None

@app.route('/', methods=['GET', 'POST'])
def convert_date():
    result = {}
    years_shamsi = list(range(1310, 1481))
    years_miladi = list(range(1960, 2061))
    years_hijri = list(range(1340, 1491))
    days = list(range(1, 32))

    if request.method == 'POST':
        action = request.form.get("action")

        if action == "today":
            result["action"] = "today"
            result["today_text"] = get_today_info()
            today_miladi = datetime.date.today()
            hijri = convert.Gregorian(today_miladi.year, today_miladi.month, today_miladi.day).to_hijri()
            hijri_month_name = hijri_months.get(hijri.month, "نامشخص")
            result["hijri_today"] = f"{hijri.year}/{hijri_month_name}/{hijri.day}"

        elif action == "prayer":
            result["action"] = "prayer"
            city = request.form.get("city", "").strip()
            if city:
                times = get_prayer_times(city)
                if times:
                    result["prayer_times"] = times
                    result["city_name"] = city
                else:
                    result["error"] = "اوقات شرعی برای این شهر پیدا نشد!"
            else:
                result["error"] = "لطفاً نام شهر را وارد کنید."

        elif action == "convert":
            result["action"] = "convert"
            mode = request.form.get("mode")

            try:
                if mode == "shamsi":
                    year = int(request.form['year'])
                    month = int(request.form['month'])
                    day = int(request.form['day'])
                    shamsi_date = jdatetime.date(year, month, day)
                    miladi_date = shamsi_date.togregorian()

                elif mode == "miladi":
                    year = int(request.form['year_m'])
                    month = int(request.form['month_m'])
                    day = int(request.form['day_m'])
                    miladi_date = datetime.date(year, month, day)
                    shamsi_date = jdatetime.date.fromgregorian(date=miladi_date)

                elif mode == "hijri":
                    year = int(request.form['year_h'])
                    month = int(request.form['month_h'])
                    day = int(request.form['day_h'])
    # تبدیل تاریخ قمری به میلادی
                    hijri_date = convert.Hijri(year, month, day)
                    miladi_gregorian = hijri_date.to_gregorian()
                    miladi_date = datetime.date(miladi_gregorian.year, miladi_gregorian.month, miladi_gregorian.day)
    # تبدیل میلادی به شمسی
                    shamsi_date = jdatetime.date.fromgregorian(date=miladi_date)
                # محاسبه تاریخ قمری
                hijri = convert.Gregorian(miladi_date.year, miladi_date.month, miladi_date.day).to_hijri()
                hijri_month_name = hijri_months.get(hijri.month, "نامشخص")
                hijri_str = f"{hijri.year}/{hijri_month_name}/{hijri.day}"

                # روز هفته
                weekday_en = miladi_date.strftime('%A')
                weekday_fa_str = weekday_fa.get(weekday_en, "نامشخص")
                weekday_ar_str = weekday_ar.get(weekday_en, "غير معروف")
                weekday_combined = f"{weekday_fa_str}، {weekday_en}، {weekday_ar_str}"

                # محاسبه سن
                today = datetime.date.today()
                age_days = (today - miladi_date).days
                delta = relativedelta(today, miladi_date)
                age_precise = f"{delta.years} سال، {delta.months} ماه، {delta.days} روز"

                # نماد ماه شمسی
                month_symbol = None
                if mode == "shamsi":
                    month_symbol = persian_zodiac.get(month)

                # نماد ماه قمری
                hijri_symbol = hijri_symbols.get(hijri.month)

                # نماد طالع‌بینی میلادی
                miladi_zodiac = get_miladi_zodiac(miladi_date.month, miladi_date.day)

                # ساخت خروجی نهایی
                result.update({
                    "shamsi": f"{shamsi_date.year}/{shamsi_months[shamsi_date.month]}/{shamsi_date.day}",
                    "miladi": miladi_date.strftime("%Y/%m/%d"),
                    "hijri": hijri_str,
                    "weekday": weekday_combined,
                    "age_days": age_days,
                    "age": age_precise,
                    "month_symbol": month_symbol,
                    "hijri_symbol": hijri_symbol,
                    "miladi_zodiac": miladi_zodiac
                })

            except Exception:
                result["error"] = "تاریخ وارد شده معتبر نیست!"

    return render_template(
        "index.html",
        years_shamsi=years_shamsi,
        years_miladi=years_miladi,
        years_hijri=years_hijri,
        days=days,
        shamsi_months=shamsi_months,
        miladi_months={
            1: "January", 2: "February", 3: "March", 4: "April",
            5: "May", 6: "June", 7: "July", 8: "August",
            9: "September", 10: "October", 11: "November", 12: "December"
        },
        hijri_months=hijri_months,
        result=result
    )

if __name__ == "__main__":
    app.run(debug=True)

