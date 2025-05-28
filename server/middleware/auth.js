module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === 'Bearer admin-token') return next();
  res.status(401).json({ error: 'Unauthorized' });
}; 