function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

export default function DayEventList({ date, events, onAdd, onEdit, onDelete }) {
  return (
    <div className="day-event-list">
      <div className="day-list-header">
        <h3>{date.getMonth() + 1}월 {date.getDate()}일 일정</h3>
        <button onClick={onAdd}>+ 일정 추가</button>
      </div>

      {events.length === 0 ? (
        <p className="no-events">등록된 일정이 없습니다.</p>
      ) : (
        <ul className="event-items">
          {events
            .slice()
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .map((ev) => (
              <li key={ev.id} className="event-item" style={{ borderLeftColor: ev.color }}>
                <div className="event-item-main" onClick={() => onEdit(ev)}>
                  <span className="event-time">
                    {formatTime(ev.startTime)} - {formatTime(ev.endTime)}
                  </span>
                  <span className="event-title">{ev.title}</span>
                  {ev.description && <p className="event-desc">{ev.description}</p>}
                </div>
                <button className="delete-btn" onClick={() => onDelete(ev.id)}>삭제</button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}