import "./ReportForm.css";
import { useState } from "react";
import { ethers } from "ethers";
import { ethayContractAddress } from "../../constant/constant";

const ReportForm = ({ setPage, web3auth }: { setPage: (page: string) => void, web3auth: any }) => {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async () => {
        console.log(subject, description, productName, price, date);
        localStorage.setItem("reportSubject", subject);
        localStorage.setItem("reportDescription", description);
        localStorage.setItem("reportProductName", productName);
        localStorage.setItem("reportPrice", price);
        localStorage.setItem("reportDate", date);
        await report();
        setPage("home");
    }

    const report = async () => {
        const provider = new ethers.BrowserProvider(web3auth.provider);
        const signer = await provider.getSigner();
        const abi = [{
            inputs: [
                {
                    internalType: "uint256",
                    name: "_productId",
                    type: "uint256"
                },
                {
                    internalType: "uint256",
                    name: "_purchaseId",
                    type: "uint256"
                }
            ],
            name: "raiseDispute",
            outputs: [],
            stateMutability: "payable",
            type: "function"
        }]
        console.log(localStorage.getItem("reportProductId"), localStorage.getItem("reportPurchaseId"))
        const contract = new ethers.Contract(ethayContractAddress, abi, signer);
        const data = localStorage.getItem("reportPurchaseId");

        if (data !== null) {
          const parts = data.split('-');
          const reportProductId = Number(parts[0]);
          const reportPurchaseId = Number(parts[1]);
          console.log("reportProductId", reportProductId);
          console.log("reportPurchaseId", reportPurchaseId);
          const tx = await contract.raiseDispute(reportProductId, reportPurchaseId);
          const receipt = await tx.wait();
          console.log("receipt",receipt);
        } else {
          console.error("No reportProductId found in localStorage.");
        }
    }

    return (
        <>
            <h1 className="report-form-title">ReportForm</h1>
            <div className="report-form-container">
                <label className="report-form-label">Subject</label>
                <input type="text" placeholder="Subject" className="report-form-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <label className="report-form-label">Description</label>
                <input type="text" placeholder="Description" className="report-form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                <label className="report-form-label">Product Name</label>
                <input type="text" placeholder="Product Name" className="report-form-input" value={productName} onChange={(e) => setProductName(e.target.value)} />
                <label className="report-form-label">Price</label>
                <input type="text" placeholder="Price" className="report-form-input" value={price} onChange={(e) => setPrice(e.target.value)} />
                <label className="report-form-label">Date</label>
                <input type="date" placeholder="Date" className="report-form-input" value={date} onChange={(e) => setDate(e.target.value)} />
                <button className="report-form-button" onClick={handleSubmit} disabled={!subject || !description || !productName || !price || !date}>Submit</button>
                <button className="report-form-white-button" onClick={() => setPage("home")}>Back</button>
            </div>
        </>
    )
}

export default ReportForm;