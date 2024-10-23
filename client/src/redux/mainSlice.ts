import { IUser } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
  user: IUser | null
}

const initialState: InitialState = {
  user: null
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
    }
  },
})

export const { updateUser, logout } = mainSlice.actions

export default mainSlice.reducer