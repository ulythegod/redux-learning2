import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch  } from "react-redux";//реакт компоненты могут читать данные из Redux хранилища, используя хук useSelector 
import {Link} from 'react-router-dom';
import { PostAuthor } from "./PostAuthor";
import {TimeAgo} from './TimeAgo';
import {
    selectAllPosts,
    fetchPosts,
    selectPostIds,
    selectPostById
} from './postsSlice';
import {Spinner} from '../../components/Spinner';
import { ReactionButtons } from "./ReactionButtons";
import { useGetPostsQuery } from "../../api/apiSlice";
import classnames from "classnames";

const PostExcerpt = ({ post }) => {
    return (
        <article>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>
            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}

export const PostsList = () => {
    const {
        data: posts = [],
        isLoding,
        isFetching,
        isSuccess,
        isErrror,
        error,
        refetch
    } = useGetPostsQuery();

    const sortedPosts = useMemo(() => {
        const sortedPosts = posts.slice();
        //сортировка постов в хронологическом порядке
        sortedPosts.sort((a, b) => b.date.localeCompare(a.date));

        return sortedPosts;
    }, [posts])

    let content;
    
    if (isLoding) {
        content = <Spinner text="Loading..." />
    } else if (isSuccess) {
        const renderedPosts = sortedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
        ))
      
        const containerClassname = classnames('posts-container', {
            disabled: isFetching
        })
      
        content = <div className={containerClassname}>{renderedPosts}</div>
    } else if (isErrror) {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            <button onClick={refetch}>Refetch Posts</button>
            {content}
        </section>
    )
}

