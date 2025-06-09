import { graphqlFetcher } from '@/http/graphql.fetcher';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

interface SubscriptionPlan {
  id: number;
  addedToCouncilGroup: boolean;
  allowDownloadPost: boolean;
  price: number;
  priceId: string;
  removeAds: boolean;
  supportBadge: boolean;
  title: string;
  content: any;
}

interface SubscriptionPlansResponse {
  subscriptionPlan_getSubscriptionPlans: {
    result: {
      items: SubscriptionPlan[];
    };
    status: {
      code: number;
      value: string;
    };
  };
}

const SUBSCRIPTION_PLANS_QUERY = gql`
  query subscriptionPlan_getSubscriptionPlans($order: [SubscriptionPlanDtoSortInput!]) {
    subscriptionPlan_getSubscriptionPlans {
    result(order: $order){
      items{
        id
        addedToCouncilGroup
      allowDownloadPost
      price
      priceId
      removeAds
      supportbadge
      title
      content{
        features
        duration
      }
      }
    }
    status
    }
  }
`;

export const useGetSubscriptionPlans = () => {
  return useQuery<SubscriptionPlansResponse, Error>({
    queryKey: ['subscriptionPlan_getSubscriptionPlans'],
    queryFn: () => graphqlFetcher(SUBSCRIPTION_PLANS_QUERY, {
      order: [{
        price: "ASC"
      }]
    }),
    enabled: false
  });
};
