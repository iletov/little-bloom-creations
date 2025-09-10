import { orderConfirmationTemplate } from '@/email-templates/orderConfirmation';
import { apiVersion } from '@/sanity/env';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // apiVersion: process.env.AWS_API_VERSION,
});

// const compiledTemplate = compile(orderConfirmationTemplate);

export const sendWelcomeEmail = async (
  email: string,
  name: string,
  status: string,
) => {
  if (!process.env.EMAIL_FROM) {
    throw new Error('Sender email not configured');
  }

  const prepareEmailData = {
    orderId: '123456',
    customerName: name,
    testName: name,
    testStatus: status,
  };

  // const emailHtml = orderConfirmationTemplate(prepareEmailData);

  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Успешно изпратена поръчка!',
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <!DOCTYPE html>
          <html>
          <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Статус на поръчката: изпратена </title>
         <style>
        body {
            margin: auto;
            width: 100%;
            min-height: 100dvh;
            font-family: Arial, sans-serif;
            line-height: 1.5;
            display: flex;
            color: #e0e0e0;
            background: linear-gradient(
                to bottom right,
            #6A0DAD 0%,     
            #6A0DAD 25%,  
            #D4A017 85%    
            );
        }
        
        .email-container {
            min-width: 60%;
            margin: auto;
            background-color: #47324e;
            border: 1px solid #6A0DAD;
            @media screen and (max-width: 768px) {
                min-width: fit-content;
            }
        }
        
        .confirmation-header {
            padding: 10px 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .confirmation-banner {
            background-color: #2B0F33;
            color: #e0e0e0;
            padding: 15px 20px;
            text-align: center;
            border-bottom: 1px solid #6A0DAD;
        }
        
        .confirmation-banner h2 {
            margin: 0;
            font-size: 18px;
            font-weight: normal;
        }
        
        .order-details {
            padding: 20px;
        }
        
        .order-details h3 {
            color: #D4A017;
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: normal;
        }
        
        .order-details p {
            margin: 0 0 5px 0;
            color: #e0e0e0;
        }
        
        .divider {
            height: 1px;
            background-color: #6E530C;
            margin: 15px 0;
        }
        
        .actions {
            padding: 10px 20px 20px;
        }
        
        .actions p {
            margin: 5px 0;
        }
        
        .action-link {
            color: #D4A017;
            text-decoration: none;
        }
        
        .action-link:hover {
            text-decoration: underline;
        }
        
        .footer {
            padding: 15px 20px;
            background-color: #2B0F33;
            text-align: center;
            font-size: 12px;
            color: #e0e0e0;
        }
        
        .footer img {
            height: 20px;
            margin-bottom: 10px;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .unsubscribe {
            color: #6E530C;
            text-decoration: none;
        }
    </style>
                        </head>
                      <body>
    <div class="email-container">
        
        <div class="confirmation-banner">
            <h2>Здравейте, ${prepareEmailData.customerName}:</h2>
            <h2>Поръчката ви е изпратена успешно!</h2>
        </div>
        
        <div class="order-details">
            <h3>Номер на поръчката:</h3>
            <p>#12345</p>
            
            <div class="divider"></div>
            
            <h3>Данни на поръчителя:</h3>
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>New York, NY 10001</p>
            <p>(212) 555-1234</p>
            
            <div class="divider"></div>
            
            <h3>Адрес за доставка:</h3>
           
            <p>Продукт: {Product name}</p>
            <p>Количество: 1</p>
            <p>Статус: {Status}</p>
        </div>
        
        <!-- <div class="actions">
            <p><strong>Need to make changes to this order?</strong></p>
            <p>Manage your orders online through MyAccount!</p>
            <p><a href="#" class="action-link">Manage My Order</a></p>
            
           
            
            <p>Stay Connected,</p>
            <p>Your Store Name</p>
            
            <p style="margin-top: 15px; font-style: italic;">PS: Want to add this order to your calendar? Just open the attached file and save it!</p>
        </div> -->
        
        <!-- <div class="footer">
            <img src="/api/placeholder/100/20" alt="Company Logo">
            <p>This email has been sent on behalf of Your Store Name, 123 Main Street, New York, NY 10001. You can <a href="#" class="unsubscribe">sign in to MyAccount</a> to manage your preferences.</p>
            <p style="margin-top: 10px;">Don't want further communications from this business? <a href="#" class="unsubscribe">Unsubscribe</a></p>
        </div> -->
    </div>
</body>
                      </html>
                      `,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'Вашата поръчка беше изпратена успешно! Благодарим ви, че избрахте нас!',
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const data = await client.send(command);
    console.log('Email send successfully', data.MessageId);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send email');
  }
};
