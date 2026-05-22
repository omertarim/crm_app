import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      <h1 className="text-4xl font-bold mb-10">CRM Task Yönetimi</h1>

      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        <Link href="/marketing" className="bg-white p-8 rounded-xl shadow text-2xl font-bold">
          Pazarlama İşleri
        </Link>

        <Link href="/operations" className="bg-white p-8 rounded-xl shadow text-2xl font-bold">
          Operasyonel İşler
        </Link>

        <Link href="/completed-marketing" className="bg-white p-8 rounded-xl shadow text-2xl font-bold">
          Tamamlanan Pazarlama İşleri
        </Link>

        <Link href="/completed-operations" className="bg-white p-8 rounded-xl shadow text-2xl font-bold">
          Tamamlanan Operasyonel İşler
        </Link>
      </div>
    </main>
  );
}