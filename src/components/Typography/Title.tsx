import { type ReactNode } from "react";

function Title({
  children,
  className,
  onclick
}: {
  children: ReactNode;
  className?: string;
  onclick?: () => void
}) {
  return (
    <div
      onClick={() => onclick?.()}
      className={`text-black1 leading-normal md:text-[23px] w-full ${className}`}
    >
      {children}
    </div>
  );
}

export default Title;
