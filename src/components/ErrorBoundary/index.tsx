import { Component, type ReactNode, type ErrorInfo } from "react";
// import * as Sentry from "@sentry/react";
import err from "./Error.json";
import Lottie from "lottie-react";

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // const errorContext = {
        //     componentStack: errorInfo.componentStack,
        // };

        // Sentry.captureException(error, {
        //     extra: errorContext,
        // });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col text-center items-center gap-4 justify-center">
                    <Lottie loop animationData={err} />

                    <h5 className="font-bold">Oops! Something went wrong.</h5>
                    <button
                        className="p-3 rounded-xl bg-greyrejected w-48 mt-3"
                        onClick={() => window.location.reload()}>
                        Give it another try!
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
