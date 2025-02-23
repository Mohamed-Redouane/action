export function getVerificationEmailHtml(code:string, username:string) :string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Email Verification - ONCampus</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f6f6f6;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
        }
        /* Header area with gradient background */
        .header {
          background: linear-gradient(90deg, #0077cc 0%, #005fa3 100%);
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          font-size: 16px;
          color: #333333;
        }
        .content p {
          line-height: 1.5;
          margin: 16px 0;
        }
        .code {
          display: inline-block;
          font-weight: bold;
          background-color: #eee;
          padding: 10px 16px;
          margin-top: 20px;
          border-radius: 4px;
          font-size: 18px;
          letter-spacing: 1px;
        }
        /* Footer area */
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999999;
          background-color: #fafafa;
          padding: 10px 20px;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ONCampus</h1>
        </div>
        <div class="content">
          <p>Hi ${username || "User"},</p>
          <p>Thank you for signing up! Please use the following code to verify your email address:</p>
          <div class="code">${code}</div>
          <p>This code is valid for 10 minutes. If you did not create an account with ONCampus, you can safely ignore this message.</p>
          <p>Best regards,<br />The ONCampus Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ONCampus. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
}

export function getPasswordResetEmailHtml(code:string, username:string):string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Password Reset - ONCampus</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f6f6f6;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
        }
        /* Header area with gradient background */
        .header {
          background: linear-gradient(90deg, #cc0000 0%, #990000 100%);
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          font-size: 16px;
          color: #333333;
        }
        .content p {
          line-height: 1.5;
          margin: 16px 0;
        }
        .code {
          display: inline-block;
          font-weight: bold;
          background-color: #eee;
          padding: 10px 16px;
          margin-top: 20px;
          border-radius: 4px;
          font-size: 18px;
          letter-spacing: 1px;
        }
        /* Footer area */
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999999;
          background-color: #fafafa;
          padding: 10px 20px;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset - ONCampus</h1>
        </div>
        <div class="content">
          <p>Hi ${username || "User"},</p>
          <p>We received a request to reset your ONCampus password. Use the code below to proceed:</p>
          <div class="code">${code}</div>
          <p>If you did not request a password reset, no further action is required. Simply ignore this message and your account will remain unchanged.</p>
          <p>Best regards,<br />The ONCampus Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ONCampus. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
}
