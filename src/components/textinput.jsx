export default function TextInput({label, placeholder, id, type}) {
    return (
      <div>
        <label htmlFor="serialNumber" className="block text-sm font-medium leading-6 text-white border-4 border-red">
          {label}
        </label>
        <div className="mt-2 border-4 border-red">
          <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    )
  }