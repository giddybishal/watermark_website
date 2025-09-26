from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
import io
import os

router = APIRouter(
    prefix="/watermark",
    tags=["watermark"],
)

@router.post("/pdf")
async def watermark_pdf(pdf: UploadFile = File(...), watermark: UploadFile = File(...)):
    # Validate file types
    if pdf.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid PDF.")

    allowed_image_types = ["image/png", "image/jpeg", "image/webp"]
    if watermark.content_type not in allowed_image_types:
        raise HTTPException(status_code=400, detail=f"Watermark must be one of: {', '.join(allowed_image_types)}")

    # Load PDF and watermark in memory
    pdf_bytes = await pdf.read()
    main_pdf = PdfReader(io.BytesIO(pdf_bytes))
    first_page = main_pdf.pages[0]
    width, height = float(first_page.mediabox.width), float(first_page.mediabox.height)

    watermark_bytes = await watermark.read()
    wm_image = Image.open(io.BytesIO(watermark_bytes))
    wm_image = wm_image.resize((int(width), int(height))).convert("RGBA")

    # Add transparency
    alpha = wm_image.split()[3]
    alpha = alpha.point(lambda p: int(p * 0.3))  # 30% opacity
    wm_image.putalpha(alpha)

    # Convert watermark image to PDF in memory
    buffer = io.BytesIO()
    wm_image.save(buffer, format="PDF")
    buffer.seek(0)
    watermark_pdf = PdfReader(buffer)
    watermark_page = watermark_pdf.pages[0]

    # Merge watermark
    writer = PdfWriter()
    for page in main_pdf.pages:
        page.merge_page(watermark_page)
        writer.add_page(page)

    # Output final PDF in memory
    output_buffer = io.BytesIO()
    writer.write(output_buffer)
    output_buffer.seek(0)

    # Set filename for download
    original_name = os.path.splitext(pdf.filename)[0]
    watermarked_name = f"{original_name}_watermarked.pdf"

    return StreamingResponse(
        output_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={watermarked_name}"}
    )
