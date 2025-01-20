import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", `${catalogData.CATALOGPAGEDATA_API}/${categoryId}`, null);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Catagory page data.");
    }
    return response?.data;
  } catch (error) {
    console.error("CATALOGPAGEDATA_API API ERROR............", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
}
