const Button =({
    children,
    type = "button",
    onClick,
    variant ="primary",
    disabled = false,
    className =""
}) => {
    const variants ={
        primary:
        "bg-[#18B86A] text-white hover:bg-[#123B78] focus:ring-green-100",
        secondary:
        "bg-[#18B86A] text-white hover:bg-[#123B78] focus:ring-green-100",
        danger:
        "bg-[#18B86A] text-white hover:bg-[#123B78] focus:ring-green-100",
        blue:
        "bg-[#18B86A] text-white hover:bg-[#123B78] focus:ring-green-100",

    }
    return(
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                rounded-xl px-5 py-3
                font-semibold
                transition-all duration-200 
                focus:outline-none  focus:ring-4
                disabled:opacity-50
                ${variants[variant]}
                ${className}
                
        `}
        >
        {children}
        </button>
    );
}
export default Button;
