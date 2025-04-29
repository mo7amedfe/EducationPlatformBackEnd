// Can't create, edit, or upload … Not enough storage. Get 100 GB of storage for EGP 59.99 EGP 14.90/month for 2 months.
// req => userdata
// schema => endPoint schema

import joi from 'joi'
const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files']

export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net', 'org'] } })
    .required(),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      'string.pattern.base': 'Password regex fail',
    })
    .required(),
}

export const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    // req
    const validationErrorArr = []
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,//علشان ميلاقيش اول ايرور و يخرج بعملها فولس علشان يديني كل الايرورز
        }) // error
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details)
        }
      }
    }

    if (validationErrorArr.length) {
      return res
        .status(400)
        .json({ message: 'Validation Error', Errors: validationErrorArr })
    }

    next()
  }
}

// schema :{
//     query:{
//         username:val,
//         email:val,
//         pas:val
//     }
// }

// req:{
//     body:{
//         age:value
//     }
// }