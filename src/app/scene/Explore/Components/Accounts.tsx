import Lottie from "lottie-react";
import Tag from "../../../../components/Tags";
import NoData from "../../../utility/Nodata.json";
import { useEffect, useState } from "react";
import { EAllKey } from "../data";
import { useSnapshot } from "valtio";
import { CircularProgress } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { useGetUsers } from "../../Admin/queries/getUsers";

interface props {
  searchTerm: string;
  userId: number
}

function Accounts({ searchTerm, userId }: props) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const { data, isFetching, fetchNextPage, hasNextPage, refetch } = useGetUsers({ searchTerm, ofTypes: ["USER", "ADMIN", "SUPER_ADMIN"] })
  useEffect(() => {
    refetch()
  }, [debouncedSearchTerm])

  const allItems =
    data?.pages.flatMap((page) => page.user_getUsers.result.items) || [];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { ref, inView } = useInView({
    threshold: 1.0,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="w-full h-screen overflow-y-auto pb-20 snap-y snap-mandatory bg-gray-100 p-1 pt-0">

      {allItems?.length ? (
        allItems.map((account) => (
          <div key={account.id}>
            <Tag type={EAllKey.Accounts} data={account} userId={userId} />
            <div ref={ref} className="h-px" />
          </div>
        ))
      ) : (
        !isFetching && <Lottie
          loop={false}
          animationData={NoData}
          style={{ width: "200px", height: "200px", margin: "0 auto" }}
        />
      )}
      {isFetching && <div className="text-center my-4"><CircularProgress /></div>}
    </div>
  );
}

export default Accounts;