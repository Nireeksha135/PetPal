from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.config import get_settings
from server.routes import (
    health,
    auth,
    dashboard,
    pets,
    medicines,
    vaccinations,
    deworming,
    flea_tick,
    vet_visits,
    documents,
    ai_doctor,
    chat,
)

settings = get_settings()

app = FastAPI(
    title="PetPal API",
    version="0.1.0",
    description="Backend API for PetPal — pet health and care tracking.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(pets.router, prefix="/api")
app.include_router(medicines.router, prefix="/api")
app.include_router(vaccinations.router, prefix="/api")
app.include_router(deworming.router, prefix="/api")
app.include_router(flea_tick.router, prefix="/api")
app.include_router(vet_visits.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(ai_doctor.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "PetPal API is running"}
