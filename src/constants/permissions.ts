export const permissionsENUM = {
    BanUsers: "Permissions.BanUsers",
    DeleteEntities: "Permissions.DeleteEntities",
    GiveStrikes: "Permissions.GiveStrikes",
    ViewPrivateGroups: "Permissions.ViewPrivateGroups",
    ViewPrivateAccounts: "Permissions.ViewPrivateAccounts",
    Demographics: "Permissions.Demographics",
    AdReports: "Permissions.AdReports",
    SuspendAds: "Permissions.SuspendAds",
    SetWarningAsInBanner: "Permissions.SetWarningAsInBanner",
    CreateAdsWithoutPayment: "Permissions.CreateAdsWithoutPayment",
    VerifyAccount: "Permissions.VerifyAccount",
    VerifyArticle: "Permissions.VerifyArticle",
};

const defaultPermissions = [
    {
        "type": "Permissions.BanUsers",
        "selected": false,
        "value": "false",
    },
    {
        "type": "Permissions.DeleteEntities",
        "selected": false,
        "value": "false",
    },
    {
        "type": "Permissions.GiveStrikes",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.ViewPrivateGroups",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.ViewPrivateAccounts",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.Demographics",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.AdReports",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.SuspendAds",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.SetWarningAsInBanner",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.CreateAdsWithoutPayment",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.VerifyAccount",
        "selected": false,
        "value": "false"
    },
    {
        "type": "Permissions.VerifyArticle",
        "selected": false,
        "value": "false"
    },
];

export default defaultPermissions;
