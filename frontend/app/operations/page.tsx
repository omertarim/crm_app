"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  date?: string;
  completed: boolean;
}

export default function OperationsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

const API_URL = "https://crm-app-ggxh.onrender.com";
  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/operations-tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await axios.post(`${API_URL}/operations-tasks`, {
      title,
      date,
    });

    setTitle("");
    setDate("");
    fetchTasks();
  };

  const completeTask = async (id: string) => {
    await axios.patch(`${API_URL}/operations-tasks/${id}/complete`);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`${API_URL}/operations-tasks/${id}`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDate = dateFilter ? task.date === dateFilter : true;

    return matchesTitle && matchesDate;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      <Link href="/" className="text-blue-600">
        ← Ana Menü
      </Link>

      <h1 className="text-4xl font-bold my-8">Operasyonel İşler</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Yeni Operasyon Görevi</h2>

        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            placeholder="Görev başlığı"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ekle
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Filtrele</h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
            placeholder="Başlığa göre ara"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Aktif Operasyonel İşler</h2>

        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              {task.date && (
                <p className="text-sm text-gray-600">Tarih: {task.date}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => completeTask(task._id)}
                className="bg-green-500 text-white px-2 rounded"
              >
                ✓
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}