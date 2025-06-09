export function gqlResultVariablesBase() {
    return {
        variables: {
            skip: {
                name: 'skip',
                type: 'Int'
            },
            take: {
                name: 'take',
                type: 'Int'
            }
        }
    };
}

export function gqlResultVariables(whereType: string, sortType: string) {
    return {
        variables: {
            skip: {
                name: 'skip',
                type: 'Int'
            },
            take: {
                name: 'take',
                type: 'Int'
            },
            where: {
                name: 'where',
                type: whereType
            },
            order: {
                name: 'order',
                type: sortType
            }
        }
    };
}

const fields = ['firstName', 'lastName', 'city', 'id'];
const providers = ['doctor', 'dentist', 'nutritionExpert', 'veterinarian'];

export const gqlProviderNames = {
    provider: ['providerName', ...providers.map((provider) => ({ [provider]: fields }))]
};
