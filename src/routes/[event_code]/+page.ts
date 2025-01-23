import type { PageLoad } from './$types';

export const  load: PageLoad = ({ params }) => {
	return {
		eventCode: params.event_code,
	};
};