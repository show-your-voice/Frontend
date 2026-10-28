import { useState } from 'react'

// 첫 제출 전에는 오류를 보이지 않고, 제출한 뒤부터는 입력할 때마다 다시 검증한다.
export default function useForm(initialValues, validate, onValid) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function setValue(name, value) {
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)
    if (submitted) setErrors(validate(nextValues))
  }

  function handleChange(event) {
    setValue(event.target.name, event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setSubmitted(true)
    setErrors(nextErrors)

    const firstInvalid = Object.keys(initialValues).find((name) => nextErrors[name])
    if (firstInvalid) {
      const field = event.currentTarget.elements[firstInvalid]
      ;(field instanceof RadioNodeList ? field[0] : field)?.focus()
      return
    }
    onValid?.(values)
  }

  return { values, errors, setValue, handleChange, handleSubmit }
}
