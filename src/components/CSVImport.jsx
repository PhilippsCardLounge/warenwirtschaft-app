import Papa from "papaparse";

export default function CSVImport({
  onDataImported
}) {
  function handleFileUpload(e) {
    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ",",

      complete: function (
        results
      ) {
        console.log(
          "RAW:",
          results.data
        );

        const cleaned =
          results.data
            .map((row) => ({
              seller:
                row["seller"] ||
                "",

              title:
                row[
                  "product name"
                ] || "",

              date:
                row[
                  "processed date"
                ] || "",

              price:
                parsePrice(
                  row["total"]
                )
            }))

            // 🔥 Nur gültige Beträge > 0 übernehmen
            .filter(
              (row) =>
                Number.isFinite(
                  row.price
                ) &&
                row.price > 0
            );

        console.log(
          "CLEANED:",
          cleaned
        );

        onDataImported(
          cleaned
        );
      }
    });
  }

  function parsePrice(
    priceString
  ) {
    if (!priceString) {
      return 0;
    }

    const price =
      parseFloat(
        priceString
          .replace("€", "")
          .replace(",", ".")
          .replace(
            /[^\d.]/g,
            ""
          )
      );

    return Number.isFinite(
      price
    )
      ? price
      : 0;
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={
          handleFileUpload
        }
      />
    </div>
  );
}