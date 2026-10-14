'use client';

​import React, { useState, useEffect } from 'react';

​export default function Home() {

const [countryInput, setCountryInput] = useState('Japan');

const [data, setData] = useState(null);

const [loading, setLoading] = useState(false);

const [error, setError] = useState('');

const [currentTime, setCurrentTime] = useState('');

​// Panggil Custom Backend API milik kita (/api/country-weather)

const fetchData = async (countryName) => {

setLoading(true);

setError('');

try {

const res = await fetch(/api/country-weather?country=${encodeURIComponent(countryName)});

const result = await res.json();

​if (!result.success) {

throw new Error(result.message || 'Gagal memuat data');

}

​setData(result.data);

} catch (err) {

setError(err.message || 'Terjadi kesalahan sistem.');

setData(null);

} finally {

setLoading(false);

}

};

​useEffect(() => {

fetchData('Japan');

}, []);

​// Update Jam Real-time berdasarkan timezone lokasi

useEffect(() => {

if (!data?.timezone) return;

​const timer = setInterval(() => {

try {

const now = new Date();

const formatted = new Intl.DateTimeFormat('id-ID', {

timeZone: data.timezone,

weekday: 'long',

year: 'numeric',

month: 'long',

day: 'numeric',

hour: '2-digit',

minute: '2-digit',

second: '2-digit',

}).format(now);

setCurrentTime(formatted);

} catch (e) {

setCurrentTime('Format waktu tidak valid');

}

}, 1000);

​return () => clearInterval(timer);

}, [data]);

​const handleSubmit = (e) => {

e.preventDefault();

if (countryInput.trim()) {

fetchData(countryInput);

}

};

​const quickCountries = ['Indonesia', 'Japan', 'United Kingdom', 'Saudi Arabia', 'United States', 'Germany'];

​return (

<div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px 16px' }}>

<div style={{ maxWidth: '720px', margin: '0 auto' }}>

​{/* Header */}

<header style={{ textAlign: 'center', marginBottom: '32px' }}>

<div style={{ display: 'inline-block', backgroundColor: '#1e293b', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>

⚡ Vercel Fullstack API Demo

</div>

<h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>

Global Time & Weather Explorer

</h1>

<p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>

Penggabungan REST Countries API + Open-Meteo API dalam satu endpoint backend terpusat.

</p>

</header>

​{/* Form Pencarian */}

<form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

<div style={{ display: 'flex', gap: '8px' }}>

<input

type="text"

value={countryInput}

onChange={(e) => setCountryInput(e.target.value)}

placeholder="Ketik nama negara (misal: Indonesia, France, Egypt)..."

style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontSize: '15px', outline: 'none' }}

/>

<button

type="submit"

disabled={loading}

style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}

>

{loading ? 'Memuat...' : 'Cari'}

</button>

</div>

</form>

​{/* Quick Selection */}

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>

<span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center' }}>Pilihan Cepat:</span>

{quickCountries.map((c) => (

<button

key={c}

onClick={() => { setCountryInput(c); fetchData(c); }}

style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}

>

{c}

</button>

))}

</div>

​{/* Error Handling */}

{error && (

<div style={{ backgroundColor: '#451a1a', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>

⚠️ {error}

</div>

)}

​{/* Main Content Card */}

{data && (

<div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>

​{/* Country Banner */}

<div style={{ padding: '24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

<div>

<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>

<h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{data.country}</h2>

<span style={{ fontSize: '24px' }}>{data.flagEmoji}</span>

</div>

<p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{data.officialName}</p>

</div>

{data.flagUrl && (

<img src={data.flagUrl} alt={data.country} style={{ width: '60px', height: 'auto', borderRadius: '4px', border: '1px solid #475569' }} />

)}

</div>

​{/* Grid Info */}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', padding: '24px' }}>

​{/* Box Waktu */}

<div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>

<div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>

🕒 Waktu Lokal Real-time

</div>

<div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>

{currentTime || 'Mengkalkulasi waktu...'}

</div>

<div style={{ fontSize: '12px', color: '#64748b' }}>

Zona Waktu: {data.timezone}

</div>

</div>

​{/* Box Cuaca */}

<div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>

<div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>

🌡️ Cuaca Terkini

</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

<span style={{ fontSize: '36px' }}>{data.weather.icon}</span>

<div>

<div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc' }}>

{data.weather.temp} °C

</div>

<div style={{ fontSize: '13px', color: '#94a3b8' }}>

{data.weather.condition}

</div>

</div>

</div>

<div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>

Kecepatan Angin: {data.weather.windspeed} km/h

</div>

</div>

​</div>

​{/* Detail Tambahan Negara */}

<div style={{ padding: '0 24px 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>

<div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>

<div style={{ fontSize: '11px', color: '#64748b' }}>Ibu Kota</div>

<div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '2px' }}>{data.capital}</div>

</div>

<div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>

<div style={{ fontSize: '11px', color: '#64748b' }}>Wilayah</div>

<div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '2px' }}>{data.region}</div>

</div>

<div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>

<div style={{ fontSize: '11px', color: '#64748b' }}>Populasi</div>

<div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '2px' }}>{data.population}</div>

</div>

</div>

​</div>

)}

​{/* API Endpoint Documentation Box */}

<div style={{ marginTop: '32px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>

<h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#f8fafc' }}>🔗 Cara Akses Public API Anda</h3>

<p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0' }}>

Setelah dideploy ke Vercel, API ini bisa dipanggil secara terbuka oleh aplikasi pihak ketiga mana pun via query parameter:

</p>

<code style={{ display: 'block', backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#38bdf8', wordBreak: 'break-all' }}>

GET https://domain-anda.vercel.app/api/country-weather?country=indonesia

</code>

</div>

​</div>

</div>

);

}

