"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const formSchema = z.object({
  originalUrl: z.string().url(),
  slug: z.string().optional(),
  securityCode: z.string().optional(),
  expiryDate: z.string().optional(),
  utmSource: z.string().min(1, "Source is required"),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdvancedPage() {
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [isExpiryDateEnabled, setIsExpiryDateEnabled] = useState(false);
  const [isABTestingEnabled, setIsABTestingEnabled] = useState(false);
  const [isUTMEnabled, setIsUTMEnabled] = useState(false);

  const [linkConfig, setLinkConfig] = useState({
    A: { url: "", percentage: 50 },
    B: { url: "", percentage: 50 },
    C: { url: "", percentage: 0 },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      abTesting: isABTestingEnabled ? linkConfig : null,
      utm: isUTMEnabled
        ? {
            source: data.utmSource,
            medium: data.utmMedium,
            campaign: data.utmCampaign,
            term: data.utmTerm,
            content: data.utmContent,
          }
        : null,
    };

    console.log("Form submitted:", payload);
  };

  const handleLinkConfigChange = (
    link: keyof typeof linkConfig,
    field: "url" | "percentage",
    value: string | number
  ) => {
    setLinkConfig((prev) => ({
      ...prev,
      [link]: { ...prev[link], [field]: value },
    }));
  };

  return (
    <main className="py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 bg-opacity-80 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Link Management
          </h1>

          {/* Basic URL Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Original URL
              </label>
              <input
                type="text"
                {...register("originalUrl")}
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
              />
              {errors.originalUrl && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid URL
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Slug
              </label>
              <div className="flex items-center border rounded-full overflow-hidden">
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                  mvst.co/
                </span>
                <input
                  type="text"
                  {...register("slug")}
                  className="flex-1 px-3 py-2 border-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Security Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="passwordToggle"
                checked={isPasswordEnabled}
                onChange={() => setIsPasswordEnabled(!isPasswordEnabled)}
                className="rounded"
              />
              <label
                htmlFor="passwordToggle"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Enable Password Protection
              </label>
            </div>
            {isPasswordEnabled && (
              <input
                type="password"
                {...register("securityCode")}
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                placeholder="Enter password"
              />
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="expiryToggle"
                checked={isExpiryDateEnabled}
                onChange={() => setIsExpiryDateEnabled(!isExpiryDateEnabled)}
                className="rounded"
              />
              <label
                htmlFor="expiryToggle"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Set Expiry Date
              </label>
            </div>
            {isExpiryDateEnabled && (
              <input
                type="datetime-local"
                {...register("expiryDate")}
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
              />
            )}
          </div>

          {/* A/B Testing Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="abTestingToggle"
                checked={isABTestingEnabled}
                onChange={() => setIsABTestingEnabled(!isABTestingEnabled)}
                className="rounded"
              />
              <label
                htmlFor="abTestingToggle"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Enable A/B/C Testing
              </label>
            </div>

            {isABTestingEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(linkConfig).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Link {key}
                    </label>
                    <input
                      type="text"
                      value={value.url}
                      onChange={(e) =>
                        handleLinkConfigChange(
                          key as keyof typeof linkConfig,
                          "url",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                      placeholder="Enter URL"
                    />
                    <input
                      type="number"
                      value={value.percentage}
                      onChange={(e) =>
                        handleLinkConfigChange(
                          key as keyof typeof linkConfig,
                          "percentage",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                      placeholder="Distribution %"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* UTM Parameters Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="utmToggle"
                checked={isUTMEnabled}
                onChange={() => setIsUTMEnabled(!isUTMEnabled)}
                className="rounded"
              />
              <label
                htmlFor="utmToggle"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Add UTM Parameters
              </label>
            </div>

            {isUTMEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Source *
                  </label>
                  <input
                    type="text"
                    {...register("utmSource")}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                    placeholder="google, facebook, newsletter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Medium
                  </label>
                  <input
                    type="text"
                    {...register("utmMedium")}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                    placeholder="cpc, banner, email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Campaign
                  </label>
                  <input
                    type="text"
                    {...register("utmCampaign")}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                    placeholder="summer_sale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Term
                  </label>
                  <input
                    type="text"
                    {...register("utmTerm")}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                    placeholder="running+shoes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content
                  </label>
                  <input
                    type="text"
                    {...register("utmContent")}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
                    placeholder="logolink"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Create Link"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
