import { memo, useState } from "react";
import { IconArrowLeft, IconMenu2, IconPlus } from "@tabler/icons-react";
import ProfileMenu from "../../app/scene/Profile/components/Profilemenu";

interface HeaderProps {
  text: string | undefined;
  showEndIcon?: boolean;
  handleBack?: () => void;
  textColor?: string;
  bgColor?: string;
  position?: string;
};

const Header = memo(({ text, showEndIcon = false, handleBack, textColor, position, bgColor }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <div className={`${position ? position : "static"} top-0 left-0 w-full text-${textColor ?? "white"} z-10 flex bg-${bgColor ?? 'transparent'} justify-center items-center h-[40px]`}>
        <div className="absolute left-3 z-[999]">
          <IconArrowLeft onClick={handleBack} className="cursor-pointer" />
        </div>
        <h2 className="text-xl font-semibold">{text}</h2>
        {showEndIcon && (
          <div className="absolute right-3">
            <IconMenu2 onClick={toggleModal} className="cursor-pointer" />
          </div>
        )}
      </div>
      {isModalOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
            onClick={toggleModal}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full text-center">
              <button
                onClick={toggleModal}
                className="flex items-center rounded-md ml-auto  hover:text-red-600 transition-colors duration-200 "
              >
                <IconPlus style={{ transform: "rotate(45deg)" }} size={20} className="mr-2" />
              </button>
              <ProfileMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Header;
