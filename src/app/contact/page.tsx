'use client';

import { useState } from 'react';

import { Button } from '../_components/ui';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    issueType: '',
    description: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bungee:wght@400&display=swap');
          .font-bungee {
            font-family: 'Bungee', cursive;
          }
        `}
      </style>

      <h2 className="font-bungee text-2xl md:text-3xl font-bold text-black mb-8 text-center tracking-wide">
        OR FILL OUT THE FORM BELOW
      </h2>

      <div className="space-y-6">
        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-solid border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="fullName"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
          >
            Full Names*
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-solid border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
          >
            Email*
          </label>
        </div>

        {/* Type of Issues */}
        <div className="relative">
          <select
            id="issueType"
            name="issueType"
            value={formData.issueType}
            onChange={handleInputChange}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-solid border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer cursor-pointer"
          >
            <option value="">Select an issue type</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing Question</option>
            <option value="general">General Inquiry</option>
            <option value="support">Customer Support</option>
            <option value="feedback">Feedback</option>
          </select>
          <label
            htmlFor="issueType"
            className={`absolute text-sm text-gray-500 duration-300 transform z-10 origin-[0] bg-white px-2 start-1 ${
              formData.issueType ? 'scale-75 -translate-y-4 top-2 text-red-600' : 'scale-100 -translate-y-1/2 top-1/2'
            } peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-600`}
          >
            Type Of Issues
          </label>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Short Description */}
        <div className="relative">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-solid border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer resize-vertical"
            placeholder=" "
          />
          <label
            htmlFor="description"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
          >
            Short description
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full flex items-center justify-center gap-2">
            Send
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
