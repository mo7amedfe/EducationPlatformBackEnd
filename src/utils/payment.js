import Stripe from "stripe"

export const paymentFunction = async({
     payment_method_types=['card'],
    mode='payment',
    customer_email="",
    metadata={},
    success_url,
    cancel,
    line_items=[]
 })=>{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const paymentdata  = await stripe.checkout.sessions.create({
        payment_method_types:['card'],//required 
        mode:'payment',//required
        customer_email,//optional
        metadata,//optional
        success_url,//required
        cancel,//required
        line_items
     
        
    })
    return paymentdata
}


/* 
     line_items:[{
            price_data:{
                currrency,
                product_data:{
                    name,
                },
                unit_amount,
            },
            quantity
        }],//required
    
 */