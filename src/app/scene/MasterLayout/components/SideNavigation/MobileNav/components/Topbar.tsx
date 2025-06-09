import { IconBrandTelegram, IconMenu3 } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";
import useScreenDetector from "@/app/utility/misc.helpers";

interface Props {
  setShowMobileNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ setShowMobileNav }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDesktop } = useScreenDetector()

  return (
    (location.pathname.includes("/specter/home") && !isDesktop) &&
    <>
      <div onClick={() => setShowMobileNav(true)} className="cursor-pointer shadow-light-black text-white fixed top-0 left-0 z-50 py-2 p-4">
        <IconMenu3 />
      </div>
      <div onClick={() => navigate('/specter/inbox')} className="cursor-pointer shadow-light-black text-white  fixed top-0 right-0 z-50 py-2 p-4">
        <IconBrandTelegram size={24} />
      </div>
    </>
  );
}

export default Topbar;
