import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		eventCode: params.slug
	};
};