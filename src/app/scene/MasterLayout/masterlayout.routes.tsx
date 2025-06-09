import MasterLayout from ".";
import groupsRoutes, {
  groupDetailsRoute,
  groupTopicsRoute,
} from "../Groups/groups.routes";
import homePageRoutes, { youtubeHomePage, youtubeSearchPage, watchYoutubeVideo, watchHistory, freeMarket, productDetails, } from "../Home/home.routes";
import CreatePageRoutes from "../Create/Create.routes";
import ProfilePageRoute, { profileSavedPosts, profileSettingsRoute } from "../Profile/Profile.routes";
import explorePageRoutes from "../Explore/explore.routes";
import UserProfilePageRoutes from "../UserProfile/UserProfile.routes";
import inboxPageRoute, {
  chatUsersRoute,
  chatPageRoute,
} from "../Inbox/inbox.routes";
import adminRoute, {
  adminPermissionRoute,
  nonAdminsRoute,
  bannedUserRoute,
  discountRoute,
} from "../Admin/admin.routes";
import notificationRoute from "../Notifications/notification.routes";
import livePageRoute from "../Live/live.routes";
import subscriptionRoutes, { subscriptionSuccessRoute } from "../Subscriptions/subscription.routes";
import viewByIdRoute from "@/components/ViewByID/viewById.routes";
import livePageRoutes from "../Live/live.routes";
import promotionsRoute from "../Promotions/promotion.routes";
import installWebAppRoute from "../InstallWebApp/installwebapp.routes";
import storyEditorRoute from "@/components/Stories/stories.routes";
import { privacyPolicyRoute, termsConditionsRoute } from "../Landing/Landing.routes";

const masterlayoutRoutes = {
  path: "/specter/",
  element: <MasterLayout />,
  children: [
    privacyPolicyRoute,
    termsConditionsRoute,
    adminRoute,
    nonAdminsRoute,
    adminPermissionRoute,
    bannedUserRoute,
    discountRoute,
    notificationRoute,
    viewByIdRoute,
    homePageRoutes,
    livePageRoute,
    groupsRoutes,
    groupDetailsRoute,
    groupTopicsRoute,
    CreatePageRoutes,
    ProfilePageRoute,
    profileSettingsRoute,
    explorePageRoutes,
    UserProfilePageRoutes,
    storyEditorRoute,
    inboxPageRoute,
    chatUsersRoute,
    chatPageRoute,
    subscriptionRoutes,
    subscriptionSuccessRoute,
    livePageRoutes,
    promotionsRoute,
    installWebAppRoute,
    profileSavedPosts,
    youtubeHomePage,
    youtubeSearchPage,
    watchYoutubeVideo,
    watchHistory,
    freeMarket,
    productDetails,
  ],
};

export default masterlayoutRoutes;
