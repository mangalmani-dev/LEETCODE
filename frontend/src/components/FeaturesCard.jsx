// FeaturesCards.jsx
import React from "react";
import { BarChart2, TrendingUp, BookOpen, Type, Users, Map } from "lucide-react";

const features = [
  {
    title: "Performance Dashboard",
    description: "Monitor your coding progress and performance over time.",
    icon: <BarChart2 size={36} className="text-orange-500" />,
  },
  {
    title: "Track Progress",
    description: "Keep track of problems solved, projects built, and milestones achieved.",
    icon: <TrendingUp size={36} className="text-orange-500" />,
  },
  {
    title: "Coding Blogs",
    description: "Read curated blogs to enhance your coding knowledge.",
    icon: <BookOpen size={36} className="text-orange-500" />,
  },
  {
    title: "Language Suits",
    description: "Practice and master multiple programming languages.",
    icon: <Type size={36} className="text-orange-500" />,
  },
  {
    title: "Contribute to Community",
    description: "Share knowledge, solutions, and help others in the community.",
    icon: <Users size={36} className="text-orange-500" />,
  },
  {
    title: "Learning Roadmaps",
    description: "Follow structured paths to master topics efficiently.",
    icon: <Map size={36} className="text-orange-500" />,
  },
];

const FeaturesCards = () => {
  return (
    <section className="w-full py-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Features
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesCards;
