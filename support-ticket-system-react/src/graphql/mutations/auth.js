import { gql } from '@apollo/client';

export const REQUEST_OTP = gql`
  mutation RequestOtp($input: RegisterInput!) {
    requestRegisterOtp(input: $input) {
      message
    }
  }
`;

export const CONFIRM_OTP = gql`
  mutation ConfirmOtp($email: String!, $otp: String!) {
    confirmRegisterOtp(email: $email, otp: $otp) {
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REQUEST_LOGIN_OTP = gql`
  mutation RequestLoginOtp($input: LoginInput!) {
    requestLoginOtp(input: $input) {
      message
    }
  }
`;

export const CONFIRM_LOGIN_OTP = gql`
  mutation ConfirmLoginOtp($email: String!, $otp: String!) {
    confirmLoginOtp(email: $email, otp: $otp) {
      user {
        id
        username
        email
      }
    }
  }
`;

export const REQUEST_RESET_LINK = gql`
  mutation RequestReset($email: String!) {
    requestPasswordResetLink(email: $email) {
      message
    }
  }
`;

export const CONFIRM_RESET_LINK = gql`
  mutation ConfirmReset($token: String!) {
    confirmPasswordResetLink(token: $token) {
      user {
        id
        email
        username
      }
    }
  }
`;