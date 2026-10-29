import React from 'react';

// Tournament standard vector chess pieces (clean, high-detail SVG)
export const ChessPiece = ({ type, color, size = '100%', className = '' }) => {
  const pieceKey = `${color}${type.toUpperCase()}`;

  switch (pieceKey) {
    // WHITE PIECES
    case 'wK':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="none" fillRule="evenodd" stroke="#161512" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter" stroke="#fff" strokeWidth="1.5" />
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#f8fafc" stroke="#1e293b" />
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#f8fafc" stroke="#1e293b" />
            <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#1e293b" />
          </g>
        </svg>
      );
    case 'wQ':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="#f8fafc" fillRule="evenodd" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm16.5 4.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-27 2.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm21 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-6-14-2.5 14-2.5-14-6 14-7-11 2 12z" strokeLinecap="butt" />
            <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt" />
            <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" strokeLinecap="butt" />
            <path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0" fill="none" />
          </g>
        </svg>
      );
    case 'wR':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="#f8fafc" fillRule="evenodd" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm1.5-4.5l1.5-11.5h15l1.5 11.5H13.5zM11 14h23l-2 6H13l-2-6z" strokeLinejoin="miter" />
            <path d="M12 14v-4h3v2h5v-2h5v2h5v-2h3v4H12z" strokeLinejoin="miter" />
            <path d="M12 36h21m-19.5-4.5h18m-17-7.5h16" fill="none" />
          </g>
        </svg>
      );
    case 'wB':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="none" fillRule="evenodd" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#f8fafc" strokeLinecap="butt">
              <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
              <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
              <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
            </g>
            <path d="M17.5 26h10M15 30h15m-7.5-14.5v5m-3-2.5h6" strokeLinejoin="miter" />
          </g>
        </svg>
      );
    case 'wN':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="none" fillRule="evenodd" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#f8fafc" />
            <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.64 1.42-1.5 1-1.5-.74.1-2 2-3.5 1.8-1.4-1.3-2.2-1-3.5.3-1.4 1.3-1.4 2-2.5 1.2-1.9-.3-3.6 1.5-4.5 1.7-.8 1.9-1.9 3.5-2 1.6-.2 3 .2 4.5.5z" fill="#f8fafc" />
            <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5-9a1 1 0 1 1-2 0 1 1 0 1 1 2 0z" fill="#1e293b" />
            <path d="M24.55 10.4s-1.5 1.5-2 3.5M30.5 13.5s-2 1.5-2 4.5" fill="none" />
          </g>
        </svg>
      );
    case 'wP':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    // BLACK PIECES
    case 'bK':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="none" fillRule="evenodd" stroke="#161512" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter" stroke="#fff" />
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#262421" stroke="#fff" />
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#262421" stroke="#fff" />
            <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff" />
          </g>
        </svg>
      );
    case 'bQ':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="#262421" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm16.5 4.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-27 2.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm21 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-6-14-2.5 14-2.5-14-6 14-7-11 2 12z" strokeLinecap="butt" />
            <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt" />
            <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" strokeLinecap="butt" stroke="#fff" />
            <path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0" fill="none" stroke="#fff" />
          </g>
        </svg>
      );
    case 'bR':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="#262421" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm1.5-4.5l1.5-11.5h15l1.5 11.5H13.5zM11 14h23l-2 6H13l-2-6z" strokeLinejoin="miter" />
            <path d="M12 14v-4h3v2h5v-2h5v2h5v-2h3v4H12z" strokeLinejoin="miter" />
            <path d="M12 36h21m-19.5-4.5h18m-17-7.5h16" fill="none" stroke="#fff" />
          </g>
        </svg>
      );
    case 'bB':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="none" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#262421" strokeLinecap="butt">
              <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
              <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
              <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
            </g>
            <path d="M17.5 26h10M15 30h15m-7.5-14.5v5m-3-2.5h6" strokeLinejoin="miter" stroke="#fff" />
          </g>
        </svg>
      );
    case 'bN':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <g fill="none" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#262421" />
            <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.64 1.42-1.5 1-1.5-.74.1-2 2-3.5 1.8-1.4-1.3-2.2-1-3.5.3-1.4 1.3-1.4 2-2.5 1.2-1.9-.3-3.6 1.5-4.5 1.7-.8 1.9-1.9 3.5-2 1.6-.2 3 .2 4.5.5z" fill="#262421" />
            <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5-9a1 1 0 1 1-2 0 1 1 0 1 1 2 0z" fill="#fff" />
            <path d="M24.55 10.4s-1.5 1.5-2 3.5M30.5 13.5s-2 1.5-2 4.5" fill="none" stroke="#fff" />
          </g>
        </svg>
      );
    case 'bP':
      return (
        <svg viewBox="0 0 45 45" width={size} height={size} className={className}>
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill="#262421"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

