"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Download, Upload, FileText } from "lucide-react";

export default function ProductImportExportPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/admin/products/template");
      if (!response.ok) throw new Error("Failed to download template");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-import-template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      setExporting(true);
      const response = await fetch(`/api/admin/products/export?format=${format}`);
      if (!response.ok) throw new Error("Failed to export products");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products-export-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Products exported to ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error("Error exporting products:", error);
      toast.error("Failed to export products");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setImportResults(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", file.name.endsWith(".json") ? "json" : "csv");

      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.validationErrors) {
          setImportResults({
            success: false,
            validationErrors: result.validationErrors,
          });
          toast.error("Validation failed. Please check the errors below.");
        } else {
          throw new Error(result.error || "Import failed");
        }
      } else {
        setImportResults(result.results);
        toast.success(
          `Import completed! ${result.results.success} products imported successfully.`
        );
      }
    } catch (error: any) {
      console.error("Error importing products:", error);
      toast.error(error.message || "Failed to import products");
    } finally {
      setImporting(false);
      // Reset input
      event.target.value = "";
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Product Import/Export</h1>
      <p className="text-gray-600 mb-8">
        Bulk manage your products with CSV or JSON files
      </p>

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Download className="mr-2" size={24} />
          Export Products
        </h2>
        <p className="text-gray-600 mb-4">
          Download all your products in CSV or JSON format
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => handleExport("csv")}
            disabled={exporting}
            className="flex items-center"
          >
            <Download className="mr-2" size={16} />
            {exporting ? "Exporting..." : "Export to CSV"}
          </Button>
          <Button
            onClick={() => handleExport("json")}
            disabled={exporting}
            variant="outline"
            className="flex items-center"
          >
            <Download className="mr-2" size={16} />
            {exporting ? "Exporting..." : "Export to JSON"}
          </Button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Upload className="mr-2" size={24} />
          Import Products
        </h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV or JSON file to bulk import products
        </p>

        <div className="mb-4">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="flex items-center mb-4"
          >
            <FileText className="mr-2" size={16} />
            Download CSV Template
          </Button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload size={48} className="text-gray-400 mb-2" />
            <span className="text-lg font-medium">
              {importing ? "Importing..." : "Click to upload CSV or JSON"}
            </span>
            <span className="text-sm text-gray-500">
              or drag and drop your file here
            </span>
          </label>
        </div>

        {/* Import Instructions */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <h3 className="font-semibold mb-2">Import Instructions:</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Download the template to see the required format</li>
            <li>Required fields: title, description, type, gender, colors, price, sizes</li>
            <li>Colors and sizes should be comma-separated (e.g., &quot;Red,Blue,Green&quot;)</li>
            <li>Image URLs should be comma-separated URLs (will be fetched and stored)</li>
            <li>Gender must be: Men, Women, or Unisex</li>
            <li>Featured and inStock should be: true or false</li>
          </ul>
        </div>
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Import Results</h2>

          {importResults.success !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-green-600 font-medium">
                  Success: {importResults.success}
                </span>
                <span className="text-red-600 font-medium">
                  Failed: {importResults.failed}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      (importResults.success /
                        (importResults.success + importResults.failed)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {importResults.errors && importResults.errors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">Errors:</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {importResults.errors.map((err: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-red-50 border-l-4 border-red-400 p-3 text-sm"
                  >
                    <span className="font-medium">{err.product}:</span>{" "}
                    {err.error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResults.validationErrors && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">
                Validation Errors:
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {importResults.validationErrors.map((err: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-red-50 border-l-4 border-red-400 p-3 text-sm"
                  >
                    <span className="font-medium">Row {err.row}:</span>
                    <ul className="list-disc list-inside mt-1">
                      {err.errors.map((e: string, i: number) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
