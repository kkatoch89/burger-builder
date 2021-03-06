import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false,
	building: false,
};

const INGREDIENT_PRICES = {
	lettuce: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.6,
};

// Refactoring
const addIngredient = (state, action) => {
	const updatedIngredient = {
		[action.ingredientName]: state.ingredients[action.ingredientName] + 1,
	};
	const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
	const updatedState = {
		ingredients: updatedIngredients,
		totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
		building: true,
	};
	return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
	const updatedIng = {
		[action.ingredientName]: state.ingredients[action.ingredientName] - 1,
	};
	const updatedIngs = updateObject(state.ingredients, updatedIng);
	const updatedPrice =
		state.totalPrice - INGREDIENT_PRICES[action.ingredientName];
	const updatedSt = {
		ingredients: updatedIngs,
		totalPrice: updatedPrice,
		building: updatedPrice > 4,
	};
	return updateObject(state, updatedSt);
};

const setIngredients = (state, action) => {
	return updateObject(state, {
		ingredients: action.ingredients,
		totalPrice: 4,
		error: false, //in case we had an error earlier and we need to reset this specific state
	});
};

const fetchIngredientsFailed = (state, action) => {
	return updateObject(state, { error: true });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT:
			return addIngredient(state, action);
		case actionTypes.REMOVE_INGREDIENT:
			return removeIngredient(state, action);
		case actionTypes.SET_INGREDIENTS:
			return setIngredients(state, action);
		case actionTypes.FETCH_INGREDIENTS_FAILED:
			return fetchIngredientsFailed(state, action);
		default:
			return state;
	}
};

export default reducer;
