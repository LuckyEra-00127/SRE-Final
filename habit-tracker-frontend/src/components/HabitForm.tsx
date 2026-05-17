import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Habit, HabitCreate } from "../types/habit";

const habitSchema = z.object({
  name: z.string().trim().min(1, "Habit name is required").max(120, "Habit name is too long"),
  description: z.string().trim().max(2000, "Description is too long").optional(),
  frequency: z.enum(["daily", "weekly"], { required_error: "Frequency is required" })
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  initialHabit?: Habit;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (payload: HabitCreate) => Promise<void>;
}

export default function HabitForm({ initialHabit, submitLabel, isSubmitting, onSubmit }: HabitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialHabit?.name ?? "",
      description: initialHabit?.description ?? "",
      frequency: initialHabit?.frequency ?? "daily"
    }
  });

  const submit = async (values: HabitFormValues) => {
    await onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() || null,
      frequency: values.frequency
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="card max-w-2xl p-6">
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="label">
            Habit name
          </label>
          <input id="name" type="text" className="input" placeholder="Morning workout" {...register("name")} />
          {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="input resize-y"
            placeholder="What does success look like for this habit?"
            {...register("description")}
          />
          {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="frequency" className="label">
            Frequency
          </label>
          <select id="frequency" className="input" {...register("frequency")}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          {errors.frequency && <p className="mt-1.5 text-sm text-red-600">{errors.frequency.message}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Saving" : submitLabel}
        </button>
      </div>
    </form>
  );
}
