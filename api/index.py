from fastapi import FastAPI, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import PyPDF2
from decimal import Decimal
from starlette import status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp

class LimitUploadSize(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, max_upload_size: int) -> None:
        super().__init__(app)
        self.max_upload_size = max_upload_size

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.method == 'POST':
            if 'content-length' not in request.headers:
                return Response(status_code=status.HTTP_411_LENGTH_REQUIRED)
            content_length = int(request.headers['content-length'])
            if content_length > self.max_upload_size:
                return Response(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        return await call_next(request)

app = FastAPI()

app.add_middleware(LimitUploadSize, max_upload_size=50_000_000)

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


@app.get("/api/python")
def hello_world():
    print('punchy')
    return {"message": "Hello World"}

@app.post("/api/upload")
def upload_files(files: list[UploadFile]):
    # Process the uploaded files and combine PDFs
    print([file.filename for file in files])
    combined_pdf_data = combine_pdfs([file.file for file in files])

    # Return the combined PDF as a streaming response
    return StreamingResponse(
        io.BytesIO(combined_pdf_data),
        media_type='application/pdf',
        headers={
            'Content-Disposition': 'attachment; filename="testfile.pdf"'
        }
    )
