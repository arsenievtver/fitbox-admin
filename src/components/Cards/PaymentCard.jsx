import React from 'react';
import './PaymentCard.css';

const PaymentCard = ({ quantity, pricePerUnit, totalPrice, duration }) => {
	return (
		<div className="payment-card">
			<div className="card-line bold">{quantity}</div>
			<div className="card-line">({pricePerUnit} за 1 трен)</div>
			<div className="card-line divider">{totalPrice}</div>
			<div className="card-line ">─────────</div>
			<div className="card-line">* {duration} мес.</div>
		</div>
	);
};

export default PaymentCard;
