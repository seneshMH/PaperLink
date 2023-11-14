import React, { useEffect } from "react";

import { CreateCheckoutSession } from "../../../apiCalls/product.order";
import { useMessage } from "../../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loaderSlice";

import { useCart } from "../../../context/CartContext";

function Checkout() {
    const { cartItems } = useCart();

    const message = useMessage();
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));

            if (cartItems.length === 0) {
                throw new Error("No items in the cart");
            }

            const items = [];
            cartItems.map((item) =>
                items.push({
                    product: item.product._id,
                    quantity: item.quantity,
                })
            );

            const response = await CreateCheckoutSession({ items: items });

            if (response.success) {
                //navigate(response.data.url);
                window.location = response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
}

export default Checkout;
