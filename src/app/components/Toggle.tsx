import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center space-x-3">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`block w-10 h-6 rounded-full ${
            checked ? "bg-blue-500" : "bg-gray-600"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition transform ${
            checked ? "translate-x-full bg-blue-100" : "bg-white"
          }`}
        ></div>
      </div>
      <span>{label}</span>
    </label>
  );
};

export default Toggle;
