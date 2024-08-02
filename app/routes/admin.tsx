import { NavLink, Outlet } from "@remix-run/react";

export default function Admin() {
	return (
		<div className="w-full h-full flex flex-col divide-y">
			<div className="w-full h-10 flex flex-row justify-center gap-10">
				<NavLink to="/admin/teams">
					{({ isActive }) => <h1 className={`text-3xl${isActive ? " text-blue-500" : ""}`}>Команды</h1>}
				</NavLink>
				<NavLink to="/admin/schedules">
					{({ isActive }) => <h1 className={`text-3xl${isActive ? " text-blue-500" : ""}`}>Расписание</h1>}
				</NavLink>
			</div>
			<Outlet />
		</div>
	);
}
