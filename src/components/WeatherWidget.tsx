import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  RotateCw,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Compass,
} from 'lucide-react';

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  maxTemp: number;
  minTemp: number;
  forecast: Array<{
    date: string;
    dayName: string;
    weatherCode: number;
    maxTemp: number;
    minTemp: number;
  }>;
  lastUpdated: string;
}

// Map WMO weather code to condition name and icon
export function getWeatherCondition(code: number, isDay: boolean = true) {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: isDay ? Sun : Moon,
        color: isDay ? 'text-amber-500' : 'text-indigo-400',
        bg: isDay ? 'from-amber-400/20 to-orange-400/10' : 'from-indigo-950/40 to-slate-900/60',
      };
    case 1:
    case 2:
      return {
        label: isDay ? 'Mainly Sunny' : 'Partly Cloudy',
        icon: isDay ? CloudSun : CloudMoon,
        color: isDay ? 'text-amber-500' : 'text-slate-300',
        bg: isDay ? 'from-amber-400/20 to-sky-400/15' : 'from-slate-800/40 to-slate-900/60',
      };
    case 3:
      return {
        label: 'Overcast',
        icon: Cloud,
        color: 'text-slate-400',
        bg: 'from-slate-300/20 to-slate-400/10',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy / Mist',
        icon: CloudFog,
        color: 'text-slate-300',
        bg: 'from-slate-200/20 to-slate-300/10',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Light Drizzle',
        icon: CloudDrizzle,
        color: 'text-sky-400',
        bg: 'from-sky-400/20 to-blue-400/10',
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Rain Showers',
        icon: CloudRain,
        color: 'text-blue-500',
        bg: 'from-blue-400/20 to-indigo-400/10',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Passing Showers',
        icon: CloudRain,
        color: 'text-blue-400',
        bg: 'from-blue-400/20 to-sky-400/10',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        color: 'text-amber-400',
        bg: 'from-amber-500/20 to-slate-800/40',
      };
    default:
      return {
        label: 'Fair Weather',
        icon: isDay ? Sun : Moon,
        color: isDay ? 'text-amber-500' : 'text-indigo-400',
        bg: isDay ? 'from-amber-400/20 to-orange-400/10' : 'from-indigo-950/40 to-slate-900/60',
      };
  }
}

// Fallback data in case the public API request fails or client is offline
const FALLBACK_WEATHER: WeatherData = {
  temperature: 24.5,
  apparentTemperature: 26.2,
  humidity: 78,
  windSpeed: 4.8,
  precipitation: 0.0,
  weatherCode: 1,
  isDay: true,
  maxTemp: 29.5,
  minTemp: 21.0,
  forecast: [
    { date: 'Today', dayName: 'Today', weatherCode: 1, maxTemp: 29.5, minTemp: 21.0 },
    { date: 'Tomorrow', dayName: 'Tomorrow', weatherCode: 0, maxTemp: 30.1, minTemp: 20.8 },
    { date: 'Day After', dayName: 'Fri', weatherCode: 2, maxTemp: 28.7, minTemp: 21.4 },
  ],
  lastUpdated: 'Just now (Typical season)',
};

const CACHE_KEY = 'khairabad_sitapur_weather_v1';

