export const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9._-]{2,29}$/

export const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/

// La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/

export const NIT_REGEX = /^[0-9]{10}$/

export const IDENTIFICATION_NUMBER_REGEX = /^\d{6,10}$/

export const PHONE_REGEX = /^3\d{9}$/