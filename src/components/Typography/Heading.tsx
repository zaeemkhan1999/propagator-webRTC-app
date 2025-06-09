import React from "react";

function Heading({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`text-black1 leading-normal font-semibold ${className}`}>
      {children}
    </div>
  );
}

export default Heading;
