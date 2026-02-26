interface IOnboardAdminEmailTemplateDTO {
  userName: string;
  userEmail: string;
  password: string;
  loginPageLink: string;
  userRole: string;
}

export const onboardAdminEmailTemplate = (
  payload: IOnboardAdminEmailTemplateDTO,
) => {
  const { userName, userEmail, loginPageLink, userRole } = payload;
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">   
        <h2 style="color: #007BFF;">Welcome to Gymtal Admin Portal</h2>


        <p>Hi ${userName},</p>
        <p>You have been granted ${userRole} access to the Gymtal platform. </p>    
       
        <p>Here are your login credentials:</p>
        <p>Email: ${userEmail}</p>
        <p>Password: ${payload.password}</p>

             <p> Please click the button below to log in:</p>    
        <a href="${loginPageLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Log In</a>
       

        <p>If you didn't expect this email, please ignore it.</p>
        <p>Best regards,<br/>The Gymtal Team</p>
    </div>
    `;
};
