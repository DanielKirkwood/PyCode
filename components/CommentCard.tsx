import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { FaTrash, FaEdit } from 'react-icons/fa'
import PopupMessage from './PopupMessage'

interface Props {
  commentID: string
  owner: {
    id: string
    name: string
    role: string
  }
  body: string
  createdAt: string
  onDelete: (id: string, setMessage: unknown, setMessageVisible: unknown) => void
  onEditSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    commentID: string,
    originalBody: string,
    newBody: string,
    setMessage: unknown,
    setMessageVisible: unknown,
    onFormCancel: unknown,
    setIsEditable: unknown
  ) => void
}

const CommentCard = ({ commentID, owner, body, createdAt, onDelete, onEditSubmit }: Props) => {
  const [commentBody, setCommentBody] = useState(body)
  const [isEditable, setIsEditable] = useState(false)
  const [message, setMessage] = useState({
    type: null,
    body: '',
  })
  const [messageVisible, setMessageVisible] = useState(false)

  const { data: session } = useSession()

  const onEditButtonClick = () => {
    setIsEditable(true)
  }

  const onFormCancel = () => {
    setCommentBody(body)
    setIsEditable(false)
  }

  // const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   if (body.normalize() === commentBody.normalize()) {
  //     // the edited comment has no changes from original so cancel edit
  //     setIsLoading(false)
  //     onFormCancel()
  //     setMessage({
  //       type: 'Error',
  //       body: 'No changes detected',
  //     })
  //     setMessageVisible(true)
  //     return
  //   }

  //   const response = await fetch('/api/comments/', {
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'PATCH',
  //     body: JSON.stringify({
  //       text: commentBody,
  //       commentID: commentID,
  //     }),
  //   })

  //   if (!response.ok) {
  //     setIsLoading(false)
  //     onFormCancel()
  //     setMessage({
  //       type: 'Error',
  //       body: 'Error editing comment - try again later',
  //     })
  //     setMessageVisible(true)
  //     return
  //   }

  //   setIsLoading(false)
  //   setIsEditable(false)
  //   setMessage({
  //     type: 'Success',
  //     body: 'Comment edited successfully',
  //   })
  //   setMessageVisible(true)
  //   return
  // }

  return (
    <>
      {messageVisible && (
        <PopupMessage type={message.type} body={message.body} onAnimationEnd={() => setMessageVisible(false)} />
      )}
      <div className="relative w-full grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg">
        <div className="relative flex gap-4">
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between">
              <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">{`${owner.name} - ${owner.role}`}</p>
              {session?.user.id === owner.id && (
                <div>
                  <FaEdit onClick={onEditButtonClick} className="text-sm text-gray-700 mx-1 hover:text-blue-500" />
                  <FaTrash
                    onClick={() => onDelete(commentID, setMessage, setMessageVisible)}
                    className="text-sm text-gray-700 mx-1 hover:text-red-500"
                  />
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm">{createdAt}</p>
          </div>
        </div>
        {isEditable && (
          <form
            onSubmit={(e) =>
              onEditSubmit(e, commentID, body, commentBody, setMessage, setMessageVisible, onFormCancel, setIsEditable)
            }
          >
            <textarea
              rows={3}
              id="comment"
              placeholder={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              value={commentBody}
              className="form-textarea -mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
              Edit Comment
            </button>
            <button
              type="button"
              onClick={onFormCancel}
              className="px-6 py-2 mt-4 mx-2 text-white bg-red-600 rounded-lg hover:bg-red-900"
            >
              Cancel
            </button>
          </form>
        )}
        {!isEditable && <p className="-mt-4 text-gray-500">{commentBody}</p>}
      </div>
    </>
  )
}

export default CommentCard
