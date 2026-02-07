import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormikErrors } from "formik";
import { checkAvailability, createBooking } from "../../api/bookings.api";
import type { CreateBookingFormValues } from "../../types/CreateBookingForm";
import { getStepSchema, type CreateBookingStep } from "../../utils/booking";

export function useCreateBooking(
  showToast: (type: "success" | "error", message: string) => void,
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<CreateBookingStep>(1);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const availabilityMutation = useMutation({
    mutationFn: checkAvailability,
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["calendarBookings"] });
      showToast("success", "Booking created successfully");
      navigate("/bookings", { replace: true });
    },
  });

  const currentSchema = getStepSchema(step);

  function getStepTouchedFields(
    step: number,
  ): Partial<Record<keyof CreateBookingFormValues, boolean>> {
    switch (step) {
      case 1:
        return { room_id: true, check_in: true, check_out: true };
      case 2:
        return {
          guest_type: true,
          selected_user_id: true,
          guest_name: true,
          guest_email: true,
          whatsapp_number: true,
          adults: true,
          children: true,
        };
      default:
        return {};
    }
  }

  async function handleNext(
    values: CreateBookingFormValues,
    validateForm: () => Promise<FormikErrors<CreateBookingFormValues>>,
    setTouched: (
      touched: Partial<Record<keyof CreateBookingFormValues, boolean>>,
    ) => void,
  ) {
    setAvailabilityError(null);
    setTouched(getStepTouchedFields(step));
    const errs = await validateForm();
    const fields = Object.keys(
      currentSchema.fields,
    ) as (keyof CreateBookingFormValues)[];
    const hasError = fields.some((f) => errs[f]);
    if (hasError) return;

    if (step === 1) {
      const result = await availabilityMutation
        .mutateAsync({
          room_id: Number(values.room_id),
          check_in: values.check_in,
          check_out: values.check_out,
        })
        .catch((err: Error) => {
          setAvailabilityError(err.message);
          return null;
        });
      if (result && !result.available) {
        setAvailabilityError(
          result.message ||
            "This room is not available for the selected dates.",
        );
        return;
      }
      if (result?.available) {
        showToast("success", "Booking is available");
        setStep((s) => (s + 1) as CreateBookingStep);
      }
      return;
    }
    setStep((s) => (s + 1) as CreateBookingStep);
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1) as CreateBookingStep);
  }

  return {
    step,
    setStep,
    availabilityError,
    availabilityMutation,
    mutation,
    currentSchema,
    handleNext,
    handleBack,
  };
}
