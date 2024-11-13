import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-4 mt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Info</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Search</a></li>
            <li><a href="#" className="hover:underline">Contact Information</a></li>
          </ul>
          
          <h3 className="font-bold text-lg mt-8 mb-4">Subscribe to our emails</h3>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email" 
              className="flex-grow rounded-l-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-gray-200 rounded-r-full px-4 py-2 hover:bg-gray-300">
              →
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4">Our Mission</h3>
          <p>To bring the highest quality, freshest fruits and vegetables straight from the farms to your doorstep.</p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4">Call or WhatsApp</h3>
          <p>Contact Us <a href="tel:+94743654483" className="text-blue-600 hover:underline">+94 74 365 4483</a></p>
          
          <div className="mt-8 flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-600">
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2024, Farm Fresh, Designed by Agaxe Startups</p>
        <ul className="flex justify-center space-x-4 mt-2">
          <li><a href="#" className="hover:underline">Refund policy</a></li>
          <li><a href="#" className="hover:underline">Privacy policy</a></li>
          <li><a href="#" className="hover:underline">Terms of service</a></li>
          <li><a href="#" className="hover:underline">Shipping policy</a></li>
          <li><a href="#" className="hover:underline">Contact information</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;