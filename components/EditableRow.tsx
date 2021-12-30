import React from 'react'

interface Props {
  editFormData: {
    name: string
    email: string
    role: string
  }
  handleEditFormChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleEditFormCancel: () => void
}

const EditableRow = ({ editFormData, handleEditFormChange, handleEditFormCancel }: Props) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <input
          className="w-full"
          type="text"
          placeholder="Name"
          name="name"
          id="name"
          onChange={handleEditFormChange}
          value={editFormData.name}
          required
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <input
          className="w-full"
          type="text"
          placeholder="Email"
          name="email"
          id="email"
          onChange={handleEditFormChange}
          value={editFormData.email}
          required
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select name="role" id="role" onChange={handleEditFormChange} value={editFormData.role}>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="super-admin">super-admin</option>
        </select>
      </td>
      <td className="px-6 py-4 text-right text-sm font-medium flex flex-row justify-between align-middle">
        <button type="submit" className="text-blue-600 hover:text-blue-900 hover:underline px-2">
          Save
        </button>
        <button
          onClick={handleEditFormCancel}
          type="button"
          className="text-blue-600 hover:text-blue-900 hover:underline px-2"
        >
          Cancel
        </button>
      </td>
    </tr>
  )
}

export default EditableRow
