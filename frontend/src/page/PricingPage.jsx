import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <div className="bg-white min-h-screen">

      {/* TOP BANNER */}
      <div className="bg-[#FFC400] text-black text-center py-2 font-medium text-sm">
        Codemani is in Beta! Join now for lifetime access to new problems, sheets & premium features.
      </div>

      {/* MAIN SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-center text-5xl font-extrabold text-black">
          Unlock Your Coding Potential
        </h1>
        <p className="text-center text-gray-600 mt-3 text-lg">
          Choose a plan that fits your goals. Get lifetime access to Codemani resources with no recurring fees.
        </p>

        {/* PRICING CARDS */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 justify-center">

          {/* FREE PLAN */}
          <PlanCard
            title="Freemium"
            price="₹0"
            buttonText="Current Plan"
            buttonStyle="bg-black text-white"
            features={[
              "Access to 100+ coding problems",
              "Community sheets and challenges",
              "Basic platform roadmaps",
              "1 month of AI discussion access",
              "Basic progress tracking and analytics",
            ]}
          />

          {/* PRO PLAN */}
          <PlanCard
            title="Pro"
            price="₹1999"
            label="one-time payment + GST"
            buttonText="Unlock Pro"
            buttonStyle="bg-[#FFC400] text-black font-semibold"
            features={[
              "500+ coding problems",
              "Premium sheets and challenges",
              "AI-powered personalized paths",
              "Priority support",
              "6 months AI discussion access",
              "Advanced progress analytics",
            ]}
          />

          {/* PREMIUM PLAN */}
          <PlanCard
            title="Premium"
            price="₹4999"
            label="one-time payment + GST"
            buttonText="Go Premium"
            buttonStyle="bg-black text-white"
            features={[
              "Unlimited coding problems",
              "Premium sheets & challenges",
              "Advanced AI learning paths",
              "1:1 mentorship sessions",
              "Unlimited AI discussion access",
              "Advanced progress analytics",
            ]}
          />

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-3xl font-extrabold">Codemani</h2>
            <p className="text-gray-400 mt-2">
              Empowering coders to excel, one challenge at a time.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Problems</li>
              <li>Profile</li>
              <li>Report Issue</li>
              <li>Feedback</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Contact Us</h3>
            <p className="text-gray-300">support@codemani.in</p>
            <p className="text-gray-300 mt-2">+91 123 456 789</p>
            <p className="text-gray-300">123 Codemani Street, Tech City</p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-3">Stay updated with challenges and tips.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 w-full rounded-l-md text-black"
              />
              <button className="bg-[#FFC400] px-4 rounded-r-md text-black font-semibold">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <p className="text-center text-gray-500 mt-10 text-sm">
          © 2025 Codemani. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

function PlanCard({ title, price, label, buttonText, buttonStyle, features }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 hover:shadow-xl transition">
      <h3 className="text-xl font-bold">{title}</h3>

      <p className="text-5xl font-extrabold mt-4">
        {price}
      </p>
      {label && <p className="text-gray-500 text-sm mt-1">{label}</p>}

      <button
        className={`w-full mt-6 py-3 rounded-xl ${buttonStyle}`}
      >
        {buttonText}
      </button>

      <ul className="mt-8 space-y-3 text-gray-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3">
            <Check size={18} className="text-green-600" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
