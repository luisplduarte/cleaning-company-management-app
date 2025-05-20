import sgMail, { MailDataRequired } from '@sendgrid/mail';

function initializeSendGrid() {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY environment variable is not set');
  }
  
  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error('SENDGRID_FROM_EMAIL environment variable is not set');
  }

  // Verify the sender email is properly formatted
  if (!process.env.SENDGRID_FROM_EMAIL.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('SENDGRID_FROM_EMAIL must be a valid email address');
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize SendGrid when the module loads
initializeSendGrid();

type JobCompletionEmailData = {
  clientEmail: string;
  jobTitle: string;
  jobLocation: string;
  startDate: Date;
  endDate: Date;
  amount: number;
};

export async function sendJobCompletionEmail({
  clientEmail,
  jobTitle,
  jobLocation,
  startDate,
  endDate,
  amount
}: JobCompletionEmailData) {
  const formattedStartDate = startDate.toLocaleDateString();
  const formattedEndDate = endDate.toLocaleDateString();
  const formattedAmount = amount.toFixed(2);

  const emailData: MailDataRequired = {
    to: clientEmail,
    from: process.env.SENDGRID_FROM_EMAIL!, // Non-null assertion since we validate in initializeSendGrid
    subject: `Job Completed: ${jobTitle}`,
    text: `
Job Details:
------------
Title: ${jobTitle}
Location: ${jobLocation}
Date: ${formattedStartDate} to ${formattedEndDate}
Amount: €${formattedAmount}
`,
    html: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Job Completed</h2>
  
  <h3>Job Details:</h3>
  <ul style="list-style: none; padding-left: 0;">
    <li><strong>Title:</strong> ${jobTitle}</li>
    <li><strong>Location:</strong> ${jobLocation}</li>
    <li><strong>Date:</strong> ${formattedStartDate} to ${formattedEndDate}</li>
    <li><strong>Amount:</strong> €${formattedAmount}</li>
  </ul>
</div>
`
  };

  try {
    await sgMail.send(emailData);
  } catch (error: unknown) {
    console.error('Error sending job completion email:', error);
    
    // Provide more specific error messages
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'body' in error.response) {
      const { message, code } = error.response.body as { message: string; code: number };
      throw new Error(`SendGrid Error (${code}): ${message}`);
    }
    
    throw new Error('Failed to send job completion email: ' + String(error));
  }
}
