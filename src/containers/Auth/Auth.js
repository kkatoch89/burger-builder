import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import styles from './Auth.module.css';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = (props) => {
	const [authForm, setAuthForm] = useState({
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'Email Address',
				errorText: 'email',
			},
			value: '',
			validation: {
				required: true,
				isEmail: true,
			},
			valid: false,
			touched: false,
		},
		password: {
			elementType: 'input',
			elementConfig: {
				type: 'password',
				placeholder: 'Password',
				errorText: 'password',
			},
			value: '',
			validation: {
				required: true,
				minLength: 6,
			},
			valid: false,
			touched: false,
		},
	});

	const [isSignup, setIsSignup] = useState(true);

	const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

	useEffect(() => {
		if (!buildingBurger && authRedirectPath !== '/') {
			onSetAuthRedirectPath();
		}
	}, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

	const inputChangedHandler = (e, controlName) => {
		const updatedControls = updateObject(authForm, {
			[controlName]: updateObject(authForm[controlName], {
				value: e.target.value,
				valid: checkValidity(e.target.value, authForm[controlName].validation),
				touched: true,
			}),
		});
		setAuthForm(updatedControls);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		props.onAuth(authForm.email.value, authForm.password.value, isSignup);
	};

	const switchAuthModeHandler = () => {
		setIsSignup(!isSignup);
	};

	const formElementsArray = [];
	for (let key in authForm) {
		formElementsArray.push({
			id: key,
			config: authForm[key],
		});
	}

	let form = formElementsArray.map((formElement) => {
		return (
			<Input
				key={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation} //To remove validation from dropdown
				touched={formElement.config.touched}
				changed={(e) => {
					inputChangedHandler(e, formElement.id);
				}}
			/>
		);
	});

	if (props.loading) {
		form = <Spinner />;
	}

	let errorMessage = null;

	if (props.error) {
		errorMessage = <p>{props.error}</p>;
	}

	let authRedirect = null;
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirectPath} />;
	}

	return (
		<div className={styles.Auth}>
			{authRedirect}
			{errorMessage}
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType="Success">SUBMIT</Button>
			</form>
			<Button btnType="Danger" clicked={switchAuthModeHandler}>
				SWITCH TO {isSignup ? 'SIGN-IN' : 'SIGN-UP'}
			</Button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignup) =>
			dispatch(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth));
