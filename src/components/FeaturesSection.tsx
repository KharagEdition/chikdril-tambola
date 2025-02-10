import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      title: "Multiplayer Fun",
      imageUrl:
        "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-multiplayer-gaming-ecommerce-flaticons-lineal-color-flat-icons.png",
      description:
        "Play with friends and family in real-time multiplayer matches.",
      delay: 100,
    },
    {
      title: "Daily Tournaments",
      description: "Compete in daily tournaments with amazing prizes.",
      delay: 200,
      imageUrl:
        "https://img.icons8.com/external-goofy-color-kerismaker/96/external-Tournament-baseball-goofy-color-kerismaker.png",
    },
    {
      title: "Custom Rooms",
      description: "Create private rooms and play with your friends.",
      delay: 300,
      imageUrl: "https://img.icons8.com/fluency/48/meeting-room.png",
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16" data-aos="fade-up">
          Game Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
