const BASE_URL = "https://open.er-api.com/v6/latest/";

// Get elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Currency list for dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag based on selected country
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

// Fetch exchange rate and update message
async function updateExchangeRate() {
  let amount = document.querySelector(".amount input").value;

  if (amount === "" || isNaN(amount) || Number(amount) <= 0) {
    msg.innerText = "Please enter a valid amount greater than 0";
    return;
  }

  const url = `${BASE_URL}${fromCurr.value}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.rates[toCurr.value]) throw new Error("Invalid currency");

    const rate = data.rates[toCurr.value];
    const converted = (amount * rate).toFixed(2);
    msg.innerText = `${amount} ${fromCurr.value} = ${converted} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate!";
    console.error("API Error:", error);
  }
}

// Button click event
btn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form reload
  updateExchangeRate();
});

// Initial conversion
window.addEventListener("load", () => {
  updateExchangeRate();
});
