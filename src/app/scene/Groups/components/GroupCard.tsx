import { Typography, Box, Avatar } from "@mui/material";
import { DaysAgo } from "../../../utility/misc.helpers";
import { GroupItem } from "../queries/getGroup.query";
import { handleOnErrorImage, Slice } from "@/helper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IconLock } from "@tabler/icons-react";

interface GroupCardProps {
  group: GroupItem;
  onClick: () => void;
};

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  return (
    <Box
      onClick={onClick}
      className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700/80 cursor-pointer hover:bg-gray-50"
    >
      <Avatar className="h-16 w-16 rounded-md border border-gray-300 dark:border-gray-700/80">
        {group?.groupImgageUrl ?
          <LazyLoadImage
            src={group?.groupImgageUrl}
            className="w-full h-full object-cover "
            alt="Group Cover"
            onError={handleOnErrorImage}
          />
          :
          <p className="text-black dark:text-white capitalize">{group?.groupName.slice(0, 1)}</p>}
      </Avatar>
      <div className="flex-grow">
        <Typography variant="subtitle1" component="div" className="!font-semibold !text-dark dark:text-gray-200 capitalize">
          {Slice(group.groupName, 14)}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="flex items-center dark:text-gray-200 gap-3">
          <span className="font-semibold">{group.groupMemberCount} member{group.groupMemberCount > 1 ? 's' : ''}</span> {group?.isPrivate && !group?.isMemberOfGroup && <IconLock className="text-[#5A8EBB]" />}
        </Typography>
      </div>
      <Typography variant="caption" color="textSecondary" className="dark:text-gray-500">
        Last active {DaysAgo(group.latestMessageDate)}
      </Typography>
    </Box>
  );
};

export default GroupCard;
