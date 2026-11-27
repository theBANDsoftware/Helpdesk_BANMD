import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from './notificationsApi';
import { useSelectedUser } from '../users/selectedUserContext';

/**
 * Antalet olästa notiser som en liten bubbla över "Notiser" i menyn. Visas inte alls vid 0.
 * Ökar antalet visas också en webbläsarnotis, om användaren har tillåtit det.
 */
export default function NotificationCount() {
	const { user } = useSelectedUser();

	// Användarens id i nyckeln, så att man aldrig ser förra användarens antal
	const query = useQuery({
		queryKey: ['notifications', 'count', user?.id],
		queryFn: getUnreadCount,
		refetchInterval: 30_000,
	});

	// Förra antalet, så vi vet när det har kommit nya
	const previousCount = useRef<number | null>(null);

	useEffect(() => {
		if (query.data === undefined) return;

		const hasNew = previousCount.current !== null && query.data > previousCount.current;
		if (hasNew && 'Notification' in window && Notification.permission === 'granted') {
			const notification = new Notification('Helpdesk', {
				body: 'Något har hänt i ett av dina ärenden',
				tag: 'helpdesk', // Ersätter förra notisen i stället för att lägga dem på hög
			});
			notification.onclick = () => window.focus();
		}

		previousCount.current = query.data;
	}, [query.data]);

	if (!query.data) return null;

	return (
		<span className="notification-count" aria-label={`${query.data} olästa notiser`}>
			{query.data}
		</span>
	);
}
