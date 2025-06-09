import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import notFound from './notfound.json'

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col text-center items-center gap-4 justify-center">
            <Lottie loop animationData={notFound} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
            <h5 className="font-bold">We seem you have lost!</h5>
            <h6>The page you're trying to access,<br></br> does not exist.</h6>
            <button className="p-3 rounded-xl bg-greyrejected w-48 mt-3" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
}

export default NotFound;
