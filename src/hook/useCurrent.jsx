'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { current } from '../redux/features/userSlice'

export const useCurrent = () => {
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(current())
  }, [dispatch])

  return { user, status, error }
}
