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
      username: user.username
    }, 
    process.env.JWT_SECRET
  )
  return token
}

export const protect = (req, res, next) => {

    const token = req.cookies.token;

  if (!token) {
    res.render('user')
    return
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    console.log(req.user)
    next()
  } catch (e) {
    console.error(e)
    res.render('user')
    return
    
  }
}