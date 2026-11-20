type Props = {
	name: string;
	size?: number;
	error?: boolean
};

export default function Icon({ name, size = 20, error = false }: Props) {
	return (
		<span className={"material-symbols-outlined"+(error?" error":"")} style={{ fontSize: size }} aria-hidden="true">
			{name}
		</span>
	);
}