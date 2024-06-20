import Notification from "../component/Notification/CustomNotification ";
import {NotificationPlacement, NotificationType} from "../enums/constants";


function generateError(error) {
    if (error.response?.data?.errors) {
        const errorList = error.response?.data?.errors;
        errorList?.forEach(singleError => {
            const errorMessage = singleError?.error + " for value " + singleError.value;
            Notification.error(NotificationType.ERROR, errorMessage, NotificationPlacement.TOP_RIGHT);
        });
    } else {
        Notification.error(NotificationType.ERROR, error?.response?.data.message, NotificationPlacement.TOP_RIGHT);
    }
}

export default generateError;
