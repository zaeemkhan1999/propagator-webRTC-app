import { useState, useEffect } from "react";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsConditions from "./components/TermsConditions";
import HideStorySettings from "./components/Hidestory";
import NotificationSettings from "./components/Notification";
import AccountSettings from "./components/Account";
import Promotions from "./components/Promotions";
import RequestVerification from "./components/RequestVerification";
import TwoFactor from "./components/TwoFactor";
import SecurityQuestions from "./components/SecurityQuestions";
import Support from "./components/Support";
import { Container } from "@mui/material";
import { useNavigate } from "react-router";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";

interface MenuItem {
  title: string;
  component: JSX.Element;
}

const ProfileSettings = () => {
  const defaultItem = { title: "Notifications", component: <NotificationSettings /> };
  const [selectedItem, setSelectedItem] = useState<string>(defaultItem.title);
  const [activeComponent, setActiveComponent] = useState<JSX.Element>(
    defaultItem.component
  );
  const [showSideBar, setShowSideBar] = useState<boolean>(true);
  const visibilityMenuItems: MenuItem[] = [
    { title: "Hide story", component: <HideStorySettings /> },
    { title: "Notifications", component: <NotificationSettings /> },
    { title: "Account", component: <AccountSettings /> },
    { title: "Promotions", component: <Promotions /> },
    { title: "Request verification", component: <RequestVerification /> },
    { title: "Set up two-factor authentication", component: <TwoFactor /> },
    { title: "Security questions", component: <SecurityQuestions /> },
    { title: "Support", component: <Support /> },
  ];

  const aboutMenuItems: MenuItem[] = [
    { title: "Privacy Policy", component: <PrivacyPolicy /> },
    { title: "Terms & Conditions", component: <TermsConditions /> },
  ];

  const handleMenuClick = (item: MenuItem) => {
    setSelectedItem(item.title);
    setActiveComponent(item.component);
    if (window.innerWidth < 768) {
      setShowSideBar(false);
    }
  };

  const navigate = useNavigate();

  const handleBack = () => {
    setShowSideBar(true);
    setActiveComponent(defaultItem.component);
    navigate(-1);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSideBar(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div
        className={`${!showSideBar ? "hidden md:block" : "block"} h-screen pb-20 w-full md:w-1/3 bg-gray-50 p-4 overflow-y-auto`}>
        <div className="flex items-center gap-2 mb-2">
          <IconArrowLeft className="text-black" onClick={handleBack} />
          <h2 className="text-lg font-medium text-gray-900 ">Settings</h2>
        </div>
        <nav className="flex flex-col">
          {visibilityMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className={`flex items-center justify-between font-[600] p-4 text-left hover:bg-gray-200 text-gray-800 
                ${selectedItem === item.title ? "border-l-4 border-blue-500 pl-3" : ""}`}
            >
              <span className="text-base">{item.title}</span>
              <IconChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </nav>
        <h2 className="text-lg font-medium text-gray-900 mt-6 mb-2">About</h2>
        <nav className="flex flex-col">
          {aboutMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className={`flex items-center justify-between font-[600] p-4 text-left hover:bg-gray-200 text-gray-800 ${selectedItem === item.title ? "border-l-4 border-blue-500" : ""}`}
            >
              <span className="text-base">{item.title}</span>
              <IconChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </nav>
      </div>

      {/* Right Side Component Rendering */}
      <div className={`${showSideBar && "hidden md:block"} w-full pb-8 md:pb-4 md:w-2/3 p-4 border-l border-gray-200`}>
        {activeComponent ? (
          <Container className="px-2 relative">
            <div className="flex w-full">
              {!showSideBar && (
                <IconArrowLeft
                  className="text-black min-w-8 absolute -left-2 top-3"
                  onClick={() => setShowSideBar(true)}
                />
              )}
              <div className="w-full">{activeComponent}</div>
            </div>
          </Container>
        ) : (
          <div>Select a setting to view</div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;