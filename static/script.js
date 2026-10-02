"use strict";


/* =========================================
   WORLD CLOCK
   ========================================= */

const clocks = document.querySelectorAll(".clock-card");


const clockData = [...clocks].map(card => ({
    card,
    timezone: card.dataset.timezone,
    time: card.querySelector(".clock-time"),
    date: card.querySelector(".date")
}));


const formatters = new Map();


function getFormatter(timezone, options) {

    const key =
        `${timezone}-${JSON.stringify(options)}`;

    if (!formatters.has(key)) {
        formatters.set(
            key,
            new Intl.DateTimeFormat(
                "en-GB",
                {
                    ...options,
                    timeZone: timezone
                }
            )
        );
    }

    return formatters.get(key);
}


function updateClocks() {

    const now = new Date();


    clockData.forEach(clock => {

        const timeFormatter = getFormatter(
            clock.timezone,
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        );


        const dateFormatter = getFormatter(
            clock.timezone,
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


        clock.time.textContent =
            timeFormatter.format(now);

        clock.date.textContent =
            dateFormatter.format(now);

    });

}


updateClocks();

setInterval(updateClocks, 1000);
/* =========================================
   SEARCH / FILTER
   ========================================= */

const searchInput =
    document.getElementById("clock-search");

const clearSearch =
    document.getElementById("clear-search");

const resultCount =
    document.getElementById("result-count");

const noResults =
    document.getElementById("no-results");


const countrySections =
    [
        ...document.querySelectorAll(
            ".country-section"
        )
    ];


function filterCountries() {

    const query = searchInput.value
        .trim()
        .toLowerCase();

    let visibleCountries = 0;


    countrySections.forEach(section => {

        const country =
            section.dataset.country.trim();

        const code =
            section.dataset.code.trim();


        const locations =
            section.dataset.locations
                .split("|")
                .map(value => value.trim())
                .filter(Boolean);


        const timezones =
            section.dataset.timezones
                .split("|")
                .map(value => value.trim())
                .filter(Boolean);


        let matches = false;


        /*
         * EMPTY SEARCH
         * Show everything.
         */

        if (!query) {

            matches = true;

        }


        /*
         * COUNTRY SEARCH
         *
         * Exact match only.
         *
         * India → India
         * IND   → India
         */

        else if (
            query === country ||
            query === code
        ) {

            matches = true;

        }


        /*
         * LOCATION SEARCH
         *
         * Example:
         *
         * kolkata
         * tokyo
         * new york
         */

        else if (
            locations.some(
                location =>
                    location === query
            )
        ) {

            matches = true;

        }


        /*
         * TIMEZONE SEARCH
         *
         * Example:
         *
         * asia/kolkata
         * america/new_york
         */

        else if (
            timezones.some(
                timezone =>
                    timezone === query
            )
        ) {

            matches = true;

        }


        section.hidden = !matches;


        if (matches) {
            visibleCountries++;
        }

    });


    resultCount.textContent =
        `SHOWING ${visibleCountries} ` +
        `COUNTR${visibleCountries === 1 ? "Y" : "IES"}`;


    noResults.hidden =
        visibleCountries !== 0;

}




function clearSearchInput() {

    searchInput.value = "";

    filterCountries();

    searchInput.focus();

}


searchInput.addEventListener(
    "input",
    filterCountries
);


clearSearch.addEventListener(
    "click",
    clearSearchInput
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            searchInput.value
        ) {
            clearSearchInput();
        }

    }
);



/* =========================================
   MATRIX RAIN
   ========================================= */

const canvas =
    document.getElementById("matrix");

const context =
    canvas.getContext("2d");


const MATRIX_CHARACTERS =
    "アカサタナハマヤラワ" +
    "0123456789" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


const FONT_SIZE = 14;

let columns = 0;
let drops = [];


function resizeMatrix() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns =
        Math.ceil(
            canvas.width / FONT_SIZE
        );

    drops = Array(columns).fill(1);
}


function drawMatrix() {

    context.fillStyle =
        "rgba(0, 0, 0, 0.05)";

    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    context.fillStyle = "#00ff41";

    context.font =
        `${FONT_SIZE}px monospace`;


    drops.forEach((drop, index) => {

        const character =
            MATRIX_CHARACTERS[
                Math.floor(
                    Math.random() *
                    MATRIX_CHARACTERS.length
                )
            ];


        context.fillText(
            character,
            index * FONT_SIZE,
            drop * FONT_SIZE
        );


        if (
            drop * FONT_SIZE > canvas.height &&
            Math.random() > 0.975
        ) {
            drops[index] = 0;
        }


        drops[index]++;

    });

}


resizeMatrix();


window.addEventListener(
    "resize",
    resizeMatrix
);


setInterval(
    drawMatrix,
    40
);
