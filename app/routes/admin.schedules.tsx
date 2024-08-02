import { NavLink, Outlet } from "@remix-run/react";

const weekDays: Array<string> = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

export default function Schedules() {
	return (
		<div className="w-full h-full flex flex-col divide-y">
			<div className="w-full h-max flex flex-row justify-center gap-10">
				{weekDays.map((day, index) => (
					<NavLink key={index} to={`/admin/schedules/${index}`}>
						{({ isActive }) => <h1 className={`text-xl${isActive ? " text-blue-500" : ""}`}>{day}</h1>}
					</NavLink>
				))}
			</div>
			<Outlet />
		</div>
	);
}
