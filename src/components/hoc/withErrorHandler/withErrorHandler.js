import React, { Component } from 'react';

import Modal from '../../UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		state = {
			error: null,
		};

		// Using UNSAFE_componentWillMount instead of componentWillMount, some weird clash with unresolved componentWillMount
		// in child components that I didn't quite fully get
		UNSAFE_componentWillMount() {
			// Resetting the state whenever doing an axios call
			this.reqInterceptor = axios.interceptors.request.use((req) => {
				this.setState({ error: null });
				// When sending a request, we must return a request so that the req can continue
				return req;
			});
			// We're not interested in the first argument so we pass null here
			// error is an object in firebase that contains error property and message
			this.resInterceptor = axios.interceptors.response.use(
				// Returning a response here and then taking the error to set state
				// Not 100% sure why it was done this way
				(res) => res,
				(error) => {
					this.setState({ error: error });
				}
			);
		}

		// This is done so that interceptors that have run on previous wrapped components
		// are shut down, this is done to prevent memory leak
		componentWillUnmount() {
			axios.interceptors.request.eject(this.reqInterceptor);
			axios.interceptors.request.eject(this.resInterceptor);
		}

		// User can click on backdrop and exit the error message modal
		errorConfirmedHandler = () => {
			this.setState({ error: null });
		};

		render() {
			return (
				<>
					<Modal
						show={this.state.error}
						modalClosed={this.errorConfirmedHandler}
					>
						{/* Without turnary, if only had {this.state.error.message} it would always 
						have an error message regardless of whether modal is shown or not */}
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</>
			);
		}
	};
};

export default withErrorHandler;
