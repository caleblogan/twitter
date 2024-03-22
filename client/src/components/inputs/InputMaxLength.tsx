type InputMaxLengthProps = {
    max: number
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export default function InputMaxLength({ max, value, onChange }: InputMaxLengthProps) {
    return (
        <div className="relative">
            <input
                value={value}
                onChange={onChange}
                type="text" maxLength={max} className="w-full h-11 border border-solid rounded-md p-2 mt-1 pr-10" placeholder="name@example.com" />
            <div className="absolute top-4 right-4">
                {max - value.length}
            </div>
        </div>
    )
}