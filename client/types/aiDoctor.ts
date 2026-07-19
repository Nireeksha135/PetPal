export interface AIConsultation {
  id: string;
  petId: string;
  ownerId: string;
  title: string;
  symptoms: string;
  imageUrl: string | null;
  aiResponse: string;
  createdAt: string;
}

interface RawAIConsultation {
  id: string;
  pet_id: string;
  owner_id: string;
  title: string;
  symptoms: string;
  image_url: string | null;
  ai_response: string;
  created_at: string;
}

export function mapAIConsultation(raw: RawAIConsultation): AIConsultation {
  return {
    id: raw.id,
    petId: raw.pet_id,
    ownerId: raw.owner_id,
    title: raw.title,
    symptoms: raw.symptoms,
    imageUrl: raw.image_url,
    aiResponse: raw.ai_response,
    createdAt: raw.created_at,
  };
}
