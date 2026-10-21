import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import OutlineButton from '../../components/OutlineButton.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import ReportAttachments from './ReportAttachments.jsx'
import ReportInfoList from './ReportInfoList.jsx'

const Panel = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ theme }) => theme.report.detail.width};
  min-height: ${({ theme }) => theme.report.detail.minHeight};
  padding: ${({ theme }) => theme.report.detail.padding};
  border-radius: ${({ theme }) => theme.report.detail.radius};
  background: ${({ theme }) => theme.report.color.surface};

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    min-height: calc(100dvh - 24px);
    padding: ${({ theme }) => theme.space[6]};
    border-radius: ${({ theme }) => theme.report.detail.mobileRadius};
  }
`

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: ${({ theme }) => theme.space[2]};
  min-height: ${({ theme }) => theme.report.detail.backHeight};
  margin: 0 0 ${({ theme }) => theme.report.detail.headerGap};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.report.color.body};
  font-size: ${({ theme }) => theme.report.font.title};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  cursor: pointer;

  svg { width: ${({ theme }) => theme.report.overview.iconSize}; }
  &:hover { color: ${({ theme }) => theme.report.color.accent}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }
`

const Heading = styled.h1`
  margin: ${({ theme }) => theme.space[4]} 0 ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.report.color.title};
  font-size: ${({ theme }) => theme.report.detail.titleSize};
  font-weight: 600;
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.heading};
  }
`

const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[8]};
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.report.color.title};
  font-size: ${({ theme }) => theme.report.detail.bodySize};
  line-height: ${({ theme }) => theme.report.font.lineHeight};
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.report.layout.mobileBreakpoint}) {
    font-size: ${({ theme }) => theme.report.font.body};
  }
`

const Improvement = styled.aside`
  padding-left: ${({ theme }) => theme.report.detail.improvementPadding};
  border-left: 4px solid ${({ theme }) => theme.report.color.accent};
  font-size: ${({ theme }) => theme.report.font.body};
  line-height: ${({ theme }) => theme.report.font.lineHeight};

  h2 {
    margin: 0 0 ${({ theme }) => theme.space[1]};
    color: ${({ theme }) => theme.report.color.accent};
    font-size: inherit;
    font-weight: 400;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.report.color.body};
    white-space: pre-wrap;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`

const Actions = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.space[8]};
`

export default function ReportDetail({ report, onBack, onDelete }) {
  const headingRef = useRef(null)
  useEffect(() => { headingRef.current?.focus() }, [report.id])

  return (
    <Panel aria-labelledby="report-detail-heading">
      <BackButton type="button" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="m15 5-7 7 7 7" />
        </svg>
        목록으로
      </BackButton>
      <header>
        <StatusBadge tone={report.status.tone} large>{report.status.label}</StatusBadge>
        <Heading id="report-detail-heading" ref={headingRef} tabIndex={-1}>{report.title}</Heading>
      </header>
      <Content>
        <ReportInfoList {...report} author={report.authorDisplay ?? report.author} />
        <ReportAttachments photos={report.photos} />
        <Description>{report.content ?? report.description}</Description>
        {report.improvement && (
          <Improvement aria-labelledby="report-improvement-heading">
            <h2 id="report-improvement-heading">개선 방향</h2>
            <p>{report.improvement}</p>
          </Improvement>
        )}
      </Content>
      <Actions>
        <OutlineButton danger large disabled={!onDelete} onClick={onDelete}>게시물 삭제</OutlineButton>
      </Actions>
    </Panel>
  )
}
