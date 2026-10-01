const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertBtn = document.getElementById("convertBtn");

const errorMessage = document.getElementById("errorMessage");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");
const resultsBox = document.getElementById("results");


// Colour stops: [temperature in °C, [r, g, b]]  (cold = blue, hot = red)
const HEAT_STOPS = [
    [-20, [63, 123, 255]],
    [0,   [108, 196, 255]],
    [20,  [255, 179, 71]],
    [35,  [255, 122, 61]],
    [50,  [255, 59, 59]]
];

function getHeatColor(celsius) {

    const first = HEAT_STOPS[0];
    const last = HEAT_STOPS[HEAT_STOPS.length - 1];

    if (celsius <= first[0]) return `rgb(${first[1].join(",")})`;
    if (celsius >= last[0]) return `rgb(${last[1].join(",")})`;

    for (let i = 0; i < HEAT_STOPS.length - 1; i++) {

        const [t1, c1] = HEAT_STOPS[i];
        const [t2, c2] = HEAT_STOPS[i + 1];

        if (celsius >= t1 && celsius <= t2) {

            const ratio = (celsius - t1) / (t2 - t1);

            const rgb = c1.map((v, k) =>
                Math.round(v + (c2[k] - v) * ratio)
            );

            return `rgb(${rgb.join(",")})`;
        }
    }
}


convertBtn.addEventListener("click", convertTemperature);

temperatureInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") convertTemperature();
});

temperatureInput.addEventListener("input", () => {
    errorMessage.textContent = "";
});


function convertTemperature() {

    const value = parseFloat(temperatureInput.value);

    const unit = unitSelect.value;


    // Clear previous error
    errorMessage.textContent = "";


    // Check empty or invalid input
    if (
        temperatureInput.value.trim() === "" ||
        Number.isNaN(value)
    ) {

        errorMessage.textContent =
            "Please enter a valid temperature.";

        clearResults();

        return;
    }


    let celsius;
    let fahrenheit;
    let kelvin;


    // Celsius
    if (unit === "celsius") {

        celsius = value;

        fahrenheit = (value * 9 / 5) + 32;

        kelvin = value + 273.15;
    }


    // Fahrenheit
    else if (unit === "fahrenheit") {

        fahrenheit = value;

        celsius = (value - 32) * 5 / 9;

        kelvin = celsius + 273.15;
    }


    // Kelvin
    else if (unit === "kelvin") {

        kelvin = value;

        celsius = value - 273.15;

        fahrenheit = (celsius * 9 / 5) + 32;
    }


    // Absolute zero validation
    if (celsius < -273.15 - 1e-9) {

        errorMessage.textContent =
            "Temperature cannot be below absolute zero (-273.15°C).";

        clearResults();

        return;
    }


    // Display results
    celsiusResult.textContent =
        `${formatNumber(celsius)} °C`;

    fahrenheitResult.textContent =
        `${formatNumber(fahrenheit)} °F`;

    kelvinResult.textContent =
        `${formatNumber(kelvin)} K`;

    // Colour the cards by temperature
    resultsBox.style.setProperty("--heat", getHeatColor(celsius));
}


function formatNumber(number) {

    return Number(number.toFixed(2));
}


function clearResults() {

    celsiusResult.textContent = "—";

    fahrenheitResult.textContent = "—";

    kelvinResult.textContent = "—";

    resultsBox.style.removeProperty("--heat");
}