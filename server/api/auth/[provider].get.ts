export default defineEventHandler((event) => {
	const provider = getRouterParam(event, "provider");

	throw createError({
		statusCode: 501,
		statusMessage: `OAuth provider "${provider}" is not configured yet.`,
	});
});
