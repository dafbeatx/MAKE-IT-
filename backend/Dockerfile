FROM python:3.13-slim

# Set working directory
WORKDIR /code

# Copy requirements and install
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy all backend files
COPY . /code/

# Hugging Face Spaces berjalan di port 7860 secara default
EXPOSE 7860

# Jalankan server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
