import { useEffect, useMemo, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import SideNavigation from "./components/SideNavigation";
import MobileNav from "./components/SideNavigation/MobileNav";
import Topbar from "./components/SideNavigation/MobileNav/components/Topbar";
import useScreenDetector, { isUserLoggedIn } from "../../utility/misc.helpers";
import { useGetCurrentUser } from "../../services/query/user.query";
import BottomMenu from "../../../components/MenuBottom";
import { permissionsStore } from "@/store/permissions";
import { useGetCurrentUserPermissions } from "../Admin/queries/getCurrentUserPermissions";
import ThemeColorHandler from "@/utils/ThemeColor";
import useUpdateLastSeen from "@/app/services/mutations/updateLastSeen";

function MasterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { fetchCurrentUser } = useGetCurrentUser();
  const { isDesktop } = useScreenDetector();

  useEffect(() => {
    if (!isUserLoggedIn() && !(location.pathname.includes('terms-and-conditions') || location.pathname.includes('privacy-policy'))) {
      navigate("/auth/signin", { replace: true });
    }
  }, [navigate, location.pathname, isUserLoggedIn()]);

  const { getPermissions } = useGetCurrentUserPermissions();
  const { updateLastSeen } = useUpdateLastSeen();

  useEffect(() => {
    if (isUserLoggedIn()) {
      fetchCurrentUser(
        () => getPermissions({ skip: 0, take: 100 },
          (p) => {
            permissionsStore.actions.setPermissions(p);
          }
        )
      );

      updateLastSeen();
    }
  }, [isUserLoggedIn()]);

  const handleClose = () => {
    setShowMobileNav(false);
  };

  const showAdsSection = useMemo(() => {
    const excludedPaths = ["/profile", "/youtube", "/youtube/watch", "privacy-policy", "terms-and-conditions"];
    return !excludedPaths.some(path => location.pathname.includes(path));
  }, [location.pathname]);

  return (
    <>
      <div className={`flex flex-col md:flex-row w-full h-dvh overflow-hidden ${showAdsSection ? "justify-start md:justify-between" : ""}`}>
        <div className="w-[300px] none lg:block md:w-auto">
          <ThemeColorHandler />
          {showAdsSection && <SideNavigation />}
          <Topbar setShowMobileNav={setShowMobileNav} />
          <MobileNav
            showMobileNav={showMobileNav}
            setShowMobileNav={setShowMobileNav}
          />
        </div>
        <div onClick={handleClose} className={`w-full relative ${showAdsSection && "lg:w-[calc(100%-600px)]"}`}>
          <Outlet />
        </div>
        {showAdsSection && <div
          style={{ display: !isDesktop ? 'none' : 'block' }}
          className="w-[300px] md:block bg-white border-l-[1px] border-[#D9D8D8]">
          <div className="flex items-center gap-2 px-2 justify-center">
            <p>Ads (Coming Soon)</p>
          </div>
        </div>}
      </div>

      <BottomMenu isActiveMobileMenu={!isDesktop} />
    </>
  );
}

export default MasterLayout;
