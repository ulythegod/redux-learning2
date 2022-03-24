import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllUsers } from './userSlice';

export const UsersList = () => {
    const users = useSelector(selectAllUsers);//useSelector - это хук, который беред данные их Redux хранилища с помощью переданной ему функции

    const renderedUsers = users.map(user => (
        <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
    ));

    return (
        <section>
            <h2>Users</h2>
            <ul>{renderedUsers}</ul>
        </section>
    );
}