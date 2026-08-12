export const ROLES_IDS = {
    OWNER: 2,
    PROFESSIONAL: 4,
    ASSISTANT: 5
} as const;

export const ROLES: { id: number, name: string }[] = [
    {
        id: ROLES_IDS.OWNER,
        name: 'Propietario'
    },
    {
        id: ROLES_IDS.PROFESSIONAL,
        name: 'Profesional'
    },
    {
        id: ROLES_IDS.ASSISTANT,
        name: 'Asistente'
    }
]

export const PERMISSIONS = {
    module: 'PATIENTS',
    permissions: [
        {
            code: 'GET_USER_PATIENTS'
        }

    ]
}