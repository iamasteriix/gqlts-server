import * as yup from 'yup';

export const errorMessages = {
  duplicateEmail: 'email already exists',
  emailNotLongEnough: 'email must be at least 8 characters',
  badEmail: 'email must be a valid email',
  shortPassword: 'password must be at least 8 characters',
  invalidLogin: 'invalid login',
  emailNotConfirmed: 'please confirm your email',
  forgotPasswordLockedError: 'account is locked',
  expiredKey: 'the link to change your password is expired',
  userDoesNotExist: 'this user does not exist'
}

export const yupEmail = yup.string().min(5, errorMessages.emailNotLongEnough).max(255).email().required();
export const yupPassword = yup.string().min(8).max(255).required();
export const yupSchema = yup.object().shape({ email: yupEmail, password: yupPassword });