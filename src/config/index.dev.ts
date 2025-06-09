const { VITE_API_BASE_URL, VITE_AWS_BUCKET_NAME, VITE_AWS_BUCKET_URL, VITE_AWS_REGION, VITE_SUPPORT_MAIL, VITE_URL_LOGIN_APP, VITE_BLOB_BASE_URL, VITE_RESIZE_IMG_URL } = import.meta.env || {};

const baseUrl = VITE_API_BASE_URL;
const baseCononicalUrl = VITE_API_BASE_URL;
const apiUrl = VITE_API_BASE_URL;
const generatorUrl = VITE_API_BASE_URL + "/graphql/";
const subscriptionUrl = generatorUrl.replace("http", "ws");
const supportMail = VITE_SUPPORT_MAIL;
const urlloginapp = VITE_URL_LOGIN_APP;

const config = {
  urlloginapp,
  apiUrl,
  baseUrl,
  generatorUrl,
  baseCononicalUrl,
  subscriptionUrl,
  supportMail,
  blobBaseUrl: VITE_BLOB_BASE_URL,
  blobUrl: VITE_BLOB_BASE_URL + "?sp=racwdli&st=2023-05-17T20:58:30Z&se=3023-05-18T04:58:30Z&spr=https&sv=2022-11-02&sr=c&sig=ZSQlVg7JdL9BM8LOlA1quFJOqYPlUQsXItAjwroRw7w%3D",
  RESIZE_IMAGE_URL: VITE_RESIZE_IMG_URL,
  UPLOAD_URL: VITE_API_BASE_URL + "/FileUpload/GetPresignedUrls",
  AWS_BUCKET_NAME: VITE_AWS_BUCKET_NAME,
  AWS_BUCKET_URL: VITE_AWS_BUCKET_URL,
  AWS_REGION: VITE_AWS_REGION,
  ACLs: "enabled",
};

export default config;
