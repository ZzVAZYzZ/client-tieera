'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { current, refresh } from '../redux/features/userSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((state) => state.user)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')

        // 🟢 Nếu có accessToken (login thường)
        if (accessToken) {
          const action = await dispatch(current())

          // Nếu token hết hạn hoặc 401 thì gọi refresh
          if (current.rejected.match(action)) {
            const refreshAction = await dispatch(refresh())
            if (refresh.fulfilled.match(refreshAction)) {
              await dispatch(current())
            } else {
              console.warn('⚠️ Refresh token failed (login thường).')
            }
          }
        } else {
          // 🔵 Nếu không có accessToken (trường hợp Google OAuth)
          const refreshAction = await dispatch(refresh())
          if (refresh.fulfilled.match(refreshAction)) {
            await dispatch(current())
          } else {
            console.warn('⚠️ Refresh token failed (OAuth login).')
          }
        }
      } catch (err) {
        console.error('Auth init error:', err)
      }
    }

    initAuth()
  }, [dispatch])

  return { user, status, error }
}
