import React from 'react'
import { useParams } from 'react-router-dom'

export default function Notes() {
  const {id} = useParams<{id: string}>()
  return (
    <div>Notes: {id}</div>
  )
}
