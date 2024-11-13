import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import validateForm from "../../Validation/orderForm_validate"; // Adjust the path as necessary

const OrderForm = () => {
  const { id } = useParams();
  const { food_list, cartItems } = useContext(StoreContext);
  const product = food_list.find((item) => item._id === id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "", // Assume a logged-in user
    address: {
      country: "",
      street: "",
      city: "",
      postalCode: "",
      phone: "",
    },
    billingAddress: {
      country: "",
      street: "",
      city: "",
      postalCode: "",
      phone: "",
    },
    billingAddressOption: "same",
  });

  const [isSameAsShipping, setIsSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});

  // Handle input changes and validate specific field
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split(".");

    // Restrict phone numbers to numeric input and 10 digits
    if (name === "address.phone" || name === "billingAddress.phone") {
      const numericValue = value.replace(/\D/g, ""); // Only allow digits
      if (numericValue.length > 10) {
        return; // Stop further input if length exceeds 10 digits
      }
      // Update phone number
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: numericValue },
      }));
    }

    // Restrict postal codes to numeric input and 5 digits
    else if (
      name === "address.postalCode" ||
      name === "billingAddress.postalCode"
    ) {
      const numericValue = value.replace(/\D/g, ""); // Only allow digits
      if (numericValue.length > 5) {
        return; // Stop further input if length exceeds 5 digits
      }
      // Update postal code
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: numericValue },
      }));
    }

    // Update formData for other fields
    else {
      setFormData((prev) => ({
        ...prev,
        [field]: subfield ? { ...prev[field], [subfield]: value } : value,
      }));
    }

    // Create a temporary object for validation of the current field
    const tempFormData = {
      ...formData,
      [field]: subfield ? { ...formData[field], [subfield]: value } : value,
    };

    // Validate and update errors for the current field
    const validationErrors = validateForm(tempFormData);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const errorKey = subfield
        ? `${field}${subfield.charAt(0).toUpperCase() + subfield.slice(1)}`
        : name;

      // Add or remove error message for the specific field
      if (validationErrors[errorKey]) {
        newErrors[errorKey] = validationErrors[errorKey];
      } else {
        delete newErrors[errorKey];
      }

      return newErrors;
    });
  };

  // Handle toggling between shipping and billing address
  const handleBillingAddressToggle = (e) => {
    setIsSameAsShipping(e.target.value === "same");
  };

  // Sync billing address with shipping address when "Same as Shipping" is selected
  useEffect(() => {
    if (isSameAsShipping) {
      setFormData((prev) => ({
        ...prev,
        billingAddress: { ...prev.address }, // Copy address
      }));
    }
  }, [isSameAsShipping, formData.address]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Prevent submission if there are errors
    }

    const orderData = {
      userId: formData.userId,
      items: [
        {
          id: product._id,
          name: product.name,
          qty: cartItems[id],
          price: product.price,
          image: product.image,
        },
      ],
      amount: product.price * cartItems[id] + 250,
      address: formData.address,
      billingAddress: formData.billingAddress,
      payment: false,
    };

    try {
      navigate("/payment", { state: orderData });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Side: Shipping and Billing Address */}
          <div className="space-y-8">
            {/* Shipping Address Section */}
            <section>
              <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                Shipping Address
              </h3>
              <div className="space-y-6">
                {["street", "city", "country", "postalCode", "phone"].map(
                  (field) => (
                    <div key={field} className="relative">
                      <input
                        name={`address.${field}`}
                        placeholder=" "
                        onChange={handleChange}
                        value={formData.address[field]}
                        className={`block w-full px-3 py-2 pt-5 border rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 peer transition-all duration-300 ${
                          errors[
                            `address${
                              field.charAt(0).toUpperCase() + field.slice(1)
                            }`
                          ]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      <label
                        htmlFor={`address.${field}`}
                        className="absolute left-3 top-3 text-gray-500 transition-all transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      {errors[
                        `address${
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }`
                      ] && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors[
                              `address${
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }`
                            ]
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Billing Address Section */}
            <section>
              <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                Billing Address
              </h3>
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="same"
                    checked={isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2 accent-green-500"
                  />
                  <label className="text-gray-600">
                    Same as shipping address
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="different"
                    checked={!isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2 accent-green-500"
                  />
                  <label className="text-gray-600">
                    Use a different billing address
                  </label>
                </div>

                {!isSameAsShipping &&
                  ["street", "city", "country", "postalCode", "phone"].map(
                    (field) => (
                      <div key={field} className="relative">
                        <input
                          name={`billingAddress.${field}`}
                          placeholder=" "
                          onChange={handleChange}
                          value={formData.billingAddress[field]}
                          className={`block w-full px-3 py-2 pt-5 border rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 peer transition-all duration-300 ${
                            errors[
                              `billingAddress${
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }`
                            ]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        <label
                          htmlFor={`billingAddress.${field}`}
                          className="absolute left-3 top-3 text-gray-500 transition-all transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        {errors[
                          `billingAddress${
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }`
                        ] && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors[
                                `billingAddress${
                                  field.charAt(0).toUpperCase() + field.slice(1)
                                }`
                              ]
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
              </div>
            </section>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700"
            >
              Next
            </button>
          </div>

          {/* Right Side: Order Summary */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {/* Display product image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 bg-gray-200 rounded"
                />
                <div className="flex-1">
                  {/* Display product name */}
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{cartItems[id]} Kg</p>
                </div>
                {/* Display product price */}
                <p className="font-semibold">Rs {product.price}.00</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Sub total</span>
                <span>Rs {product.price * cartItems[id]}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs 250.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs {product.price * cartItems[id] + 250}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
