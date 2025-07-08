import * as Yup from "yup";

export const UserSchema = Yup.object().shape({
    personalDetails: Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        name: Yup.string().required("Name is required").min(2).max(20),
        phNo: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    }),

    address: Yup.object({
        building: Yup.string().max(20),
        street: Yup.string().required("Street is required").min(2).max(50),
        city: Yup.string().required("City is required").min(2).max(20),
        state: Yup.string().required("State is required").min(2).max(20),
        country: Yup.string().required("Country is required").min(2).max(20),
    }),
    
    itemDetails: Yup.array().of(
        Yup.object({
            itemDesc: Yup.string().max(30, "Description must be within 30 chars"),
            quantity: Yup.number().positive("Must be positive").required("Quantity is required"),
            price: Yup.number().positive("Must be positive").required("Price is required"),
            gst: Yup.number().required("GST is required").max(30),
            amount: Yup.number().required("Amount is required"),
        })
    ),

    payment: Yup.object({
        paidAmount: Yup.string().required("Paid amount is required"),
        status: Yup.string().required("Payment status is required"),
        desc: Yup.string().max(30, "Description must be within 30 chars"),
    }),

})











