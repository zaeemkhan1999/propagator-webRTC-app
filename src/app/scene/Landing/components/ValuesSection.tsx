import Heading from "../../../../components/Typography/Heading";
import Paragraph from "../../../../components/Typography/Paragraph";
import Title from "../../../../components/Typography/Title";

const valuesData = [
  {
    id: 1,
    label: "Freedom of Expression",
    desc: "Expressing yourself without limits is what we stand for. Our community thrives on diverse perspectives, making it an enlightening space for everyone."
  },
  {
    id: 2,
    label: "Versatility",
    desc: "With images, videos and text posts all incorporated into the grid, as well as seperate sections for groups and long-form articles, we believe we have the most modern and versatile platform in social media.."
  },
  {
    id: 3,
    label: "Your Privacy, Your Control",
    desc: "Respecting user privacy is fundamental to us. We have implemented robust security measures to safeguard personal data."
  },
]

function ValuesSection() {
  return (
    <div className="flex flex-col md:flex-row mt-[60px] px-6 md:px-[60px] gap-10">
      <div className="md:w-1/2">
        <Heading className="text-[52px]  text-center md:text-left">Our Values</Heading>
        <Paragraph className="opacity-60 mt-12 md:max-w-[78%] text-center md:text-left">
          Our goal is to build a digital community where you can express
          yourself freely, have unfiltered conversations, and maintain your
          privacy. We have developed a well-rounded platform that does not focus
          too much on one form of media at the expense of any others. Its a
          space where freedom, privacy and versatility come together seamlessly.
        </Paragraph>
      </div>
      <div className="md:w-1/2 flex flex-col gap-4">
        {
          valuesData.map((el) => {
            return (
              <Values key={el.id} label={el.label} desc={el.desc} />
            )
          })
        }
      </div>
    </div>
  );
}

const Values = ({ label, desc }: { label: string, desc: string }) => {
  return (
    <div className="bg-themepink p-3 flex gap-5 rounded-lg">
      <div className="flex items-center justify-center">
        <div className="h-[32px] w-[32px] rounded-[2px] bg-white" />
      </div>
      <div>
        <Title className="text-white md:text-[23px] text-[14px]">{label}</Title>
        <Paragraph className="opacity-60 text-white mt-1 pr-2 md:text-[16px] text-[12px]">{desc}</Paragraph>
      </div>
    </div>
  )
}

export default ValuesSection;
