const base_URL = `https://2024-03-06.currency-api.pages.dev/v1/currencies`;

const dropDowns = document.querySelectorAll(".dropdown select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const exchangeRateText = document.querySelector(".message");
const exchangeBtn = document.querySelector("button");
const amountInput = document.querySelector(".amount input");
const swapValues = document.querySelector("#swap");

const populateDropdowns = () => {
    for (let select of dropDowns) {
        for (let currCode in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = currCode;
            newOption.value = currCode;
            if (select.name == "from" && currCode == "USD") {
                newOption.selected = "selected";
            } else if (select.name == "to" && currCode == "INR") {
                newOption.selected = "selected";
            }
            select.append(newOption);
        }
        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }
};

const updateExchangeRate = async () => {
    let amtVal = parseFloat(amountInput.value);
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }

    const fromCode = fromCurrency.value.toLowerCase();
    const toCode = toCurrency.value.toLowerCase();

    const URL = `${base_URL}/${fromCode}.json`;

    try {
        let response = await fetch(URL);
        let result = await response.json();
        let exchangeRate = result[fromCode][toCode];
        let totalExRate = (amtVal * exchangeRate).toFixed(2);
        exchangeRateText.innerText = `${amtVal} ${fromCode.toUpperCase()} = ${totalExRate} ${toCode.toUpperCase()}`;
    } catch (error) {
        exchangeRateText.innerText = "Error fetching exchange rate data.";
        console.error(error);
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

const swapCurrencies = () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;

    updateFlag(fromCurrency);
    updateFlag(toCurrency);
    // updateExchangeRate();
};

window.addEventListener("load", () => {
    populateDropdowns();
    updateExchangeRate();
});

exchangeBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

swapValues.addEventListener("click", swapCurrencies);