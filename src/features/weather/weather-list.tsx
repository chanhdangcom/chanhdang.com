"use client";

import { useEffect, useState } from "react";
import { WeatherIcon } from "./components/weather-icon";

type IWeather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};
type ITemp = {
  temp: number;
};

export const WeatherList = () => {
  const [weathers, setWeathers] = useState<IWeather[]>([]);
  const [temps, setTemps] = useState<ITemp>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const data = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?id=1566083&units=metric&appid=a185da73f0467dbc267ce609dda11980",
      { method: "GET" }
    );
    const jasonData = await data.json();
    const weathers = jasonData.weather as IWeather[];
    const temps = jasonData.main;

    setWeathers(weathers);
    setTemps(temps);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="m-4 w-fit rounded-3xl border-8 border-zinc-800 text-xl">
      {isLoading && <div className="p-2">Is Loading...</div>}

      {!isLoading && weathers.length > 0 && (
        <div>
          {weathers.map((item) => {
            return (
              <div
                key={item.id}
                className="m-4 w-fit gap-3 rounded-3xl border border-zinc-800"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div> {temps?.temp}&deg;C </div>
                    <div>
                      <WeatherIcon icon={item.icon} />
                    </div>
                  </div>
                  <div>
                    <div>{item.main}</div>
                    <div className="text-zinc-500">{item.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!isLoading && weathers.length == 0 && (
        <div className="p-2">No data weather</div>
      )}
    </div>
  );
};
