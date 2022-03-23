import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AddPostForm } from './features/posts/AddPostForm'
import { PostsList } from './features/posts/PostsList'

function App() {
  return (
    <React.Fragment>
      <AddPostForm />
      <PostsList />
    </React.Fragment>
  )
}

export default App
