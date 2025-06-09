import React from "react";

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, className = "" }) => {
  return (
    <p className={`break-words text-black1 leading-normal text-base font-normal ${className}`}>
      {children}
    </p>
  );
};

export default Paragraph;