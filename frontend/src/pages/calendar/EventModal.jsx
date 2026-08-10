import { useState } from 'react';

function toLocalInput(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16); // datetime-local 형식
}

export default function EventModal({ date, event, onSave, onClose }) {
  const defaultStart = event ? event.startTime : new Date(date.setHours(9, 0, 0, 0));
  const defaultEnd = event ? event.endTime : new Date(date.setHours(10, 0, 0, 0));

  const [title, setTitle] = useState(event?.title || '');
  const [startTime, setStartTime] = useState(toLocalInput(defaultStart));
  const [endTime, setEndTime] = useState(toLocalInput(defaultEnd));
  const [description, setDescription] = useState(event?.description || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (new Date(endTime) <= new Date(startTime)) {
      setError('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }
    onSave({
      title,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      description,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="event-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>{event ? '일정 수정' : '일정 등록'}</h3>

        {error && <p className="auth-error">{error}</p>}

        <label>
          제목
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
        </label>

        <label>
          시작 시간
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>

        <label>
          종료 시간
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </label>

        <label>
          메모
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={3} />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>취소</button>
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  );
}