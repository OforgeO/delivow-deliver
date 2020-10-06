import { BACKEND_URL } from './../constants/Global';
import * as SecureStore from 'expo-secure-store';
import { GoogleMapKey } from '../constants/Global'
import * as FileSystem from 'expo-file-system';
import { FileSystemUploadType } from "expo-file-system";

let base_url = BACKEND_URL;
let _headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function createCall(path, data = null, headers = {}, method = 'POST') {
    const merged = {
        ..._headers,
        ...headers
    };

    let body = {};
    if (data) {
        body = data;
    }
    let strData = JSON.stringify(body);

    if(method == 'POST')
        return fetch(
            `${base_url}${path}`, {
                method : method,
                headers: merged,
                body: strData,
            },
        ).then((resp) => resp.json());
    else if(method == 'GET')
        return fetch(
            `${base_url}${path}`, {
                method : method,
                headers: merged,
            },
        ).then((resp) => resp.json());
}
async function uploadImage(uri, link, phone, type){
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    
    const response = await FileSystem.uploadAsync(`${base_url}${link}`, uri, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        fieldName: type,
        mimeType: `image/${fileType}`,
        parameters: {
            phone
        }
    });
    
    return JSON.parse(response.body)
}


/* user */
export function registerSms(phone) {
    return createCall(
        'delivery/auth/register_sms',
        {phone},
    );
}
export function phoneVerify(phone) {
    return createCall(
        'delivery/auth/phone_verify',
        {phone},
    );
}
export function verifyCode(phone, verify_code) {
    return createCall(
        'delivery/auth/verify_code',
        {phone, verify_code},
    );
}
export function registerAccount(first_name, last_name, birthday, email, password, phone, address) {
    return createCall(
        'delivery/auth/register_account',
        {first_name, last_name, birthday, email, password, phone, address}
    );
}
export function resendCode(phone) {
    return createCall(
        'delivery/auth/resend_code',
        {phone},
    );
}

export function registerFace(uri, phone, type) {
    return uploadImage(uri, 'delivery/auth/register_face', phone, type)
}

export function registerVehicleType(phone, type) {
    return createCall(
        'delivery/auth/register_vehicle_type',
        {phone, type},
    );
}

export async function registerLicense(frontUri, backUri, number, expire_date, phone) {
    let uriFront = frontUri.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = backUri.split('.');
    let backType = uriBack[uriBack.length - 1];
    await FileSystem.uploadAsync(`${base_url}delivery/auth/register_license`, frontUri, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        fieldName: "license_front",
        mimeType: `image/${frontType}`,
        parameters: {
            phone, number, expire_date
        }
    });
    
    const response = await FileSystem.uploadAsync(`${base_url}delivery/auth/register_license`, backUri, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        fieldName: "license_back",
        mimeType: `image/${backType}`,
        parameters: {
            phone, number, expire_date
        }
    });
    
    return JSON.parse(response.body)
}

export async function registerVehicleImage(vehicle, number, phone) {
    let uriFront = vehicle.split('.');
    let frontType = uriFront[uriFront.length - 1];
    const response = await FileSystem.uploadAsync(`${base_url}delivery/auth/register_vehicle_image`, vehicle, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        fieldName: "vehicle",
        mimeType: `image/${frontType}`,
        parameters: {
            number, phone
        }
    });
    
    return JSON.parse(response.body)
}

export async function registerInsurance(liability_photo, voluntary_photo, liability_expire_date, voluntary_expire_date, phone) {
    let uriFront = liability_photo.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = voluntary_photo.split('.');
    let backType = uriBack[uriBack.length - 1];
    await FileSystem.uploadAsync(`${base_url}delivery/auth/register_insurance`, liability_photo, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        fieldName: "liability_photo",
        mimeType: `image/${frontType}`,
        parameters: {
            phone, liability_expire_date, voluntary_expire_date
        }
    });

    const response = await FileSystem.uploadAsync(`${base_url}delivery/auth/register_insurance`, voluntary_photo, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        fieldName: "voluntary_photo",
        mimeType: `image/${backType}`,
        parameters: {
            phone, liability_expire_date, voluntary_expire_date
        }
    });
    
    return JSON.parse(response.body)
}

export function registerArea(area, phone) {
    return createCall(
        'delivery/auth/register_area',
        {area, phone},
    );
}

export function registerBank(name, code, branch_code, account_number, account_name, account_full_name, phone) {
    return createCall(
        'delivery/auth/register_bank',
        {name, code, branch_code, account_number, account_name, account_full_name, phone},
    );
}

export async function registerBankPhoto(bank_front, bank_back, phone) {
    let uriFront = bank_front.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = bank_back.split('.');
    let backType = uriBack[uriBack.length - 1];
    await FileSystem.uploadAsync(`${base_url}delivery/auth/register_bank_photo`, bank_front, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        fieldName: "bank_front",
        mimeType: `image/${frontType}`,
        parameters: {
            phone
        }
    });

    const response = await FileSystem.uploadAsync(`${base_url}delivery/auth/register_bank_photo`, bank_back, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        fieldName: "bank_back",
        mimeType: `image/${backType}`,
        parameters: {
            phone
        }
    });
    
    return JSON.parse(response.body)
}

