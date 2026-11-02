import { useEffect, useRef, useState } from 'react'

export default function useReportPhotos(maxCount) {
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const photosRef = useRef(photos)
  const nextId = useRef(0)

  useEffect(() => { photosRef.current = photos }, [photos])

  useEffect(() => () => {
    photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.src))
  }, [])

  function addPhotos(fileList) {
    const files = Array.from(fileList ?? [])
    const images = files.filter((file) => file.type.startsWith('image/'))
    const room = maxCount - photos.length
    const accepted = images.slice(0, Math.max(room, 0))

    if (images.length < files.length) setError('이미지 파일만 첨부할 수 있어요.')
    else if (accepted.length < images.length) setError(`사진은 최대 ${maxCount}장까지 첨부할 수 있어요.`)
    else setError('')

    if (accepted.length === 0) return

    const added = accepted.map((file) => {
      nextId.current += 1
      return { id: nextId.current, file, name: file.name, src: URL.createObjectURL(file) }
    })
    setPhotos([...photos, ...added])
  }

  function removePhoto(id) {
    const removed = photos.find((photo) => photo.id === id)
    if (removed) URL.revokeObjectURL(removed.src)
    setPhotos(photos.filter((photo) => photo.id !== id))
    setError('')
  }

  return { photos, error, addPhotos, removePhoto }
}
