export const getUsers = async () => {
    try {
        const data = await fetch("http://localhost:3000/usuarios")
        const response = await data.json()
        return response;
    }

    catch (error) {
        console.error("Error fetching users:", error);;
    }
}

export const getUsersById = async (id) => {
    try {

        if (!id) {
            throw new Error("ID is required");
        }

        const data = await fetch(`http://localhost:3000/usuarios/${id}`)
        const response = await data.json()
        return response;
    }

    catch (error) {
        console.error("Internal Server Error:", error);
    }
}

export const deleteUsersById = async (id) => {
    try{
        const data = await fetch(`http://localhost:3000/usuarios/${id}`, { method: 'DELETE' })
        const response = await data.json()
        return response;

    } catch (err) {
        console.error(err);
    }

}

export const createUser = async (user) => {
    try {
        const data = await fetch(`http://localhost:3000/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const response = await data.json()
        return response;

    } catch (err){
        console.error(err);
    }
}

export const updateUser = async (id) => {
    const data = await fetch(`http://localhost:3000/usuarios/${id}`, {
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