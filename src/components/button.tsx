import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  colorScheme: 'black' | 'white'; // New prop for color scheme
}

const Button: React.FC<ButtonProps> = ({ text, onClick, colorScheme }) => {
  return (
    <>
      <button className={`custom-button ${colorScheme}`} onClick={onClick}>
        {text}
      </button>
      <style jsx>{`
        .custom-button {
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          font-family: 'Roboto', sans-serif;
          cursor: pointer;
          outline: none;
          border-radius: 5px;
          transition: background-color 0.3s, transform 0.1s;
          margin: 10px;
        }
        .custom-button.black {
          background-color: black;
          color: white;
        }
        .custom-button.white {
          background-color: white;
          color: black;
          border: 1px solid black;
        }
        .custom-button.black:hover, .custom-button.black:focus {
          background-color: #333333;
        }
        .custom-button.white:hover, .custom-button.white:focus {
          background-color: #f5f5f5;
        }
      `}</style>
    </>
  );
};

export default Button;
