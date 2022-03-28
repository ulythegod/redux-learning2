import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers, selectUserById } from '../users/userSlice';

export const PostAuthor = ({userId}) => {
    const author = useSelector(state =>
        selectUserById(state, userId)
    );

    return <span>by {author ? author.name : 'Unknown author'}</span>
}