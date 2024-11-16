import "./ReportForm.css";
import { useState } from "react";
const ReportForm = ({ setPage }: { setPage: (page: string) => void }) => {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = () => {
        console.log(subject, description, productName, price, date);
        localStorage.setItem("reportSubject", subject);
        localStorage.setItem("reportDescription", description);
        localStorage.setItem("reportProductName", productName);
        localStorage.setItem("reportPrice", price);
        localStorage.setItem("reportDate", date);
        setPage("home");
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
                <button className="report-form-button" onClick={handleSubmit}>Submit</button>
                <button className="report-form-white-button" onClick={() => setPage("home")}>Back</button>
            </div>
        </>
    )
}

export default ReportForm;