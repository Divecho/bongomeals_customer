import * as ActionTypes from './ActionTypes';

export const addToCart = (data) => ({
    type: ActionTypes.ADD_TO_CART,
    data: data
})

export const updateSubtotal = (data) => ({
    type: ActionTypes.UPDATE_SUBTOTAL,
    data: data
})

export const updatePromo = (data) => ({
    type: ActionTypes.UPDATE_PROMO,
    data: data
})

export const updateTotal = (data) => ({
    type: ActionTypes.UPDATE_TOTAL,
    data: data
})

export const updateDeliveryCharge = (data) => ({
    type: ActionTypes.UPDATE_DELIVERY_CHARGE,
    data: data
})

export const updateTaxList = (data) => ({
    type: ActionTypes.TAX_LIST,
    data: data
})

export const updateTax = (data) => ({
    type: ActionTypes.UPDATE_TAX,
    data: data
})

export const updateDiscount = (data) => ({
    type: ActionTypes.UPDATE_DISCOUNT,
    data: data
})

export const calculateTotal = () => ({
    type: ActionTypes.CALCULATE_TOTAL,
})

export const updateAddress = (data) => ({
    type: ActionTypes.UPDATE_ADDRESS,
    data: data
})

export const updateRestaurants = (data) => ({
    type: ActionTypes.UPDATE_RESTAURANTS,
    data: data
})

export const updatePaymentMode = (data) => ({
    type: ActionTypes.UPDATE_PAYMENT_MODE,
    data: data
})

export const updateRestaurantId = (data) => ({
    type: ActionTypes.UPDATE_RESTAURANT_ID,
    data: data
})

export const reset = () => ({
    type: ActionTypes.RESET,
})