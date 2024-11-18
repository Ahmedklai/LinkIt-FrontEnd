import Link from "next/link";

export const Header = () => {
  return (
    <header className="w-full py-4">
      <div className="container mx-auto px-4 flex justify-center">
        <Link href="/" className="text-2xl font-bold inline-block">
          <h1 className="bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            LinkIt
          </h1>
        </Link>
      </div>
    </header>
  );
};
