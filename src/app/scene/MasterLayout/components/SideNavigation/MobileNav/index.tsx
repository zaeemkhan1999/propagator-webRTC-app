import { memo } from "react";
import UserDetails from "../components/User";
import { GetNavItems } from "..";
import NavItem from "../components/Navbar/NavItem";
import { IconLogout2 } from "@tabler/icons-react";
import Title from "@/components/Typography/Title";
import { useClickAway } from "@uidotdev/usehooks";
import { useUser_LogOutMutation } from "../mutations";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";

interface Props {
  showMobileNav: boolean;
  setShowMobileNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNav = memo(({ showMobileNav, setShowMobileNav }: Props) => {
  const { logOut } = useUser_LogOutMutation();
  const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();
  const ref: any = useClickAway(() => setShowMobileNav(false));

  return (
    <div
      ref={ref}
      className={`absolute z-[9999] overflow-y-auto top-0 overflow-hidden w-[60%] lg:hidden bg-white h-[100dvh] border-r-[1px] border-[#D9D8D8] transition-all ease-in-out duration-500 ${showMobileNav ? "left-0" : "left-[-100%]"}`}
    >
      <UserDetails setShowMobileNav={setShowMobileNav} />
      <div className="text-sm md:text-md overflow-y-auto max-h[480px] pb-[4rem]">
        {GetNavItems(isSuperAdmin).map((el) => {
          return (
            <NavItem
              key={el.id}
              item={el}
              setShowMobileNav={setShowMobileNav}
            />
          );
        })}
        <div onClick={logOut} className="flex items-center gap-3 px-5 mt-4">
          <IconLogout2 className="text-red1" />
          <Title className="md:text-lg md:font-normal text-red1">Logout</Title>
        </div>
      </div>
    </div>
  );
});

export default MobileNav;