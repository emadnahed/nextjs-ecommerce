import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const FooterBrandInfo = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">ZEYREY</h3>
      <p className="text-gray-600 mb-4">
        Your premier destination for quality products and exceptional service.
      </p>
      <div className="space-y-3 mb-6 text-gray-600">
        <div className="flex items-start">
          <FaEnvelope className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <a href="mailto:support@zeyrey.net" className="hover:text-blue-600 transition-colors">
            support@zeyrey.net
          </a>
        </div>
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <address className="not-italic">
            No 40, Taylors Road, Kilpauk,<br />
            Chennai, Tamil Nadu, India - 600010
          </address>
        </div>
      </div>
      <div className="flex space-x-4">
        {[
          { icon: FaFacebook, url: "https://www.facebook.com/Zeyrey123", color: "hover:text-blue-600" },
          { icon: FaInstagram, url: "https://www.instagram.com/zeyrey.1", color: "hover:text-pink-600" },
          { icon: FaTiktok, url: "https://www.tiktok.com/@zeyrey.1", color: "hover:text-black" },
          { icon: FaTwitter, url: "https://x.com/zeyrey123", color: "hover:text-blue-400" }
        ].map((social, index) => (
          <a
            key={index}
            href={social.url}
            className={`text-gray-500 text-xl transition-colors ${social.color}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.icon.name}
          >
            <social.icon />
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterBrandInfo;
