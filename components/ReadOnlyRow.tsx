import React from 'react'

interface User {
  _id: string
  name: string
  email: string
  image: string
  role: string
  emailVerified: boolean
}

interface Props {
  user: User
  handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, user: User) => void
}

const ReadOnlyRow = ({ user, handleEditClick }: Props) => {
  return (
    <tr className="odd:bg-white even:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={(event) => handleEditClick(event, user)}
          className="text-blue-600 hover:text-blue-900 hover:underline"
        >
          Edit
        </button>
      </td>
    </tr>
  )
}

export default ReadOnlyRow
