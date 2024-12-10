// TodoItem.jsx
/* eslint-disable react/prop-types */
import { useState } from 'react';
import style from "../css/TodoItem.module.css";

// 사용자 의사확인
const confirmAndExecute = (action, message) => {
  if (confirm(message)) action();
};

const TodoItem = ({ todo, updateTodo, toggleComplete, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  // 수정상태 여부를 초기값으로 상태에 설정
  const [editText, setEditText] = useState(todo.text);
  // 기존 todo에 기록된 텍스트를 초기값으로 상태에 설정

  // 할 일 수정 함수
  const handleEdit = () => {
    if (isEditing && editText.trim()) {
      // isEditing이 true이고 editText가 존재한다면 App에 선언한 updateTodo(해당todo고유 아이디값, 변경된내용)를 실행해
      // updateTodo(todo.id, editText);
      confirmAndExecute(() =>
        updateTodo(todo.id, editText),
        `'${todo.text}'를 '${editText}'로 수정할까요? 작성 날짜도 변경됩니다!`
      );
    }
    setIsEditing(!isEditing);
    // 수정상태를 반대로 돌려
  };
  // Enter 키 입력 감지
  const handleKeyDown = (e) => {
    if (e.keyCode === 229) return;
    // 맥에서 한글을 입력하는 동작(onKeyDown/Up)에서 함수 콜링이 두번 중첩되는 이슈가 있어 해결책 삽입
    if (e.key === 'Enter') handleEdit();
    // Enter를 누르면 할 일 수정
  };



  return (
    <li className={style.li}>
      {/* 체크박스 */}
      <input
        type="checkbox"
        checked={todo.completed} // 완료여부 업데이트(상태값 반영)
        onChange={() => toggleComplete(todo.id)} // 해당 함수로 변경된 값 업데이트(상태값 반영)
      />

      {/* 수정 상태이면 input을 보여주고, 아니라면 span을 보여줘 */}
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터 키 입력 이벤트 추가
        />
      ) : (
        <div
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
        // 완료 여부를 판단해서 true이면 텍스트에 선긋고, 아니면 데코레이션 제거
        >
          <span>{todo.text}</span>
          <span>{todo.time}</span>
        </div>
      )}

      {/* 수정여부 버튼: 수정 상태이면 해당 버튼에 '수정 완료'로, 아니라면 '수정'으로 써 줘 */}
      <button onClick={handleEdit}>
        {isEditing ? '수정 완료' : '수정'}
      </button>

      {/* 삭제버튼 */}
      <button onClick={() =>
        confirmAndExecute(() => deleteTodo(todo.id), `'${todo.text}'를 삭제할까요?`)}>
        삭제
      </button>
    </li>
  );
};

export default TodoItem;
