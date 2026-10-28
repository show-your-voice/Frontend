import TextField from '../../components/TextField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { PASSWORD_RULE, validateSignup } from './authValidation.js'
import useAuthForm from './useAuthForm.js'

export default function SignupForm({ onSignup, onLoginClick }) {
  const { values, errors, handleChange, handleSubmit } = useAuthForm(
    { email: '', loginId: '', name: '', password: '', passwordConfirm: '' },
    validateSignup,
    onSignup,
  )

  return (
    <AuthLayout
      title="회원가입"
      description="학교 이메일(@dsm.hs.kr)로만 가입할 수 있어요."
      submitLabel="가입하기"
      footerText="이미 계정이 있나요?"
      footerActionLabel="로그인"
      onFooterAction={onLoginClick}
      onSubmit={handleSubmit}
    >
      <TextField
        id="signup-email"
        name="email"
        type="email"
        label="이메일"
        placeholder="이메일을 입력하세요"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <TextField
        id="signup-login-id"
        name="loginId"
        label="아이디"
        placeholder="아이디를 입력하세요"
        autoComplete="username"
        value={values.loginId}
        onChange={handleChange}
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
