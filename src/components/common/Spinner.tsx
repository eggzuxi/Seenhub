import React from 'react';

interface SpinnerProps {
    size?: number;
    color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, color = '#3498db' }) => {
    const spinnerStyle: React.CSSProperties = {
        border: `${size / 10}px solid #f3f3f3`,
        borderTop: `${size / 10}px solid ${color}`,
        borderRadius: '50%',
        width: `${size}px`,
        height: `${size}px`,
        animation: 'spin 2s linear infinite',
    };

    const styleSheet = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    return (
        <>
            <style>{styleSheet}</style>
            <div style={spinnerStyle} />
        </>
    );
};

export default Spinner;