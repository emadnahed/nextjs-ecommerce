import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - ZEYREY',
  description: 'Learn about our refund policy and process at ZEYREY TECHNOLOGY PRIVATE LIMITED.',
};

const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Refund Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Eligibility for Refund</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Refunds will only be issued for returns initiated within <span className="font-medium">7 days</span> of receiving the product.</li>
              <li>The item must be in its original condition, unused, and with all tags and packaging intact.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Non-Refundable Items</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Items marked as final sale or non-returnable are not eligible for refunds.</li>
              <li>Customized or personalized products are non-refundable.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Refund Process</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ol className="list-decimal pl-5 space-y-3 text-gray-700">
              <li>To request a refund, customers must contact our support team at <a href="mailto:support@zeyrey.net" className="text-blue-600 hover:underline">support@zeyrey.net</a> with their order details and the reason for the refund.</li>
              <li>Once the return is approved, the product must be shipped back to our warehouse at the customer's expense.</li>
            </ol>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Refund Timeframe</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Refunds will be processed within <span className="font-medium">6 working days</span> after the returned product is received and inspected.</li>
              <li>The refund amount will be credited to the original payment method used during the purchase within <span className="font-medium">7 working days</span>.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Additional Notes</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>ZEYREY TECHNOLOGY PRIVATE LIMITED reserves the right to refuse refunds for items that do not meet the above conditions.</li>
              <li>Shipping fees are non-refundable unless the product is damaged or incorrect.</li>
              <li>For any questions or assistance regarding cancellations or refunds, please contact our support team at <a href="mailto:support@zeyrey.net" className="text-blue-600 hover:underline">support@zeyrey.net</a> or call us at <a href="tel:+919150913329" className="text-blue-600 hover:underline">+91 9150913329</a></li>
            </ul>
            <p className="mt-6 text-lg font-medium text-center text-gray-900">Thank you for shopping with ZEYREY TECHNOLOGY PRIVATE LIMITED!</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ZEYREY. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
