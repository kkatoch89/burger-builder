import React, { useState } from 'react';
import { connect } from 'react-redux';

import styles from './Layout.module.css';
import Toolbar from '../../Navigation/Toolbar/Toolbar';
import SideDrawer from '../../Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	};

	const sideDrawerToggleHandler = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	return (
		<>
			<Toolbar open={sideDrawerToggleHandler} isAuth={props.isAuthenticated} />
			<SideDrawer
				closed={sideDrawerClosedHandler}
				open={sideDrawerIsVisible}
				isAuth={props.isAuthenticated}
			/>
			<main className={styles.Content}>{props.children}</main>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

export default connect(mapStateToProps)(Layout);
