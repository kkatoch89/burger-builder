import React, { Component } from 'react';
import axios from '../../../axios-orders';

import styles from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
	state = {
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: '',
		},
		loading: false,
	};

	orderHandler = (e) => {
		e.preventDefault();
		console.log(this.props.ingredients);
		this.setState({ loading: true });
		const order = {
			ingredients: this.state.ingredients,
			price: this.props.price,
			customer: {
				name: 'Karan Katoch',
				address: {
					street: '123 Testing Street',
					postalCode: 'L1O 6B7',
					country: 'Canada',
				},
				email: 'test@test.com',
			},
			deliveryMethod: 'fastest',
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

	render() {
		let form = (
			<form action="">
				<input
					className={styles.Input}
					type="text"
					name="name"
					placeholder="Your Name"
				/>
				<input
					className={styles.Input}
					type="email"
					name="email"
					placeholder="Your Email"
				/>
				<input
					className={styles.Input}
					type="text"
					name="street"
					placeholder="Street"
				/>
				<input
					className={styles.Input}
					type="text"
					name="postal"
					placeholder="Postal Code"
				/>
				<Button btnType="Success" clicked={this.orderHandler}>
					ORDER
				</Button>
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
