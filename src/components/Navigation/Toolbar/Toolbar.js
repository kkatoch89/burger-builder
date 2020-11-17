import React from 'react';

import styles from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import ToggleButton from '../ToggleButton/ToggleButton';

const toolbar = (props) => (
	<header className={styles.Toolbar}>
		<ToggleButton toggleOpen={props.open}>Menu</ToggleButton>
		<div className={styles.Logo}>
			<Logo />
		</div>
		<nav className={styles.DesktopOnly}>
			<NavigationItems />
		</nav>
	</header>
);

export default toolbar;
