import { IconSearch, IconSquareRoundedX } from "@tabler/icons-react";

function Searchfields({ className }: { className?: string }) {
  return (
    <div className={`flex items-center p-2.5 bg-white rounded-2xl border border-gray-300 shadow-sm h-13 ${className}`}>
      <div className="px-2 text-gray-400">
        <IconSearch />
      </div>

      <input
        type="text"
        placeholder="Search..."
        className=" w-full text-gray-700 placeholder-gray-400 focus:outline-none"
      />
      <button className="px-2 cursor-pointer  text-gray-400">
        <IconSquareRoundedX />
      </button>
    </div>
  );
}

export default Searchfields;
