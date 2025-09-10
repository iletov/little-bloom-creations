export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  giftDetails?: {
    recipientName: string;
    senderName: string;
    message?: string;
  };
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export const orderConfirmationTemplate = (props: any) => {
  `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        }
                        
                        .header h1 {
                            font-size: 24px;
                            margin-bottom: 10px;
                  }
                  
                  
                  
                  </style>
                  </head>
                  <body class='container'>
                <h1>${props.name}},Your Order Status Has Been Updated</h1>
                <p>Your order status has been updated to: ${props.status}}.</p>
                <p>Thank you for your purchase!</p>
                
                <div class="order-number">
                  Your Order ${props.orderId}:
                </div>
                <div>
                <h1 class="header">
                Your Order ${props.customerName}:
                </h1>
                </div>

                </body>
                </html>
                `;
};
