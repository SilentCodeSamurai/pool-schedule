interface TeamCardProps {
	name: string;
	color: string;
	onInspect: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, color, onInspect }) => {
	return (
		<button
			onClick={onInspect}
			className="w-full flex flex-row justify-between rounded p-2"
			style={{ backgroundColor: color }}
		>
			<div className="flex flex-row gap-2">
				<div className="text-xl">{name}</div>
			</div>
		</button>
	);
};

export { TeamCard };
