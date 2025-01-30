import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5)
}

export const createJWT = (user) => {
  const token = jwt.sign({
    id: user.id,
    username: user.username,
    role: user.role,
    image: user.image,
  },
    process.env.JWT_SECRET
  )
  return token
}

export const protect = (req, res, next) => {
  const bearer = req.cookies.token;

  if (!bearer) {
    return res.redirect('/auth/login');
  }

  try {
    const user = jwt.verify(bearer, process.env.JWT_SECRET)
    req.user = user
    console.log(req.user)
    next()
  } catch (e) {
    console.error(e)
    return res.redirect('/auth/login');
  }
}

export const checkLogin = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token)

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    console.log(req.user)
    next()
  } catch (e) {
    console.error(e)
    req.user = null;
    next()
  }
}

export const userCheck = (req, res, next) => {
  const bearer = req.cookies.token;

  if (!bearer) {
    return res.redirect('/auth/login');
  }

  try {
    const user = jwt.verify(bearer, process.env.JWT_SECRET)
    req.user = user
    console.log(req.user)
    next()
  } catch (e) {
    console.error(e)
    return res.redirect('/auth/login');
  }
}
