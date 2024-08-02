import { Team } from "@prisma/client";

export type PoolName = "M25" | "M50" | "M25_2" | "M25_N" | "M25_C";

export type PoolComplexRawSchedule = Record<PoolName, Array<Team | null>[]>;

export type Interval = {
	team: Team | null;
	length: number;
};

type PoolSchedule = {
	pool: PoolName;
	lanes: Interval[][];
};

export type PoolComplexSchedule = {
	pools: PoolSchedule[];
};
