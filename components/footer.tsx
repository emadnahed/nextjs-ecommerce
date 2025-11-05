const Footer = () => {
  return (
    // <footer className="bg-white border-t">
    //   <div className="mx-auto py-4 flex flex-col items-center justify-center gap-2">
        
    //     <p className="text-center text-md text-black font-serif">
    //       © 2023{" "}
    //       <a
            
    //         target="_blank"
    //         href="https://github.com/emaadnahed"
    //       >
    //         <Logo />
    //       </a>
    //       , Inc. All rights reserved.
    //     </p>
    //   </div>
    // </footer>
    <footer className="bg-white border-t">
      <div className="mx-auto py-4 px-4 flex items-center justify-center">
        <p className="text-sm text-black font-serif flex items-center gap-1">
          © 2025
          <a
            href="https://github.com/emaadnahed"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:opacity-75 transition mx-1"
          >
            <span className="text-1xl font-light tracking-[0.2em] text-gray-800 uppercase">
              ZEYREY
            </span>
          </a>
          <span>Inc. All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
