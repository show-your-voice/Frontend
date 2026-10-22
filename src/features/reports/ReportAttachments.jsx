import { useState } from 'react'
import styled from 'styled-components'

const Gallery = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const Photo = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 4 / 3;
  min-width: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.report.radius.card};
  background: ${({ theme }) => theme.report.color.detailSurface};
  color: ${({ theme }) => theme.report.color.body};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: ${({ theme }) => theme.report.detail.imageIconSize};
    height: ${({ theme }) => theme.report.detail.imageIconSize};
  }
`

function AttachmentPreview({ src, alt }) {
  const [failed, setFailed] = useState(false)

  return (
    <Photo>
      {src && !failed ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={alt}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      )}
    </Photo>
  )
}

export default function ReportAttachments({ photos = [] }) {
  if (photos.length === 0) return null

  return (
    <Gallery aria-label="첨부 사진">
      {photos.map((photo) => <AttachmentPreview key={`${photo.id}-${photo.src ?? ''}`} {...photo} />)}
    </Gallery>
  )
}
