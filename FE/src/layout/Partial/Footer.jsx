import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0c356a] text-white py-4 mt-8">
      <div className="max-w-screen-xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} SMK Negeri 1 Contoh. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
