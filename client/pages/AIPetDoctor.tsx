import { useState } from "react";
import { Sparkles, PawPrint } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import {
  useAllConsultations,
  useCreateConsultation,
} from "@/hooks/useAIDoctor";
import AIDisclaimerBanner from "@/components/aiDoctor/AIDisclaimerBanner";
import SymptomForm from "@/components/aiDoctor/SymptomForm";
import AIResponseCard from "@/components/aiDoctor/AIResponseCard";
import ConsultationHistoryItem from "@/components/aiDoctor/ConsultationHistoryItem";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/Button";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "@/services/api";
import type { AIConsultation } from "@/types/aiDoctor";

export default function AIPetDoctor() {
  const { data: pets, isLoading: petsLoading } = usePets();
  const { data: consultations, isLoading: historyLoading } = useAllConsultations();
  const { mutate, isPending } = useCreateConsultation();

  const [serverError, setServerError] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<AIConsultation | null>(null);

  const handleSubmit = (values: { petId: string; symptoms: string; image: File | null }) => {
    setServerError(null);
    mutate(
      { petId: values.petId, symptoms: values.symptoms, image: values.image },
      {
        onSuccess: (consultation) => setLatestResult(consultation),
        onError: (error) => setServerError(getApiErrorMessage(error)),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Pet Doctor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what's going on, and get general guidance in seconds.
        </p>
      </div>

      <AIDisclaimerBanner />

      {!petsLoading && (!pets || pets.length === 0) ? (
        <EmptyState
          icon={PawPrint}
          title="Add a pet first"
          description="You'll need at least one pet profile to use AI Pet Doctor."
          action={
            <Link to="/pets/new">
              <Button size="sm">Add a Pet</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              {pets && (
                <SymptomForm
                  pets={pets}
                  isSubmitting={isPending}
                  serverError={serverError}
                  onSubmit={handleSubmit}
                />
              )}
            </div>

            {isPending && (
              <div className="mt-6 rounded-2xl bg-card p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="animate-pulse text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Thinking through the symptoms...
                  </span>
                </div>
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            )}

            {!isPending && latestResult && (
              <div className="mt-6">
                <AIResponseCard consultation={latestResult} />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-4 text-base font-semibold">Past Consultations</h2>
              {historyLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : !consultations || consultations.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No consultations yet"
                  description="Your AI Pet Doctor history will appear here."
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {consultations.map((c, i) => (
                    <ConsultationHistoryItem key={c.id} consultation={c} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
