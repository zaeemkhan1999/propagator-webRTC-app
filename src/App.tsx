import { type FC, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  // createRoutesFromChildren,
  // matchRoutes,
  RouterProvider,
  // useLocation,
  // useNavigationType,
} from "react-router-dom";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/en-gb";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import routes from "./config/RouteConfig.tsx";
// import { init, browserTracingIntegration, reactRouterV6BrowserTracingIntegration } from "@sentry/react";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

// init({
//   dsn: import.meta.env.VITE_SENTRY_DSN,
//   tracesSampleRate: 1.0,
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
//   integrations: [
//     browserTracingIntegration(),
//     reactRouterV6BrowserTracingIntegration({
//       useEffect,
//       useLocation,
//       useNavigationType,
//       createRoutesFromChildren,
//       matchRoutes,
//     }),
//   ],
//   profilesSampleRate: 1.0,
// });



const Entry: FC = () => {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.warn('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.warn('Service Worker registration failed:', error);
    });
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTimeout(() => {
          window.location.reload();
        }, 10 * 60 * 1000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    dayjs.extend(updateLocale);
    dayjs.updateLocale("en-gb", { weekStart: 1 });
    (window as any).defaultTimezone = userTimezone;
  }, []);

  return (
    <div className="main relative">
      <Suspense
        fallback={<div className="absolute top-0 flex h-screen items-center justify-center bg-transparent text-blue-500">
          <CircularProgress />
        </div>}
      >
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <ErrorBoundary>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </SnackbarProvider>
        </QueryClientProvider>
      </Suspense>
    </div>
  );
};

export default Entry;
