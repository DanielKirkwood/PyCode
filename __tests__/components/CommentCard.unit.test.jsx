// /__tests__/Checkbox.unit.test.jsx

/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentCard from '../../components/Comment/CommentCard'
import wrapWithSession from '../__utils__/wrapWithSession'

describe('CommentCard', () => {
  test('renders a read only comment if session user not comment owner', () => {
    const comment = {
      commentID: '12345678',
      owner: {
        id: '87654321',
        name: 'John Doe',
        role: 'admin',
      },
      body: 'This is a comment.',
      createdAt: '06/09/1999',
      onDelete: jest.fn(),
      onEditSubmit: jest.fn(),
    }

    const session = {
      expires: '1',
      user: { id: '999999999', email: 'user@email.com', name: 'Sally Smith', image: 'url-to-image' },
    }

    render(
      wrapWithSession(
        session,
        <CommentCard
          commentID={comment.commentID}
          owner={comment.owner}
          body={comment.body}
          createdAt={comment.createdAt}
          onDelete={comment.onDelete}
          onEditSubmit={comment.onEditSubmit}
        />
      )
    )

    expect(screen.getByText(comment.body)).toBeInTheDocument()
    expect(screen.queryByLabelText('Enable Edit Comment')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Delete Comment')).not.toBeInTheDocument()
  })

  test('renders an editable comment if session user is comment owner', () => {
    const comment = {
      commentID: '12345678',
      owner: {
        id: '87654321',
        name: 'John Doe',
        role: 'admin',
      },
      body: 'This is a comment.',
      createdAt: '06/09/1999',
      onDelete: jest.fn(),
      onEditSubmit: jest.fn(),
    }

    const session = {
      expires: '1',
      user: { id: '87654321', email: 'user@email.com', name: 'John Doe', image: 'url-to-image' },
    }

    render(
      wrapWithSession(
        session,
        <CommentCard
          commentID={comment.commentID}
          owner={comment.owner}
          body={comment.body}
          createdAt={comment.createdAt}
          onDelete={comment.onDelete}
          onEditSubmit={comment.onEditSubmit}
        />
      )
    )

    expect(screen.getByText(comment.body)).toBeInTheDocument()
    expect(screen.queryByLabelText('Enable Edit Comment')).toBeInTheDocument()
    expect(screen.queryByLabelText('Delete Comment')).toBeInTheDocument()
  })

  test('renders a form if user clicks edit comment button', async () => {
    const sessionUser = userEvent.setup()

    const comment = {
      commentID: '12345678',
      owner: {
        id: '87654321',
        name: 'John Doe',
        role: 'admin',
      },
      body: 'This is a comment.',
      createdAt: '06/09/1999',
      onDelete: jest.fn(),
      onEditSubmit: jest.fn(),
    }

    const session = {
      expires: '1',
      user: { id: '87654321', email: 'user@email.com', name: 'John Doe', image: 'url-to-image' },
    }

    render(
      wrapWithSession(
        session,
        <CommentCard
          commentID={comment.commentID}
          owner={comment.owner}
          body={comment.body}
          createdAt={comment.createdAt}
          onDelete={comment.onDelete}
          onEditSubmit={comment.onEditSubmit}
        />
      )
    )

    const editBtn = screen.queryByLabelText('Enable Edit Comment')

    expect(screen.queryByRole('form')).not.toBeInTheDocument()

    await sessionUser.click(editBtn)
  })
})
