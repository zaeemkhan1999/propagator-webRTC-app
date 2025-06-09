import { useNavigate } from "react-router-dom";
import {
  IconAdCircle,
  IconCirclePlus,
  IconClockHour4,
  IconShare,
} from "@tabler/icons-react";

const menuItems = [
  {
    icon: <IconClockHour4 size={20} />,
    label: "Your activity",
    path: "/activity",
  },
  {
    icon: <IconAdCircle size={20} />,
    label: "Request Ads",
    path: "ads"
  },
  {
    icon: <IconCirclePlus size={20} />,
    label: "Add highlight",
    path: "/highlight",
  },
  {
    icon: <IconShare size={20} />,
    label: "Invite friends",
    path: "invite"
  },
];

const ProfileMenu = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="max-w-xs mx-auto p-4 pt-0 rounded-md">
      <h2 className="text-sm font-semibold text-center mb-3">Menu</h2>

      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => handleNavigate(item.path)}
              className="flex items-center p-2 rounded-md hover:text-red-600 transition-colors duration-200 w-full text-left"
            >
              <span className="text-sm mr-2">{item.icon}</span>

              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileMenu;
