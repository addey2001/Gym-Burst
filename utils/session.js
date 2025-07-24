export const getUserObject = (user) => {
    return {
        _id: user.id,
        username: user.username 
    }
}