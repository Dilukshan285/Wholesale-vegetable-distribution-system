const validateForm = (formData) => {
  const errors = {};

  // Validate shipping address
  if (!formData.address.street) {
    errors.addressStreet = "Street is required.";
  }
  if (!formData.address.city) {
    errors.addressCity = "City is required.";
  }
  if (!formData.address.country) {
    errors.addressCountry = "Country is required.";
  } else if (formData.address.country.toLowerCase() !== "sri lanka") {
    errors.addressCountry = "This service is only available in Sri Lanka.";
  }
  if (!formData.address.postalCode) {
    errors.addressPostalCode = "Postal Code is required.";
  } else if (!/^\d{5}$/.test(formData.address.postalCode)) {
    errors.addressPostalCode = "Postal Code must be a 5-digit number.";
  }
  if (!formData.address.phone) {
    errors.addressPhone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(formData.address.phone)) {
    errors.addressPhone = "Phone number must be 10 digits.";
  }

  // Validate billing address if it's different from shipping address
  if (formData.billingAddressOption === "different") {
    if (!formData.billingAddress.street) {
      errors.billingAddressStreet = "Billing street is required.";
    }
    if (!formData.billingAddress.city) {
      errors.billingAddressCity = "Billing city is required.";
    }
    if (!formData.billingAddress.country) {
      errors.billingAddressCountry = "Billing country is required.";
    } else if (formData.billingAddress.country.toLowerCase() !== "sri lanka") {
      errors.billingAddressCountry =
        "This service is only available in Sri Lanka.";
    }
    if (!formData.billingAddress.postalCode) {
      errors.billingAddressPostalCode = "Billing postal code is required.";
    } else if (!/^\d{5}$/.test(formData.billingAddress.postalCode)) {
      errors.billingAddressPostalCode =
        "Billing postal code must be a 5-digit number.";
    }
    if (!formData.billingAddress.phone) {
      errors.billingAddressPhone = "Billing phone number is required.";
    } else if (!/^\d{10}$/.test(formData.billingAddress.phone)) {
      errors.billingAddressPhone = "Billing phone number must be 10 digits.";
    }
  }

  return errors;
};

export default validateForm;
