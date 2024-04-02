import React from 'react';
import useFetchWithAuth from './useFetchWithAuth';

function BikesExportComponent() {
  
  const { data: bicycles, loading, error } = useFetchWithAuth('RentBikeControllers');

  function exportToCsv(filename, rows) {
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // BOM для UTF-8
    const csvContent = rows.map(e => e.join(";")).join("\n");
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  

  const prepareAndDownloadCsvForBikes = () => {
    if (!bicycles || bicycles.length === 0) {
      alert("Нет данных для экспорта");
      return;
    }

    const headers = ["Name", "Price", "Description"];
    const csvRows = [headers];
    bicycles.forEach(bike => {
      const row = [
        bike.name, 
        bike.price.toString(),
        bike.description
      ];
      csvRows.push(row);
    });

    exportToCsv("available_bikes.csv", csvRows);
  };

  return (
    <div>
      {loading && <p>Загрузка данных...</p>}
      {error && <p>Ошибка: {error.message}</p>}
      {!loading && !error && (
        <button onClick={prepareAndDownloadCsvForBikes} disabled={!bicycles || bicycles.length === 0}>
          Экспорт в CSV
        </button>
      )}
    </div>
  );
}

export default BikesExportComponent;
