export async function fetchExchangeRates(baseCurrency = "EUR") {
  const url = `https://open.er-api.com/v6/latest/${baseCurrency}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to pull live exchange rates");
  }
  
  const data = await response.json();
  return data.rates;
}
