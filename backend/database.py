import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

operations_tasks_collection = db["operations_tasks"]
marketing_tasks_collection = db["marketing_tasks"]

completed_operations_tasks_collection = db["completed_operations_tasks"]
completed_marketing_tasks_collection = db["completed_marketing_tasks"]