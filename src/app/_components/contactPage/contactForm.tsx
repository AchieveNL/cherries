/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState } from 'react';

import { Button } from '../ui';

const contactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    issueType: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setSubmitStatus({ type: 'error', message: 'Naam is verplicht' });
      return false;
    }
    if (!formData.email.trim()) {
      setSubmitStatus({ type: 'error', message: 'Email is verplicht' });
      return false;
    }
    if (!formData.email.includes('@')) {
      setSubmitStatus({ type: 'error', message: 'Geldig email adres is vereist' });
      return false;
    }
    if (!formData.issueType) {
      setSubmitStatus({ type: 'error', message: 'Selecteer een type issue' });
      return false;
    }
    if (!formData.description.trim()) {
      setSubmitStatus({ type: 'error', message: 'Beschrijving is verplicht' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
        });

        // Reset form on success
        setFormData({
          fullName: '',
          email: '',
          issueType: '',
          description: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Er is een fout opgetreden. Probeer het later opnieuw.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message:
          'Er is een fout opgetreden bij het verzenden. Controleer je internetverbinding en probeer het opnieuw.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl container mx-auto mt-48 md:mt-0 p-6 bg-white">
      <h2 className="font-bungee text-2xl md:text-[73px] font-bold text-black my-24 text-center leading-none tracking-wide ">
        OR FILL OUT THE FORM BELOW
      </h2>

      <div className="space-y-8">
        {/* Status Message */}
        {submitStatus.type && (
          <div
            className={`p-4 rounded-lg border ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <p className="font-medium">{submitStatus.message}</p>
          </div>
        )}

        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-solid border-black appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g. Jack Tran"
          />
          <label
            htmlFor="fullName"
            className="absolute text-2xl font-bold text-black duration-300 transform z-10 origin-[0] bg-white px-2 scale-100 top-0 -translate-y-4 start-1"
          >
            Full Names <span className="text-primary">*</span>
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
            disabled={isSubmitting}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-solid border-black appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g. example@gmail.com"
          />
          <label
            htmlFor="email"
            className="absolute text-2xl font-bold text-black duration-300 transform z-10 origin-[0] bg-white px-2 scale-100 top-0 -translate-y-4 start-1"
          >
            Email <span className="text-primary">*</span>
          </label>
        </div>

        {/* Type of Issues */}
        <div className="relative">
          <select
            id="issueType"
            name="issueType"
            value={formData.issueType}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="block px-2.5 pb-2.5 w-full text-2xl text-gray-900 bg-transparent border border-solid border-black appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Type Of Issues</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing Question</option>
            <option value="general">General Inquiry</option>
            <option value="support">Customer Support</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        {/* Short Description */}
        <div className="relative">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
            rows={6}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-solid border-black appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Write a Message"
          />
          <label
            htmlFor="description"
            className="absolute text-2xl text-black font-bold duration-300 transform z-10 origin-[0] bg-white px-2 scale-100 top-0 -translate-y-4 start-1"
          >
            Short description <span className="text-primary">*</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verzenden...
              </>
            ) : (
              <>
                Send
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default contactForm;
