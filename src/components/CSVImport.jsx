import Papa from "papaparse";

export default function CSVImport({ onDataImported }) {
  function handleFileUpload(e) {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ",", // 🔥 wichtig: Komma!
      complete: function (results) {
        console.log("RAW:", results.data);

        const cleaned = results.data.map(row => {
          return {
            seller: row["seller"] || "",
            title: row["product name"] || "",
            date: row["processed date"] || "",
            price: parsePrice(row["total"])
          };
        });

        console.log("CLEANED:", cleaned);

        onDataImported(cleaned);
      }
    });
  }

  function parsePrice(priceString) {
    if (!priceString) return 0;

    return parseFloat(
      priceString
        .replace("€", "")
        .replace(",", ".")
        .replace(/[^\d.]/g, "")
    );
  }

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}