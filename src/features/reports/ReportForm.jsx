import styled from 'styled-components'
import Button from '../../components/Button.jsx'
import FieldError from '../../components/FieldError.jsx'
import TextField from '../../components/TextField.jsx'
import useForm from '../../hooks/useForm.js'
import ReportCategoryField from './ReportCategoryField.jsx'
import ReportPhotoField from './ReportPhotoField.jsx'
import { MAX_REPORT_PHOTOS, REPORT_CATEGORIES, validateReport } from './reportFormValidation.js'
import useReportPhotos from './useReportPhotos.js'

const Page = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.reportForm.layout.sectionGap};
  min-height: 100dvh;
  padding: ${({ theme }) => theme.reportForm.layout.pagePaddingTop} ${({ theme }) => theme.reportForm.layout.pagePaddingInline} ${({ theme }) => theme.reportForm.layout.pagePaddingBottom};
  background: ${({ theme }) => theme.reportForm.color.page};
  font-family: ${({ theme }) => theme.auth.font.family};
  line-height: ${({ theme }) => theme.auth.font.lineHeight};
  letter-spacing: ${({ theme }) => theme.auth.font.letterSpacing};
  color-scheme: light;

  @media (max-width: ${({ theme }) => theme.reportForm.layout.tabletBreakpoint}) {
    padding-inline: ${({ theme }) => theme.space[4]};
  }
`

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  max-width: ${({ theme }) => theme.reportForm.layout.width};
  gap: ${({ theme }) => theme.space[3]};
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: -7px;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.auth.color.textPrimary};
  cursor: pointer;

  svg {
    width: ${({ theme }) => theme.reportForm.layout.backSize};
    height: ${({ theme }) => theme.reportForm.layout.backSize};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 2px;
  }
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${({ theme }) => theme.auth.font.heading};
  font-weight: 700;
  line-height: inherit;
`

const RoomGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
`

const RoomInfo = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  margin: 0;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.reportForm.color.optionActive};
  color: ${({ theme }) => theme.reportForm.color.optionActiveText};
  font-size: ${({ theme }) => theme.auth.font.label};
  font-weight: 500;

  &:is(button) {
    border: 0;
    font-family: inherit;
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
    width: ${({ theme }) => theme.reportForm.layout.pinSize};
    height: ${({ theme }) => theme.reportForm.layout.pinSize};
  }
`

const ChangeRoomButton = styled.button`
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.auth.color.textTertiary};
  font: inherit;
  font-size: ${({ theme }) => theme.auth.font.label};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover { color: ${({ theme }) => theme.auth.color.brand}; }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.auth.color.brand};
    outline-offset: 2px;
  }
`

const Card = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.reportForm.layout.sectionGap};
  width: 100%;
  max-width: ${({ theme }) => theme.reportForm.layout.width};
  padding: ${({ theme }) => theme.reportForm.layout.formPaddingBlock} ${({ theme }) => theme.reportForm.layout.formPaddingInline};
  border-radius: ${({ theme }) => theme.auth.radius.form};
  background: ${({ theme }) => theme.auth.color.surface};

  @media (max-width: ${({ theme }) => theme.reportForm.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: ${({ theme }) => theme.reportForm.layout.mobileBreakpoint}) {
    > button { flex: 1; }
  }
`

const pinIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export default function ReportForm({ room, submitting = false, submitError, onPickRoom, onSubmit, onCancel }) {
  const { photos, error: photoError, addPhotos, removePhoto } = useReportPhotos(MAX_REPORT_PHOTOS)
  const { values, errors, handleChange, handleSubmit } = useForm(
    { category: '', title: '', content: '', improvement: '' },
    (report) => validateReport({ ...report, room: room?.id }),
    (report) => onSubmit?.({ ...report, photos: photos.map((photo) => photo.file) }),
  )

  return (
    <Page>
      <Header>
        <BackButton type="button" aria-label="뒤로 가기" onClick={onCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </BackButton>
        <Title id="report-form-title">불편 신고하기</Title>
        {room ? (
          <RoomGroup>
            <RoomInfo>{pinIcon}{room.name} · {room.placeName}</RoomInfo>
            <ChangeRoomButton type="button" onClick={onPickRoom}>위치 변경</ChangeRoomButton>
          </RoomGroup>
        ) : (
          <RoomInfo as="button" type="button" onClick={onPickRoom}>{pinIcon}지도에서 실 선택</RoomInfo>
        )}
      </Header>
      <Card noValidate onSubmit={handleSubmit} aria-labelledby="report-form-title">
        <FieldError>{!room && errors.room}</FieldError>
        <ReportCategoryField
          name="category"
          categories={REPORT_CATEGORIES}
          value={values.category}
          error={errors.category}
          onChange={handleChange}
        />
        <TextField
          id="report-title"
          name="title"
          label="제목"
          placeholder="제목을 입력하세요"
          value={values.title}
          onChange={handleChange}
          error={errors.title}
        />
        <TextField
          id="report-content"
          name="content"
          label="본문"
          placeholder="불편한 점을 자세히 적어주세요."
          multiline
          value={values.content}
          onChange={handleChange}
          error={errors.content}
        />
        <TextField
          id="report-improvement"
          name="improvement"
          label="개선 방향 (선택)"
          placeholder="이렇게 바뀌면 좋겠어요"
          value={values.improvement}
          onChange={handleChange}
        />
        <ReportPhotoField
          photos={photos}
          maxCount={MAX_REPORT_PHOTOS}
          error={photoError}
          onAdd={addPhotos}
          onRemove={removePhoto}
        />
        <FieldError>{submitError}</FieldError>
        <Footer>
          <Button variant="neutral" onClick={onCancel}>취소</Button>
          <Button type="submit" fullWidth={false} disabled={submitting}>{submitting ? '신고하는 중' : '신고하기'}</Button>
        </Footer>
      </Card>
    </Page>
  )
}
