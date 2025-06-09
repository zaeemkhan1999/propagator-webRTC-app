import Heading from "../../../../components/Typography/Heading";
import SubmitBtn from "../../../../components/Buttons";
import Title from "../../../../components/Typography/Title";
import {
  IconBrandInstagram,
  IconBrandTwitterFilled,
  IconBrandFacebookFilled,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const socials = [
  {
    id: 1,
    icon: <IconBrandInstagram size={28} />,
  },
  {
    id: 2,
    icon: <IconBrandTwitterFilled size={28} />,
  },
  {
    id: 3,
    icon: <IconBrandFacebookFilled size={28} />,
  },
  {
    id: 4,
    icon: <IconBrandYoutubeFilled size={28} />,
  },
];

function Footer() {
  return (
    <div>
      <div className="overflow-hidden h-[350px] md:h-[512px] bg-themeLightPink flex items-center mt-8">
        <div className="text-center flex items-center justify-center flex-col gap-10 px-6 md:px-0">
          <Heading className="text-white text-[24px] md:text-[50px] font-extralight md:font-light md:w-1/2">
            A versatile platform that empowers users to speak freely in the
            virtual world.
          </Heading>
          <SubmitBtn
            handlclick={() => { }}
            style={{
              width: "168px",
              height: "54px",
              background: "#ffffff",
              color: "rgb(116, 116, 116)",
              border: "none",
            }}
            cta="Join Us"
            color="info"
            varient="contained"
          />
        </div>
      </div>
      <div className="w-full px-6 md:px-[130px] bg-gray-100 h-[300px] flex flex-col md:flex-row md:items-center justify-center md:justify-between">
        <div>
          <Heading className="text-[26px] font-extralight md:font-light">
            Specter
          </Heading>
          <Title
            onclick={() => (window.location.href = "mailto:specterapp.admin@proton.me")}
            className="cursor-pointer text-[16px] font-extralight md:font-light mt-4"
          >
            Contact Us
          </Title>
        </div>
        <div>
          <Title className="cursor-pointer text-[16px] font-extralight md:font-light mt-4">
            <Link to='/specter/privacy-policy'>
              Privacy Policy
            </Link>
          </Title>
          <Title className="cursor-pointer text-[16px] font-extralight md:font-light mt-4 md:mt-0">
            <Link to='/specter/terms-and-conditions' >
              Terms & Condition
            </Link>
          </Title>
        </div>
        <div className="flex items-center gap-4 mt-6">
          {socials.map((el) => {
            return <SocialsContainer key={el.id} icon={el.icon} />;
          })}
        </div>
      </div>
    </div>
  );
};

const SocialsContainer = ({ icon }: { icon: any }) => {
  return (
    <div className="h-[50px] cursor-pointer bg-white w-[50px] rounded-full flex items-center justify-center">
      {icon}
    </div>
  );
};

export default Footer;
