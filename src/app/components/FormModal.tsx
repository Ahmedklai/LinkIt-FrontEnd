"use client";

import React, { useMemo, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { createNewUrl } from "../../api/createNewUrl";

const FormModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  initialUrl: string;
}> = ({ isOpen, onRequestClose, initialUrl }) => {
  const [defaultUrl, setDefaultUrl] = useState(initialUrl);

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

  const onSubmit = async (data: FormValues) => {
    try {
      const request = await createNewUrl({
        originalUrl: data.originalUrl,
        tags: data.tags?.split(","),
        securityCode: data.securityCode,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      });

      if (request?.success) {
        reset();
        onRequestClose();
      }
    } catch (error) {}
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Shorten URL"
      className="modal w-screen md:w-[50%]  bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-4 py-10 lg:px-10 w-full rounded-2xl flex flex-col gap-4 justify-between h-full"
      >
        <div className="w-full h-full flex flex-col gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Original URL
            </label>
            <input
              type="text"
              {...register("originalUrl")}
              // {...register("originalUrl", {
              //   value: initialUrl,
              //   onChange: (e) => setDefaultUrl(e.target.value),
              // })}
              // !FIX
              defaultValue={defaultUrl}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.originalUrl && (
              <p className="mt-2 text-sm text-red-600">
                Please enter a valid url
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              {...register("tags")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Security Code (optional)
            </label>
            <input
              type="text"
              {...register("securityCode")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date (optional)
            </label>
            <input
              type="date"
              {...register("expiryDate")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.expiryDate && (
              <p className="mt-2 text-sm text-red-600">
                Expiry date should be in the future
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : isSubmitSuccessful ? (
            <FontAwesomeIcon
              icon={faCheck}
              className="transition-transform transform scale-100"
            />
          ) : (
            "Shorten URL"
          )}
        </button>
      </form>
    </Modal>
  );
};

export default FormModal;
