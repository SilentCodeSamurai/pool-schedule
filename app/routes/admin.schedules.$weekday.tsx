import { Team, Schedule } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useSubmit } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { EditTable } from "~/components/editTable";
import { PoolComplexRawSchedule, PoolName } from "~/types";
import { db } from "~/utils/db.server";
import { generatePoolTables } from "~/utils/table";

type ScheduleCreate = Omit<Schedule, "id">;

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const form = await request.formData();
	const weekday = params.weekday;
	if (!weekday) throw new Response("No weekday provided", { status: 404 });
	const schedule = form.get("schedule");
	if (!schedule) throw new Response("No schedule provided", { status: 404 });
	await db.schedule.deleteMany({ where: { weekday: Number(weekday) } });
	await db.schedule.createMany({ data: JSON.parse(schedule.toString()) });
	return null;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const weekday = Number(params.weekday);

	if (isNaN(weekday)) {
		console.error("Invalid weekday provided:", params.weekday);
		throw new Response("No valid weekday provided", { status: 404 });
	}

	const teams = await db.team.findMany({ orderBy: { name: "asc" } });
	const schedules = await db.schedule.findMany({
		include: { pool: true, lane: true, team: true },
		where: { weekday: weekday }, // Ensure the weekday is a number
	});
	const pools = await db.pool.findMany({ include: { lanes: true } });
	const table = generatePoolTables();
	for (const schedule of schedules) {
		const { pool, lane, interval, team } = schedule;
		table[pool.name as PoolName][lane.index][interval] = team;
	}
	return json({ weekday, teams, table, pools });
};

export default function ScheduleEdit() {
	const submit = useSubmit();
	const { weekday, teams, table, pools } = useLoaderData<typeof loader>();
	const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(teams[0]?.id);
	const selectedTeam = selectedTeamId ? teams.find((team) => team.id === selectedTeamId) : undefined;
	const [poolComplexSchedule, setPoolComplexSchedule] = useState<PoolComplexRawSchedule>(table);

	useEffect(() => {
		setPoolComplexSchedule(table);
	}, [table]);

	const handleSave = () => {
		const newSchedules: ScheduleCreate[] = [];
		for (const poolName in poolComplexSchedule) {
			const pool = pools.find((pool) => pool.name === String(poolName));
			if (!pool) continue;
			const poolLanes = pool.lanes;
			const newLanes = poolComplexSchedule[poolName as PoolName];
			for (let i = 0; i < newLanes.length; i++) {
				const lane = newLanes[i];
				const laneId = poolLanes[i].id;
				for (let j = 0; j < lane.length; j++) {
					const team = lane[j];
					if (team) {
						newSchedules.push({
							poolId: pool.id,
							laneId: laneId,
							interval: j,
							teamId: team.id,
							weekday: Number(weekday),
						});
					}
				}
			}
		}
		submit({ schedule: JSON.stringify(newSchedules) }, { method: "post" });
	};

	const handleChangeLanes = useCallback((poolName: PoolName, lanes: Array<Team | null>[]) => {
		setPoolComplexSchedule((prev) => {
			const newTable = { ...prev };
			newTable[poolName] = lanes;
			return newTable;
		});
	}, []);

	return (
		<>
			<div>
				<div className="flex flex-row justify-between">
					<select
						className="w-96 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={selectedTeamId}
						onChange={(e) => setSelectedTeamId(Number(e.target.value))}
						style={{
							backgroundColor: selectedTeamId
								? teams.find((team) => team.id === selectedTeamId)?.color
								: "",
						}}
					>
						{teams.map((team) => (
							<option key={team.id} value={team.id} style={{ backgroundColor: team.color }}>
								{team.name}
							</option>
						))}
					</select>
					<button
						className="text-xl bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => handleSave()}
					>
						Сохранить
					</button>
				</div>
			</div>
			<div style={{ flexShrink: 0, flexGrow: 1 }} className="flex flex-col">
				<EditTable
					name={"M25"}
					onLanesChange={handleChangeLanes}
					selectedTeam={selectedTeam}
					lanes={poolComplexSchedule.M25}
					renderTime={true}
				/>
				<EditTable
					name={"M50"}
					onLanesChange={handleChangeLanes}
					selectedTeam={selectedTeam}
					lanes={poolComplexSchedule.M50}
					renderTime={true}
				/>
				<EditTable
					name={"M25_2"}
					onLanesChange={handleChangeLanes}
					selectedTeam={selectedTeam}
					lanes={poolComplexSchedule.M25_2}
					renderTime={true}
				/>
				<EditTable
					name={"M25_N"}
					onLanesChange={handleChangeLanes}
					selectedTeam={selectedTeam}
					lanes={poolComplexSchedule.M25_N}
					renderTime={true}
				/>
				<EditTable
					name={"M25_C"}
					onLanesChange={handleChangeLanes}
					selectedTeam={selectedTeam}
					lanes={poolComplexSchedule.M25_C}
					renderTime={true}
				/>
			</div>
		</>
	);
}
