from fastapi import FastAPI
from pydantic import BaseModel
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from database import (
    operations_tasks_collection,
    marketing_tasks_collection,
    completed_operations_tasks_collection,
    completed_marketing_tasks_collection,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MarketingTaskCreate(BaseModel):
    title: str
    phone: str | None = None
    date: str | None = None


class OperationsTaskCreate(BaseModel):
    title: str
    date: str | None = None


@app.get("/")
def home():
    return {"message": "CRM backend çalışıyor"}


@app.post("/operations-tasks")
async def create_operations_task(task: OperationsTaskCreate):
    new_task = {
        "title": task.title,
        "date": task.date,
        "completed": False
    }

    result = await operations_tasks_collection.insert_one(new_task)
    new_task["_id"] = str(result.inserted_id)

    return new_task


@app.get("/operations-tasks")
async def get_operations_tasks():
    tasks = []

    cursor = operations_tasks_collection.find({})

    async for task in cursor:
        task["_id"] = str(task["_id"])
        tasks.append(task)

    return tasks


@app.post("/marketing-tasks")
async def create_marketing_task(task: MarketingTaskCreate):
    new_task = {
        "title": task.title,
        "phone": task.phone,
        "date": task.date,
        "completed": False
    }

    result = await marketing_tasks_collection.insert_one(new_task)
    new_task["_id"] = str(result.inserted_id)

    return new_task


@app.get("/marketing-tasks")
async def get_marketing_tasks():
    tasks = []

    cursor = marketing_tasks_collection.find({})

    async for task in cursor:
        task["_id"] = str(task["_id"])
        tasks.append(task)

    return tasks

@app.patch("/operations-tasks/{task_id}/complete")
async def complete_operations_task(task_id: str):
    task = await operations_tasks_collection.find_one({"_id": ObjectId(task_id)})

    if not task:
        return {"message": "Operation task not found"}

    task["completed"] = True
    task["originalTaskId"] = str(task["_id"])
    task["_id"] = ObjectId()

    await completed_operations_tasks_collection.insert_one(task)
    await operations_tasks_collection.delete_one({"_id": ObjectId(task_id)})

    task["_id"] = str(task["_id"])

    return task




@app.delete("/operations-tasks/{task_id}")
async def delete_operations_task(task_id: str):
    await operations_tasks_collection.delete_one({"_id": ObjectId(task_id)})

    return {"message": "Operation task deleted"}


@app.patch("/marketing-tasks/{task_id}/complete")
async def complete_marketing_task(task_id: str):
    task = await marketing_tasks_collection.find_one({"_id": ObjectId(task_id)})

    if not task:
        return {"message": "Marketing task not found"}

    task["completed"] = True
    task["originalTaskId"] = str(task["_id"])
    task["_id"] = ObjectId()

    await completed_marketing_tasks_collection.insert_one(task)
    await marketing_tasks_collection.delete_one({"_id": ObjectId(task_id)})

    task["_id"] = str(task["_id"])

    return task


@app.delete("/marketing-tasks/{task_id}")
async def delete_marketing_task(task_id: str):
    await marketing_tasks_collection.delete_one({"_id": ObjectId(task_id)})

    return {"message": "Marketing task deleted"}



@app.get("/completed-operations-tasks")
async def get_completed_operations_tasks():
    tasks = []

    cursor = completed_operations_tasks_collection.find({})

    async for task in cursor:
        task["_id"] = str(task["_id"])
        tasks.append(task)

    return tasks


@app.get("/completed-marketing-tasks")
async def get_completed_marketing_tasks():
    tasks = []

    cursor = completed_marketing_tasks_collection.find({})

    async for task in cursor:
        task["_id"] = str(task["_id"])
        tasks.append(task)

    return tasks