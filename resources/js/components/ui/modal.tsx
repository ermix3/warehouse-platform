import React from 'react';


type Props =  {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode
}

export function Modal({ show, onClose, children }:Readonly<Props>)
{
    if (!show) return null;

    return (
        <div
            className="modal-backdrop"
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
        >
            <div
                className="modal"
                style={{
                    background: '#fff',
                    color: '#333',
                    margin: '5% auto',
                    padding: 20,
                    maxWidth: 500,
                    borderRadius: 8,
                    position: 'relative',
                }}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

