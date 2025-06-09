import { ProviderNameType } from './user.type';

export type PlanType = 'FIX_PRICE' | 'EACH_PATIENT' | 'VIP' | 'AD' | 'POINT';

export type AdsShowPlaceType = 'HOME_PAGE' | 'PROVIDER_PAGE' | 'HOME_AND_PROVIDER_PAGE';

export type SubscribePlanType = {
    value: number;
    plan: PlanType;
    mounth?: number;
    providerName?: ProviderNameType;
    showIn?: AdsShowPlaceType;
    id?: number;
};

export type ProviderSubscribePlanType = {
    providerId: number;
    createAt: string;
    subscribePlan?: SubscribePlanType;
    subscribePlanId: number;
};
