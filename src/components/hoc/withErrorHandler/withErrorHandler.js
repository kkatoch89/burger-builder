import React from 'react';

import Modal from '../../UI/Modal/Modal';
import useHttpErrorHandler from '../../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
	return (props) => {
		const [error, clearError] = useHttpErrorHandler(axios);

		return (
			<>
				<Modal show={error} modalClosed={clearError}>
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
