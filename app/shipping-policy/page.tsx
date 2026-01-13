import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy - Foticket',
  description: 'Learn about our shipping policies and delivery information at FOTICKET PRIVATE LIMITED.',
};

const ShippingPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Free Delivery</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">
              Enjoy <span className="font-medium text-blue-600">free delivery</span> on your first order with us!
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Processing Time</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">
              All orders are processed within <span className="font-medium">1–2 business days</span>.
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Delivery Time</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">
              Your items will be delivered within <span className="font-medium">5–7 business working days</span>.
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Shipping Partners</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">
              We partner with trusted carriers to ensure the safe and timely delivery of your orders.
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Tracking</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700">
              Once your order has shipped, you will receive a tracking number to monitor your shipment every step of the way.
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">
              If you have any questions or encounter any issues, feel free to contact our support team:
            </p>
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
            <p className="mt-6 text-lg font-medium text-center text-gray-900">
              Thank you for choosing <span className="text-blue-600">FOTICKET PRIVATE LIMITED</span>! We look forward to serving you.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} FOTICKET PRIVATE LIMITED. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
