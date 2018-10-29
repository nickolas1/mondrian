import axios from "axios";
import * as limits from "./parameter-limits";

const SYNODIC_MONTH_IN_DAYS = 29.530588853;
const NEW_MOON_BASE = 1539056820000; //Oct 2018 new moon
const DAY_IN_MILLIS = 86400000;

const WEATHER_API_ID = "3b9df4c28659c77154536ead0411313c"; //todo this is terrible
const CITY_ID = 5045360; //st paul

export default class WeatherParameterizer {
  constructor() {
    this.now = new Date().valueOf();
  }

  async getParams() {
    this.weather = await this.getWeather();
    this.getPrecipitations();

    const bluePercentage = this.getBluePercentage();
    const yellowPercentage = this.getYellowPercentage();
    const colorPercentage = this.getColorPercentage();
    const redPercentage = this.getRedPercentage();
    const linesBase = this.getLinesBase();

    return {
      rngSeed: this.now,
      linesBase,
      colorPercentage,
      bluePercentage,
      yellowPercentage,
      redPercentage,
      description: this.getDescription()
    };
  }

  async getWeather() {
    const apiBase = "http://api.openweathermap.org/data/2.5/weather";
    const resp = await axios.get(
      `${apiBase}?id=${CITY_ID}&APPID=${WEATHER_API_ID}`
    );
    return resp.data;
  }

  // get approximate lunar age in days
  getLunarAge() {
    const daysDiff = (this.now - NEW_MOON_BASE) / DAY_IN_MILLIS;
    return daysDiff % SYNODIC_MONTH_IN_DAYS;
  }

  getPrecipitations() {
    const weatherCodes = this.weather.weather.map(w => w.id);
    this.isThunderstorm = weatherCodes.some(c => c >= 200 && c < 300);
    this.isDrizzle = weatherCodes.some(c => c >= 300 && c < 400);
    this.isRain = weatherCodes.some(c => c >= 500 && c < 600);
    this.isSnow = weatherCodes.some(c => c >= 600 && c < 700);
  }

  getBluePercentage() {
    let bluePercentage = limits.bluePercentage.base;
    if (this.isThunderstorm) bluePercentage += 15;
    if (this.isDrizzle) bluePercentage += 5;
    if (this.isRain) bluePercentage += 10;
    if (this.isSnow) bluePercentage += 5;
    return bluePercentage;
  }

  getYellowPercentage() {
    let yellowPercentage = limits.yellowPercentage.base;
    if (this.weather.clouds && this.weather.clouds.all) {
      yellowPercentage *= 1 - this.weather.clouds.all / 100;
    }
    return yellowPercentage;
  }

  getRedPercentage() {
    let redPercentage = limits.redPercentage.base;
    if (this.weather.main && this.weather.main.temp) {
      redPercentage += this.weather.main.temp - 297;
      redPercentage = Math.max(3, redPercentage); // keep some chance of red even if it's cold
    }
    return redPercentage;
  }

  getColorPercentage() {
    let colorPercentage = limits.colorPercentage.base;
    if (this.weather.snow && this.weather.snow["3h"]) {
      const snowDepth = this.weather.snow["3h"];
      colorPercentage *= Math.max(0, 1 - snowDepth / 3);
    }
    return colorPercentage;
  }

  getLinesBase() {
    // lunar phase- full moon is 1, new moon is 0.
    const linesFraction =
      1 - Math.abs((2 * this.getLunarAge()) / SYNODIC_MONTH_IN_DAYS - 1);
    return Math.round(
      (limits.lineBase.max - limits.lineBase.min) * linesFraction
    );
  }

  getDescription() {
    return {
      temperature: Math.round(this.kToF(this.weather.main.temp)),
      description: this.weather.weather.map(w => w.description),
      lunar: this.getLunarPhase(this.getLunarAge()),
      year: new Date(this.now).getFullYear(),
      time: new Date(this.now).toLocaleTimeString(),
      id: this.now
    };
  }

  kToF(t) {
    return (t * 9) / 5 - 459.67;
  }

  getLunarPhase(d) {
    const fudgeFactor = 0.5;
    if (d < fudgeFactor) {
      return "new";
    }
    if (d < SYNODIC_MONTH_IN_DAYS / 4 - fudgeFactor) {
      return "waxing crescent";
    }
    if (d < SYNODIC_MONTH_IN_DAYS / 4 + fudgeFactor) {
      return "first quarter";
    }
    if (d < SYNODIC_MONTH_IN_DAYS / 2 - fudgeFactor) {
      return "waxing gibbous";
    }
    if (d < SYNODIC_MONTH_IN_DAYS / 2 + fudgeFactor) {
      return "tull";
    }
    if (d < (3 * SYNODIC_MONTH_IN_DAYS) / 4 - fudgeFactor) {
      return "waning gibbous";
    }
    if (d < (3 * SYNODIC_MONTH_IN_DAYS) / 4 + fudgeFactor) {
      return "third quarter";
    }
    if (d < SYNODIC_MONTH_IN_DAYS - fudgeFactor) {
      return "waning crescent";
    }
    return "New";
  }
}
