import { Team } from "@prisma/client";
import { lanesMapping } from "~/constants";
import { PoolComplexSchedule, Interval, PoolComplexRawSchedule, PoolName } from "~/types";

const poolNames: PoolName[] = ["M25", "M50", "M25_2", "M25_N", "M25_C"];

function generatePoolTables(): PoolComplexRawSchedule {
	const result: Record<PoolName, Array<Team | null>[]> = {
		M25: [],
		M50: [],
		M25_2: [],
		M25_N: [],
		M25_C: [],
	};
	for (const poolName of poolNames) {
		const lanes = lanesMapping[poolName];
		const poolTable: Array<Team | null>[] = [];

		for (let i = 0; i < lanes; i++) {
			const lane: (Team | null)[] = new Array(30).fill(null); // Initialize lane with 30 null values
			poolTable.push(lane);
		}
		result[poolName] = poolTable;
	}
	return result;
}

function groupLaneByInterval(lane: (Team | null)[]): Interval[] {
	const intervals: Interval[] = [];

	if (lane.length === 0) {
		return intervals;
	}

	let currentTeam = lane[0];
	let currentLength = 1;

	for (let i = 1; i < lane.length; i++) {
		if (lane[i]?.id === currentTeam?.id) {
			currentLength++;
		} else {
			intervals.push({ team: currentTeam, length: currentLength });
			currentTeam = lane[i];
			currentLength = 1;
		}
	}

	// Push the last interval
	intervals.push({ team: currentTeam, length: currentLength });

	return intervals;
}

function getGroupedSchedule(table: PoolComplexRawSchedule): PoolComplexSchedule {
	const result: PoolComplexSchedule = {
		pools: [],
	};

	for (const poolTitle in table) {
		const lanes = table[poolTitle as PoolName];
		const groupedLanes = lanes.map(groupLaneByInterval);
		result.pools.push({ pool: poolTitle as PoolName, lanes: groupedLanes });
	}

	return result;
}

export { generatePoolTables, getGroupedSchedule };
