'use client';

export default function WarrantyPage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content */}
        <div className=" overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="prose prose-gray max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Our Warranty Commitment</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We stand behind the quality of our products and want you to have confidence in your purchase. Our
                  warranty program ensures that you&apos;re protected against manufacturing defects and premature
                  failures, giving you peace of mind with every purchase.
                </p>
              </section>

              {/* Quick Reference */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Warranty Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-blue-900">Duration</h3>
                    </div>
                    <p className="text-blue-800">1-3 years depending on product</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-green-900">Coverage</h3>
                    </div>
                    <p className="text-green-800">Manufacturing defects & failures</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-purple-900">Proof Required</h3>
                    </div>
                    <p className="text-purple-800">Original receipt & registration</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-orange-900">Resolution</h3>
                    </div>
                    <p className="text-orange-800">Repair, replace, or refund</p>
                  </div>
                </div>
              </section>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Warranty Coverage by Product Category</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Electronics & Appliances</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Standard Warranty</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Small appliances: 1 year</li>
                          <li>• Major appliances: 2 years</li>
                          <li>• Electronics: 1-2 years</li>
                          <li>• Computers: 1 year</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Extended Coverage</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Parts & labor included</li>
                          <li>• Manufacturer defects</li>
                          <li>• Premature component failure</li>
                          <li>• Power surge protection</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Furniture & Home Goods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Standard Warranty</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Furniture: 1-3 years</li>
                          <li>• Home decor: 1 year</li>
                          <li>• Mattresses: 10 years</li>
                          <li>• Lighting: 2 years</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">What&apos;s Covered</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Structural defects</li>
                          <li>• Manufacturing flaws</li>
                          <li>• Material failures</li>
                          <li>• Workmanship issues</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Clothing & Accessories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Standard Warranty</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Clothing: 90 days</li>
                          <li>• Shoes: 6 months</li>
                          <li>• Accessories: 1 year</li>
                          <li>• Jewelry: 1-2 years</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Coverage Details</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Seam failures</li>
                          <li>• Zipper defects</li>
                          <li>• Material defects</li>
                          <li>• Hardware failures</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. What&apos;s Covered vs. What&apos;s Not</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-green-900">Covered Under Warranty</h3>
                    </div>
                    <ul className="text-green-800 space-y-2">
                      <li>• Manufacturing defects</li>
                      <li>• Material failures under normal use</li>
                      <li>• Workmanship issues</li>
                      <li>• Premature component failure</li>
                      <li>• Structural defects</li>
                      <li>• Electronic component failures</li>
                      <li>• Finish deterioration (premature)</li>
                      <li>• Motor/mechanical failures</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-red-900">Not Covered</h3>
                    </div>
                    <ul className="text-red-800 space-y-2">
                      <li>• Normal wear and tear</li>
                      <li>• Accidental damage</li>
                      <li>• Misuse or abuse</li>
                      <li>• Damage from modifications</li>
                      <li>• Water damage (non-defect)</li>
                      <li>• Cosmetic damage</li>
                      <li>• Damage from neglect</li>
                      <li>• Acts of nature</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. How to File a Warranty Claim</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Before You Start</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Before filing a warranty claim, please ensure you have:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Original purchase receipt or order confirmation</li>
                    <li>Product model and serial number</li>
                    <li>Clear description of the problem</li>
                    <li>Photos or videos of the issue (if applicable)</li>
                    <li>Product registration (if required)</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Claim Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Contact Customer Service</h4>
                        <p className="text-gray-700">Call our warranty department or submit an online claim form</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Provide Documentation</h4>
                        <p className="text-gray-700">Submit required documents and evidence of the defect</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Claim Review</h4>
                        <p className="text-gray-700">Our team will review your claim and determine eligibility</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Resolution</h4>
                        <p className="text-gray-700">Receive repair, replacement, or refund based on our assessment</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-yellow-900">Important Notes</h4>
                  </div>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• Claims must be filed within the warranty period</li>
                    <li>• Original packaging may be required for returns</li>
                    <li>• Diagnostic fees may apply for non-warranty issues</li>
                    <li>• Shipping costs may be customer responsibility</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Warranty Resolution Options</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">Repair</h3>
                    </div>
                    <p className="text-blue-800 mb-3">For repairable defects, we will:</p>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Fix the issue at no cost</li>
                      <li>• Use genuine parts only</li>
                      <li>• Provide repair warranty</li>
                      <li>• Arrange pickup/delivery</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-green-900">Replace</h3>
                    </div>
                    <p className="text-green-800 mb-3">For unrepairable items, we will:</p>
                    <ul className="text-green-800 space-y-1">
                      <li>• Provide identical replacement</li>
                      <li>• Offer upgraded model if available</li>
                      <li>• Transfer remaining warranty</li>
                      <li>• Arrange product exchange</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-purple-900">Refund</h3>
                    </div>
                    <p className="text-purple-800 mb-3">When repair/replace isn&apos;t possible:</p>
                    <ul className="text-purple-800 space-y-1">
                      <li>• Full purchase price refund</li>
                      <li>• Prorated refund (if applicable)</li>
                      <li>• Store credit option</li>
                      <li>• Original payment method</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Extended Warranty Options</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Protection Plans</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Extend your peace of mind with our optional protection plans:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Standard Extended Warranty</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Doubles manufacturer warranty</li>
                        <li>• Covers manufacturing defects</li>
                        <li>• Free repairs and replacements</li>
                        <li>• 24/7 customer support</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Premium Protection Plan</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Includes accidental damage</li>
                        <li>• Covers normal wear and tear</li>
                        <li>• Priority service scheduling</li>
                        <li>• Loaner equipment available</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Purchasing Extended Warranty</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Extended warranties must be purchased within 30 days of your original purchase. Contact our customer
                    service team to add protection to your existing products or purchase coverage during checkout.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Manufacturer vs. Store Warranty</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Manufacturer Warranty</h3>
                    <p className="text-blue-800 mb-3">Provided directly by the product manufacturer:</p>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Handled by manufacturer</li>
                      <li>• Varies by brand and product</li>
                      <li>• May require direct contact</li>
                      <li>• Specific terms and conditions</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Our Store Warranty</h3>
                    <p className="text-green-800 mb-3">Additional protection we provide:</p>
                    <ul className="text-green-800 space-y-1">
                      <li>• Handled by our team</li>
                      <li>• Consistent across products</li>
                      <li>• Single point of contact</li>
                      <li>• Faster resolution process</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Warranty Registration</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Register Your Product?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Faster warranty claims</li>
                        <li>• Product recall notifications</li>
                        <li>• Exclusive offers and updates</li>
                        <li>• Extended warranty eligibility</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">How to Register</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Visit our website registration page</li>
                        <li>• Call our customer service</li>
                        <li>• Mail in registration card</li>
                        <li>• Register through your account</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Warranty Limitations</h2>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-yellow-900">Important Limitations</h3>
                  </div>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• Warranties are non-transferable</li>
                    <li>• Valid only for original purchaser</li>
                    <li>• Proof of purchase required</li>
                    <li>• Some exclusions may apply</li>
                    <li>• Warranty void if tampered with</li>
                    <li>• Commercial use may void warranty</li>
                  </ul>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Warranty Support</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Need help with warranty claims or have questions about coverage? Our warranty specialists are here to
                  help:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <span>warranty@yourcompany.com</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span>+1 (555) 123-4567 ext. 2</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span>www.yourcompany.com/warranty</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Support Hours</h3>
                    <div className="text-gray-700">
                      <p>Monday - Friday: 8:00 AM - 7:00 PM EST</p>
                      <p>Saturday: 9:00 AM - 5:00 PM EST</p>
                      <p>Sunday: 10:00 AM - 4:00 PM EST</p>
                      <p className="mt-2 text-sm text-gray-600">Extended hours during peak seasons</p>
                    </div>
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
