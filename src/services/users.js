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

export const deleteUsersById = async (id) => {
    const data = await fetch(`http://localhost:3000/usuarios/${id}`,{method: 'DELETE'}).then(response => response.json())
    .then(data => console.log('Usuario eliminado:', data));

    return "Usuario eliminado";
}

export const createUser = async () => {
    const data = await fetch(`http://localhost:3000/usuarios`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: 4,
            nombre: "Juan Santamaria",
            email: "juan@example.com",
            edad: 21,
            ciudad: "Medellín"
        })
        }).then(response => response.json())
        .then(data => console.log('Registro creado:', data))
        .catch(error => console.error('Error:', error));


    return "usuario creado con exito";
}

export const updateUser = async (id) => {
    const data = await fetch(`http://localhost:3000/usuarios/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: 4,
            nombre: "Juan David",
            email: "juan@example.com",
            edad: 21,
            ciudad: "Medellín"
        })
        }).then(response => response.json())
        .then(data => console.log('Registro creado:', data))
        .catch(error => console.error('Error:', error));


    return "usuario actualizado con exito";
}

// npm run dev = Incializar vite
// npx json-server --watch db.json --port 3000 = incicializar db.json
// json-server --watch db.json --port 3000 