import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Foticket',
  description: 'Learn how we collect, use, and protect your personal information at Foticket.',
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">1.1 Personal Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p className="mb-2">When you interact with our website, we collect the following personal information:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Billing and shipping address</li>
                    <li>Payment information (securely processed through trusted third-party payment gateways)</li>
                  </ul>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">1.2 Non-Personal Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>We also collect non-personal information, including:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Pages visited on our website</li>
                    <li>Referring website or search engine</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">We use your information for the following purposes:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-600">
              <li>To process and fulfill orders</li>
              <li>To provide customer support</li>
              <li>To enhance website functionality and user experience</li>
              <li>To send updates, promotional offers, and newsletters (with your consent)</li>
              <li>To comply with legal obligations and protect against fraudulent transactions</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">3. How We Share Your Information</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">We do not sell or rent your personal information to third parties. However, we may share your information with:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><span className="font-medium">Service Providers:</span> Third-party companies that assist with payment processing, shipping, and marketing.</li>
              <li><span className="font-medium">Legal Authorities:</span> When required by law or to protect our rights and property.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">4. Cookies and Tracking Technologies</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">We use cookies to improve your browsing experience. Cookies help us:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Recognize returning customers</li>
              <li>Store your preferences</li>
              <li>Analyze website performance</li>
            </ul>
            <p className="mt-4 text-gray-600">You can disable cookies through your browser settings, but some features of our website may not work properly without them.</p>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">5. Data Security</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">We implement industry-standard measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Secure Socket Layer (SSL) encryption</li>
              <li>Restricted access to sensitive data</li>
              <li>Regular security audits</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><span className="font-medium">Transaction Data</span> (e.g., billing, shipping, and payment records): retained for up to <span className="font-medium">7 years</span> as required by tax, accounting, and legal obligations.</li>
              <li><span className="font-medium">Customer Support Data</span> (e.g., inquiries, complaints): retained for up to <span className="font-medium">3 years</span> after resolution of the request.</li>
              <li><span className="font-medium">Marketing Data</span> (e.g., newsletter subscriptions): retained until you <span className="font-medium">withdraw consent</span> or opt out.</li>
              <li><span className="font-medium">Non-Personal/Analytics Data</span>: may be retained for a longer period in an <span className="font-medium">aggregated or anonymized form</span> that does not identify you.</li>
            </ul>
            <p className="mt-4 text-gray-600">Once the retention period expires, we will securely delete or anonymize your personal data, unless a longer period is required by law.</p>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">7. Your Rights</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Access your data and request a copy</li>
              <li>Update or correct inaccurate information</li>
              <li>Request deletion of your personal data (subject to legal and contractual obligations)</li>
              <li>Opt-out of promotional communications</li>
            </ul>
            <p className="mt-4 text-gray-600">To exercise these rights, please contact us at <a href="mailto:support@foticket.store" className="text-blue-600 hover:underline">support@foticket.store</a></p>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">8. Children's Privacy</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">Our website is not intended for individuals under the age of 13. We do not knowingly collect personal information from children.</p>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">9. Third-Party Links</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.</p>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">10. Changes to this Privacy Policy</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. Please review this policy periodically for any updates.</p>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">11. Contact Us</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">If you have any questions or concerns about our Privacy Policy, please contact us:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">FOTICKET PRIVATE LIMITED</p>
              <p className="text-xs text-gray-500 mb-3">CIN: U62090KA2025PTC211925</p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>Email: <a href="mailto:support@foticket.store" className="text-blue-600 hover:underline">support@foticket.store</a></li>
                <li className="pt-2">
                  <span className="font-medium">Registered Office:</span><br />
                  No. 1383/433, HBR Layout, 1st Stage,<br />
                  Arabic College, Bangalore North,<br />
                  Karnataka, India - 560045
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} FOTICKET PRIVATE LIMITED. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
