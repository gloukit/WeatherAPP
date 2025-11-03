import type { GeocodingResponse, WeatherData } from "@/api/types"
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplet, Wind } from "lucide-react";

interface CurrentWeatherProps {
    data:WeatherData;
    locationName?:GeocodingResponse;
}

export function CurrentWeather({data, locationName}:CurrentWeatherProps){
    const {weather:[currentWeather],  //将weather数组解构并重命名为currentWeather
           main:{temp,feels_like,temp_min,temp_max,humidity},
           wind:{speed}
    } = data;

    const formatTemp = (temp:number) => `${Math.round(temp)}°`;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    
                    <div className="space-y-4">
                        {/*城市，州 + 国家*/}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold tracking-tight">{locationName?.name}</h2>
                                {locationName?.state && (
                                    <span className="text-muted-foreground"> , {locationName.state}</span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{locationName?.country}</p>
                        </div>

                        {/*气温+ {体感温度、最低温、最高温}*/}
                        <div className="grid grid-cols-2 items-end gap-5">
                            <p className="text-7xl font-bold tracking-tighter">
                                {formatTemp(temp)}
                            </p>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Feels like {formatTemp(feels_like)}
                                </p>
                                <div className="flex gap-2 text-sm font-medium">
                                    <span className="flex items-center gap-1 text-blue-500">
                                        <ArrowDown className="h-3 w-3"/>
                                        {formatTemp(temp_min)}
                                    </span>
                                    <span className="flex items-center gap-1 text-red-500">
                                        <ArrowUp className="h-3 w-3"/>
                                        {formatTemp(temp_max)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/*湿度、风速*/}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Droplet className="h-4 w-4 text-blue-500"/>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Humidity</p>
                                    <p className="text-sm text-muted-foreground">{humidity}%</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Wind className="h-4 w-4 text-blue-500"/>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Wind Speed</p>
                                    <p className="text-sm text-muted-foreground">{speed} m/s</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*天气图标、天气描述*/}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center aspect-square w-full max-w-[200px]">
                            <img src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                                 alt={currentWeather.description}
                                 className="h-full w-full object-contain"/>
                            <div className="absolute bottom-0 text-center">
                                <p className="text-sm font-medium capitalize">{currentWeather.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}