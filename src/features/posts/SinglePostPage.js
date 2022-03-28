import React from "react";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { PostAuthor } from "./PostAuthor";
import {TimeAgo} from './TimeAgo';
import { ReactionButtons } from "./ReactionButtons";
import { selectPostById } from "./postsSlice";
import {Spinner} from '../../components/Spinner';
import {useGetPostQuery} from '../../api/apiSlice';

export const SinglePostPage = () => {
    const { postId } = useParams();
  
    const { data: post, isFetching, isSuccess } = useGetPostQuery(postId);
  
    let content;

    if (isFetching) {
      content = <Spinner text="Loading..." />
    } else if (isSuccess) {
      content = (
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
      )
    }
  
    return (
      <section>
        {content}
      </section>
    )
  }
