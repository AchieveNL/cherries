'use client';

import { Globe, Mail, MapPin } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bungee font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: September 9, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className=" overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="prose prose-gray max-w-none">
              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using this website, you accept and agree to be bound by these Terms and Conditions.
                  If you do not agree, please do not use this Service.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Definitions</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>&quot;Company&quot;</strong> refers to Cherries B.V.
                  </li>
                  <li>
                    <strong>&quot;Service&quot;</strong> refers to the website www.cherriesofficial.com and all related
                    services
                  </li>
                  <li>
                    <strong>&quot;User&quot;</strong> refers to anyone who uses our Service
                  </li>
                  <li>
                    <strong>&quot;Products&quot;</strong> refers to any goods or services offered through our Service
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Use License</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on our website for personal,
                  non-commercial use only. This license does not transfer ownership, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or public display</li>
                  <li>Attempt to reverse engineer any software contained on our website</li>
                  <li>Remove copyright or other proprietary notices</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  This license shall automatically terminate if you violate any restrictions and may be terminated by us
                  at any time.
                </p>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Account Registration</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access certain features of our Service, you may be required to create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Products and Services</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Product Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We strive to provide accurate product descriptions, images, and pricing. However, we do not
                    guarantee that content is free of errors.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Pricing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All prices are stated in euros (€) and include VAT (BTW), unless otherwise mentioned. Prices are
                    subject to change without notice. Shipping costs are displayed separately at checkout.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Availability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Product availability may vary. We cannot guarantee that all items are in stock at all times.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Orders and Payment</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Order Acceptance</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your order represents an offer to purchase products. We reserve the right to decline orders for
                    reasons such as:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Product unavailability</li>
                    <li>Errors in product/pricing information</li>
                    <li>Suspected fraudulent activity</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Payment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Payment must be made at the time of ordering. We accept iDEAL, major credit cards, PayPal, and other
                    methods shown at checkout.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 Order Confirmation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    After placing an order, you will receive an email confirmation. This does not yet constitute
                    acceptance of your order.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Shipping and Delivery</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.1 Shipping Policy</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Delivery Times</h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Netherlands & Belgium: delivery within 1–2 business days</li>
                      <li>• Other EU countries / worldwide: 5–14 business days</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Delays caused by carriers or force majeure are beyond our responsibility.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.2 Risk of Loss</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Ownership and risk transfer to you upon delivery to the shipping carrier.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.3 International Shipping</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Additional duties, taxes, and customs charges may apply. You are responsible for these costs.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Returns and Refunds</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.1 Right of Withdrawal (EU Law)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Consumers in the EU have the right to withdraw from their purchase within 14 days after receiving
                    the product, without giving any reason.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.2 Return Conditions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Returned items must be unused and in original condition. Certain items may be excluded due to
                    hygiene or safety reasons.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.3 Return Costs</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Return shipping costs are at your expense, unless the item was defective or sent in error.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.4 Refunds</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Refunds will be processed within 14 days after receipt and inspection of the returned goods, using
                    the same payment method used in the original transaction.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content on this website (text, graphics, logos, images, software) is the property of Cherries B.V.
                  or its licensors.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By submitting content (e.g. reviews), you grant us a non-exclusive, royalty-free license to use and
                  display such content.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our
                  Service.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">You may not use our Service to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Break the law or violate regulations</li>
                  <li>Infringe intellectual property rights</li>
                  <li>Harass, abuse, defame, or discriminate</li>
                  <li>Upload viruses or malicious code</li>
                  <li>Collect or track personal data without consent</li>
                  <li>Spam, phish, or crawl our systems</li>
                </ul>
              </section>

              {/* Section 12 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  Cherries B.V. shall not be liable for indirect or consequential damages, including but not limited to
                  loss of profit, data, or goodwill.
                </p>
              </section>

              {/* Section 13 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">13. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may suspend or terminate access to our Service at any time if these Terms are violated.
                </p>
              </section>

              {/* Section 14 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Legal Framework</h3>
                  <p className="text-green-800 mb-2">
                    These Terms are governed by the laws of the Netherlands and EU regulations.
                  </p>
                  <p className="text-green-800">
                    In case of disputes, you may also submit a complaint via the European Online Dispute Resolution
                    (ODR) platform:{' '}
                    <a href="https://ec.europa.eu/consumers/odr" className="underline text-green-700">
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </p>
                </div>
              </section>

              {/* Section 15 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">15. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to update these Terms at any time. Updates will be published on this page.
                  Continued use of the Service after changes implies acceptance.
                </p>
              </section>

              {/* Contact Section */}
              <section className="mb-8 bg-secondary p-6 ">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>

                <div className="space-y-3">
                  <div className="text-gray-700">
                    <strong>Cherries B.V.</strong>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <span>info@cherriesofficial.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Kiotoweg 351, 3047 BG Rotterdam, The Netherlands</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="h-5 w-5 mr-3 text-gray-500" />
                    <span>www.cherriesofficial.com</span>
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
