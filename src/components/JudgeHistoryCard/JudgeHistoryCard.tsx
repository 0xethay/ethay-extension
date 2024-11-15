import React from 'react';
import './JudgeHistoryCard.css';

interface JudgeHistoryCardProps {
    image: string;
    subject: string;
    description: string;
    productName: string;
    price: string;
    date: string;
    progress: number;
    status: 'success' | 'pending' | 'failed';
    onClaim?: () => void;
}

const JudgeHistoryCard: React.FC<JudgeHistoryCardProps> = ({
    image,
    subject,
    description,
    productName,
    price,
    date,
    progress,
    status,
    onClaim
}) => {
    return (
        <div className="judge-card">
            <div className="judge-box">
                <div className="judge-icon">
                    <div className="judge-image">
                        <img
                            src={
                                "https://cdn.pixabay.com/photo/2020/09/28/04/44/hippopotamus-5608509_1280.jpg"
                            }
                            alt="tx-icon"
                            className="product-image"
                        />
                    </div>
                </div>
                <div className="judge-info">
                    <p style={{ fontWeight: "bold" }}>Subject: {subject}</p>
                    <p>Description: {description}</p>
                    <p>Product Name: {productName}</p>
                    <p>Price: {price}</p>
                    <p>Date: {date}</p>
                    <div className="progress-section">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{progress}/100</span>
                    </div>
                    <div className="status-badge">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: status === 'success' ? '#34D399' : status === 'pending' ? '#FFAB00' : '#FF5630',
                                    borderRadius: "50%",
                                    marginRight: "5px",
                                }}
                            ></div>
                            <span>{status}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                }}
            >
                <div
                    style={{
                        width: "95%",
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                    }}
                >
                    <button style={{ width: "100%", backgroundColor: status !== 'success' ? 'gray' : 'black', cursor: status !== 'success' ? 'not-allowed' : 'pointer' }} onClick={onClaim} disabled={status !== 'success'}>Claim</button>
                </div>
            </div>
        </div>
    );
};

export default JudgeHistoryCard;