const passMessageToView = (req, res, next) => {
  res.locals.message = req.session.message
  res.locals.someValue = 'whats happening'
  req.session.message = null
  next()
}

export default passMessageToView