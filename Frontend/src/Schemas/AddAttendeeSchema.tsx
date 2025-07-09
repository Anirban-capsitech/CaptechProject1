import * as Yup from "yup"

export const AttendeeSchema =Yup.object(
    {
        attendeeName : Yup.string()
        .required("Attendee Name is needed"),

        dept : Yup.string()
        .required("Deparment Name is needed"),

        billNo : Yup.string()
        .required("Select a bill no. ")
    }
)