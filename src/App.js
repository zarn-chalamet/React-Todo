import "./reset.css";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import CheckAllAndRemaining from "./components/CheckAllAndRemaining";
import TodoFilters from "./components/TodoFilters";
import ClearCompletedBtn from "./components/ClearCompletedBtn";
import { useEffect, useState } from "react";

function App() {
  let [todos, setTodos] = useState([]);
  let [url, setUrl] = useState("http://localhost:3001/todos");
  useEffect(() => {
    fetch(url)
      .then((respond) => respond.json())
      .then((todos) => {
        setTodos(todos);
      });
  }, []);

  let addTodo = (todo) => {
    //update data at the server side
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    //update data at the client side
    setTodos((prevState) => [...prevState, todo]);
  };

  let deleteTodo = (todoId) => {
    fetch(`http://localhost:3001/todos/${todoId}`, {
      method: "DELETE",
    });
    setTodos((prevState) => {
      return prevState.filter((todo) => {
        return todo.id !== todoId;
      }); // [todo,todo]
    });
  };

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>
        <TodoForm addTodo={addTodo} />
        <TodoList todos={todos} deleteTodo={deleteTodo} />
        <CheckAllAndRemaining />
        <div className="other-buttons-container">
          <TodoFilters />
          <ClearCompletedBtn />
        </div>
      </div>
    </div>
  );
}

export default App;
