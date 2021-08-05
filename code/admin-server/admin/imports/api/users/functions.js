export function getEmail() {
  const user = this;

  return user && user.emails && user.emails.length ? user.emails[0].address : null;
}

export function getEmailVerification() {
  const user = this;

  if (user && user.emails) {
    const email = user.emails.find(e => e.verified);
    return email ? email.address : null;
  }

  return null;
}

export function hasVerifiedEmail(user) {
  if (!user || !user.emails || !user.emails.length || !user.emails[0].verified) return false;

  return true;
}

export function hasEmail(user) {
  if (!user || !user.emails || !user.emails.length) return false;

  return Boolean(user.emails.find(email => email));
}

export default {
  getEmail,
  getEmailVerification,
  hasEmail,
  hasVerifiedEmail
};
