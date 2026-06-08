'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refresh } from '../redux/features/userSlice'
import { current } from '../redux/features/userSlice'

export const useRefresh = () => {
  const dispatch = useDispatch()
  const {  user ,status, error } = useSelector((state) => state.user)

  useEffect(() => {
    const doRefresh = async () => {
      const action = await dispatch(refresh())
      if (refresh.fulfilled.match(action)) {
       dispatch(current())
      }
    }
    doRefresh()
  }, [dispatch])

  return { status, error }
}