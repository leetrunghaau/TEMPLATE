function responseHandler(req, res, next) {
  res.ok = (data = {}, meta = null,  message = 'Succeed') => {
    let statusCode = 200;

    switch (req.method) {
      case 'POST':
        statusCode = 201;
        break;
      case 'DELETE':
        // statusCode = 204;
        statusCode = 202;
        break;
      default:
        statusCode = 200;
    }

    if (statusCode === 204) {
      return res.sendStatus(204);
    }

    const response = {
      success: true,
      message,
      data,
      ...(meta || {})
    };

    return res.status(statusCode).json(response);
  };
  next();
};