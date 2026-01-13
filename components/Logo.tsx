import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition flex items-center gap-2">
        <span className="text-xl font-bold text-white">
          Foticket
        </span>
        <span className="text-yellow-400 text-3xl leading-none">
          *
        </span>
      </div>
    </Link>
  );
};

export default Logo;
