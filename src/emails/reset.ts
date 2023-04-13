import keys from '../keys';

module.exports = function(email: String, token: String) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Password reset',
    html: `
      <h1>Forgot your password?</h1>
      <p>To change your password click a link below:</p>
      <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
      <hr />
      <a href="${keys.BASE_URL}">${keys.BASE_URL}</a>
    `
  }
}