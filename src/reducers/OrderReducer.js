import * as Actions from '../actions/ActionTypes'
const ProductReducer = (state = { restaurant_id:undefined,payment_mode:undefined, restaurants:[], address:undefined, discount:0, tax:0, tax_list:[], cart_count:undefined, cart_items:[], sub_total:0, promo:undefined, total:0, delivery_charge:0 }, action) => {
    switch (action.type) {
        case Actions.ADD_TO_CART:
            return Object.assign({}, state, {
               cart_items: action.data,
               cart_count : Object.keys(action.data).length
            });
        case Actions.UPDATE_SUBTOTAL:
            return Object.assign({}, state, {
               sub_total: action.data
            });
        case Actions.UPDATE_PROMO:
            return Object.assign({}, state, {
               promo: action.data
            });
        case Actions.UPDATE_TOTAL:
            return Object.assign({}, state, {
               total: action.data
            });
        case Actions.UPDATE_DELIVERY_CHARGE:
            return Object.assign({}, state, {
               delivery_charge: action.data
            });
        case Actions.TAX_LIST:
            return Object.assign({}, state, {
               tax_list: action.data
            });
        case Actions.UPDATE_TAX:
            return Object.assign({}, state, {
               tax: action.data
            });
        case Actions.UPDATE_DISCOUNT:
            return Object.assign({}, state, {
               discount: action.data
            });
        case Actions.UPDATE_ADDRESS:
            return Object.assign({}, state, {
               address: action.data
            });
        case Actions.UPDATE_RESTAURANTS:
            return Object.assign({}, state, {
               restaurants: action.data
            });
        case Actions.UPDATE_PAYMENT_MODE:
            return Object.assign({}, state, {
               payment_mode: action.data
            });
        case Actions.UPDATE_RESTAURANT_ID:
            return Object.assign({}, state, {
               restaurant_id: action.data
            });
        case Actions.RESET:
            return Object.assign({}, state, {
               restaurant_id: undefined,
               payment_mode:undefined, 
               discount:0, 
               tax:0, 
               cart_count:undefined, 
               cart_items:[], 
               sub_total:0, 
               promo:undefined, 
               total:0, 
               delivery_charge:0
            });
        case Actions.CALCULATE_TOTAL:
            let promo = state.promo;
            if(!promo){
              let net_total = parseFloat(state.sub_total) + parseFloat(state.delivery_charge);
              let tax = calculate_taxes(state.sub_total,state.tax_list);
              let total = parseFloat(net_total + tax);
              return Object.assign({}, state, {
                 tax: tax.toFixed(), total : total
              });
            }else{
              if(promo.promo_type == 1){
                let subtotal_with_discount = parseFloat(state.sub_total - promo.discount);
                let net_total = parseFloat(subtotal_with_discount) + parseFloat(state.delivery_charge);
                let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                let total = net_total + tax;
                if(total >= 0){
                  return Object.assign({}, state, {
                     tax: tax.toFixed(), total : total, sub_total:state.sub_total, discount:promo.discount
                  });
                }else{
                  alert('Sorry this promo is not valid!')
                }
              }else{
                let discount = (promo.discount /100) * state.sub_total;
                if(discount > promo.max_discount_value){
                  discount = promo.max_discount_value;
                }
                let subtotal_with_discount =  parseFloat(state.sub_total - discount);
                let net_total = parseFloat(subtotal_with_discount) + parseFloat(state.delivery_charge);
                let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                let total = parseFloat(net_total + tax);
                if(total >= 0){
                  return Object.assign({}, state, {
                     tax: tax.toFixed(), total : total, sub_total:state.sub_total, discount:discount
                  });
                }else{
                  alert('Sorry this promo is not valid!')
                }
              }
            }

        default:
            return state;
    }
}

const calculate_taxes = (net_total,tax_list) =>{
  let tax = 0;
  if(tax_list.count == 0){
    return tax;
  }else{
    tax_list.forEach(function(value) {
        let percentage = (net_total /100) * parseFloat(value.percentage);
        tax = tax + percentage;
    });
    return tax;
  }
}

export default ProductReducer;

