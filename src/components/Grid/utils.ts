export const parsePostItems = (postItemsString: any) => {
  if (!postItemsString) return [];
  try {
    const parsedData = JSON.parse(postItemsString);
    return parsedData;
  } catch (error) {
    console.error("Error parsing postItemsString:", error);
    return [];
  }
};
