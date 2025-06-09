import UserDetails from "./components/User";
import {
  IconBookmark,
  IconBrandSafari,
  IconDeviceDesktopAnalytics,
  IconDownload,
  IconHistory,
  IconHome,
  IconLogout2,
  IconMessage2,
  IconRss,
  IconShoppingCart,
  IconSquarePlus,
  IconTags,
  IconUserCircle,
  IconUsersGroup,
  IconVideo,
} from "@tabler/icons-react";
import NavItem from "./components/Navbar/NavItem";
import Title from "@/components/Typography/Title";
import { useUser_LogOutMutation } from "./mutations";
import useScreenDetector from "../../../../utility/misc.helpers";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { CircularProgress } from "@mui/material";

function SideNavigation() {
  const { logOut, loading: loggingOut } = useUser_LogOutMutation();
  const { isDesktop } = useScreenDetector();

  const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();

  return (
    <div
      style={{ display: !isDesktop ? "none" : "block" }}
      className="h-screen w-[300px] overflow-y-auto border-r-[1px] border-[#D9D8D8] bg-white pb-20"
    >
      <UserDetails />
      <div className="hidden"></div>
      <div className="">
        <div className="flex flex-col gap-1">
          {GetNavItems(isSuperAdmin).map((el) => (
            <NavItem key={el.id} item={el} />
          ))}
        </div>
        <div
          onClick={logOut}
          className="mt-6 flex items-center gap-3 px-5"
        >
          {loggingOut
            ? <CircularProgress />
            : <><IconLogout2 className="text-red1" />
              <Title className="text-red1 md:text-lg md:font-normal">Logout</Title></>}
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;

export const GetNavItems = (isSuperAdmin: boolean) => {
  const { isDesktop } = useScreenDetector();
  return [
    {
      id: 1,
      label: "Admin Tools",
      route: "/admin",
      isViewAble: isSuperAdmin,
      isExpandable: true,
      icons: <IconDeviceDesktopAnalytics size={34} strokeWidth={1.2} />,
      childrens: [
        {
          id: 1,
          label: "Admins",
          route: "/admin/",
        },
        {
          id: 2,
          label: "Non Admin Users",
          route: "/admin/non-admins",
        },
        {
          id: 3,
          label: "Banned Users",
          route: "/admin/banned-users",
        },
        {
          id: 4,
          label: "Discounts",
          route: "/admin/discounts",
        },
      ],
    },
    {
      id: 2,
      label: "Home",
      route: "/specter/home",
      isViewAble: true,
      isExpandable: false,
      icons: <IconHome size={28} strokeWidth={1.2} />,
    },
    {
      id: 3,
      label: "Create",
      route: "/specter/create",
      isViewAble: isDesktop,
      icons: <IconSquarePlus size={28} strokeWidth={1.2} />,
    },
    {
      id: 4,
      label: "Watch History",
      route: "/specter/watch-history",
      isViewAble: true,
      icons: <IconHistory size={28} strokeWidth={1.2} />,
    },
    {
      id: 6,
      label: "Groups",
      route: "/specter/groups",
      isViewAble: true,
      icons: <IconUsersGroup size={28} strokeWidth={1.2} />,
    },
    {
      id: 7,
      label: "Explore",
      route: "/specter/explore",
      isViewAble: isDesktop,
      icons: <IconBrandSafari size={28} strokeWidth={1.2} />,
    },
    {
      id: 8,
      label: "Profile",
      route: "/specter/profile",
      isViewAble: isDesktop,
      icons: <IconUserCircle size={28} strokeWidth={1.2} />,
    },
    {
      id: 9,
      label: "Subscriptions",
      route: "/specter/subscription",
      isViewAble: true,
      icons: <IconRss size={28} strokeWidth={1.2} />,
    },
    {
      id: 10,
      label: "Promotions",
      route: "/specter/promotions",
      isViewAble: true,
      icons: <IconTags size={28} strokeWidth={1.2} />,
    },
    {
      id: 11,
      label: "Messages",
      route: "/specter/inbox",
      isViewAble: isDesktop,
      isExpandable: false,
      icons: <IconMessage2 size={28} strokeWidth={1.2} />,
    },
    {
      id: 12,
      label: "Live",
      route: "/specter/live",
      isViewAble: isDesktop,
      icons: <IconVideo size={28} strokeWidth={1.2} />,
    },
    {
      id: 13,
      label: "Install WebApp",
      route: "/specter/install",
      isViewAble: true,
      icons: <IconDownload size={28} strokeWidth={1.2} />,
    },
    {
      id: 14,
      label: "Saved Posts",
      route: "/specter/profile/saved-posts",
      isViewAble: true,
      icons: <IconBookmark size={28} strokeWidth={1.2} />,
    },
    {
      id: 15,
      label: "Long Videos",
      route: "/specter/youtube",
      isViewAble: true,
      icons: <IconVideo size={28} strokeWidth={1.2} />,
    },
    {
      id: 16,
      label: "The Free Market",
      route: "/specter/free-market",
      isViewAble: true,
      icons: <IconShoppingCart size={28} strokeWidth={1.2} />,
    },
  ];
};
