import React, {createContext, useContext, useState, useEffect} from "react";
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const alreadyInCart = cartItems.find(item => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQty) => prevTotalQty + quantity);

        if (alreadyInCart) {
            const updatedCartItems = cartItems.map((cartItem) => {
                if (cartItem._id === product._id) {
                    return {...cartItem, quantity: cartItem.quantity + quantity};
                }
            });

            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;

            setCartItems([ ...cartItems, { ...product } ]);
        }

        toast.success(`${qty} ${product.name} added to cart!`);
        setQty(1);
    }

    const onRemove = (product) => {
        const newCartItems = cartItems.filter((item) => item._id !== product._id);
        setCartItems([ ...newCartItems ]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price * product.quantity);
        setTotalQuantities((prevTotalQty) => prevTotalQty - product.quantity);
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find(item => item._id === id);
        index = cartItems.findIndex(item => item._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id);

        if (value === 'inc') {
            setCartItems([ ...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQty) => prevTotalQty + 1);
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([ ...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQty) => prevTotalQty - 1);
            } else {
                setCartItems([ ...newCartItems ]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQty) => prevTotalQty - 1);
            }
        }
    }

    const increaseQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    const decreaseQty = () => {
        setQty((prevQty) => {
            if (prevQty === 1) return 1;

            return prevQty - 1;
        });
    }

    return (
        <Context.Provider
            value={{ 
                showCart,
                setShowCart,
                cartItems,
                setCartItems,
                totalPrice,
                setTotalPrice,
                totalQuantities,
                setTotalQuantities,
                qty,
                increaseQty,
                decreaseQty,
                onAdd,
                onRemove,
                toggleCartItemQuantity
            }}
        >
            {children}
        </Context.Provider>
    );
}

export const useStateContext = () => useContext(Context);
