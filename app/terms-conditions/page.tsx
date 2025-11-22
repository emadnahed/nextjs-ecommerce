import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions - ZEYREY',
  description: 'Read the terms and conditions for using ZEYREY TECHNOLOGY PRIVATE LIMITED services.',
};

const TermsConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-gray-700 mb-6">
              Welcome to ZEYREY TECHNOLOGY PRIVATE LIMITED! By accessing and using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
            </p>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">1. General Information</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>ZEYREY TECHNOLOGY PRIVATE LIMITED is an online clothing retail store that provides a variety of clothing items for purchase.</li>
                <li>These terms and conditions govern your use of the website and the purchase of products through the website. By using our website or purchasing products, you agree to these terms.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">2. Account and Registration</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>To access certain services and make purchases, you may be required to create an account.</li>
                <li>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
                <li>By creating an account, you agree to provide accurate and current information.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">3. Product Information</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>We strive to provide accurate and detailed product descriptions, including images, sizes, and pricing. However, there may be slight variations in the actual product due to screen resolution or other factors.</li>
                <li>Prices for products may change from time to time and are subject to availability.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">4. Order Placement and Payment</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>By placing an order through our website, you are making an offer to purchase products subject to availability and acceptance.</li>
                <li>Payment for orders is processed securely through our payment gateways, such as Razorpay, and must be completed before shipping.</li>
                <li>All payments must be in the currency accepted by the website.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">5. Shipping and Delivery</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>We will ship orders to the address provided at checkout. Shipping costs will be added during checkout and may vary based on the delivery location.</li>
                <li>Delivery times are estimates and may vary depending on factors such as location and shipping method.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">6. Refunds and Returns</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>We offer a 7-day return and refund policy. If you are not satisfied with your purchase, you can request a refund or exchange within 7 days of receiving the product.</li>
                <li>Products must be unused, in original packaging, and in the same condition as when they were received to be eligible for a refund.</li>
                <li>Shipping fees for returns and exchanges are the responsibility of the customer unless the product is defective or incorrect.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">7. Intellectual Property</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>All content on the website, including text, images, logos, and graphics, is the intellectual property of ZEYREY TECHNOLOGY PRIVATE LIMITED and is protected by copyright laws.</li>
                <li>You may not use, reproduce, or distribute any of this content without prior written consent from us.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">8. Privacy Policy</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>By using our website, you consent to the collection and use of your personal information as outlined in our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</li>
                <li>We will not share your personal information with third parties except as necessary to complete transactions or as required by law.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">9. Limitation of Liability</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>ZEYREY TECHNOLOGY PRIVATE LIMITED is not liable for any damages, losses, or expenses arising from the use of the website or the purchase of products.</li>
                <li>We are not responsible for any third-party websites or content linked to or from our website.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">10. Changes to Terms and Conditions</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>We reserve the right to update, modify, or change these terms and conditions at any time. Any changes will be posted on this page with an updated effective date.</li>
                <li>It is your responsibility to review these terms periodically for any updates.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">11. Governing Law</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-700">
                These terms and conditions are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </div>
          </section>

          <section className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-700 mb-4">
                For any questions or concerns regarding these terms and conditions, please contact us at:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>Email: <a href="mailto:support@zeyrey.net" className="text-blue-600 hover:underline">support@zeyrey.net</a></li>
                <li>Phone: <a href="tel:+919150913329" className="text-blue-600 hover:underline">+91 9150913329</a></li>
                <li>Company: ZEYREY TECHNOLOGY PRIVATE LIMITED</li>
              </ul>
              <p className="mt-6 text-lg font-medium text-center text-gray-900">
                By using ZEYREY TECHNOLOGY PRIVATE LIMITED's services, you agree to these terms and conditions.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ZEYREY. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
