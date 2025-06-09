import { memo, useEffect, useState } from "react";
import {
  useNavigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const LivePageModal = memo(() => {
  const location = useLocation();
  const [urlSearchParams] = useSearchParams();
  const conType = urlSearchParams.get("ct");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    if (location.pathname === "/specter/live" && !conType) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [location]);

  if (
    (location.pathname === "/specter/live" && conType === "pg") ||
    conType === "fz"
  ) {
    return null;
  }

  const handleNavigate = (connectionType: "pg" | "fz") => {
    navigate(`/specter/live/${connectionType}`);
    setIsModalOpen(false); // Close the modal after navigation
  };

  // Close modal when clicking outside of it
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement; // Cast e.target to HTMLDivElement
    if (target.id === "modal-container") {
      setIsModalOpen(false);
      navigate('/specter/home');
    }
  };

  return (
    <div className="relative h-screen">
      <div className={`${isModalOpen ? "blur-sm" : ""}`}>
        {/* Content outside the modal goes here */}
      </div>

      {isModalOpen && (
        <div
          id="modal-container"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div
            className="p-109 h-auto w-[90%] rounded-lg bg-white text-center shadow-lg md:w-1/4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4 p-10">
              <button
                className="rounded-2xl border border-green-500 p-3 text-green-600 hover:bg-green-50"
                onClick={() => handleNavigate("pg")}
              >
                Propagations
              </button>
              <button
                className="rounded-2xl border border-red-500 p-3 text-red-600 hover:bg-red-50"
                onClick={() => handleNavigate("fz")}
              >
                Friend Zone
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet context={[setIsModalOpen]} />
    </div>
  );
});

export default LivePageModal;