import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Dialog } from "~/components/dialog";
import { TeamForm } from "~/components/teamCreateForm";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData();
	const method = request.method;
	console.log(method);
	if (typeof method !== "string") {
		throw new Response("Server Error", { status: 400 });
	}
	switch (method) {
		case "DELETE": {
			const id = form.get("id");
			if (typeof id !== "string") {
				throw new Response("No team ID provided", { status: 400 });
			}
			await db.team.delete({ where: { id: parseInt(id) } });
			return redirect("/admin/teams");
			break;
		}
		case "PUT": {
			const id = form.get("id");
			const name = form.get("name");
			const color = form.get("color");
			if (typeof id !== "string" || typeof name !== "string" || typeof color !== "string") {
				throw new Response("Form not submitted correctly.", { status: 400 });
			}
			const fields = { name, color };
			const team = await db.team.update({ where: { id: parseInt(id) }, data: fields });
			return json({ team });
		}
		default: {
			throw new Response("Method not supported.", { status: 400 });
		}
	}
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const teamId = params.id;
	if (!teamId) throw new Response("No team ID provided", { status: 404 });
	const team = await db.team.findUnique({ where: { id: parseInt(teamId) } });
	if (!team) throw new Response("Team not found", { status: 404 });
	return json({ team: team });
};

export default function Team() {
	const { team } = useLoaderData<typeof loader>();
	const submit = useSubmit();
	const [deletionDialogOpen, setDeletionDialogOpen] = useState<boolean>(false);

	const handleDelete = () => {
		submit({ id: team.id }, { method: "delete" });
	};

	return (
		<>
			{deletionDialogOpen && <Dialog onClose={() => setDeletionDialogOpen(false)} onAccept={handleDelete} />}
			<div className="font-sans p-4">
				<div className="flex flex-col justify-start gap-2">
					<div className="flex flex-row justify-between">
						<h1 className="text-3xl">Команда {team.name}</h1>
						<button
							className="text-xl bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => setDeletionDialogOpen(true)}
						>
							Удалить команду
						</button>
					</div>
				</div>
				<TeamForm
					defaultColor={team.color}
					defaultName={team.name}
					onSubmit={(name, color) => {
						submit({ action: "update", id: team.id, name, color }, { method: "put" });
					}}
				/>
			</div>
		</>
	);
}
