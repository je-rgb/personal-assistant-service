function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export default function MonthCalendar({
  currentMonth, selectedDate, eventsByDate,
  onSelectDate, onPrevMonth, onNextMonth, onToday,
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0=일요일
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const today = new Date();

  return (
    <div className="month-calendar">
      <div className="month-header">
        <button onClick={onPrevMonth}>{'<'}</button>
        <h2>{year}년 {month + 1}월</h2>
        <button onClick={onNextMonth}>{'>'}</button>
        <button className="today-btn" onClick={onToday}>오늘</button>
      </div>

      <div className="weekday-row">
        {['일', '월', '화', '수', '목', '금', '토'].map((w) => (
          <div key={w} className="weekday-cell">{w}</div>
        ))}
      </div>

      <div className="days-grid">
        {cells.map((date, idx) => {
          if (!date) return <div key={idx} className="day-cell empty" />;
          const hasEvents = (eventsByDate[toDateKey(date)] || []).length > 0;
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <div
              key={idx}
              className={`day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onSelectDate(date)}
            >
              <span className="day-number">{date.getDate()}</span>
              {hasEvents && <span className="event-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}