import Heading from "../../../../components/Typography/Heading";
import Title from "../../../../components/Typography/Title";
import Paragraph from "../../../../components/Typography/Paragraph";
import Private from '../../../../assets/images/landing/Private.png'
import Synced from '../../../../assets/images/landing/Synced.png'
import Powerful from '../../../../assets/images/landing/Powerful.png'
import Social from '../../../../assets/images/landing/Social.png'

function WhyPropagator() {
  const data = [
    {
      id: 1,
      label: "Private",
      desc: "Messages are encrypted and can self-destruct.",
      icon: Private
    },
    {
      id: 2,
      label: "Synced",
      desc: "Access your chats from multiple devices.",
      icon: Synced
    },
    {
      id: 3,
      label: "Powerful",
      desc: "Has no limits on the size of your media and chats.",
      icon: Powerful
    },
    {
      id: 4,
      label: "Private",
      desc: "Messages are encrypted and can self-destruct.",
      icon: Social
    },
  ]

  return <div className="mt-[130px] px-6">
    <Heading className="text-center">
      Why Specter?
    </Heading>

    <div className="mt-[50px] flex flex-col md:flex-row gap-10 justify-between w-full">
      {
        data.map((item, index) => (
          <Content key={index} label={item.label} desc={item.desc} Icon={item.icon} />
        ))
      }
    </div>
  </div>;
}

const Content = ({ Icon, desc, label }: { label: string, desc: string, Icon: any }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <img src={Icon} width={76} height={76} alt="" />
      <Title>{label}</Title>
      <Paragraph className="opacity-60 text-center">{desc}</Paragraph>
    </div>
  )
}

export default WhyPropagator;
