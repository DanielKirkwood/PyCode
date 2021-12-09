import React, { AnimationEvent } from 'react'
import { TiTickOutline, TiTimes } from 'react-icons/ti'

interface Props {
  body: string
  type: 'Success' | 'Error'
  onAnimationEnd: (e: AnimationEvent<HTMLDivElement>) => void
}

const PopupMessage = ({ onAnimationEnd, body, type }: Props) => {
  return (
    <div
      className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md animate-fade-in-down absolute top-1/4 left-1/3 transform -translate-x-1/3 -translate-y-1/4"
      onAnimationEnd={onAnimationEnd}
    >
      <div className={`flex items-center justify-center w-12 ${type === 'Success' ? 'bg-green-500' : 'bg-red-500'}`}>
        {type === 'Success' ? (
          <TiTickOutline className="w-6 h-6 text-white fill-current" />
        ) : (
          <TiTimes className="w-6 h-6 text-white fill-current" />
        )}
      </div>
      <div className="px-4 py-2 -mx-3">
        <div className="mx-3">
          <span className={`font-semibold ${type === 'Success' ? 'text-green-500' : 'text-red-500'}`}>{type}</span>
          <p className="text-sm text-gray-600">{body}</p>
        </div>
      </div>
    </div>
  )
}

export default PopupMessage
