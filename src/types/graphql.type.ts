export type ResStatusType =
    | 'SUCCESS'
    | 'ERROR'
    | 'AUTHENTICATION_FAILED'
    | 'IMAGE_UPLOAD_FAILED'
    | 'NOT_FOUND'
    | 'ALREADY_EXISTS'
    | 'REACHED_THE_LIMIT'
    | 'USER_NOT_FOUND'
    | 'EVENT_DOES_NOT_EXIST'
    | 'USER_NOT_INVITED'
    | 'EVENT_NOT_STARTED'
    | 'EVENT_ENDED'
    | 'EXTERNAL_EVENT_ERROR'
    | 'USER_HAS_NOT_JOINED'
    | 'NON_HOST_TRIED_TO_START'
    | 'NON_HOST_TRIED_TO_DELETE'
    | 'EVENT_NEEDS_AT_LEAST_ONE_HOST'
    | 'USER_CREATION_FAILED'
    | 'ALREADY_FOLLOWING'
    | 'NOT_FOLLOWING'
    | 'CATEGORY_NOT_FOUND'
    | 'GROUP_NEEDS_AT_LEAST_ONE_OWNER'
    | 'GROUP_DOES_NOT_EXIST'
    | 'NON_OWNER_TRIED_TO_DELETE'
    | 'POST_NOT_FOUND'
    | 'COMMENT_NOT_FOUND'
    | 'ADD_ENTITY_FAILED'
    | 'USER_IS_INACTIVE'
    | 'PROVIDER_NOT_FOUND'
    | 'EMAIL_IS_EMPTY'
    | 'MOBILE_IS_EMPTY'
    | 'INPUT_IS_EMPTY'
    | 'EMAIL_AND_MOBILE_IS_EMPTY'
    | 'EMAIL_ALREADY_EXISTS'
    | 'MOBILE_ALREADY_EXISTS'
    | 'PLAN_DOES_NOT_EXIST'
    | 'ADVERTISE_DOES_NOT_EXIST'
    | 'SERVER_ERROR'
    | 'ADD_ENTITY_FAILED'
    | 'UPDATE_ENTITY_FAILED'
    | 'NOT_ENOUGH_DATA';

export type CommonResponse<T extends string, S = any> = Record<
    T,
    { result: S; status: ResStatusType }
>;

export type StatusPostResponse<T extends string> = CommonResponse<T, undefined>;

export type CommonGetResponse<T extends string, S = any> = Record<T, S>;

export type CommonHandledReuslt<T, R extends string> = {
    req: T;
    res: CommonResponse<R>;
    success: ResStatusType;
};

export type RequestIdInputType<T extends string, S = any> = Record<T, S>;

export type GraphqlQueryObj = {
    key: string;
    gql: string;
};
export type GraphqlQueryTypesKey = 'args' | 'res';

export type CommonResultQueryArgs<R = any, S = any> = {
    take?: number;
    skip?: number;
    where?: R;
    order?: S;
};

export type KeyValuePairOfDasboardItemAndInt64<T extends string> = { key: T; value: number };
export type KeyValuePairOfDasboardItemAndFinanciaCount<T extends string> = {
    key: T;
    value: {
        totalSettled: number;
        total: number;
    };
};
