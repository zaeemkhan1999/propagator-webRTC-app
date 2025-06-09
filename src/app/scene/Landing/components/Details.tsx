import Home from "../../.../../../../assets/images/landing/home.webp";
import Profile from "../../.../../../../assets/images/landing/profile.webp";
import Explore from "../../.../../../../assets/images/landing/explore.webp";
import Messages from "../../.../../../../assets/images/landing/messages.jpg";
import Groups from "../../.../../../../assets/images/landing/group.jpg";
import Search from "../../.../../../../assets/images/landing/Search.webp";
import Scrolls from "../../.../../../../assets/images/landing/scrolls.webp";
import Notifications from "../../.../../../../assets/images/landing/notification.jpg";
import Heading from "../../../../components/Typography/Heading";
import Paragraph from "../../../../components/Typography/Paragraph";

const data = [
  {
    id: 1,
    label: "Home Page",
    desc: "Discover personalized content on your Home Page —find posts, discussions, and news curated based on your interests and connections, ensuring an engaging feed every time you log in.",
    image: Home,
  },
  {
    id: 2,
    label: "Profile",
    desc: "Your Profile is your digital persona—customize it with your bio details, profile picture, showcase your highlights, posts and scrolls across the platform for others to explore.",
    image: Profile,
  },
  {
    id: 3,
    label: "Explore",
    desc: "Discover a world of diverse perspectives in the Explore section—explore trending topics, new communities, and engaging content beyond your usual circle.",
    image: Explore,
  },
  {
    id: 4,
    label: "Messages",
    desc: "Connect directly with individuals via private Messages—engage in one-on-one conversations or group chats to exchange thoughts and ideas.",
    image: Messages,
  },
  {
    id: 5,
    label: "Groups",
    desc: "Join or create specialized communities in Groups—foster discussions, share interests, and engage with like-minded individuals on specific topics or hobbies.",
    image: Groups,
  },
  {
    id: 6,
    label: "Search",
    desc: "Access advanced search for effortless discovery.",
    image: Search,
  },
  {
    id: 7,
    label: "Scrolls",
    desc: "Scrolls are endless and endless.",
    image: Scrolls,
  },
  {
    id: 8,
    label: "Notification",
    desc: "Get notified of new messages and updates.",
    image: Notifications,
  },
];

function Details() {
  return (
    <div className="mt-[130px] overflow-hidden">
      {
        data.map((el, idx) => {
          return (
            <div key={el.id} className={`flex mb-20 gap-10 md:gap-0 flex-col-reverse md:flex-row w-full ${idx % 2 === 0 ? 'flex-row' : 'md:flex-row-reverse'}`}>
              <div className="md:w-1/2 flex items-center justify-center">
                <img
                  // style={{
                  //   boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                  // }}
                  width={"250px"} className="rounded-xl shadow-shadowImg border-[1px] border-solid" src={el.image} alt="" />
              </div>
              <div className={`w-full md:w-1/2 flex items-center justify-center md:justify-start`}>
                <div className={`px-6 md:px-0 text-center md:text-left ${idx % 2 === 0 ? '' : 'md:pl-24'}`}>
                  <Heading>
                    {el.label}
                  </Heading>
                  <Paragraph className="opacity-60 mt-2 md:max-w-[87%]">
                    {el.desc}
                  </Paragraph>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  );
}

export default Details;
