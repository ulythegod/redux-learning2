import React from "react";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { PostAuthor } from "./PostAuthor";
import {TimeAgo} from './TimeAgo';
import { ReactionButtons } from "./ReactionButtons";
import { selectPostById } from "./postsSlice";

export const SinglePostPage = () => {
    const { postId } = useParams();
  
    const post = useSelector(state =>
      selectPostById(state, postId)
    )
  
    if (!post) {
      return (
        <section>
          <h2>Post not found!</h2>
        </section>
      )
    }
  
    return (
      <section>
        <article className="post">
            <h2>{post.title}</h2>
            <PostAuthor userId={post.user} />
            <TimeAgo  timestamp={post.date} />
            <p className="post-content">{post.content}</p>
            <Link to={`/editPost/${post.id}`} className="button">
                Edit Post
            </Link>
            <ReactionButtons post={post} />
        </article>
      </section>
    )
  }
