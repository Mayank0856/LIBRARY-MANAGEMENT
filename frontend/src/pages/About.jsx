import React from 'react';
import { Book, Users, Star, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">Empowering minds through reading.</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Our mission is to provide seamless access to knowledge by leveraging state-of-the-art technology to manage and grow physical and digital library collections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" 
          alt="Library Space" 
          className="rounded-[2rem] shadow-2xl h-[400px] w-full object-cover"
        />
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">A legacy of knowledge automation.</h2>
          <p className="text-lg text-gray-600 leading-relaxed text-justify">
            Founded in 2024, LibraryMS has quickly grown from a small prototype to a robust platform used by leading academic institutions. We believe that a library is the heart of any community, and our goal is to keep that heart beating efficiently. 
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
             <div>
                <p className="text-3xl font-bold text-indigo-600">10k+</p>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Titles Tracked</p>
             </div>
             <div>
                <p className="text-3xl font-bold text-indigo-600">500+</p>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Institutions</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-[3rem] p-12 lg:p-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-indigo-600">
                 <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community First</h3>
              <p className="text-gray-600">We design every feature with the student and librarian experience in mind.</p>
           </div>
           <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-indigo-600">
                 <Star size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-600">Bridging the gap between traditional libraries and modern digital needs.</p>
           </div>
           <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-indigo-600">
                 <Award size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-600">Committed to 99.9% uptime and data accuracy across all transactions.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;
