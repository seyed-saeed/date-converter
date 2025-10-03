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

# روزهای هفته به فارسی
weekday_fa = {
    'Saturday': 'شنبه', 'Sunday': 'یک‌شنبه', 'Monday': 'دوشنبه',
    'Tuesday': 'سه‌شنبه', 'Wednesday': 'چهارشنبه',
    'Thursday': 'پنج‌شنبه', 'Friday': 'جمعه'
}

# روزهای هفته به عربی
weekday_ar = {
    'Saturday': 'السبت', 'Sunday': 'الأحد', 'Monday': 'الاثنين',
    'Tuesday': 'الثلاثاء', 'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس', 'Friday': 'الجمعة'
}

# ماه‌های قمری به عربی
hijri_months = {
    1: "محرم", 2: "صفر", 3: "ربيع الأول", 4: "ربيع الآخر",
    5: "جمادى الأولى", 6: "جمادى الآخرة", 7: "رجب", 8: "شعبان",
    9: "رمضان", 10: "شوال", 11: "ذو القعدة", 12: "ذو الحجة"
}

def extract_number(text):
    digits = ''.join(c for c in text if c.isdigit())
    return int(digits) if digits else None

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
    years = list(range(1310, 1481))
    days = list(range(1, 32))

    if request.method == 'POST':
        action = request.form.get("action")

        if action == "today":
            result["today_text"] = get_today_info()

        elif action == "prayer":
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

        else:
            try:
                year = extract_number(request.form['year'])
                month = extract_number(request.form['month'])
                day = extract_number(request.form['day'])

                if not (year and month and day):
                    raise ValueError("ورودی عددی معتبر نیست")

                shamsi_date = jdatetime.date(year, month, day)
                miladi_date = shamsi_date.togregorian()

                hijri = convert.Gregorian(miladi_date.year, miladi_date.month, miladi_date.day).to_hijri()
                hijri_month_name = hijri_months.get(hijri.month, "نامشخص")
                hijri_str = f"{hijri.year}/{hijri_month_name}/{hijri.day}"

                weekday_en = miladi_date.strftime('%A')
                weekday_farsi = weekday_fa.get(weekday_en, "نامشخص")
                weekday_arabic = weekday_ar.get(weekday_en, "غير معروف")
                weekday_combined = f"{weekday_farsi}، {weekday_en}، {weekday_arabic}"

                today = datetime.date.today()
                age_days = (today - miladi_date).days
                delta = relativedelta(today, miladi_date)
                age_precise = f"{delta.years} سال، {delta.months} ماه، {delta.days} روز"

                result = {
                    'shamsi': f"{shamsi_date.year}/{shamsi_months[shamsi_date.month]}/{shamsi_date.day}",
                    'miladi': miladi_date.strftime('%Y/%m/%d'),
                    'hijri': hijri_str,
                    'weekday': weekday_combined,
                    'age_days': age_days,
                    'age': age_precise
                }

            except Exception:
                result = {'error': 'تاریخ وارد شده معتبر نیست!'}

    return render_template('index.html', years=years, days=days, shamsi_months=shamsi_months, result=result)

if __name__ == '__main__':
    app.run(debug=True)
