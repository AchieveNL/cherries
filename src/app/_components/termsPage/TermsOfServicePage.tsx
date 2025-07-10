'use client';

import { Globe, Mail, MapPin, Phone } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bungee font-bold text-gray-900 mb-2">Terms of Service</h1>
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
              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Definitions</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>&quot;Company&quot;</strong> refers to [Your Company Name]
                  </li>
                  <li>
                    <strong>&quot;Service&quot;</strong> refers to the website and all related services
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
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on our website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  This license shall automatically terminate if you violate any of these restrictions and may be
                  terminated by us at any time.
                </p>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Account Registration</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access certain features of our Service, you may be required to create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Products and Services</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Product Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant
                    that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Pricing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All prices are subject to change without notice. We reserve the right to modify or discontinue
                    products at any time. Prices do not include taxes, shipping, or handling charges unless otherwise
                    stated.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Availability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Product availability is subject to change. We cannot guarantee that items will be in stock when you
                    place your order.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Orders and Payment</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Order Acceptance</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your order is an offer to buy products from us. All orders are subject to acceptance by us. We may
                    decline orders for any reason, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Product unavailability</li>
                    <li>Errors in product or pricing information</li>
                    <li>Suspected fraudulent activity</li>
                    <li>Failure to meet our credit requirements</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Payment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Payment is due at the time of order placement. We accept major credit cards, PayPal, and other
                    payment methods as displayed at checkout. By providing payment information, you represent and
                    warrant that you have the legal right to use the payment method.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 Order Confirmation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    After placing an order, you will receive an email confirmation. This confirmation does not
                    constitute our acceptance of your order, merely confirmation that we have received it.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Shipping and Delivery</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.1 Shipping Policy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We will make every effort to ship products within our stated timeframes. However, delivery dates are
                    estimates and not guarantees. We are not responsible for delays caused by shipping carriers or
                    circumstances beyond our control.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.2 Risk of Loss</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Title and risk of loss pass to you upon delivery to the shipping carrier.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7.3 International Shipping</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Additional duties, taxes, and fees may apply to international orders. You are responsible for these
                    charges.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Returns and Refunds</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.1 Return Policy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Returns are accepted within 30 days of delivery, provided items are in original condition. Some
                    products may not be eligible for return due to hygiene or safety reasons.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.2 Return Process</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To initiate a return, contact our customer service team. You may be responsible for return shipping
                    costs unless the item was defective or shipped in error.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.3 Refunds</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Refunds will be processed within 5-7 business days of receiving and inspecting returned items.
                    Refunds will be issued to the original payment method.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content on this website, including but not limited to text, graphics, logos, images, and software,
                  is the property of [Company Name] or its licensors and is protected by copyright and other
                  intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By submitting content to our Service (reviews, comments, etc.), you grant us a non-exclusive,
                  royalty-free, perpetual license to use, modify, and display such content.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our
                  Service, to understand our practices.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">You may not use our Service:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local
                    ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of
                    others
                  </li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To collect or track personal information of others</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent security features of our Service</li>
                </ul>
              </section>

              {/* Section 12 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall [Company Name], its officers, directors, employees, or agents be liable for any
                  indirect, incidental, special, consequential, or punitive damages, including without limitation, loss
                  of profits, data, use, goodwill, or other intangible losses, resulting from your use of our Service.
                </p>
              </section>

              {/* Section 13 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">13. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and bar access to our Service immediately, without prior
                  notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
                  including but not limited to a breach of the Terms.
                </p>
              </section>

              {/* Section 14 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed and construed in accordance with the laws of [State/Province, Country],
                  without regard to its conflict of law provisions. Our failure to enforce any right or provision of
                  these Terms will not be considered a waiver of those rights.
                </p>
              </section>

              {/* Section 15 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">15. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                  revision is material, we will try to provide at least 30 days notice prior to any new terms taking
                  effect.
                </p>
              </section>

              {/* Contact Section */}
              <section className="mb-8 bg-secondary p-6 ">
                <h2 className="text-xl font-bold text-text">Contact Information</h2>
                <p className="text-text leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <span>support@yourcompany.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-3 text-gray-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                    <span>123 Business Street, City, State 12345</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="h-5 w-5 mr-3 text-gray-500" />
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
