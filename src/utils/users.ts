
type objInput = {
    id: string,
    username: string, 
    room: string
}
type userarr = objInput[]
let users: userarr = []

//addUser, removeuser, getUser, getUsersInroom

const addUser = ({ id, username, room }: objInput) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validatin of data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error: "username already in use!"
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user };

}

//remove user
const removeUser = (id: string) => {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

addUser({
    id: "32",
    username: "ope",
    room: "node"
})

addUser({
    id: "22",
    username: "jazz",
    room: "node"
})

addUser({
    id: "42",
    username: "precious",
    room: "c#"
})
   
//get user
const getUser = (id: string) => {
    const soughtUser = users.find(user => user.id === id)

    return soughtUser;
}

const getUsersInRoom = (room: string) => {
    room = room.trim().toLowerCase()
    const arrayOfUsers = users.filter(user => user.room === room)

    return arrayOfUsers;
}


// console.log(getUser(32))
// console.log(getUsersInRoom("c#"))
// console.log(users)

export { 
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}