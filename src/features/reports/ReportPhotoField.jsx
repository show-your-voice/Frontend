import { useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import FieldError from '../../components/FieldError.jsx'

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.auth.layout.fieldGap};
  min-width: 0;
`

const Label = styled.p`
  display: flex;
  gap: ${({ theme }) => theme.space[1]};
  margin: 0;
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${({ theme }) => theme.auth.font.label};
  font-weight: 500;

  span {
    color: ${({ theme }) => theme.auth.color.textTertiary};
    font-weight: 400;
  }
`

const HiddenInput = styled.input`
  display: none;
`

const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 2px;
  }
`

const Dropzone = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  padding: ${({ theme }) => theme.reportForm.layout.dropzonePadding};
  border: 2px dashed ${({ theme, $invalid }) => $invalid ? theme.auth.color.error : theme.auth.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.reportForm.color.photo};
  color: ${({ theme }) => theme.auth.color.textSecondary};
  font-size: ${({ theme }) => theme.auth.font.label};
  letter-spacing: inherit;
  word-break: keep-all;
  cursor: pointer;
  ${focusRing}

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`

const Photos = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.reportForm.layout.photoGap};
  margin: 0;
  padding: 0;
  list-style: none;
`

const tile = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.reportForm.layout.photoSize};
  height: ${({ theme }) => theme.reportForm.layout.photoSize};
  border-radius: ${({ theme }) => theme.reportForm.layout.photoRadius};
`

const Thumb = styled.li`
  ${tile}
  overflow: hidden;
  background: ${({ theme }) => theme.reportForm.color.photo};
  color: ${({ theme }) => theme.auth.color.textSecondary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  > svg {
    width: 24px;
    height: 24px;
  }
`

const RemoveButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.reportForm.layout.photoRemoveInset};
  right: ${({ theme }) => theme.reportForm.layout.photoRemoveInset};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.reportForm.layout.photoRemoveSize};
  height: ${({ theme }) => theme.reportForm.layout.photoRemoveSize};
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.reportForm.color.photoRemove};
  color: ${({ theme }) => theme.reportForm.color.onPhotoRemove};
  cursor: pointer;
  ${focusRing}

  svg {
    width: 14px;
    height: 14px;
  }
`

const AddButton = styled.button`
  ${tile}
  gap: ${({ theme }) => theme.space[1]};
  padding: 0;
  border: 0;
  background: ${({ theme }) => theme.auth.color.neutral};
  color: ${({ theme }) => theme.auth.color.textSecondary};
  font-size: ${({ theme }) => theme.auth.font.caption};
  letter-spacing: inherit;
  cursor: pointer;
  ${focusRing}

  svg {
    width: 22px;
    height: 22px;
  }
`

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}

function PhotoPreview({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return <ImageIcon />
  return <img src={src} alt={alt} onError={() => setFailed(true)} />
}

function preventDefault(event) {
  event.preventDefault()
}

export default function ReportPhotoField({ photos, maxCount, error, onAdd, onRemove }) {
  const inputRef = useRef(null)
  const labelId = 'report-photos-label'
  const errorId = error ? 'report-photos-error' : undefined

  function openPicker() {
    inputRef.current?.click()
  }

  function handleChange(event) {
    onAdd(event.target.files)
    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    onAdd(event.dataTransfer.files)
  }

  return (
    <Field role="group" aria-labelledby={labelId} aria-describedby={errorId} onDragOver={preventDefault} onDrop={handleDrop}>
      <Label id={labelId}>사진 첨부 <span>(선택)</span></Label>
      <HiddenInput ref={inputRef} type="file" accept="image/*" multiple tabIndex={-1} onChange={handleChange} />
      {photos.length === 0 ? (
        <Dropzone type="button" $invalid={Boolean(error)} onClick={openPicker}>
          <ImageIcon />
          사진을 끌어오거나 클릭해서 추가
        </Dropzone>
      ) : (
        <Photos>
          {photos.map((photo, index) => (
            <Thumb key={photo.id}>
              <PhotoPreview src={photo.src} alt={`첨부 사진 ${index + 1}`} />
              <RemoveButton type="button" aria-label={`첨부 사진 ${index + 1} 삭제`} onClick={() => onRemove(photo.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </RemoveButton>
            </Thumb>
          ))}
          {photos.length < maxCount && (
            <li>
              <AddButton type="button" aria-label={`사진 추가, ${photos.length}/${maxCount}장 첨부됨`} onClick={openPicker}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {photos.length} / {maxCount}
              </AddButton>
            </li>
          )}
        </Photos>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  )
}
