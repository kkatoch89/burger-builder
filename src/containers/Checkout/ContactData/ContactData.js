import React, { useState } from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import styles from './ContactData.module.css';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../components/hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

const ContactData = (props) => {
	const [orderForm, setOrderForm] = useState({
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
	});

	const [formIsValid, setFormIsValid] = useState(false);

	const orderHandler = (e) => {
		e.preventDefault();
		const formData = {};
		for (let formElementID in orderForm) {
			formData[formElementID] = orderForm[formElementID].value;
		}
		const order = {
			ingredients: props.ings,
			price: props.price,
			formData,
			userId: props.userId,
		};
		props.onOrderBurger(order, props.token);
	};

	const inputChangedHandler = (e, inputId) => {
		// Only need to create a deep copy until the level that you are changing value
		const updatedFormElement = updateObject(orderForm[inputId], {
			value: e.target.value,
			valid: checkValidity(e.target.value, orderForm[inputId].validation),
			touched: true,
		});

		const updatedOrderForm = updateObject(orderForm, {
			[inputId]: updatedFormElement,
		});

		let formIsValid = true;

		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid; // To check if prev value of formIsValid is also true
		}
		setOrderForm(updatedOrderForm);
		setFormIsValid(formIsValid);
	};

	const formElementsArray = [];
	for (let key in orderForm) {
		formElementsArray.push({
			id: key,
			config: orderForm[key],
		});
	}
	let form = (
		<form onSubmit={(e) => orderHandler(e)}>
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
							inputChangedHandler(e, formElement.id);
						}}
					/>
				);
			})}
			<Button btnType="Success" disabled={!formIsValid}>
				ORDER
			</Button>
		</form>
	);
	if (props.loading) {
		form = <Spinner />;
	}
	return (
		<div className={styles.ContactData}>
			<h4>Enter your Contact Data:</h4>
			{form}
		</div>
	);
};

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
