
import type { WeatherData } from "@/api/types"
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

interface FavoriteButtonProps{
    data:WeatherData;
}

export function FavoriteButton({data}:FavoriteButtonProps){
    const {addFavorite,removeFavorite,isFavorite,favorites}=useFavorites();
    const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

    console.log(favorites);
    console.log(isCurrentlyFavorite);
    
    const handleToggleFvorite = () =>{
        if(isCurrentlyFavorite){
            removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
            toast.error(`Removed ${data.name} from Favorites`);
        } else {
            addFavorite.mutate({
                name: data.name,
                lat : data.coord.lat,
                lon : data.coord.lon,
                country : data.sys.country
            });
            toast.success(`Added ${data.name} to Favorites`);
        }
    };

    return (
        <Button onClick={handleToggleFvorite}
                variant={isCurrentlyFavorite? "default" : "outline"}
                size="icon"
                className={isCurrentlyFavorite?"bg-yellow-500 hover:bg-yellow-300" : ""}>
            <Star className={`h-4 w-4 ${isCurrentlyFavorite? "fill-current" : ""}`}/>
        </Button>
    )
}