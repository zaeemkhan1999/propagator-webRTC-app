import { Avatar, Typography } from "@mui/material";
import { IconHash, IconLink, IconMapPin } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import UserAvatar from "../Stories/components/UserAvatar";

const Tags = ({ type, data, userId }: { type: string, data: any, userId?: number }) => {

    const renderComponent = () => {
        switch (type) {
            case "Accounts":
                return (
                    <>
                        <UserAvatar
                            user={data}
                            isSelf={userId === data?.id}
                            size="8"
                        />
                        <Link to={`/specter/userProfile/${data?.id}`}>
                            <Typography className="capitalize">{data?.displayName}</Typography>
                        </Link>
                    </>
                );
            case "Tags":
                return (
                    <>
                        <Avatar className="bg-grey-200 border">
                            <IconHash className="text-black" />
                        </Avatar>
                        <Typography>{data?.text}</Typography>
                    </>
                );
            case "Places":
                return (data?.location &&
                    <>
                        <Avatar className="bg-grey-200 border">
                            <IconMapPin className="text-gray-800" />
                        </Avatar>
                        <Typography>{data?.location}</Typography>
                    </>
                );
            case "Links":
                return (
                    <>
                        <Avatar className="bg-grey-200 border">
                            <IconLink className="text-black" />
                        </Avatar>
                        <Typography variant="body1" className="text-[12px] break-all">
                            {data?.url}
                        </Typography>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center gap-4 p-2 py-4 border-b wrap">
            {renderComponent()}
        </div>
    );
};

export default Tags;