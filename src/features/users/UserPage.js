import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';

import { selectUserById } from '../users/userSlice'
import { selectAllPosts } from '../posts/postsSlice'

export const UserPage = () => {
  const { userId } = useParams()

  const user = useSelector(state => selectUserById(state, userId))

  const postsForUser = useSelector(state => selectPostsByUser(state, userId))

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}