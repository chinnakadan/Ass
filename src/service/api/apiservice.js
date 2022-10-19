import React from 'react';
//const BASE_URL = 'http://13.232.196.255/mobileapp2.0/public/application'
const BASE_URL = 'http://15.206.74.72/mobileapp/public/application'
//const BASE_URL = 'http://192.168.1.86/mobileapp2.0/public/application'
// LoginScreen
export const LoginRequest = async (bodydata) => {
    try {
        const response = await fetch(`${BASE_URL}/commonio/checkuserdetailsweb`,
            {
                method: 'POST',
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
// RegisterSceen
export const RegisterRequest = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/commonio/getappinfo`,
            {
                method: 'POST',
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const getDashBoardList = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/getdashboardlist`,
            {
                method: 'POST',
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Maintentance = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/maintenance`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Idle = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/idle`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Stock = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/stock`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Issue = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/issue`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Transfer = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/transfer`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Inward = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/inward`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Usage = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/asset/usage`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Make = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/production/make`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Pdispatch = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/production/pdispatch`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Preceipt = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/production/preceipt`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const Template = async (bodydata) => {
    try {
        const response = await fetch(
            `${BASE_URL}/template/asset`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(bodydata),
            },
        )
        return response;
    } catch (e) {
        console.log(e)
    }
}