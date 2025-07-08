 interface PersonalDetails
{
    name : string,
    email : string,
    phNo : string,
}

 interface Address
{
     building : string,
     street : string,
     city : string,
     state : string,
     country : string 
}

export interface ItemDetail
{
     itemDesc ?: string,
     quantity : number | string,
     price : number | string,
     gst : number | string,
     amount : number,
}

interface Payment
{
    paidAmount : number | string,
    status : string,
    desc :  string
}

export interface User
{
    id : string | null,
    personalDetails : PersonalDetails ,
    address : Address ,
    itemDetails:ItemDetail[],                                      
    payment : Payment,
    billNo ?: number,
    _sts ?: number
}