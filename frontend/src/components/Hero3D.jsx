// Hero3D.jsx
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Link } from "react-router-dom"; // ✅ import Link

const FloatingBox = ({ position, color }) => {
  const ref = useRef();
  
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Hero3D = () => {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* TEXT OVERLAY */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Welcome to <span className="text-orange-500">Codemani</span>
        </h1>
        <p className="text-white text-lg md:text-2xl mb-6">
          Master Coding | Solve Problems | Build Projects
        </p>
        <div className="flex gap-4">
          {/* ✅ Use Link to navigate to /signup */}
          <Link
            to="/signup"
            className="px-6 py-3 bg-orange-500 rounded-xl text-white font-semibold hover:scale-105 transition"
          >
            Get Started
          </Link>
          <Link
            to="/learn"
            className="px-6 py-3 border border-white rounded-xl text-white hover:bg-white hover:text-black transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* 3D CANVAS */}
      <Canvas className="absolute top-0 left-0 w-full h-full" camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <FloatingBox position={[-3, 2, 0]} color="#FF6600" />
          <FloatingBox position={[2, -2, -1]} color="#00FFCC" />
          <FloatingBox position={[0, 1, -2]} color="#FF00FF" />
          <FloatingBox position={[3, 0, 1]} color="#00AAFF" />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Hero3D;
