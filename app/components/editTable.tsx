import { PoolName } from "~/types";
import { Team } from "@prisma/client";
import { poolTitlesMapping } from "~/constants";
import { useState } from "react";

interface Props {
	name: PoolName;
	lanes: Array<null | Team>[];
	selectedTeam: Team | undefined;
	onLanesChange: (pool: PoolName, lanes: Array<Team | null>[]) => void;
	renderTime: boolean;
}

const EditTable: React.FC<Props> = ({ name, lanes, selectedTeam, onLanesChange, renderTime }: Props) => {
	const [tooltipTeam, setTooltipTeam] = useState<{ name: string; color: string } | null>(null);
	const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isClearing, setIsClearing] = useState(false);

	const handleMouseDown = (e: React.MouseEvent, row: number, col: number) => {
		e.preventDefault();
		if (!selectedTeam) return;
		if (e.button === 0) {
			// Left click
			setIsDragging(true);
			setIsClearing(false);
			updateCell(row, col, selectedTeam);
		} else if (e.button === 2) {
			// Right click
			setIsClearing(true);
			setIsDragging(true);
			updateCell(row, col, null);
		}
	};

	const handleMouseUp = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsDragging(false);
		setIsClearing(false);
	};

	const handleMouseOver = (row: number, col: number) => {
		if (isDragging && selectedTeam) {
			updateCell(row, col, isClearing ? null : selectedTeam);
		}

		const team = lanes[row][col];
		if (team) {
			const timeout = setTimeout(() => {
				setTooltipTeam({ name: team.name, color: team.color });
			}, 1000); // 2 seconds delay
			setTooltipTimeout(timeout);
		}
	};

	const handleMouseOut = () => {
		if (tooltipTimeout) {
			clearTimeout(tooltipTimeout);
			setTooltipTimeout(null);
		}
		setTooltipTeam(null);
	};

	const updateCell = (row: number, col: number, value: Team | null) => {
		const newData = [...lanes];
		newData[row][col] = value;
		onLanesChange(name, newData);
	};

	return (
		<>
			{tooltipTeam && (
				<div
					style={{
						position: "absolute",
						top: "2px",
						left: "2px",
						width: "400px",
						height: "40px",
						backgroundColor: tooltipTeam.color || "white",
						zIndex: 2,
						border: "1px solid #ccc",
						borderRadius: "10px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{tooltipTeam.name}
				</div>
			)}

			<table
				className="edit-table"
				onContextMenu={(e) => e.preventDefault()}
				role="grid"
				onMouseUp={handleMouseUp}
				style={{ borderCollapse: "collapse", flex: lanes.length + 1 }}
			>
				<thead>
					<tr style={{ position: "relative" }}>
						<th className="pool">
							<p className="pool" style={{ fontSize: "1rem" }}>
								{poolTitlesMapping[name]}
							</p>
						</th>
						{Array.from({ length: 31 }, (_, i) => {
							const hours = 6 + Math.floor(i / 2);
							const minutes = (i % 2) * 30;
							const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
							if (i === 30) {
								return (
									<>
										{renderTime && (
											<div key={i} style={{ fontWeight: 700, fontSize: "1rem" }} className="time">
												{time}
											</div>
										)}
									</>
								);
							} else {
								return (
									<th key={i} style={{ position: "relative" }}>
										{renderTime && (
											<div className="time" style={{ fontSize: "1rem" }}>
												{time}
											</div>
										)}
									</th>
								);
							}
						})}
					</tr>
				</thead>
				<tbody>
					{lanes.map((lane, rowIndex) => (
						<tr key={rowIndex}>
							<td className="lane" style={{ fontSize: "1rem" }}>{`Дорожка ${rowIndex + 1}`}</td>
							{lane.map((team, colIndex) => (
								<td
									role="gridcell"
									key={colIndex}
									onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
									onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
									onFocus={() => handleMouseOver(rowIndex, colIndex)}
									onMouseOut={() => handleMouseOut()}
									onBlur={() => handleMouseOut()}
									style={{
										height: "40px",
										backgroundColor: team?.color || "white",
										padding: "0",
									}}
								>
									<p
										className="team"
										style={{ textOverflow: "clip", fontSize: "1rem", fontWeight: 500 }}
									>
										{team?.name}
									</p>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export { EditTable };
