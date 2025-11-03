import type { PropsWithChildren } from "react";
import Header from "./header";

export const Layout = ({children}:PropsWithChildren<{}>) =>{
    return (
        <div>
            <Header/>
            <main className="min-h-screen container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60 py-12">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>Made with ♥ by GlouKit</p>
                </div>
            </footer>
        </div>
    )
}