import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";
import { FormStepRoomDates } from "../components/bookings/FormStepRoomDates";
import { FormStepGuestDetails } from "../components/bookings/FormStepGuestDetails";
import { FormStepPayment } from "../components/bookings/FormStepPayment";
import { StepIndicator } from "../components/bookings/StepIndicator";
import { FormActions } from "../components/bookings/FormActions";
import RescheduleBookingSkeleton from "../components/bookings/RescheduleBookingSkeleton";
import { useRescheduleBooking } from "../hooks/useRescheduleBooking";
import { getBookingById, bookingDetailToFormValues } from "../api/bookings.api";
import type { CreateBookingFormValues } from "../types/CreateBookingForm";

export default function RescheduleBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    data: bookingResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id!),
    enabled: Boolean(id),
  });

  const {
    step,
    availabilityError,
    availabilityMutation,
    mutation,
    currentSchema,
    handleNext,
    handleBack,
  } = useRescheduleBooking(id ?? "", showToast);

  const initialValues: CreateBookingFormValues = bookingResponse?.data
    ? bookingDetailToFormValues(bookingResponse.data)
    : {
        room_id: "",
        check_in: "",
        check_out: "",
        guest_type: "new",
        selected_user_id: "",
        guest_name: "",
        guest_email: "",
        whatsapp_number: "",
        adults: "1",
        children: "0",
        payment_method: "online",
      };

  if (!id) {
    navigate("/bookings", { replace: true });
    return null;
  }

  if (isLoading || !bookingResponse?.data) {
    return <RescheduleBookingSkeleton />;
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">
          Reschedule booking
        </h1>
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load booking"}
        </p>
        <button
          type="button"
          onClick={() => navigate("/bookings")}
          className="rounded-md border border-[#3A1A22] px-4 py-2 text-sm text-[#F5DEB3]"
        >
          Back to bookings
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Reschedule booking</h1>

      <StepIndicator currentStep={step} />

      <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
        <Formik<CreateBookingFormValues>
          initialValues={initialValues}
          validationSchema={currentSchema}
          validateOnChange
          validateOnBlur
          enableReinitialize
          onSubmit={async (vals) => {
            await mutation.mutateAsync({
              room_id: Number(vals.room_id),
              check_in: vals.check_in,
              check_out: vals.check_out,
              guest_name: vals.guest_name.trim(),
              guest_email: vals.guest_email.trim() || undefined,
              whatsapp_number: vals.whatsapp_number.trim(),
              adults: Number(vals.adults),
              children:
                vals.children === "" ? undefined : Number(vals.children),
              payment_method: vals.payment_method,
            });
          }}
        >
          {({
            values,
            setFieldValue,
            setFieldTouched,
            setFieldError,
            errors,
            touched,
            handleSubmit,
            validateForm,
            setTouched,
          }) => (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 3) handleSubmit(e);
              }}
              className="space-y-6"
            >
              {step === 1 && (
                <FormStepRoomDates
                  values={values}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors={errors}
                  touched={touched}
                />
              )}
              {step === 2 && (
                <FormStepGuestDetails
                  values={values}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  setFieldError={setFieldError}
                  errors={errors}
                  touched={touched}
                />
              )}
              {step === 3 && (
                <FormStepPayment
                  values={values}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors={errors}
                  touched={touched}
                />
              )}

              <FormActions
                step={step}
                onBack={handleBack}
                onNext={() => handleNext(values, validateForm, setTouched)}
                onCreate={() => handleSubmit()}
                isNextLoading={availabilityMutation.isPending}
                isCreateLoading={mutation.isPending}
                submitLabel="Reschedule"
                submitLoadingLabel="Rescheduling…"
              />

              <div className="min-h-5 text-center text-sm text-red-400">
                {(availabilityError || mutation.isError) &&
                  (availabilityError ?? (mutation.error as Error).message)}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
