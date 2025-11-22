import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy - ZEYREY',
  description: 'Learn about our order cancellation policies at ZEYREY TECHNOLOGY PRIVATE LIMITED.',
};

const CancellationPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Cancellation Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Cancellation by the Customer</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                Customers may cancel their orders within <span className="font-medium">24 hours</span> of placing the order by contacting our customer support team.
              </li>
              <li>
                After 24 hours, orders cannot be canceled as they will already be processed for shipping.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Cancellation by ZEYREY TECHNOLOGY PRIVATE LIMITED</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">
              We reserve the right to cancel an order under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>The product is out of stock.</li>
              <li>Payment is not received or fails verification.</li>
              <li>Any discrepancies or fraudulent activity are detected in the order.</li>
            </ul>
            <p className="mt-4 text-gray-700">
              In such cases, customers will be notified promptly, and a full refund will be issued within <span className="font-medium">7 working days</span>.
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Need Assistance?</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">
              For any questions or assistance regarding order cancellations, please contact our support team:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Email: <a href="mailto:support@zeyrey.net" className="text-blue-600 hover:underline">support@zeyrey.net</a></li>
              <li>Phone: <a href="tel:+919150913329" className="text-blue-600 hover:underline">+91 9150913329</a></li>
            </ul>
            <p className="mt-6 text-lg font-medium text-center text-gray-900">
              Thank you for choosing <span className="text-blue-600">ZEYREY TECHNOLOGY PRIVATE LIMITED</span>!
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ZEYREY. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
