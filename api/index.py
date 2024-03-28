from fastapi import FastAPI

app = FastAPI()


@app.get("/api/python")
def hello_world():
    print('punchy')
    return {"message": "Hello World"}



