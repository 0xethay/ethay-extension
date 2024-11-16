import React from 'react';
import './JudgeHistoryCard.css';
import externalLinkIcon from '../../icons/external-link.png';
interface JudgeHistoryCardProps {
    subject: string;
    description: string;
    productName: string;
    price: string;
    date: string;
    progress: number;
    productId: string;
    purchaseId: string;
    ipfsLink: string;
    status: 'success' | 'pending' | 'failed';
    onClaim?: () => void;
    blockExplorerUrl: string;
}

const JudgeHistoryCard: React.FC<JudgeHistoryCardProps> = ({
    subject,
    description,
    productName,
    price,
    date,
    progress,
    status,
    productId,
    purchaseId,
    ipfsLink,
    onClaim,
    blockExplorerUrl
}) => {
  
    const formatTx = (tx: string) => {
        return tx.substring(0, 10) + '...' + tx.substring(tx.length - 10);
    }
    console.log("ipfsLink", `https://ipfs.io/ipfs/${ipfsLink}`)
    return (
        <div className="judge-card">
            <div className="judge-box">
                <div className="judge-icon">
                    <div className="judge-image">
                        <img
                            src={
                                `https://ipfs.io/ipfs/${ipfsLink}`
                            }
                            alt="tx-icon"
                            className="product-image"
                        />
                    </div>
                </div>
                <div className="judge-info">
                    <p style={{ fontWeight: "bold" }}>Subject: {subject}</p>
                    <p>Tx: <a href={`${blockExplorerUrl}tx/${productId}`} target="_blank" rel="noopener noreferrer">{formatTx(productId)} <img src={externalLinkIcon} style={{ width: "12px", height: "12px", cursor: "pointer" }} alt="external-link-icon" className="external-link-icon" /></a></p>
                    <p>ID: {purchaseId}</p>
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
        </div>
    );
};

export default JudgeHistoryCard;