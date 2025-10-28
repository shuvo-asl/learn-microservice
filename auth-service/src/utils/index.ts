export const createError = (msg: string, status_code: number): Error => {
    return Object.assign(
        new Error(msg), { status_code }
    )
}
