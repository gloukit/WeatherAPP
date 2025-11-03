import type { ForecastData } from "@/api/types"
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
    data:ForecastData;
}

interface DailyForecast {
    date:number;
    temp_min:number;
    temp_max:number;
    humidity:number;
    wind:number;
    weather:{
        id:number;
        main:string;
        description:string;
        icon:string;
    }
}

export function WeatherForecast({data}:WeatherForecastProps){
    const dailyForecasts = data.list.reduce((acc,forecast)=>{
        const date = format(new Date(forecast.dt * 1000),"yyy-MM-dd");

        if(!acc[date]){
            acc[date] = {
                temp_min : forecast.main.temp_min,
                temp_max : forecast.main.temp_max,
                humidity : forecast.main.humidity,
                wind : forecast.wind.speed,
                weather : forecast.weather[0],
                date : forecast.dt
            };
        } else {
            acc[date].temp_min = Math.min(acc[date].temp_min,forecast.main.temp_min);
            acc[date].temp_max = Math.max(acc[date].temp_max,forecast.main.temp_max);
        }
        return acc;
    }, {} as Record<string, DailyForecast>);


    const nextDays = Object.values(dailyForecasts).slice(1,4);

    const formatTemps = (temp:number)=>`${Math.round(temp)}°`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>3-Day Forecast</CardTitle>
            </CardHeader>

            <CardContent>
                <div>
                    {nextDays.map((day)=>(
                        <div key={day.date} className="grid grid-cols-3 items-center gap-4 border rounded-lg py-2 px-4">
                            {/*日期 + 天气描述*/}
                            <div>
                                <p className="font-medium">{format(new Date(day.date * 1000),"EEE,MM d")}</p>
                                <p className="text-sm text-muted-foreground capitalize">{day.weather.description}</p>
                            </div>

                            {/*最低温 + 最高温*/}
                            <div className="flex justify-center gap-4">
                                <span className="flex items-center text-blue-500">
                                    <ArrowDown className="mr-1 h-4 w-4"/>
                                    {formatTemps(day.temp_min)}
                                </span>
                                <span className="flex items-center text-red-500">
                                    <ArrowUp className="mr-1 h-4 w-4"/>
                                    {formatTemps(day.temp_max)}
                                </span>
                            </div>

                            {/*湿度 + 风速*/}
                            <div className="flex justify-end gap-4">
                                <span className="flex items-center gap-1">
                                    <Droplets className="h-4 w-4 text-blue-500"/>
                                    <span className="text-sm">{day.humidity}</span>
                                </span>

                                <span className="flex items-center gap-1">
                                    <Wind className="h-4 w-4 text-blue-500"/>
                                    <span className="text-sm">{day.wind} m/s</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}