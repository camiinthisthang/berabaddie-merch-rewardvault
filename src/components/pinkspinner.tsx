import React from 'react';
import { PulseLoader } from 'react-spinners';

const PinkSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <PulseLoader color="#ec4899" size={15} margin={2} />
        <p className="mt-4 text-pink-500 font-bold">New Baddie Loading 🥰...</p>
      </div>
    </div>
  );
};

export default PinkSpinner;
