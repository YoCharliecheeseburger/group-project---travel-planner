const OPENWEATHER_API_KEY = "afded785592a02f56aa62b6b57f085a5";

export async function fetchTravelData(city) {
  if (!city) throw new Error("Please enter a destination city");

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  
  if (response.status === 401) {
    throw new Error("Invalid API Key or key is still activating. Try again in a bit!");
  }
  if (response.status === 404) {
    throw new Error(`City "${city}" not found. Check your spelling.`);
  }
  if (!response.ok) {
    throw new Error("Failed to pull weather data from OpenWeatherMap.");
  }

  const data = await response.json();

  const uniqueDays = [];
  const clean5DayForecast = data.list.filter(item => {
    const dateOnly = item.dt_txt.split(' ')[0];
    if (!uniqueDays.includes(dateOnly) && uniqueDays.length < 5) {
      uniqueDays.push(dateOnly);
      return true;
    }
    return false;
  });

  return {
    cityName: data.city.name,
    country: data.city.country,
    current: {
      temp: Math.round(data.list[0].main.temp),
      humidity: data.list[0].main.humidity,
      description: data.list[0].weather[0].description,
      icon: data.list[0].weather[0].icon,
    },
    forecast: clean5DayForecast.map(item => ({
      date: item.dt_txt.split(' ')[0],
      temp: Math.round(item.main.temp),
      description: item.weather[0].main,
      icon: item.weather[0].icon,
    }))
  };
}
