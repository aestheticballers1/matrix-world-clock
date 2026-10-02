from flask import Flask, render_template
import pycountry
import pytz

app = Flask(__name__)


def country_flag(code):
    """Convert an ISO alpha-2 code into a flag emoji."""
    return "".join(
        chr(ord(char) + 127397)
        for char in code.upper()
    )


def timezone_location(timezone):
    """Convert an IANA timezone into a readable location."""
    return timezone.rsplit("/", 1)[-1].replace("_", " ").upper()


def build_country_data():
    """Build countries with all their available timezones."""

    countries = []

    for country in pycountry.countries:

        timezones = pytz.country_timezones.get(
            country.alpha_2,
            []
        )

        if not timezones:
            continue

        timezone_data = [
            {
                "timezone": timezone,
                "location": timezone_location(timezone)
            }
            for timezone in timezones
        ]

        countries.append({
            "name": country.name,
            "code": country.alpha_3,
            "flag": country_flag(country.alpha_2),
            "timezones": timezone_data
        })

    return countries


# Build once when Flask starts.
COUNTRIES = build_country_data()

COUNTRY_COUNT = len(COUNTRIES)

TIMEZONE_COUNT = sum(
    len(country["timezones"])
    for country in COUNTRIES
)


@app.route("/")
def home():

    return render_template(
        "index.html",
        countries=COUNTRIES,
        country_count=COUNTRY_COUNT,
        timezone_count=TIMEZONE_COUNT
    )


if __name__ == "__main__":
    app.run(debug=True)
