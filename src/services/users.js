export const getUsers = async () => {
    const data = await fetch("http://localhost:3000/usuarios")
    const response = await data.json()

    return response;
}

export const getUsersById = async (id) => {
    const data = await fetch(`http://localhost:3000/usuarios/${id}`)
    const response = await data.json()

    return response;
}

// export const getUsersById = async (id) => {
//     const data = await fetch(`http://localhost:3000/usuarios/${id}`)
//     const response = await data.json()

//     return response;
// }