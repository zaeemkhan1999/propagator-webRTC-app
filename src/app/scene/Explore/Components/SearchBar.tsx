import SearchIcon from "@/assets/sidebar/search";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { memo, useEffect, Dispatch, SetStateAction } from "react";

interface Props {
    className?: string;
    cb: Function;
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    delay?: number
};

const SearchBar = memo(({ searchTerm, setSearchTerm, className, cb, delay = 500 }: Props) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            searchTerm && cb();
        }, delay);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className={`flex shadow-md items-center p-2.5 bg-white rounded-2xl h-13 ${className}`}>
            <div className="px-2 text-gray-400">
                <SearchIcon size={20} />
            </div>

            <input
                type="text"
                id="searchInput"
                placeholder="Search..."
                className="w-full dark:bg-transparent dark:text-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button className="px-2 cursor-pointer text-gray-400" onClick={() => setSearchTerm('')}>
                <IconSquareRoundedX />
            </button>}
        </div>
    );
});

export default SearchBar;
