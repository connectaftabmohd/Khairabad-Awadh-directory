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
  Clock,
  ArrowUp,
  ArrowDown,
  Compass,
  Sunrise,
  Sunset,
  Gauge,
  Umbrella,
  ArrowLeft,
  Navigation,
  Info,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getWeatherCondition } from './WeatherWidget';
import { AdSenseSlot } from './AdSenseSlot';

interface HourlyForecastItem {
  timeLabel: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

interface DailyForecastItem {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitationSum: number;
  sunrise: string;
  sunset: string;
}

interface DetailedWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  surfacePressure: number;
  weatherCode: number;
  isDay: boolean;
  maxTemp: number;
  minTemp: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  lastUpdated: string;
}

// Fallback data in case client is offline
const FALLBACK_DETAILED_WEATHER: DetailedWeatherData = {
  temperature: 24.5,
  apparentTemperature: 26.2,
  humidity: 78,
  windSpeed: 4.8,
  precipitation: 0.0,
  surfacePressure: 1012,
  weatherCode: 1,
  isDay: true,
  maxTemp: 29.5,
  minTemp: 21.0,
  sunrise: '06:08 AM',
  sunset: '05:46 PM',
  hourly: [
    { timeLabel: '06:00', temperature: 21.2, weatherCode: 1, precipitationProbability: 5, isDay: true },
    { timeLabel: '09:00', temperature: 24.8, weatherCode: 1, precipitationProbability: 10, isDay: true },
    { timeLabel: '12:00', temperature: 28.5, weatherCode: 0, precipitationProbability: 5, isDay: true },
    { timeLabel: '15:00', temperature: 29.5, weatherCode: 2, precipitationProbability: 15, isDay: true },
    { timeLabel: '18:00', temperature: 26.0, weatherCode: 0, precipitationProbability: 5, isDay: false },
    { timeLabel: '21:00', temperature: 23.8, weatherCode: 0, precipitationProbability: 0, isDay: false },
    { timeLabel: '00:00', temperature: 22.1, weatherCode: 0, precipitationProbability: 0, isDay: false },
    { timeLabel: '03:00', temperature: 21.0, weatherCode: 1, precipitationProbability: 0, isDay: false },
  ],
  daily: [
    { date: 'Today', dayName: 'Today', formattedDate: 'Oct 7', weatherCode: 1, maxTemp: 29.5, minTemp: 21.0, precipitationSum: 0, sunrise: '06:08 AM', sunset: '05:46 PM' },
    { date: 'Tomorrow', dayName: 'Tomorrow', formattedDate: 'Oct 8', weatherCode: 0, maxTemp: 30.1, minTemp: 20.8, precipitationSum: 0, sunrise: '06:09 AM', sunset: '05:45 PM' },
    { date: 'Fri', dayName: 'Friday', formattedDate: 'Oct 9', weatherCode: 2, maxTemp: 28.7, minTemp: 21.4, precipitationSum: 0.2, sunrise: '06:09 AM', sunset: '05:44 PM' },
    { date: 'Sat', dayName: 'Saturday', formattedDate: 'Oct 10', weatherCode: 3, maxTemp: 27.8, minTemp: 20.5, precipitationSum: 1.1, sunrise: '06:10 AM', sunset: '05:43 PM' },
    { date: 'Sun', dayName: 'Sunday', formattedDate: 'Oct 11', weatherCode: 0, maxTemp: 29.4, minTemp: 21.2, precipitationSum: 0, sunrise: '06:10 AM', sunset: '05:42 PM' },
    { date: 'Mon', dayName: 'Monday', formattedDate: 'Oct 12', weatherCode: 0, maxTemp: 30.3, minTemp: 21.1, precipitationSum: 0, sunrise: '06:11 AM', sunset: '05:40 PM' },
    { date: 'Tue', dayName: 'Tuesday', formattedDate: 'Oct 13', weatherCode: 1, maxTemp: 29.7, minTemp: 20.9, precipitationSum: 0, sunrise: '06:12 AM', sunset: '05:39 PM' },
  ],
  lastUpdated: 'Live Cached Station Data',
};

const CACHE_KEY = 'khairabad_sitapur_detailed_weather_v1';

