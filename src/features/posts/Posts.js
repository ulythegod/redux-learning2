import React from "react";
import { AddPostForm } from './AddPostForm'
import { PostsList } from './PostsList'

export default function Posts() {
    return (
        <React.Fragment>
          <AddPostForm />
          <PostsList />
        </React.Fragment>
    )
}