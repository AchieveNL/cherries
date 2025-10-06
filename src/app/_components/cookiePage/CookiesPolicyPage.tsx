/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import { Button } from '../ui';

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}

        {/* Content */}
        <div className="overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="prose prose-gray max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">About Cookies</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  This Cookies Policy explains how [Your Company Name] uses cookies and similar technologies on our
                  website. We believe in being transparent about how we collect and use data, and this policy provides
                  detailed information about our use of cookies.
                </p>
              </section>

              {/* Quick Reference */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cookie Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-blue-900">Essential</h3>
                    </div>
                    <p className="text-blue-800">Required for basic functionality</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-green-900">Analytics</h3>
                    </div>
                    <p className="text-green-800">Help us improve our website</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-purple-900">Functional</h3>
                    </div>
                    <p className="text-purple-800">Remember your preferences</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-orange-900">Marketing</h3>
                    </div>
                    <p className="text-orange-800">Personalized advertisements</p>
                  </div>
                </div>
              </section>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 Definition</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cookies are small text files that are stored on your computer or mobile device when you visit a
                    website. They are widely used to make websites work more efficiently and to provide information to
                    website owners about how their site is being used.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 How Cookies Work</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you visit our website, we may place cookies on your device that contain information such as:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Your preferences and settings</li>
                    <li>Items in your shopping cart</li>
                    <li>Whether you&apos;re logged in</li>
                    <li>Your browsing behavior on our site</li>
                    <li>Technical information about your device</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1.3 First-Party vs. Third-Party Cookies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">First-Party Cookies</h4>
                      <p className="text-blue-800">Set directly by our website and only readable by us</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">Third-Party Cookies</h4>
                      <p className="text-orange-800">
                        Set by external services like analytics or advertising platforms
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>

                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">Essential Cookies</h3>
                    </div>
                    <p className="text-blue-800 mb-3">
                      These cookies are necessary for the website to function properly and cannot be disabled.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">What they do:</h4>
                        <ul className="text-blue-800 space-y-1">
                          <li>• Enable basic website functionality</li>
                          <li>• Maintain your shopping cart</li>
                          <li>• Keep you logged in</li>
                          <li>• Provide security features</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Examples:</h4>
                        <ul className="text-blue-800 space-y-1">
                          <li>• Session cookies</li>
                          <li>• Authentication tokens</li>
                          <li>• Shopping cart contents</li>
                          <li>• Load balancing cookies</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-green-900">Analytics Cookies</h3>
                    </div>
                    <p className="text-green-800 mb-3">
                      These cookies help us understand how visitors use our website so we can improve it.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">What they do:</h4>
                        <ul className="text-green-800 space-y-1">
                          <li>• Track page views and visits</li>
                          <li>• Measure website performance</li>
                          <li>• Identify popular content</li>
                          <li>• Analyze user behavior</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Services used:</h4>
                        <ul className="text-green-800 space-y-1">
                          <li>• Google Analytics</li>
                          <li>• Adobe Analytics</li>
                          <li>• Hotjar</li>
                          <li>• Custom analytics tools</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-purple-900">Functional Cookies</h3>
                    </div>
                    <p className="text-purple-800 mb-3">
                      These cookies enable enhanced functionality and personalization.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">What they do:</h4>
                        <ul className="text-purple-800 space-y-1">
                          <li>• Remember your preferences</li>
                          <li>• Store language settings</li>
                          <li>• Personalize content</li>
                          <li>• Enable social media features</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">Examples:</h4>
                        <ul className="text-purple-800 space-y-1">
                          <li>• Language preferences</li>
                          <li>• Region/location settings</li>
                          <li>• Theme preferences</li>
                          <li>• Recently viewed items</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-orange-900">Marketing Cookies</h3>
                    </div>
                    <p className="text-orange-800 mb-3">
                      These cookies are used to deliver personalized advertisements and marketing messages.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">What they do:</h4>
                        <ul className="text-orange-800 space-y-1">
                          <li>• Track advertising effectiveness</li>
                          <li>• Deliver targeted ads</li>
                          <li>• Prevent ad repetition</li>
                          <li>• Measure campaign performance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">Platforms:</h4>
                        <ul className="text-orange-800 space-y-1">
                          <li>• Google Ads</li>
                          <li>• Facebook Pixel</li>
                          <li>• LinkedIn Ads</li>
                          <li>• Retargeting platforms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Cookie Duration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">Session Cookies</h3>
                    </div>
                    <p className="text-blue-800 mb-3">Temporary cookies that expire when you close your browser:</p>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Shopping cart contents</li>
                      <li>• Login sessions</li>
                      <li>• Form data</li>
                      <li>• Navigation preferences</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-green-900">Persistent Cookies</h3>
                    </div>
                    <p className="text-green-800 mb-3">Stored on your device for a set period:</p>
                    <ul className="text-green-800 space-y-1">
                      <li>• User preferences (up to 1 year)</li>
                      <li>• Analytics data (up to 2 years)</li>
                      <li>• Marketing cookies (up to 30 days)</li>
                      <li>• Remember me settings (up to 90 days)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Managing Your Cookie Preferences</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Cookie Consent</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you first visit our website, you&apos;ll see a cookie consent banner where you can:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Accept all cookies</li>
                    <li>Reject non-essential cookies</li>
                    <li>Customize your preferences</li>
                    <li>Learn more about each cookie type</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Browser Settings</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You can control cookies through your browser settings:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                      <p className="text-gray-700 text-sm">
                        Settings → Privacy and security → Cookies and other site data
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                      <p className="text-gray-700 text-sm">Options → Privacy & Security → Cookies and Site Data</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                      <p className="text-gray-700 text-sm">Preferences → Privacy → Cookies and website data</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                      <p className="text-gray-700 text-sm">Settings → Cookies and site permissions → Cookies</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Opt-Out Options</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">For specific services, you can opt out directly:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>
                      Google Analytics:{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        https://tools.google.com/dlpage/gaoptout
                      </a>
                    </li>
                    <li>
                      Facebook Pixel:{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        https://www.facebook.com/settings
                      </a>
                    </li>
                    <li>
                      Network Advertising Initiative:{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        https://www.networkadvertising.org/choices/
                      </a>
                    </li>
                    <li>
                      Digital Advertising Alliance:{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        https://www.aboutads.info/choices/
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-yellow-900">Important Note</h4>
                  </div>
                  <p className="text-yellow-800">
                    Disabling cookies may affect your experience on our website. Some features may not work properly
                    without cookies enabled.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Third-Party Cookies</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Services We Use</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use third-party services that may set cookies on your device:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Analytics Services</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Google Analytics - Website traffic analysis</li>
                        <li>• Hotjar - User behavior tracking</li>
                        <li>• Adobe Analytics - Performance measurement</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Marketing Platforms</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Google Ads - Advertising and remarketing</li>
                        <li>• Facebook Pixel - Social media advertising</li>
                        <li>• LinkedIn Ads - Professional network advertising</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Support Services</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Live chat widgets</li>
                        <li>• Customer support tools</li>
                        <li>• Feedback collection systems</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Social Media Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you interact with social media features on our site, these platforms may set cookies:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Social media sharing buttons</li>
                    <li>Embedded social media content</li>
                    <li>Social login features</li>
                    <li>Like and share functionality</li>
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-green-900">Your Rights Include</h3>
                    </div>
                    <ul className="text-green-800 space-y-2">
                      <li>• Right to be informed about cookies</li>
                      <li>• Right to accept or decline cookies</li>
                      <li>• Right to withdraw consent</li>
                      <li>• Right to access cookie data</li>
                      <li>• Right to delete cookies</li>
                      <li>• Right to opt-out of tracking</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">How to Exercise Rights</h3>
                    </div>
                    <ul className="text-blue-800 space-y-2">
                      <li>• Use our cookie preference center</li>
                      <li>• Adjust browser settings</li>
                      <li>• Contact our privacy team</li>
                      <li>• Use opt-out tools</li>
                      <li>• Clear browser data</li>
                      <li>• Update consent preferences</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Cookies Policy from time to time to reflect changes in our practices or for other
                  operational, legal, or regulatory reasons. When we make changes, we will:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Update the &quot;Last Updated&quot; date at the top of this policy</li>
                  <li>Notify you through our website or email if changes are significant</li>
                  <li>Request new consent if required by law</li>
                  <li>Provide information about what has changed</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Cookie Preference Center</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Manage Your Preferences</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You can update your cookie preferences at any time by visiting our Cookie Preference Center. Here
                    you can:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Available Options</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Enable/disable cookie categories</li>
                        <li>• View detailed cookie information</li>
                        <li>• See which cookies are active</li>
                        <li>• Update consent preferences</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">How to Access</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Click &quot;Cookie Settings&quot; in our footer</li>
                        <li>• Visit our Privacy Center</li>
                        <li>• Use the cookie banner when it appears</li>
                        <li>• Contact our support team</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Button>Open Cookie Preference Center</Button>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about our use of cookies or this Cookies Policy, please contact us:
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
                    <span>www.yourcompany.com/privacy</span>
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
