const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../model/User')
const Log = require('../model/Log')
let index = 1

const createApiKey = (data) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
      data: data
    },
    'secret'
  )
  return token
}
const transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  secure: true
})
const requireApiKey = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ check: false, msg: 'Bạn chưa đăng nhập' })
  }
  const apiKey = req.headers.authorization.split(' ')[1]
  jwt.verify(apiKey, 'secret', async (err, decoded) => {
    if (err || !decoded) {
      return res.status(404).json({ check: false, msg: 'Bạn chưa đăng nhập' })
    } else {
      const queryResult = await User.authUser(decoded.data.id, decoded.data.role)
      const admin =
        decoded.data.role !== 'admin' &&
        (req.baseUrl === '/admins' ||
          req.baseUrl === '/course' ||
          req.baseUrl === '/register-logs' ||
          req.baseUrl === '/logs' ||
          req.baseUrl === '/sponsors' ||
          req.baseUrl === '/emails' ||
          req.baseUrl === '/staff' ||
          req.baseUrl === '/showtimekeeping' ||
          req.baseUrl === '/tempkeeping' ||
          req.baseUrl === '/salary' ||
          req.baseUrl === '/staff/null' ||
          req.baseUrl === '/prize' ||
          req.baseUrl === '/prize/null')
      const staff =
        decoded.data.role !== 'staff' &&
        decoded.data.role !== 'admin' &&
        (req.baseUrl === '/files' ||
          req.baseUrl === '/classes' ||
          req.baseUrl === '/sendPay' ||
          req.baseUrl === '/sendPrize' ||
          req.baseUrl === '/sendSalary' ||
          req.baseUrl === '/sendWarning' ||
          req.baseUrl === '/sendFile' ||
          req.baseUrl === '/sendCheer')
      const teacher =
        decoded.data.role !== 'staff' &&
        decoded.data.role !== 'admin' &&
        decoded.data.role !== 'teacher' &&
        (req.baseUrl === '/teachers' || req.baseUrl === '/teacherjoinclasses')
      const student =
        decoded.data.role !== 'staff' &&
        decoded.data.role !== 'admin' &&
        decoded.data.role !== 'student' &&
        (req.baseUrl === '/students' || req.baseUrl === '/studentjoinclasses')
      if (admin || staff || teacher || student) {
        return res.status(403).json({ check: false, msg: 'Đây là nơi không dành cho bạn' })
      }
      if (!queryResult || queryResult == null) {
        return res.status(404).json({ check: false, msg: 'Bạn chưa đăng nhập' })
      }
      res.user = queryResult
      next()
    }
  })
}

const sendMail = async (req, res, next) => {
  const { to, role } = req.query
  const checkMail = await User.checkEmail(to, role)
  if (!checkMail) {
    return res.status(403).json({ check: false, msg: 'Bạn không có quyền đăng ký' })
  } else {
    const mailData = {
      from: 'BK English Center',

      to: to,
      subject: 'Đăng ký tài khoản',
      html:
        `
            <b>Chào bạn! </b>
            <br/> 
            <p>Đây là mã xác thực của bạn</p>
            ` +
        createApiKey(index) +
        `<br/>
            <p>Lưu ý: Vui lòng không chia sẻ với bất kì ai khác, mã chỉ có tác dụng trong 5 phút và chỉ sử dụng được 1 lần</p>`
    }
    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        res.status(400).send({
          check: false,
          msg: error
        })
      }
      res.status(200).send({
        check: true,
        message: 'Mail send',
        message_id: info.messageId
      })
    })
  }
}
const requireOtp = (req, res, next) => {
  if (req.body.role === 'admin' || req.body.role === 'staff') {
    if (!req.headers.authorization) {
      return res.status(403).json({ check: false, msg: 'Bạn không có quyền đăng ký' })
    } else {
      const apiKey = req.headers.authorization.split(' ')[1]
      jwt.verify(apiKey, 'secret', async (err, decoded) => {
        if (err || !decoded) {
          return res.status(404).json({ check: false, msg: 'Bạn không có quyền đăng ký' })
        } else {
          if (decoded.data === index) {
            index++
            next()
          } else {
            return res.status(404).json({ check: false, msg: 'Bạn không có quyền đăng ký' })
          }
        }
      })
    }
  } else {
    next()
  }
}
module.exports = {
  requireApiKey,
  createApiKey,
  requireOtp,
  sendMail
}
