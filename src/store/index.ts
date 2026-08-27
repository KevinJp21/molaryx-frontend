import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import mastersReducer from './masters/masters-slice'
import plansReducer from './plans/plans-slice'
import dashboardReducer from './dashboard/dashboard-slice'
import authenticationReducer from './authentication/authentication-slice'
import patientsReducer from './patients/patiens-slice'
import proceduresReducer from './procedures/procedures-slice'
import appointmentsReducer from './appointments/appointments-slice'
import teamReducer from './team/team-slice'
import treatmentsReducer from './treatments/treatments-slice'
import patientTreatmentsReducer from './patient-treatments/patient-treatments-slice'
import paymentsReducer from './payments/payments-slice'
import clinicalRecordsReducer from './clinical-records/clinical-records-slice'
import notificationsReducer from './notifications/notifications-slice'
import tenantsReducer from './tenants/tenants-slice'
export const store = configureStore({
    reducer: {
        masters: mastersReducer,
        plans: plansReducer,
        dashboard: dashboardReducer,
        authentication: authenticationReducer,
        patients: patientsReducer,
        procedures: proceduresReducer,
        appointments: appointmentsReducer,
        team: teamReducer,
        treatments: treatmentsReducer,
        patientTreatments: patientTreatmentsReducer,
        payments: paymentsReducer,
        clinicalRecords: clinicalRecordsReducer,
        notifications: notificationsReducer,
        tenants: tenantsReducer,
    },

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
