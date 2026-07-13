export const logRequestMethod = (req, res, next) => {
  const method = req.method
  const path = req.path

  if (path.startsWith('/teachers/')) {
    console.log(`Teacher route request method: ${method}`)
  }

  next()
}
