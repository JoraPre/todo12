// src/api/todoApi.jsx
export const fetchTasks = async (status = "all") => {
  try {
    const response = await fetch(
      `https://easydev.club/api/v1/todos?filter=${status}`
    );
    if (!response.ok) throw new Error("Failed to fetch tasks");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const removeTask = async (id) => {
  try {
    await fetch(`https://easydev.club/api/v1/todos/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error removing task:", error);
    throw error;
  }
};

export const addTask = async (title) => {
  try {
    const response = await fetch("https://easydev.club/api/v1/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, isDone: false }),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const editTask = async (id, newTitle) => {
  try {
    const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!response.ok) throw new Error("Failed to edit task");
    return await response.json();
  } catch (error) {
    console.error("Error editing task:", error);
    throw error;
  }
};

export const toggleTaskStatus = async (id, currentStatus) => {
  try {
    const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDone: currentStatus }),
    });
    if (!response.ok) throw new Error("Failed to update task status");
    return await response.json();
  } catch (error) {
    console.error("Error toggling task status:", error);
    throw error;
  }
};
