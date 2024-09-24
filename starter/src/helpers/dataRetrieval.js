// Fetch events
export const fetchEvents = async (hasError) => {
    let response
    try {
        response = await fetch("http://localhost:3000/events");
        if (hasError) {
            hasError(false)
        }
    } catch {
        if (hasError) {
            hasError(true)
        }
        return []
    }
    return await response.json();
}

// Fetch categories
export const fetchCategories = async () => {
    let response
    try {
        response = await fetch("http://localhost:3000/categories");
    } catch {
        return []
    }
    return await response.json();
}

// Fetch users
export const fetchUsers = async () => {
    const response = await fetch("http://localhost:3000/users");
    return await response.json();
}