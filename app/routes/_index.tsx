import { json, useLoaderData, useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import logo from "~/assets/logo.png";
import { poolTitlesMapping } from "~/constants";
import { PoolName } from "~/types";
import { db } from "~/utils/db.server";
import { generatePoolTables, getGroupedSchedule } from "~/utils/table";

export const loader = async () => {
	const weekdayRaw = new Date().getDay();
	const weekday = weekdayRaw === 0 ? 6 : weekdayRaw - 1;
	const schedules = await db.schedule.findMany({
		include: { pool: true, lane: true, team: true },
		where: { weekday: weekday },
	});
	const rawTable = generatePoolTables();
	for (const schedule of schedules) {
		const { pool, lane, interval, team } = schedule;
		rawTable[pool.name as PoolName][lane.index][interval] = team;
	}
	const schedule = getGroupedSchedule(rawTable);
	return json({ schedule });
};

function App() {
	const revalidator = useRevalidator();
	const { schedule } = useLoaderData<typeof loader>();
	useEffect(() => {
		const refreshInterval = setInterval(() => {
			revalidator.revalidate();
		}, 10000);
		return () => clearInterval(refreshInterval);
	}, []);

	return (
		<div id="main">
			<div style={{ display: "flex", flexDirection: "row", gap: 20, alignItems: "center" }}>
				<h1
					style={{
						fontSize: 60,
						fontWeight: 600,
						lineHeight: "40px",
						letterSpacing: "-0.2px",
					}}
				>
					{"31 июля"}
				</h1>
				<img
					height={"78px"}
					style={{ height: "78px", flexGrow: 0, maxWidth: "none" }}
					src={logo}
					alt="logo"
				></img>
			</div>
			<div className="complex">
				{schedule.pools.map((pool, index) => (
					<table key={index} style={{ borderCollapse: "unset", flex: pool.lanes.length + 1 }}>
						<thead>
							<tr style={{ position: "relative" }}>
								<th className="pool">
									<p className="pool">{poolTitlesMapping[pool.pool]}</p>
								</th>
								{Array.from({ length: 31 }, (_, i) => {
									const hours = 6 + Math.floor(i / 2);
									const minutes = (i % 2) * 30;
									const time = `${hours.toString().padStart(2, "0")}:${minutes
										.toString()
										.padStart(2, "0")}`;
									if (i === 30) {
										return (
											<>
												{!index && (
													<th key={i} style={{ fontWeight: 700 }} className="time">
														{time}
													</th>
												)}
											</>
										);
									} else {
										return (
											<th key={i} style={{ position: "relative" }}>
												{!index && <p className="time">{time}</p>}
											</th>
										);
									}
								})}
							</tr>
						</thead>
						<tbody>
							{pool.lanes.map((lane, index) => (
								<tr key={index}>
									<td className="lane">{`Дорожка ${index + 1}`}</td>
									{lane.map((interval, index) => (
										<td
											key={index}
											colSpan={interval.length}
											style={{
												backgroundColor: interval.team?.color || "white",
											}}
										>
											<p className="team">{interval.team?.name}</p>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				))}
			</div>
		</div>
	);
}

export default App;
