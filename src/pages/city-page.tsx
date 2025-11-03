import { CurrentWeather } from "@/components/current-weather";
import { FavoriteButton } from "@/components/favorite-button";
import { HourlyTemperature } from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WeatherDatails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"


export default function CityPage(){
    const [searchParams] = useSearchParams();
    const params = useParams();

    const lat = parseFloat(searchParams.get("lat") || "0");
    const lon = parseFloat(searchParams.get("lon") || "0");
    const coordinates = {lat,lon};
    
    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);
    

    if(weatherQuery.error || forecastQuery.error){
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4"/>
                <AlertDescription>
                    Failed to load weather data. Please try again.
                </AlertDescription>
            </Alert>
        )
    }

    if(!weatherQuery.data || !forecastQuery.data || !params.cityName){
        return <WeatherSkeleton/>
    }

    return (
        <div className="space-y-6">
            {/*city name && Favorite button*/}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {params.cityName} , {weatherQuery.data.sys.country}
                </h1>
                <div>
                    <FavoriteButton data={weatherQuery.data}/>
                </div>
            </div>

            {/*weather dashboard*/}
            <div className="grid lg:grid-cols-2 gap-6">
                <CurrentWeather data={weatherQuery.data} />
                <HourlyTemperature data={forecastQuery.data}/>
                <WeatherDatails data={weatherQuery.data}/>
                <WeatherForecast data={forecastQuery.data}/>
            </div>
        </div>
    )
}