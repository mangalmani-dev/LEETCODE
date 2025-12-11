import React from 'react'
import LandingNavbar from '../components/LandingNavbar';
import Hero3D from '../components/Hero3D';
import LearnersWork from '../components/LearnerWorks';
import FeaturesCards from '../components/FeaturesCard';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-white text-black">
      <LandingNavbar />
      <Hero3D/>
      <LearnersWork/>
      <FeaturesCards/>
      <Footer/>

      {/* Other landing sections */}
    </div>
  );
};

export default LandingPage;