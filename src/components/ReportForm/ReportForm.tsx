import "./ReportForm.css";

const ReportForm = ({ setPage }: { setPage: (page: string) => void }) => {
    return (
        <>
            <h1 className="report-form-title">ReportForm</h1>
            <div className="report-form-container">
                <label className="report-form-label">Subject</label>
                <input type="text" placeholder="Subject" className="report-form-input" />
                <label className="report-form-label">Description</label>
                <input type="text" placeholder="Description" className="report-form-input" />
                <label className="report-form-label">Product Name</label>
                <input type="text" placeholder="Product Name" className="report-form-input" />
                <label className="report-form-label">Price</label>
                <input type="text" placeholder="Price" className="report-form-input" />
                <label className="report-form-label">Date</label>
                <input type="text" placeholder="Date" className="report-form-input" />
                <button className="report-form-button">Submit</button>
                <button className="report-form-white-button" onClick={() => setPage("home")}>Back</button>
            </div>
        </>
    )
}

export default ReportForm;