const users = [];

// Add User
const addUser = ({id, username, room}) => {
  // Clean the Data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate
  if (!username || !room) {
    return {
      error: 'Username and Room are required!'
    }
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username
  });

  // Validate user name
  if (existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  //Store user

  const user = {id, username, room} 
  users.push(user);
  return { user };
}

// Remove User
const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    //[0] doesnt matter 
    return users.splice(index, 1)[0]
  }
}

 addUser({
   id: 22,
   username: 'Miguel',
   room: '219'
 });

 addUser({
  id: 21,
  username: 'Miguel',
  room: '29'
});

addUser({
  id: 210,
  username: 'Msiguel',
  room: '29'
});

// Get User
const getUser = id => {
  return users.find(user => user.id === id)
}

// Get Users in Room
const getUsersInRoom = room => {
  return users.filter(user => user.room === room);
}