export function login(phone, password, push_id) {
    return createCall(
        'delivery/auth/login',
        {phone, password, push_id},
    );
}

export function forgot(email) {
    return createCall(
        'delivery/auth/forgot',
        {email},
    );
}

export function resetPassword(token, password) {
    return createCall(
        'delivery/auth/reset_password',
        {token, password},
    );
}

export function registerAreaShift(area, phone, shift) {
    return createCall(
        'delivery/auth/register_area_shift',
        {area, phone, shift},
    );
}

export async function getDeliveryInfos() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/get_delivery_infos',
        null, { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function getSalesData() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/get_sales_data',
        null, { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function updateLocation(lat, lng) {
    let token = await SecureStore.getItemAsync("token")
    if(token) {
        return createCall(
            'delivery/update_location',
            {lat, lng},
            { Authorization: 'Bearer '+token }
        );
    } else {
        return
    }
    
}

export async function getDepositHistory() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/get_deposit_history',
        null, { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function getReservationList() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/get_reservation_list',
        null, { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function getPolicy(type) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'get_policy?type='+type,
        null,
        { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function getHelpList(type) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'get_help_list',
        { type },
        { Authorization: 'Bearer '+token }
    );
}

export async function getHelpContent(id) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'get_help_content',
        { id },
        { Authorization: 'Bearer '+token }
    );
}

export async function updateAvatar(avatar) {
    let token = await SecureStore.getItemAsync("token")
    let uriFront = avatar.split('.');
    let frontType = uriFront[uriFront.length - 1];
    const response = await FileSystem.uploadAsync(`${base_url}delivery/user/update_avatar`, avatar, {
        uploadType: FileSystemUploadType.MULTIPART,
        httpMethod: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer '+token
        },
        fieldName: "avatar",
        mimeType: `image/${frontType}`,
        
    });
    
    return JSON.parse(response.body)

}

export async function updateName(first_name, last_name) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/update_name',
        { first_name, last_name },
        { Authorization: 'Bearer '+token }
    );
}

export async function updateEmail(email) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/update_email',
        { email },
        { Authorization: 'Bearer '+token }
    );
}

export async function updatePassword(password) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/update_password',
        { password },
        { Authorization: 'Bearer '+token }
    );
}

export async function updatePhone(phone) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/update_phone',
        { phone },
        { Authorization: 'Bearer '+token }
    );
}

export async function getShift() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/get_shift',
        null,
        { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function updateShift(shift) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/update_shift',
        { shift },
        { Authorization: 'Bearer '+token }
    );
}

export async function getOrderDetails(order_uid) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/get_order_details',
        { order_uid },
        { Authorization: 'Bearer '+token }
    );
}

