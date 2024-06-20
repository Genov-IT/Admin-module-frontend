export let appURLs = {
    //web: 'http://localhost:4000/',
    // web: 'http://203.115.26.13:4000/',
    web: 'http://localhost:8090/api/v1/control-center'


}


export const webAPI = {

    /************************Stock API *********************************/
    insertStock: 'api/stock/insert',
    getallStockDetails: 'api/stock/get-all-stock-items',
    updateStock: 'api/stock/update-stock/',
    deleteStockData: 'api/stock/delete-stock/',


    /************************Booking API *********************************/
    insertBooking: 'api/booking/insert',
    getallBookingDetails: 'api/booking/view/all-bookings',
    updateBooking: 'api/booking/update-booking/',
    deleteBookingData: 'api/booking/delete-booking/',
    viewBookingById: 'api/booking/view/',


    /************************CNP ADMIN *********************************/

    /************************ Login *********************************/
    login: '/login',
    staffCreate: '/staff-management/staff',
    staffUpdate: '/staff-management/staff/',
    getStaffById: '/staff-management/staff/',
    contactVerification: '/staff-management/contact/generate-otp',
    otpVerification: '/staff-management/contact/validate-otp',
    verificationLikeExpired : '/verification/check-verification-expiration/email/',
    userVerificationEmail :'/staff-management/verification/email/',
    passwordUpdate:'/user/change-password/forget',

    /************************ Ref Enums *********************************/
    enum: '/lov/values',
    getAllResources: '/faste/resources',
    advanceSearch: '/faste/advanced-search',
    refContracts: '/faste/contract/',
    fasteFindeAll :'/faste/',

    /************************ DMS *********************************/
    fileUpload: '/dms-service/upload',
    fileDelete: '/dms-service/delete',


    /************************CNP ADMIN *********************************/






















    /************************ All Circulars API *********************************/

    getAllCirculars: 'upload/',


    /************************ PDF File Upload API *********************************/

    pdfFileInsert: 'upload/',
    pdfFileDelete: 'upload/',
    pdfFileUpdate: 'upload/',

    /************************ User API *********************************/
    // login: 'user/login',
    userInsert: 'user/register',
    getAllUsers: 'user/',
    updateUser: 'user/',
    deleteUser: 'user/',
    getUserById: 'user/',


    /************************QMS PDF File Upload API *********************************/

    qmsPdfFileInsert: 'QMS-upload/',
    qmsPdfFileDelete: 'QMS-upload/',
    qmsGetAllCirculars: 'QMS-upload/',
    qmsPdfFileUpdate: 'QMS-upload/',
    viewAllByDocumentLevel: 'QMS-upload/viewAllByDocumentLevel',
    getFileUploadById: 'QMS-upload/getFileUploadById/',

    /************************User Logs API *********************************/

    viewAllLogs: 'log/',
    insertAllLogs: 'log/',
    updateLogs: 'log/',


}