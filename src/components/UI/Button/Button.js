import React from 'react';

import styles from './Button.module.css';

const button = (props) => {
	// Dynamically adding .Danger and .Success classes based on props passed
	return (
		<button
			disabled={props.disabled}
			className={[styles.Button, styles[props.btnType]].join(' ')}
			onClick={props.clicked}
		>
			{props.children}
		</button>
	);
};

export default button;
