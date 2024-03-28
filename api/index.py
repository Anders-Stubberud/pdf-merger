from fastapi import FastAPI, UploadFile
from fastapi.responses import StreamingResponse
import io
import PyPDF2
import io
from decimal import Decimal

app = FastAPI()

def combine_pdfs(files):
    pdf_writer = PyPDF2.PdfWriter()
    for file in files:
        # Read the file contents from the FileStorage object
        pdf_contents = file.read()

        # Create an in-memory buffer containing the file contents
        pdf_buffer = io.BytesIO(pdf_contents)

        # Open the PDF file using PyPDF2
        pdf_reader = PyPDF2.PdfReader(pdf_buffer)

        # Iterate over the pages and add them to the PDF writer
        for page in pdf_reader.pages:
            width, _ = page.mediabox.upper_right
            scale_factor = Decimal(595) / Decimal(width)  # Convert to Decimal for accurate division
            page.scale_by(float(scale_factor))  # Convert back to float for scaling
            pdf_writer.add_page(page)

    # Write the combined PDF to an in-memory buffer
    output_buffer = io.BytesIO()
    pdf_writer.write(output_buffer)
    buffer_contents = output_buffer.getvalue()

    return buffer_contents


@app.post("/api/upload")
def upload_files(files: list[UploadFile]):
    # Process the uploaded files and combine PDFs

    combined_pdf_data = combine_pdfs([file.file for file in files])

    # Return the combined PDF as a streaming response
    return StreamingResponse(
        io.BytesIO(combined_pdf_data),
        media_type='application/pdf',
        headers={
            'Content-Disposition': 'attachment; filename="testfile.pdf"'
        }
    )

