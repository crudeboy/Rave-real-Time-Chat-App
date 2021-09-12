const generateMessage = (username: string, message: string) => {
    return {
        username: username,
        text: message,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username: string, message: string) => {
    return {
        username: username,
        text: message,
        createdAt: new Date().getTime()
    }
}



export { 
    generateMessage, 
    generateLocationMessage
};