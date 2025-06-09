import Logo from "../../../../assets/images/logo.png";
import SubmitBtn from "../../../../components/Buttons";
import { useNavigate } from "react-router-dom";

function LandingHeader() {
  const navigate = useNavigate();
  return (
    <div
      className="w-full h-[88px] flex border-b-[1px] border-solid border-[#F5F5F5]
    md:px-[138px] py-[18px] items-center gap-2 justify-evenly md:justify-between"
    >
      <img
        src={Logo}
        title="Specter"
        height={48}
        width={48}
        alt="Specter"
      />

      <div className="flex items-center gap-2">
        <SubmitBtn
          needBorder
          classname="md:w-[168px] w-[120px]"
          style={{
            height: "54px",
          }}
          handlclick={() => navigate("/auth/signin")}
          cta="Sign in"
          varient="outlined"
          color="inherit"
          hoverColor="#ffffff"
        />
        <SubmitBtn
          needBorder
          size="large"
          classname="md:w-[168px] w-[120px]"
          style={{
            height: "54px",
          }}
          handlclick={() => navigate("/auth/signup")}
          cta="Sign up"
          varient="outlined"
          color="inherit"
          hoverColor="#ffffff"
        />
      </div>
    </div>
  );
}

export default LandingHeader;
