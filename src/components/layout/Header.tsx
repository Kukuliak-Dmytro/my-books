import Link from "next/link";

export default function Header() {
    return (
        <header>
            <nav>
                <ul className="flex gap-4 items-center justify-center p-4 bg-primary text-lg font-bold">
                        <li>
                        <h3>
                            <Link href="/">Home</Link>
                        </h3></li>
                        <li><h3>
                            <Link href="/about-us">About Us</Link>
                        </h3></li>
                        <li><h3>
                            <Link href="/contacts">Contacts</Link>
                        </h3></li>
                        <li><h3>
                            <Link href="/posts">Posts</Link>
                        </h3></li>
                </ul>
            </nav>
        </header>
    )
}