// LearnersWork.jsx
import React from "react";

const companies = [
  { name: "Apple", logo: "/apple.jpg" },
  { name: "Facebook", logo: "/facebook.jpg" },
  { name: "Google", logo: "/google.jpg" },
  { name: "Jio", logo: "/jio.jpg" },
  { name: "Netflix", logo: "/netflix.jpg" },
];

const LearnersWork = () => {
  return (
    <section className="w-full py-16 bg-gray-50 relative">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Our Learners Work At
      </h2>

      {/* SCROLLER CONTAINER */}
      <div className="relative w-full overflow-hidden">
        {/* Fade overlay on left and right */}
        <div className="absolute top-0 left-0 h-full w-[20%] bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-[20%] bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none" />

        {/* SCROLLING LOGOS */}
        <div className="flex animate-scroll gap-16">
          {companies.concat(companies).map((company, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center min-w-[180px] transition-transform duration-300 hover:scale-105"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-20 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default LearnersWork;
