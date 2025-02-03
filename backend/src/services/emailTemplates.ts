export function getVerificationEmailHtml(code: string, username: string): string {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Email Verification</title>
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
          padding: 20px;
        }
        .header {
          text-align: center;
          background-color: #0077cc;
          color: #fff;
          padding: 10px;
          border-radius: 6px 6px 0 0;
        }
        .content {
          margin: 20px 0;
          font-size: 16px;
          color: #333333;
        }
        .code {
          display: inline-block;
          font-weight: bold;
          background-color: #eee;
          padding: 8px 12px;
          margin-top: 20px;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999999;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your App Name</h1>
        </div>
        <div class="content">
          <p>Hi ${username || "User"},</p>
          <p>Thanks for signing up! Please use the following code to verify your email:</p>
          <div class="code">${code}</div>
          <p>This code is valid for 10 minutes.</p>
          <p>Best,<br />Your App Team</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your App Name
        </div>
      </div>
    </body>
  </html>
  `;
  }
  
  export function getPasswordResetEmailHtml(code: string, username: string): string {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Password Reset</title>
      <style>
        /* Same styling or different, your choice */
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
          padding: 20px;
        }
        .header {
          text-align: center;
          background-color: #cc0000;
          color: #fff;
          padding: 10px;
          border-radius: 6px 6px 0 0;
        }
        .content {
          margin: 20px 0;
          font-size: 16px;
          color: #333333;
        }
        .code {
          display: inline-block;
          font-weight: bold;
          background-color: #eee;
          padding: 8px 12px;
          margin-top: 20px;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999999;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <p>Hi ${username || "User"},</p>
          <p>We received a request to reset your password. Use the code below:</p>
          <div class="code">${code}</div>
          <p>If you did not request a password reset, please ignore this message.</p>
          <p>Best,<br />Your App Team</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your App Name
        </div>
      </div>
    </body>
  </html>
  `;
  }
  