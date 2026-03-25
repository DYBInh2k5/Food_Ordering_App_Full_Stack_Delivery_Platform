const User = require('../models/User');
const Customer = require('../models/Customer');
const Address = require('../models/Address');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Get customer profile
// @route   GET /api/v1/customers/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);
  const customer = await Customer.findOne({ userId: req.userId });

  if (!user || !customer) {
    return next(new AppError('Customer not found', 404, 'NOT_FOUND'));
  }

  res.status(200).json({
    success: true,
    data: {
      id: customer._id,
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      totalOrders: customer.totalOrders,
      ratingAverage: customer.ratingAverage,
      defaultAddressId: customer.defaultAddressId
    }
  });
});

// @desc    Update customer profile
// @route   PUT /api/v1/customers/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { fullName, phoneNumber, profileImage } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { fullName, phoneNumber, profileImage },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage
    }
  });
});

// @desc    Get customer addresses
// @route   GET /api/v1/customers/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const addresses = await Address.find({ userId: req.userId })
    .sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: addresses
  });
});

// @desc    Add address
// @route   POST /api/v1/customers/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  const { streetAddress, city, district, ward, postalCode, latitude, longitude, addressType, isDefault } = req.body;

  // If setting as default, unset other defaults
  if (isDefault) {
    await Address.updateMany({ userId: req.userId }, { isDefault: false });
  }

  const address = await Address.create({
    userId: req.userId,
    streetAddress,
    city,
    district,
    ward,
    postalCode,
    latitude,
    longitude,
    addressType,
    isDefault: isDefault || false
  });

  // Update customer default address if first or set as default
  if (isDefault || (await Address.countDocuments({ userId: req.userId })) === 1) {
    await Customer.updateOne({ userId: req.userId }, { defaultAddressId: address._id });
  }

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: address
  });
});

// @desc    Update address
// @route   PUT /api/v1/customers/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res, next) => {
  let address = await Address.findById(req.params.id);

  if (!address) {
    return next(new AppError('Address not found', 404, 'NOT_FOUND'));
  }

  if (address.userId.toString() !== req.userId) {
    return next(new AppError('Not authorized', 403, 'FORBIDDEN'));
  }

  // If setting as default, unset others
  if (req.body.isDefault) {
    await Address.updateMany({ userId: req.userId }, { isDefault: false });
    await Customer.updateOne({ userId: req.userId }, { defaultAddressId: req.params.id });
  }

  address = await Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: address
  });
});

// @desc    Delete address
// @route   DELETE /api/v1/customers/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(new AppError('Address not found', 404, 'NOT_FOUND'));
  }

  if (address.userId.toString() !== req.userId) {
    return next(new AppError('Not authorized', 403, 'FORBIDDEN'));
  }

  await Address.findByIdAndDelete(req.params.id);

  // If deleted default, set new default
  if (address.isDefault) {
    const newDefault = await Address.findOne({ userId: req.userId }).sort('-createdAt');
    if (newDefault) {
      await Customer.updateOne(
        { userId: req.userId },
        { defaultAddressId: newDefault._id }
      );
    }
  }

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
});
