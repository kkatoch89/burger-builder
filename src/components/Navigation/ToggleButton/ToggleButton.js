import React from 'react';

import styles from './ToggleButton.module.css';

const toggleButton = (props) => {
	return (
		<div className={styles.DrawerToggle} onClick={props.toggleOpen}>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

export default toggleButton;
