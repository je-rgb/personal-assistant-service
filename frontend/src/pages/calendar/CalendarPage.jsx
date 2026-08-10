// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { getEvents, createEvent, updateEvent, deleteEvent } from '../../api/calendar';
// import MonthCalendar from './MonthCalendar';
// import DayEventList from './DayEventList';
// import EventModal from './EventModal';
// import './Calendar.css';

import {useState, useEffect, useCallback, useMemo} from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../api/calendar';
import MonthCalendar from './MonthCalendar';
import DayEventList from './DayEventList';
import EventModal from './EventModal';
import './Calendar.css';


function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const monthStart = useMemo(() => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentMonth]);

  const monthEnd = useMemo(() => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentMonth]);

  const loadEvents = useCallback(async () => {
    const data = await getEvents(monthStart, monthEnd);
    setEvents(data);
  }, [monthStart.getTime(), monthEnd.getTime()]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // 날짜별로 일정 그룹핑 (달력에 점 표시용)
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const key = toDateKey(new Date(ev.startTime));
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  const selectedDayEvents = eventsByDate[toDateKey(selectedDate)] || [];

  function openCreateModal() {
    setEditingEvent(null);
    setModalOpen(true);
  }

  function openEditModal(event) {
    setEditingEvent(event);
    setModalOpen(true);
  }

  async function handleSave(formData) {
    if (editingEvent) {
      await updateEvent(editingEvent.id, formData);
      window.alert('일정이 수정되었습니다.');
    } else {
      await createEvent(formData);
      window.alert('일정이 등록되었습니다.');
    }
    setModalOpen(false);
    setEditingEvent(null);
    loadEvents();
  }

  async function handleDelete(id) {
    await deleteEvent(id);
    window.alert('일정이 삭제되었습니다.');
    loadEvents();
  }

  return (
    <div className="calendar-app">
      <MonthCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        eventsByDate={eventsByDate}
        onSelectDate={setSelectedDate}
        onPrevMonth={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
        onNextMonth={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
        onToday={() => { const t = new Date(); setCurrentMonth(t); setSelectedDate(t); }}
      />
      <DayEventList
        date={selectedDate}
        events={selectedDayEvents}
        onAdd={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
      {modalOpen && (
        <EventModal
          date={selectedDate}
          event={editingEvent}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingEvent(null); }}
        />
      )}
    </div>
  );
}