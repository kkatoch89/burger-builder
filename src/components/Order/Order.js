import React from 'react';

import styles from './Order.module.css';

const order = (props) => {
	console.log(props.ingredients);
	const ingredients = [];

	for (let ingredientName in props.ingredients) {
		ingredients.push({
			name: ingredientName,
			amount: props.ingredients[ingredientName],
		});
	}

	const ingredientOutput = ingredients.map((ig) => {
		return (
			<span
				key={ig.name}
				style={{
					textTransform: 'uppercase',
					display: 'inline-block',
					margin: '0 8px',
					border: '1px solid #ccc',
					padding: '5px 7px',
				}}
			>
				{ig.name} ({ig.amount})
			</span>
		);
	});

	return (
		<div className={styles.Order}>
			<p>Ingredients: {ingredientOutput}</p>
			<p>
				Price: <strong>CAD {props.price.toFixed(2)}</strong>
			</p>
		</div>
	);
};

export default order;
