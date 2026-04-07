import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactItem = ({ icon, title, text }) => (
  <div className="flex gap-4">
    <div className="bg-indigo-600 p-3 rounded-xl text-white shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-900">{title}</h4>
      <p className="text-gray-600">{text}</p>
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Get in touch with us.</h1>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Have questions about library membership, book donations, or technical issues? Our team is here to help you get the most out of your reading experience.
          </p>
          
          <div className="space-y-8">
            <ContactItem icon={<Mail size={24} />} title="Email Support" text="support@libraryms.edu" />
            <ContactItem icon={<Phone size={24} />} title="Phone" text="+91 (555) 012-3456" />
            <ContactItem icon={<MapPin size={24} />} title="Location" text="Main Library Building, Sector 44, Tech City" />
          </div>
        </div>

        <div className="card p-10 shadow-2xl shadow-indigo-100 border-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" className="input" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" className="input" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="input" placeholder="jane@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea className="input" rows={4} placeholder="How can we help you?"></textarea>
            </div>
            <button className="btn btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg">
              Send Message <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
