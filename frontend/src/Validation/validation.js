export const validateName = (name) => {
  if (!name) {
      return 'Name is required.';
  }
  if (name.length < 2) {
      return 'Name must be at least 2 characters long.';
  }
  if (!/^[\p{L}\p{Emoji}\s]+$/u.test(name)) {
      return 'Name can only contain letters, emojis, and spaces.';
  }
  return '';
};

export const validateDescription = (description) => {
  if (!description) {
      return 'Description is required.';
  }
  if (description.length < 10) {
      return 'Description must be at least 10 characters long.';
  }
  if (!/^[\p{L}\p{Emoji}\s,-.]+$/u.test(description)) {
      return 'Description can only contain letters, and spaces.';
  }
  return '';
};

export const validatePrice = (price) => {
  if (!price) {
      return 'Price is required.';
  }
  const priceValue = parseFloat(price);
  if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      return 'Price must be a number with up to two decimal places.';
  }
  if (priceValue <= 0) {
      return 'Price must be greater than zero.';
  }
  if (priceValue > 999999.99) {
      return 'Price cannot exceed 999999.99.';
  }
  return '';
};

export const validateQuantity = (quantity) => {
  if (!quantity) {
      return 'Quantity is required.';
  }
  const quantityValue = parseInt(quantity, 10);
  if (!/^\d+$/.test(quantity)) {
      return 'Quantity must be a positive integer.';
  }
  if (quantityValue <= 0) {
      return 'Quantity must be greater than zero.';
  }
  if (quantityValue > 9999) {
      return 'Quantity cannot exceed 9999.';
  }
  return '';
};

export const validateExpDate = (expDate) => {
  if (!expDate) {
      return 'Expiration date is required.';
  }
  const today = new Date().toISOString().split('T')[0];
  const futureLimit = new Date();
  futureLimit.setFullYear(futureLimit.getFullYear() + 50); // limit expiration date to 50 years from now
  if (expDate < today) {
      return 'Expiration date must be today or a future date.';
  }
  if (new Date(expDate) > futureLimit) {
      return 'Expiration date cannot be more than 50 years in the future.';
  }
  return '';
};

export const validateDiscount = (discount) => {
  if (!discount) {
      return 'Discount is required.';
  }
  const discountValue = parseFloat(discount);
  if (!/^\d+(\.\d{1,2})?$/.test(discount)) {
      return 'Discount must be a number with up to two decimal places.';
  }
  if (discountValue < 0) {
      return 'Discount must be a positive number.';
  }
  if (discountValue > 100) {
      return 'Discount cannot exceed 100%.';
  }
  return '';
};

export const validateFile = (file) => {
  if (!file) {
      return 'Image file is required.';
  }
  const allowedExtensions = /\.(jpg|jpeg|png)$/i;
  const maxSizeInMB = 5;
  if (!allowedExtensions.test(file.name)) {
      return 'Only JPG and PNG files are allowed.';
  }
  if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size cannot exceed ${maxSizeInMB} MB.`;
  }
  return '';
};
