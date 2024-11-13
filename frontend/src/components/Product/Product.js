import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const Product = ({ id, name, price, description, image, onClick}) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div className="food-item" onClick={onClick}>
      <div className="food-item-image-container">
        <img
          src={image}
          alt=""
          className="food-item-image"
        />

        {!cartItems[id] ? (
          <img
            className="add"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id, 2);
            }}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(id, 2);
              }}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={(e) => {
                e.stopPropagation();
                addToCart(id, 2);
              }}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price ">LKR   <span style={{ fontSize: '30px' }}> {price}.00</span> </p>
      </div>
    </div>
  );
};

export default Product;
