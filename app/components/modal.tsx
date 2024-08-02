import { PropsWithChildren } from "react";

type ModalProps = PropsWithChildren & {
	className?: string;
	onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ className, onClose, children }) => {
	return (
		<div
			className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50"
			onClick={onClose}
		>
			<div
				className={`bg-white p-4 rounded ${className ? className : ""}`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};

export { Modal };
