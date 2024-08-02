interface DialogProps {
	onAccept: () => void;
	onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ onAccept, onClose }) => {
	return (
		<div
			className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50"
			onClick={onClose}
		>
			<div className="flex flex-col gap-4 bg-white p-4 rounded" onClick={(e) => e.stopPropagation()}>
				<h1 className="text-2xl text-center">Вы уверены?</h1>
				<div className="flex flex-row justify-center gap-4">
					<button
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						onClick={onAccept}
					>
						Да
					</button>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={onClose}
					>
						Отмена
					</button>
				</div>
			</div>
		</div>
	);
};

export { Dialog };
