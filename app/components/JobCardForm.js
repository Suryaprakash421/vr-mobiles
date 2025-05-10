"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function JobCardForm({ jobCard, isEditing = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Form data submitted:", data);

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
        throw new Error(responseData.error || "Failed to save job card");
      }

      // Redirect to job cards list
      router.push("/job-cards");
      router.refresh();
    } catch (error) {
      console.error("Error saving job card:", error);
      setError(error.message || "Failed to save job card");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
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
            <p className="mt-3 text-gray-900 font-medium">
              {isEditing ? "Updating" : "Saving"} job card...
            </p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-blue-200 pb-2">
          Device Condition
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOn"
              {...register("isOn")}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
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

      <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-green-200 pb-2">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-purple-200 pb-2">
          Device Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="model"
              className="block text-sm font-semibold text-gray-800"
            >
              Model *
            </label>
            <input
              type="text"
              id="model"
              {...register("model", { required: "Model is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
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
              className="block text-sm font-semibold text-gray-800"
            >
              Complaint *
            </label>
            <textarea
              id="complaint"
              {...register("complaint", { required: "Complaint is required" })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
            />
            {errors.complaint && (
              <p className="mt-1 text-sm text-red-600">
                {errors.complaint.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-amber-500">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 border-b border-amber-200 pb-2">
          Financial Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="admissionFees"
              className="block text-sm font-semibold text-gray-800"
            >
              Admission Fees
            </label>
            <input
              type="number"
              id="admissionFees"
              step="0.01"
              {...register("admissionFees")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="estimate"
              className="block text-sm font-semibold text-gray-800"
            >
              Estimate
            </label>
            <input
              type="number"
              id="estimate"
              step="0.01"
              {...register("estimate")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="advance"
              className="block text-sm font-semibold text-gray-800"
            >
              Advance
            </label>
            <input
              type="number"
              id="advance"
              step="0.01"
              {...register("advance")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="finalAmount"
              className="block text-sm font-semibold text-gray-800"
            >
              Final Amount
            </label>
            <input
              type="number"
              id="finalAmount"
              step="0.01"
              {...register("finalAmount")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-3 border border-transparent rounded-md shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
