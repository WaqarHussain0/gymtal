interface IOnboardGymMemberEmailTemplateDTO {
  userName: string;
  membershipPeriodStart: Date | string;
  membershipPeriodEnd: Date | string;
}

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export const onboardGymMemberEmailTemplate = (
  payload: IOnboardGymMemberEmailTemplateDTO,
) => {
  const { userName, membershipPeriodStart, membershipPeriodEnd } = payload;

  const formattedStart = formatDate(membershipPeriodStart);
  const formattedEnd = formatDate(membershipPeriodEnd);

  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">   
        <h2 style="color: #007BFF;">Welcome ${userName} to Gymtal!</h2>

        <p>Hi ${userName},</p>
        <p>Your membership is valid from <strong>${formattedStart}</strong> to <strong>${formattedEnd}</strong>.</p>    

        <p>If you didn't expect this email, please ignore it.</p>
        <p>Best regards,<br/>The Gymtal Team</p>
    </div>
  `;
};
