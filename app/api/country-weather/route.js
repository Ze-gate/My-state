import { NextResponse } from 'next/server';

// Pemetaan Kode Cuaca WMO (World Meteorological Organization)
function parseWeatherCode(code) {
  const weatherMap = {
    0: { label: 'Cerah', icon: '☀️' },
    1: { label: 'Cenderung Cerah', icon: '🌤️' },
    2: { label: 'Berawan Sebagian', icon: '⛅' },
    3: { label: 'Mendung', icon: '☁️' },
    45: { label: 'Kabut', icon: '🌫️' },
    48: { label: 'Kabut Bekerak', icon: '🌫️' },
    51: { label: 'Gerimis Ringan', icon: '🌦️' },
    53: { label: 'Gerimis Sedang', icon: '🌦️' },
    55: { label: 'Gerimis Lebat', icon: '🌧️' },
    61: { label: 'Hujan Ringan', icon: '🌧️' },
    63: { label: 'Hujan Sedang', icon: '🌧️' },
    65: { label: 'Hujan Lebat', icon: '🌧️' },
    71: { label: 'Salju Ringan', icon: '🌨️' },
    73: { label: 'Salju Sedang', icon: '🌨️' },
    75: { label: 'Salju Lebat', icon: '❄️' },
    80: { label: 'Hujan Lokal Ringan', icon: '🌦️' },
    81: { label: 'Hujan Lokal Sedang', icon: '🌧️' },
    82: { label: 'Hujan Lokal Lebat', icon: '🌧️' },
    95: { label: 'Badai Petir', icon: '🌩️' },
    96: { label: 'Badai Petir + Es', icon: '⛈️' },
  };
  return weatherMap[code] || { label: 'Cuaca Tidak Diketahui', icon: '🌡️' };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryName = searchParams.get('country') || 'Indonesia';

  try {
    // 1. Ambil Data dari REST Countries API
    const countryRes = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`,
      { cache: 'no-store' }
    );

    if (!countryRes.ok) {
      return NextResponse.json(
        { success: false, message: `Negara '${countryName}' tidak ditemukan.` },
        { status: 404 }
      );
    }

    const countryData = await countryRes.json();
    const country = countryData[0];

    const lat = country.latlng[0];
    const lng = country.latlng[1];

    // 2. Ambil Data Cuaca & Timezone dari Open-Meteo API
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`,
      { cache: 'no-store' }
    );

    if (!weatherRes.ok) {
      return NextResponse.json(
        { success: false, message: 'Gagal mengambil data cuaca dari Open-Meteo.' },
        { status: 500 }
      );
    }

    const weatherData = await weatherRes.json();
    const weatherInfo = parseWeatherCode(weatherData.current_weather.weathercode);

    // 3. Gabungkan dan Kembalikan Respons JSON Publik
    return NextResponse.json(
      {
        success: true,
        data: {
          country: country.name.common,
          officialName: country.name.official,
          capital: country.capital ? country.capital[0] : 'N/A',
          region: country.region,
          population: country.population.toLocaleString('id-ID'),
          flagUrl: country.flags?.svg || '',
          flagEmoji: country.flag || '',
          coordinates: { lat, lng },
          timezone: weatherData.timezone,
          weather: {
            temp: weatherData.current_weather.temperature,
            windspeed: weatherData.current_weather.windspeed,
            isDay: weatherData.current_weather.is_day === 1,
            condition: weatherInfo.label,
            icon: weatherInfo.icon,
          },
        },
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Mengizinkan Akses CORS Publik
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada internal server.' },
      { status: 500 }
    );
  }
}
