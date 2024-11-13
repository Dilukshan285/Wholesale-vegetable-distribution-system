import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:3001";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({}); // Changed to an object

  const addToCart = async (itemId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [String(itemId)]: (prev[String(itemId)] || 0) + quantity,
    }));

    try {
      const response = await axios.post(
        url + "/api/cart/add",
        { itemId, quantity },
        { headers: { token } }
      );
      console.log("API response for addToCart:", response.data);
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newQuantity = prev[itemId] - 1;
      if (newQuantity > 0) {
        return { ...prev, [itemId]: newQuantity };
      } else {
        const newCart = { ...prev };
        delete newCart[itemId]; // Remove item if quantity reaches 0
        return newCart;
      }
    });

    try {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // const fetchFoodList = async () => {
  //   try {
  //     const response = await axios.get(`${url}/api/food/list`);
  //     setFoodList(response.data.foods);
  //   } catch (error) {
  //     console.error("Error fetching food list:", error);
  //   }
  // };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      console.log("API Cart Data:", response.data);

      console.log("API Cart Data:", response.data); // Log entire response
      console.log("Cart Data Received:", response.data.cartData); // Log cartData
      setCartItems(response.data.cartData);

      // Log the cartItems after setting them
      console.log("Loaded cart items:", response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const tokenFromStorage = localStorage.getItem("token");
        if (tokenFromStorage) {
          setToken(tokenFromStorage);
          await loadCartData(tokenFromStorage);
        }
        // await fetchFoodList();
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    loadData();
  }, []);

  // Add sample data in case fetch fails
  useEffect(() => {
    if (food_list.length === 0) {
      // If food_list is still empty, use this sample data as fallback
      console.log("Adding sample data");
      setFoodList([
        {
          _id: "66f0e2114c4202ca997ecd45",
          name: "Big Onion",
          description: "Large onions perfect for various dishes",
          quantity: 200,
          price: 120,
          image: assets.BigOnion,
          discount: 10,
          category: "Onions",
          expDate: "2024-10-05T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2124c4202ca997ecd46",
          name: "Fresh Broccoli",
          description: "Organic broccoli with rich nutrients",
          quantity: 80,
          price: 350,
          image: assets.Broccoli,
          discount: 15,
          category: "Broccoli",
          expDate: "2024-10-12T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2134c4202ca997ecd47",
          name: "Green Cabbage",
          description: "Crisp and fresh green cabbage",
          quantity: 100,
          price: 250,
          image: assets.Cabbage,
          discount: 20,
          category: "Cabbage",
          expDate: "2024-10-20T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2144c4202ca997ecd48",
          name: "Organic Carrot",
          description: "Fresh carrots from organic farms",
          quantity: 150,
          price: 300,
          image: assets.Carrot,
          discount: 25,
          category: "Carrots",
          expDate: "2024-10-15T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2154c4202ca997ecd49",
          name: "Cauliflower Bunch",
          description: "Handpicked cauliflowers for your dishes",
          quantity: 60,
          price: 220,
          image: assets.Cauliflower,
          discount: 18,
          category: "Cauliflower",
          expDate: "2024-10-18T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2164c4202ca997ecd4a",
          name: "Crisp Celery",
          description: "Crunchy celery with a fresh taste",
          quantity: 75,
          price: 190,
          image: assets.Celery,
          discount: 12,
          category: "Celery",
          expDate: "2024-10-22T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2174c4202ca997ecd4b",
          name: "Crisp Cucumber",
          description: "Cool and refreshing cucumbers",
          quantity: 130,
          price: 150,
          image: assets.Cucumber,
          discount: 8,
          category: "Cucumber",
          expDate: "2024-10-25T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2184c4202ca997ecd4c",
          name: "Garlic Bunch",
          description: "Aromatic garlic for a flavorful kick",
          quantity: 200,
          price: 90,
          image: assets.Garlic,
          discount: 5,
          category: "Garlic",
          expDate: "2024-11-01T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2194c4202ca997ecd4d",
          name: "Fresh Knokhol",
          description: "Crunchy and nutritious knokhol",
          quantity: 50,
          price: 160,
          image: assets.Knokhol,
          discount: 20,
          category: "Knokhol",
          expDate: "2024-10-31T00:00:00.000+00:00",
        },
        {
          _id: "66f0e21a4c4202ca997ecd4e",
          name: "Fresh Leeks",
          description: "Green and fresh leeks for salads",
          quantity: 60,
          price: 180,
          image: assets.Leeks,
          discount: 12,
          category: "Leeks",
          expDate: "2024-11-10T00:00:00.000+00:00",
        },
        {
          _id: "66f0e21b4c4202ca997ecd4f",
          name: "Nelum Ala",
          description: "Healthy nelum ala for traditional dishes",
          quantity: 90,
          price: 300,
          image: assets.NelumAla,
          discount: 22,
          category: "Roots",
          expDate: "2024-11-15T00:00:00.000+00:00",
        },
        {
          _id: "66f0e21c4c4202ca997ecd50",
          name: "Fresh Potato",
          description: "Versatile and delicious potatoes",
          quantity: 250,
          price: 70,
          image: assets.Potato,
          discount: 5,
          category: "Potatoes",
          expDate: "2024-11-20T00:00:00.000+00:00",
        },
        {
          _id: "66f0e21d4c4202ca997ecd51",
          name: "Pumpkin Slice",
          description: "Rich and sweet pumpkin slices",
          quantity: 80,
          price: 200,
          image: assets.Pumpkin,
          discount: 18,
          category: "Pumpkin",
          expDate: "2024-11-25T00:00:00.000+00:00",
        },
        {
          _id: "66f0e21e4c4202ca997ecd52",
          name: "Rocket Leaves",
          description: "Fresh rocket leaves for salads",
          quantity: 40,
          price: 320,
          image: assets.RocketLeaves,
          discount: 10,
          category: "Salad Greens",
          expDate: "2024-11-30T00:00:00.000+00:00",
        },
        {
          _id: "66f0e21f4c4202ca997ecd53",
          name: "Salad Leaves",
          description: "Crisp and green salad leaves",
          quantity: 50,
          price: 280,
          image: assets.SaladLeaves,
          discount: 15,
          category: "Salad Greens",
          expDate: "2024-12-05T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2204c4202ca997ecd54",
          name: "Spring Onion",
          description: "Fresh spring onions for garnishing",
          quantity: 120,
          price: 140,
          image: assets.SpringOnion,
          discount: 10,
          category: "Onions",
          expDate: "2024-12-10T00:00:00.000+00:00",
        },
      ]);
    }
  }, [food_list]); // Only add sample data if `food_list` is empty

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