export async function calcDistance(orgLat, orgLng, desLat, desLng, mode="driving") {
    return fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=${mode}&origins=${orgLat},${orgLng}&destinations=${desLat},${desLng}&key=${GoogleMapKey}`, {
            method : 'GET',
            headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        },
    ).then((resp) => resp.json())
    .catch((error) => {
    });
}

export async function confirmOrder(order_uid) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/confirm_order',
        { order_uid },
        { Authorization: 'Bearer '+token }
    );
}

export async function departStore(order_uid) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/depart_store',
        { order_uid },
        { Authorization: 'Bearer '+token }
    );
}

export async function completeDelivery(order_uid) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/complete_delivery',
        { order_uid },
        { Authorization: 'Bearer '+token }
    );
}

export async function getOrderLocations(order_uid) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/get_order_locations',
        { order_uid },
        { Authorization: 'Bearer '+token }
    );
}

export async function getWeeklyData() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/get_weekly_data',
        null,
        { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function getThisMonthHistory() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/get_this_month_history',
        null,
        { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function updateBankInfo(name, code, branch_code, account_number, account_name, account_full_name) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/update_bank_info',
        { name, code, branch_code, account_number, account_name, account_full_name },
        { Authorization: 'Bearer '+token }
    );
}

export async function getUser() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/get_user',
        null,
        { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function getCurrentOrders() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/get_current_orders',
        null,
        { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function setDeliveryStatus(status, start_time, end_time) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/set_delivery_status',
        { status, start_time, end_time },
        { Authorization: 'Bearer '+token }
    );
}

export async function updateVehicleType(type) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/user/update_vehicle_type',
        { type },
        { Authorization: 'Bearer '+token }
    );
}

export async function updateLicense(frontUri, backUri, number, expire_date) {
    let token = await SecureStore.getItemAsync("token")
    let response = null
    if(frontUri){
        let uriFront = frontUri.split('.');
        let frontType = uriFront[uriFront.length - 1];
        response = await FileSystem.uploadAsync(`${base_url}delivery/user/update_license`, frontUri, {
            uploadType: FileSystemUploadType.MULTIPART,
            httpMethod: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer '+token
            },
            fieldName: "license_front",
            mimeType: `image/${frontType}`,
            parameters: {
                number, expire_date
            }
        });
    }
    if(backUri) {
        let uriBack = backUri.split('.');
        let backType = uriBack[uriBack.length - 1];
        response = await FileSystem.uploadAsync(`${base_url}delivery/user/update_license`, backUri, {
            uploadType: FileSystemUploadType.MULTIPART,
            httpMethod: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer '+token
            },
            fieldName: "license_back",
            mimeType: `image/${backType}`,
            parameters: {
                number, expire_date
            }
        });
    }
    
    if(response)    
        return JSON.parse(response.body)
    else{
        let formData = new FormData();
        formData.append("number", number)
        formData.append("expire_date", expire_date)
        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'multipart/form-data',
                'Authorization' : 'Bearer ' + token
            }
        };
        return fetch(`${base_url}delivery/user/update_license`, options).then((resp) => resp.json());
    }
}

export async function updateInsurance(liability_photo, voluntary_photo, liability_expire_date, voluntary_expire_date) {
    let token = await SecureStore.getItemAsync("token")
    let response = null
    if(liability_photo) {
        let uriFront = liability_photo.split('.');
        let frontType = uriFront[uriFront.length - 1];
        response = await FileSystem.uploadAsync(`${base_url}delivery/user/update_insurance`, liability_photo, {
            uploadType: FileSystemUploadType.MULTIPART,
            httpMethod: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer '+token
            },
            fieldName: "liability_photo",
            mimeType: `image/${frontType}`,
            parameters: {
                liability_expire_date, voluntary_expire_date
            }
        });
    }
    if(voluntary_photo) {
        let uriBack = voluntary_photo.split('.');
        let backType = uriBack[uriBack.length - 1];
        response = await FileSystem.uploadAsync(`${base_url}delivery/user/update_insurance`, voluntary_photo, {
            uploadType: FileSystemUploadType.MULTIPART,
            httpMethod: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer '+token
            },
            fieldName: "voluntary_photo",
            mimeType: `image/${backType}`,
            parameters: {
                liability_expire_date, voluntary_expire_date
            }
        });
    }
    
    if(response)
        return JSON.parse(response.body)
    else {
        let formData = new FormData();
        formData.append("liability_expire_date", liability_expire_date)
        formData.append("voluntary_expire_date", voluntary_expire_date)
        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'multipart/form-data',
                'Authorization' : 'Bearer ' + token
            }
        };
        return fetch(`${base_url}delivery/user/update_insurance`, options).then((resp) => resp.json());
    }
}

export async function updateVehicleImage(vehicle, number) {
    let token = await SecureStore.getItemAsync("token")
    let response = null
    if(vehicle) {
        let uriFront = vehicle.split('.');
        let frontType = uriFront[uriFront.length - 1];
        response = await FileSystem.uploadAsync(`${base_url}delivery/user/update_vehicle_image`, vehicle, {
            uploadType: FileSystemUploadType.MULTIPART,
            httpMethod: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer '+token
            },
            fieldName: "vehicle",
            mimeType: `image/${frontType}`,
            parameters: {
                number
            }
        });
    }
    if(response)    
        return JSON.parse(response.body)
    else {
        let formData = new FormData();
        formData.append("number", number)
        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'multipart/form-data',
                'Authorization' : 'Bearer ' + token
            }
        };
        return fetch(`${base_url}delivery/user/update_vehicle_image`, options).then((resp) => resp.json());
    }
}

export async function sendNotification(author, target, message, order_uid) {
    return createCall(
        'customer/user/send_notification',
        {author, target, message, order_uid},
        null
    );
}

export function registerWithCustomer(phone) {
    return createCall(
        'delivery/auth/register_with_customer',
        {phone},
    );
}

export function makeVoice() {
    return createCall(
        'make_voice',
        {param: '', param2: ''},
    );
}

export async function logout() {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/auth/logout',
        null,
        { Authorization: 'Bearer '+token }, 'GET'
    );
}

export async function updateAddress(address) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/auth/update_address',
        { address },
        { Authorization: 'Bearer '+token }
    );
}

export async function updateArea(area) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/auth/update_area',
        { area },
        { Authorization: 'Bearer '+token }
    );
}

export async function getAreas() {
    return createCall(
        'customer/home/get_areas',
        null, null, 'GET'
    );
}

export async function updatePushToken(push_id) {
    let token = await SecureStore.getItemAsync("token")
    if(token) {
        return createCall(
            'delivery/update_push_token',
            { push_id },
            { Authorization: 'Bearer '+token }
        );
    } else {
        return;
    }
}

export async function updateTodayShift(start_time, end_time) {
    let token = await SecureStore.getItemAsync("token")
    return createCall(
        'delivery/update_today_shift',
        { start_time, end_time },
        { Authorization: 'Bearer '+token }
    );
}