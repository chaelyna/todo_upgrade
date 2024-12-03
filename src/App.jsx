import { useReducer, useEffect, useCallback } from 'react';
import TodoInput from './component/TodoInput';
import TodoList from './component/TodoList';
import styles from "./css/App.module.css";

/**
 * useReducer()에서 쓸 함수 정의
 * 파라미터로 상태와 액션을 받아서 '새로운 상태'를 반환하는 함수임
 * @param {*} state 상태
 * @param {*} action 액션(객체)
 * @returns 
 */
const todoReducer = (state, action) => {
  switch (action.type) {
    // action.type을 감지하여 케이스 분기
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    // 본문내용으로는 action.payload를 뜯어서 넣기
    case 'UPDATE_TODO':
      return state.map(todo =>
        todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
      );
    case 'TOGGLE_COMPLETE':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};

function App() {
  // useReducer(내가만든reducer함수, 초기 상태 값, 비동기처리)
  // 상태 변경 로직을 하나의 reducer 함수로 집중화하여 코드의 명확성을 높이는 리팩토링
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    // dispatch 함수는 reducer 함수로 액션을 전달하여 상태를 업데이트 함
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // CRUD함수모음(dispatch로 정의)
  const addTodo = useCallback((text) => dispatch({ type: 'ADD_TODO', payload: text }), []);
  const updateTodo = useCallback((id, text) => dispatch({ type: 'UPDATE_TODO', payload: { id, text } }), []);
  const toggleComplete = useCallback((id) => dispatch({ type: 'TOGGLE_COMPLETE', payload: id }), []);
  const deleteTodo = useCallback((id) => dispatch({ type: 'DELETE_TODO', payload: id }), []);

  return (
    <div className={styles.app}>
      <h1>useReducer로 상태관리 최적화 한<br />React To-Do List</h1>
      <TodoInput addTodo={addTodo} />
      <TodoList
        todos={todos}
        updateTodo={updateTodo}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
      />
    </div>
  );
}

export default App;
