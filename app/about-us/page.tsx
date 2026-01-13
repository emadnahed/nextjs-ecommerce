import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Foticket',
  description: 'Learn more about Foticket Private Limited - Your trusted online retailer for quality products.',
}

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>

      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Foticket Private Limited is a duly registered private limited company incorporated in India (CIN: U62090KA2025PTC211925). The company operates as an e-commerce retailer, specializing in the sale of quality products through its digital platform www.foticket.store.
        </p>

        <p className="text-lg mb-6">
          Our primary business category focuses on online retail. We are committed to offering customers a secure, transparent, and efficient shopping experience, supported by reliable payment systems, timely delivery, and responsive customer service.
        </p>

        <p className="text-lg mb-6">
          Foticket Private Limited adheres to all applicable statutory and regulatory requirements, ensuring compliance, transparency, and integrity in its operations. The company's vision is to grow as a trusted online marketplace, continuously enhancing its collections to meet the diverse needs of customers both in India and internationally.
        </p>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Registered Office</h2>
          <p className="text-gray-700">
            <strong>FOTICKET PRIVATE LIMITED</strong><br />
            CIN: U62090KA2025PTC211925<br /><br />
            No. 1383/433, HBR Layout, 1st Stage,<br />
            Arabic College, Bangalore North,<br />
            Karnataka, India - 560045
          </p>
        </div>
      </div>
    </div>
  );
}
