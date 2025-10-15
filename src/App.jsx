import { useReducer, useRef, useMemo, useCallback, useState } from "react";

function taskReducer(tasks, action) {
  switch (action.type) {
    case "ADD":
      return [
        ...tasks,
        { id: Date.now(), text: action.text, completed: false },
      ];
    case "TOGGLE":
      return tasks.map((task) =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case "DELETE":
      return tasks.filter((task) => task.id !== action.id);
    default:
      return tasks;
  }
}

function App() {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [filterType, setFilterType] = useState("all");
  const inputRef = useRef();

  const handleAdd = useCallback(() => {
    const text = inputRef.current.value.trim();
    if (text !== "") {
      dispatch({ type: "ADD", text });
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [dispatch]);

  const handleToggle = useCallback(
    (id) => {
      dispatch({ type: "TOGGLE", id });
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id) => {
      dispatch({ type: "DELETE", id });
    },
    [dispatch]
  );

  const filteredTasks = useMemo(() => {
    if (filterType === "completed") return tasks.filter((t) => t.completed);
    if (filterType === "pending") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filterType]);

  return (
    <div className="container">
      <h2>Task Manager</h2>
      <div>
        <input type="text" ref={inputRef} placeholder="Enter a task" />
        <button onClick={handleAdd}>Add</button>
      </div>
      <div>
        <button onClick={() => setFilterType("all")}>All</button>
        <button onClick={() => setFilterType("completed")}>Completed</button>
        <button onClick={() => setFilterType("pending")}>Pending</button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
              />
              <span>{task.text} </span>
            </label>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
