import React from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'

interface Props {
  totalPages: number
  currentPage: number
  pageClick: (index: number) => void
}

const Pagination = ({ totalPages, currentPage, pageClick }: Props) => {
  const pages = []
  for (let index = 0; index < totalPages; index++) {
    if (index === currentPage) {
      pages.push(
        <a
          onClick={() => pageClick(index)}
          className="text-sm font-medium leading-none cursor-pointer text-blue-700 border-t border-blue-400 pt-3 mr-4 px-2"
          key={index + 1}
        >
          {index + 1}
        </a>
      )
    } else {
      pages.push(
        <a
          onClick={() => pageClick(index)}
          className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-blue-700 border-t border-transparent hover:border-blue-400 pt-3 mr-4 px-2"
          key={index + 1}
        >
          {index + 1}
        </a>
      )
    }
  }
  return (
    <div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
      <div className="lg:w-3/5 w-full  flex items-center justify-between border-t border-gray-200">
        <a
          onClick={() => pageClick(currentPage - 1)}
          className="flex items-center pt-3 text-gray-600 hover:text-blue-700 cursor-pointer"
        >
          <AiOutlineArrowLeft />
          <p className="text-sm ml-3 font-medium leading-none ">Previous</p>
        </a>
        <div className="sm:flex hidden">{pages}</div>
        <a
          onClick={() => pageClick(currentPage + 1)}
          className="flex items-center pt-3 text-gray-600 hover:text-blue-700 cursor-pointer"
        >
          <p className="text-sm font-medium leading-none mr-3">Next</p>
          <AiOutlineArrowRight />
        </a>
      </div>
    </div>
  )
}

export default Pagination
