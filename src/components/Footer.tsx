import Image from "next/image";
import Link from "next/link";
const socalLogin = [
  {
    name: "Facebook",
    icon: "https://img.icons8.com/fluency/48/facebook-new.png",
  },
  {
    name: "Twitter",
    icon: "https://img.icons8.com/color/96/twitterx--v1.png",
  },
  {
    name: "Instagram",
    icon: "https://img.icons8.com/fluency/48/instagram-new.png",
  },
];
const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-md py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Tambola
            </h3>
            <p className="text-gray-400">
              The ultimate social gaming experience.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-400 transition-colors"
                >
                  Download
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socalLogin.map((social) => (
                <Link
                  key={social.name}
                  href="#"
                  className="hover:text-purple-400 transition-colors"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={24}
                    height={24}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 KharagEdition. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
