import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { postUpdated } from './postsSlice';
import { useParams } from 'react-router-dom';
import { selectPostById } from "./postsSlice";
import { useGetPostQuery, useEditPostMutation } from '../../api/apiSlice';

export const EditPostForm = () => {
    const { postId } = useParams();

    const { data: post } = useGetPostQuery(postId)
    const [updatePost, { isLoading }] = useEditPostMutation()

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const history = useNavigate();

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);

    const onSavePostClicked = () => {
        if (title && content) {
            updatePost({ id: postId, title, content });
            history(`/posts/${postId}`);
        }
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor='postTitle'>Post title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name='postTitle'
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor='postContent'>Content:</label>
                <textarea 
                    id='postContent'
                    name='postContent'
                    value={content}
                    onChange={onContentChanged}
                />
            </form>
            <button type='button' onClick={onSavePostClicked}>
                Save Post
            </button>
        </section>
    )
}