import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useNavigate } from "react-router-dom";
import {format} from "date-fns";
import { useFavorites } from "@/hooks/use-favorites";

export function CitySearch(){
    const [open,setOpen] = useState(false);
    const [query,setQuery] = useState("");
    const navigate = useNavigate();

    const {data:locations,isLoading} = useLocationSearch(query);
    const {history,addToHistory,clearHistory} = useSearchHistory();
    const {favorites} = useFavorites();

    const handleSelect = (cityData:string) =>{
        const [lat,lon,name,country] = cityData.split("|")
        addToHistory.mutate({query, name, lat:parseFloat(lat), lon:parseFloat(lon), country});
        setOpen(false);
        navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    }

    return (
        <>
            {/*搜索按钮*/}
            <Button variant="outline"
                    onClick={() => setOpen(true)}
                    className="relative w-full justify-start cursor-pointer text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
                <Search className="mr-2 h-4 w-4"/>
                Search cities...
            </Button>

            {/*搜索弹出框*/}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput placeholder="Search cities..." value={query} onValueChange={setQuery}/>
                    
                    <CommandList>
                        {query.length>2 && !isLoading && (
                            <CommandEmpty>No cities found.</CommandEmpty>
                        )}
                        
                        {/* Favorites Section */}
                        {favorites.length>0 && (
                            <CommandGroup heading="Favorites">
                                {favorites.map((item)=>(
                                    <CommandItem key={item.id} value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                                                 onSelect={handleSelect}>
                                        <Star className="mr-2 h-4 w-4 text-yellow-500"/>
                                        <span>{item.name}</span>
                                        {item.state && (
                                            <span className="text-sm text-muted-foreground"> , {item.state}</span>
                                        )}
                                        <span className="text-sm text-muted-foreground"> , {item.country}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* Search History Section */}
                        {history.length>0 && (
                            <>
                                <CommandSeparator/>
                                <CommandGroup>
                                    <div className="flex items-center justify-between px-2 my-2">
                                        <p className="text-xs text-muted-foreground">Recent Searchs</p>
                                        <Button variant="ghost" size="sm" onClick={()=>clearHistory.mutate()}> 
                                            <XCircle className="h-4 w-4"/>
                                            Clear
                                        </Button>
                                    </div>
                                    {history.map((item)=>(
                                        <CommandItem key={item.id}
                                                     value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                                                     onSelect={handleSelect}>  {/*<CommandItem>组件本身在源码里规定了——当触发onSelect时，要把它的value当作参数传进去*/}
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground"/>
                                            <span>{item.name}</span>
                                            {item.state && (
                                                <span className="text-sm text-muted-foreground"> , {item.state}</span>
                                            )}
                                            <span className="text-sm text-muted-foreground"> , {item.country}</span>
                                            <span className="ml-auto text-xs text-muted-foreground">{format(item.searchAt, "MMM d, h:mm a")}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}

                        {/*  Search Results */}
                        <CommandSeparator/>
                        {locations && locations.length>0 && (
                            <CommandGroup heading="Suggestions">
                                {isLoading && (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                    </div>
                                )}
                                {locations?.map((location)=>(
                                    <CommandItem key={`${location.lat}-${location.lon}`}
                                                 value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                                 onSelect={handleSelect}>
                                        <Search className="mr-2 h-4 w-4"/>
                                        <span>{location.name}</span>
                                        {location.state && (
                                            <span className="text-sm text-muted-foreground"> , {location.state}</span>
                                        )}
                                        <span className="text-sm text-muted-foreground"> , {location.country}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                    </CommandList>
                </Command>
            </CommandDialog>
        
        </>
    )
}