import React from 'react';

import styles from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
	// Object.keys() creates an array of strings of keys.
	// Array(3) would create an array with 3 undefined spots.
	// reduce is used to flatten the array from an array of arrays filled with objects
	// to an array of objects
	let transformedIngredients = Object.keys(props.ingredients)
		.map((igKey) => {
			return [...Array(props.ingredients[igKey])].map((_, i) => {
				return <BurgerIngredient key={igKey + i} type={igKey} />;
			});
		})
		.reduce((arr, el) => {
			return arr.concat(el);
		}, []);

	if (transformedIngredients.length === 0) {
		transformedIngredients = <p>Please start adding ingredients!</p>;
	}

	return (
		<div className={styles.Burger}>
			<BurgerIngredient type="bread-top" />
			{transformedIngredients}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};

export default burger;
