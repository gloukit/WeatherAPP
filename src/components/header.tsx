import { Link } from "react-router-dom";
import ThemeToggle from "./theme-toggle";
import { useTheme } from "@/context/theme-provider";
import { CitySearch } from "./city-search";


export default function Header(){
    const {theme} = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full py-2 border-b bg-backgroud/95 
                           backdrop-blur supports-[backdrop-filter]:bg-background/60"> {/*给该元素底下的背景加模糊效果（backdrop-blur）,如果浏览器支持这个特性，再让背景半透明（bg-background/60） */}
            <div className="h-16 container mx-auto flex items-center justify-between px-4">
                <Link to="/">
                    <img src={theme==="dark"? "/logo.png":"/logo2.png"} alt="Klimate logo" className="h-14"/>
                </Link>

                <div className="flex gap-4">
                    <CitySearch/>
                    <ThemeToggle/>
                </div>
            </div>
        </header>
    )
}