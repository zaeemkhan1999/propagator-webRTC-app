import {
  IconBell,
  IconEdit,
  IconSettings
} from "@tabler/icons-react";
import Heading from "@/components/Typography/Heading";
import useScreenDetector, { hexToRgbA } from "@/app/utility/misc.helpers";
import Title from "@/components/Typography/Title";
import Logo from "@/assets/images/logo.png";
import { userStore } from "@/store/user";
import LazyLoadImg from "@/components/LazyLoadImage";
import { useNavigate } from "react-router";
import { useSnapshot } from "valtio";

interface userDetails {
  setShowMobileNav?: (arg: boolean) => void;
};

function UserDetails({ setShowMobileNav }: userDetails) {
  const navigate = useNavigate();
  const user = useSnapshot(userStore.store).user;

  const { isTablet, isMobile, isDesktop } = useScreenDetector();

  const details = [
    {
      id: 1,
      label: "Posts",
      value: user?.postCount || 0,
    },
    {
      id: 2,
      label: "Followers",
      value: user?.followerCount || 0
    },
    {
      id: 3,
      label: "Following",
      value: user?.follwingCount || 0
    },
  ];

  return (
    <div className="relative flex w-full flex-col gap-3 border-b-[1px] border-solid border-[#F5F5F5] py-3">
      {(isDesktop || isMobile || isTablet) && <>
        <IconSettings
          onClick={() => {
            navigate('/specter/profile/settings');
            setShowMobileNav?.(false);
          }}
          className="absolute left-5 top-5 text-gray-500 md:hidden"
        />
        <IconBell
          className="absolute right-5 top-5 text-sky-700 md:hidden"
          onClick={() => {
            navigate("/specter/notifications");
            setShowMobileNav?.(false);
          }}
        /></>}
      <div
        style={{ display: isTablet ? "none" : "flex" }}
        className="items-center justify-center gap-2"
      >
        <img className="h-[55px]" src={Logo} alt="Logo" />
        <Heading className="text-red1 md:text-[30px]">Specter</Heading>
      </div>

      {location.pathname !== "/specter/profile" && (
        <div>
          <div className="flex flex-col items-center justify-center">
            <div
              style={{ background: hexToRgbA("#11221F", 0.2) }}
              className="my-3 flex h-[94px] w-[94px] items-center justify-center overflow-hidden rounded-full capitalize"
            >
              {user?.imageAddress ? (
                <LazyLoadImg
                  width={"100%"}
                  height={"100%"}
                  className="h-full w-full"
                  src={user?.imageAddress}
                  alt="userImg"
                />
              ) : (
                <div className="text-3xl font-bold">
                  {user?.displayName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <IconEdit />{" "}
              <Title className="md:text-base">{user?.username}</Title>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-5 text-center">
            {details.map((el) => (
              <div className="flex flex-col justify-center" key={el.id}>
                <Title className="text-sm md:text-xs md:font-medium">
                  {el.value}
                </Title>
                <Title className="text-xs md:text-xs md:font-medium">
                  {el.label}
                </Title>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
