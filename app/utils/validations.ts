import {object, ref, SchemaOf, string} from 'yup';
import {ILogin, ISignup} from '~app/models/user';

export const emailValidation = () => {
  return string()
    .email('Please enter valid email')
    .required('Email address is required');
};

/**
 * Password validation with regex with minimum 8 characters.
 * @param requiredMessage
 * @returns Password validation schema
 */
const passwordValidation = (requiredMessage = 'Password is required') => {
  return string()
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special case character',
    )
    .required(requiredMessage);
};

/**
 * Validates phone number of following format (999) 999-9999
 * @returns validations for US phone number
 */
const phoneNumberValidation = () => {
  return string()
    .matches(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/, 'Invalid phone number')
    .required('Phone number required');
};

const confirmPasswordValidation = (reference: string) => {
  return string()
    .when(reference, {
      is: (val: string) => val && val.length > 0,
      then: string().oneOf([ref(reference)], 'Both password need to be same'),
    })
    .required('Confirm password required');
};

export const loginValidationSchema: SchemaOf<ILogin> = object().shape({
  email: emailValidation(),
  password: passwordValidation(),
});

export const registrationSchema: SchemaOf<ISignup> = object().shape({
  name: string().required('Name required'),
  email: emailValidation(),
  password: passwordValidation(),
  confirmPassword: confirmPasswordValidation('password'),
  phoneNumber: phoneNumberValidation(),
});
export const signUpValidationSchema: SchemaOf<ISignup> = object({
  email: emailValidation(),
  password: passwordValidation(),
  confirmPassword: confirmPasswordValidation('password'),
});
