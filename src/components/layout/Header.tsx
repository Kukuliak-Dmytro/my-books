"use client";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import  { useTheme } from "next-themes";
import { LogOut, SlidersHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
export default function Header() {
    const { theme, setTheme } = useTheme();
    return (
        <header className="container mx-auto bg-primary fixed top-0 ">
            <nav className="flex justify-center items-center border-b border-b-slate-300 relative">
                <ul className="flex gap-4 items-center justify-center p-4 text-lg font-bold pl-10">
                    <li><h3>
                            <Link href="/">Home</Link>
                        </h3></li>
                    <li><h3>
                        <Link href="/list">My list</Link>
                    </h3></li>
                    <li><h3>
                        <Link href="/friends">Friends</Link>
                    </h3></li>
                    <li><h3>
                        <Link href="/rating">Rating</Link>
                    </h3></li>
                </ul>
                <div className="absolute right-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-center cursor-pointer"><SlidersHorizontal /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => redirect("/account")}>My Account</DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "Light" : "Dark"} mode</DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem><span onClick={() => console.log("Log out")}>Log out</span></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    )
}