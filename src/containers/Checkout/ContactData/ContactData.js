import React, { Component } from 'react';
import axios from '../../../axios-orders';

import styles from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name',
				},
				value: '',
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street',
				},
				value: '',
			},
			postalCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Postal Code',
				},
				value: '',
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country',
				},
				value: '',
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your E-Mail',
				},
				value: '',
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' },
					],
				},
				value: '',
			},
		},
		loading: false,
	};

	orderHandler = (e) => {
		e.preventDefault();
		// console.log(this.props.ingredients);
		this.setState({ loading: true });
		const formData = {};
		for (let formElementID in this.state.orderForm) {
			formData[formElementID] = this.state.orderForm[formElementID].value;
		}
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			orderData: formData,
		};
		axios
			.post('/orders.json', order)
			.then((response) => {
				this.setState({ loading: false, purchasing: false });
				this.props.history.push('/'); //Can only use this because we passed props in the anonymous func when render in Route
			})
			.catch((error) => {
				this.setState({ loading: false, purchasing: false });
			});
	};

	inputChangedHandler = (e, inputID) => {
		// Note that ...this.state.orderForm does not create a deep clone!!!
		// The nested objects would still be a reference to the original nester objects
		const updatedOrderForm = {
			...this.state.orderForm,
		};
		// Only need to create a deep copy until the level that you are changing value
		const updatedFormElement = { ...updatedOrderForm[inputID] };
		updatedFormElement.value = e.target.value;
		updatedOrderForm[inputID] = updatedFormElement;
		this.setState({ orderForm: updatedOrderForm });
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
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map((formElement) => {
					return (
						<Input
							key={formElement.id}
							elementType={formElement.config.elementType}
							elementConfig={formElement.config.elementConfig}
							value={formElement.config.value}
							changed={(e) => {
								this.inputChangedHandler(e, formElement.id);
							}}
						/>
					);
				})}
				<Button btnType="Success">ORDER</Button>
			</form>
		);
		if (this.state.loading) {
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

export default ContactData;
