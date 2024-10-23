'use client'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import Image from 'next/image'
import React from 'react'
import logo from '../../../public/logo.png'
import { api } from '@/axios'
import { logout } from '@/redux/mainSlice'
import { useRouter } from 'next/navigation'

const Welcome = () => {
    const user = useAppSelector(state => state.main.user)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            router.push('/auth/login')
            await api.post('/auth/logout')
            dispatch(logout())
        } catch (error) {
            console.error(error)
        }
    }

  return user && (
    <div className='flex flex-col items-center space-y-4'>
        <Image src={logo} height={200} width={200} alt='logo'/>
        <h1 className='text-3xl'>Welcome, {user.username}!</h1>
        <button onClick={handleLogout} className='bg-white rounded-full px-6 py-2 text-black'>Logout</button>
    </div>
  )
}

export default Welcome