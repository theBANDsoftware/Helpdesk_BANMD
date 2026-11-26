import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { getNotifications, markAsRead } from './notificationsApi';
import type { NotificationResponse } from './notificationsApi';
import { timestampToTimestring } from '../../shared/formatDate';
import Icon from '../../shared/Icon';
import { useSelectedUser } from '../users/selectedUserContext';

/** Sidan med mina notiser, nyaste först. Ser ut som ärendelistan. */
export default function Notifications() {
	const queryClient = useQueryClient();
	const { user } = useSelectedUser();

	const query = useQuery({
		queryKey: ['notifications', 'list', user?.id],
		queryFn: getNotifications,
	});

	const readMutation = useMutation({
		mutationFn: markAsRead,
		onSuccess: () => {
			// Invaliderar både listan och antalet i menyn, eftersom båda börjar med 'notifications'
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});

	function handleClick(notification: NotificationResponse) {
		if (!notification.read) {
			readMutation.mutate(notification.id);
		}
	}

	// Webbläsaren frågar bara en gång. Har man svarat visas inte knappen igen.
	const [permission, setPermission] = useState(
		'Notification' in window ? Notification.permission : 'denied',
	);

	async function handleEnableNotifications() {
		setPermission(await Notification.requestPermission());
	}

	return (
		<section className="card">
			<h2 className="section-title">Notiser</h2>

			{permission === 'default' && (
				<div className="btn-row">
					<button type="button" className="btn" onClick={handleEnableNotifications}>
						Slå på notiser i webbläsaren
					</button>
				</div>
			)}

			{query.isPending && <p>Hämtar notiser …</p>}
			{query.isError && <p className="error">Kunde inte hämta notiserna.</p>}

			{query.isSuccess && query.data.length === 0 && (
				<p className="empty-state">Inget nytt sedan sist</p>
			)}

			{query.isSuccess && query.data.length > 0 && (
				<ul className="list">
					{query.data.map((notification) => (
						<li
							key={notification.id}
							className={'list-item' + (notification.read ? '' : ' list-item-unread')}
						>
							<div className="list-item-top">
								<Link
									to={'/tickets/' + notification.ticketId}
									className="item-link"
									onClick={() => handleClick(notification)}
								>
									<span className="item-title">
										{!notification.read && <Icon name="notifications" />}
										{notification.text}
									</span>
								</Link>
								{!notification.read && <span className="pill pill-info">Ny</span>}
							</div>
							<span className="item-meta">{timestampToTimestring(notification.createdAt).time}</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
