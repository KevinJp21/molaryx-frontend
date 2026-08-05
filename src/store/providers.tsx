'use client'

import { store } from './index';
import { Provider } from 'react-redux'

interface Prop {
    children: React.ReactNode;
}

export const Providers = ({ children }: Prop) => {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
