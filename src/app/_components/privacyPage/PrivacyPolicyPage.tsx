'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bungee font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className=" overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="prose prose-gray max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  At [Your Company Name], we take your privacy seriously. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit our website and use our services. Please
                  read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please
                  do not access the site.
                </p>
              </section>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 Personal Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Create an account</li>
                    <li>Make a purchase</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us for customer support</li>
                    <li>Leave a review or comment</li>
                    <li>Participate in promotions or surveys</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    This information may include your name, email address, phone number, mailing address, billing
                    address, payment information, and any other information you choose to provide.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 Automatically Collected Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you visit our website, we may automatically collect certain information about your device and
                    usage patterns, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>IP address and geolocation data</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referring website</li>
                    <li>Device identifiers</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.3 Third-Party Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may receive information about you from third parties, such as social media platforms, payment
                    processors, shipping companies, and marketing partners, in accordance with their privacy policies.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Processing and fulfilling your orders</li>
                  <li>Managing your account and providing customer service</li>
                  <li>Sending you important updates about your orders and account</li>
                  <li>Personalizing your shopping experience</li>
                  <li>Improving our website and services</li>
                  <li>Conducting analytics and research</li>
                  <li>Sending marketing communications (with your consent)</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                  <li>Enforcing our terms and conditions</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">3. Cookies and Tracking Technologies</h2>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 What Are Cookies</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cookies are small data files that are stored on your device when you visit our website. They help us
                    remember your preferences and improve your browsing experience.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Types of Cookies We Use</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>Essential Cookies:</strong> Required for the website to function properly
                    </li>
                    <li>
                      <strong>Performance Cookies:</strong> Help us understand how visitors interact with our website
                    </li>
                    <li>
                      <strong>Functional Cookies:</strong> Remember your preferences and settings
                    </li>
                    <li>
                      <strong>Marketing Cookies:</strong> Used to deliver personalized advertisements
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Managing Cookies</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can control cookies through your browser settings. However, disabling certain cookies may affect
                    the functionality of our website.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except in the following circumstances:
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Service Providers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may share your information with trusted third-party service providers who assist us in operating
                    our website, conducting our business, or servicing you, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                    <li>Payment processors</li>
                    <li>Shipping and logistics companies</li>
                    <li>Email service providers</li>
                    <li>Customer support tools</li>
                    <li>Analytics providers</li>
                    <li>Marketing platforms</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Legal Requirements</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may disclose your information when required by law, legal process, or to protect our rights,
                    property, or safety, or that of others.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Business Transfers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                    part of the transaction.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">5. Data Security</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. These measures
                  include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we
                  strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in
                  this privacy policy, unless a longer retention period is required by law. Factors we consider when
                  determining retention periods include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>The nature and sensitivity of the information</li>
                  <li>The purposes for which we collected the information</li>
                  <li>Legal and regulatory requirements</li>
                  <li>Business needs and legitimate interests</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.1 Access and Correction</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can access and update your account information by logging into your account or contacting us
                    directly.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.2 Marketing Communications</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can opt out of marketing communications at any time by clicking the unsubscribe link in our
                    emails or updating your preferences in your account settings.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.3 Data Portability and Deletion</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may request a copy of your personal information or ask us to delete your data, subject to
                    certain limitations and legal requirements.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy
                  practices or content of these external sites. We encourage you to review the privacy policies of any
                  third-party websites you visit.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under the age of 13. We do not knowingly collect personal
                  information from children under 13. If we become aware that we have collected personal information
                  from a child under 13, we will take steps to remove such information from our systems.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure
                  appropriate safeguards are in place to protect your information in accordance with applicable data
                  protection laws.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. California Privacy Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  California residents have specific rights under the California Consumer Privacy Act (CCPA), including:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of the sale of personal information</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              {/* Section 12 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time to reflect changes in our practices or for other
                  operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                  new privacy policy on our website and updating the &quot;Last Updated&quot; date. Your continued use
                  of our services after the effective date constitutes acceptance of the revised privacy policy.
                </p>
              </section>

              {/* Contact Section */}
              <section className="mb-8 bg-secondary p-6 ">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, your personal information, or how we handle your
                  data, please contact us at:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <span>privacy@yourcompany.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span>123 Business Street, City, State 12345</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span>www.yourcompany.com</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
