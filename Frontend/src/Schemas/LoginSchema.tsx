import * as Yup from "yup"

export const LoginSchema = Yup.object({
    userId: Yup.string()
    .min(4 , 'Enter your valid user Id')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
})