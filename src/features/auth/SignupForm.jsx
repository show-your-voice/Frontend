import { ApiError } from '../../api/client.js'
import TextField from '../../components/TextField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { signUp } from './authApi.js'
import { LOGIN_ID_RULE, PASSWORD_RULE, signupErrorsFrom, validateSignup } from './authValidation.js'
import EmailVerificationFields from './EmailVerificationFields.jsx'
import useAuthForm from './useAuthForm.js'
import useEmailVerification from './useEmailVerification.js'

export default function SignupForm({ onSignup, onLoginClick }) {
  const verification = useEmailVerification()
  const { values, errors, submitting, handleChange, handleSubmit } = useAuthForm(
    { email: '', loginId: '', name: '', password: '', passwordConfirm: '' },
    validateSignup,
    async (form) => {
      try {
        onSignup(await signUp(form))
      } catch (error) {
        // 인증 후 30분이 지나 서버가 인증을 받지 않으면(E005) 처음부터 다시 인증한다.
        if (error instanceof ApiError && error.code === 'E005') verification.reset()
        return signupErrorsFrom(error)
      }
    },
  )
  function handleEmailChange(event) {
    handleChange(event)
    verification.reset()
  }

  return (
    <AuthLayout
      title="회원가입"
      description="학교 이메일(@dsm.hs.kr)로만 가입할 수 있어요."
      submitLabel="가입하기"
      submitting={submitting}
      submitDisabled={verification.status !== 'verified'}
      formError={verification.errors.form ?? errors.form}
      footerText="이미 계정이 있나요?"
      footerActionLabel="로그인"
      onFooterAction={onLoginClick}
      onSubmit={handleSubmit}
    >
      <EmailVerificationFields
        email={values.email}
        emailError={errors.email}
        onEmailChange={handleEmailChange}
        verification={verification}
      />
      <TextField
        id="signup-login-id"
        name="loginId"
        label="아이디"
        placeholder="아이디를 입력하세요"
        autoComplete="username"
        maxLength={20}
        value={values.loginId}
        onChange={handleChange}
        helper={LOGIN_ID_RULE}
        error={errors.loginId}
      />
      <TextField
        id="signup-name"
        name="name"
        label="이름"
        placeholder="이름을 입력하세요"
        autoComplete="name"
        maxLength={50}
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <TextField
        id="signup-password"
        name="password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        autoComplete="new-password"
        maxLength={50}
        value={values.password}
        onChange={handleChange}
        helper={PASSWORD_RULE}
        error={errors.password}
      />
      <TextField
        id="signup-password-confirm"
        name="passwordConfirm"
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 한 번 더 입력하세요"
        autoComplete="new-password"
        maxLength={50}
        value={values.passwordConfirm}
        onChange={handleChange}
        error={errors.passwordConfirm}
      />
    </AuthLayout>
  )
}
