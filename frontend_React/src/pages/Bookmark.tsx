import { useContext, useRef, useState } from "react"
import { BookmarkContext } from "../contexts/BookmarkContext"
import Spinner from "../components/Spinner"

function Bookmark(){
    const { uploadFiles } = useContext(BookmarkContext)

    const pdfInputRef = useRef<HTMLInputElement | null>(null)
    const imageInputRef = useRef<HTMLInputElement | null>(null)

    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null)
    const [showSpinner, setShowSpinner] = useState(false)

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        setPdfFile(e.target.files[0])
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        setImageFile(e.target.files[0])
        }
    }

    const handleUpload = async ()=>{
        if (!pdfFile || !imageFile) {
            alert("Please select both a PDF and an image")
            return
        }

        try{
            setShowSpinner(true)
            const blob = await uploadFiles(pdfFile, imageFile)
            setDownloadBlob(blob)
            setShowSpinner(false)
            } catch (err) {
            console.error("Upload failed:", err)
            alert("Upload failed")
        }
    }

    const handleDownload = ()=>{
        if (!downloadBlob) return
        // Create a downloadable link
            const url = window.URL.createObjectURL(downloadBlob)
            const a = document.createElement("a")
            a.href = url
            a.download = "watermarked.pdf"
            a.click()
            window.URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full min-h-screen pt-10 bg-amber-100">
            <div className="flex flex-col items-center gap-10 max-w-[90%] mx-auto mb-10">
                <div>
                    <input type="file" name='uploadedPDF' accept=".pdf" onChange={handlePdfChange} ref={pdfInputRef} className="hidden" required/>
                    <button className="font-bold text-white bg-green-900 px-3 py-1 rounded-md cursor-pointer" onClick={()=>pdfInputRef.current?.click()}>Upload PDF</button>
                </div>
                <div>
                    <input type="file" name='uploadedImage' accept="image/*" onChange={handleImageChange} ref={imageInputRef} className="hidden" required/>
                    <button className="font-bold bg-green-600 px-3 py-1 rounded-md cursor-pointer" onClick={()=>imageInputRef.current?.click()}>Upload Image</button>
                </div>  
            <div className="flex flex-col gap-5 items-center">
                <button className="font-bold bg-yellow-600 px-3 py-1 rounded-md cursor-pointer" onClick={handleUpload}>Get bookmarked PDF</button>
                {showSpinner && <><Spinner /><span className="text-green-500 fold-bold">...Creating Bookmarked pdf...</span></>}
                {(downloadBlob&&!showSpinner) && <button className="font-bold bg-orange-600 px-3 py-1 rounded-md cursor-pointer" onClick={handleDownload}>PDF ready for download :)</button>}
            </div>
        </div>
    </div>
    )
}

export default Bookmark
