const MedalIcon = (props) => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props} // позволяет передавать className и прочее
    >
        <path d="M14.2718 10.445L18 2" />
        <path d="M9.31612 10.6323L5 2" />
        <path d="M12.7615 10.0479L8.835 2" />
        <path d="M14.36 2L13.32 4.5" />
        <path d="M6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10C8.68629 10 6 12.6863 6 16Z" />
    </svg>
);

export default MedalIcon;
