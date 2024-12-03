// TodoList.jsx
/* eslint-disable react/prop-types */
import TodoItem from './TodoItem';
import "../css/TodoList.module.css";

const TodoList = ({ todos, updateTodo, toggleComplete, deleteTodo }) => {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          updateTodo={updateTodo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};

export default TodoList;
