import "./reset.css";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import CheckAllAndRemaining from "./components/CheckAllAndRemaining";
import TodoFilters from "./components/TodoFilters";
import ClearCompletedBtn from "./components/ClearCompletedBtn";
import { useCallback, useEffect, useState } from "react";

function App() {
  let [todos, setTodos] = useState([]);
  let [filteredTodos, setFilteredTodos] = useState(todos);
  let [url, setUrl] = useState("");
  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((respond) => respond.json())
      .then((todos) => {
        setTodos(todos);
        setFilteredTodos(todos);
      });
  }, []);

  let addTodo = (todo) => {
    //update data at the server side
    fetch("http://localhost:3001/todos", {
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
  let updateTodo = (todo) => {
    //sever side
    fetch(`http://localhost:3001/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    //client side
    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id === todo.id) {
          return todo;
        }
        return t;
      });
    });
  };

  let remainingCount = todos.filter((todo) => {
    return todo.completed === false;
  }).length;

  let checkAll = () => {
    //server
    todos.forEach((t) => {
      t.completed = true;
      updateTodo(t);
    });
    //client
    setTodos((prevState) => {
      return prevState.map((t) => {
        return { ...t, completed: true };
      });
    });
  };
  let clearCompleted = () => {
    //server side
    todos.forEach((t) => {
      if (t.completed) {
        deleteTodo(t.id);
      }
    });
    //client side
    setTodos((prevState) => {
      return prevState.filter((t) => !t.completed);
    });
  };

  let filterBy = useCallback(
    (filter) => {
      if (filter === "All") {
        setFilteredTodos(todos);
      }
      if (filter === "Active") {
        setFilteredTodos(todos.filter((t) => !t.completed));
      }
      if (filter === "Completed") {
        setFilteredTodos(todos.filter((t) => t.completed));
      }
    },
    [todos]
  );

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
        <CheckAllAndRemaining
          remainingCount={remainingCount}
          checkAll={checkAll}
        />
        <div className="other-buttons-container">
          <TodoFilters filterBy={filterBy} />
          <ClearCompletedBtn clearCompleted={clearCompleted} />
        </div>
      </div>
    </div>
  );
}

export default App;
