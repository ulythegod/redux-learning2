import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  fetchNotificationsWebsocket,
  selectNotificationsMetadata,
  useGetNotificationsQuery 
} from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const dispatch = useDispatch();

  //запуск инициализирующего получения уведомлений для сохранения вебсокета открытым для получения обновлений
  useGetNotificationsQuery();

  const notificationsMetadata = useSelector(selectNotificationsMetadata);
  const numUnreadNotifications = notificationsMetadata.filter(
    n => !n.read
  ).length

  const fetchNewNotifications = () => {
    dispatch(fetchNotificationsWebsocket())
  }

  let unreadNotificationsBadge;

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className='badge'>{numUnreadNotifications}</span>
    )
  }
  
  const fetchNotifications = () => {
    dispatch(fetchNotifications());
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          </div>
          <button className='button' onClick={fetchNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}