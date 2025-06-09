import { lazy } from 'react';

const Home = lazy(() => import('.'));

const FreeMarket = lazy(() => import('./components/FreeMarket'));
const ProductDetails = lazy(() => import('./components/FreeMarket/components/ProductDetails'));

const YoutubeHomePage = lazy(() => import('./components/Youtube'));
const SearchResults = lazy(() => import('./components/Youtube/components/SearchResults'));
const VideoDetails = lazy(() => import('./components/Youtube/components/VideoDetails'));
const WatchHistory = lazy(() => import('@/components/Feed/WatchHistory'));

const homePageRoute = {
  path: "home",
  element: <Home />
};

export const youtubeHomePage = {
  path: "youtube",
  element: <YoutubeHomePage />
};

export const freeMarket = {
  path: "free-market",
  element: <FreeMarket />
};

export const productDetails = {
  path: "free-market/product/:productId",
  element: <ProductDetails />
};

export const youtubeSearchPage = {
  path: "youtube/search/:q",
  element: <SearchResults />
};

export const watchYoutubeVideo = {
  path: "youtube/watch/:vId",
  element: <VideoDetails />
};

export const watchHistory = {
  path: "watch-history",
  element: <WatchHistory />
};

export default homePageRoute;
