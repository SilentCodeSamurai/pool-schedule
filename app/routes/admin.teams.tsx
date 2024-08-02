import { ActionFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Modal } from "~/components/modal";
import { TeamCard } from "~/components/teamCard";
import { TeamForm } from "~/components/teamCreateForm";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData();
	console.log(form);
	const name = form.get("name");
	const color = form.get("color");
	if (typeof name !== "string" || typeof color !== "string") {
		throw new Error("Form not submitted correctly.");
	}
	const team = await db.team.create({ data: { name, color } });
	return json({ team });
};

export const loader = async () => {
	const teams = await db.team.findMany();
	return json({ teams });
};

export default function Teams() {
	const navigate = useNavigate();
	const submit = useSubmit();
	const { teams } = useLoaderData<typeof loader>();
	const [creationModalOpen, setCreationModalOpen] = useState<boolean>(false);

	return (
		<>
			{creationModalOpen && (
				<Modal className={"w-96"} onClose={() => setCreationModalOpen(false)}>
					<h1 className="text-2xl">Создание команды</h1>
					<TeamForm
						onSubmit={(name, color) => {
							setCreationModalOpen(false);
							submit({ name, color }, { method: "post" });
						}}
					/>
				</Modal>
			)}
			<div className="font-sans p-4">
				<div className="flex flex-row justify-between">
					<button
						className="text-xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => setCreationModalOpen(true)}
					>
						Создать команду
					</button>
				</div>

				<div className="flex flex-col gap-2 mt-4">
					{teams.map((team, index) => (
						<TeamCard
							key={index}
							name={team.name}
							color={team.color}
							onInspect={() => navigate(`/admin/team/${team.id}`)}
						/>
					))}
				</div>
			</div>
		</>
	);
}
