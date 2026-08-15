import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import mastersReducer from './masters/masters-slice'
import plansReducer from './plans/plans-slice'
import authenticationReducer from './authentication/authentication-slice'
import patientsReducer from './patients/patiens-slice'
import servicesReducer from './services/services-slice'
import appointmentsReducer from './appointments/appointments-slice'
export const store = configureStore({
    reducer: {
        masters: mastersReducer,
        plans: plansReducer,
        authentication: authenticationReducer,
        patients: patientsReducer,
        services: servicesReducer,
        appointments: appointmentsReducer,
    },

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
