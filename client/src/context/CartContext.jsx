import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
	return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = (item) => {
		// Implement your logic to add items to the cart
		setCartItems([...cartItems, item]);
	};

	const removeFromCart = (item) => {
		const updatedCart = cartItems.filter((cartItem) => {
			return cartItem.id !== item.id;
		});

		setCartItems(updatedCart);
	};

	//update cart item quantity
	const updateCartItemQuantity = (item, quantity) => {
		if (quantity === 0) {
			removeFromCart(item);
			return;
		}

		item.quantity = quantity;

		//find and replace the item in the cart
		const updatedCart = cartItems.map((cartItem) => {
			if (cartItem.id === item.id) {
				return item;
			}
			return cartItem;
		});

		setCartItems(updatedCart);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				updateCartItemQuantity,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
