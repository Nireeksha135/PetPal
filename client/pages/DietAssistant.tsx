import { useState } from "react";
import { Link } from "react-router-dom";
import { Salad, PawPrint, Sparkles } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { useAllDietPlans, useGenerateDietPlan } from "@/hooks/useDietPlans";
import DietDisclaimerBanner from "@/components/diet/DietDisclaimerBanner";
import DietPlanForm from "@/components/diet/DietPlanForm";
import DietPlanResult from "@/components/diet/DietPlanResult";
import DietPlanHistoryItem from "@/components/diet/DietPlanHistoryItem";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/Button";
import { getApiErrorMessage } from "@/services/api";
import type { DietPlan, DietPlanRequestPayload } from "@/types/dietPlan";

export default function DietAssistant() {
  const { data: pets, isLoading: petsLoading } = usePets();
  const { data: plans, isLoading: plansLoading } = useAllDietPlans();
  const { mutate, isPending } = useGenerateDietPlan();

  const [serverError, setServerError] = useState<string | null>(null);
  const [latestPlan, setLatestPlan] = useState<DietPlan | null>(null);

  const handleSubmit = (payload: DietPlanRequestPayload) => {
    setServerError(null);
    mutate(payload, {
      onSuccess: (plan) => setLatestPlan(plan),
      onError: (error) => setServerError(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Diet Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get personalized nutrition guidance based on your pet's profile.
        </p>
      </div>

      <DietDisclaimerBanner />

      {!petsLoading && (!pets || pets.length === 0) ? (
        <EmptyState
          icon={PawPrint}
          title="Add a pet first"
          description="You'll need at least one pet profile to use the Diet Assistant."
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
              {serverError && (
                <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {serverError}
                </div>
              )}
              {pets && (
                <DietPlanForm
                  pets={pets}
                  isSubmitting={isPending}
                  onSubmit={handleSubmit}
                />
              )}
            </div>

            {isPending && (
              <div className="mt-6 rounded-2xl bg-card p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="animate-pulse text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Putting together a nutrition plan...
                  </span>
                </div>
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            )}

            {!isPending && latestPlan && (
              <div className="mt-6">
                <DietPlanResult plan={latestPlan} />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-4 text-base font-semibold">Past Plans</h2>
              {plansLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : !plans || plans.length === 0 ? (
                <EmptyState
                  icon={Salad}
                  title="No plans yet"
                  description="Generated diet plans will show up here."
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {plans.map((plan, i) => (
                    <DietPlanHistoryItem key={plan.id} plan={plan} index={i} />
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
