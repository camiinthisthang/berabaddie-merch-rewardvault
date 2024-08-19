import React from 'react';

const TextInput = ({ label, placeholder, id, type, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-baddie-light-pink rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-baddie-light-pink focus:border-baddie-light-pink sm:text-sm"
      />
    </div>
  );
};

export default TextInput;