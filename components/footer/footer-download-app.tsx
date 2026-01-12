import { FaApple, FaGooglePlay } from "react-icons/fa";
import { COMMUNITY_CONTENT, APP_DOWNLOAD_CONTENT } from "./footer-data";

const FooterDownloadApp = () => {
  return (
    <div className="space-y-6">
      {/* Join the Community Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          {COMMUNITY_CONTENT.title}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {COMMUNITY_CONTENT.description}
        </p>
      </div>

      {/* Download App Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {APP_DOWNLOAD_CONTENT.title}
        </h4>
        <h5 className="text-base font-medium text-gray-800 mb-2">
          {APP_DOWNLOAD_CONTENT.subtitle}
        </h5>
        <p className="text-sm text-gray-600 mb-4">
          {APP_DOWNLOAD_CONTENT.description}
        </p>

        {/* App Store Badges */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaApple className="text-2xl" />
            <div className="text-left">
              <div className="text-xs">Download on the</div>
              <div className="text-sm font-semibold">App Store</div>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaGooglePlay className="text-xl" />
            <div className="text-left">
              <div className="text-xs">GET IT ON</div>
              <div className="text-sm font-semibold">Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterDownloadApp;
