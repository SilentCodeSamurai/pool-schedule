import { PoolName } from "./types";

export const lanesMapping: Record<PoolName, number> = {
	M25: 5,
	M50: 8,
	M25_2: 6,
	M25_N: 4,
	M25_C: 2,
};

export const poolTitlesMapping: Record<PoolName, string> = {
	M25: "25 метров",
	M50: "50 метров",
	M25_2: "25 метров",
	M25_N: "25 м новый",
	M25_C: "50 м виллы",
};
