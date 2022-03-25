import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Posts from './features/posts/Posts'
import {SinglePostPage} from './features/posts/SinglePostPage'
import { Navbar } from './app/Navbar'
import {EditPostForm} from './features/posts/EditPostForm'
import { UsersList } from './features/users/UsersList'
import {UserPage} from './features/users/UserPage';
import {NotificationsList} from './features/notifications/NotificationsList'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route exact path="/posts/:postId" element={<SinglePostPage />} />
          <Route exact path="/editPost/:postId" element={<EditPostForm />} />
          <Route exact path="/users" element={<UsersList />} />
          <Route exact path="/users/:userId" element={<UserPage />} />
          <Route exact path="/notifications" element={<NotificationsList />} />
          <Route path="/" element={<Posts />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
