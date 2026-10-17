// Fetches today's forecast for Columbia, MD from Open-Meteo (free, no key) and writes data/weather.js.
// Run by .github/workflows/daily-weather.yml. Output is validated numbers only; nothing from the response is executed.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../data/weather.js", import.meta.url));
const url = "https://api.open-meteo.com/v1/forecast?latitude=39.2037&longitude=-76.861&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max" +
  "&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1";

const res = await fetch(url);
if (!res.ok) throw new Error("Open-Meteo returned " + res.status);
const d = (await res.json()).daily || {};
const date = d.time && d.time[0], hi = d.temperature_2m_max && d.temperature_2m_max[0], lo = d.temperature_2m_min && d.temperature_2m_min[0];
const code = d.weather_code && d.weather_code[0], rain = d.precipitation_probability_max && d.precipitation_probability_max[0];
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || !Number.isFinite(hi) || !Number.isFinite(lo) || hi < -60 || hi > 140 || lo < -60 || lo > 140) throw new Error("Unexpected forecast data: " + JSON.stringify(d));
const out = { place: "Columbia, MD", date, high: Math.round(hi), low: Math.round(lo), code: Number.isInteger(code) ? code : null,
  rain: Number.isFinite(rain) ? Math.round(rain) : null, source: "Open-Meteo" };
writeFileSync(OUT, "// Written by scripts/weather.mjs each morning (see .github/workflows/daily-weather.yml). Do not hand-edit.\nwindow.HUB_WEATHER = " + JSON.stringify(out, null, 2) + ";\n");
console.log("wrote", out);
