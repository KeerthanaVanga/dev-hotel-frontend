import { Formik, Form } from "formik";
import { useToast } from "../components/layout/ToastProvider";
import { FormStepRoomDates } from "../components/bookings/FormStepRoomDates";
import { FormStepGuestDetails } from "../components/bookings/FormStepGuestDetails";
import { FormStepPayment } from "../components/bookings/FormStepPayment";
import { StepIndicator } from "../components/bookings/StepIndicator";
import { FormActions } from "../components/bookings/FormActions";
import { useCreateBooking } from "../hooks/useCreateBooking";
import type { CreateBookingFormValues } from "../types/CreateBookingForm";
import { INITIAL_CREATE_BOOKING_FORM } from "../types/CreateBookingForm";
import type { CreateBookingPayload } from "../api/bookings.api";

export default function CreateBookingPage() {
  const { showToast } = useToast();
  const {
    step,
    availabilityError,
    availabilityMutation,
    mutation,
    currentSchema,
    handleNext,
    handleBack,
  } = useCreateBooking(showToast);

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Create booking</h1>

      <StepIndicator currentStep={step} />

      <div className="rounded-xl border border-[#3A1A22] bg-gradient-to-b from-[#241217] to-[#1F1216] p-6">
        <Formik<CreateBookingFormValues>
          initialValues={INITIAL_CREATE_BOOKING_FORM}
          validationSchema={currentSchema}
          validateOnChange
          validateOnBlur
          onSubmit={async (vals) => {
            const payload: CreateBookingPayload = {
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
            };
            if (vals.guest_type === "existing" && vals.selected_user_id) {
              payload.user_id = Number(vals.selected_user_id);
            }
            await mutation.mutateAsync(payload);
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
              />

              <div className="min-h-[1.25rem] text-center text-sm text-red-400">
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
