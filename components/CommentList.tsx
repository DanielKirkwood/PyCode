import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import useSWR from 'swr'
import Checkbox from './Checkbox'
import CommentCard from './CommentCard'

interface Props {
  challengeID: string | string[]
  isVerified: boolean
}

export const CommentList = ({ challengeID, isVerified }: Props) => {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR(`/api/comments?challengeID=${challengeID}`, fetcher)

  const { data: session } = useSession()

  const [comment, setComment] = useState('')
  const [isChecked, setIsChecked] = useState(isVerified)

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const commentData = {
      body: comment,
      challenge: challengeID,
      createdAt: 'loading...',
      ownerID: session.user.id,
      ownerName: session.user.name,
      ownerRole: session.user.role,
    }

    mutate(
      {
        comments: [...data.comments, commentData],
      },
      false
    )

    const response = await fetch('/api/comments', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        text: comment,
        challengeID: challengeID,
        ownerID: session.user.id,
        ownerName: session.user.name,
        ownerRole: session.user.role,
      }),
    })

    setComment('')

    if (!response.ok) {
      mutate()
      return
    }

    mutate()
    return
  }

  async function onDelete(id: string, setMessage, setMessageVisible) {
    mutate(
      {
        comments: data.comments.filter((comment) => comment._id !== id),
      },
      false
    )
    const response = await fetch('/api/comments/', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({
        commentID: id,
      }),
    })

    if (!response.ok) {
      // error deleting post
      setMessage({
        type: 'Error',
        body: 'Error deleting comment - try again later',
      })
      setMessageVisible(true)
      mutate()
      return
    }

    setMessage({
      type: 'Success',
      body: 'Comment successfully deleted',
    })
    setMessageVisible(true)
    mutate()
    return
  }

  const onEditSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    commentID: string,
    originalBody: string,
    newBody: string,
    setMessage,
    setMessageVisible,
    onFormCancel,
    setIsEditable
  ) => {
    e.preventDefault()
    if (originalBody.normalize() === newBody.normalize()) {
      // the edited comment has no changes from original so cancel edit
      onFormCancel()
      setMessage({
        type: 'Error',
        body: 'No changes detected',
      })
      setMessageVisible(true)
      return
    }

    mutate(
      {
        ...data,
        comments: data.comments.map((comment) => (comment._id === commentID ? { ...comment, body: newBody } : comment)),
      },
      false
    )
    const response = await fetch('/api/comments/', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        text: newBody,
        commentID: commentID,
      }),
    })

    if (!response.ok) {
      onFormCancel()
      setMessage({
        type: 'Error',
        body: 'Error editing comment - try again later',
      })
      setMessageVisible(true)
      mutate()
      return
    }

    setIsEditable(false)
    setMessage({
      type: 'Success',
      body: 'Comment edited successfully',
    })
    setMessageVisible(true)
    mutate()
    return
  }

  const handleCheckboxToggle = async () => {
    const response = await fetch(`/api/challenges/${challengeID}?verified=${!isChecked}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        verifiedBy: session.user.id,
      }),
    })

    if (!response.ok) {
      console.error('could not edit verified status')
      return
    }

    setIsChecked(!isChecked)
    return
  }

  return (
    <div className="flex justify-between items-center flex-col ">
      <div className="flex justify-between items-center flex-col mt-3 px-8 py-6 bg-white shadow-lg w-full lg:w-1/2 ">
        <div className="w-3/4">
          <h1 className="text-center text-2xl mb-5">Comments</h1>
          {data &&
            data.comments.map((comment, i) => {
              return (
                <CommentCard
                  onEditSubmit={onEditSubmit}
                  onDelete={onDelete}
                  commentID={comment._id}
                  owner={{
                    id: comment.ownerID,
                    name: comment.ownerName,
                    role: comment.ownerRole,
                  }}
                  body={comment.body}
                  createdAt={comment.createdAt}
                  key={i}
                />
              )
            })}
          <div className="mb-3 pt-0">
            <form onSubmit={onFormSubmit}>
              <textarea
                rows={3}
                id="newComment"
                placeholder="Type your comment here..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-gray-100"
              />
              <div className="flex justify-between items-center mt-3">
                <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                  Comment
                </button>
                {session?.user.role === 'admin' ||
                  (session?.user.role === 'super-admin' && (
                    <Checkbox onClick={handleCheckboxToggle} text="Verify" value={isChecked} />
                  ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
