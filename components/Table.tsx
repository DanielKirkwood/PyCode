import React, { Fragment } from 'react'
import flattenChildren from 'react-keyed-flatten-children'

type RowProps = {
  data: Record<string, string>
}
type RowComponent = React.FunctionComponent<RowProps>

type TableProps = {
  headings: string[]
}
type TableComponent = React.FunctionComponent<TableProps> & { Row: RowComponent }

const Table: TableComponent = ({ children, headings }): JSX.Element => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-2/3 w-full mx-auto overflow-auto">
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
                <th scope="col" className="relative px-6 py-3 bg-gray-100 rounded-tl rounded-bl">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flattenChildren(children).map((child, index) => {
                return <Fragment key={index}>{child}</Fragment>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const Row: RowComponent = ({ data }: RowProps): JSX.Element => {
  return (
    <tr className="odd:bg-white even:bg-gray-50">
      {Object.keys(data).map((keyName, index) => {
        return (
          <td key={index} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
            {data[keyName]}
          </td>
        )
      })}
      <button className="px-6 py-4 text-blue-600 hover:text-blue-900 hover:underline">Edit</button>
    </tr>
  )
}

Table.Row = Row

export default Table
