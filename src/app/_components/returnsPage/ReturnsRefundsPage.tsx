/* eslint-disable react/no-unescaped-entities */
'use client';

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bungee font-bold text-gray-900 mb-2">Returns & Refunds</h1>
            <p className="text-gray-600">Last updated: September 9, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="prose prose-gray max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Our Return Policy</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  At Cherries B.V., we want you to be completely satisfied with your purchase. If you're not happy with
                  your order, we&apos;re here to help. Please read our return and refund policy carefully to understand
                  the process.
                </p>
              </section>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Return Eligibility</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 Time Limit</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You have <strong>14 calendar days</strong> from the date of delivery to return items for a refund or
                    exchange, in accordance with EU consumer protection laws. Returns initiated after this period will
                    not be accepted unless the item is defective.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 Item Condition</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">To be eligible for a return, items must be:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Unused and in the same condition as received</li>
                    <li>In original packaging with all tags attached</li>
                    <li>Include all accessories, manuals, and documentation</li>
                    <li>Free from damage not caused by defects</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.3 Returnable Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold text-green-900">Returnable</h4>
                      </div>
                      <ul className="text-green-800 space-y-1">
                        <li>• Fashion items and accessories</li>
                        <li>• Electronics (in original packaging)</li>
                        <li>• Home and lifestyle products</li>
                        <li>• Books and media</li>
                        <li>• General merchandise</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold text-red-900">Non-Returnable</h4>
                      </div>
                      <ul className="text-red-800 space-y-1">
                        <li>• Perishable items</li>
                        <li>• Personal care and hygiene items</li>
                        <li>• Intimate apparel and underwear</li>
                        <li>• Custom/personalized items</li>
                        <li>• Digital products and gift cards</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. How to Return Items</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Start Your Return</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">To initiate a return, you can:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Log into your account on www.cherriesofficial.com and go to "Order History"</li>
                    <li>Click "Return Items" next to the relevant order</li>
                    <li>Or contact our customer service team at info@cherriesofficial.com</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Return Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Request Return Authorization</h4>
                        <p className="text-gray-700">
                          Submit your return request and receive a Return Authorization (RA) number
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Package Your Items</h4>
                        <p className="text-gray-700">Securely pack items in original packaging with all accessories</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Ship Your Return</h4>
                        <p className="text-gray-700">
                          Ship to our Rotterdam address using the return instructions provided
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Receive Your Refund</h4>
                        <p className="text-gray-700">
                          Once we receive and process your return, your refund will be issued
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Return Shipping</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-yellow-900">Important Shipping Information</h4>
                    </div>
                    <ul className="text-yellow-800 space-y-1">
                      <li>• Free return shipping for defective or incorrect items within the Netherlands</li>
                      <li>• Customer pays return shipping for other returns</li>
                      <li>• EU customers: Return shipping costs may be reimbursed for defective items</li>
                      <li>• We recommend using a trackable shipping method</li>
                      <li>• Original shipping costs are non-refundable unless item was defective</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Refunds</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Processing Time</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Once we receive your returned item, we will inspect it and process your refund within{' '}
                    <strong>14 business days</strong> as required by EU law. You will receive an email confirmation once
                    your refund has been processed.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Refund Method</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Refunds will be issued to your original payment method:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>
                      <strong>Credit/Debit Cards:</strong> 3-7 business days
                    </li>
                    <li>
                      <strong>PayPal:</strong> 2-5 business days
                    </li>
                    <li>
                      <strong>iDEAL (Netherlands):</strong> 1-3 business days
                    </li>
                    <li>
                      <strong>SEPA Bank Transfer:</strong> 3-5 business days
                    </li>
                    <li>
                      <strong>Store Credit:</strong> Immediate
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Partial Refunds</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In some cases, partial refunds may be granted for:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Items with signs of use beyond normal inspection</li>
                    <li>Items missing parts or accessories</li>
                    <li>Items with minor damage not caused by defects</li>
                    <li>Items returned after the 14-day period (at our discretion)</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Exchanges</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Size & Color Exchanges</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We offer exchanges for size or color changes within the same product line, subject to availability.
                    The exchange process follows the same timeline as returns.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Defective Item Exchanges</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you receive a defective item, we will provide a free exchange or full refund, including return
                    shipping costs. Please contact us immediately upon discovering the defect.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Special Circumstances</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Damaged in Transit</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If your item arrives damaged due to shipping, please contact us within 48 hours of delivery with
                    photos of the damage. We will arrange for a replacement or full refund at no cost to you.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Wrong Item Received</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you receive the wrong item, please contact us immediately. We will arrange for the correct item
                    to be sent and provide a prepaid return label for the incorrect item.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Late Delivery</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If your order arrives significantly later than the estimated delivery date, you may be eligible for
                    a partial refund or store credit as compensation.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. EU Consumer Rights</h2>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Your Rights as an EU Consumer</h3>
                  <p className="text-blue-800 mb-2">As a consumer in the European Union, you have the right to:</p>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Cancel your order within 14 days without giving a reason</li>
                    <li>• Receive a full refund within 14 days of us receiving the returned item</li>
                    <li>• Return defective items for up to 2 years after purchase</li>
                    <li>• Receive clear information about your consumer rights</li>
                  </ul>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. International Returns (Non-EU)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  For orders outside the European Union, please note:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Customers are responsible for return shipping costs</li>
                  <li>Items must be returned within 14 days of delivery</li>
                  <li>Customs duties and taxes are non-refundable</li>
                  <li>We recommend using a trackable shipping method</li>
                  <li>Additional processing time may apply for international returns</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Holiday Returns</h2>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Extended Holiday Return Period</h3>
                  <p className="text-green-800">
                    Items purchased between November 1st and December 31st may be returned until January 31st of the
                    following year, giving you extra time for holiday gift returns.
                  </p>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help with Your Return?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our customer service team is here to help you with any questions about returns, exchanges, or refunds.
                  Please don't hesitate to reach out:
                </p>

                <div className="space-y-3">
                  <div className="text-gray-700">
                    <strong>Cherries B.V.</strong>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span>Email: info@cherriesofficial.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span>Website: www.cherriesofficial.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span>Address: Kiotoweg 351, 3047 BG Rotterdam, The Netherlands</span>
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
