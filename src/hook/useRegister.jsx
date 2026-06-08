'use client'

import { useDispatch, useSelector } from 'react-redux'
import { register, resetUserState } from '../redux/features/userSlice'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useRegister = () => {
  const dispatch = useDispatch()
  const { loading, error, message, status } = useSelector((state) => state.user)
  const router = useRouter()

  const handleRegister = useCallback(
    (email, password, confirmPassword) => {
      if (password !== confirmPassword) {
        alert('Mật khẩu nhập lại không khớp!')
        return
      }
      dispatch(register({ email, password }))
    },
    [dispatch]
  )

  const resetAll = useCallback(() => {
    dispatch(resetUserState())
  }, [dispatch])

   useEffect(() => {
    if (status === 'successed' && message) {
      alert(message)
      router.push('/login')
      resetAll()
    }
  }, [status, message, router, resetAll])

  return { loading, error, message, handleRegister, resetAll  }
}
