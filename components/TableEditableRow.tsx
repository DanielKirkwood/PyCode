import React from 'react'

type Props = {
  data: unknown
  protectedKeys: string[]
  handleCancelClick: () => void
  editedFormData: unknown
  handleInputFieldOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectFieldOnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

function TableEditableRow({
  data,
  protectedKeys,
  editedFormData,
  handleCancelClick,
  handleInputFieldOnChange,
}: Props): JSX.Element {
  return (
    <tr className="odd:bg-white even:bg-gray-50">
      {Object.keys(data).map((keyName, index) => {
        // do not allow user to edit any protected cells
        if (protectedKeys.includes(keyName)) {
          return (
            <td
              key={index}
              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900"
            >
              {String(data[keyName])}
            </td>
          )
        }
        let jsx: JSX.Element
        switch (typeof data[keyName]) {
          case 'string':
            jsx = (
              <td key={index} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <input
                  className="w-full"
                  type="text"
                  placeholder={data[keyName]}
                  name={keyName}
                  id={keyName}
                  onChange={handleInputFieldOnChange}
                  value={editedFormData[keyName]}
                  required
                />
              </td>
            )
            break
          case 'boolean':
            jsx = (
              <td key={index} className="px-6 py-4">
                <input
                  className="text-green-500 accent-green-500 checked:bg-green-500 bg-gray-500"
                  type="checkbox"
                  checked={editedFormData[keyName]}
                  name={keyName}
                  id={keyName}
                  onChange={handleInputFieldOnChange}
                  required
                />
              </td>
            )
            break
          default:
            // if type not found return a non editable cell
            jsx = (
              <td
                key={index}
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900"
              >
                {data[keyName]}
              </td>
            )
            break
        }
        return jsx
      })}
      <td className="px-6 py-4 text-sm font-medium flex flex-row justify-between align-middle">
        <button type="submit" className="text-blue-600 hover:text-blue-900 hover:underline pr-2">
          Save
        </button>
        <button onClick={handleCancelClick} type="button" className="text-blue-600 hover:text-blue-900 hover:underline">
          Cancel
        </button>
      </td>
    </tr>
  )
}

export default TableEditableRow
