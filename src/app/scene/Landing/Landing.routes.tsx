import LandingPage from '.';
import PrivacyPolicy from '../Profile/components/Profilesettings/components/PrivacyPolicy';
import TermsConditions from '../Profile/components/Profilesettings/components/TermsConditions';

const LandingPageRoutes = {
  path: "/",
  element: <LandingPage />,
};

export const privacyPolicyRoute = {
  path: "privacy-policy",
  element: <PrivacyPolicy />,
};

export const termsConditionsRoute = {
  path: "terms-and-conditions",
  element: <TermsConditions />,
};

export default LandingPageRoutes;
