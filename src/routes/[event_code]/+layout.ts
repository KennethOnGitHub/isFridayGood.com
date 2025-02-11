import type { LayoutLoad } from './$types';

export const  load: LayoutLoad = ({ params }) => {
	return {
		eventCode: params.event_code,
	};
};