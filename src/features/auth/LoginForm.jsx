import TextField from '../../components/TextField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { validateLogin } from './authValidation.js'
import useForm from '../../hooks/useForm.js'

// failureMessage는 서버가 로그인을 거절했을 때 두 입력을 모두 오류로 표시하는 자리다.
export default function LoginForm({ onLogin, onSignupClick, failureMessage }) {
  const { values, errors, handleChange, handleSubmit } = useForm(
    { loginId: '', password: '' },
    validateLogin,
    onLogin,
  )

  return (
    <AuthLayout
      title="로그인"
      description="아이디와 비밀번호를 입력해 주세요."
      submitLabel="로그인"
      footerText="아직 계정이 없나요?"
      footerActionLabel="회원가입"
      onFooterAction={onSignupClick}
      onSubmit={handleSubmit}
    >
      <TextField
        id="login-id"
        name="loginId"
        label="아이디"
        placeholder="아이디를 입력하세요"
        autoComplete="username"
        value={values.loginId}
        onChange={handleChange}
        error={errors.loginId}
        invalid={Boolean(failureMessage)}
      />
      <TextField
        id="login-password"
        name="password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password || failureMessage}
      />
    </AuthLayout>
  )
}
