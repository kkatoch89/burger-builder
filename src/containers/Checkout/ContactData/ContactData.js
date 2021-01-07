import React, { Component } from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import styles from './ContactData.module.css';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../components/hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name',
					errorText: 'name',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street',
					errorText: 'street',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			postalCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Postal Code',
					errorText: 'postal code',
				},
				value: '',
				validation: {
					required: true,
					minLength: 6,
					maxLength: 6,
				},
				valid: false,
				touched: false,
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country',
					errorText: 'country',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your E-Mail',
					errorText: 'email',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' },
					],
				},
				validation: {},
				valid: true,
				value: 'fastest',
			},
		},
		formIsValid: false,
	};

	orderHandler = (e) => {
		e.preventDefault();
		const formData = {};
		for (let formElementID in this.state.orderForm) {
			formData[formElementID] = this.state.orderForm[formElementID].value;
		}
		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData,
			userId: this.props.userId,
		};
		this.props.onOrderBurger(order, this.props.token);
	};

	inputChangedHandler = (e, inputId) => {
		// Only need to create a deep copy until the level that you are changing value
		const updatedFormElement = updateObject(this.state.orderForm[inputId], {
			value: e.target.value,
			valid: checkValidity(
				e.target.value,
				this.state.orderForm[inputId].validation
			),
			touched: true,
		});

		const updatedOrderForm = updateObject(this.state.orderForm, {
			[inputId]: updatedFormElement,
		});

		let formIsValid = true;

		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid; // To check if prev value of formIsValid is also true
		}

		this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
	};

	render() {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key],
			});
		}
		let form = (
			<form onSubmit={(e) => this.orderHandler(e)}>
				{formElementsArray.map((formElement) => {
					return (
						<Input
							key={formElement.id}
							elementType={formElement.config.elementType}
							elementConfig={formElement.config.elementConfig}
							// valueType={formElement.config.elementConfig}
							value={formElement.config.value}
							invalid={!formElement.config.valid}
							shouldValidate={formElement.config.validation} //To remove validation from dropdown
							touched={formElement.config.touched}
							changed={(e) => {
								this.inputChangedHandler(e, formElement.id);
							}}
						/>
					);
				})}
				<Button btnType="Success" disabled={!this.state.formIsValid}>
					ORDER
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}
		return (
			<div className={styles.ContactData}>
				<h4>Enter your Contact Data:</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(actions.purchaseBurger(orderData, token)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios));
