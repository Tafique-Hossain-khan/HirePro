import PropTypes from 'prop-types';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <span
            className={`text-textColor/25 bg-clip-text bg-black inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration: animationDuration,
            }}
        >
            {text}
        </span>
    );
};
ShinyText.propTypes = {
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    speed: PropTypes.number,
    className: PropTypes.string,
};

export default ShinyText;