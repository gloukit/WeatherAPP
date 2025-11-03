import { CurrentWeather } from "@/components/current-weather";
import FavoriteCities from "@/components/favorite-cities";
import { HourlyTemperature } from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WeatherDatails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";

export default function WeatherDashBoard(){
    const {coordinates, error:locationError, isLoading:locationLoading, getLocation} = useGeolocation(); 
    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);
    const locationQuery = useReverseGeocodeQuery(coordinates);

    const locationName = locationQuery.data?.[0];

    const handleRefresh = ()=>{
        getLocation();
        if(coordinates){
            weatherQuery.refetch();
            forecastQuery.refetch();
            locationQuery.refetch();
        }
    }

    if(locationLoading){
        return  <WeatherSkeleton/>;
    }

    if(!weatherQuery.data || !forecastQuery.data){
        return <WeatherSkeleton/>;
    }

    if(locationError){
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>{locationError}</p>
                    <Button variant="outline" className="w-fit" onClick={getLocation}>
                        <MapPin className="mr-2 h-4 w-4"/>
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if(!coordinates){
        return (
            <Alert>
                <MapPin className="h-4 w-4"/>
                <AlertTitle>Location Required</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Please enable location access to see your local weather.</p>
                    <Button variant="outline" className="w-fit" onClick={getLocation}>
                        <MapPin className="mr-2 h-4 w-4"/>
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if(weatherQuery.error || forecastQuery.error){
        return (
            <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Failed to fetch weather data. Please try again.</p>
                    <Button variant="outline" className="w-fit" onClick={handleRefresh}>
                        <RefreshCcw className="mr-2 h-4 w-4"/>
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            <FavoriteCities/>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">
                    My Location
                </h1>
                <Button onClick={handleRefresh}
                        variant="outline" 
                        size="icon"
                        className="cursor-pointer"
                        disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
                    <RefreshCcw className={`w-4 h-4 ${weatherQuery.isFetching? "animate-spin":""}`}/>
                </Button>
            </div>

            <div className="grid gap-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <CurrentWeather data={weatherQuery.data} locationName={locationName}/>
                    <HourlyTemperature data={forecastQuery.data}/>
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-start">
                    <WeatherDatails data={weatherQuery.data}/>
                    <WeatherForecast data={forecastQuery.data}/>
                </div>
            </div>
        </div>
    )
}