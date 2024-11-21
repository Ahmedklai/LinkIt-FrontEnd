"use client";

import React from "react";
import Modal from "react-modal";
import { CreateNewUrlPayload } from "../../api/createNewUrl";
import LinkShortnerForm from "./LinkShortnerForm";
import { useRouter } from "next/navigation";

const FormModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  initialUrl: string;
  createNewUrl: (url: CreateNewUrlPayload) => Promise<{ success: boolean }>;
}> = ({ isOpen, onRequestClose, initialUrl, createNewUrl }) => {
  const { push } = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Shorten URL"
      className="modal relative w-screen md:w-[70%] bg-white dark:bg-gray-900 rounded-2xl shadow-lg  overflow-scroll max-h-[80vh]"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <LinkShortnerForm initialUrl={initialUrl} createNewUrl={createNewUrl} />
      <div className="w-full lg:flex lg:justify-end p-4">
        <button
          onClick={() => push("/advanced")}
          className="text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none "
        >
          Advanced Settings
        </button>
      </div>
    </Modal>
  );
};

export default FormModal;
