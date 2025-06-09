import { memo, useEffect, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import Title from "@/components/Typography/Title";
import './NavItem.css';

interface Props {
  item: any;
  setShowMobileNav?: React.Dispatch<React.SetStateAction<boolean>>;
}

function NavItem({ item, setShowMobileNav }: Props) {
  const [expand, setExpand] = useState({
    expand: false,
    expandItem: null,
  });

  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname.includes(item.route));
  }, [item.route, location.pathname]);

  return (
    <div className={`px-5 ${isActive ? "active" : ""}`}>
      <div
        onClick={() => {
          if (item?.isExpandable) {
            setExpand({
              expand: !expand.expand,
              expandItem: item,
            });
          }
        }}
        className={`w-full h-[50px] mt-0 md:mt-4 items-center justify-between cursor-pointer ${item?.isViewAble ? "flex" : "hidden"}`}
      >

        {item?.isExpandable
          ? <>
            <div className="flex items-center gap-3 w-full">
              {item.icons}
              <Title className="md:text-lg md:font-normal text-black1">{item.label}</Title>
            </div>

            <div>
              <IconChevronDown
                className="ease-in-out transition-all duration-300"
                style={{
                  rotate: expand.expand && expand.expandItem === item ? "180deg" : "0deg",
                }}
              />
            </div>
          </>
          : <Link
            role="button"
            to={item?.route}
            className="flex w-full items-center gap-3 cursor-pointer"
            onPointerDown={(e) => {
              e.preventDefault();
              setShowMobileNav?.(false);
            }}
          >
            <span className={isActive ? "text-sky-600" : "text-black1"}>{item.icons}</span>
            <Title
              className={`flex md:text-lg md:font-normal items-center text-sm gap-3 ${isActive ? "text-sky-600" : "text-black1"
                }`}
            >
              {item.label}
            </Title>
          </Link>}
      </div>

      {item?.isExpandable && expand.expand && expand.expandItem === item &&
        <div className="bg-grey11 p-3 rounded-lg flex flex-col gap-3 fade">
          {item?.childrens?.map((childRoute: any) => {
            return (
              <Link
                key={childRoute?.id}
                to={`/specter${childRoute?.route}`}
                role="button"
                className="flex items-center gap-2 cursor-pointer"
                onPointerDown={() => {
                  setShowMobileNav?.(false);
                }}
              >
                <div className="h-2 w-2 rounded-full bg-grey10 " />
                <Title className="md:text-sm text-xs font-normal md:font-normal ">
                  {childRoute?.label}
                </Title>
              </Link>
            );
          })}
        </div>}
    </div >
  );
}

export default memo(NavItem);
