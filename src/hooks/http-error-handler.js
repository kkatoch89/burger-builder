import { useState, useEffect } from 'react';

export default (httpClient) => {
	const [error, setError] = useState(null);

	// Resetting the state whenever doing an httpClient call
	const reqInterceptor = httpClient.interceptors.request.use((req) => {
		setError(null);
		// When sending a request, we must return a request so that the req can continue
		return req;
	});
	// We're not interested in the first argument so we pass null here
	// error is an object in firebase that contains error property and message
	const resInterceptor = httpClient.interceptors.response.use(
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
			httpClient.interceptors.request.eject(reqInterceptor);
			httpClient.interceptors.request.eject(resInterceptor);
		};
	}, [reqInterceptor, resInterceptor, httpClient.interceptors.request]);

	// User can click on backdrop and exit the error message modal
	const errorConfirmedHandler = () => {
		setError(null);
	};

	return [error, errorConfirmedHandler]; // Returns an array of the error and a function to clear the error
};