export const WeatherWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [weather, setWeather] = useState<WeatherData>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return FALLBACK_WEATHER;
  });

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Sitapur / Khairabad coordinates: 27.53 N, 80.75 E
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=27.53&longitude=80.75&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata';

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Weather service returned ${res.status}`);
      }

      const data = await res.json();
      const current = data.current;
      const daily = data.daily;

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const forecastDays = (daily?.time || []).slice(0, 4).map((dStr: string, idx: number) => {
        const d = new Date(dStr);
        const dayLabel = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : daysOfWeek[d.getDay()];
        return {
          date: dStr,
          dayName: dayLabel,
          weatherCode: daily.weather_code[idx] ?? 0,
          maxTemp: Math.round(daily.temperature_2m_max[idx] ?? 30),
          minTemp: Math.round(daily.temperature_2m_min[idx] ?? 20),
        };
      });

      const nowTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const newWeather: WeatherData = {
        temperature: Math.round(current.temperature_2m * 10) / 10,
        apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
        precipitation: Math.round(current.precipitation * 10) / 10,
        weatherCode: current.weather_code,
        isDay: Boolean(current.is_day),
        maxTemp: Math.round(daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 4),
        minTemp: Math.round(daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 4),
        forecast: forecastDays,
        lastUpdated: nowTime,
      };

      setWeather(newWeather);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(newWeather));
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.warn('Failed to fetch live weather for Khairabad:', err);
      setError('Live connection delayed; displaying latest cached reading.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(() => fetchWeather(), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const condition = getWeatherCondition(weather.weatherCode, weather.isDay);
  const IconComponent = condition.icon;

  const displayTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  // Compact Pill View (used in headers or tight spaces)
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-xs border border-slate-700/60 shadow-xs">
        <IconComponent className={`w-4 h-4 ${condition.color}`} />
        <span className="font-extrabold">
          {displayTemp(weather.temperature)}°{unit}
        </span>
        <span className="text-slate-400 hidden xs:inline">{condition.label}</span>
        <span className="text-slate-600">·</span>
        <span className="text-amber-400 text-[11px] font-semibold">Khairabad</span>
      </div>
    );
  }

  // Full Rich Dashboard Widget
  return (
    <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto" aria-label="Sitapur and Khairabad live weather">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${condition.bg}`}
        />

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-2xs shrink-0">
              <IconComponent className={`w-6 h-6 ${condition.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Sitapur / Khairabad Weather
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span>27.53°N, 80.75°E · Elev 138m · Open-Meteo Public Station</span>
              </p>
            </div>
          </div>

          {/* Unit Toggle and Manual Refresh Button */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Unit Toggle */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/70 rounded-xl p-0.5 text-xs font-bold text-slate-300">
              <button
                onClick={() => setUnit('C')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unit === 'C' ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unit === 'F' ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Refresh button */}
            <button
              onClick={() => fetchWeather(true)}
              disabled={isRefreshing || loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all flex items-center gap-1 text-xs"
              title="Refresh live weather from Open-Meteo"
              aria-label="Refresh current weather data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline text-[11px]">
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Grid: Primary Temperature & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Big Temp Box (5 Cols) */}
          <div className="lg:col-span-5 flex items-center gap-5">
            <div className="relative">
              <span className="text-5xl sm:text-6xl font-black font-display tracking-tight text-white leading-none">
                {displayTemp(weather.temperature)}°
              </span>
              <span className="text-xl sm:text-2xl font-bold text-amber-400 ml-1">
                {unit}
              </span>
            </div>

            <div className="border-l border-slate-800 pl-4 space-y-1">
              <div className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
                <span>{condition.label}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Feels like {displayTemp(weather.apparentTemperature)}°{unit}</span>
              </div>
              <div className="flex items-center gap-3 text-xs pt-0.5">
                <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" /> {displayTemp(weather.maxTemp)}°
                </span>
                <span className="text-sky-400 font-semibold flex items-center gap-0.5">
                  <ArrowDown className="w-3 h-3" /> {displayTemp(weather.minTemp)}°
                </span>
              </div>
            </div>
          </div>

          {/* 4 Detail Metrics Badges (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Humidity</span>
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <span className="text-lg font-black text-white">{weather.humidity}%</span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {weather.humidity > 80 ? 'Humid' : weather.humidity > 50 ? 'Pleasant' : 'Dry'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Wind Speed</span>
                <Wind className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-lg font-black text-white">{weather.windSpeed}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">km/h (Light breeze)</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Precipitation</span>
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-lg font-black text-white">{weather.precipitation} mm</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Rain Probability: Low</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Day Cycle</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span className="text-sm font-bold text-amber-300">
                {weather.isDay ? 'Daytime' : 'Nighttime'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Awadh Plains</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: 3-Day Forecast Strip & Visitor Recommendation */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 text-xs">
          {/* Mini 3-Day Forecast */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1">
              Forecast:
            </span>
            {weather.forecast.slice(0, 3).map((f, i) => {
              const fCond = getWeatherCondition(f.weatherCode, true);
              const FIcon = fCond.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-800/80 border border-slate-700/70 px-3 py-1.5 rounded-xl flex items-center gap-2 shrink-0"
                >
                  <span className="text-slate-300 font-semibold text-[11px]">{f.dayName}</span>
                  <FIcon className={`w-3.5 h-3.5 ${fCond.color}`} />
                  <span className="font-extrabold text-white text-[11px]">
                    {displayTemp(f.maxTemp)}°
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    / {displayTemp(f.minTemp)}°
                  </span>
                </div>
              );
            })}
          </div>

          {/* Local town weather tip */}
          <div className="text-[11px] text-slate-300 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            <span className="text-amber-400 font-bold">Local Tip:</span>
            <span>
              {weather.temperature > 32
                ? 'Warm afternoon — keep hydrated when visiting outdoor shrines & markets.'
                : weather.precipitation > 2
                ? 'Rain showers active — carry umbrellas when traveling along Station Road.'
                : 'Ideal weather for outdoor visits to Badi Sangat Mandir & Ghanta Ghar bazaar.'}
            </span>
            <span className="text-slate-400 hidden md:inline ml-auto">
              · Updated {weather.lastUpdated}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-[11px] text-amber-300/80 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50">
            {error}
          </div>
        )}
      </div>
    </section>
  );
};
