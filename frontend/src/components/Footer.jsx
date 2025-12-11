// Footer.jsx
import React from "react";
import { Mail, Phone, MapPin, Twitter, Instagram, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-16 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">About Codexa</h3>
          <p className="text-gray-300">
            Codexa is your ultimate platform for coding excellence. Solve problems, track progress, and grow your skills with our cutting-edge tools and vibrant community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="text-gray-300 space-y-2">
            <li><a href="#" className="hover:text-orange-500 transition">Problems</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Profile</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Report an Issue</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Feedback</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center gap-2"><Mail size={16} /> Codemani@.in</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +91 123 456 789</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> 123 Codemani Street, Tech City</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-4">Newsletter</h3>
          <p className="text-gray-300 mb-4">Stay updated with the latest coding challenges and tips.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="p-2 rounded-l-xl outline-none text-black bg-white flex-1"
            />
            <button className="bg-orange-500 px-4 rounded-r-xl font-semibold hover:bg-orange-600 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Social Icons */}
      <div className="max-w-6xl mx-auto mt-8 flex justify-center gap-6 text-gray-300">
        <Twitter size={20} className="hover:text-orange-500 transition cursor-pointer" />
        <Instagram size={20} className="hover:text-orange-500 transition cursor-pointer" />
        <Github size={20} className="hover:text-orange-500 transition cursor-pointer" />
        <Linkedin size={20} className="hover:text-orange-500 transition cursor-pointer" />
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-center gap-4">
        <span>© 2025 Codemani. All rights reserved.</span>
        <span className="hover:text-orange-500 cursor-pointer">Privacy Policy</span>
        <span className="hover:text-orange-500 cursor-pointer">Terms of Service</span>
      </div>
    </footer>
  );
};

export default Footer;
