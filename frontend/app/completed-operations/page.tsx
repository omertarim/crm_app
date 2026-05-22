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

export default function CompletedOperationsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

const API_URL = "https://crm-app-ggxh.onrender.com";
  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/completed-operations-tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

      <h1 className="text-4xl font-bold my-8">
        Tamamlanan Operasyonel İşler
      </h1>

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
        {filteredTasks.map((task) => (
          <div key={task._id} className="border-b py-3 text-gray-500">
            <p className="font-medium line-through">{task.title}</p>

            {task.date && (
              <p className="text-sm line-through">Tarih: {task.date}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}