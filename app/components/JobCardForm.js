"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

export default function JobCardForm({ jobCard, isEditing = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: jobCard || {
      isOn: false,
      isOff: false,
      hasBattery: false,
      hasDoor: false,
      hasSim: false,
      hasSlot: false,
      customerName: "",
      address: "",
      mobileNumber: "",
      complaint: "",
      model: "",
      admissionFees: "",
      aadhaarNumber: "",
      estimate: "",
      advance: "",
      finalAmount: "",
      status: "pending", // Add default status
    },
  });

  // Watch the power state checkboxes
  const isOnValue = watch("isOn");
  const isOffValue = watch("isOff");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    // We don't need to manually show loading as the GlobalLoadingIndicator
    // will automatically detect form submissions and API calls

    try {
      console.log("Form data submitted:", data);
      console.log("Form data type:", typeof data);
      console.log("Form data keys:", Object.keys(data));
      console.log("Status value:", data.status);
      console.log("Status type:", typeof data.status);

      // Convert string values to numbers where needed
      const formattedData = {
        ...data,
        // Make sure these are either valid numbers or null
        admissionFees:
          data.admissionFees && data.admissionFees !== ""
            ? parseFloat(data.admissionFees)
            : null,
        estimate:
          data.estimate && data.estimate !== ""
            ? parseFloat(data.estimate)
            : null,
        advance:
          data.advance && data.advance !== "" ? parseFloat(data.advance) : null,
        finalAmount:
          data.finalAmount && data.finalAmount !== ""
            ? parseFloat(data.finalAmount)
            : null,
      };

      console.log("Formatted data:", formattedData);

      const url = isEditing
        ? `/api/job-cards/${jobCard?.id}`
        : "/api/job-cards";

      const method = isEditing ? "PUT" : "POST";

      console.log(`Sending ${method} request to ${url}`);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const responseData = await response.json();
      console.log("Response:", response.status, responseData);

      if (!response.ok) {
        console.error("API Error Response:", responseData);
        throw new Error(
          responseData.details ||
            responseData.error ||
            "Failed to save job card"
        );
      }

      // Redirect to job cards list
      router.push("/job-cards");
      router.refresh();
    } catch (error) {
      console.error("Error saving job card:", error);
      setError(error.message || "Failed to save job card");
    } finally {
      setIsSubmitting(false);
      // GlobalLoadingIndicator will automatically detect when the API call completes
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <LoadingOverlay
        isVisible={isSubmitting}
        message={`${isEditing ? "Updating" : "Saving"} job card...`}
        fullScreen={true}
      />

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Device Condition
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOn"
              {...register("isOn")}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
              onChange={(e) => {
                // If turning on, make sure isOff is turned off
                if (e.target.checked) {
                  setValue("isOff", false);
                }
              }}
            />
            <label
              htmlFor="isOn"
              className="ml-2 font-medium text-gray-900 cursor-pointer"
            >
              On
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOff"
              {...register("isOff")}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
              onChange={(e) => {
                // If turning off, make sure isOn is turned off
                if (e.target.checked) {
                  setValue("isOn", false);
                }
              }}
            />
            <label
              htmlFor="isOff"
              className="ml-2 font-medium text-gray-900 cursor-pointer"
            >
              Off
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasBattery"
              {...register("hasBattery")}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="hasBattery"
              className="ml-2 font-medium text-gray-900 cursor-pointer"
            >
              Battery
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasDoor"
              {...register("hasDoor")}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="hasDoor"
              className="ml-2 font-medium text-gray-900 cursor-pointer"
            >
              Door
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasSim"
              {...register("hasSim")}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="hasSim"
              className="ml-2 font-medium text-gray-900 cursor-pointer"
            >
              SIM
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasSlot"
              {...register("hasSlot")}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="hasSlot"
              className="ml-2 font-medium text-gray-900 cursor-pointer"
            >
              Slot
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Customer Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-semibold text-gray-900"
            >
              Customer Name *
            </label>
            <input
              type="text"
              id="customerName"
              {...register("customerName", {
                required: "Customer name is required",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-semibold text-gray-900"
            >
              Mobile Number *
            </label>
            <input
              type="text"
              id="mobileNumber"
              {...register("mobileNumber", {
                required: "Mobile number is required",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-gray-900"
            >
              Address
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="aadhaarNumber"
              className="block text-sm font-semibold text-gray-900"
            >
              Aadhaar Card Number
            </label>
            <input
              type="text"
              id="aadhaarNumber"
              {...register("aadhaarNumber")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Device Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="model"
              className="block text-sm font-semibold text-gray-900"
            >
              Model *
            </label>
            <input
              type="text"
              id="model"
              {...register("model", { required: "Model is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">
                {errors.model.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="complaint"
              className="block text-sm font-semibold text-gray-900"
            >
              Complaint *
            </label>
            <textarea
              id="complaint"
              {...register("complaint", { required: "Complaint is required" })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
            {errors.complaint && (
              <p className="mt-1 text-sm text-red-600">
                {errors.complaint.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Financial Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="admissionFees"
              className="block text-sm font-semibold text-gray-900"
            >
              Admission Fees
            </label>
            <input
              type="number"
              id="admissionFees"
              step="0.01"
              {...register("admissionFees")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="estimate"
              className="block text-sm font-semibold text-gray-900"
            >
              Estimate
            </label>
            <input
              type="number"
              id="estimate"
              step="0.01"
              {...register("estimate")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="advance"
              className="block text-sm font-semibold text-gray-900"
            >
              Advance
            </label>
            <input
              type="number"
              id="advance"
              step="0.01"
              {...register("advance")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="finalAmount"
              className="block text-sm font-semibold text-gray-900"
            >
              Final Amount
            </label>
            <input
              type="number"
              id="finalAmount"
              step="0.01"
              {...register("finalAmount")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="remainingPayment"
              className="block text-sm font-semibold text-gray-900"
            >
              Remaining Payment
            </label>
            <input
              type="text"
              id="remainingPayment"
              readOnly
              value={
                watch("finalAmount") && watch("advance")
                  ? `₹${(
                      parseFloat(watch("finalAmount")) -
                      parseFloat(watch("advance") || 0)
                    ).toFixed(2)}`
                  : watch("finalAmount") && !watch("advance")
                  ? `₹${parseFloat(watch("finalAmount")).toFixed(2)}`
                  : ""
              }
              className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm font-medium text-gray-900 px-3 py-2 cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-900"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-3 border border-transparent rounded-md shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isEditing ? "Update" : "Save"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
