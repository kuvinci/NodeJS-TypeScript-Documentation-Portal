import keys from '../keys';

export default function(email: String) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Account created',
    html: `
      <h1>Your account successfully created</h1>
      <p>Email - ${email}</p>
      <hr />
      <a href="${keys.BASE_URL}">Website</a>
    `
  }
}