import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START,
	};
};

export const authSuccess = (idToken, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken,
		userId,
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error,
	};
};

export const logout = () => {
	localStorage.removeItem('token'); // remove from local storage
	localStorage.removeItem('expirationDate');
	localStorage.removeItem('userId');
	return {
		type: actionTypes.AUTH_LOGOUT,
	};
};

export const checkAuthTimeout = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout());
		}, expirationTime * 1000);
	};
};

export const auth = (email, password, isSignup) => {
	return (dispatch) => {
		dispatch(authStart());
		const authData = {
			email,
			password,
			returnSecureToken: true,
		};
		let url =
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCp8MdDOFsnSe0npBrpOFVJ2BYbBzvgJ-M';
		if (!isSignup) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCp8MdDOFsnSe0npBrpOFVJ2BYbBzvgJ-M';
		}
		axios
			.post(url, authData)
			.then((response) => {
				console.log(response);
				const expirationDate = new Date(
					new Date().getTime() + response.data.expiresIn * 1000
				);
				localStorage.setItem('token', response.data.idToken);
				localStorage.setItem('expirationDate', expirationDate);
				localStorage.setItem('userId', response.data.localId);
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn));
			})
			.catch((err) => {
				const error = err.response.data.error.message;
				// console.log(err.response.data.error.message);
				dispatch(authFail(error));
			});
	};
};

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path,
	};
};

export const authCheckState = () => {
	return (dispatch) => {
		const token = localStorage.getItem('token');
		if (!token) {
			dispatch(logout());
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate')); // what we receive from local storage will be a string but new Date() will convert to date object
			if (expirationDate <= new Date()) {
				dispatch(logout());
			} else {
				// automatically logs user in since we have a valid (not expired token)
				const userId = localStorage.getItem('userId');
				dispatch(authSuccess(token, userId));
				dispatch(
					checkAuthTimeout(
						(expirationDate.getTime() - new Date().getTime()) / 1000
					)
				);
			}
		}
	};
};
