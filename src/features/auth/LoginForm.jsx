import TextField from '../../components/TextField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { login } from './authApi.js'
import { loginErrorsFrom, validateLogin } from './authValidation.js'
import useAuthForm from './useAuthForm.js'

export default function LoginForm({ onLogin, onSignupClick }) {
  const { values, errors, submitting, handleChange, handleSubmit } = useAuthForm(
    { loginId: '', password: '' },
    validateLogin,
    async (credentials) => {
      try {
        onLogin(await login(credentials))
      } catch (error) {
        return loginErrorsFrom(error)
      }
    },
  )

  return (
    <AuthLayout
      title="로그인"
      description="아이디와 비밀번호를 입력해 주세요."
      submitLabel="로그인"
      submitting={submitting}
      formError={errors.form}
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
        invalid={Boolean(errors.loginId || errors.failure)}
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
        error={errors.password || errors.failure}
      />
    </AuthLayout>
  )
}
