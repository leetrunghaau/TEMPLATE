const responseEnhancer = (req, res, next) => {
  res.ok = (data, pagination, message = 'Success') => {
    res.json({ success: true, message, data, pagination });
  };
  next();
};

module.exports = responseEnhancer;