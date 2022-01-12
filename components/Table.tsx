import React, { Dispatch, Fragment, SetStateAction } from 'react'
import flattenChildren from 'react-keyed-flatten-children'

type RowProps = {
  data: Record<string, any>
  headings?: string[]
  editable?: boolean
  handleEditClick?: (e: React.MouseEvent<HTMLButtonElement>, data: Record<string, string>) => void
}
type RowComponent = React.FC<RowProps>

type EditableRowProps = {
  data: Record<string, any>
  headings?: string[]
  protectedNames?: string[]
  editFormData: Record<string, any>
  handleCancelClick: () => void
  handleEditOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
type EditableRowComponent = React.FC<EditableRowProps>

type PaginationProps = {
  limit: number
  skip: number
  numRows: number
  totalRows: number
  numRowsRemaining: number
  setSkip: Dispatch<SetStateAction<number>>
}

type PaginationComponent = React.FC<PaginationProps>

type TableProps = {
  headings: string[]
  editable?: boolean
  protectedNames: string[]
  handleEditClick?: (e: React.MouseEvent<HTMLButtonElement>, data: Record<string, string>) => void
  handleEditSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}
type TableComponent = React.FC<TableProps> & { Row: RowComponent } & {
  EditableRow: EditableRowComponent
} & { Pagination: PaginationComponent }

const Table: TableComponent = ({
  children,
  headings,
  editable,
  handleEditClick,
  handleEditSubmit,
  protectedNames,
}): JSX.Element => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="w-full mx-auto overflow-auto">
          {flattenChildren(children).map((child, index) => {
            if (React.isValidElement(child)) {
              if (child.type.displayName === 'Filter') {
                return <Fragment key={index}>{child}</Fragment>
              }
            }
          })}
          <form onSubmit={handleEditSubmit}>
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  {headings.map((heading, index) => {
                    return (
                      <th
                        key={index}
                        className="px-6 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl"
                      >
                        {heading}
                      </th>
                    )
                  })}
                  {editable && (
                    <th scope="col" className="relative px-6 py-3 bg-gray-100 rounded-tl rounded-bl">
                      <span className="sr-only">Edit</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flattenChildren(children).map((child) => {
                  if (React.isValidElement(child)) {
                    if (child.type.displayName === 'Row') {
                      return React.cloneElement(child, { headings, editable, handleEditClick })
                    } else if (child.type.displayName === 'EditableRow') {
                      return React.cloneElement(child, { headings, protectedNames })
                    }
                  }
                })}
              </tbody>
            </table>
          </form>
          {flattenChildren(children).map((child, index) => {
            if (React.isValidElement(child)) {
              if (child.type.displayName === 'Pagination') {
                return <Fragment key={index}>{child}</Fragment>
              }
            }
          })}
        </div>
      </div>
    </section>
  )
}

const Row: RowComponent = ({ data, headings, editable, handleEditClick }: RowProps): JSX.Element => {
  return (
    <tr className="odd:bg-white even:bg-gray-50">
      {Object.keys(data).map((keyName, index) => {
        if (!headings) {
          return
        }
        if (headings.includes(keyName)) {
          return (
            <td
              key={index}
              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900"
            >
              {String(data[keyName])}
            </td>
          )
        }
      })}
      {editable && (
        <td>
          <button
            type="button"
            onClick={(e) => handleEditClick(e, data)}
            className="px-6 py-4 text-blue-600 hover:text-blue-900 hover:underline"
          >
            Edit
          </button>
        </td>
      )}
    </tr>
  )
}

const EditableRow: EditableRowComponent = ({
  data,
  headings,
  handleCancelClick,
  handleEditOnChange,
  protectedNames,
  editFormData,
}: EditableRowProps): JSX.Element => {
  return (
    <tr className="odd:bg-white even:bg-gray-50">
      {Object.keys(data).map((keyName, index) => {
        if (!headings) {
          return
        }
        if (!headings.includes(keyName)) {
          return
        }
        // do not allow user to edit any protected cells
        if (protectedNames.includes(keyName)) {
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
                  onChange={handleEditOnChange}
                  value={editFormData[keyName]}
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
                  checked={editFormData[keyName]}
                  name={keyName}
                  id={keyName}
                  onChange={handleEditOnChange}
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

const Pagination: PaginationComponent = ({
  limit,
  skip,
  numRows,
  totalRows,
  numRowsRemaining,
  setSkip,
}: PaginationProps): JSX.Element => {
  return (
    <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
      <span className="text-xs xs:text-sm text-gray-900">
        Showing {Number(skip + 1)} to {Number(skip + numRows)} of {Number(totalRows)} Entries
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          disabled={Number(skip) === 0 ? true : false}
          onClick={() => setSkip(Number(skip - limit))}
          type="button"
          className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <button
          disabled={Number(numRowsRemaining) <= 0 ? true : false}
          onClick={() => setSkip(Number(skip + limit))}
          type="button"
          className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

Row.displayName = 'Row'
EditableRow.displayName = 'EditableRow'
Pagination.displayName = 'Pagination'
Table.displayName = 'Table'
Table.Row = Row
Table.EditableRow = EditableRow
Table.Pagination = Pagination

export default Table
