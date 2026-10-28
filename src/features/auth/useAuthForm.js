import { useState } from 'react'

// 첫 제출 전에는 오류를 보이지 않고, 제출한 뒤부터는 입력할 때마다 다시 검증한다.
// onValid는 서버 요청을 보내고, 실패하면 화면에 보일 오류 객체를 돌려준다.
export default function useAuthForm(initialValues, validate, onValid) {
  const [values, setValues] = useState(initialValues)
  const [clientErrors, setClientErrors] = useState({})
  const [serverErrors, setServerErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fields = Object.keys(initialValues)

  function focusFirstInvalid(form, errors) {
    const firstInvalid = fields.find((name) => errors[name])
    if (firstInvalid) form.elements[firstInvalid].focus()
    return Boolean(firstInvalid)
  }

  function handleChange(event) {
    const { name, value } = event.target
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)
    // 서버 오류는 해당 칸을 고치면 지우고, 칸에 속하지 않은 오류는 아무 칸이나 고치면 지운다.
    setServerErrors((current) => Object.fromEntries(
      Object.entries(current).filter(([key]) => key !== name && fields.includes(key)),
    ))
    if (submitted) setClientErrors(validate(nextValues))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    const form = event.currentTarget
    const nextErrors = validate(values)
    setSubmitted(true)
    setClientErrors(nextErrors)
    setServerErrors({})
    if (focusFirstInvalid(form, nextErrors)) return

    setSubmitting(true)
    try {
      const failure = await onValid(values)
      if (failure) {
        setServerErrors(failure)
        focusFirstInvalid(form, failure)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return { values, errors: { ...serverErrors, ...clientErrors }, submitting, handleChange, handleSubmit }
}
