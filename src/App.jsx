import { useReducer, useEffect, useCallback } from 'react';
import TodoInput from './component/TodoInput';
import TodoList from './component/TodoList';
import styles from "./css/App.module.css";

/**
 * useReducer()에서 쓸 함수 정의
 * 파라미터로 상태와 액션을 받아서 '새로운 상태'를 반환하는 함수임
 * @param {*} state 현재의 상태, 리듀서 함수는 상태를 변경하지 않고 새로운 상태를 반환함.
 * state는 상태의 이전 값을 나타내며, 리듀서 함수는 이 값을 기반으로 새로운 상태를 계산함.
 * 이 파일에서 state는 배열인 todos임.
 * @param {*} action 액션(객체), 상태를 변경할 때 필요한 정보를 포함하므로 안에 type과 payload가 들어있음
 * type: 어떤 종류의 상태 변경이 일어나는지를 나타내는 문자열
 * payload: 상태 변경에 필요한 추가적인 데이터를 포함함.
 * 추가할 할 일의 텍스트, 업데이트할 할 일의 ID와 텍스트, 완료 여부를 토글할 할 일의 ID 등이 들어있음
 * @returns 스위치를 통해 분기된 각 반환값
 */
const todoReducer = (state, action) => {
  // 등록시간 표시 옵션
  const dayOption = {
    year: '2-digit',
    month: 'long',
    day: 'numeric',
    weekday: "long",
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  switch (action.type) {
    // action.type을 감지하여 케이스 분기
    // 본문내용으로는 action.payload를 뜯어서 넣기

    // 최초 등록
    case 'ADD_TODO':
      return [...state, {
        id: Date.now(),
        time: new Date().toLocaleString('ko-KR', dayOption),
        text: action.payload,
        completed: false
      }];

    // 텍스트 수정
    case 'UPDATE_TODO':
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text, time: new Date().toLocaleString('ko-KR', dayOption) }
          : todo
      );
    // 완료여부 수정
    case 'TOGGLE_COMPLETE':
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    // 삭제
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);

    // 이도저도 아닐때
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
  // useCallback은 리액트 훅 중 하나로, 컴포넌트가 다시 렌더링될 때마다 동일한 함수를 재사용할 수 있도록 합니다.
  // 이는 성능 최적화에 유리하며, 특히 자식 컴포넌트에 콜백 함수를 전달할 때 유용합니다.
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
