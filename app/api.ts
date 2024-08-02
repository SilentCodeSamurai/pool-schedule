

const mockedTeams = [
	{
		name: "Отдыхающие",
		color: "#F4E6B1",
	},
	{
		name: "Чудеса Света",
		color: "#B1E0F4",
	},
	{
		name: "Асгард",
		color: "#F4D5B1",
	},
	{
		name: "Трэвел Клуб",
		color: "#8ABAF3",
	},
	{
		name: "Черноморье",
		color: "#CBB1F4",
	},
	{
		name: "Наталья Ивановна",
		color: "#D3F4B1",
	},
	{
		name: "Бурков Уфа",
		color: "#97DAAA",
	},
	{
		name: "Бурков Экран",
		color: "#97DAD6",
	},
	{
		name: "Лукьянов",
		color: "#63A178",
	},
	{
		name: "Чимириев",
		color: "#14BB6B",
	},
	{
		name: "Балт аккорд",
		color: "#F4B9B1",
	},
	{
		name: "Ухта",
		color: "#D7D7D7",
	},
];

const getMockedLane = () => {
	const intervals = [];
	const totalIntervals = 30;
	let occupiedIntervals = 0;
	const usedTeamNames = new Set();
	while (occupiedIntervals < totalIntervals) {
		const occupy = Math.floor(Math.random() * 5) + 1;
		if (occupiedIntervals + occupy > totalIntervals) continue;

		let team = null;
		const setTeam = Math.random() > 0.2;

		if (setTeam) {
			const teamName = mockedTeams[Math.floor(Math.random() * mockedTeams.length)].name;
			if (usedTeamNames.has(teamName)) continue;
			usedTeamNames.add(teamName);
			team = { name: teamName, color: mockedTeams.find((team) => team.name === teamName)!.color };
			console.log(team);
		}
		occupiedIntervals += occupy;
		intervals.push({
			length: occupy,
			team,
		});
	}

	return {
		intervals,
	};
};

const getMockedLanes = (number: number) => {
	const lanes = [];
	for (let i = 0; i < number; i++) {
		lanes.push(getMockedLane());
	}
	return lanes;
};

export const mockedLoadSchedule = async () => {
	const mockedComplex = {
		pools: [
			{
				title: "25 метров",
				lanes: getMockedLanes(5),
			},
			{
				title: "50 метров",
				lanes: getMockedLanes(8),
			},
			{
				title: "25 метров",
				lanes: getMockedLanes(6),
			},
			{
				title: "Крытый 25 метров",
				lanes: getMockedLanes(4),
			},
			{
				title: "Новый 25 метров",
				lanes: getMockedLanes(2),
			},
		],
	};
	const error = false;
	if (error) {
		return null;
	} else {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(mockedComplex);
			}, 2000);
		});
	}
};
