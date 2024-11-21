"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Modal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface StatsListProps {
  title: string;
  data: { label: string; value: number; icon?: string }[];
  total: number;
  showAll?: boolean;
}

export function StatsList({
  title,
  data,
  total,
  showAll = false,
}: StatsListProps) {
  const bgByIndex = (index: number) => {
    const bgColors = [
      "bg-blue-100",
      "bg-red-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-indigo-100",
      "bg-pink-100",
      "bg-purple-100",
      "bg-gray-100",
    ];
    return bgColors[index % bgColors.length];
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => setIsModalOpen(false);

  const maxValue = Math.max(...data?.map((item) => item.value));

  const renderArray = showAll ? data : data.slice(0, 6);

  return (
    <>
      <div className="bg-blue-50 bg-opacity-70 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700 ">{title}</h3>
          <span className="text-sm text-gray-700 ">% CLICKS</span>
        </div>
        <div className="space-y-3">
          {renderArray.map((item, index) => {
            const percentageForWidth = Math.round(
              (item.value / maxValue) * 100
            );
            const percentageValue = Math.round((item.value / total) * 100);

            return (
              <div key={item.label} className="relative">
                <div
                  className={`absolute inset-0 ${bgByIndex(index)} rounded`}
                  style={{
                    width: `${percentageForWidth}%`,
                    transition: "width 0.3s ease-in-out",
                  }}
                />
                <div className="relative flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <img src={item.icon} alt="" className="w-6 h-4 rounded" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-slate-800">
                      {item.value}
                    </span>
                    <span className="text-sm text-gray-500 w-8 dark:text-gray-900 ">
                      {percentageValue}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {data.length > 7 && !showAll && (
          <button
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            View All
          </button>
        )}
      </div>
      <StatsModal
        stats={{ title, data, total }}
        isOpen={isModalOpen}
        onClose={onClose}
      />
    </>
  );
}

const StatsModal = ({
  stats,
  isOpen,
  onClose,
}: {
  stats: StatsListProps;
  isOpen: boolean;
  onClose?: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel={stats.title}
      className="modal relative w-screen lg:w-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
      overlayClassName="overlay"
      ariaHideApp={false}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      <div className=" rounded-lg p-8 w-96">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-6">
            Stats
          </h2>

          <FontAwesomeIcon
            icon={faTimes}
            onClick={onClose}
            className="cursor-pointer text-gray-700 dark:text-gray-300 bg-gray-600 bg-opacity-20 rounded-full p-2 h-4 w-4"
          />
        </div>
        <StatsList {...stats} showAll />
      </div>
    </Modal>
  );
};
