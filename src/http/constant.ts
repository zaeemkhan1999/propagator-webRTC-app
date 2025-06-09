// import { ResStatusType } from 'src/@types/graphql.type';

export const RES_STATUS: Record<string, any> = {
  success: "Success",
  deplicate: "ALREADY_EXISTS",
  error: "ERROR",
  unauthorize: "AUTHENTICATION_FAILED",
};

export const DEFAULT_PAGE_SIZE_REQ = {
  request: {
    pageSize: 1000,
    skip: 0,
  },
};

export function getNextPageParam<T>(lastPage: any, allPages: T[]) {
  const apiName = Object.keys(lastPage || {})?.[0];

  if (lastPage?.[apiName]?.result?.pageInfo?.hasNextPage) {
    return allPages.length;
  }
  return undefined;
}
