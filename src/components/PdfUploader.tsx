import { useState } from "react";

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);
    
    // FormData object banakar usmein file ko daal rahe hain
    const formData = new FormData();
    formData.append("pdfFile", file); // 'pdfFile' naam wahi hona chahiye jo backend mein hai

    try {
      // Backend server (jo port 4000 par chal raha hai) ko request bhej rahe hain
      const response = await fetch("https://backend-1-yuaw.onrender.com/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUrl(data.fileUrl); // Backend se mile URL ko state mein set kar rahe hain
        alert("File uploaded successfully!");
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during upload. Make sure the backend server is running.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={isUploading}
      />
      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg disabled:bg-gray-400"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload PDF"}
      </button>

      {url && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded PDF:</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}