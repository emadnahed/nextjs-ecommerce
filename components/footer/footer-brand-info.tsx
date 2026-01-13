import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

const FooterBrandInfo = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Foticket</h3>
      <p className="text-xs text-gray-500 mb-4">FOTICKET PRIVATE LIMITED</p>
      <p className="text-gray-600 mb-4">
        Your premier destination for quality products and exceptional service.
      </p>
      <div className="space-y-3 mb-6 text-gray-600">
        <div className="flex items-start">
          <FaBuilding className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <span className="text-xs">CIN: U62090KA2025PTC211925</span>
        </div>
        <div className="flex items-start">
          <FaEnvelope className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <a href="mailto:support@foticket.store" className="hover:text-blue-600 transition-colors">
            support@foticket.store
          </a>
        </div>
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <address className="not-italic text-sm">
            No. 1383/433, HBR Layout, 1st Stage,<br />
            Arabic College, Bangalore North,<br />
            Karnataka, India - 560045
          </address>
        </div>
      </div>
      <div className="flex space-x-4">
        {[
          { icon: FaFacebook, url: "#", color: "hover:text-blue-600" },
          { icon: FaInstagram, url: "#", color: "hover:text-pink-600" },
          { icon: FaTiktok, url: "#", color: "hover:text-black" },
          { icon: FaTwitter, url: "#", color: "hover:text-blue-400" }
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
