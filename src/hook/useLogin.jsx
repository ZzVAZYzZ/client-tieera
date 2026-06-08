'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, resetUserState, loginByGoogle  } from '../redux/features/userSlice'
import { useRouter } from 'next/navigation'

export const useLogin = () => {
  const dispatch = useDispatch()
  const { user, loading, error, status  } = useSelector((state) => state.user)
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleLogin = (credentials) => {
    dispatch(login(credentials))
  }

   const handleGoogleLogin = () => {
    // dispatch(loginByGoogle())
    window.location.href = `${API_URL}/api/users/google`
  }


  const resetAll = () => {
    dispatch(resetUserState())
  }

  return { user, loading, error, status , handleLogin, resetAll, handleGoogleLogin }
}
