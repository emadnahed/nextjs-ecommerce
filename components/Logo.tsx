import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition flex items-center">
        <span className="text-1xl font-light tracking-[0.2em] text-gray-800 uppercase">
          ZEYREY
        </span>
      </div>
    </Link>
  );
};

export default Logo;
