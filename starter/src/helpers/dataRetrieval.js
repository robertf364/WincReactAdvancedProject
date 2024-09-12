// Fetch events
export const fetchEvents = async () => {
    const response = await fetch("http://localhost:3000/events");
    return await response.json();
}
  
// Fetch categories
export const fetchCategories = async () => {
    const response = await fetch("http://localhost:3000/categories");
    return await response.json();
}

// Fetch users
export const fetchUsers = async () => {
    const response = await fetch("http://localhost:3000/users");
    return await response.json();
}