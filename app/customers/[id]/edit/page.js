"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "../../../components/Layout";
import LoadingOverlay from "../../../components/LoadingOverlay";
import BackButton from "../../../components/BackButton";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    aadhaarNumber: "",
  });

  // Get the customer ID from the URL
  const customerId = params?.id;

  // Fetch customer data
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    async function fetchCustomer() {
      try {
        setLoading(true);
        const response = await fetch(`/api/customers/${customerId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch customer");
        }

        const data = await response.json();
        setCustomer(data);
        setFormData({
          name: data.name || "",
          mobileNumber: data.mobileNumber || "",
          address: data.address || "",
          aadhaarNumber: data.aadhaarNumber || "",
        });
      } catch (error) {
        console.error("Error fetching customer:", error);
        setError("Failed to load customer data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [session, status, customerId, router]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update customer");
      }

      // Redirect back to customer details page
      router.push(`/customers/${customerId}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating customer:", error);
      setError(error.message || "Failed to update customer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BackButton
                href={`/customers/${customerId}`}
                label="Back to customer"
                className="text-white hover:text-blue-100"
              />
              <h1 className="text-2xl font-extrabold">Edit Customer</h1>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <LoadingOverlay
            isVisible={submitting}
            message="Updating customer..."
            fullScreen={true}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
                  />
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
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
                  />
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
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="aadhaarNumber"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-medium text-gray-900 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push(`/customers/${customerId}`)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
