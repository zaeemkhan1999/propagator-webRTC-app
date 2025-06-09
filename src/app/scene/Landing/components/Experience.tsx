import Paragraph from "../../../../components/Typography/Paragraph";
// import Google from '../../../../assets/images/Google.png'
// import Apple from '../../../../assets/images/landing/appstore.png'
import LandingImage from '../../../../assets/images/landing/Landing.webp'

function Experience() {
  return (
    <div className="w-full md:px-[138px] px-8 flex flex-col md:flex-row justify-between gap-28">
      <div className="md:w-1/2">
        <div className="text-[38px]">
          Experience
          <span className="text-red2 font-[600]"> freedom without </span>
          sacrificing privacy
        </div>
        <p className="opacity-60 mt-1 break-words text-black1 leading-normal text-base font-normal">
          Specter is a new social media platform that will revolutionize the
          way we connect and interact online. With a passion for innovation and
          a commitment to free expression, we have created a versatile platform
          that empowers individuals and businesses to unleash their true voice
          in the digital era. Specter vows to protect user privacy and has a
          wide range of features including but not limited to videos, images,
          articles, stories, groups, messaging and more.
        </p>
      </div>
      <div className="">
        <div>
          <img width={500} height={"100%"} src={LandingImage} alt="Landing" />
        </div>
      </div>
    </div>
  );
}

export default Experience;
