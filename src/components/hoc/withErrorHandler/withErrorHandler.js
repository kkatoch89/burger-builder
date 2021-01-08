import React, { setState, useEffect, useState } from 'react';

import Modal from '../../UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
	return (props) => {
		const [error, setError] = useState(null);

		useEffect(() => {});

		// Resetting the state whenever doing an axios call
		const reqInterceptor = axios.interceptors.request.use((req) => {
			setError(null);
			// When sending a request, we must return a request so that the req can continue
			return req;
		});
		// We're not interested in the first argument so we pass null here
		// error is an object in firebase that contains error property and message
		const resInterceptor = axios.interceptors.response.use(
			// Returning a response here and then taking the error to set state
			// Not 100% sure why it was done this way
			(res) => res,
			(err) => {
				setError(err);
			}
		);

		// This is done so that interceptors that have run on previous wrapped components
		// are shut down, this is done to prevent memory leak
		useEffect(() => {
			return () => {
				axios.interceptors.request.eject(reqInterceptor);
				axios.interceptors.request.eject(resInterceptor);
			};
		}, [reqInterceptor, resInterceptor, props]);

		// User can click on backdrop and exit the error message modal
		const errorConfirmedHandler = () => {
			setError(null);
		};

		return (
			<>
				<Modal show={error} modalClosed={errorConfirmedHandler}>
					{/* Without turnary, if only had {this.state.error.message} it would always 
						have an error message regardless of whether modal is shown or not */}
					{error ? error.message : null}
				</Modal>
				<WrappedComponent {...props} />
			</>
		);
	};
};

export default withErrorHandler;
