from sqlalchemy.orm import Session
from sqlalchemy import select

from server.models.diet_plan import DietPlan
from server.models.pet import Pet
from server.schemas.diet_plan import DietPlanRequest
from server.services.pet_service import get_pet, PetError
from server.services.gemini_client import get_text_model, GeminiError


class DietError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


SYSTEM_PROMPT = """You are PetPal's Diet Assistant, an AI that creates general feeding and \
nutrition guidance for pets based on the details an owner provides.

Rules you must always follow:
- Provide a general daily feeding guideline (approximate calories or portion sizes, feeding \
frequency, and food type suggestions such as protein source balance) appropriate for the \
pet's species, age, weight, and activity level.
- Suggest 2-4 practical tips relevant to their body condition and health goals (e.g. weight \
loss, weight gain, maintenance).
- If allergies or health conditions are mentioned, clearly account for them and suggest \
ingredients or additives to avoid.
- ALWAYS include a note recommending the owner confirm any diet plan or specific calorie \
targets with a licensed veterinarian, especially for pets with existing health conditions.
- NEVER recommend a specific medication or supplement dosage.
- Keep the tone practical, warm, and encouraging. Use short paragraphs or a light list \
structure. Keep the total response under 350 words.
"""


def _build_prompt(pet: Pet, request: DietPlanRequest) -> str:
    age_info = f", born {pet.date_of_birth}" if pet.date_of_birth else ", age unknown"
    weight_info = (
        f"Current weight: {request.current_weight_kg}kg. " if request.current_weight_kg else ""
    )
    goal_info = f"Goal weight: {request.goal_weight_kg}kg. " if request.goal_weight_kg else ""
    allergy_info = f"Allergies: {request.allergies}. " if request.allergies else "No known allergies. "
    health_info = (
        f"Health conditions: {request.health_conditions}. "
        if request.health_conditions
        else "No known health conditions. "
    )
    notes_info = f"Additional context from owner: {request.additional_notes}. " if request.additional_notes else ""

    return (
        f"{SYSTEM_PROMPT}\n\n"
        f"Pet: {pet.name}, a {pet.species.value}"
        f"{f' ({pet.breed})' if pet.breed else ''}{age_info}, gender: {pet.gender.value}.\n"
        f"Activity level: {request.activity_level.value}. "
        f"Body condition: {request.body_condition.value}. "
        f"{weight_info}{goal_info}{allergy_info}{health_info}{notes_info}"
    )


def generate_diet_plan(db: Session, owner_id: str, request: DietPlanRequest) -> DietPlan:
    try:
        pet = get_pet(db, owner_id, request.pet_id)
    except PetError as e:
        raise DietError(e.message, e.status_code)

    prompt = _build_prompt(pet, request)

    try:
        model = get_text_model()
        response = model.generate_content(prompt)
        ai_text = (response.text or "").strip()
        if not ai_text:
            raise DietError("The AI didn't return a response. Please try again.", 502)
    except GeminiError as e:
        raise DietError(e.message, e.status_code)
    except Exception as exc:
        raise DietError(f"AI request failed: {exc}", 502)

    plan = DietPlan(
        owner_id=owner_id,
        pet_id=request.pet_id,
        activity_level=request.activity_level,
        body_condition=request.body_condition,
        current_weight_kg=request.current_weight_kg,
        goal_weight_kg=request.goal_weight_kg,
        allergies=request.allergies,
        health_conditions=request.health_conditions,
        additional_notes=request.additional_notes,
        ai_recommendation=ai_text,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


def list_plans_for_pet(db: Session, owner_id: str, pet_id: str) -> list[DietPlan]:
    try:
        get_pet(db, owner_id, pet_id)
    except PetError as e:
        raise DietError(e.message, e.status_code)

    stmt = (
        select(DietPlan)
        .where(DietPlan.pet_id == pet_id, DietPlan.owner_id == owner_id)
        .order_by(DietPlan.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def list_plans_for_owner(db: Session, owner_id: str) -> list[DietPlan]:
    stmt = (
        select(DietPlan)
        .where(DietPlan.owner_id == owner_id)
        .order_by(DietPlan.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_plan(db: Session, owner_id: str, plan_id: str) -> DietPlan:
    plan = db.get(DietPlan, plan_id)
    if plan is None or plan.owner_id != owner_id:
        raise DietError("Diet plan not found.", 404)
    return plan


def delete_plan(db: Session, owner_id: str, plan_id: str) -> None:
    plan = get_plan(db, owner_id, plan_id)
    db.delete(plan)
    db.commit()
