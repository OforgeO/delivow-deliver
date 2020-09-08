import { BACKEND_URL } from './../constants/Global';
import * as SecureStore from 'expo-secure-store';
import { GoogleMapKey } from '../constants/Global'
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
function uploadImage(uri, link, phone, type){
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    
    let formData = new FormData();
    formData.append(type, {
        uri: uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
    });
    formData.append('phone', phone)
    
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    };
    return fetch(`${base_url}${link}`, options).then((resp) => resp.json());
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

export function registerLicense(frontUri, backUri, number, expire_date, phone) {
    let uriFront = frontUri.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = backUri.split('.');
    let backType = uriBack[uriBack.length - 1];
    
    let formData = new FormData();
    if(frontUri){
        formData.append('license_front', {
            uri: frontUri,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    if(backUri){
        formData.append('license_back', {
            uri: backUri,
            name: `photo.${backType}`,
            type: `image/${backType}`,
        });
    }
    
    formData.append('phone', phone)
    formData.append('number', number)
    formData.append('expire_date', expire_date)
    
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    };
    return fetch(`${base_url}delivery/auth/register_license`, options).then((resp) => resp.json());
}

export function registerVehicleImage(vehicle, number, phone) {
    let uriFront = vehicle.split('.');
    let frontType = uriFront[uriFront.length - 1];
    
    let formData = new FormData();
    if(vehicle){
        formData.append('vehicle', {
            uri: vehicle,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    
    formData.append('phone', phone)
    formData.append('number', number)
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    };
    return fetch(`${base_url}delivery/auth/register_vehicle_image`, options).then((resp) => resp.json());
}

export function registerInsurance(liability_photo, voluntary_photo, liability_expire_date, voluntary_expire_date, phone) {
    let uriFront = liability_photo.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = voluntary_photo.split('.');
    let backType = uriBack[uriBack.length - 1];
    
    let formData = new FormData();
    if(liability_photo){
        formData.append('liability_photo', {
            uri: liability_photo,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    if(voluntary_photo){
        formData.append('voluntary_photo', {
            uri: voluntary_photo,
            name: `photo.${backType}`,
            type: `image/${backType}`,
        });
    }
    
    formData.append('phone', phone)
    formData.append('liability_expire_date', liability_expire_date)
    formData.append('voluntary_expire_date', voluntary_expire_date)
    
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    };
    return fetch(`${base_url}delivery/auth/register_insurance`, options).then((resp) => resp.json());
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

export function registerBankPhoto(bank_front, bank_back, phone) {
    let uriFront = bank_front.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = bank_back.split('.');
    let backType = uriBack[uriBack.length - 1];
    
    let formData = new FormData();
    if(bank_front){
        formData.append('bank_front', {
            uri: bank_front,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    if(bank_back){
        formData.append('bank_back', {
            uri: bank_back,
            name: `photo.${backType}`,
            type: `image/${backType}`,
        });
    }
    
    formData.append('phone', phone)
    
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    };
    return fetch(`${base_url}delivery/auth/register_bank_photo`, options).then((resp) => resp.json());
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
    
    let formData = new FormData();
    if(avatar){
        formData.append('avatar', {
            uri: avatar,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer '+token
        },
    };
    return fetch(`${base_url}delivery/user/update_avatar`, options).then((resp) => resp.json());
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
    let uriFront = frontUri.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = backUri.split('.');
    let backType = uriBack[uriBack.length - 1];
    
    let formData = new FormData();
    if(frontUri){
        formData.append('license_front', {
            uri: frontUri,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    if(backUri){
        formData.append('license_back', {
            uri: backUri,
            name: `photo.${backType}`,
            type: `image/${backType}`,
        });
    }
    
    formData.append('number', number)
    formData.append('expire_date', expire_date)
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer '+token
        },
    };
    return fetch(`${base_url}delivery/user/update_license`, options).then((resp) => resp.json());
}

export async function updateInsurance(liability_photo, voluntary_photo, liability_expire_date, voluntary_expire_date) {
    let token = await SecureStore.getItemAsync("token")
    let uriFront = liability_photo.split('.');
    let frontType = uriFront[uriFront.length - 1];
    let uriBack = voluntary_photo.split('.');
    let backType = uriBack[uriBack.length - 1];
    
    let formData = new FormData();
    if(liability_photo){
        formData.append('liability_photo', {
            uri: liability_photo,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    if(voluntary_photo){
        formData.append('voluntary_photo', {
            uri: voluntary_photo,
            name: `photo.${backType}`,
            type: `image/${backType}`,
        });
    }
    
    formData.append('liability_expire_date', liability_expire_date)
    formData.append('voluntary_expire_date', voluntary_expire_date)
    
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer '+token
        },
    };
    return fetch(`${base_url}delivery/user/update_insurance`, options).then((resp) => resp.json());
}

export async function updateVehicleImage(vehicle, number) {
    let token = await SecureStore.getItemAsync("token")
    let uriFront = vehicle.split('.');
    let frontType = uriFront[uriFront.length - 1];
    
    let formData = new FormData();
    if(vehicle){
        formData.append('vehicle', {
            uri: vehicle,
            name: `photo.${frontType}`,
            type: `image/${frontType}`,
        });
    }
    
    formData.append('number', number)
    let options = {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer '+token
        },
    };
    return fetch(`${base_url}delivery/user/update_vehicle_image`, options).then((resp) => resp.json());
}

export async function sendNotification(author, target, message, order_uid) {
    return createCall(
        'customer/user/send_notification',
        {author, target, message, order_uid},
        null
    );
}