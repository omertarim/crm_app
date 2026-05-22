"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  phone?: string;
  date?: string;
  completed: boolean;
}

export default function MarketingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const [search, setSearch] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const API_URL = "http://127.0.0.1:8000";

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/marketing-tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await axios.post(`${API_URL}/marketing-tasks`, {
      title,
      phone,
      date,
    });

    setTitle("");
    setPhone("");
    setDate("");
    fetchTasks();
  };

  const completeTask = async (id: string) => {
    await axios.patch(`${API_URL}/marketing-tasks/${id}/complete`);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`${API_URL}/marketing-tasks/${id}`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPhone = (task.phone || "")
      .toLowerCase()
      .includes(phoneFilter.toLowerCase());

    const matchesDate = dateFilter ? task.date === dateFilter : true;

    return matchesTitle && matchesPhone && matchesDate;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      <Link href="/" className="text-blue-600">
        ← Ana Menü
      </Link>

      <h1 className="text-4xl font-bold my-8">Pazarlama İşleri</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Yeni Pazarlama Görevi</h2>

        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            placeholder="Görev başlığı"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded"
            placeholder="Telefon opsiyonel"
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

        <div className="grid grid-cols-3 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
            placeholder="Başlığa göre ara"
          />

          <input
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="border p-2 rounded"
            placeholder="Telefona göre ara"
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
        <h2 className="text-2xl font-bold mb-4">Aktif Pazarlama İşleri</h2>

        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              {task.phone && (
                <p className="text-sm text-gray-600">Telefon: {task.phone}</p>
              )}
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