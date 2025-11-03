import { useWeatherQuery } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface FavoriteCityTabletProps{
    id:string;
    name:string;
    lat:number;
    lon:number;
    onRemove:(id:string)=>void;
}

function FavoriteCityTablet({id,name,lat,lon,onRemove}:FavoriteCityTabletProps){
    const navigate = useNavigate();
    const {data:weather,isLoading} = useWeatherQuery({lat,lon});

    const handleClick = () =>{
        navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    }
    console.log(id)

    return (
        <div onClick={handleClick} role="button" tabIndex={0}
              className="relative flex min-w-[250px] cursor-pointer items-center gap-3 border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md">
            <Button variant="ghost" size="icon"
                    className="absolute right-1 top-1 h-6 w-6 p-0 rounded-full hover:text-muted-foreground group-hover:opacity-100"
                    onClick={(e)=>{
                        e.stopPropagation();
                        onRemove(id);
                        toast.error(`Remove ${name} from Favorites`);
                    }}>
                <X className="h-4 w-4"/>
            </Button>

            {isLoading?(
                <div className="flex h-8 items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                </div>
            ) : weather?(
                <>
                    <div className="flex items-center gap-2">
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                             alt={weather.weather[0].description}
                             className="h-8 w-8"/>
                        <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
                        </div>
                    </div>

                    <div className="ml-auto text-right">
                        <p className="text-xl font-bold">{Math.round(weather.main.temp)}°</p>
                        <p className="text-xs capitalize text-muted-foreground">{weather.weather[0].description}</p>
                    </div>
                </>
            ) : null}
        </div>
    )
}



export default function FavoriteCities(){
    const {favorites,removeFavorite} = useFavorites();

    if(!favorites.length){
        return null;
    }
    console.log("list:", favorites)

    return (
        <>
            <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
            <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                    {favorites.map((item)=>(
                        <FavoriteCityTablet key={item.id} 
                                            {...item}
                                            onRemove={()=>removeFavorite.mutate(item.id)} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="mt-2" />
            </ScrollArea>
        </>
    )
}