"use client";

import React, { useMemo, useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { CreateNewUrlPayload } from "../../api/createNewUrl";

const FormModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  initialUrl: string;
  createNewUrl: (url: CreateNewUrlPayload) => Promise<{ success: boolean }>;
}> = ({ isOpen, onRequestClose, initialUrl, createNewUrl }) => {
  useEffect(() => {
    console.log(initialUrl);
    if (initialUrl && isOpen) {
      setDefaultUrl(initialUrl);
      methods.setValue("originalUrl", initialUrl);
      fetchOpenGraphData(initialUrl);
    }
  }, [initialUrl, isOpen]);
  const [defaultUrl, setDefaultUrl] = useState(initialUrl);
  const [openGraphData, setOpenGraphData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customImage, setCustomImage] = useState("");
  const [geoTargetingEntries, setGeoTargetingEntries] = useState<
    { country: string; url: string }[]
  >([]);

  const addGeoTargetingEntry = () => {
    setGeoTargetingEntries([...geoTargetingEntries, { country: "", url: "" }]);
  };

  const updateGeoTargetingEntry = (
    index: number,
    field: "country" | "url",
    value: string
  ) => {
    const updatedEntries = [...geoTargetingEntries];
    updatedEntries[index][field] = value;
    setGeoTargetingEntries(updatedEntries);
  };

  const removeGeoTargetingEntry = (index: number) => {
    const updatedEntries = geoTargetingEntries.filter((_, i) => i !== index);
    setGeoTargetingEntries(updatedEntries);
  };

  const [isDeviceTargetingEnabled, setIsDeviceTargetingEnabled] =
    useState(false);
  const [deviceTargetingEntries, setDeviceTargetingEntries] = useState<
    { device: string; url: string }[]
  >([]);

  const addDeviceTargetingEntry = () => {
    setDeviceTargetingEntries([
      ...deviceTargetingEntries,
      { device: "", url: "" },
    ]);
  };

  const updateDeviceTargetingEntry = (
    index: number,
    field: "device" | "url",
    value: string
  ) => {
    const updatedEntries = [...deviceTargetingEntries];
    updatedEntries[index][field] = value;
    setDeviceTargetingEntries(updatedEntries);
  };

  const removeDeviceTargetingEntry = (index: number) => {
    const updatedEntries = deviceTargetingEntries.filter((_, i) => i !== index);
    setDeviceTargetingEntries(updatedEntries);
  };

  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [isExpiryDateEnabled, setIsExpiryDateEnabled] = useState(false);
  const [isGeoTargetingEnabled, setIsGeoTargetingEnabled] = useState(false);

  const formSchema = useMemo(() => {
    return z.object({
      originalUrl: z.string().url(),
      tags: z.string().optional(),
      securityCode: z.string().optional(),
      expiryDate: z
        .string()
        .optional()
        .refine((value) => {
          if (value) {
            return new Date(value) > new Date();
          }
          return true;
        }),
      geoTargeting: z
        .object({
          country: z.string().optional(),
          urlForCountry: z.string().optional(),
        })
        .optional(),
    });
  }, []);

  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      originalUrl: initialUrl,
    },
  });

  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = methods;

  const fetchOpenGraphData = async (url: string) => {
    try {
      const response = await fetch(
        `https://api.linkpreview.net/?key=fa7221c53732e41cf1316859ddf436ac&q=${encodeURIComponent(
          url
        )}`
      );
      const data = await response.json();

      if (data.error) {
        console.error("Error fetching Open Graph data", data.error);
      } else {
        setOpenGraphData({
          title: data.title,
          description: data.description,
          image: data.image,
        });
      }
    } catch (error) {
      console.error("Error fetching Open Graph data", error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const request = await createNewUrl({
        originalUrl: data.originalUrl,
        tags: data.tags?.split(","),
        securityCode: data.securityCode,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      });

      if (request?.success) {
        setTimeout(() => {
          reset();
          onRequestClose();
        }, 1000);
      }
    } catch (error) {}
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Shorten URL"
      className="modal w-screen md:w-[70%] bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-4 py-10 lg:px-10 w-full rounded-2xl flex flex-col lg:flex-row gap-6 justify-between h-full"
      >
        {/* Left Side Form */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          {/* Original URL */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Original URL
            </label>
            <input
              disabled={isDeviceTargetingEnabled || isGeoTargetingEnabled}
              type="text"
              {...register("originalUrl")}
              defaultValue={defaultUrl}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.originalUrl && (
              <p className="mt-2 text-sm text-red-600">
                Please enter a valid URL
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxWidth: "300px",
              }}
            >
              <label
                htmlFor="workspace-slug"
                style={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Workspace Slug <span style={{ color: "#6b7280" }}>?</span>
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "4px 8px",
                }}
              >
                <span style={{ color: "#6b7280", marginRight: "8px" }}>
                  {"mvst.co/"}
                </span>
                <input
                  id="workspace-slug"
                  type="text"
                  {...register("tags")}
                  style={{
                    border: "none",
                    outline: "none",
                    flex: "1",
                    fontSize: "14px",
                  }}
                  placeholder="Enter slug"
                />
              </div>
            </div>
          </div>

          {/* Security Code */}
          <div className="form-group">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isPasswordEnabled}
                onChange={() => setIsPasswordEnabled(!isPasswordEnabled)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Enable Security Code
              </label>
            </div>
            {isPasswordEnabled && (
              <input
                type="text"
                {...register("securityCode")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            )}
          </div>

          {/* Expiry Date */}
          <div className="form-group">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isExpiryDateEnabled}
                onChange={() => setIsExpiryDateEnabled(!isExpiryDateEnabled)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Enable Expiry Date
              </label>
            </div>
            {isExpiryDateEnabled && (
              <input
                type="datetime-local"
                {...register("expiryDate")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            )}
            {errors.expiryDate && (
              <p className="mt-2 text-sm text-red-600">
                Expiry date should be in the future
              </p>
            )}
          </div>

          {/* Geo Targeting */}
          <div className="form-group">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isGeoTargetingEnabled}
                onChange={() => {
                  methods.setValue("originalUrl", "");

                  setIsGeoTargetingEnabled(!isGeoTargetingEnabled);
                }}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Enable Geo-Targeting
              </label>
            </div>
            {isGeoTargetingEnabled && (
              <div className="mt-2">
                {geoTargetingEntries.map((entry, index) => (
                  <div key={index} className="flex items-center gap-4 mb-2">
                    {/* Country Selector */}
                    <select
                      value={entry.country}
                      onChange={(e) =>
                        updateGeoTargetingEntry(
                          index,
                          "country",
                          e.target.value
                        )
                      }
                      className="block w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      {/* Add more countries as needed */}
                    </select>

                    {/* URL Input */}
                    <input
                      type="text"
                      placeholder="URL for the selected country"
                      value={entry.url}
                      onChange={(e) =>
                        updateGeoTargetingEntry(index, "url", e.target.value)
                      }
                      className="block w-2/3 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeGeoTargetingEntry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add New Entry Button */}
                <button
                  type="button"
                  onClick={addGeoTargetingEntry}
                  className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                >
                  Add Country
                </button>
              </div>
            )}
          </div>
          {/* Device Targeting */}
          <div className="form-group mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isDeviceTargetingEnabled}
                onChange={() => {
                  methods.setValue("originalUrl", "");

                  setIsDeviceTargetingEnabled(!isDeviceTargetingEnabled);
                }}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Enable Device Targeting
              </label>
            </div>
            {isDeviceTargetingEnabled && (
              <div className="mt-4">
                {deviceTargetingEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 mb-4 p-2 border border-gray-300 dark:border-gray-700 rounded-lg"
                  >
                    {/* Device Type Selector */}
                    <select
                      value={entry.device}
                      onChange={(e) =>
                        updateDeviceTargetingEntry(
                          index,
                          "device",
                          e.target.value
                        )
                      }
                      className="block w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Device</option>
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
                      <option value="tablet">Tablet</option>
                    </select>

                    {/* Icon Preview */}
                    <div className="flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300">
                      {entry.device === "desktop" && (
                        <FontAwesomeIcon icon="desktop" />
                      )}
                      {entry.device === "mobile" && (
                        <FontAwesomeIcon icon="mobile-alt" />
                      )}
                      {entry.device === "tablet" && (
                        <FontAwesomeIcon icon="tablet-alt" />
                      )}
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      placeholder="URL for this device"
                      value={entry.url}
                      onChange={(e) =>
                        updateDeviceTargetingEntry(index, "url", e.target.value)
                      }
                      className="block w-2/3 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeDeviceTargetingEntry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add New Entry Button */}
                <button
                  type="button"
                  onClick={addDeviceTargetingEntry}
                  className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                >
                  Add Device
                </button>
              </div>
            )}
          </div>

          {/* Custom Title */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Title (optional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Custom Description */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Description (optional)
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Custom Background Image */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Background Image (optional)
            </label>
            <input
              type="text"
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Create URL"
            )}
            {isSubmitSuccessful && (
              <FontAwesomeIcon icon={faCheck} className="ml-2" />
            )}
          </button>
        </div>

        {/* Right Side Preview */}
        <div className="h-full w-[40%] flex-col gap-6 items-center justify-center hidden lg:flex">
          <div className="border rounded-lg p-4 w-full max-w-md bg-gray-100 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {customTitle || openGraphData.title || "Preview Title"}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {customDescription ||
                openGraphData.description ||
                "Preview Description"}
            </p>
            <div className="mt-4">
              {customImage || openGraphData.image ? (
                <img
                  src={customImage || openGraphData.image}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="h-40 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
