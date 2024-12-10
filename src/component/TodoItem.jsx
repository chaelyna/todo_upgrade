// TodoItem.jsx
/* eslint-disable react/prop-types */
import { useState } from 'react';
import style from "../css/TodoItem.module.css";
// Ant Design
import { setTwoToneColor, CheckCircleTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Checkbox, Modal } from 'antd';

// 사용자 의사확인 전역함수(여러번 사용하려고 만듦)
// const confirmAndExecute = (action, message) => {
//   if (confirm(message)) action();
// };

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

      // confirmAndExecute(() =>
      //   updateTodo(todo.id, editText),
      //   `'${todo.text}'를 '${editText}'로 수정할까요? 작성 날짜도 변경됩니다!`
      // );
      showModal('edit');
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

  /* Antd */
  // 투톤 아이콘 컬러 일괄적용
  setTwoToneColor('#747bff');

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 오픈 여부 초기값
  const [mode, setMode] = useState(''); // 모달 종류 초기값 'delete' 또는 'edit'

  const showModal = (selectedMode) => {
    setMode(selectedMode); // 모달 종류 전달
    setIsModalOpen(true); // 모달 열기
  };
  const handleOk = () => {
    if (mode === 'delete') {
      deleteTodo(todo.id);
    } else if (mode === 'edit') {
      updateTodo(todo.id, editText);
    }
    setIsModalOpen(false); // 확인시 전처리 후 모달 닫기
  };
  const handleCancel = () => {
    if (mode === 'edit') setEditText(todo.text); // 수정상태에서 취소한 경우 텍스트 원복
    setIsModalOpen(false); // 취소시 모달 닫기(공통)
  };

  return (
    <li className={style.li}>
      {/* 체크박스 */}
      <Checkbox
        checked={todo.completed} // 완료여부 업데이트 해(상태값 반영)
        onChange={() => toggleComplete(todo.id)}
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
        <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} >
          {/* 완료 여부를 판단해서 true이면 텍스트에 선긋고, 아니면 데코레이션 제거 */}
          <span>{todo.text}</span>
          <span>{todo.time}</span>
        </div>
      )}

      {/* 수정여부 버튼: 수정 상태이면 해당 버튼을 '수정 완료:체크아이콘'으로, 아니라면 '수정: 편집아이콘'으로 변경 */}
      {/* <button onClick={handleEdit}>
        {isEditing ? <CheckCircleTwoTone /> : <EditTwoTone />}
      </button> */}
      <button type='button' onClick={handleEdit}>
        {isEditing ? <CheckCircleTwoTone /> : <EditTwoTone />}
      </button>

      {/* 삭제버튼 */}
      {/* <button onClick={() =>deleteTodo(todo.id)}><DeleteTwoTone /></button> */}
      {/* <button onClick={() => confirmAndExecute(() => deleteTodo(todo.id), `'${todo.text}'를 삭제할까요?`)}>
        <DeleteTwoTone />
      </button> */}
      <button type='button' onClick={() => showModal('delete')}>
        <DeleteTwoTone />
      </button>

      {/* 공통모달 */}
      {isModalOpen && (
        <Modal
          title={mode === 'delete' ? '삭제확인' : '수정확인'}
          open={isModalOpen}
          onOk={handleOk} onCancel={handleCancel}
          okText="확인" cancelText="취소"
        >
          {mode === 'delete'
            ? (`'${todo.text}'를 삭제할까요?`)
            : (`'${todo.text}'를 '${editText}'로 수정할까요? 작성 날짜도 변경됩니다!`)
          }
        </Modal>

      )}
    </li>
  );
};

export default TodoItem;
