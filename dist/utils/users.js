"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
let users = [];
//addUser, removeuser, getUser, getUsersInroom
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    //validatin of data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        };
    }
    //check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username;
    });
    if (existingUser) {
        return {
            error: "username already in use!"
        };
    }
    const user = { id, username, room };
    users.push(user);
    return { user };
};
exports.addUser = addUser;
//remove user
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.removeUser = removeUser;
addUser({
    id: "32",
    username: "ope",
    room: "node"
});
addUser({
    id: "22",
    username: "jazz",
    room: "node"
});
addUser({
    id: "42",
    username: "precious",
    room: "c#"
});
//get user
const getUser = (id) => {
    const soughtUser = users.find(user => user.id === id);
    return soughtUser;
};
exports.getUser = getUser;
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    const arrayOfUsers = users.filter(user => user.room === room);
    return arrayOfUsers;
};
exports.getUsersInRoom = getUsersInRoom;
