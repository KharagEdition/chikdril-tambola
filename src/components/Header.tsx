import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed w-full z-50 bg-black/30 backdrop-blur-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Tambola
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              href="#features"
              className="hover:text-purple-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#download"
              className="hover:text-purple-400 transition-colors"
            >
              Download
            </Link>
            <Link
              href="#about"
              className="hover:text-purple-400 transition-colors"
            >
              About
            </Link>
          </div>
          <a href="https://apps.apple.com/us/app/tibetan-calendar-app/id6741181925?platform=iphone">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:scale-105 transition-transform">
              Play Now
            </button>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
