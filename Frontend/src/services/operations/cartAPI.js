import { apiConnector } from "../apiConnector";
import { cartEndPoints } from "../apis";

const { GET_CART_DETAILS, ADD_TO_CART, REMOVE_FROM_CART } = cartEndPoints;

export const getCartDetails = async (token) => {
    try {
        const response = await apiConnector('GET', GET_CART_DETAILS, null, {
            Authorization: `Bearer ${token}`
        });
        if (response.status == 200) {
            return response?.data?.courses;
        }
    } catch (error) {
        console.error(error);
    }
}

export const addCourseToCart = async (courseId, token) => {
    try {
        const response = await apiConnector('POST', `${ADD_TO_CART}/${courseId}`, null, {
            Authorization: `Bearer ${token}`
        });
        if (response.status == 200) {
            return response?.data?.course;
        }
    } catch (error) {
        console.error(error);
    }
}

export const removeCourseFromCart = async (courseId, token) => {
    try {
        const response = await apiConnector('PUT', `${REMOVE_FROM_CART}/${courseId}`, null, {
            Authorization: `Bearer ${token}`
        });
        if (response.status == 200) {
            return true;
        }
    } catch (error) {
        console.error(error);
    }
}