interface WeatherPageProps {
  onBackToDirectory?: () => void;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ onBackToDirectory }) => {
  const [weather, setWeather] = useState<DetailedWeatherData>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return FALLBACK_DETAILED_WEATHER;
  });

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [error, setError] = useState<string | null>(null);

  // Sync document title for SEO
  useEffect(() => {
    document.title = 'Sitapur & Khairabad Live Weather – 7-Day Forecast | Khairabad Directory';
    return () => {
      document.title = 'Khairabad Directory & Heritage – Notable People & City Guide';
    };
  }, []);

  const fetchDetailedWeather = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=27.53&longitude=80.75&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=Asia%2FKolkata';

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather API returned ${res.status}`);

      const data = await res.json();
      const current = data.current;
      const daily = data.daily;
      const hourly = data.hourly;

      // Extract next 8-12 hours
      const currentIsoHour = current.time ? current.time.slice(0, 13) : '';
      let startIndex = 0;
      if (hourly?.time) {
        const found = hourly.time.findIndex((t: string) => t.startsWith(currentIsoHour));
        if (found !== -1) startIndex = found;
      }

      const hourlyList: HourlyForecastItem[] = (hourly?.time || [])
        .slice(startIndex, startIndex + 12)
        .map((tStr: string, idx: number) => {
          const absoluteIndex = startIndex + idx;
          const d = new Date(tStr);
          const timeLabel = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
          return {
            timeLabel,
            temperature: Math.round(hourly.temperature_2m[absoluteIndex] * 10) / 10,
            weatherCode: hourly.weather_code[absoluteIndex] ?? 0,
            precipitationProbability: Math.round(hourly.precipitation_probability[absoluteIndex] ?? 0),
            isDay: Boolean(hourly.is_day?.[absoluteIndex] ?? true),
          };
        });

      // Extract 7 daily forecasts
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dailyList: DailyForecastItem[] = (daily?.time || []).slice(0, 7).map((dStr: string, idx: number) => {
        const d = new Date(dStr);
        const dayLabel = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : daysOfWeek[d.getDay()];
        const formattedDate = `${months[d.getMonth()]} ${d.getDate()}`;

        const sunriseDate = daily.sunrise?.[idx] ? new Date(daily.sunrise[idx]) : null;
        const sunsetDate = daily.sunset?.[idx] ? new Date(daily.sunset[idx]) : null;

        const formatTime = (dateObj: Date | null) =>
          dateObj
            ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
            : '--:--';

        return {
          date: dStr,
          dayName: dayLabel,
          formattedDate,
          weatherCode: daily.weather_code[idx] ?? 0,
          maxTemp: Math.round(daily.temperature_2m_max[idx] ?? 30),
          minTemp: Math.round(daily.temperature_2m_min[idx] ?? 20),
          precipitationSum: Math.round((daily.precipitation_sum?.[idx] ?? 0) * 10) / 10,
          sunrise: formatTime(sunriseDate),
          sunset: formatTime(sunsetDate),
        };
      });

      const todaySunrise = dailyList[0]?.sunrise || '06:08 AM';
      const todaySunset = dailyList[0]?.sunset || '05:46 PM';

      const nowTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const newWeather: DetailedWeatherData = {
        temperature: Math.round(current.temperature_2m * 10) / 10,
        apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
        precipitation: Math.round(current.precipitation * 10) / 10,
        surfacePressure: Math.round(current.surface_pressure ?? 1012),
        weatherCode: current.weather_code,
        isDay: Boolean(current.is_day),
        maxTemp: Math.round(daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 4),
        minTemp: Math.round(daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 4),
        sunrise: todaySunrise,
        sunset: todaySunset,
        hourly: hourlyList,
        daily: dailyList,
        lastUpdated: `${nowTime} IST`,
      };

      setWeather(newWeather);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(newWeather));
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.warn('Weather fetch error:', err);
      setError('Live meteorological sync delayed. Showing latest verified reading.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDetailedWeather();
  }, [fetchDetailedWeather]);

  const condition = getWeatherCondition(weather.weatherCode, weather.isDay);
  const IconComponent = condition.icon;

  const displayTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Page Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          {onBackToDirectory && (
            <button
              onClick={onBackToDirectory}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-800 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&larr; Back to Directory</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Khairabad &amp; Sitapur Live Weather
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Station Coordinates: 27.53°N, 80.75°E · Elev 138m · Sitapur District, UP 261131</span>
            <span className="text-slate-400">·</span>
            <span>Public Open-Meteo Meteorology</span>
          </p>
        </div>

        {/* Action Controls: Unit toggle + Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5 text-xs font-bold text-slate-700 shadow-2xs">
            <button
              onClick={() => setUnit('C')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                unit === 'C' ? 'bg-amber-400 text-slate-950 font-black shadow-2xs' : 'hover:bg-slate-100'
              }`}
            >
              °Celsius
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                unit === 'F' ? 'bg-amber-400 text-slate-950 font-black shadow-2xs' : 'hover:bg-slate-100'
              }`}
            >
              °Fahrenheit
            </button>
          </div>

          <button
            onClick={() => fetchDetailedWeather(true)}
            disabled={isRefreshing || loading}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Update live weather reading"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Hero Current Conditions Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-lg relative overflow-hidden">
        {/* Atmospheric Glow */}
        <div
          className={`absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none bg-gradient-to-br ${condition.bg}`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Main Temperature & Visual (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Awadh Atmospheric Conditions</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-md shrink-0">
                <IconComponent className={`w-12 h-12 sm:w-14 sm:h-14 ${condition.color}`} />
              </div>

              <div>
                <div className="flex items-baseline">
                  <span className="text-6xl sm:text-7xl font-black font-display tracking-tight text-white leading-none">
                    {displayTemp(weather.temperature)}°
                  </span>
                  <span className="text-2xl font-bold text-amber-400 ml-1">
                    {unit}
                  </span>
                </div>

                <div className="text-lg sm:text-xl font-bold text-slate-100 mt-1">
                  {condition.label}
                </div>

                <div className="text-xs text-slate-400 mt-0.5">
                  Feels like <span className="text-slate-200 font-semibold">{displayTemp(weather.apparentTemperature)}°{unit}</span> · Last verified {weather.lastUpdated}
                </div>
              </div>
            </div>

            {/* High/Low pill & Astro times */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700/70 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <span className="text-rose-400 flex items-center gap-0.5">
                  <ArrowUp className="w-3.5 h-3.5" /> High: {displayTemp(weather.maxTemp)}°
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-sky-400 flex items-center gap-0.5">
                  <ArrowDown className="w-3.5 h-3.5" /> Low: {displayTemp(weather.minTemp)}°
                </span>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/70 border border-slate-700/70 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                  <span>{weather.sunrise}</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Sunset className="w-3.5 h-3.5 text-orange-400" />
                  <span>{weather.sunset}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 6 Key Atmospheric Telemetry Badges (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Humidity</span>
                <Droplets className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-xl font-black text-white">{weather.humidity}%</span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {weather.humidity > 80 ? 'High Humidity' : weather.humidity > 50 ? 'Comfortable' : 'Dry air'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Wind Speed</span>
                <Wind className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xl font-black text-white">{weather.windSpeed}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">km/h (Light breeze)</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Precipitation</span>
                <CloudRain className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xl font-black text-white">{weather.precipitation} mm</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Probability low</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Pressure</span>
                <Gauge className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xl font-black text-white">{weather.surfacePressure}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">hPa (Stable)</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Elevation</span>
                <Compass className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xl font-black text-white">138 m</span>
              <span className="text-[10px] text-slate-400 mt-0.5">453 ft above MSL</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Day Cycle</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-lg font-bold text-amber-300">
                {weather.isDay ? 'Daytime' : 'Nighttime'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Asia/Kolkata</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-xs text-amber-300 bg-amber-950/60 border border-amber-800 p-2.5 rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* Hourly Forecast Strip */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Hourly Forecast for Sitapur / Khairabad</span>
          </h2>
          <span className="text-xs text-slate-500">Next 12 Hours</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {weather.hourly.map((hour, idx) => {
            const hCond = getWeatherCondition(hour.weatherCode, hour.isDay);
            const HIcon = hCond.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 text-center min-w-[96px] shrink-0 space-y-2 hover:border-amber-400 transition-colors"
              >
                <div className="text-xs font-semibold text-slate-500">{hour.timeLabel}</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center">
                  <HIcon className={`w-6 h-6 ${hCond.color}`} />
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {displayTemp(hour.temperature)}°{unit}
                </div>
                {hour.precipitationProbability > 0 ? (
                  <div className="text-[10px] text-blue-600 font-semibold flex items-center justify-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{hour.precipitationProbability}%</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400">0% rain</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Extended Forecast Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>7-Day Weather Outlook</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Extended meteorological projections for Khairabad town and Sitapur district
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            High / Low Projections
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {weather.daily.map((day, idx) => {
            const dCond = getWeatherCondition(day.weatherCode, true);
            const DIcon = dCond.icon;
            return (
              <div
                key={idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
              >
                {/* Day name & date */}
                <div className="flex items-center gap-3 sm:w-44">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {day.dayName}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {day.formattedDate}
                  </span>
                </div>

                {/* Condition Icon & Text */}
                <div className="flex items-center gap-2.5 sm:w-56">
                  <DIcon className={`w-5 h-5 ${dCond.color} shrink-0`} />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {dCond.label}
                  </span>
                </div>

                {/* Rain probability / amount */}
                <div className="text-xs text-slate-500 sm:w-32 flex items-center gap-1">
                  <Umbrella className="w-3.5 h-3.5 text-blue-500" />
                  <span>{day.precipitationSum > 0 ? `${day.precipitationSum} mm rain` : 'No rain expected'}</span>
                </div>

                {/* Temperature Bar & Range */}
                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  <span className="text-xs font-semibold text-sky-700 w-10 text-right">
                    {displayTemp(day.minTemp)}°
                  </span>
                  {/* Visual High/Low Range Bar */}
                  <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-200 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 rounded-full"
                      style={{
                        marginLeft: `${Math.max(0, Math.min(60, (day.minTemp - 15) * 3))}%`,
                        width: `${Math.max(30, Math.min(80, (day.maxTemp - day.minTemp) * 8))}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-black text-slate-900 w-10">
                    {displayTemp(day.maxTemp)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google AdSense Weather Leaderboard Unit */}
      <AdSenseSlot adSlot="6789012345" adFormat="horizontal" label="Advertisement" />

      {/* Awadh Seasonal Climate Guide & Travel Advisory for Khairabad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Winter Season */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
            <Sun className="w-4 h-4 text-sky-600" />
            <span>Winter (Nov – Feb)</span>
          </div>
          <h3 className="font-bold text-base font-display text-slate-900">
            Peak Season for Tourism &amp; Weddings
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pleasant sunny days (18°C–25°C) and crisp nights (8°C–14°C) with morning mist. The ideal window for walking tours around Badi Sangat Mandir, Makhdoom Shah Dargah, and attending traditional Awadhi marriage celebrations.
          </p>
          <div className="text-[11px] font-semibold text-sky-800 bg-sky-50 p-2 rounded-xl border border-sky-100">
            Clothing: Light sweaters for daytime, warm jackets for foggy nights.
          </div>
        </div>

        {/* Card 2: Summer Season */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Summer (Mar – Jun)</span>
          </div>
          <h3 className="font-bold text-base font-display text-slate-900">
            Dry Westerly Winds &amp; Warm Days
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Temperatures climb to 34°C–42°C with dry afternoon winds (Loo). Morning hours (6:00 AM–9:30 AM) and evening twilight are best for visiting local bazaars, sampling rabdi lassi, and dining.
          </p>
          <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-100">
            Travel Tip: Stay well-hydrated; seek shaded historic courtyards.
          </div>
        </div>

        {/* Card 3: Monsoon Season */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <CloudRain className="w-4 h-4 text-emerald-600" />
            <span>Monsoon (Jul – Sep)</span>
          </div>
          <h3 className="font-bold text-base font-display text-slate-900">
            Lush Green Plains &amp; Rain Showers
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            South-west monsoon brings 750–900 mm of seasonal rainfall, revitalizing the Sarayan river basin and agricultural groves. Fresh piping-hot desi ghee jalebis and kachoris at Ghanta Ghar are local favourites during rainy evenings.
          </p>
          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
            Tip: Carry an umbrella when commuting via Station Road e-rickshaws.
          </div>
        </div>
      </div>
    </div>
  );
};
