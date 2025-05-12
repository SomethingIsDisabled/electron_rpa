export const $fetch = async (fullUrl: string, options?:any) => {
  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json() as Promise<any>
  } catch (error: any) {
    throw new Error(`Request failed: ${error.message}`);
  }
}