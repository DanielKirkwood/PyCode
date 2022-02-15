import React from 'react'

type Props = {
  data: unknown
  editable: boolean
  handleEditClick: (data) => void
}

function TableRow({ data, editable, handleEditClick }: Props): JSX.Element {
  return (
    <tr className="odd:bg-white even:bg-gray-100">
      {Object.keys(data).map((key, index) => {
        return (
          <td key={index} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
            {String(data[key])}
          </td>
        )
      })}
      {editable && (
        <td>
          <button
            type="button"
            onClick={() => handleEditClick(data)}
            className="px-6 py-4 text-blue-600 hover:text-blue-900 hover:underline"
          >
            Edit
          </button>
        </td>
      )}
    </tr>
  )
}

export default TableRow
