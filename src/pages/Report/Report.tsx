import Navbar from "../../components/Navbar/Navbar";
import ReportForm from "../../components/ReportForm/ReportForm";
import { chainConfig } from "../../constant/constant";

const Report = ({ setPage, chainId, web3auth }: { setPage: (page: string) => void, chainId: string, web3auth: any }) => {
    return (
        <div className="report-container">
            <Navbar setPage={setPage} action="report" blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} chainId={chainId} web3auth={web3auth} />
            <ReportForm setPage={setPage} />
        </div>
    )
}

export default Report;