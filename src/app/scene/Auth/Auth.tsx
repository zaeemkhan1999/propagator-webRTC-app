import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LandingImage from "../../../assets/images/landing/Landing.webp";
import useScreenDetector, { isUserLoggedIn } from "../../utility/misc.helpers";

function Auth() {
  const { isTablet } = useScreenDetector();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/specter/home", { replace: true });
    }
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div style={{
        display: isTablet ? 'none' : 'flex'
      }} className="w-[33%] flex-col items-center justify-center border-r-[1px]">
        <div className="text-[38px] text-center">
          Experience
          <span className="text-red2 font-[600] ml-2">freedom without</span>{" "}
          sacrificing privacy
        </div>
        <img width={500} height={"100%"} src={LandingImage} alt="" />
      </div>
      <div className="flex items-center justify-center w-full md:w-[67%] h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
