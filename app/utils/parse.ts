function safeParseInt(value: string | undefined, safe: number) {
	if (!value || isNaN(parseInt(value))) return safe;
	return parseInt(value);
}

export { safeParseInt };
