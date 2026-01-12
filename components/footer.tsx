import Link from "next/link";
import FooterAboutSection from "./footer/footer-about-section";
import FooterCategoryLinks from "./footer/footer-category-links";
import FooterBrandInfo from "./footer/footer-brand-info";
import FooterDownloadApp from "./footer/footer-download-app";
import FooterBottomBar from "./footer/footer-bottom-bar";

const Footer = () => {
  return (
    <div className="bg-gray-50">
      <footer className="bg-white shadow-lg">
        {/* 1. Collapsible About Section */}
        <FooterAboutSection />

        <div className="container mx-auto px-4 py-12">
          {/* 2. Category Links Grid */}
          <FooterCategoryLinks />

          {/* Divider */}
          <div className="border-t border-gray-200 my-10"></div>

          {/* 3. Brand Info + Quick Links + Legal + Download App */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand Info */}
            <div className="md:col-span-4">
              <FooterBrandInfo />
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { text: "Home", url: "/" },
                  { text: "Shop", url: "/shop" },
                  { text: "About Us", url: "/about-us" }
                ].map((item, index) => (
                  <li key={index}>
                    <Link href={item.url} className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="md:col-span-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                {[
                  { text: "Terms & Conditions", url: "/terms-conditions" },
                  { text: "Privacy Policy", url: "/privacy-policy" },
                  { text: "Refund Policy", url: "/refund-policy" },
                  { text: "Shipping Policy", url: "/shipping-policy" },
                  { text: "Cancellation Policy", url: "/cancellation-policy" }
                ].map((item, index) => (
                  <li key={index}>
                    <Link href={item.url} className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download App Section */}
            <div className="md:col-span-3">
              <FooterDownloadApp />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-10"></div>

          {/* 4. Bottom Bar */}
          <FooterBottomBar />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
