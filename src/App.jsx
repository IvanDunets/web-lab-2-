import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Завантаження даних із PostgreSQL при відкритті сторінки
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: false });

    if (error) console.error('Помилка:', error);
    else setTasks(data);
    setLoading(false);
  }

  // 2. Додавання нового запису в базу даних
  async function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: newTask }])
      .select();

    if (error) {
      console.error('Помилка додавання:', error);
    } else {
      setTasks([data[0], ...tasks]); // Динамічне оновлення списку на екрані
      setNewTask('');
    }
  }

  // 3. Видалення запису з бази даних
  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Помилка видалення:', error);
    } else {
      setTasks(tasks.filter(task => task.id !== id)); // Динамічне видалення з екрану
    }
  }

  return (
    <div className="container">
      <h1>Лабораторна робота №2 (React + PostgreSQL)</h1>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="Введіть нове завдання..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Додати</button>
      </form>

      {loading ? (
        <p>Завантаження даних із бази...</p>
      ) : (
        <ul className="task-list">
          {tasks.length === 0 && <p>Список порожній. Додайте перший запис!</p>}
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task.id)} className="delete-btn">
                Видалити
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;