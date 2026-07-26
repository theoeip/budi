// Finance Dashboard — Financial overview page
// Placeholder component showing the finance dashboard structure.

export default function FinanceDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Ringkasan Keuangan</h1>
      <p className="mt-2 text-gray-600">Ringkasan keuangan dan indikator kinerja utama.</p>

      {/* Summary Cards Placeholder */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Pemasukan" value="Rp 0" trend="up" />
        <SummaryCard title="Total Pengeluaran" value="Rp 0" trend="down" />
        <SummaryCard title="Saldo Bersih" value="Rp 0" trend="neutral" />
        <SummaryCard title="Tertunda" value="0" trend="neutral" />
      </div>

      {/* Content Placeholder */}
      <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">Grafik dan metrik detail keuangan akan segera hadir.</p>
        <p className="mt-2 text-sm text-gray-400">
          (Fitur Manajemen Transaksi, Kategori, dan Laporan sedang dalam tahap pengembangan)
        </p>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}

function SummaryCard({ title, value, trend }: SummaryCardProps) {
  const trendColors = {
    up: 'border-l-green-500 bg-green-50',
    down: 'border-l-red-500 bg-red-50',
    neutral: 'border-l-blue-500 bg-blue-50',
  };

  return (
    <div className={`rounded-lg border border-l-4 p-6 ${trendColors[trend]}`}>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

