import { useEffect } from "react";
import LandingHeader from "./components/LandingHeader";
import Experience from "./components/Experience";
import WhyPropagator from "./components/WhyPropagator";
import Details from "./components/Details";
import ValuesSection from "./components/ValuesSection";
import Footer from "./components/Footer";
import { isUserLoggedIn } from "../../utility/misc.helpers";
import { useNavigate } from "react-router";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/specter/home", { replace: true });
    }
  }, []);

  return (
    <div className={`bg-white h-screen overflow-hidden`}>
      <LandingHeader />
      <div style={{ height: "calc(100dvh - 88px)", overflowY: "auto" }}>
        <Experience />
        <WhyPropagator />
        <Details />
        <ValuesSection />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
