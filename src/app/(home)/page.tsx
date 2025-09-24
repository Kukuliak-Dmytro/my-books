import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="w-full flex flex-col items-center">
        <h1>
          Welcome to Boo!
        </h1>
        <h2>Manage your books in one place!</h2>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div>
            <h3>My List</h3>
          </div>
          <div>
            <h3>Friends</h3>
          </div>
          <div>
            <h3>ARating</h3>
          </div>
          <div>
            <h3>Profile</h3>
          </div>
        </div>
      </div>
    </main>
  );
}
