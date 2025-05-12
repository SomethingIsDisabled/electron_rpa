// @ts-nocheck
const $fetch = async (fullUrl, options) => {
  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json()
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

module.exports = {
  $fetch,
};