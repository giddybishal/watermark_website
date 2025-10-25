import { useContext, useRef, useState } from "react";
import { BookmarkContext } from "../contexts/BookmarkContext";
import Spinner from "../components/Spinner";
import FileUploadedConfirm from "../components/FileUploadedConfirm";

function Bookmark() {
  const { uploadFiles } = useContext(BookmarkContext);

  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [fileUploadedConfirm, setFileUploadedConfirm] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME-type validation (optional but recommended)
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      e.target.value = "";
      setPdfFile(null);
      setPdfFileName(null);
      return;
    }

    setPdfFile(file); // you already store the File
    setPdfFileName(file.name); // <-- access the filename here
    setFileUploadedConfirm(true);

    setTimeout(() => {
      setFileUploadedConfirm(false);
    }, 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      e.target.value = "";
      setImageFile(null);
      setImageFileName(null);
      return;
    }

    setImageFile(file);
    setImageFileName(file.name); // <-- image filename
    setFileUploadedConfirm(true);

    setTimeout(() => {
      setFileUploadedConfirm(false);
    }, 2000);
  };

  const handleUpload = async () => {
    if (!pdfFile || !imageFile) {
      alert("Please select both a PDF and an image");
      return;
    }

    try {
      setShowSpinner(true);
      const blob = await uploadFiles(pdfFile, imageFile);
      setDownloadBlob(blob);
      setShowSpinner(false);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };

  const handleDownload = () => {
    if (!downloadBlob) return;
    // Create a downloadable link
    const url = window.URL.createObjectURL(downloadBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watermarked.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen pt-10 bg-amber-100 relative">
      <div className="flex flex-col items-center gap-10 max-w-[90%] mx-auto mb-10">
        {/* PDF upload */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            name="uploadedPDF"
            accept=".pdf"
            onChange={handlePdfChange}
            ref={pdfInputRef}
            className="hidden"
            required
          />
          <button
            className="font-bold text-white bg-green-900 px-3 py-1 rounded-md cursor-pointer"
            onClick={() => pdfInputRef.current?.click()}
          >
            Upload PDF
          </button>
          {pdfFileName && (
            <div className="text-center mt-2 text-sm text-gray-700">
              Uploaded: {pdfFileName}
            </div>
          )}
        </div>

        {/* Image upload */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            name="uploadedImage"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInputRef}
            className="hidden"
            required
          />
          <button
            className="font-bold bg-green-600 px-3 py-1 rounded-md cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            Upload Image
          </button>
          {imageFileName && (
            <div className="text-center mt-2 text-sm text-gray-700">
              Uploaded: {imageFileName}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5 items-center">
          <button
            className="font-bold bg-yellow-600 px-3 py-1 rounded-md cursor-pointer"
            onClick={handleUpload}
          >
            Get bookmarked PDF
          </button>
          {showSpinner && (
            <>
              <Spinner />
              <span className="text-green-500 fold-bold">
                ...Creating Bookmarked pdf...
              </span>
            </>
          )}
          {downloadBlob && !showSpinner && (
            <button
              className="font-bold bg-orange-600 px-3 py-1 rounded-md cursor-pointer"
              onClick={handleDownload}
            >
              PDF ready for download :)
            </button>
          )}
        </div>
        {fileUploadedConfirm && <FileUploadedConfirm />}
      </div>
    </div>
  );
}

export default Bookmark;
