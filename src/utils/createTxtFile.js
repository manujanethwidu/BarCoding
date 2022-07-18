import localHost from '../apis/printerHost'
import { notifyError, notifySuccessQk, notifyWarning } from './toastify'


const CreateTxtFile = ({
    sn,dom,barcode
}) => {
    try {
        //Update Stock Table
        const updateStockTbl =  localHost.post(`/txt/append`, {
             
            barcode,
            sn,
            dom,
        });
        if (updateStockTbl?.data?.error) {
            return notifyError(updateStockTbl.data.error)
        }
    } catch (err) {
        notifyError(err.message)
    }
}
export default CreateTxtFile