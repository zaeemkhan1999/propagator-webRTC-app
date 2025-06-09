import { memo, useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const CreatePage = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (location.pathname === "/specter/create") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [location]);

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === "modal-container") {
      setIsModalOpen(false);
      navigate("/specter/home");
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white rounded-lg shadow-lg text-center w-[90%] md:w-1/4 h-auto p-109"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4 p-10">
              <button
                className="p-3 text-green-600 border border-green-500 hover:bg-green-50 rounded-2xl"
                onClick={() => handleNavigate("post")}
              >
                Create Post
              </button>
              <button
                className="p-3 text-red-600 border border-red-500 hover:bg-red-50 rounded-2xl"
                onClick={() => handleNavigate("scroll")}
              >
                Create Scroll
              </button>
              <button
                className="p-3 text-blue-600 border border-blue-500 hover:bg-green-50 rounded-2xl"
                onClick={() => handleNavigate("product")}
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet context={[setIsModalOpen]} />
    </div>
  );
});

export default CreatePage;
