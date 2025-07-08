import * as Yup from 'yup';

export const AccountInfoSchema = Yup.object().shape({   
    name: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces')
        .required('Name is required'),
        
    mobNo: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
        .required('Mobile number is required'),
        
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
        
    doB: Yup.string()
        .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        'Date of Birth must be in YYYY-MM-DD format'
        )
        .test(
        'is-valid-date',
        'Date of Birth must be a valid date',
        (value) => value ? !isNaN(Date.parse(value)) : false
        )
        .required('Date of Birth is required'),

    password: Yup.string().trim()
        .min(6, 'Password must be at least 6 characters')
        .max(10, 'Password must be lesser than 10 characters')
        .required('Password is required'),

    confirmpassword:Yup.string().trim()
        .oneOf([Yup.ref("password"),""],"Password must match")
        .required("Confirm your password before signUp"),
});
