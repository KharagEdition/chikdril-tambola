import Image from "next/image";

interface AppStoreButtonProps {
  platform: "ios" | "android";
  imageUrl: string;
  routeUrl?: string;
}

const AppStoreButton = ({
  platform,
  imageUrl,
  routeUrl,
}: AppStoreButtonProps) => {
  const text = platform === "ios" ? "App Store" : "Play Store";

  return (
    <a href={routeUrl}>
      <button className="bg-white text-purple-900 px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center">
        <Image
          src={imageUrl}
          alt={text}
          width={24}
          height={24}
          className="mr-2"
        />
        {text}
      </button>
    </a>
  );
};

export default AppStoreButton;
