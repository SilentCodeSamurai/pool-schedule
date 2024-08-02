import React, { useState } from "react";

const options = [
	"#F4E6B1",
	"#B1E0F4",
	"#F4D5B1",
	"#8ABAF3",
	"#CBB1F4",
	"#D3F4B1",
	"#97DAAA",
	"#97DAD6",
	"#63A178",
	"#14BB6B",
	"#C8B5B5",
	"#F4B9B1",
	"#CABB86",
	"#BFB0D8",
	"#F89B9B",
	"#ADC4A3",
	"#9DCED5",
	"#ECAD7E",
	"#EF6D6D",
	"#958EEA",
	"#54ACFD",
	"#7FB2CF",
	"#F4F084",
	"#B1F4E0",
	"#D6C4A9",
	"#DC5D7E",
	"#D7D7D7",
	"#83C29C",
	"#DCDD90",
	"#2398AB",
	"#CBE724",
	"#FFFCBB",
	"#F6DDDF",
	"#FFA96B",
	"#F375F3",
	"#BBC9DD",
	"#9D65F7",
	"#DF8976",
	"#F6DDDF",
	"#CBC76A",
	"#A13634",
];
interface ColorPickerProps {
	value: string;
	onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value);
	};

	return (
		<select
			className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			value={value}
			onChange={handleChange}
			style={{ backgroundColor: value }}
		>
			{options.map((color, index) => (
				<option key={index} value={color} style={{ backgroundColor: color }}>
					{color}
				</option>
			))}
		</select>
	);
};

interface TeamFormProps {
	defaultName?: string;
	defaultColor?: string;
	onSubmit: (name: string, color: string) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ defaultName, defaultColor, onSubmit }) => {
	const [name, setName] = useState(defaultName || "");
	const [color, setColor] = useState(defaultColor || "#F4E6B1");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!name || !color) {
			return;
		}
		onSubmit(name, color);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col align-middle">
			<div className="mt-3">
				<p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Название:</p>
				<input
					value={name}
					onChange={(event) => setName(event.target.value)}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					required
				/>
			</div>

			<div className="mt-3">
				<p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Цвет:</p>
				<ColorPicker value={color} onChange={setColor} />
			</div>

			<button
				type="submit"
				className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Сохранить
			</button>
		</form>
	);
};

export { TeamForm };
