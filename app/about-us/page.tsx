import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Zeyrey',
  description: 'Learn more about Zeyrey Technology Private Limited - Your trusted online clothing retailer for men and women.',
}

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Zeyrey Technology Private Limited is a duly registered private limited company incorporated in India. The company operates as an e-commerce clothing retailer, specializing in the sale of men's and women's apparel through its digital platform www.zeyrey.net.
        </p>
        
        <p className="text-lg mb-6">
          Our primary business category focuses on online retail of clothing. We are committed to offering customers a secure, transparent, and efficient shopping experience, supported by reliable payment systems, timely delivery, and responsive customer service.
        </p>
        
        <p className="text-lg">
          Zeyrey Technology Private Limited adheres to all applicable statutory and regulatory requirements, ensuring compliance, transparency, and integrity in its operations. The company's vision is to grow as a trusted online clothing marketplace, continuously enhancing its collections to meet the diverse fashion needs of customers both in India and internationally.
        </p>
      </div>
    </div>
  );
}
