import Papa from "papaparse";

function preserveSourceValue(value) {
  if (Array.isArray(value)) {
    return value.map(
      preserveSourceValue
    );
  }

  if (value == null) {
    return "";
  }

  return String(value);
}

function parsePrice(priceString) {
  if (!priceString) {
    return 0;
  }

  const normalized = String(
    priceString
  )
    .replace(/[^\d,.-]/g, "")
    .replace(/,(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const price = Number.parseFloat(
    normalized
  );

  return Number.isFinite(price)
    ? price
    : 0;
}

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

        const importedAt =
          new Date().toISOString();

        const headers =
          results.meta.fields || [];

        const cleaned =
          results.data
            .map((row, index) => {
              // Alle gelieferten CSV-Felder zusätzlich erhalten.
              // Die bisherigen Felder bleiben unverändert, damit
              // bestehende Abläufe weiter funktionieren.
              const rawRow =
                Object.fromEntries(
                  Object.entries(
                    row
                  ).map(
                    ([
                      key,
                      value
                    ]) => [
                      key,
                      preserveSourceValue(
                        value
                      )
                    ]
                  )
                );

              const rawTotal =
                rawRow["total"] ||
                "";

              const price =
                parsePrice(
                  rawTotal
                );

              const orderStatus =
                rawRow[
                  "order status"
                ] || "";

              const sourceRecordId =
                rawRow["order id"] ||
                rawRow[
                  "order numeric id"
                ] ||
                "";

              return {
                seller:
                  rawRow[
                    "seller"
                  ] || "",

                title:
                  rawRow[
                    "product name"
                  ] || "",

                date:
                  rawRow[
                    "processed date"
                  ] || "",

                price,

                orderStatus,

                sourceRecordId,

                sourcePlatform:
                  "Whatnot",

                sourceDataVersion:
                  1,

                sourceData: {
                  format: "csv",
                  fileName:
                    file.name,
                  fileSize:
                    file.size,
                  fileLastModified:
                    file.lastModified
                      ? new Date(
                          file.lastModified
                        ).toISOString()
                      : null,
                  importedAt,
                  rowNumber:
                    index + 2,
                  headers,
                  rawRow
                },

                sourceAmounts: {
                  currency:
                    rawRow[
                      "order currency"
                    ] || "",
                  soldPrice:
                    parsePrice(
                      rawRow[
                        "sold price"
                      ]
                    ),
                  subtotal:
                    parsePrice(
                      rawRow[
                        "subtotal"
                      ]
                    ),
                  shippingPrice:
                    parsePrice(
                      rawRow[
                        "shipping price"
                      ]
                    ),
                  taxes:
                    parsePrice(
                      rawRow[
                        "taxes"
                      ]
                    ),
                  taxesCurrency:
                    rawRow[
                      "taxes currency"
                    ] || "",
                  customs:
                    parsePrice(
                      rawRow[
                        "customs"
                      ]
                    ),
                  creditsApplied:
                    parsePrice(
                      rawRow[
                        "credits applied"
                      ]
                    ),
                  total: price
                },

                priceDerivation: {
                  sourceColumn:
                    "total",
                  rawValue:
                    rawTotal,
                  parsedValue:
                    price,
                  interpretation:
                    "legacy_total_as_purchase_price",
                  verificationStatus:
                    "unverified"
                }
              };
            })

            // 🔥 Nur gültige Beträge > 0 übernehmen
            .filter(
              (row) =>
                Number.isFinite(
                  row.price
                ) &&
                row.price > 0 &&
                row.orderStatus
                  .toLowerCase() !==
                  "cancelled"
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
